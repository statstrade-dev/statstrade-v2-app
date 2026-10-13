import * as xtd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as page_proxy from '@statstrade/edge/lib/xt/substrate/page-proxy.jsx'

import * as proxy_util from '@statstrade/edge/lib/xt/db/node/proxy-util.jsx'

import * as substrate from '@statstrade/edge/lib/xt/substrate.jsx'

// xt.db.node.proxy-supabase/ACTIONS [12] 
export var ACTIONS = [
  "@xt.supabase/sign-up",
  "@xt.supabase/sign-in",
  "@xt.supabase/sign-out",
  "@xt.supabase/refresh",
  "@xt.supabase/signed-in?",
  "@xt.supabase/current-session",
  "@xt.supabase/rpc-call",
  "@xt.supabase/query-table",
  "@xt.supabase/health",
  "@xt.supabase/admin-create-user",
  "@xt.supabase/admin-delete-user",
  "@xt.supabase/admin-generate-link",
  "@xt.supabase/admin-get-user",
  "@xt.supabase/admin-list-users",
  "@xt.supabase/admin-update-user",
  "@xt.supabase/authorize",
  "@xt.supabase/callback",
  "@xt.supabase/invite",
  "@xt.supabase/otp",
  "@xt.supabase/recovery",
  "@xt.supabase/settings",
  "@xt.supabase/token-refresh",
  "@xt.supabase/user-get",
  "@xt.supabase/user-info",
  "@xt.supabase/user-put",
  "@xt.supabase/verify-get",
  "@xt.supabase/verify-post"
];

// xt.db.node.proxy-supabase/ATTACH_ACTIONS [41] 
export var ATTACH_ACTIONS = ["@xt.supabase/attach-model"];

// xt.db.node.proxy-supabase/attach-forward-handler [44] 
export function attach_forward_handler(space,args,request,node){
  let page_args = args[1];
  let space_id = xtd.get_in(page_args,["space_id"]);
  let group_id = xtd.get_in(page_args,["group_id"]);
  let transport_id = proxy_util.get_transport_id(node,xtd.get_in(request,["meta"]));
  page_proxy.group_create_proxy(node,space_id,group_id,{},{"transport_id":transport_id});
  return substrate.request(node,null,request["action"],args,{"transport_id":transport_id}).then(function (status){
    return page_proxy.group_open_proxy(node,space_id,group_id,{"transport_id":transport_id}).then(function (_){
      return status;
    });
  });
}

// xt.db.node.proxy-supabase/init-proxy-handlers [67] 
export function init_proxy_handlers(node){
  for(let action of ACTIONS){
    substrate.register_handler(node,action,proxy_util.request_proxy,null);
  };
  for(let action of ATTACH_ACTIONS){
    substrate.register_handler(node,action,attach_forward_handler,null);
  };
  return node;
}