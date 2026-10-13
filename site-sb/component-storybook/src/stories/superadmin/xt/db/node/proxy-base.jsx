import * as xtd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as page_proxy from '@statstrade/edge/lib/xt/substrate/page-proxy.jsx'

import * as proxy_util from '@statstrade/edge/lib/xt/db/node/proxy-util.jsx'

import * as substrate from '@statstrade/edge/lib/xt/substrate.jsx'

// xt.db.node.proxy-base/CALL_ACTIONS [25] 
export var CALL_ACTIONS = [
  "@xt.db/kernel-init",
  "@xt.db/kernel-setup",
  "@xt.db/kernel-teardown",
  "@xt.db/subscribe-db",
  "@xt.db/unsubscribe-db",
  "@xt.db/sync-cached",
  "@xt.db/rpc-call",
  "@xt.db/pull-call",
  "@xt.db/pull-cached",
  "@xt.db/dataview-call",
  "@xt.db/dataview-cached"
];

// xt.db.node.proxy-base/ATTACH_ACTIONS [38] 
export var ATTACH_ACTIONS = [
  "@xt.db/attach-model",
  "@xt.db/rpc-attach-model",
  "@xt.db/pull-attach-model",
  "@xt.db/dataview-attach-model"
];

// xt.db.node.proxy-base/DETACH_ACTIONS [44] 
export var DETACH_ACTIONS = ["@xt.db/detach-model"];

// xt.db.node.proxy-base/request-proxy [47] 
export function request_proxy(space,args,request,node){
  return proxy_util.request_proxy(space,args,request,node);
}

// xt.db.node.proxy-base/attach-forward-handler [53] 
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

// xt.db.node.proxy-base/detach-forward-handler [76] 
export function detach_forward_handler(space,args,request,node){
  let page_args = args[1];
  let space_id = xtd.get_in(page_args,["space_id"]);
  let group_id = xtd.get_in(page_args,["group_id"]);
  let transport_id = proxy_util.get_transport_id(node,xtd.get_in(request,["meta"]));
  return page_proxy.group_close_proxy(node,space_id,group_id,{"transport_id":transport_id}).then(function (_){
    return substrate.request(node,null,request["action"],args,{"transport_id":transport_id});
  });
}

// xt.db.node.proxy-base/init-proxy-handlers [95] 
export function init_proxy_handlers(node){
  for(let action of CALL_ACTIONS){
    substrate.register_handler(node,action,request_proxy,null);
  };
  for(let action of ATTACH_ACTIONS){
    substrate.register_handler(node,action,attach_forward_handler,null);
  };
  for(let action of DETACH_ACTIONS){
    substrate.register_handler(node,action,detach_forward_handler,null);
  };
  return node;
}