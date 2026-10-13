import { describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

import { createDevtoolUserHandlers } from '../src/server/devtool-users.js'

function makeClient({ createUser, getUserById, updateUserById, deleteUser, rpc, listUsers } = {}) {
  const query = {
    select: vi.fn(function () { return this }),
    eq: vi.fn(() => Promise.resolve(listUsers || { data: [], error: null })),
  }
  const schema = vi.fn((name) => {
    if (name === 'stats_type') {
      return { from: vi.fn(() => query) }
    }
    return { rpc: vi.fn(rpc || (() => Promise.resolve({ data: {}, error: null }))) }
  })

  return {
    schema,
    auth: {
      admin: {
        createUser: vi.fn(createUser || (() => Promise.resolve({ data: { user: { id: 'user-1' } }, error: null }))),
        getUserById: vi.fn(getUserById || (() => Promise.resolve({ data: { user: { user_metadata: {} } }, error: null }))),
        updateUserById: vi.fn(updateUserById || (() => Promise.resolve({ data: {}, error: null }))),
        deleteUser: vi.fn(deleteUser || (() => Promise.resolve({ data: { user: { id: 'user-1' } }, error: null }))),
      },
    },
    query,
  }
}

const env = {
  NODE_ENV: 'development',
  NEXT_SERVER_SUPABASE_URL: 'https://example.supabase.co',
  NEXT_SERVER_SUPABASE_KEY: 'service-key',
}

describe('devtool user routes', () => {
  it('returns 404 for every method outside local development without creating a client', async () => {
    const createClient = vi.fn()
    const routes = createDevtoolUserHandlers({ env: { ...env, NODE_ENV: 'production' }, createClient })

    const get = await routes.GET()
    const post = await routes.POST(new Request('http://localhost/api/debug/create-testuser', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', password: 'secret' }),
    }))
    const del = await routes.DELETE(new Request('http://localhost/api/debug/create-testuser?id=user-1', {
      method: 'DELETE',
    }))

    expect([get.status, post.status, del.status]).toEqual([404, 404, 404])
    expect(createClient).not.toHaveBeenCalled()
  })

  it('lists super users from the v2 stats_type schema', async () => {
    const data = [{ id: 'super-1', is_super: true }]
    const client = makeClient({ listUsers: { data, error: null } })
    const routes = createDevtoolUserHandlers({ env, createClient: () => client })

    const response = await routes.GET()

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ data, error: null })
    expect(client.schema).toHaveBeenCalledWith('stats_type')
    expect(client.query.eq).toHaveBeenCalledWith('is_super', true)
  })

  it('creates a verified profile, preserves onboarding state, and grants super access through server-only functions', async () => {
    const rpc = vi.fn(() => Promise.resolve({ data: {}, error: null }))
    const client = makeClient({ rpc })
    const debugGetUserByEmail = vi.fn(() => Promise.resolve({ data: { id: 'user-1' }, error: null }))
    const routes = createDevtoolUserHandlers({
      env,
      createClient: () => client,
      debugGetUserByEmail,
    })

    const response = await routes.POST(new Request('http://localhost/api/debug/create-testuser', {
      method: 'POST',
      body: JSON.stringify({
        email: 'super@example.com',
        password: 'secret',
        handle: 'super',
        is_super: true,
      }),
    }))

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ data: { id: 'user-1' }, error: null })
    expect(client.auth.admin.createUser).toHaveBeenCalledWith({
      email: 'super@example.com',
      password: 'secret',
      email_confirm: true,
      user_metadata: { handle: 'super' },
    })
    expect(client.schema).toHaveBeenCalledWith('stats_fn_super')
    expect(rpc).toHaveBeenNthCalledWith(1, 'devtools_provision_user', {
      i_user_id: 'user-1',
      i_profile: { type: 'participant', handle: 'super', 'is-onboarded': true },
      i_level: null,
      i_scopes: {},
    })
    expect(rpc).toHaveBeenNthCalledWith(2, 'devtools_set_super', { i_user_id: 'user-1' })
  })

  it('provisions onboarding accounts as incomplete without granting super access', async () => {
    const rpc = vi.fn(() => Promise.resolve({ data: {}, error: null }))
    const client = makeClient({ rpc })
    const routes = createDevtoolUserHandlers({
      env,
      createClient: () => client,
      debugGetUserByEmail: vi.fn(() => Promise.resolve({ data: { id: 'user-1' }, error: null })),
    })

    const response = await routes.POST(new Request('http://localhost/api/debug/create-testuser', {
      method: 'POST',
      body: JSON.stringify({
        email: 'onboarding@example.com',
        password: 'secret',
        handle: 'onboarding',
        is_super: true,
        onboarding: true,
      }),
    }))

    expect(response.status).toBe(200)
    expect(rpc).toHaveBeenCalledTimes(1)
    expect(rpc).toHaveBeenCalledWith('devtools_provision_user', {
      i_user_id: 'user-1',
      i_profile: { type: 'participant', handle: 'onboarding', 'is-onboarded': false },
      i_level: null,
      i_scopes: {},
    })
  })

  it('reuses an existing verified account and updates its profile without using legacy admin RPCs', async () => {
    const rpc = vi.fn(() => Promise.resolve({ data: {}, error: null }))
    const createUser = vi.fn(() => Promise.resolve({ data: null, error: { message: 'User already registered' } }))
    const debugGetIdByEmail = vi.fn(() => Promise.resolve({ data: 'user-existing', error: null }))
    const client = makeClient({ createUser, rpc })
    const routes = createDevtoolUserHandlers({
      env,
      createClient: () => client,
      debugGetIdByEmail,
      debugGetUserByEmail: vi.fn(() => Promise.resolve({ data: { id: 'user-existing' }, error: null })),
    })

    const response = await routes.POST(new Request('http://localhost/api/debug/create-testuser', {
      method: 'POST',
      body: JSON.stringify({ email: 'existing@example.com', password: 'secret', handle: 'existing' }),
    }))

    expect(response.status).toBe(200)
    expect(debugGetIdByEmail).toHaveBeenCalledWith({ email: 'existing@example.com' }, { sbClient: client })
    expect(client.auth.admin.updateUserById).toHaveBeenCalledWith('user-existing', {
      email_confirm: true,
      user_metadata: { handle: 'existing' },
    })
    expect(rpc).toHaveBeenCalledWith('devtools_provision_user', expect.objectContaining({
      i_user_id: 'user-existing',
      i_profile: { type: 'participant', handle: 'existing', 'is-onboarded': true },
    }))
    expect(rpc).toHaveBeenCalledTimes(1)
  })

  it('creates unverified Auth users without provisioning a profile', async () => {
    const rpc = vi.fn()
    const client = makeClient({ rpc })
    const routes = createDevtoolUserHandlers({ env, createClient: () => client })

    const response = await routes.POST(new Request('http://localhost/api/debug/create-testuser', {
      method: 'POST',
      body: JSON.stringify({
        email: 'unverified@example.com',
        password: 'secret',
        handle: 'unverified',
        is_verified: false,
      }),
    }))

    expect(response.status).toBe(200)
    expect(client.auth.admin.createUser).toHaveBeenCalledWith({
      email: 'unverified@example.com',
      password: 'secret',
      email_confirm: false,
    })
    expect(rpc).not.toHaveBeenCalled()
  })

  it('deletes the requested Auth user and validates that an id is supplied', async () => {
    const client = makeClient()
    const routes = createDevtoolUserHandlers({ env, createClient: () => client })

    const missingId = await routes.DELETE(new Request('http://localhost/api/debug/create-testuser', { method: 'DELETE' }))
    const response = await routes.DELETE(new Request('http://localhost/api/debug/create-testuser?id=user-1', { method: 'DELETE' }))

    expect(missingId.status).toBe(400)
    expect(await response.json()).toEqual({ data: { user: { id: 'user-1' } }, error: null })
    expect(client.auth.admin.deleteUser).toHaveBeenCalledWith('user-1', false)
  })

  it('reports missing server credentials without constructing a privileged client', async () => {
    const createClient = vi.fn()
    const routes = createDevtoolUserHandlers({
      env: { NODE_ENV: 'development' },
      createClient,
    })

    const response = await routes.GET()

    expect(response.status).toBe(500)
    expect((await response.json()).error.message).toContain('NEXT_SERVER_SUPABASE_URL')
    expect(createClient).not.toHaveBeenCalled()
  })
})
