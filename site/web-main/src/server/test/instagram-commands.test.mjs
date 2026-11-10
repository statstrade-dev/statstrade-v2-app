import { test } from 'node:test'
import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { processInstagramCommands } from '../instagram-commands.mjs'
import { encryptInstagramCredential } from '../instagram-connect.mjs'
import { createInstagramWebhookHandler } from '../instagram-webhook.mjs'
import { createHmac } from 'node:crypto'

const now = Date.now()
const env = { INSTAGRAM_APP_ID: '111', INSTAGRAM_ACCOUNT_ID: '222', INSTAGRAM_USERNAME: 'statstrade.com.au',
  INSTAGRAM_TOKEN_ENCRYPTION_KEY: randomBytes(32).toString('base64'), INSTAGRAM_DM_COMMANDS_ENABLED: 'true',
  INSTAGRAM_DM_COMMANDS_SINCE: new Date(now - 60000).toISOString(), INSTAGRAM_GRAPH_VERSION: 'v27.0' }
function fixture({ response = () => Response.json({ message_id: 'reply-1', recipient_id: '333' }), connection = {}, actionResponse = () => Response.json({ recipient_id: '333' }), finishFails = false, menuSince = null } = {}) {
  let claimed = false
  const sends = [], actions = [], sequence = [], finished = [], calls = []
  const storage = async (name, body) => {
    calls.push(name)
    if (name === 'web_instagram_connection_get') return { account_id: '222', username: env.INSTAGRAM_USERNAME,
      credential_ciphertext: encryptInstagramCredential('fixture-token', env, '222'), scopes: ['instagram_manage_messages'], ...connection }
    if (name === 'web_instagram_dm_claim') {
      assert.equal(body.enabled_since, env.INSTAGRAM_DM_COMMANDS_SINCE)
      assert.equal(body.menu_since, menuSince)
      if (claimed) return []
      claimed = true; return [{ event_key: 'message:1', sender_id: '333', text: 'Pong! 🏓' }]
    }
    if (name === 'web_instagram_reply_finish') { sequence.push('finish'); if (finishFails) throw Error('Fixture storage failure'); finished.push(body); return { updated: true } }
    assert.fail(name)
  }
  const fetchImpl = async (url, options) => {
    assert.equal(url, 'https://graph.facebook.com/v27.0/222/messages')
    assert.equal(options.redirect, 'manual')
    assert.equal(options.headers.Authorization, 'Bearer fixture-token')
    const body = JSON.parse(options.body)
    if (body.sender_action) {
      assert.ok(['mark_seen', 'typing_on', 'typing_off'].includes(body.sender_action))
      assert.deepEqual(body, { recipient: { id: '333' }, sender_action: body.sender_action })
      actions.push(body.sender_action); sequence.push(body.sender_action)
      return actionResponse()
    }
    sends.push({ url, ...options }); sequence.push('reply')
    assert.deepEqual(body, { recipient: { id: '333' }, message: { text: 'Pong! 🏓' } })
    return response()
  }
  return { sends, actions, sequence, finished, calls, run: (customEnv = env) => processInstagramCommands({ env: customEnv, storage, fetchImpl, now: () => now }) }
}

test('concurrent recovery passes send a reserved reply once and record the provider acknowledgement', async () => {
  const f = fixture()
  await Promise.all([f.run(), f.run()]); await f.run()
  assert.equal(f.sends.length, 1)
  assert.equal(f.finished[0].outcome, 'sent')
  assert.equal(f.finished[0].message_id, 'reply-1')
  assert.deepEqual(f.sequence, ['mark_seen', 'typing_on', 'reply', 'finish', 'typing_off'])
})

test('presence failures cannot suppress a reply, and typing is cleared even if outcome storage fails', async () => {
  for (const actionResponse of [() => { throw Error('Private error') }, () => new Response('', { status: 403 }),
    () => Response.json({ recipient_id: '999' }), () => new Response('', { status: 302 })]) {
    const f = fixture({ actionResponse }); const result = await f.run()
    assert.equal(f.sends.length, 1)
    assert.equal(f.finished[0].outcome, 'sent')
    assert.equal(result.sender_actions_unconfirmed, 3)
    assert.deepEqual(f.actions, ['mark_seen', 'typing_on', 'typing_off'])
  }
  const f = fixture({ finishFails: true })
  await assert.rejects(f.run(), /outcome storage unavailable/)
  assert.equal(f.sends.length, 1)
  assert.deepEqual(f.actions, ['mark_seen', 'typing_on', 'typing_off'])
})

