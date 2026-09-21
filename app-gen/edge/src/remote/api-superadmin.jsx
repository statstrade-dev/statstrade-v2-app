import * as sb from '@statstrade/edge/remote/util-supabase'

// statsui.edge.remote.api-superadmin/admin-set-global
export function admin_set_global({key,value},options = {}){
  return sb.callRemote("admin_set_global",{key,value},options);
}

// statsui.edge.remote.api-superadmin/admin-set-handle
export function admin_set_handle({uid,handle},options = {}){
  return sb.callRemote("admin_set_handle",{handle,uid},options);
}

// statsui.edge.remote.api-superadmin/admin-set-super
export function admin_set_super({uid,value},options = {}){
  return sb.callRemote("admin_set_super",{uid,value},options);
}
