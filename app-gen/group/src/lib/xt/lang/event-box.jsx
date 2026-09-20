import * as k from '@statstrade/group/lib/xt/lang/base-lib'

import * as event_common from '@statstrade/group/lib/xt/lang/event-common'

// xt.lang.event-box/make-box [9] 
export function make_box(initial){
  return event_common.make_container(initial,"event.box",{});
}

// xt.lang.event-box/check-event [16] 
export function check_event(event,path){
  let evpath = event["path"];
  if((path).length > (evpath).length){
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

// xt.lang.event-box/add-listener [28] 
export function add_listener(box,listener_id,path,callback,meta){
  path = k.arrayify(path);
  return event_common.add_listener(box,listener_id,"box",callback,k.obj_assign({"box/path":path},meta),function (event){
    return check_event(event,path);
  });
}

// xt.lang.event-box/remove-listener [42] 
export var remove_listener = event_common.remove_listener;

// xt.lang.event-box/list-listeners [46] 
export var list_listeners = event_common.list_listeners;

// xt.lang.event-box/get-data [50] 
export function get_data(box,path){
  let {data} = box;
  path = k.arrayify(path);
  return k.get_in(data,path);
}

// xt.lang.event-box/set-data-raw [58] 
export function set_data_raw(box,path,value){
  let {data} = box;
  if(k.is_emptyp(path)){
    box["data"] = value;
  }
  else{
    return k.set_in(data,path,value);
  }
}

// xt.lang.event-box/set-data [69] 
export function set_data(box,path,value){
  let {data} = box;
  path = k.arrayify(path);
  set_data_raw(box,path,value);
  return event_common.trigger_listeners(box,{"path":path,"value":value,"data":data});
}

// xt.lang.event-box/del-data-raw [83] 
export function del_data_raw(box,path){
  let {data} = box;
  let ppath = k.arr_slice(path,0,(path).length - 1);
  let parent = k.get_in(data,ppath);
  if(parent){
    let val = parent[path[path.length + -1]];
    delete(parent[path[path.length + -1]]);
    return null != val;
  }
  return false;
}

// xt.lang.event-box/del-data [96] 
export function del_data(box,path){
  let {data} = box;
  if(del_data_raw(box,path)){
    return event_common.trigger_listeners(box,{"path":path,"value":null,"data":data});
  }
}

// xt.lang.event-box/reset-data [109] 
export function reset_data(box){
  let {initial} = box;
  return set_data(box,initial(),[]);
}

// xt.lang.event-box/merge-data [116] 
export function merge_data(box,path,value){
  let prev = get_data(box,path);
  let merged = k.obj_assign(k.obj_clone(prev),value);
  return set_data(box,path,merged);
}

// xt.lang.event-box/append-data [125] 
export function append_data(box,path,value){
  let arr = k.arr_clone(get_data(box,path));
  arr.push(value);
  return set_data(box,path,arr);
}