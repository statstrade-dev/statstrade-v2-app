import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createHash, randomBytes } from 'node:crypto'
import { createInstagramConnectTicket, createInstagramConnectHandler, createInstagramStorage, decryptInstagramCredential } from '../instagram-connect.mjs'

const now = 1794088000000
const env = {
  INSTAGRAM_APP_ID: '1144842521271734', INSTAGRAM_APP_SECRET: 'fixture-secret',
  INSTAGRAM_LOGIN_CONFIG_ID: '1072833352481481', INSTAGRAM_USERNAME: 'statstrade.com.au',
  INSTAGRAM_REDIRECT_URI: 'https://api.example/v1/integrations/instagram/oauth/callback',
  INSTAGRAM_TOKEN_ENCRYPTION_KEY: randomBytes(32).toString('base64')
}
const digest = value => createHash('sha256').update(value).digest('hex')
function fixture({ debug = {}, assigned, business, pinnedAccount, directAccount, subscription, appSubscription, failProvider = false } = {}) {
  const calls = [], intents = new Map(), saved = []
  const storage = async (name, body) => {
    calls.push(name)
    if (name === 'web_instagram_oauth_begin') {
      if ([...intents.values()].some(row => row.ticket_hash === body.ticket_hash)) return { created: false }
      intents.set(body.state_hash, { ...body }); return { created: true }
    }
    if (name === 'web_instagram_oauth_consume') {
      const row = intents.get(body.state_hash)
      const accepted = row && !row.used && row.cookie_hash === body.cookie_hash && row.app_id === body.app_id && row.config_id === body.config_id && row.username === body.username
      if (accepted) row.used = true
      return { accepted: Boolean(accepted) }
    }
    if (name === 'web_instagram_connection_save') { saved.push(body); return { connected: true } }
    assert.fail(`Unexpected RPC ${name}`)
  }
  const fetchImpl = async (target, options) => {
    assert.equal(options.redirect, 'manual')
    const url = new URL(target); calls.push(`${options.method || 'GET'} ${url.pathname}`)
    if (failProvider) return Response.json({ error: { message: 'private-token-and-secret' } }, { status: 400 })
    let value
    if (url.pathname.endsWith('/oauth/access_token')) value = { access_token: 'provider-fixture-token' }
    else if (url.pathname.endsWith('/debug_token')) value = { data: { is_valid: true, app_id: env.INSTAGRAM_APP_ID, scopes: ['instagram_basic', 'instagram_manage_comments', 'instagram_manage_messages'], expires_at: 0, ...debug } }
    else if (url.pathname.endsWith('/me')) value = business || { client_business_id: '9988' }
    else if (url.pathname.endsWith('/assigned_instagram_accounts')) value = assigned || { data: [{ id: '12345', username: env.INSTAGRAM_USERNAME }] }
    else if (pinnedAccount && url.pathname === `/v27.0/${pinnedAccount}`) value = directAccount || { id: pinnedAccount, username: env.INSTAGRAM_USERNAME }
    else if (url.pathname.endsWith('/subscriptions')) {
      assert.equal(options.headers.Authorization, `Bearer ${env.INSTAGRAM_APP_ID}|${env.INSTAGRAM_APP_SECRET}`)
      value = appSubscription || { data: [{ object: 'instagram', active: true, callback_url: 'https://api.example/api/instagram/webhook', fields: [{ name: 'comments' }, { name: 'messages' }] }] }
    }
    else if (options.method === 'POST') {
      assert.equal(options.body.get('subscribed_fields'), 'comments,messages'); value = { success: true }
    } else {
      assert.equal(url.searchParams.get('fields'), 'id,subscribed_fields')
      value = subscription || { data: [{ id: env.INSTAGRAM_APP_ID, subscribed_fields: ['comments', 'messages'] }] }
    }
    return Response.json(value)
  }
  return { calls, saved, handle: createInstagramConnectHandler({ env: { ...env, INSTAGRAM_ACCOUNT_ID: pinnedAccount }, storage, fetchImpl, now: () => now }) }
}
async function start(f) {
  const ticketURL = createInstagramConnectTicket(env, now)
  const res = await f.handle(new Request(ticketURL))
  assert.equal(res.status, 302)
  const login = new URL(res.headers.get('location'))
  assert.equal(login.hostname, 'www.facebook.com')
  assert.equal(login.searchParams.get('config_id'), env.INSTAGRAM_LOGIN_CONFIG_ID)
  const cookie = res.headers.get('set-cookie')
  assert.match(cookie, /Secure; HttpOnly; SameSite=Lax/)
  const callback = new URL(env.INSTAGRAM_REDIRECT_URI)
  callback.searchParams.set('state', login.searchParams.get('state'))
  callback.searchParams.set('code', 'provider-code')
  return { ticketURL, callback, cookie: cookie.split(';')[0] }
}

