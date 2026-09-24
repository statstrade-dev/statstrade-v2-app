import * as sb from '@statstrade/edge/remote/util-supabase.jsx'

// statsui.edge.remote.api-debug/debug-get-id-by-email [8] 
export function debug_get_id_by_email({email},options = {}){
  return sb.callRemoteDebug("debug_get_id_by_email",{"email":email},options);
}

// statsui.edge.remote.api-debug/debug-get-user-by-email [15] 
export function debug_get_user_by_email({email},options = {}){
  return sb.callRemoteDebug("debug_get_user_by_email",{"email":email},options);
}

// statsui.edge.remote.api-debug/debug-get-users-by-email [22] 
export function debug_get_users_by_email({emails},options = {}){
  return sb.callRemoteDebug("debug_get_users_by_email",{"emails":emails},options);
}

// statsui.edge.remote.api-debug/debug-set-user-data [29] 
export function debug_set_user_data({uid,data},options = {}){
  return sb.callRemoteDebug("debug_set_user_data",{"data":data,"uid":uid},options);
}

// statsui.edge.remote.api-debug/debug-verify-user-email [36] 
export function debug_verify_user_email({email},options = {}){
  return sb.callRemoteDebug("debug_verify_user_email",{"email":email},options);
}