import * as sb from '@statstrade/edge/remote/util-supabase'

// statsui.edge.remote.api-debug/debug-get-id-by-email
export function debug_get_id_by_email({email},options = {}){
  return sb.callRemoteDebug("debug_get_id_by_email",{email},options);
}

// statsui.edge.remote.api-debug/debug-get-user-by-email
export function debug_get_user_by_email({email},options = {}){
  return sb.callRemoteDebug("debug_get_user_by_email",{email},options);
}

// statsui.edge.remote.api-debug/debug-get-users-by-email
export function debug_get_users_by_email({emails},options = {}){
  return sb.callRemoteDebug("debug_get_users_by_email",{emails},options);
}

// statsui.edge.remote.api-debug/debug-set-user-data
export function debug_set_user_data({uid,data},options = {}){
  return sb.callRemoteDebug("debug_set_user_data",{data,uid},options);
}

// statsui.edge.remote.api-debug/debug-verify-user-email
export function debug_verify_user_email({email},options = {}){
  return sb.callRemoteDebug("debug_verify_user_email",{email},options);
}
