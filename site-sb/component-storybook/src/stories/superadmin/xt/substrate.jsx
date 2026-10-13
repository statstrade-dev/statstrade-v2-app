import * as node_pubsub from '@statstrade/edge/lib/xt/substrate/base-pubsub.jsx'

import * as event_common from '@statstrade/edge/lib/xt/event/base-listener.jsx'

import * as page_proxy from '@statstrade/edge/lib/xt/substrate/page-proxy.jsx'

import * as node_request from '@statstrade/edge/lib/xt/substrate/base-request.jsx'

import * as util_handlers from '@statstrade/edge/lib/xt/substrate/base-util-handlers.jsx'

import * as router from '@statstrade/edge/lib/xt/substrate/base-router.jsx'

import * as frame from '@statstrade/edge/lib/xt/substrate/base-frame.jsx'

import * as base_util from '@statstrade/edge/lib/xt/substrate/base-util.jsx'

import * as page from '@statstrade/edge/lib/xt/substrate/page-core.jsx'

import * as node_space from '@statstrade/edge/lib/xt/substrate/base-space.jsx'

// xt.substrate/create-space [18] 
export var create_space = node_space.create_space;

// xt.substrate/get-space [19] 
export var get_space = node_space.get_space;

// xt.substrate/list-spaces [20] 
export var list_spaces = node_space.list_spaces;

// xt.substrate/get-space-state [21] 
export var get_space_state = node_space.get_space_state;

// xt.substrate/set-space-state [22] 
export var set_space_state = node_space.set_space_state;

// xt.substrate/update-space-state [23] 
export var update_space_state = node_space.update_space_state;

// xt.substrate/page-space-get [24] 
export var page_space_get = page.space_get_page;

// xt.substrate/page-space-ensure [25] 
export var page_space_ensure = page.space_ensure_page;

// xt.substrate/page-space-set [26] 
export var page_space_set = page.space_set_page;

// xt.substrate/page-group-get [27] 
export var page_group_get = page.group_get;

// xt.substrate/page-group-ensure [28] 
export var page_group_ensure = page.group_ensure;

// xt.substrate/page-model-ensure [29] 
export var page_model_ensure = page.model_ensure;

// xt.substrate/page-group-add-attach [30] 
export var page_group_add_attach = page.group_add_attach;

// xt.substrate/page-group-add [31] 
export var page_group_add = page.group_add;

// xt.substrate/page-group-remove [32] 
export var page_group_remove = page.group_remove;

// xt.substrate/page-model-remove [33] 
export var page_model_remove = page.model_remove;

// xt.substrate/page-group-update [34] 
export var page_group_update = page.group_update;

// xt.substrate/page-model-update [35] 
export var page_model_update = page.model_update;

// xt.substrate/page-model-set-input [36] 
export var page_model_set_input = page.model_set_input;

// xt.substrate/page-group-trigger [37] 
export var page_group_trigger = page.group_trigger;

// xt.substrate/page-model-trigger [38] 
export var page_model_trigger = page.model_trigger;

// xt.substrate/page-space-trigger-all [39] 
export var page_space_trigger_all = page.space_trigger_all;

// xt.substrate/page-raw-callback-add [40] 
export var page_raw_callback_add = page.raw_callback_add;

// xt.substrate/page-raw-callback-remove [41] 
export var page_raw_callback_remove = page.raw_callback_remove;

// xt.substrate/page-proxy-install [42] 
export var page_proxy_install = page_proxy.install;

// xt.substrate/page-proxy-list [43] 
export var page_proxy_list = page_proxy.group_list_proxy;

// xt.substrate/page-proxy-open [44] 
export var page_proxy_open = page_proxy.group_open_proxy;

// xt.substrate/page-proxy-close [45] 
export var page_proxy_close = page_proxy.group_close_proxy;

// xt.substrate/page-proxy-call [46] 
export var page_proxy_call = page_proxy.model_proxy_call;

// xt.substrate/page-proxy-sync [47] 
export var page_proxy_sync = page_proxy.group_sync_proxy;

// xt.substrate/node? [245] 
export function nodep(obj){
  return ((null != obj) && ("object" == (typeof obj)) && !Array.isArray(obj)) && ("substrate" == obj["::"]);
}

