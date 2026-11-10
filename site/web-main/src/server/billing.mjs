import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
export function verifySignature(body, header, secret, now = Date.now()) {
  const parts = (header || '').split(',').map(x => x.split('='))
  const stamp = parts.find(x => x[0] === 't')?.[1]
  if (!secret || !/^\d+$/.test(stamp || '') || Math.abs(now / 1000 - Number(stamp)) > 300) throw new Error('Invalid webhook signature')
  const expected = createHmac('sha256', secret).update(`${stamp}.${body}`).digest()
  if (!parts.filter(x => x[0] === 'v1' && /^[a-f0-9]{64}$/.test(x[1] || '')).some(x => timingSafeEqual(expected, Buffer.from(x[1], 'hex')))) throw new Error('Invalid webhook signature')
}
export function createBillingHandler({ env = process.env, fetchImpl = fetch } = {}) {
  const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL
  const publicKey = env.SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_KEY
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY
  const stripeKey = env.STRIPE_SECRET_KEY
  const configured = () => url && publicKey && serviceKey && stripeKey && env.APP_PUBLIC_URL && env.STRIPE_WEBHOOK_SECRET
  async function rpc(name, body, token, key = publicKey) {
    const res = await fetchImpl(new URL(`/rest/v1/rpc/${name}`, url), {method:'POST',signal:AbortSignal.timeout(20000),headers:{apikey:key,Authorization:`Bearer ${token}`,'Content-Type':'application/json','Content-Profile':'stats_rpc','Accept-Profile':'stats_rpc'},body:JSON.stringify(body)})
    if (!res.ok) throw Object.assign(new Error('Request not permitted or backend unavailable'),{status:res.status===401||res.status===403?403:502})
    return res.json()
  }
  async function stripe(path, body, key, method = 'POST') {
    const response = await fetchImpl(`https://api.stripe.com/v1/${path}`, {method,signal:AbortSignal.timeout(20000),headers:{Authorization:`Bearer ${stripeKey}`,'Content-Type':'application/x-www-form-urlencoded','Stripe-Version':'2026-10-28.endive',...(key?{'Idempotency-Key':key}:{})},...(method==='POST'?{body:new URLSearchParams(body)}:{})})
    if (!response.ok) throw Object.assign(new Error('Payment provider request failed'),{status:502})
    return response.json()
  }
  return async function handle(request, operation) {
    try {
      if (!configured()) return Response.json({configured:false,message:'Billing provider setup is required.'},{status:503})
      if (operation === 'webhook') {
        const raw = await request.text()
        if (raw.length>1_000_000) return Response.json({error:'Payload too large'},{status:413})
        verifySignature(raw,request.headers.get('stripe-signature'),env.STRIPE_WEBHOOK_SECRET)
        const event = JSON.parse(raw)
        if (!event.id || !event.type || !event.data?.object) throw new Error('Invalid event')
        const objectId = event.data.object.id
        const resource = event.type.startsWith('invoice.') ? 'invoices' : event.type.startsWith('customer.subscription.') ? 'subscriptions' : event.type.startsWith('payment_method.') ? 'payment_methods' : null
        // Stripe does not guarantee event delivery order; persist the current provider object.
        if (resource) {
          if (!/^[a-z]+_[a-zA-Z0-9]+$/.test(objectId || '')) throw new Error('Invalid provider object')
          const customer = event.data.object.customer
          const path = resource === 'payment_methods' && /^cus_[a-zA-Z0-9]+$/.test(customer || '') ? `customers/${encodeURIComponent(customer)}/payment_methods/${encodeURIComponent(objectId)}` : `${resource}/${encodeURIComponent(objectId)}`
          event.data.object = await stripe(path, null, null, 'GET')
        }
        const result = await rpc('web_billing_event',{event,payload_hash:createHash('sha256').update(raw).digest('hex')},serviceKey,serviceKey)
        return Response.json(result)
      }
      if (!['setup','portal','status'].includes(operation)) return Response.json({error:'Unknown billing operation'},{status:404})
      const bearer = request.headers.get('authorization')
      if (!bearer?.startsWith('Bearer ')) return Response.json({error:'Sign in required'},{status:401})
      const body = await request.json()
      if (!/^[a-f0-9-]{36}$/i.test(body.org_id || '')) return Response.json({error:'Brand is required'},{status:400})
      await rpc('web_page_snapshot',{page_key:'billing',org_id:body.org_id,params:{}},bearer.slice(7))
      if (operation === 'status') return Response.json({configured:true})
      let mapping = await rpc('web_billing_customer',{org_id:body.org_id,customer:null},serviceKey,serviceKey)
      if (!mapping.customer) {
        const customer = await stripe('customers',{'metadata[org_id]':body.org_id},`org-customer:${body.org_id}`)
        mapping = await rpc('web_billing_customer',{org_id:body.org_id,customer:customer.id},serviceKey,serviceKey)
      }
      const returnUrl = new URL('/manage/billing',env.APP_PUBLIC_URL).href
      if (operation === 'portal') return Response.json(await stripe('billing_portal/sessions',{customer:mapping.customer,return_url:returnUrl}))
      const session = await stripe('checkout/sessions',{customer:mapping.customer,mode:'setup',currency:'aud',success_url:returnUrl,cancel_url:returnUrl})
      return Response.json({url:session.url})
    } catch(error) { return Response.json({error:error.status?error.message:'Invalid billing request'},{status:error.status||400}) }
  }
}
export const handleBilling = createBillingHandler()
