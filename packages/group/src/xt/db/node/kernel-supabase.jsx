import * as xtd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as page_core from '@statstrade/edge/lib/xt/substrate/page-core.jsx'

import * as addon from '@statstrade/edge/lib/xt/net/addon-supabase.jsx'

import * as http_fetch from '@statstrade/edge/lib/xt/net/http-fetch.jsx'

import * as http_util from '@statstrade/edge/lib/xt/net/http-util.jsx'

import * as session from '@statstrade/edge/lib/xt/db/system/impl-supabase-session.jsx'

import * as substrate from '@statstrade/edge/lib/xt/substrate.jsx'

// xt.db.node.kernel-supabase/supabase-rpc-error-detail [16] 
export function supabase_rpc_error_detail(body){
  let detail = body["details"] || body["detail"];
  if("string" == (typeof detail)){
    try{
      return JSON.parse(detail);
    }
    catch(err){
      return detail;
    }
  }
  else{
    return detail;
  }
}

// xt.db.node.kernel-supabase/supabase-error-data [31] 
export function supabase_error_data(response){
  let {body,status} = response;
  let detail = supabase_rpc_error_detail(body);
  let data = body;
  if(((null != detail) && ("object" == (typeof detail)) && !Array.isArray(detail)) && ("gw.rpc.error" == detail["type"])){
    data = detail;
  }
  if((null != data) && ("object" == (typeof data)) && !Array.isArray(data)){
    data["status"] = status;
    if(null == data["http_status"]){
      data["http_status"] = status;
    }
  }
  return data;
}

// xt.db.node.kernel-supabase/supabase-response-data [47] 
export function supabase_response_data(response){
  let {body,status} = response;
  if(status && (status >= 400)){
    let data = supabase_error_data(response);
    throw Object.assign(new Error(
      data["message"] || data["msg"] || data["error_description"] || data["error"] || body["message"] || body["msg"] || body["error_description"] || body["error"] || "Supabase request failed"
    ),{"data":data});
  }
  return http_util.get_body_data(response);
}

// xt.db.node.kernel-supabase/supabase-request [66] 
export function supabase_request(node,service_id,cmd){
  return Promise.resolve().then(function (){
    return substrate.get_service(node,service_id);
  }).then(function (impl){
    let {client} = impl;
    return http_fetch.request_http(client,cmd).then(supabase_response_data);
  });
}

// xt.db.node.kernel-supabase/supabase-sign-up-handler [79] 
export function supabase_sign_up_handler(space,args,request,node){
  let service_id = args[0];
  let credentials = args[1];
  let opts = args[2] || {};
  return Promise.resolve().then(function (){
    return substrate.get_service(node,service_id);
  }).then(function (impl){
    let {client} = impl;
    return http_fetch.request_http(client,addon.cmd_signup(credentials,opts)).then(supabase_response_data).then(function (session){
      session.set_session(impl,session);
      session.auto_refresh_start(impl);
      return session;
    });
  });
}

// xt.db.node.kernel-supabase/supabase-sign-in-handler [101] 
export function supabase_sign_in_handler(space,args,request,node){
  let service_id = args[0];
  let credentials = args[1];
  let opts = args[2] || {};
  return Promise.resolve().then(function (){
    return substrate.get_service(node,service_id);
  }).then(function (impl){
    let {client} = impl;
    return http_fetch.request_http(client,addon.cmd_token_password(credentials,opts)).then(supabase_response_data).then(function (session){
      session.set_session(impl,session);
      session.auto_refresh_start(impl);
      return session;
    });
  });
}

// xt.db.node.kernel-supabase/supabase-sign-out-handler [123] 
export function supabase_sign_out_handler(space,args,request,node){
  let service_id = args[0];
  let opts = args[1] || {};
  return Promise.resolve().then(function (){
    return substrate.get_service(node,service_id);
  }).then(function (impl){
    session.auto_refresh_stop(impl);
    let {client} = impl;
    return http_fetch.request_http(client,addon.cmd_logout(opts)).then(function (_){
      session.set_session(impl,null);
      return {"status":"ok"};
    });
  });
}