// xt.substrate/transport? [253] 
export function transportp(obj){
  return ((null != obj) && ("object" == (typeof obj)) && !Array.isArray(obj)) && ("substrate.transport" == obj["::"]);
}

// xt.substrate/transport-create [261] 
export function transport_create(transport_id,impl){
  return Object.assign(
    {"::":"substrate.transport","id":transport_id,"listener":null},
    impl || {}
  );
}

// xt.substrate/get-services [272] 
export function get_services(node){
  return node["services"] || {};
}

// xt.substrate/get-service [279] 
export function get_service(node,service_id){
  return (get_services(node))[service_id];
}

// xt.substrate/set-service [285] 
export function set_service(node,service_id,service){
  node["services"][service_id] = service;
  return service;
}

// xt.substrate/remove-service [294] 
export function remove_service(node,service_id){
  let service = get_service(node,service_id);
  delete(node["services"][service_id]);
  return service;
}

// xt.substrate/transport-get [303] 
export function transport_get(node,transport_id){
  return base_util.transport_get(node,transport_id);
}

// xt.substrate/transport-list [309] 
export function transport_list(node){
  return base_util.transport_list(node);
}

// xt.substrate/transport-send [315] 
export function transport_send(node,transport_id,frame){
  return base_util.transport_send(node,transport_id,frame);
}

// xt.substrate/list-subscriptions [321] 
export function list_subscriptions(node,space,signal){
  return router.list_subscriptions(node,space,signal);
}

// xt.substrate/publish [327] 
export function publish(node,space,signal,data,meta){
  return base_util.publish(node,space,signal,data,meta);
}

// xt.substrate/list-triggers [333] 
export function list_triggers(node){
  return base_util.list_triggers(node);
}

// xt.substrate/register-trigger [339] 
export function register_trigger(node,signal,trigger_fn,meta){
  return base_util.register_trigger(node,signal,trigger_fn,meta);
}

// xt.substrate/get-trigger [345] 
export function get_trigger(node,signal){
  return base_util.get_trigger(node,signal);
}

// xt.substrate/unregister-handler [351] 
export function unregister_handler(node,action){
  return base_util.unregister_handler(node,action);
}

// xt.substrate/unregister-trigger [357] 
export function unregister_trigger(node,signal){
  return base_util.unregister_trigger(node,signal);
}

// xt.substrate/get-handler [363] 
export function get_handler(node,action){
  return base_util.get_handler(node,action);
}

// xt.substrate/list-handlers [369] 
export function list_handlers(node){
  return base_util.list_handlers(node);
}

// xt.substrate/register-handler [375] 
export function register_handler(node,action,handler,meta){
  return base_util.register_handler(node,action,handler,meta);
}

// xt.substrate/request [381] 
export function request(node,space,action,args,meta){
  return base_util.request(node,space,action,args,meta);
}

// xt.substrate/broadcast-transport [387] 
export function broadcast_transport(node,frame,exclude_id){
  return base_util.transport_broadcast_loop(node,transport_list(node),frame,exclude_id,0);
}

// xt.substrate/route-stream [397] 
export function route_stream(node,stream,exclude_id){
  return base_util.stream_route_loop(
    node,
    router.target_ids(node,stream["space"],stream["signal"]),
    stream,
    exclude_id,
    0
  );
}

// xt.substrate/receive-request [409] 
export function receive_request(node,request,ctx){
  ctx = (ctx || {});
  base_util.request_context_merge(request,ctx);
  try{
    return node_request.invoke_handler(node,request).then(function (data){
      return base_util.response_ok(node,request,data,null,ctx);
    }).catch(function (err){
      return base_util.response_error(node,request,err,null,ctx);
    });
  }
  catch(err){
    return base_util.response_error(node,request,err,null,ctx);
  }
}

// xt.substrate/receive-response [427] 
export function receive_response(node,response){
  node_request.settle_pending(node,response);
  return Promise.resolve().then(function (){
    return response;
  });
}

