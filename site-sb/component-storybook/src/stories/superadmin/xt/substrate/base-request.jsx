import * as space from '@statstrade/edge/lib/xt/substrate/base-space.jsx'

// xt.substrate.base-request/ensure-promise [53] 
export function ensure_promise(value){
  if((value instanceof Promise) || (((null != value) && ("object" == (typeof value)) && !Array.isArray(value)) && ("function" == (typeof value["then"])))){
    return value;
  }
  else{
    return Promise.resolve().then(function (){
      return value;
    });
  }
}

// xt.substrate.base-request/add-pending [63] 
export function add_pending(node,request,resolve,reject,meta){
  let {pending} = node;
  let {id} = request;
  let entry = {
    "resolve":resolve,
    "reject":reject,
    "request":request,
    "meta":meta || {}
  };
  pending[id] = entry;
  return entry;
}

// xt.substrate.base-request/remove-pending [76] 
export function remove_pending(node,request_id){
  let {pending} = node;
  let entry = pending[request_id];
  delete(pending[request_id]);
  return entry;
}

// xt.substrate.base-request/settle-pending [85] 
export function settle_pending(node,response){
  let {reply_to} = response;
  let entry = remove_pending(node,reply_to);
  if(null == entry){
    return null;
  }
  let {reject,resolve} = entry;
  if(response["status"] == "ok"){
    resolve(response["data"]);
  }
  else{
    reject(response);
  }
  return entry;
}

// xt.substrate.base-request/invoke-handler [99] 
export function invoke_handler(node,request){
  let {action} = request;
  let entry = (node["handlers"])[action];
  if(null == entry){
    throw "handler not found - " + action;
  }
  let handler = entry["fn"];
  let current_space = space.ensure_space(node,request["space"],null);
  return ensure_promise(
    handler.apply(null,[current_space,request["args"],request,node])
  );
}

// xt.substrate.base-request/response-body [120] 
export function response_body(response){
  return ensure_promise(response).then(function (frame){
    if(frame["status"] == "ok"){
      return frame["data"];
    }
    else{
      throw frame;
    }
  });
}