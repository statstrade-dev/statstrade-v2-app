import { createServer } from 'node:http'
import { once } from 'node:events'
import { createPublicKey, generateKeyPairSync, randomUUID, verify } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

import { POST as start } from '../../../site/web-superadmin/src/app/api/impersonation/start/route.jsx'
import { POST as redeem } from '../../../site/web-main/src/app/api/impersonation/redeem/route.jsx'
import { GET as token } from '../../../site/web-main/src/app/api/impersonation/token/route.jsx'
import { POST as end } from '../../../site/web-main/src/app/api/impersonation/end/route.jsx'

const supabaseUrl = process.env.NEXT_SERVER_SUPABASE_URL || ''
const serviceKey = process.env.NEXT_SERVER_SUPABASE_KEY || ''
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const targetUserId = process.env.IMPERSONATION_TEST_TARGET_USER_ID || ''
const targetUserIdIsValid = /^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(targetUserId)
const actorAccessToken = process.env.IMPERSONATION_TEST_ACTOR_ACCESS_TOKEN || ''
const actorEmail = process.env.IMPERSONATION_TEST_ACTOR_EMAIL || ''
const actorPassword = process.env.IMPERSONATION_TEST_ACTOR_PASSWORD || ''
const endpointUsesHttpApi = (() => {
  try {
    return ['http:', 'https:'].includes(new URL(supabaseUrl).protocol)
  } catch {
    return false
  }
})()
const canAuthenticateActor = Boolean(actorAccessToken || (anonKey && actorEmail && actorPassword))
const liveConfigReady = Boolean(
  endpointUsesHttpApi &&
  serviceKey &&
  targetUserIdIsValid &&
  canAuthenticateActor,
)
const liveConfigMissing = [
  !endpointUsesHttpApi && 'NEXT_SERVER_SUPABASE_URL must be an HTTP or HTTPS Supabase URL',
  !serviceKey && 'NEXT_SERVER_SUPABASE_KEY',
  !targetUserIdIsValid && 'IMPERSONATION_TEST_TARGET_USER_ID must be a UUID',
  !canAuthenticateActor && 'IMPERSONATION_TEST_ACTOR_ACCESS_TOKEN or IMPERSONATION_TEST_ACTOR_EMAIL + IMPERSONATION_TEST_ACTOR_PASSWORD',
].filter(Boolean)

if (!liveConfigReady && process.env.REQUIRE_LIVE_SUPABASE_TESTS === '1') {
  throw new Error('Live impersonation test configuration is incomplete: ' + liveConfigMissing.join(', '))
}
if (!liveConfigReady) {
  console.warn('Skipping live impersonation test; configure: ' + liveConfigMissing.join(', '))
}

async function getActorToken() {
  if (actorAccessToken) return actorAccessToken

  const response = await fetch(supabaseUrl + '/auth/v1/token?grant_type=password', {
    method: 'POST',
    headers: { apikey: anonKey, 'content-type': 'application/json' },
    body: JSON.stringify({ email: actorEmail, password: actorPassword }),
  })
  if (!response.ok) {
    throw new Error('Could not sign in the configured integration actor (HTTP ' + response.status + ')')
  }
  const body = await response.json()
  if (!body.access_token) throw new Error('Supabase auth did not return an access token')
  return body.access_token
}

function serviceHeaders() {
  return {
    apikey: serviceKey,
    Authorization: 'Bearer ' + serviceKey,
    'Accept-Profile': 'stats_type',
    'Content-Profile': 'stats_type',
  }
}

async function readBody(request) {
  const chunks = []
  for await (const chunk of request) chunks.push(chunk)
  return Buffer.concat(chunks)
}

async function requestHandler(request, response, routes, origin) {
  try {
    const method = request.method || 'GET'
    const path = new URL(request.url || '/', origin).pathname
    const route = {
      '/api/impersonation/start': routes.start,
      '/api/impersonation/redeem': routes.redeem,
      '/api/impersonation/token': routes.token,
      '/api/impersonation/end': routes.end,
    }[path]
    if (!route) {
      response.statusCode = 404
      response.end()
      return
    }

    const headers = new Headers()
    for (const [name, value] of Object.entries(request.headers)) {
      if (['connection', 'content-length', 'host', 'transfer-encoding'].includes(name)) continue
      if (typeof value === 'string') headers.set(name, value)
      else if (Array.isArray(value)) headers.set(name, value.join(', '))
    }
    const body = method === 'GET' || method === 'HEAD' ? undefined : await readBody(request)
    const webRequest = new Request(new URL(request.url || '/', origin), {
      method,
      headers,
      ...(body && body.length ? { body } : {}),
    })
    const result = await route(webRequest)
    response.statusCode = result.status
    result.headers.forEach((value, name) => response.setHeader(name, value))
    response.end(await result.text())
  } catch (error) {
    response.statusCode = 500
    response.end(error instanceof Error ? error.message : 'HTTP test harness failed')
  }
}

