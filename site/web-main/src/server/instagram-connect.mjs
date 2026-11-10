import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { Buffer } from 'node:buffer'

const hash = value => createHash('sha256').update(value).digest('hex')
const requiredScopes = ['instagram_basic', 'instagram_manage_comments', 'instagram_manage_messages']
const cookieName = '__Host-statstrade_instagram_oauth'
const fail = (status, message) => Object.assign(new Error(message), { status })
const equal = (a, b) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b))
const response = (message, status = 200, headers = {}) => new Response(message, {
  status, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer', ...headers }
})
const cookie = (value, age = 600) => `${cookieName}=${value}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=${age}`

function configuration(env) {
  const { INSTAGRAM_APP_ID: appId, INSTAGRAM_APP_SECRET: secret, INSTAGRAM_LOGIN_CONFIG_ID: configId,
    INSTAGRAM_USERNAME: username, INSTAGRAM_REDIRECT_URI: redirectURI } = env
  if (!/^\d{1,40}$/.test(appId || '') || !secret || !/^\d{1,40}$/.test(configId || '') ||
      !/^[a-z0-9._]{1,30}$/i.test(username || '') || !redirectURI || new URL(redirectURI).protocol !== 'https:')
    throw fail(503, 'Instagram connection setup required')
  const version = env.INSTAGRAM_GRAPH_VERSION || 'v27.0'
  if (!/^v\d+\.\d+$/.test(version)) throw fail(503, 'Instagram connection setup required')
  return { appId, secret, configId, username: username.toLowerCase(), redirectURI, version }
}

export function createInstagramConnectTicket(env, now = Date.now()) {
  const c = configuration(env)
  const payload = Buffer.from(JSON.stringify({ app: c.appId, config: c.configId, username: c.username,
    nonce: randomBytes(32).toString('base64url'), expires: now + 600000 })).toString('base64url')
  const mac = createHmac('sha256', c.secret).update(`statstrade-instagram-connect.v1.${payload}`).digest('base64url')
  const url = new URL('/connect', c.redirectURI)
  url.searchParams.set('ticket', `${payload}.${mac}`)
  return url.href
}

function readTicket(ticket, c, now) {
  if (typeof ticket !== 'string' || ticket.length > 2048) throw fail(403, 'Invalid or expired connection link')
  const [payload, mac, extra] = ticket.split('.')
  const expected = createHmac('sha256', c.secret).update(`statstrade-instagram-connect.v1.${payload}`).digest('base64url')
  if (extra !== undefined || !/^[a-zA-Z0-9_-]+$/.test(payload || '') || !/^[a-zA-Z0-9_-]{43}$/.test(mac || '') || !equal(mac, expected))
    throw fail(403, 'Invalid or expired connection link')
  let data
  try { data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) } catch { throw fail(403, 'Invalid or expired connection link') }
  if (data.app !== c.appId || data.config !== c.configId || data.username !== c.username ||
      !Number.isSafeInteger(data.expires) || data.expires <= now || data.expires > now + 600000 || !/^[a-zA-Z0-9_-]{43}$/.test(data.nonce || ''))
    throw fail(403, 'Invalid or expired connection link')
  return data
}

export function encryptInstagramCredential(token, env, accountId) {
  const key = Buffer.from(env.INSTAGRAM_TOKEN_ENCRYPTION_KEY || '', 'base64')
  if (key.length !== 32) throw fail(503, 'Instagram credential storage setup required')
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  cipher.setAAD(Buffer.from(`instagram-unified:${env.INSTAGRAM_APP_ID}:${accountId}`))
  const ciphertext = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()])
  return ['v1', iv.toString('base64url'), ciphertext.toString('base64url'), cipher.getAuthTag().toString('base64url')].join('.')
}

export function decryptInstagramCredential(value, env, accountId) {
  const [version, iv, ciphertext, tag] = value.split('.')
  if (version !== 'v1') throw Error('Unsupported Instagram credential')
  const cipher = createDecipheriv('aes-256-gcm', Buffer.from(env.INSTAGRAM_TOKEN_ENCRYPTION_KEY, 'base64'), Buffer.from(iv, 'base64url'))
  cipher.setAAD(Buffer.from(`instagram-unified:${env.INSTAGRAM_APP_ID}:${accountId}`))
  cipher.setAuthTag(Buffer.from(tag, 'base64url'))
  return Buffer.concat([cipher.update(Buffer.from(ciphertext, 'base64url')), cipher.final()]).toString('utf8')
}