test('timeouts, redirects, malformed acknowledgements and server errors are uncertain and never blindly resent', async () => {
  for (const response of [() => { throw Error('private-provider-error') }, () => new Response('', { status: 302 }),
    () => new Response('', { status: 503 }), () => Response.json({}),
    () => Response.json({ message_id: 'reply', recipient_id: '999' }), () => new Response('not json')]) {
    const f = fixture({ response }); await f.run(); await f.run()
    assert.equal(f.sends.length, 1)
    assert.equal(f.finished[0].outcome, 'uncertain')
    assert.equal(f.finished[0].reason, 'provider_unconfirmed')
    assert.equal(f.actions.at(-1), 'typing_off')
  }
  const rejected = fixture({ response: () => Response.json({ error: { message: 'private' } }, { status: 403 }) })
  await rejected.run()
  assert.equal(rejected.finished[0].outcome, 'failed')
  assert.equal(rejected.finished[0].reason, 'provider_http_403')
})

test('disabled commands, invalid activation and invalid/expired/wrong-account credentials cannot reserve or send', async () => {
  const disabled = fixture(); await disabled.run({ ...env, INSTAGRAM_DM_COMMANDS_ENABLED: 'false' })
  assert.deepEqual(disabled.calls, [])
  for (const value of ['', 'bad date', new Date(now + 10000).toISOString()]) {
    const f = fixture(); await assert.rejects(f.run({ ...env, INSTAGRAM_DM_COMMANDS_SINCE: value }))
    assert.equal(f.sends.length, 0)
  }
  for (const connection of [{ username: 'finfolk.com.au' }, { account_id: '999' }, { scopes: [] },
    { expires_at: new Date(now - 1).toISOString() }, { credential_ciphertext: 'bad' }]) {
    const f = fixture({ connection }); await assert.rejects(f.run())
    assert.equal(f.calls.includes('web_instagram_dm_claim'), false)
    assert.equal(f.sends.length, 0)
  }
})

test('menu activation is independent of command activation and invalid menu dates cannot reserve replies', async () => {
  const menuSince = new Date(now - 30000).toISOString(), f = fixture({ menuSince })
  await f.run({ ...env, INSTAGRAM_DM_MENU_SINCE: menuSince })
  assert.equal(f.sends.length, 1)
  for (const value of ['invalid', new Date(now + 10000).toISOString()]) {
    const f = fixture()
    await assert.rejects(f.run({ ...env, INSTAGRAM_DM_MENU_SINCE: value }), /menu activation/)
    assert.deepEqual(f.calls, [])
    assert.equal(f.sends.length, 0)
  }
})

test('webhook triggers commands only after a valid signed batch has persisted', async () => {
  let notified = 0, storageStatus = 200
  const webhookEnv = { ...env, INSTAGRAM_APP_SECRET: 'fixture-secret', SUPABASE_URL: 'https://api.example', SUPABASE_SERVICE_ROLE_KEY: 'sb_secret_fixture' }
  const handle = createInstagramWebhookHandler({ env: webhookEnv, onAccepted: () => notified++, fetchImpl: async () => new Response('{}', { status: storageStatus }) })
  const raw = JSON.stringify({ object: 'instagram', entry: [{ id: '222', messaging: [{ sender: { id: '333' }, recipient: { id: '222' }, timestamp: now, message: { mid: '1', text: '/ping' } }] }] })
  const request = (signature = 'sha256=' + createHmac('sha256', webhookEnv.INSTAGRAM_APP_SECRET).update(raw).digest('hex')) => new Request('https://api.example/api/instagram/webhook', { method: 'POST', body: raw, headers: { 'x-hub-signature-256': signature } })
  assert.equal((await handle(request('invalid'))).status, 403); assert.equal(notified, 0)
  storageStatus = 503; assert.equal((await handle(request())).status, 503); assert.equal(notified, 0)
  storageStatus = 200; assert.equal((await handle(request())).status, 200); assert.equal(notified, 1)
})