// xt.substrate/subscribe [434] 
export function subscribe(node,space,signal,subscription_id,meta){
  meta = (meta || {});
  let event = router.subscribe_frame(space,signal,subscription_id,meta);
  let target = base_util.transport_request_target(node,meta);
  if(null == target){
    return Promise.resolve().then(function (){
      return event;
    });
  }
  else{
    return transport_send(node,target,event).then(function (_){
      return event;
    });
  }
}

// xt.substrate/unsubscribe [449] 
export function unsubscribe(node,space,signal,subscription_id,meta){
  meta = (meta || {});
  let event = router.unsubscribe_frame(space,signal,subscription_id,meta);
  let target = base_util.transport_request_target(node,meta);
  if(null == target){
    return Promise.resolve().then(function (){
      return event;
    });
  }
  else{
    return transport_send(node,target,event).then(function (_){
      return event;
    });
  }
}

// xt.substrate/receive-publish [464] 
export function receive_publish(node,stream,ctx){
  ctx = (ctx || {});
  return node_pubsub.receive_publish(node,stream).then(function (_){
    return route_stream(node,stream,ctx["transport_id"]);
  });
}

// xt.substrate/receive-frame [477] 
export function receive_frame(node,event,ctx){
  let {kind} = event;
  if(kind == "request"){
    return receive_request(node,event,ctx);
  }
  else if(kind == "response"){
    return receive_response(node,event);
  }
  else if(kind == "stream"){
    return receive_publish(node,event,ctx);
  }
  else if(kind == "subscribe"){
    return router.receive_subscribe(node,event,ctx);
  }
  else if(kind == "unsubscribe"){
    return router.receive_unsubscribe(node,event,ctx);
  }
  else{
    return Promise.resolve().then(function (){
      return event;
    });
  }
}

// xt.substrate/attach-transport [500] 
export function attach_transport(node,transport_id,transport){
  transport = (transportp(transport) ? transport : transport_create(transport_id,transport));
  node["transports"][transport_id] = transport;
  router.register_connection(node,transport_id,{"meta":transport["meta"]});
  let {start_fn} = transport;
  if(null == start_fn){
    return Promise.resolve().then(function (){
      return transport;
    });
  }
  return node_request.ensure_promise(start_fn(function (event,ctx){
    ctx = (ctx || {});
    if(null == ctx["transport_id"]){
      ctx["transport_id"] = transport_id;
    }
    return receive_frame(node,event,ctx);
  })).then(function (listener){
    transport["listener"] = listener;
    return transport;
  });
}

// xt.substrate/detach-transport [529] 
export function detach_transport(node,transport_id){
  let {transports} = node;
  let transport = transports[transport_id];
  if(null == transport){
    return Promise.resolve().then(function (){
      return null;
    });
  }
  delete(transports[transport_id]);
  router.unregister_connection(node,transport_id);
  let {stop_fn} = transport;
  if(null == stop_fn){
    return Promise.resolve().then(function (){
      return transport;
    });
  }
  return node_request.ensure_promise(stop_fn(transport["listener"])).then(function (_){
    return transport;
  });
}

// xt.substrate/node-configure [549] 
export function node_configure(node,opts){
  opts = (opts || {});
  util_handlers.install_util_handlers(node);
  for(let [space_id,config] of Object.entries(opts["spaces"] || {})){
    node_space.create_space(
      node,
      space_id,
      base_util.config_normalize_space(space_id,config)
    );
  };
  for(let [action,config] of Object.entries(opts["handlers"] || {})){
    let entry = base_util.config_normalize_handler(action,config);
    register_handler(node,action,entry["fn"],entry["meta"]);
  };
  for(let [signal,config] of Object.entries(opts["triggers"] || {})){
    let entry = base_util.config_normalize_trigger(signal,config);
    register_trigger(node,signal,entry["fn"],entry["meta"]);
  };
  return node;
}

// xt.substrate/node-create [573] 
export function node_create(opts){
  opts = (opts || {});
  let node = event_common.blank_container("substrate",Object.assign({
    "meta":opts["meta"] || {},
    "router":{"connections":{},"subscriptions":{}},
    "pending":{},
    "handlers":{},
    "triggers":{},
    "spaces":{},
    "id":opts["id"] || frame.rand_id("node-",6),
    "transports":{},
    "services":{}
  },base_util.node_base_opts(opts)));
  node_configure(node,opts);
  return node;
}