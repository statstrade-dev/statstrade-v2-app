import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createHmac } from 'node:crypto'
import { createInstagramWebhookHandler, normalizeInstagramEvents, validInstagramSignature } from '../instagram-webhook.mjs'

const url = 'https://statstrade.example/api/instagram/webhook'
const env = {
  INSTAGRAM_APP_ID: '1144842521271734', INSTAGRAM_ACCOUNT_ID: '12345',
  INSTAGRAM_APP_SECRET: 'test-app-secret', INSTAGRAM_VERIFY_TOKEN: 'test-verify-token',
  SUPABASE_URL: 'https://database.example', SUPABASE_SERVICE_ROLE_KEY: 'test-service-key'
}
const dm = { sender: { id: '67890' }, recipient: { id: '12345' }, timestamp: 1700000000000,
  message: { mid: 'message-1', text: 'Hello 🦘' } }
const comment = { field: 'comments', value: { id: '777', from: { id: '67890' }, media: { id: '888' }, text: 'LINK' } }
const batch = (messaging = [dm], changes = [comment]) => ({ object: 'instagram', entry: [{ id: '12345', messaging, changes }] })
const signature = raw => `sha256=${createHmac('sha256', env.INSTAGRAM_APP_SECRET).update(raw).digest('hex')}`
const request = (payload = batch(), headers = {}) => {
  const raw = typeof payload === 'string' || payload instanceof Uint8Array ? payload : JSON.stringify(payload)
  return new Request(url, { method: 'POST', headers: { 'x-hub-signature-256': signature(raw), ...headers }, body: raw })
}

test('verification returns the exact challenge without database or app-secret configuration', async () => {
  const handle = createInstagramWebhookHandler({ env: { INSTAGRAM_VERIFY_TOKEN: env.INSTAGRAM_VERIFY_TOKEN }, fetchImpl: () => assert.fail('network call') })
  const res = await handle(new Request(`${url}?hub.mode=subscribe&hub.verify_token=test-verify-token&hub.challenge=001234`))
  assert.equal(res.status, 200)
  assert.equal(await res.text(), '001234')
  assert.equal(res.headers.get('cache-control'), 'no-store')
  assert.equal((await handle(new Request(`${url}?hub.mode=subscribe&hub.verify_token=wrong&hub.challenge=1`))).status, 403)
  assert.equal((await handle(new Request(`${url}?hub.mode=subscribe&hub.verify_token=test-verify-token`))).status, 403)
})

test('signatures cover exact UTF-8 bytes, reject malformed headers, and cannot use another app secret', () => {
  const raw = Buffer.from('Hello 🦘')
  assert.equal(validInstagramSignature(raw, signature(raw), env.INSTAGRAM_APP_SECRET), true)
  assert.equal(validInstagramSignature(Buffer.from('Hello'), signature(raw), env.INSTAGRAM_APP_SECRET), false)
  assert.equal(validInstagramSignature(raw, signature(raw), 'finfolk-secret'), false)
  for (const header of [null, '', 'sha256=bad', `sha1=${'0'.repeat(64)}`])
    assert.equal(validInstagramSignature(raw, header, env.INSTAGRAM_APP_SECRET), false)
})

test('signed comments and DMs commit once as a batch through a server-only RPC', async () => {
  const calls = []
  const handle = createInstagramWebhookHandler({ env, fetchImpl: async (target, options) => {
    calls.push({ target: String(target), options })
    return new Response('{"inserted":2}')
  } })
  assert.equal((await handle(request())).status, 200)
  assert.equal(calls.length, 1)
  assert.equal(calls[0].target, 'https://database.example/rest/v1/rpc/web_instagram_events')
  const { options } = calls[0]
  assert.equal(options.headers.Authorization, 'Bearer test-service-key')
  assert.equal(options.headers['Content-Profile'], 'stats_rpc')
  assert.equal(options.redirect, 'manual')
  const body = JSON.parse(options.body)
  assert.equal(body.app_id, env.INSTAGRAM_APP_ID)
  assert.equal(body.account_id, env.INSTAGRAM_ACCOUNT_ID)
  assert.deepEqual(body.events.map(event => event.kind), ['message', 'comment'])
  assert.equal(body.events[0].data.text, 'Hello 🦘')
})