async function withLiveServer(run) {
  const originalProcessEnv = { ...process.env }
  const accessToken = await getActorToken()
  const actorResponse = await fetch(supabaseUrl + '/auth/v1/user', {
    headers: { apikey: serviceKey, Authorization: 'Bearer ' + accessToken },
  })
  if (!actorResponse.ok) {
    throw new Error('Could not verify the configured integration actor (HTTP ' + actorResponse.status + ')')
  }
  const actor = await actorResponse.json()
  const actorId = actor.id
  if (!actorId) throw new Error('Supabase auth did not return the actor id')
  if (actorId === targetUserId) throw new Error('The integration target must differ from the superadmin actor')

  const { privateKey, publicKey } = generateKeyPairSync('ec', { namedCurve: 'prime256v1' })
  const privateJwk = { ...privateKey.export({ format: 'jwk' }), kid: 'impersonation-http-test' }
  const publicJwk = publicKey.export({ format: 'jwk' })
  const reason = 'HTTP integration ' + randomUUID()
  const env = {
    ...process.env,
    NODE_ENV: 'test',
    NEXT_SERVER_SUPABASE_URL: supabaseUrl,
    NEXT_SERVER_SUPABASE_KEY: serviceKey,
    SUPABASE_IMPERSONATION_PRIVATE_JWK: JSON.stringify(privateJwk),
  }
  let origin = ''
  let routes
  const server = createServer((request, response) => {
    void requestHandler(request, response, routes, origin)
  })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const address = server.address()
  origin = 'http://127.0.0.1:' + address.port
  env.NEXT_PUBLIC_SITE_URL = origin
  env.NEXT_PUBLIC_WEB_MAIN_URL = origin
  env.NEXT_PUBLIC_WEB_SUPERADMIN_URL = origin
  Object.assign(process.env, env)
  routes = { start, redeem, token, end }

  const request = (path, { method = 'GET', body, headers = {} } = {}) => fetch(origin + path, {
    method,
    headers: {
      origin,
      ...(body === undefined ? {} : { 'content-type': 'application/json' }),
      ...headers,
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  })
  const filter = new URLSearchParams({
    tag: 'eq.super_impersonation',
    user_id: 'eq.' + actorId,
    'data->>reason': 'eq.' + reason,
  })
  const cleanup = async () => {
    const result = await fetch(supabaseUrl + '/rest/v1/Op?' + filter.toString(), {
      method: 'DELETE',
      headers: { ...serviceHeaders(), Prefer: 'return=minimal' },
    })
    if (!result.ok) {
      throw new Error('Could not remove the live test audit row (HTTP ' + result.status + ')')
    }
  }

  try {
    await run({ actorId, accessToken, targetUserId, reason, request, publicJwk, origin })
  } finally {
    try {
      await cleanup()
    } finally {
      try {
        server.closeAllConnections()
        await new Promise((resolve, reject) => {
          server.close((error) => error ? reject(error) : resolve())
        })
      } finally {
        for (const key of Object.keys(process.env)) {
          if (!Object.prototype.hasOwnProperty.call(originalProcessEnv, key)) delete process.env[key]
        }
        Object.assign(process.env, originalProcessEnv)
      }
    }
  }
}

function decodeJwt(token) {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString('utf8'))
}

