import * as fetch from '@statstrade/edge/lib/xt/net/http-fetch.jsx'

import * as ut from '@statstrade/edge/lib/xt/net/http-util.jsx'

// xt.net.addon-supabase/wrap-supabase-auth [13] 
export function wrap_supabase_auth(handler){
  return function (client,input){
    let {defaults} = client;
    let apikey = input["apikey"] || defaults["apikey"];
    let token = input["token"] || defaults["token"];
    let headers = Object.assign(Object.assign(Object.assign({
      "Content-Type":"application/json",
      "Accept":"application/json"
    },input["headers"]),token ? {"Authorization":"Bearer " + token} : null),apikey ? {"apikey":apikey} : null);
    return handler(
      client,
      Object.assign(Object.assign({},input),{"headers":headers})
    );
  };
}

// xt.net.addon-supabase/middleware-supabase [32] 
export function middleware_supabase(){
  return [
    fetch.wrap_prepare_input,
    wrap_supabase_auth,
    fetch.wrap_normalise
  ];
}

// xt.net.addon-supabase/cmd-rpc-call [45] 
export function cmd_rpc_call(rpc_name,data,opts){
  let path = "/rest/v1/rpc/" + rpc_name;
  return Object.assign(
    {"path":path,"method":"POST","body":JSON.stringify(data || {})},
    opts
  );
}

// xt.net.addon-supabase/cmd-query-table [56] 
export function cmd_query_table(table_name,query,opts){
  let path = "/rest/v1/" + table_name + "?" + query;
  return Object.assign({"path":path,"method":"GET"},opts);
}

// xt.net.addon-supabase/cmd-storage-upload [66] 
export function cmd_storage_upload(bucket,object_path,data,opts){
  let segments = object_path.split("/");
  let encoded_parts = [];
  for(let segment of segments){
    encoded_parts.push(encodeURIComponent(segment));
  };
  let content_type = opts["content-type"] || opts["contentType"];
  let headers = Object.assign({},opts["headers"]);
  headers["x-upsert"] = String(true == opts["upsert"]);
  if(content_type){
    headers["Content-Type"] = content_type;
  }
  return Object.assign(opts,{
    "path":"/storage/v1/object/" + encodeURIComponent(bucket) + "/" + encoded_parts.join("/"),
    "method":"POST",
    "body":data,
    "headers":headers
  });
}

// xt.net.addon-supabase/cmd-health [92] 
export function cmd_health(opts){
  return Object.assign({"path":"/auth/v1/health","method":"GET"},opts);
}

// xt.net.addon-supabase/cmd-signup [101] 
export function cmd_signup(data,opts){
  return Object.assign({
    "path":"/auth/v1/signup",
    "method":"POST",
    "body":JSON.stringify(data)
  },opts);
}

// xt.net.addon-supabase/cmd-admin-create-user [111] 
export function cmd_admin_create_user(data,opts){
  return Object.assign({
    "path":"/auth/v1/admin/users",
    "method":"POST",
    "body":JSON.stringify(data)
  },opts);
}

// xt.net.addon-supabase/cmd-admin-delete-user [121] 
export function cmd_admin_delete_user(user_id,opts){
  return Object.assign(
    {"path":"/auth/v1/admin/users/" + user_id,"method":"DELETE"},
    opts
  );
}

// xt.net.addon-supabase/cmd-admin-generate-link [130] 
export function cmd_admin_generate_link(data,opts){
  return Object.assign({
    "path":"/auth/v1/admin/generate_link",
    "method":"POST",
    "body":JSON.stringify(data)
  },opts);
}

// xt.net.addon-supabase/cmd-admin-get-user [140] 
export function cmd_admin_get_user(user_id,opts){
  return Object.assign(
    {"path":"/auth/v1/admin/users/" + user_id,"method":"GET"},
    opts
  );
}

// xt.net.addon-supabase/cmd-admin-list-users [149] 
export function cmd_admin_list_users(opts){
  return Object.assign({"path":"/auth/v1/admin/users","method":"GET"},opts);
}

// xt.net.addon-supabase/cmd-admin-update-user [158] 
export function cmd_admin_update_user(user_id,opts){
  return Object.assign(
    {"path":"/auth/v1/admin/users/" + user_id,"method":"PUT"},
    opts
  );
}

// xt.net.addon-supabase/cmd-authorize [167] 
export function cmd_authorize(data,opts){
  return Object.assign({
    "path":"/auth/v1/authorize?" + ut.encode_query_params(data),
    "method":"GET"
  },opts);
}

// xt.net.addon-supabase/cmd-callback [176] 
export function cmd_callback(opts){
  return Object.assign({"path":"/auth/v1/callback","method":"GET"},opts);
}

// xt.net.addon-supabase/cmd-invite [185] 
export function cmd_invite(data,opts){
  return Object.assign({
    "path":"/auth/v1/invite",
    "method":"POST",
    "body":JSON.stringify(data)
  },opts);
}

// xt.net.addon-supabase/cmd-logout [195] 
export function cmd_logout(opts){
  return Object.assign({"path":"/auth/v1/logout","method":"POST"},opts);
}

// xt.net.addon-supabase/cmd-otp [204] 
export function cmd_otp(data,opts){
  return Object.assign({
    "path":"/auth/v1/otp",
    "method":"POST",
    "body":JSON.stringify(data)
  },opts);
}

// xt.net.addon-supabase/cmd-recovery [214] 
export function cmd_recovery(data,opts){
  return Object.assign({
    "path":"/auth/v1/recover",
    "method":"POST",
    "body":JSON.stringify(data)
  },opts);
}

// xt.net.addon-supabase/cmd-settings [224] 
export function cmd_settings(opts){
  return Object.assign({"path":"/auth/v1/settings","method":"GET"},opts);
}

// xt.net.addon-supabase/cmd-token-password [233] 
export function cmd_token_password(data,opts){
  return Object.assign({
    "path":"/auth/v1/token?grant_type=password",
    "method":"POST",
    "body":JSON.stringify(data)
  },opts);
}

// xt.net.addon-supabase/cmd-token-refresh [243] 
export function cmd_token_refresh(data,opts){
  return Object.assign({
    "path":"/auth/v1/token?grant_type=refresh_token",
    "method":"POST",
    "body":JSON.stringify(data)
  },opts);
}

// xt.net.addon-supabase/cmd-user-get [253] 
export function cmd_user_get(opts){
  return Object.assign({"path":"/auth/v1/user","method":"GET"},opts);
}

// xt.net.addon-supabase/cmd-user-put [263] 
export function cmd_user_put(data,opts){
  return Object.assign({
    "path":"/auth/v1/user",
    "method":"PUT",
    "body":JSON.stringify(data)
  },opts);
}

// xt.net.addon-supabase/cmd-verify-get [273] 
export function cmd_verify_get(data,opts){
  return Object.assign({
    "path":"/auth/v1/verify?" + ut.encode_query_params(data),
    "method":"GET"
  },opts);
}

// xt.net.addon-supabase/cmd-verify-post [282] 
export function cmd_verify_post(data,opts){
  return Object.assign({
    "path":"/auth/v1/verify",
    "method":"POST",
    "body":JSON.stringify(data)
  },opts);
}