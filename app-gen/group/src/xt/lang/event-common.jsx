import * as k from '@statstrade/edge/lib/xt/lang/base-lib'

// xt.lang.event-common/blank-container [7] 
export function blank_container(type_name,opts){
  let container = k.obj_assign({"::":type_name,"listeners":{}},opts);
  return container;
}

// xt.lang.event-common/make-container [17] 
export function make_container(initial,type_name,opts){
  let initialFn = k.fnp(initial) ? initial : (function (){
    return initial;
  });
  let data = initialFn();
  let container = k.obj_assign(
    {"::":type_name,"data":data,"initial":initialFn,"listeners":{}},
    opts
  );
  return container;
}

// xt.lang.event-common/make-listener-entry [33] 
export function make_listener_entry(listener_id,listener_type,callback,meta,pred){
  return {
    "callback":callback,
    "meta":k.obj_assign(
        {"listener/id":listener_id,"listener/type":listener_type},
        meta
      ),
    "pred":pred
  };
}

// xt.lang.event-common/clear-listeners [45] 
export function clear_listeners(container){
  let {listeners} = container;
  container["listeners"] = {};
  return listeners;
}

// xt.lang.event-common/add-listener [53] 
export function add_listener(container,listener_id,listener_type,callback,meta,pred){
  let {listeners} = container;
  let entry = make_listener_entry(listener_id,listener_type,callback,meta,pred);
  listeners[listener_id] = entry;
  return entry;
}

// xt.lang.event-common/remove-listener [62] 
export function remove_listener(container,listener_id){
  let {listeners} = container;
  let entry = listeners[listener_id];
  delete(listeners[listener_id]);
  return entry;
}

// xt.lang.event-common/list-listeners [71] 
export function list_listeners(container){
  let {listeners} = container;
  return k.obj_keys(listeners);
}

// xt.lang.event-common/list-listener-types [78] 
export function list_listener_types(container){
  let {listeners} = container;
  let out = {};
  for(let [id,entry] of Object.entries(listeners)){
    let {meta} = entry;
    let t = meta["listener/type"];
    let arr = out[t];
    if(null == arr){
      arr = [];
      out[t] = arr;
    }
    arr.push(id);
  };
  return out;
}

// xt.lang.event-common/trigger-entry [94] 
export function trigger_entry(entry,event){
  let {callback,meta,pred} = entry;
  if((null == pred) || pred(event)){
    let nmeta = k.obj_assign(event["meta"] || {},meta);
    callback(k.obj_assign(k.obj_clone(event),{"meta":nmeta}));
  }
}

// xt.lang.event-common/trigger-listeners [108] 
export function trigger_listeners(container,event){
  event = (event || {});
  let {listeners} = container;
  let triggered = [];
  for(let [id,entry] of Object.entries(listeners)){
    trigger_entry(entry,event);
    triggered.push(id);
  };
  return triggered;
}

// xt.lang.event-common/add-keyed-listener [125] 
export function add_keyed_listener(container,key,listener_id,listener_type,callback,meta,pred){
  let {listeners} = container;
  let entry = make_listener_entry(listener_id,listener_type,callback,meta,pred);
  let group = listeners[key];
  if(null == group){
    group = {};
    listeners[key] = group;
  }
  group[listener_id] = entry;
  return entry;
}

// xt.lang.event-common/remove-keyed-listener [138] 
export function remove_keyed_listener(container,key,listener_id){
  let {listeners} = container;
  let group = listeners[key];
  if(null == group){
    return null;
  }
  let entry = group[listener_id];
  delete(group[listener_id]);
  if(k.is_emptyp(group)){
    delete(listeners[key]);
  }
  return entry;
}

// xt.lang.event-common/list-keyed-listeners [152] 
export function list_keyed_listeners(container,key){
  let {listeners} = container;
  let group = listeners[key];
  if(null == group){
    return [];
  }
  return k.obj_keys(group);
}

// xt.lang.event-common/all-keyed-listeners [162] 
export function all_keyed_listeners(container){
  let {listeners} = container;
  return k.arr_juxt(k.obj_keys(listeners),k.identity,function (key){
    return list_keyed_listeners(container,key);
  });
}

// xt.lang.event-common/trigger-keyed-listeners [173] 
export function trigger_keyed_listeners(container,key,event){
  event = (event || {});
  let {listeners} = container;
  let group = listeners[key];
  let triggered = [];
  if(null != group){
    for(let [id,entry] of Object.entries(group)){
      trigger_entry(entry,event);
      triggered.push(id);
    };
  }
  return triggered;
}