test('Unified Login binds the app, account, browser and one-use state before storing an encrypted credential', async () => {
  const f = fixture(), flow = await start(f)
  const res = await f.handle(new Request(flow.callback, { headers: { cookie: flow.cookie } }))
  assert.equal(res.status, 200)
  assert.match(await res.text(), /Connected @statstrade.com.au/)
  assert.equal(f.saved.length, 1)
  assert.equal(f.saved[0].account_id, '12345')
  assert.equal(f.saved[0].expires_at, null)
  assert.equal(f.saved[0].credential_ciphertext.includes('provider-fixture-token'), false)
  assert.equal(decryptInstagramCredential(f.saved[0].credential_ciphertext, env, '12345'), 'provider-fixture-token')
  assert.throws(() => decryptInstagramCredential(f.saved[0].credential_ciphertext, env, '999'))
  assert.equal((await f.handle(new Request(flow.callback, { headers: { cookie: flow.cookie } }))).status, 403)
  assert.equal(f.saved.length, 1)
})

test('forged and expired operator links cannot begin an authorization', async () => {
  const f = fixture()
  assert.equal((await f.handle(new Request(createInstagramConnectTicket(env, now - 601000)))).status, 403)
  const forged = new URL(createInstagramConnectTicket(env, now))
  forged.searchParams.set('ticket', forged.searchParams.get('ticket') + 'x')
  assert.equal((await f.handle(new Request(forged))).status, 403)
  assert.deepEqual(f.calls, [])
})

test('Meta token-scoped subscription readback may omit the app ID only with independent app callback verification', async () => {
  const row = { subscribed_fields: ['comments', 'messages'] }
  const app = { object: 'instagram', active: true, callback_url: 'https://api.example/api/instagram/webhook', fields: [{ name: 'comments' }, { name: 'messages' }] }
  for (const [options, expected] of [
    [{ subscription: { data: [row] } }, 200],
    [{ subscription: { data: [{ ...row, id: '999' }] } }, 502],
    [{ subscription: { data: [{ ...row, id: null }] } }, 502],
    [{ subscription: { data: [row, row] } }, 502],
    [{ subscription: { data: [row], paging: { next: 'more' } } }, 502],
    [{ subscription: { data: [{ subscribed_fields: ['messages'] }] } }, 502],
    [{ subscription: { data: [] } }, 502],
    ...[{ ...app, active: false }, { ...app, object: 'page' }, { ...app, callback_url: 'https://elsewhere.example/webhook' }, { ...app, fields: [{ name: 'messages' }] }].map(item => [{ subscription: { data: [row] }, appSubscription: { data: [item] } }, 502])
  ]) {
    const f = fixture(options), flow = await start(f)
    const res = await f.handle(new Request(flow.callback, { headers: { cookie: flow.cookie } }))
    assert.equal(res.status, expected)
    assert.equal(f.saved.length, expected === 200 ? 1 : 0)
    if (expected === 200) assert.ok(f.calls.includes(`GET /v27.0/${env.INSTAGRAM_APP_ID}/subscriptions`))
  }
  const wrongApp = fixture({ debug: { app_id: '999' }, subscription: { data: [row] } }), flow = await start(wrongApp)
  assert.equal((await wrongApp.handle(new Request(flow.callback, { headers: { cookie: flow.cookie } }))).status, 403)
  assert.equal(wrongApp.saved.length, 0)
})