let fetchMock
describe("generated superadmin start route", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_SERVER_SUPABASE_URL", "http://supabase.test")
    vi.stubEnv("NEXT_SERVER_SUPABASE_KEY", "server-key")
    vi.stubEnv("NEXT_PUBLIC_WEB_MAIN_URL", "https://web.example")
    vi.stubEnv("NEXT_PUBLIC_WEB_SUPERADMIN_URL", "https://super.example")
    fetchMock = vi.fn(async (input, init = {}) => {
      const url = new URL(String(input))
      if (url.pathname === "/auth/v1/user") return Response.json({ id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" })
      if (url.pathname === "/rest/v1/User") {
        return Response.json(url.searchParams.get("select") === "id,is_super"
          ? [{ id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", is_super: true }]
          : [{ id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb" }])
      }
      if (url.pathname === "/rest/v1/Op") return new Response(null, { status: 201 })
      throw new Error("Unexpected Supabase request: " + url.pathname)
    })
    vi.stubGlobal("fetch", fetchMock)
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })
  it("authenticates, validates the target, and persists an audit ticket", async () => {
    const response = await start(new Request("https://super.example/api/impersonation/start", {
      method: "POST",
      headers: {
        origin: "https://super.example",
        authorization: "Bearer actor-token",
        "content-type": "application/json",
      },
      body: JSON.stringify({ target_user_id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb", reason: "Support case 1234" }),
    }))
    expect(response.status).toBe(200)
    const result = await response.json()
    expect(result.redeem_url).toBe("https://web.example/api/impersonation/redeem")
    expect(result.ticket).toMatch(/^[A-Za-z0-9_-]{40,}$/)
    const auditCall = fetchMock.mock.calls.find(([input, init]) =>
      new URL(String(input)).pathname === "/rest/v1/Op" && init.method === "POST")
    expect(auditCall).toBeDefined()
    const [audit] = JSON.parse(auditCall[1].body)
    expect(audit).toMatchObject({
      tag: "super_impersonation",
      user_id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      data: {
        kind: "impersonation_ticket",
        status: "pending",
        target_user_id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
        reason: "Support case 1234",
      },
    })
    expect(audit.data.ticket_hash).not.toBe(result.ticket)
  })
  it("rejects a missing actor token before querying Supabase", async () => {
    const response = await start(new Request("https://super.example/api/impersonation/start", {
      method: "POST",
      headers: { origin: "https://super.example", "content-type": "application/json" },
      body: JSON.stringify({ target_user_id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb", reason: "Support case 1234" }),
    }))
    expect(response.status).toBe(401)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})

describe("superadmin start route behavior", () => {
  it("authenticates the actor and creates a hashed audit ticket", async () => {
    vi.stubEnv("NEXT_SERVER_SUPABASE_URL", "http://supabase.test")
    vi.stubEnv("NEXT_SERVER_SUPABASE_KEY", "server-key")
    vi.stubEnv("NEXT_PUBLIC_WEB_MAIN_URL", "https://web.example")
    vi.stubEnv("NEXT_PUBLIC_WEB_SUPERADMIN_URL", "https://super.example")
    const fetchMock = vi.fn(async (input, init = {}) => {
      const url = new URL(String(input))
      if (url.pathname === "/auth/v1/user") return Response.json({ id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" })
      if (url.pathname === "/rest/v1/User") return Response.json(url.searchParams.get("select") === "id,is_super" ? [{ id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", is_super: true }] : [{ id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb" }])
      if (url.pathname === "/rest/v1/Op") return new Response(null, { status: 201 })
      throw new Error("Unexpected Supabase request: " + url.pathname)
    })
    vi.stubGlobal("fetch", fetchMock)
    try {
      const response = await start(new Request("https://super.example/api/impersonation/start", { method: "POST", headers: { origin: "https://super.example", authorization: "Bearer actor-token", "content-type": "application/json" }, body: JSON.stringify({ target_user_id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb", reason: "Support case 1234" }) }))
      expect(response.status).toBe(200)
      const result = await response.json()
      expect(result.redeem_url).toBe("https://web.example/api/impersonation/redeem")
      expect(result.ticket).toMatch(/^[A-Za-z0-9_-]{40,}$/)
      const auditCall = fetchMock.mock.calls.find(([input, init]) => new URL(String(input)).pathname === "/rest/v1/Op" && init.method === "POST")
      const [audit] = JSON.parse(auditCall[1].body)
      expect(audit).toMatchObject({ tag: "super_impersonation", user_id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", data: { kind: "impersonation_ticket", status: "pending", target_user_id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb", reason: "Support case 1234" } })
      expect(audit.data.ticket_hash).not.toBe(result.ticket)
    } finally {
      vi.unstubAllGlobals()
      vi.unstubAllEnvs()
    }
  })
})

describe("generated superadmin start route", () => {
  it("requires a signed-in actor", async () => {
    vi.stubEnv("NEXT_PUBLIC_WEB_SUPERADMIN_URL", "https://super.example")
    try {
      const response = await start(new Request("https://super.example/api/impersonation/start", { method: "POST", headers: { origin: "https://super.example", "content-type": "application/json" }, body: JSON.stringify({ target_user_id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb", reason: "Support case 1234" }) }))
      expect(response.status).toBe(401)
    } finally { vi.unstubAllEnvs() }
  })
})

const liveDescribe = liveConfigReady ? describe : describe.skip
liveDescribe('superadmin impersonation routes over HTTP with live Supabase', () => {
  it('authenticates, creates and redeems a one-use ticket, signs a scoped JWT, and ends the audit session', async () => {
    await withLiveServer(async ({ actorId, accessToken, targetUserId, reason, request, publicJwk, origin }) => {
      const responseMissingBearer = await request('/api/impersonation/start', {
        method: 'POST',
        body: { target_user_id: targetUserId, reason },
      })
      expect(responseMissingBearer.status).toBe(401)

      const invalidTarget = await request('/api/impersonation/start', {
        method: 'POST',
        headers: { authorization: 'Bearer ' + accessToken },
        body: { target_user_id: randomUUID(), reason },
      })
      expect(invalidTarget.status).toBe(404)

      const started = await request('/api/impersonation/start', {
        method: 'POST',
        headers: { authorization: 'Bearer ' + accessToken },
        body: { target_user_id: targetUserId, reason },
      })
      expect(started.status).toBe(200)
      const startBody = await started.json()
      expect(startBody.ticket).toMatch(/^[A-Za-z0-9_-]{40,}$/)
      expect(startBody.redeem_url).toBe(origin + '/api/impersonation/redeem')
      expect(startBody.ticket_hash).toBeUndefined()

      const auditQuery = new URLSearchParams({
        select: 'id,user_id,data,tag',
        tag: 'eq.super_impersonation',
        user_id: 'eq.' + actorId,
        'data->>reason': 'eq.' + reason,
        limit: '1',
      })
      const auditResponse = await fetch(supabaseUrl + '/rest/v1/Op?' + auditQuery.toString(), {
        headers: serviceHeaders(),
      })
      expect(auditResponse.status).toBe(200)
      const [audit] = await auditResponse.json()
      expect(audit).toMatchObject({
        user_id: actorId,
        tag: 'super_impersonation',
        data: {
          kind: 'impersonation_ticket',
          status: 'pending',
          target_user_id: targetUserId,
          reason,
        },
      })
      expect(audit.data.ticket_hash).not.toBe(startBody.ticket)

      const redeemed = await request('/api/impersonation/redeem', {
        method: 'POST',
        body: { ticket: startBody.ticket },
      })
      expect(redeemed.status).toBe(303)
      const cookie = redeemed.headers.get('set-cookie')
      expect(cookie).toContain('HttpOnly')
      expect(cookie).toContain('SameSite=Lax')
      const activeResponse = await fetch(supabaseUrl + '/rest/v1/Op?' + auditQuery.toString(), {
        headers: serviceHeaders(),
      })
      const [activeAudit] = await activeResponse.json()
      expect(activeAudit.data.status).toBe('active')

      const tokenResponse = await request('/api/impersonation/token', {
        headers: { cookie: cookie.split(';')[0] },
      })
      expect(tokenResponse.status).toBe(200)
      const tokenBody = await tokenResponse.json()
      const [headerPart, payloadPart, signaturePart] = tokenBody.token.split('.')
      const header = JSON.parse(Buffer.from(headerPart, 'base64url').toString('utf8'))
      const payload = decodeJwt(tokenBody.token)
      const publicKeyObject = createPublicKey({ key: publicJwk, format: 'jwk' })
      expect(header).toEqual({ alg: 'ES256', typ: 'JWT', kid: 'impersonation-http-test' })
      expect(payload).toMatchObject({
        sub: targetUserId,
        role: 'authenticated',
        aud: 'authenticated',
        statstrade_impersonation: { actor_id: actorId, session_id: audit.id },
      })
      expect(verify('sha256', Buffer.from(headerPart + '.' + payloadPart), {
        key: publicKeyObject,
        dsaEncoding: 'ieee-p1363',
      }, Buffer.from(signaturePart, 'base64url'))).toBe(true)

      const replay = await request('/api/impersonation/redeem', {
        method: 'POST',
        body: { ticket: startBody.ticket },
      })
      expect(replay.status).toBe(410)

      const ended = await request('/api/impersonation/end', {
        method: 'POST',
        headers: { cookie: cookie.split(';')[0] },
      })
      expect(ended.status).toBe(303)
      expect(ended.headers.get('set-cookie')).toContain('Max-Age=0')

      const endedResponse = await fetch(supabaseUrl + '/rest/v1/Op?' + auditQuery.toString(), {
        headers: serviceHeaders(),
      })
      const [endedAudit] = await endedResponse.json()
      expect(endedAudit.data.status).toBe('ended')
      expect(endedAudit.data.ended_at).toMatch(/Z$/)
    })
  })
})