// xt.db.node.kernel-supabase/supabase-refresh-handler [148] 
export function supabase_refresh_handler(space,args,request,node){
  let service_id = args[0];
  return Promise.resolve().then(function (){
    return substrate.get_service(node,service_id);
  }).then(function (impl){
    return session.refresh_session(impl);
  });
}

// xt.db.node.kernel-supabase/supabase-signed-in-handler [160] 
export function supabase_signed_in_handler(space,args,request,node){
  let service_id = args[0];
  let impl = substrate.get_service(node,service_id);
  return null != session.get_session(impl);
}

// xt.db.node.kernel-supabase/supabase-current-session-handler [169] 
export function supabase_current_session_handler(space,args,request,node){
  let service_id = args[0];
  let impl = substrate.get_service(node,service_id);
  return session.get_session(impl);
}

// xt.db.node.kernel-supabase/supabase-rpc-call-handler [178] 
export function supabase_rpc_call_handler(space,args,request,node){
  let service_id = args[0];
  let rpc_name = args[1];
  let data = args[2] || {};
  let opts = args[3] || {};
  return supabase_request(node,service_id,addon.cmd_rpc_call(rpc_name,data,opts));
}

// xt.db.node.kernel-supabase/supabase-query-table-handler [190] 
export function supabase_query_table_handler(space,args,request,node){
  let service_id = args[0];
  let table_name = args[1];
  let query = args[2];
  let opts = args[3] || {};
  return supabase_request(node,service_id,addon.cmd_query_table(table_name,query,opts));
}

// xt.db.node.kernel-supabase/supabase-storage-upload-handler [202] 
export function supabase_storage_upload_handler(space,args,request,node){
  let service_id = args[0];
  let bucket = args[1];
  let object_path = args[2];
  let data = args[3];
  let opts = args[4] || {};
  return supabase_request(
    node,
    service_id,
    addon.cmd_storage_upload(bucket,object_path,data,opts)
  );
}

// xt.db.node.kernel-supabase/supabase-health-handler [217] 
export function supabase_health_handler(space,args,request,node){
  let service_id = args[0];
  let opts = args[1] || {};
  return supabase_request(node,service_id,addon.cmd_health(opts));
}

// xt.db.node.kernel-supabase/supabase-admin-create-user-handler [227] 
export function supabase_admin_create_user_handler(space,args,request,node){
  let service_id = args[0];
  let data = args[1];
  let opts = args[2] || {};
  return supabase_request(node,service_id,addon.cmd_admin_create_user(data,opts));
}

// xt.db.node.kernel-supabase/supabase-admin-delete-user-handler [238] 
export function supabase_admin_delete_user_handler(space,args,request,node){
  let service_id = args[0];
  let user_id = args[1];
  let opts = args[2] || {};
  return supabase_request(node,service_id,addon.cmd_admin_delete_user(user_id,opts));
}

// xt.db.node.kernel-supabase/supabase-admin-generate-link-handler [249] 
export function supabase_admin_generate_link_handler(space,args,request,node){
  let service_id = args[0];
  let data = args[1];
  let opts = args[2] || {};
  return supabase_request(node,service_id,addon.cmd_admin_generate_link(data,opts));
}

// xt.db.node.kernel-supabase/supabase-admin-get-user-handler [260] 
export function supabase_admin_get_user_handler(space,args,request,node){
  let service_id = args[0];
  let user_id = args[1];
  let opts = args[2] || {};
  return supabase_request(node,service_id,addon.cmd_admin_get_user(user_id,opts));
}

// xt.db.node.kernel-supabase/supabase-admin-list-users-handler [271] 
export function supabase_admin_list_users_handler(space,args,request,node){
  let service_id = args[0];
  let opts = args[1] || {};
  return supabase_request(node,service_id,addon.cmd_admin_list_users(opts));
}

