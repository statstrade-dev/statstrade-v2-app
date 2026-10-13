import * as proxy_util from '@statstrade/edge/lib/xt/db/node/proxy-util.jsx'

// xt.db.node.client-supabase/sign-up [21] 
export function sign_up(node,service_id,credentials,opts){
  return proxy_util.request_client(
    node,
    "@xt.supabase/sign-up",
    [service_id,credentials,opts || {}],
    opts
  );
}

// xt.db.node.client-supabase/sign-in [30] 
export function sign_in(node,service_id,credentials,opts){
  return proxy_util.request_client(
    node,
    "@xt.supabase/sign-in",
    [service_id,credentials,opts || {}],
    opts
  );
}

// xt.db.node.client-supabase/sign-out [39] 
export function sign_out(node,service_id,opts){
  return proxy_util.request_client(node,"@xt.supabase/sign-out",[service_id,opts || {}],opts);
}

// xt.db.node.client-supabase/refresh [48] 
export function refresh(node,service_id,opts){
  return proxy_util.request_client(node,"@xt.supabase/refresh",[service_id],opts);
}

// xt.db.node.client-supabase/signed-in? [57] 
export function signed_inp(node,service_id,opts){
  return proxy_util.request_client(node,"@xt.supabase/signed-in?",[service_id],opts);
}

// xt.db.node.client-supabase/current-session [66] 
export function current_session(node,service_id,opts){
  return proxy_util.request_client(node,"@xt.supabase/current-session",[service_id],opts);
}

// xt.db.node.client-supabase/rpc-call [75] 
export function rpc_call(node,service_id,rpc_name,data,opts){
  return proxy_util.request_client(
    node,
    "@xt.supabase/rpc-call",
    [service_id,rpc_name,data || {},opts || {}],
    opts
  );
}

// xt.db.node.client-supabase/query-table [84] 
export function query_table(node,service_id,table_name,query,opts){
  return proxy_util.request_client(
    node,
    "@xt.supabase/query-table",
    [service_id,table_name,query,opts || {}],
    opts
  );
}

// xt.db.node.client-supabase/storage-upload [93] 
export function storage_upload(node,service_id,bucket,object_path,data,opts){
  return proxy_util.request_client(
    node,
    "@xt.supabase/storage-upload",
    [service_id,bucket,object_path,data,opts || {}],
    opts
  );
}

// xt.db.node.client-supabase/attach-model [102] 
export function attach_model(node,service_id,page_args,supabase_handler,model,opts){
  return proxy_util.request_client(
    node,
    "@xt.supabase/attach-model",
    [service_id,page_args,supabase_handler,model],
    opts
  );
}

// xt.db.node.client-supabase/health [111] 
export function health(node,service_id,opts){
  return proxy_util.request_client(node,"@xt.supabase/health",[service_id,opts || {}],opts);
}

// xt.db.node.client-supabase/admin-create-user [120] 
export function admin_create_user(node,service_id,data,opts){
  return proxy_util.request_client(
    node,
    "@xt.supabase/admin-create-user",
    [service_id,data,opts || {}],
    opts
  );
}

// xt.db.node.client-supabase/admin-delete-user [129] 
export function admin_delete_user(node,service_id,user_id,opts){
  return proxy_util.request_client(
    node,
    "@xt.supabase/admin-delete-user",
    [service_id,user_id,opts || {}],
    opts
  );
}

// xt.db.node.client-supabase/admin-generate-link [138] 
export function admin_generate_link(node,service_id,data,opts){
  return proxy_util.request_client(
    node,
    "@xt.supabase/admin-generate-link",
    [service_id,data,opts || {}],
    opts
  );
}

// xt.db.node.client-supabase/admin-get-user [147] 
export function admin_get_user(node,service_id,user_id,opts){
  return proxy_util.request_client(
    node,
    "@xt.supabase/admin-get-user",
    [service_id,user_id,opts || {}],
    opts
  );
}

// xt.db.node.client-supabase/admin-list-users [156] 
export function admin_list_users(node,service_id,opts){
  return proxy_util.request_client(
    node,
    "@xt.supabase/admin-list-users",
    [service_id,opts || {}],
    opts
  );
}

// xt.db.node.client-supabase/admin-update-user [165] 
export function admin_update_user(node,service_id,user_id,opts){
  return proxy_util.request_client(
    node,
    "@xt.supabase/admin-update-user",
    [service_id,user_id,opts || {}],
    opts
  );
}

// xt.db.node.client-supabase/authorize [174] 
export function authorize(node,service_id,data,opts){
  return proxy_util.request_client(
    node,
    "@xt.supabase/authorize",
    [service_id,data,opts || {}],
    opts
  );
}

// xt.db.node.client-supabase/callback [183] 
export function callback(node,service_id,opts){
  return proxy_util.request_client(node,"@xt.supabase/callback",[service_id,opts || {}],opts);
}

// xt.db.node.client-supabase/invite [192] 
export function invite(node,service_id,data,opts){
  return proxy_util.request_client(node,"@xt.supabase/invite",[service_id,data,opts || {}],opts);
}

// xt.db.node.client-supabase/otp [201] 
export function otp(node,service_id,data,opts){
  return proxy_util.request_client(node,"@xt.supabase/otp",[service_id,data,opts || {}],opts);
}

// xt.db.node.client-supabase/recovery [210] 
export function recovery(node,service_id,data,opts){
  return proxy_util.request_client(node,"@xt.supabase/recovery",[service_id,data,opts || {}],opts);
}

// xt.db.node.client-supabase/settings [219] 
export function settings(node,service_id,opts){
  return proxy_util.request_client(node,"@xt.supabase/settings",[service_id,opts || {}],opts);
}

// xt.db.node.client-supabase/token-refresh [228] 
export function token_refresh(node,service_id,data,opts){
  return proxy_util.request_client(
    node,
    "@xt.supabase/token-refresh",
    [service_id,data,opts || {}],
    opts
  );
}

// xt.db.node.client-supabase/user-get [237] 
export function user_get(node,service_id,opts){
  return proxy_util.request_client(node,"@xt.supabase/user-get",[service_id,opts || {}],opts);
}

// xt.db.node.client-supabase/user-info [246] 
export function user_info(node,service_id,opts){
  return user_get(node,service_id,opts);
}

// xt.db.node.client-supabase/user-put [253] 
export function user_put(node,service_id,data,opts){
  return proxy_util.request_client(node,"@xt.supabase/user-put",[service_id,data,opts || {}],opts);
}

// xt.db.node.client-supabase/verify-get [262] 
export function verify_get(node,service_id,data,opts){
  return proxy_util.request_client(
    node,
    "@xt.supabase/verify-get",
    [service_id,data,opts || {}],
    opts
  );
}

// xt.db.node.client-supabase/verify-post [271] 
export function verify_post(node,service_id,data,opts){
  return proxy_util.request_client(
    node,
    "@xt.supabase/verify-post",
    [service_id,data,opts || {}],
    opts
  );
}