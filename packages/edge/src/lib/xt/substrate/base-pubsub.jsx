import * as router from '@statstrade/edge/lib/xt/substrate/base-router.jsx'

import * as space from '@statstrade/edge/lib/xt/substrate/base-space.jsx'

// xt.substrate.base-pubsub/subscribe [32] 
export function subscribe(node,space,signal,subscription_id,meta){
  return router.subscribe_frame(space,signal,subscription_id,meta);
}

// xt.substrate.base-pubsub/unsubscribe [41] 
export function unsubscribe(node,space,signal,subscription_id,meta){
  return router.unsubscribe_frame(space,signal,subscription_id,meta);
}

// xt.substrate.base-pubsub/invoke-trigger [50] 
export function invoke_trigger(node,stream){
  let {signal} = stream;
  let entry = (node["triggers"])[signal];
  if(null == entry){
    return Promise.resolve().then(function (){
      return null;
    });
  }
  let current_space = space.ensure_space(node,stream["space"],null);
  let trigger_fn = entry["fn"];
  let output = trigger_fn(current_space,stream,node);
  if(output instanceof Promise){
    return output;
  }
  else{
    return Promise.resolve().then(function (){
      return output;
    });
  }
}

// xt.substrate.base-pubsub/receive-publish [68] 
export function receive_publish(node,stream){
  space.ensure_space(node,stream["space"],null);
  return invoke_trigger(node,stream).then(function (_){
    return stream;
  });
}