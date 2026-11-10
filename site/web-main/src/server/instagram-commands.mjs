import { createInstagramStorage, decryptInstagramCredential } from './instagram-connect.mjs'

export async function processInstagramCommands({ env, fetchImpl = fetch, storage, now = Date.now } = {}) {
  if (env.INSTAGRAM_DM_COMMANDS_ENABLED !== 'true') return { enabled: false }
  const since = Date.parse(env.INSTAGRAM_DM_COMMANDS_SINCE || '')
  if (!Number.isFinite(since) || since > now()) throw Error('Instagram command activation required')
  const menuSince = env.INSTAGRAM_DM_MENU_SINCE ? Date.parse(env.INSTAGRAM_DM_MENU_SINCE) : null
  if (menuSince !== null && (!Number.isFinite(menuSince) || menuSince > now())) throw Error('Instagram menu activation required')
  const rpc = storage || createInstagramStorage({ env, fetchImpl })
  // Load and decrypt before reserving a reply. An unavailable connection must
  // leave events pending, so cron can recover once authorization is restored.
  const connection = await rpc('web_instagram_connection_get', { app_id: env.INSTAGRAM_APP_ID })
  if (!connection || connection.username !== env.INSTAGRAM_USERNAME || connection.account_id !== env.INSTAGRAM_ACCOUNT_ID ||
      !connection.scopes?.includes('instagram_manage_messages') || connection.expires_at && Date.parse(connection.expires_at) <= now())
    throw Error('Instagram command connection unavailable')
  const token = decryptInstagramCredential(connection.credential_ciphertext, env, connection.account_id)
  const version = env.INSTAGRAM_GRAPH_VERSION || 'v27.0'
  if (!/^v\d+\.\d+$/.test(version) || !/^\d{1,40}$/.test(connection.account_id)) throw Error('Invalid Instagram command account')
  const jobs = await rpc('web_instagram_dm_claim', {
    app_id: env.INSTAGRAM_APP_ID, account_id: connection.account_id, enabled_since: new Date(since).toISOString(),
    menu_since: menuSince === null ? null : new Date(menuSince).toISOString()
  })
  if (!Array.isArray(jobs) || jobs.length > 5) throw Error('Invalid Instagram command reservations')
  let unconfirmedActions = 0
  const endpoint = `https://graph.facebook.com/${version}/${connection.account_id}/messages`
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  const senderAction = async (sender, action) => {
    try {
      const response = await fetchImpl(endpoint, {
        method: 'POST', redirect: 'manual', signal: AbortSignal.timeout(3000), headers,
        // Sender actions must be separate requests, without message content.
        body: JSON.stringify({ recipient: { id: sender }, sender_action: action })
      })
      const data = await response.json()
      if (response.ok && (data.success === true || String(data.recipient_id) === sender)) return
    } catch { /* Presence indicators are best effort and must not block replies. */ }
    unconfirmedActions++
  }
  // A bounded parallel batch fits inside the Worker's background lifetime even
  // when a provider request times out. Every job already has its own reservation.
  const results = await Promise.allSettled(jobs.map(async job => {
    // Reservation RPC is server-only, but validate its output before any send.
    if (typeof job.event_key !== 'string' || !/^\d{1,40}$/.test(job.sender_id || '') || job.sender_id === connection.account_id ||
        typeof job.text !== 'string' || !job.text || new TextEncoder().encode(job.text).length > 1000) return
    let outcome = 'uncertain', message_id = null, reason = 'provider_unconfirmed'
    try {
      await senderAction(job.sender_id, 'mark_seen')
      await senderAction(job.sender_id, 'typing_on')
      try {
        const response = await fetchImpl(endpoint, {
          method: 'POST', redirect: 'manual', signal: AbortSignal.timeout(10000), headers,
          body: JSON.stringify({ recipient: { id: job.sender_id }, message: { text: job.text } })
        })
        if (response.status >= 400 && response.status < 500) {
          outcome = 'failed'; reason = `provider_http_${response.status}`
        } else if (response.ok) {
          const data = await response.json()
          if (typeof data.message_id === 'string' && data.message_id.length > 0 && data.message_id.length <= 500 &&
              (!data.recipient_id || String(data.recipient_id) === job.sender_id)) {
            outcome = 'sent'; message_id = data.message_id; reason = null
          }
        }
      } catch { /* A lost response may have delivered. Never repeat this POST. */ }
      await rpc('web_instagram_reply_finish', {
        app_id: env.INSTAGRAM_APP_ID, account_id: connection.account_id, event_key: job.event_key, outcome, message_id, reason
      })
    } finally {
      await senderAction(job.sender_id, 'typing_off')
    }
  }))
  if (results.some(result => result.status === 'rejected')) throw Error('Instagram reply outcome storage unavailable')
  return { enabled: true, reserved: jobs.length, ...(unconfirmedActions ? { sender_actions_unconfirmed: unconfirmedActions } : {}) }
}
