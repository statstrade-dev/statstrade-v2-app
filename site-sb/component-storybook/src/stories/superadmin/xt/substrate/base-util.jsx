import * as node_json from '@statstrade/edge/lib/xt/substrate/base-json.jsx'

import * as node_pubsub from '@statstrade/edge/lib/xt/substrate/base-pubsub.jsx'

import * as xtd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as node_request from '@statstrade/edge/lib/xt/substrate/base-request.jsx'

import * as router from '@statstrade/edge/lib/xt/substrate/base-router.jsx'

import * as frame from '@statstrade/edge/lib/xt/substrate/base-frame.jsx'

// xt.substrate.base-util/transport-get [14] 
export function transport_get(node,transport_id){
  return (node["transports"])[transport_id];
}

// xt.substrate.base-util/transport-list [21] 
export function transport_list(node){
  return xtd.arr_sort(Object.keys(node["transports"]),function (x){
    return x;
  },function (x,y){
    return 0 > x.localeCompare(y);
  });
}

// xt.substrate.base-util/transport-send [29] 
export function transport_send(node,transport_id,frame){
  let transport = transport_get(node,transport_id);
  if(null == transport){
    throw "transport not found - " + transport_id;
  }
  let {send_fn} = transport;
  if(null == send_fn){
    throw "transport missing send_fn - " + transport_id;
  }
  return node_request.ensure_promise(send_fn(frame));
}

// xt.substrate.base-util/transport-broadcast-loop [42] 
export function transport_broadcast_loop(node,ids,frame,exclude_id,index){
  if(index >= ids.length){
    return Promise.resolve().then(function (){
      return frame;
    });
  }
  let transport_id = ids[index];
  if(transport_id == exclude_id){
    return transport_broadcast_loop(node,ids,frame,exclude_id,index + 1);
  }
  else{
    return transport_send(node,transport_id,frame).then(function (_){
      return transport_broadcast_loop(node,ids,frame,exclude_id,index + 1);
    });
  }
}

// xt.substrate.base-util/transport-request-target [57] 
export function transport_request_target(node,meta){
  if(meta["local"]){
    return null;
  }
  let target = meta["transport_id"];
  if(null != target){
    return target;
  }
  let transports = transport_list(node);
  if(0 == transports.length){
    return null;
  }
  return transports[0];
}

// xt.substrate.base-util/stream-route-loop [71] 
export function stream_route_loop(node,ids,frame,exclude_id,index){
  if(index >= ids.length){
    return Promise.resolve().then(function (){
      return frame;
    });
  }
  let transport_id = ids[index];
  if(transport_id == exclude_id){
    return stream_route_loop(node,ids,frame,exclude_id,index + 1);
  }
  else{
    return transport_send(node,transport_id,frame).then(function (_){
      return stream_route_loop(node,ids,frame,exclude_id,index + 1);
    });
  }
}

// xt.substrate.base-util/pending-await [86] 
export function pending_await(state){
  let {status} = state;
  if(status == "resolved"){
    return Promise.resolve().then(function (){
      return state["value"];
    });
  }
  else if(status == "rejected"){
    return new Promise(function (resolve,reject){
      (function (_,reject){
        reject(state["error"]);
      })(resolve,reject);
    });
  }
  else{
    return new Promise(function (resolve,reject){
      setTimeout(function (){
        new Promise(function (inner_resolve){
          inner_resolve((function (){
            return null;
          })());
        }).then(function (value){
          resolve(value);
        }).catch(function (err){
          reject(err);
        });
      },1);
    }).then(function (_){
      return pending_await(state);
    });
  }
}

// xt.substrate.base-util/request-context-merge [109] 
export function request_context_merge(request,ctx){
  ctx = (ctx || {});
  let {meta} = request;
  if(null == meta){
    meta = {};
    request["meta"] = meta;
  }
  if(null != ctx["transport_id"]){
    meta["transport_id"] = ctx["transport_id"];
  }
  return request;
}

// xt.substrate.base-util/response-ok [124] 
export function response_ok(node,request,data,meta,ctx){
  let response = frame.response_ok_frame(request["id"],request["space"],data,meta);
  let {transport_id} = ctx;
  if(null == transport_id){
    let request_meta = request["meta"];
    if(null != request_meta){
      transport_id = request_meta["transport_id"];
    }
  }
  if(null == transport_id){
    return Promise.resolve().then(function (){
      return response;
    });
  }
  else{
    return transport_send(node,transport_id,response).then(function (_){
      return response;
    });
  }
}

// xt.substrate.base-util/response-error [146] 
export function response_error(node,request,error,meta,ctx){
  let response = frame.response_error_frame(
    request["id"],
    request["space"],
    node_json.normalize_error(error),
    meta
  );
  let {transport_id} = ctx;
  if(null == transport_id){
    let request_meta = request["meta"];
    if(null != request_meta){
      transport_id = request_meta["transport_id"];
    }
  }
  if(null == transport_id){
    return Promise.resolve().then(function (){
      return response;
    });
  }
  else{
    return transport_send(node,transport_id,response).then(function (_){
      return response;
    });
  }
}