test('invalid signatures and missing configuration cannot persist events', async () => {
  const fetchImpl = () => assert.fail('network call')
  const handle = createInstagramWebhookHandler({ env, fetchImpl })
  assert.equal((await handle(request(batch(), { 'x-hub-signature-256': 'sha256=bad' }))).status, 403)
  assert.equal((await createInstagramWebhookHandler({ env: {}, fetchImpl })(request())).status, 503)
  assert.equal((await createInstagramWebhookHandler({ env: { ...env, SUPABASE_SERVICE_ROLE_KEY: '' }, fetchImpl })(request())).status, 503)
  const method = await handle(new Request(url, { method: 'DELETE' }))
  assert.equal(method.status, 405)
  assert.equal(method.headers.get('allow'), 'GET, POST')
})

test('modern Supabase secret keys use the apikey header without a JWT bearer', async () => {
  const handle = createInstagramWebhookHandler({
    env: { ...env, SUPABASE_SERVICE_ROLE_KEY: 'sb_secret_fixture' },
    fetchImpl: async (_, options) => {
      assert.equal(options.headers.apikey, 'sb_secret_fixture')
      assert.equal(options.headers.Authorization, undefined)
      return new Response('{"inserted":2}')
    }
  })
  assert.equal((await handle(request())).status, 200)
})

test('unknown accounts, echoes, self-comments and unrelated fields are ignored', async () => {
  const payload = batch([{ ...dm, message: { ...dm.message, is_echo: true } }, { ...dm, recipient: { id: '999' } }],
    [{ ...comment, value: { ...comment.value, from: { id: '12345' } } }, { field: 'message_reactions', value: {} }])
  payload.entry.push({ id: '999', messaging: [dm], changes: [comment] })
  const handle = createInstagramWebhookHandler({ env, fetchImpl: () => assert.fail('network call') })
  assert.equal(await (await handle(request(payload))).text(), 'Ignored')
  assert.deepEqual(normalizeInstagramEvents({ object: 'page' }, env.INSTAGRAM_ACCOUNT_ID), [])
})

test('deduplication is per message/comment, independent of batch order and JSON key order', () => {
  const original = normalizeInstagramEvents(batch([dm, dm], [comment, comment]), env.INSTAGRAM_ACCOUNT_ID)
  assert.equal(original.length, 2)
  const reordered = { field: 'comments', value: { text: 'LINK', media: { id: '888' }, from: { id: '67890' }, id: '777' } }
  assert.equal(normalizeInstagramEvents(batch([], [reordered]), env.INSTAGRAM_ACCOUNT_ID)[0].key, original[1].key)
  const edited = { ...comment, value: { ...comment.value, text: 'Updated comment' } }
  assert.notEqual(normalizeInstagramEvents(batch([], [edited]), env.INSTAGRAM_ACCOUNT_ID)[0].key, original[1].key)
})

test('attachment URLs and arbitrary provider fields never enter the inbox', () => {
  const event = { ...dm, message: { ...dm.message, extra: 'private', attachments: [{ type: 'image', payload: { url: 'https://private.example/?token=secret' } }] } }
  const events = normalizeInstagramEvents(batch([event], []), env.INSTAGRAM_ACCOUNT_ID)
  assert.deepEqual(events[0].data.attachment_types, ['image'])
  assert.equal(JSON.stringify(events).includes('secret'), false)
  assert.equal(JSON.stringify(events).includes('extra'), false)
})

test('malformed signed payloads fail before any part of the batch persists', async () => {
  const handle = createInstagramWebhookHandler({ env, fetchImpl: () => assert.fail('network call') })
  for (const payload of ['{', Buffer.from([0xff]), [], { object: 'instagram' }, batch([dm], [{ field: 'comments', value: {} }]), batch([{ ...dm, message: {} }], [])])
    assert.equal((await handle(request(payload))).status, 400)
})

test('streamed bodies are bounded even without a content-length header', async () => {
  const handle = createInstagramWebhookHandler({ env, fetchImpl: () => assert.fail('network call') })
  assert.equal((await handle(request('a'.repeat(262145)))).status, 413)
  assert.equal((await handle(request(batch(), { 'content-length': '262145' }))).status, 413)
})

test('storage outages and timeouts return retryable failures without exposing secrets', async () => {
  for (const fetchImpl of [async () => new Response('private database error', { status: 500 }), async () => { throw Error('test-service-key') }]) {
    const res = await createInstagramWebhookHandler({ env, fetchImpl })(request())
    assert.equal(res.status, 503)
    assert.equal(await res.text(), 'Instagram storage unavailable')
  }
})