// xt.db.node.kernel-supabase/supabase-admin-update-user-handler [281] 
export function supabase_admin_update_user_handler(space,args,request,node){
  let service_id = args[0];
  let user_id = args[1];
  let opts = args[2] || {};
  return supabase_request(node,service_id,addon.cmd_admin_update_user(user_id,opts));
}

// xt.db.node.kernel-supabase/supabase-authorize-handler [292] 
export function supabase_authorize_handler(space,args,request,node){
  let service_id = args[0];
  let data = args[1];
  let opts = args[2] || {};
  return supabase_request(node,service_id,addon.cmd_authorize(data,opts));
}

// xt.db.node.kernel-supabase/supabase-callback-handler [303] 
export function supabase_callback_handler(space,args,request,node){
  let service_id = args[0];
  let opts = args[1] || {};
  return supabase_request(node,service_id,addon.cmd_callback(opts));
}

// xt.db.node.kernel-supabase/supabase-invite-handler [313] 
export function supabase_invite_handler(space,args,request,node){
  let service_id = args[0];
  let data = args[1];
  let opts = args[2] || {};
  return supabase_request(node,service_id,addon.cmd_invite(data,opts));
}

// xt.db.node.kernel-supabase/supabase-otp-handler [324] 
export function supabase_otp_handler(space,args,request,node){
  let service_id = args[0];
  let data = args[1];
  let opts = args[2] || {};
  return supabase_request(node,service_id,addon.cmd_otp(data,opts));
}

// xt.db.node.kernel-supabase/supabase-recovery-handler [335] 
export function supabase_recovery_handler(space,args,request,node){
  let service_id = args[0];
  let data = args[1];
  let opts = args[2] || {};
  return supabase_request(node,service_id,addon.cmd_recovery(data,opts));
}

// xt.db.node.kernel-supabase/supabase-settings-handler [346] 
export function supabase_settings_handler(space,args,request,node){
  let service_id = args[0];
  let opts = args[1] || {};
  return supabase_request(node,service_id,addon.cmd_settings(opts));
}

// xt.db.node.kernel-supabase/supabase-token-refresh-handler [356] 
export function supabase_token_refresh_handler(space,args,request,node){
  let service_id = args[0];
  let data = args[1];
  let opts = args[2] || {};
  return supabase_request(node,service_id,addon.cmd_token_refresh(data,opts));
}

// xt.db.node.kernel-supabase/supabase-user-get-handler [367] 
export function supabase_user_get_handler(space,args,request,node){
  let service_id = args[0];
  let opts = args[1] || {};
  let impl = substrate.get_service(node,service_id);
  let session = session.get_session(impl);
  if(null != session){
    return {"user":session["user"]};
  }
  else{
    return supabase_request(node,service_id,addon.cmd_user_get(opts));
  }
}

// xt.db.node.kernel-supabase/supabase-user-put-handler [381] 
export function supabase_user_put_handler(space,args,request,node){
  let service_id = args[0];
  let data = args[1];
  let opts = args[2] || {};
  return supabase_request(node,service_id,addon.cmd_user_put(data,opts));
}

// xt.db.node.kernel-supabase/supabase-verify-get-handler [392] 
export function supabase_verify_get_handler(space,args,request,node){
  let service_id = args[0];
  let data = args[1];
  let opts = args[2] || {};
  return supabase_request(node,service_id,addon.cmd_verify_get(data,opts));
}

// xt.db.node.kernel-supabase/supabase-verify-post-handler [403] 
export function supabase_verify_post_handler(space,args,request,node){
  let service_id = args[0];
  let data = args[1];
  let opts = args[2] || {};
  return supabase_request(node,service_id,addon.cmd_verify_post(data,opts));
}

// xt.db.node.kernel-supabase/supabase-create-model [418] 
export function supabase_create_model(service_id,supabase_handler,model){
  let {defaults,options,pipeline} = model;
  let model_handler = function (context){
    let {node} = context;
    let cmd = ("function" == (typeof supabase_handler)) ? supabase_handler(context) : supabase_handler;
    return supabase_request(node,service_id,cmd);
  };
  return {
    "handler":model_handler,
    "pipeline":xtd.obj_assign_nested({"remote":{"handler":model_handler}},pipeline),
    "defaults":defaults,
    "options":options
  };
}