// xt.substrate.base-util/config-normalize-space [168] 
export function config_normalize_space(space_id,config){
  if(null == config){
    return null;
  }
  else if(((null != config) && ("object" == (typeof config)) && !Array.isArray(config)) && ((null != config["id"]) || (null != config["state"]) || (null != config["meta"]))){
    if((null != config["id"]) && !(config["id"] == space_id)){
      throw "space id mismatch - " + space_id;
    }
    return {"state":config["state"],"meta":config["meta"] || {}};
  }
  else{
    throw "invalid space config - " + space_id;
  }
}

// xt.substrate.base-util/config-normalize-handler [190] 
export function config_normalize_handler(action,config){
  if("function" == (typeof config)){
    return {"fn":config,"meta":{}};
  }
  else if(((null != config) && ("object" == (typeof config)) && !Array.isArray(config)) && ("function" == (typeof config["fn"]))){
    if((null != config["id"]) && !(config["id"] == action)){
      throw "handler id mismatch - " + action;
    }
    return {"fn":config["fn"],"meta":config["meta"] || {}};
  }
  else{
    throw "invalid handler config - " + action;
  }
}

// xt.substrate.base-util/config-normalize-trigger [211] 
export function config_normalize_trigger(signal,config){
  if("function" == (typeof config)){
    return {"fn":config,"meta":{}};
  }
  else if(((null != config) && ("object" == (typeof config)) && !Array.isArray(config)) && ("function" == (typeof config["fn"]))){
    if((null != config["id"]) && !(config["id"] == signal)){
      throw "trigger id mismatch - " + signal;
    }
    return {"fn":config["fn"],"meta":config["meta"] || {}};
  }
  else{
    throw "invalid trigger config - " + signal;
  }
}

// xt.substrate.base-util/node-base-opts [232] 
export function node_base_opts(opts){
  let base = Object.assign({},opts || {});
  delete(base["spaces"]);
  delete(base["handlers"]);
  delete(base["triggers"]);
  return base;
}

// xt.substrate.base-util/register-handler [242] 
export function register_handler(node,action,handler,meta){
  let entry = {"id":action,"fn":handler,"meta":meta || {}};
  node["handlers"][action] = entry;
  return entry;
}

// xt.substrate.base-util/unregister-handler [254] 
export function unregister_handler(node,action){
  let {handlers} = node;
  let prev = handlers[action];
  delete(handlers[action]);
  return prev;
}

// xt.substrate.base-util/get-handler [263] 
export function get_handler(node,action){
  return (node["handlers"])[action];
}

// xt.substrate.base-util/list-handlers [270] 
export function list_handlers(node){
  return xtd.arr_sort(Object.keys(node["handlers"]),function (x){
    return x;
  },function (x,y){
    return 0 > x.localeCompare(y);
  });
}

// xt.substrate.base-util/register-trigger [278] 
export function register_trigger(node,signal,trigger_fn,meta){
  let entry = {"id":signal,"fn":trigger_fn,"meta":meta || {}};
  node["triggers"][signal] = entry;
  return entry;
}

// xt.substrate.base-util/unregister-trigger [290] 
export function unregister_trigger(node,signal){
  let {triggers} = node;
  let prev = triggers[signal];
  delete(triggers[signal]);
  return prev;
}

// xt.substrate.base-util/get-trigger [299] 
export function get_trigger(node,signal){
  return (node["triggers"])[signal];
}

// xt.substrate.base-util/list-triggers [306] 
export function list_triggers(node){
  return xtd.arr_sort(Object.keys(node["triggers"]),function (x){
    return x;
  },function (x,y){
    return 0 > x.localeCompare(y);
  });
}

// xt.substrate.base-util/request [314] 
export function request(node,space,action,args,meta){
  meta = (meta || {});
  let request_frame = frame.request_frame(space,action,args,meta);
  let target = transport_request_target(node,meta);
  if(null == target){
    return node_request.invoke_handler(node,request_frame);
  }
  else{
    return new Promise(function (resolve,reject){
      (function (resolve,reject){
        node_request.add_pending(node,request_frame,resolve,reject,{"transport_id":target});
        try{
          return transport_send(node,target,request_frame).catch(function (err){
            node_request.remove_pending(node,request_frame["id"]);
            return reject(err);
          });
        }
        catch(err){
          node_request.remove_pending(node,request_frame["id"]);
          return reject(err);
        }
      })(resolve,reject);
    });
  }
}

// xt.substrate.base-util/publish [345] 
export function publish(node,space,signal,data,meta){
  meta = (meta || {});
  let stream = frame.stream_frame(space,signal,data,meta,meta["cause"]);
  return node_pubsub.receive_publish(node,stream).then(function (_){
    return stream_route_loop(
      node,
      router.target_ids(node,stream["space"],stream["signal"]),
      stream,
      meta["transport_id"],
      0
    );
  });
}