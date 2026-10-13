import * as xtd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as substrate from '@statstrade/edge/lib/xt/substrate.jsx'

// xt.db.node.proxy-util/set-default-transport [22] 
export function set_default_transport(node,transport_id){
  xtd.set_in(
    node,
    ["state","adaptor_proxy","default_transport_id"],
    transport_id
  );
  return transport_id;
}

// xt.db.node.proxy-util/get-default-transport [29] 
export function get_default_transport(node){
  return xtd.get_in(node,["state","adaptor_proxy","default_transport_id"]);
}

// xt.db.node.proxy-util/get-transport-id [35] 
export function get_transport_id(node,opts){
  return xtd.get_in(opts,["transport_id"]) || get_default_transport(node) || (substrate.transport_list(node))[0];
}

// xt.db.node.proxy-util/request-meta [43] 
export function request_meta(node,request){
  let transport_id = get_transport_id(node,request);
  return {"transport_id":transport_id};
}

// xt.db.node.proxy-util/request-proxy [50] 
export function request_proxy(space,args,request,node){
  return substrate.request(node,null,request["action"],args,request_meta(node,request));
}

// xt.db.node.proxy-util/request-client [61] 
export function request_client(node,action,args,opts){
  let local_meta = {};
  local_meta["local"] = true;
  return substrate.get_handler(node,action) ? substrate.request(node,null,action,args,local_meta) : substrate.request(node,null,action,args,request_meta(node,opts));
}