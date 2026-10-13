import * as xtd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

// xt.event.util-throttle/throttle-create [27] 
export function throttle_create(handler,now_fn){
  return {
    "now_fn":(null == now_fn) ? (function (){
        return Date.now();
      }) : now_fn,
    "handler":handler,
    "active":{},
    "queued":{}
  };
}

// xt.event.util-throttle/throttle-run-async [36] 
export function throttle_run_async(throttle,id,args){
  let {active,handler,queued} = throttle;
  let key = String(id);
  args = xtd.arrayify(args);
  let inputs = [id];
  for(let arg of args){
    inputs.push(arg);
  };
  let base_promise = Promise.resolve().then(function (){
    return handler.apply(null,inputs);
  });
  return base_promise.finally(function (){
    delete(active[key]);
    let qentry = queued[key];
    if(null != qentry){
      active[key] = qentry;
      delete(queued[key]);
      throttle_run_async(throttle,id,qentry["args"]);
    }
  });
}

// xt.event.util-throttle/throttle-run [63] 
export function throttle_run(throttle,id,args){
  let {active,now_fn,queued} = throttle;
  let key = String(id);
  args = xtd.arrayify(args);
  let qentry = queued[key];
  if(null != qentry){
    return qentry;
  }
  let aentry = active[key];
  if(null != aentry){
    qentry = {
      "promise":aentry["promise"],
      "started":now_fn(),
      "args":aentry["args"]
    };
    queued[key] = qentry;
    return qentry;
  }
  aentry = {"promise":null,"started":now_fn(),"args":args};
  active[key] = aentry;
  let promise = throttle_run_async(throttle,id,args);
  aentry["promise"] = promise;
  return aentry;
}

// xt.event.util-throttle/throttle-waiting [88] 
export function throttle_waiting(throttle){
  let {active,queued} = throttle;
  return xtd.arr_union(Object.keys(active),Object.keys(queued));
}

// xt.event.util-throttle/throttle-active [96] 
export function throttle_active(throttle){
  let {active} = throttle;
  return Object.keys(active);
}

// xt.event.util-throttle/throttle-queued [103] 
export function throttle_queued(throttle){
  let {queued} = throttle;
  return Object.keys(queued);
}