test('an empty discovery edge requires an operator-pinned ID and direct identity and subscription verification', async () => {
  for (const [options, expected] of [
    [{ assigned: { data: [] } }, 403],
    [{ assigned: { data: [] }, pinnedAccount: '12345' }, 200],
    [{ assigned: { data: [] }, pinnedAccount: '12345', directAccount: { id: '12345', username: 'finfolk.com.au' } }, 403],
    [{ assigned: { data: [] }, pinnedAccount: '12345', directAccount: { id: '999', username: env.INSTAGRAM_USERNAME } }, 403],
    [{ assigned: { data: [{ id: '999', username: env.INSTAGRAM_USERNAME }] }, pinnedAccount: '12345' }, 403],
    [{ assigned: { data: [], paging: { next: 'more' } }, pinnedAccount: '12345' }, 403]
  ]) {
    const f = fixture(options), flow = await start(f)
    const res = await f.handle(new Request(flow.callback, { headers: { cookie: flow.cookie } }))
    assert.equal(res.status, expected)
    assert.equal(f.saved.length, expected === 200 ? 1 : 0)
    assert.equal(f.calls.includes('POST /v27.0/12345/subscribed_apps'), expected === 200)
  }
})

test('connection tickets cannot be reused and callback requires its browser cookie', async () => {
  const f = fixture(), flow = await start(f)
  assert.equal((await f.handle(new Request(flow.ticketURL))).status, 409)
  assert.equal((await f.handle(new Request(flow.callback))).status, 403)
  const badCookie = `__Host-statstrade_instagram_oauth=${'a'.repeat(43)}`
  assert.equal((await f.handle(new Request(flow.callback, { headers: { cookie: badCookie } }))).status, 403)
  assert.equal(f.calls.filter(call => call.includes('/oauth/access_token')).length, 0)
})

test('wrong apps, missing permissions, non-business tokens and different/multiple accounts cannot connect', async () => {
  for (const options of [
    { debug: { app_id: '999' } }, { debug: { scopes: ['instagram_basic'] } },
    { debug: { expires_at: Math.floor(now / 1000) - 1 } }, { debug: { expires_at: undefined } },
    { business: { id: 'personal-user' } },
    { assigned: { data: [{ id: '12345', username: 'finfolk.com.au' }] } },
    { assigned: { data: [{ id: '12345', username: env.INSTAGRAM_USERNAME }, { id: '999', username: 'other' }] } }
  ]) {
    const f = fixture(options), flow = await start(f)
    const res = await f.handle(new Request(flow.callback, { headers: { cookie: flow.cookie } }))
    assert.equal(res.status, 403)
    assert.equal(f.saved.length, 0)
    assert.equal(f.calls.some(call => call === 'POST /v27.0/12345/subscribed_apps'), false)
  }
})

test('provider failure hides raw errors and consumes the callback before a retry', async () => {
  const f = fixture({ failProvider: true }), flow = await start(f)
  const res = await f.handle(new Request(flow.callback, { headers: { cookie: flow.cookie } }))
  assert.equal(res.status, 502)
  assert.equal((await res.text()).includes('private-token-and-secret'), false)
  assert.equal((await f.handle(new Request(flow.callback, { headers: { cookie: flow.cookie } }))).status, 403)
})

test('user cancellation clears the browser cookie and sends no provider request', async () => {
  const f = fixture(), flow = await start(f)
  flow.callback.searchParams.delete('code'); flow.callback.searchParams.set('error', 'access_denied')
  const res = await f.handle(new Request(flow.callback, { headers: { cookie: flow.cookie } }))
  assert.equal(res.status, 400)
  assert.match(res.headers.get('set-cookie'), /Max-Age=0/)
  assert.equal(f.calls.some(call => call.startsWith('GET ')), false)
})

test('storage rejects redirects using the redirect mode supported by Workers', async () => {
  const storage = createInstagramStorage({
    env: { SUPABASE_URL: 'https://db.example', SUPABASE_SERVICE_ROLE_KEY: 'sb_secret_fixture' },
    fetchImpl: async (_, options) => {
      assert.equal(options.redirect, 'manual')
      return new Response('', { status: 302, headers: { Location: 'https://other.example' } })
    }
  })
  await assert.rejects(storage('web_instagram_connection_get', { app_id: env.INSTAGRAM_APP_ID }), /storage unavailable/)
})
