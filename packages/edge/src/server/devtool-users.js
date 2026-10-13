import 'server-only'

import * as SupabaseClient from '@supabase/supabase-js'

import * as api_debug from '@statstrade/edge/remote/api-debug'

function errorValue(error, fallback) {
  if (error && typeof error === 'object') {
    return {
      message: error.message || fallback,
      ...(error.code ? { code: error.code } : {}),
    }
  }
  return { message: error ? String(error) : fallback }
}

function errorResponse(error, status, fallback) {
  return Response.json(
    { data: null, error: errorValue(error, fallback) },
    { status },
  )
}

export function createDevtoolUserHandlers({
  env = process.env,
  createClient = SupabaseClient.createClient,
  debugGetIdByEmail = api_debug.debug_get_id_by_email,
  debugGetUserByEmail = api_debug.debug_get_user_by_email,
} = {}) {
  function unavailable() {
    if (env.NODE_ENV === 'development') return null
    return Response.json({ error: 'Not Found' }, { status: 404 })
  }

  function getSupabase() {
    let url = env.NEXT_SERVER_SUPABASE_URL
    let key = env.NEXT_SERVER_SUPABASE_KEY
    if (!url || !key) {
      throw new Error(
        'NEXT_SERVER_SUPABASE_URL and NEXT_SERVER_SUPABASE_KEY are required for the debug API',
      )
    }
    return createClient(url, key)
  }

  async function GET() {
    let blocked = unavailable()
    if (blocked) return blocked

    try {
      let Supabase = getSupabase()
      let { data, error } = await Supabase.schema('stats_type')
        .from('User')
        .select()
        .eq('is_super', true)
      if (error) return errorResponse(error, 500, 'Could not list super users')
      return Response.json({ data, error: null })
    } catch (error) {
      return errorResponse(error, 500, 'Could not list super users')
    }
  }

  async function POST(request) {
    let blocked = unavailable()
    if (blocked) return blocked

    let input
    try {
      input = await request.json()
    } catch (error) {
      return errorResponse(error, 400, 'Invalid JSON body')
    }

    let { email, handle, is_super, is_verified, onboarding, password } = input || {}
    if (typeof email !== 'string' || !email.trim() || typeof password !== 'string' || !password) {
      return errorResponse(null, 400, 'Email and password are required')
    }

    let profileHandle = typeof handle === 'string' ? handle.trim() : ''
    if (!profileHandle) profileHandle = email.split('@')[0]
    if (profileHandle.length < 2) {
      return errorResponse(null, 400, 'A handle with at least two characters is required')
    }

    try {
      let Supabase = getSupabase()
      let verified = is_verified !== false
      let createOptions = {
        email,
        password,
        email_confirm: verified,
      }
      if (verified && handle && !onboarding) {
        createOptions.user_metadata = { handle: profileHandle }
      }

      let { data: created, error: createError } = await Supabase.auth.admin.createUser(createOptions)

      // Preserve the v1 unverified-account workflow: create the Auth identity
      // and return before provisioning a durable profile.
      if (!verified) {
        return Response.json(
          { data: created, error: createError },
          { status: createError ? 409 : 200 },
        )
      }

      let uid = created?.user?.id
      if (createError) {
        let existing = await debugGetIdByEmail({ email }, { sbClient: Supabase })
        uid = existing?.data
        if (existing?.error || !uid) {
          return errorResponse(
            existing?.error || createError,
            409,
            'Could not find the existing test account',
          )
        }

        let { data: authResult, error: authLookupError } = await Supabase.auth.admin.getUserById(uid)
        if (authLookupError) {
          return errorResponse(authLookupError, 500, 'Could not load the existing test account')
        }

        let update = { email_confirm: true }
        if (handle && !onboarding) {
          update.user_metadata = {
            ...(authResult?.user?.user_metadata || {}),
            handle: profileHandle,
          }
        }
        let { error: updateError } = await Supabase.auth.admin.updateUserById(uid, update)
        if (updateError) {
          return errorResponse(updateError, 500, 'Could not update the existing test account')
        }
      }

      if (!uid) return errorResponse(null, 500, 'Auth did not return a user id')

      let { error: profileError } = await Supabase.schema('stats_fn_super').rpc(
        'devtools_provision_user',
        {
          i_user_id: uid,
          i_profile: {
            type: 'participant',
            handle: profileHandle,
            'is-onboarded': !onboarding,
          },
          i_level: null,
          i_scopes: {},
        },
      )
      if (profileError) {
        return errorResponse(profileError, 500, 'Could not provision the test account profile')
      }

      // The server-only helper upserts the existing grant when an account is
      // seeded again, avoiding the legacy admin RPCs used by v1.
      if (is_super && !onboarding) {
        let { error: superError } = await Supabase.schema('stats_fn_super').rpc(
          'devtools_set_super',
          { i_user_id: uid },
        )
        if (superError) {
          return errorResponse(superError, 500, 'Could not grant superuser access')
        }
      }

      let result = await debugGetUserByEmail({ email }, { sbClient: Supabase })
      if (result?.error) return errorResponse(result.error, 500, 'Could not read the test account')
      return Response.json(result)
    } catch (error) {
      return errorResponse(error, 500, 'Could not create the test account')
    }
  }

  async function DELETE(request) {
    let blocked = unavailable()
    if (blocked) return blocked

    let id = new URL(request.url).searchParams.get('id')
    if (!id) return errorResponse(null, 400, 'A user id is required')

    try {
      let result = await getSupabase().auth.admin.deleteUser(id, false)
      if (result.error) return errorResponse(result.error, 400, 'Could not delete the test account')
      return Response.json(result)
    } catch (error) {
      return errorResponse(error, 500, 'Could not delete the test account')
    }
  }

  return { GET, POST, DELETE }
}

export const { GET, POST, DELETE } = createDevtoolUserHandlers()
