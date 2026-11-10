import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createHmac } from 'node:crypto'
import { verifySignature,createBillingHandler } from '../billing.mjs'
test('signature uses raw bytes, supports rotation, and rejects old or altered events',()=>{
 const now=1700000000000, raw='{"id":"evt_1"}',secret='test'
 const signature=createHmac('sha256',secret).update(`1700000000.${raw}`).digest('hex')
 verifySignature(raw,`t=1700000000,v1=${'0'.repeat(64)},v1=${signature}`,secret,now)
 assert.throws(()=>verifySignature(raw+' ',`t=1700000000,v1=${signature}`,secret,now))
 assert.throws(()=>verifySignature(raw,`t=1700000000,v1=${signature}`,secret,now+301000))
})
test('unconfigured provider gives setup-required state without network calls',async()=>{
 const handler=createBillingHandler({env:{},fetchImpl:()=>{throw Error('unexpected')}})
 const response=await handler(new Request('https://app.example/api/billing/setup',{method:'POST'}),'setup')
 assert.equal(response.status,503)
 assert.equal((await response.json()).configured,false)
})
test('provider calls cannot precede brand access verification',async()=>{
 const calls=[]
 const handler=createBillingHandler({env:{SUPABASE_URL:'https://db.example',SUPABASE_ANON_KEY:'public',SUPABASE_SERVICE_ROLE_KEY:'service',STRIPE_SECRET_KEY:'stripe',APP_PUBLIC_URL:'https://app.example',STRIPE_WEBHOOK_SECRET:'webhook'},fetchImpl:async(url)=>{calls.push(String(url));return {ok:false,status:403}}})
 const response=await handler(new Request('https://app.example/api/billing/setup',{method:'POST',headers:{Authorization:'Bearer member'},body:JSON.stringify({org_id:'20000000-0000-0000-0000-000000000001'})}),'setup')
 assert.equal(response.status,403)
 assert.equal(calls.length,1)
 assert.ok(calls[0].startsWith('https://db.example/'))
})
const configuredEnv={SUPABASE_URL:'https://db.example',SUPABASE_ANON_KEY:'public',SUPABASE_SERVICE_ROLE_KEY:'service',STRIPE_SECRET_KEY:'stripe',APP_PUBLIC_URL:'https://app.example',STRIPE_WEBHOOK_SECRET:'webhook'}
test('setup checks membership, creates one idempotent customer and returns hosted checkout',async()=>{
 const calls=[]
 const handler=createBillingHandler({env:configuredEnv,fetchImpl:async(url,options)=>{
  const path=new URL(url).pathname;calls.push({path,options})
  let data={}
  if(path==='/rest/v1/rpc/web_billing_customer') data=JSON.parse(options.body).customer?{customer:'cus_fixture'}:{}
  if(path==='/v1/customers') {assert.equal(options.headers['Idempotency-Key'],'org-customer:20000000-0000-0000-0000-000000000001');data={id:'cus_fixture'}}
  if(path==='/v1/checkout/sessions') {assert.equal(options.body.get('mode'),'setup');assert.equal(options.body.get('success_url'),'https://app.example/manage/billing');data={url:'https://checkout.stripe.com/c/pay/fixture'}}
  return {ok:true,json:async()=>data}
 }})
 const response=await handler(new Request('https://app.example/api/billing/setup',{method:'POST',headers:{Authorization:'Bearer member'},body:JSON.stringify({org_id:'20000000-0000-0000-0000-000000000001'})}),'setup')
 assert.equal(response.status,200)
 assert.equal((await response.json()).url,'https://checkout.stripe.com/c/pay/fixture')
 assert.deepEqual(calls.map(c=>c.path),['/rest/v1/rpc/web_page_snapshot','/rest/v1/rpc/web_billing_customer','/v1/customers','/rest/v1/rpc/web_billing_customer','/v1/checkout/sessions'])
 assert.equal(calls[0].options.headers.Authorization,'Bearer member')
})
test('signed webhook retrieves current provider state before the service-only write',async()=>{
 const calls=[],stamp=Math.floor(Date.now()/1000)
 const event={id:'evt_fixture',type:'invoice.updated',created:stamp,data:{object:{id:'in_fixture',customer:'cus_fixture',status:'open'}}}
 const raw=JSON.stringify(event)
 const signature=createHmac('sha256','webhook').update(`${stamp}.${raw}`).digest('hex')
 const handler=createBillingHandler({env:configuredEnv,fetchImpl:async(url,options)=>{
  calls.push({url:String(url),options})
  if(String(url).includes('api.stripe.com')) {assert.equal(options.method,'GET');return {ok:true,json:async()=>({id:'in_fixture',customer:'cus_fixture',status:'paid'})}}
  assert.equal(options.headers.Authorization,'Bearer service')
  assert.equal(JSON.parse(options.body).event.data.object.status,'paid')
  return {ok:true,json:async()=>({processed:true})}
 }})
 const request=()=>new Request('https://app.example/api/billing/webhook',{method:'POST',headers:{'stripe-signature':`t=${stamp},v1=${signature}`},body:raw})
 assert.equal((await handler(request(),'webhook')).status,200)
 assert.equal(calls.length,2)
 assert.equal(calls[0].url,'https://api.stripe.com/v1/invoices/in_fixture')
 const bad=await handler(new Request('https://app.example/api/billing/webhook',{method:'POST',body:raw}),'webhook')
 assert.equal(bad.status,400)
 assert.equal(calls.length,2)
})