// xt.db.node.kernel-supabase/supabase-attach-model [440] 
export function supabase_attach_model(space,args,request,node){
  let service_id = args[0];
  let page_args = args[1];
  let supabase_handler = args[2];
  let model = args[3];
  let {group_id,model_id,space_id} = page_args;
  let model_spec = supabase_create_model(service_id,supabase_handler,model);
  page_core.group_add_attach(node,space_id,group_id,{[model_id]:model_spec});
  return {
    "status":"attached",
    "space":space_id,
    "group":group_id,
    "model":model_id
  };
}

// xt.db.node.kernel-supabase/init-handlers [462] 
export function init_handlers(node){
  substrate.register_handler(node,"@xt.supabase/sign-up",supabase_sign_up_handler,null);
  substrate.register_handler(node,"@xt.supabase/sign-in",supabase_sign_in_handler,null);
  substrate.register_handler(node,"@xt.supabase/sign-out",supabase_sign_out_handler,null);
  substrate.register_handler(node,"@xt.supabase/refresh",supabase_refresh_handler,null);
  substrate.register_handler(node,"@xt.supabase/signed-in?",supabase_signed_in_handler,null);
  substrate.register_handler(
    node,
    "@xt.supabase/current-session",
    supabase_current_session_handler,
    null
  );
  substrate.register_handler(node,"@xt.supabase/rpc-call",supabase_rpc_call_handler,null);
  substrate.register_handler(
    node,
    "@xt.supabase/query-table",
    supabase_query_table_handler,
    null
  );
  substrate.register_handler(
    node,
    "@xt.supabase/storage-upload",
    supabase_storage_upload_handler,
    null
  );
  substrate.register_handler(node,"@xt.supabase/health",supabase_health_handler,null);
  substrate.register_handler(
    node,
    "@xt.supabase/admin-create-user",
    supabase_admin_create_user_handler,
    null
  );
  substrate.register_handler(
    node,
    "@xt.supabase/admin-delete-user",
    supabase_admin_delete_user_handler,
    null
  );
  substrate.register_handler(
    node,
    "@xt.supabase/admin-generate-link",
    supabase_admin_generate_link_handler,
    null
  );
  substrate.register_handler(
    node,
    "@xt.supabase/admin-get-user",
    supabase_admin_get_user_handler,
    null
  );
  substrate.register_handler(
    node,
    "@xt.supabase/admin-list-users",
    supabase_admin_list_users_handler,
    null
  );
  substrate.register_handler(
    node,
    "@xt.supabase/admin-update-user",
    supabase_admin_update_user_handler,
    null
  );
  substrate.register_handler(node,"@xt.supabase/authorize",supabase_authorize_handler,null);
  substrate.register_handler(node,"@xt.supabase/callback",supabase_callback_handler,null);
  substrate.register_handler(node,"@xt.supabase/invite",supabase_invite_handler,null);
  substrate.register_handler(node,"@xt.supabase/otp",supabase_otp_handler,null);
  substrate.register_handler(node,"@xt.supabase/recovery",supabase_recovery_handler,null);
  substrate.register_handler(node,"@xt.supabase/settings",supabase_settings_handler,null);
  substrate.register_handler(
    node,
    "@xt.supabase/token-refresh",
    supabase_token_refresh_handler,
    null
  );
  substrate.register_handler(node,"@xt.supabase/user-get",supabase_user_get_handler,null);
  substrate.register_handler(node,"@xt.supabase/user-info",supabase_user_get_handler,null);
  substrate.register_handler(node,"@xt.supabase/user-put",supabase_user_put_handler,null);
  substrate.register_handler(
    node,
    "@xt.supabase/verify-get",
    supabase_verify_get_handler,
    null
  );
  substrate.register_handler(
    node,
    "@xt.supabase/verify-post",
    supabase_verify_post_handler,
    null
  );
  substrate.register_handler(node,"@xt.supabase/attach-model",supabase_attach_model,null);
  return node;
}