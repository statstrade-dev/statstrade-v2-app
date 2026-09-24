import * as event_common from '@statstrade/edge/lib/xt/event/base-listener.jsx'

import * as xtd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

// xt.event.base-box/make-box [70] 
export function make_box(initial){
  let initialFn = initial;
  if(!("function" == (typeof initialFn))){
    let initialData = initialFn;
    initialFn = (function (){
      return initialData;
    });
  }
  let data = initialFn();
  return {
    "::":"event.box",
    "listeners":{},
    "data":data,
    "initial":initialFn
  };
}

// xt.event.base-box/check-event [87] 
export function check_event(event,path){
  let evpath = event["path"];
  if(path.length > evpath.length){
    return false;
  }
  for(let i = 0; i < path.length; ++i){
    let v = path[i];
    if(v != evpath[i]){
      return false;
    }
  };
  return true;
}

// xt.event.base-box/add-listener [99] 
export function add_listener(box,listener_id,path,callback,meta){
  path = event_common.arrayify_path(path);
  return event_common.add_listener(box,listener_id,"box",callback,Object.assign({"box/path":path},meta),function (event){
    return check_event(event,path);
  });
}

// xt.event.base-box/remove-listener [113] 
export var remove_listener = event_common.remove_listener;

// xt.event.base-box/list-listeners [117] 
export var list_listeners = event_common.list_listeners;

// xt.event.base-box/get-data [121] 
export function get_data(box,path){
  let {data} = box;
  path = event_common.arrayify_path(path);
  return xtd.get_in(data,path);
}

// xt.event.base-box/set-data-raw [129] 
export function set_data_raw(box,path,value){
  let {data} = box;
  if(xtd.arr_emptyp(path)){
    box["data"] = value;
  }
  else{
    return xtd.set_in(data,path,value);
  }
}

// xt.event.base-box/set-data [140] 
export function set_data(box,path,value){
  let {data} = box;
  path = event_common.arrayify_path(path);
  set_data_raw(box,path,value);
  return event_common.trigger_listeners(box,{"path":path,"value":value,"data":data});
}

// xt.event.base-box/del-data-raw [154] 
export function del_data_raw(box,path){
  path = event_common.arrayify_path(path);
  let {data} = box;
  let ppath = path.slice(0,path.length - 1);
  let parent = xtd.get_in(data,ppath);
  if(null != parent){
    let val = parent[path[path.length + -1]];
    delete(parent[path[path.length + -1]]);
    return null != val;
  }
  return false;
}

// xt.event.base-box/del-data [168] 
export function del_data(box,path){
  path = event_common.arrayify_path(path);
  let {data} = box;
  if(del_data_raw(box,path)){
    return event_common.trigger_listeners(box,{"path":path,"value":null,"data":data});
  }
}

// xt.event.base-box/reset-data [182] 
export function reset_data(box){
  let {initial} = box;
  return set_data(box,[],initial());
}

// xt.event.base-box/merge-data [189] 
export function merge_data(box,path,value){
  path = event_common.arrayify_path(path);
  let prev = get_data(box,path);
  let merged = xtd.obj_assign(xtd.obj_clone(prev),value);
  return set_data(box,path,merged);
}

// xt.event.base-box/append-data [199] 
export function append_data(box,path,value){
  path = event_common.arrayify_path(path);
  let arr = get_data(box,path).slice();
  arr.push(value);
  return set_data(box,path,arr);
}