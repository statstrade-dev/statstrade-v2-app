import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { Buffer } from 'node:buffer'

const MAX_BYTES = 262144
const numericId = value => typeof value === 'string' && /^\d{1,40}$/.test(value)
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value)
const invalid = () => Object.assign(new Error('Invalid Instagram event'), { status: 400 })
const reply = (text, status = 200) => new Response(text, {
  status, headers: { 'Cache-Control': 'no-store', 'Content-Type': 'text/plain; charset=utf-8' }
})

export function validInstagramSignature(raw, signature, secret) {
  return Boolean(secret && /^sha256=[a-f0-9]{64}$/.test(signature || '') && timingSafeEqual(
    Buffer.from(signature.slice(7), 'hex'), createHmac('sha256', secret).update(raw).digest()
  ))
}

async function readBody(request) {
  if (Number(request.headers.get('content-length')) > MAX_BYTES)
    throw Object.assign(new Error('Payload too large'), { status: 413 })
  const reader = request.body?.getReader()
  if (!reader) return Buffer.alloc(0)
  const chunks = []
  let size = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > MAX_BYTES) {
        await reader.cancel()
        throw Object.assign(new Error('Payload too large'), { status: 413 })
      }
      chunks.push(value)
    }
  } finally { reader.releaseLock() }
  return Buffer.concat(chunks, size)
}

// Retain only the fields an inbox needs. Unknown webhook fields are acknowledged
// without storing them. The configured brand account is the only recipient.
export function normalizeInstagramEvents(payload, accountId) {
  if (!object(payload)) throw invalid()
  if (payload.object !== 'instagram') return []
  if (!Array.isArray(payload.entry)) throw invalid()
  const events = new Map()
  const add = (key, kind, data) => {
    events.set(key, { key, kind, data })
    if (events.size > 500) throw invalid()
  }
  for (const entry of payload.entry) {
    if (!object(entry)) throw invalid()
    if (entry.id !== accountId) continue
    if (entry.messaging !== undefined && !Array.isArray(entry.messaging)) throw invalid()
    for (const event of entry.messaging || []) {
      if (!object(event)) throw invalid()
      if (!event.message || event.message.is_echo || event.message.is_deleted) continue
      if (event.recipient?.id !== accountId || !numericId(event.sender?.id) || event.sender.id === accountId) continue
      const message = event.message
      if (typeof message.mid !== 'string' || !message.mid.length || message.mid.length > 500) throw invalid()
      if (message.text !== undefined && typeof message.text !== 'string') throw invalid()
      const attachments = Array.isArray(message.attachments) ? message.attachments : []
      add(`message:${message.mid}`, 'message', {
        message_id: message.mid, sender_id: event.sender.id,
        timestamp: Number.isSafeInteger(event.timestamp) ? event.timestamp : null,
        text: message.text ?? null,
        // Attachment URLs may carry credentials or expire; retrieve media later.
        attachment_types: attachments.map(item => item?.type).filter(type => typeof type === 'string').slice(0, 20)
      })
    }
    if (entry.changes !== undefined && !Array.isArray(entry.changes)) throw invalid()
    for (const change of entry.changes || []) {
      if (!object(change)) throw invalid()
      if (change.field !== 'comments') continue
      const value = change.value
      if (!object(value) || !numericId(value.id) || !numericId(value.media?.id)) throw invalid()
      if (value.from?.id === accountId) continue
      if (value.text !== undefined && typeof value.text !== 'string') throw invalid()
      const data = {
        comment_id: value.id, media_id: value.media.id,
        sender_id: numericId(value.from?.id) ? value.from.id : null,
        text: value.text ?? null,
        action: typeof value.verb === 'string' ? value.verb : 'add'
      }
      // Include the normalized content so an edited comment becomes a new inbox
      // event, while redelivery or JSON property reordering cannot duplicate it.
      const hash = createHash('sha256').update(JSON.stringify(data)).digest('hex')
      add(`comment:${value.id}:${hash}`, 'comment', data)
    }
  }
  return [...events.values()]
}

export function createInstagramWebhookHandler({ env = process.env, fetchImpl = fetch, onAccepted } = {}) {
  return async function handle(request) {
    if (!['GET', 'POST'].includes(request.method))
      return new Response('', { status: 405, headers: { Allow: 'GET, POST', 'Cache-Control': 'no-store' } })
    if (request.method === 'GET') {
      if (!env.INSTAGRAM_VERIFY_TOKEN) return reply('Instagram setup required', 503)
      const query = new URL(request.url).searchParams
      const token = Buffer.from(query.get('hub.verify_token') || '')
      const expected = Buffer.from(env.INSTAGRAM_VERIFY_TOKEN)
      const challenge = query.get('hub.challenge')
      if (query.get('hub.mode') !== 'subscribe' || !challenge || token.length !== expected.length || !timingSafeEqual(token, expected))
        return reply('Verification failed', 403)
      return reply(challenge)
    }
    if (!env.INSTAGRAM_APP_SECRET || !numericId(env.INSTAGRAM_APP_ID) || !numericId(env.INSTAGRAM_ACCOUNT_ID))
      return reply('Instagram setup required', 503)
    try {
      const raw = await readBody(request)
      if (!validInstagramSignature(raw, request.headers.get('x-hub-signature-256'), env.INSTAGRAM_APP_SECRET))
        return reply('Invalid signature', 403)
      let payload
      try { payload = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(raw)) }
      catch { throw invalid() }
      const events = normalizeInstagramEvents(payload, env.INSTAGRAM_ACCOUNT_ID)
      if (!events.length) return reply('Ignored')
      const databaseURL = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL
      const key = env.SUPABASE_SERVICE_ROLE_KEY
      if (!databaseURL || !key) return reply('Instagram storage unavailable', 503)
      const response = await fetchImpl(new URL('/rest/v1/rpc/web_instagram_events', databaseURL), {
        method: 'POST', signal: AbortSignal.timeout(10000), redirect: 'manual',
        headers: { apikey: key, ...(!key.startsWith('sb_secret_') ? { Authorization: `Bearer ${key}` } : {}), 'Content-Type': 'application/json', 'Content-Profile': 'stats_rpc' },
        body: JSON.stringify({ app_id: env.INSTAGRAM_APP_ID, account_id: env.INSTAGRAM_ACCOUNT_ID, events })
      })
      // Acknowledge only after the entire batch commits. Meta can retry a failed
      // delivery; the database's unique keys make that safe.
      if (!response.ok) return reply('Instagram storage unavailable', 503)
      // The Worker schedules command processing only after durable ingress.
      // Cron independently recovers events if this notification is interrupted.
      if (onAccepted) onAccepted()
      return reply('Accepted')
    } catch (error) {
      if (error.status === 413) return reply('Payload too large', 413)
      if (error.status === 400) return reply('Invalid Instagram event', 400)
      return reply('Instagram storage unavailable', 503)
    }
  }
}

export const handleInstagramWebhook = createInstagramWebhookHandler()