export function createInstagramStorage({ env, fetchImpl = fetch }) {
  return async (name, body) => {
    const base = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL
    const key = env.SUPABASE_SERVICE_ROLE_KEY
    if (!base || !key) throw fail(503, 'Instagram storage unavailable')
    const res = await fetchImpl(new URL(`/rest/v1/rpc/${name}`, base), {
      method: 'POST', redirect: 'manual', signal: AbortSignal.timeout(10000),
      headers: { apikey: key, ...(!key.startsWith('sb_secret_') ? { Authorization: `Bearer ${key}` } : {}), 'Content-Type': 'application/json', 'Content-Profile': 'stats_rpc' },
      body: JSON.stringify(body)
    })
    if (!res.ok) throw fail(503, 'Instagram storage unavailable')
    return res.json()
  }
}

export function createInstagramConnectHandler({ env, fetchImpl = fetch, now = Date.now, storage } = {}) {
  const rpc = storage || createInstagramStorage({ env, fetchImpl })
  async function graph(c, path, token, options = {}) {
    let res, data
    try {
      res = await fetchImpl(`https://graph.facebook.com/${c.version}${path}`, {
        redirect: 'manual', signal: AbortSignal.timeout(15000),
        ...options, headers: { Authorization: `Bearer ${token}`, ...options.headers }
      })
      data = await res.json()
    } catch { throw fail(502, 'Meta authorization could not be verified. Create a fresh connection link and retry.') }
    if (!res.ok || data.error) throw fail(502, 'Meta authorization could not be verified. Create a fresh connection link and retry.')
    return data
  }
  return async request => {
    const url = new URL(request.url)
    if (request.method !== 'GET') return response('Method not allowed', 405, { Allow: 'GET' })
    let stage = 'configuration'
    try {
      const c = configuration(env)
      if (new URL(c.redirectURI).origin !== url.origin) throw fail(400, 'Instagram connection origin mismatch')
      if (url.pathname === '/connect') {
        stage = 'ticket'
        const ticket = url.searchParams.get('ticket')
        const intent = readTicket(ticket, c, now())
        // Check encryption configuration before letting the owner grant access.
        if (Buffer.from(env.INSTAGRAM_TOKEN_ENCRYPTION_KEY || '', 'base64').length !== 32)
          throw fail(503, 'Instagram credential storage setup required')
        stage = 'browser-state'
        const state = randomBytes(32).toString('base64url')
        const browser = randomBytes(32).toString('base64url')
        stage = 'begin-storage'
        const begun = await rpc('web_instagram_oauth_begin', {
          ticket_hash: hash(intent.nonce), state_hash: hash(state), cookie_hash: hash(browser),
          app_id: c.appId, config_id: c.configId, username: c.username,
          expires_at: new Date(intent.expires).toISOString()
        })
        if (!begun?.created) throw fail(409, 'Connection link already used. Create a fresh link.')
        stage = 'login-redirect'
        const login = new URL(`https://www.facebook.com/${c.version}/dialog/oauth`)
        for (const [key, value] of Object.entries({ client_id: c.appId, config_id: c.configId, redirect_uri: c.redirectURI,
          response_type: 'code', override_default_response_type: 'true', state })) login.searchParams.set(key, value)
        return response('', 302, { Location: login.href, 'Set-Cookie': cookie(browser) })
      }
      if (url.pathname !== new URL(c.redirectURI).pathname) return response('Not found', 404)
      const state = url.searchParams.get('state')
      const browser = (request.headers.get('cookie') || '').split(';').map(part => part.trim()).find(part => part.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1)
      if (!/^[a-zA-Z0-9_-]{43}$/.test(state || '') || !/^[a-zA-Z0-9_-]{43}$/.test(browser || ''))
        throw fail(403, 'Instagram connection state mismatch. Create a fresh connection link.')
      const intent = await rpc('web_instagram_oauth_consume', {
        state_hash: hash(state), cookie_hash: hash(browser), app_id: c.appId, config_id: c.configId, username: c.username
      })
      if (!intent?.accepted) throw fail(403, 'Instagram connection expired or already used. Create a fresh connection link.')
      const code = url.searchParams.get('code')
      if (url.searchParams.has('error') || !code || code.length > 8192) throw fail(400, 'Instagram authorization was not completed. Create a fresh connection link.')
      // Meta's exchange/debug contracts put credentials in query parameters.
      // Never log these URLs, provider errors, authorization codes or tokens.
      const params = new URLSearchParams({ client_id: c.appId, client_secret: c.secret, redirect_uri: c.redirectURI, code })
      const grant = await graph(c, `/oauth/access_token?${params}`, `${c.appId}|${c.secret}`)
      if (typeof grant.access_token !== 'string' || !grant.access_token) throw fail(502, 'Meta did not return a credential')
      const token = grant.access_token
      const debug = (await graph(c, `/debug_token?input_token=${encodeURIComponent(token)}`, `${c.appId}|${c.secret}`)).data
      if (!debug?.is_valid || String(debug.app_id) !== c.appId || !Array.isArray(debug.scopes) || !requiredScopes.every(scope => debug.scopes.includes(scope)))
        throw fail(403, 'Meta authorization does not match this app or lacks comments/messaging permissions')
      const business = await graph(c, '/me?fields=client_business_id', token)
      if (!/^\d{1,40}$/.test(String(business.client_business_id || ''))) throw fail(403, 'Authorize a business integration system-user token')
      const assigned = await graph(c, '/me/assigned_instagram_accounts?fields=id,username&limit=100', token)
      const pinnedAccount = env.INSTAGRAM_ACCOUNT_ID
      // Some portfolio grants are visible in Business Suite but omitted by this
      // discovery edge. An operator-pinned ID may be verified directly; never
      // infer an ID or use this fallback for ambiguous/multiple assignments.
      const verifyPinned = Array.isArray(assigned.data) && assigned.data.length === 0 && !assigned.paging?.next && /^\d{1,40}$/.test(pinnedAccount || '')
      if (!verifyPinned && (!Array.isArray(assigned.data) || assigned.data.length !== 1 || assigned.paging?.next))
        throw fail(403, `Share only @${c.username} with this app. Meta returned ${Array.isArray(assigned.data) ? assigned.data.length : 0} assigned accounts${assigned.paging?.next ? ' and another page' : ''}.`)
      const account = verifyPinned ? await graph(c, `/${pinnedAccount}?fields=id,username`, token) : assigned.data[0]
      if (!/^\d{1,40}$/.test(String(account.id || '')) || account.username?.toLowerCase() !== c.username || pinnedAccount && String(account.id) !== pinnedAccount)
        throw fail(403, `Authorization must be for @${c.username}`)
      const expiries = [debug.expires_at, debug.data_access_expires_at].filter(value => Number.isSafeInteger(value) && value > 0)
      if (debug.expires_at !== 0 && !expiries.length || expiries.some(value => value * 1000 <= now()))
        throw fail(403, 'Meta credential lifetime could not be verified')
      const subscribed = await graph(c, `/${account.id}/subscribed_apps`, token, {
        method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ subscribed_fields: 'comments,messages' })
      })
      if (subscribed.success !== true) throw fail(502, 'Meta did not confirm the account subscription')
      const subscriptions = await graph(c, `/${account.id}/subscribed_apps?fields=id,subscribed_fields`, token)
      const fieldsPresent = item => ['comments', 'messages'].every(field => item?.subscribed_fields?.includes(field))
      const rows = subscriptions.data
      const identified = Array.isArray(rows) && rows.some(item => String(item.id) === c.appId && fieldsPresent(item))
      // Meta can return a token-scoped subscription without its app ID (also
      // observed by FinFolk). The token was independently bound to this app by
      // debug_token and to this account by its verified identity above. Accept
      // only one unambiguous anonymous row, with both fields and an independently
      // verified app-level callback. An explicit different ID is never ignored.
      const tokenScoped = Array.isArray(rows) && rows.length === 1 && !subscriptions.paging?.next && rows[0]?.id === undefined && fieldsPresent(rows[0])
      if (!identified && !tokenScoped)
        throw fail(502, 'Instagram account subscription was not verified')
      if (tokenScoped) {
        const appSubscriptions = await graph(c, `/${c.appId}/subscriptions`, `${c.appId}|${c.secret}`)
        const webhookURL = new URL('/api/instagram/webhook', c.redirectURI).href
        if (!appSubscriptions.data?.some(item => item.object === 'instagram' && item.active === true && item.callback_url === webhookURL &&
          ['comments', 'messages'].every(field => item.fields?.some(value => value.name === field))))
          throw fail(502, 'Instagram app webhook subscription was not verified')
      }
      const saved = await rpc('web_instagram_connection_save', {
        app_id: c.appId, account_id: String(account.id), username: c.username,
        credential_ciphertext: encryptInstagramCredential(token, env, String(account.id)),
        expires_at: expiries.length ? new Date(Math.min(...expiries) * 1000).toISOString() : null,
        scopes: requiredScopes
      })
      if (saved?.connected !== true) throw fail(503, 'Instagram connection was not saved')
      return response(`Connected @${c.username}. Comments and direct messages are subscribed. ${env.INSTAGRAM_DM_COMMANDS_ENABLED === 'true' ? 'DM commands /ping and /echo are enabled.' : 'No automatic replies have been enabled.'}`, 200, { 'Set-Cookie': cookie('', 0) })
    } catch (error) {
      if (!error.status) console.warn(JSON.stringify({ service: 'statstrade-instagram', stage, error_type: error.name, error_code: error.code }))
      return response(error.status ? error.message : 'Instagram connection unavailable. Create a fresh connection link and retry.', error.status || 503, { 'Set-Cookie': cookie('', 0) })
    }
  }
}
