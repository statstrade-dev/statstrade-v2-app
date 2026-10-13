import React from 'react'

import * as xtt from '@statstrade/edge/lib/xt/lang/common-tree.jsx'

import * as xtd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as event_box from '@statstrade/edge/lib/xt/event/base-box.jsx'

// js.react.ext-box/createBox [12] 
export function createBox(initial){
  return event_box.make_box(initial);
}

// js.react.ext-box/useListenBox [18] 
export function useListenBox(box,path,meta){
  let dataFn = React.useCallback(function (){
    return xtd.clone_shallow(event_box.get_data(box,path));
  },[box,path]);
  let [data,setData] = React.useState(dataFn());
  let path_str = JSON.stringify(path);
  React.useEffect(function (){
    let listener_id = Math.random().toString(36).substr(2,4);
    event_box.add_listener(box,listener_id,path,function (__unused0,__unused1,__unused2,__unused3){
      setData(dataFn());
    },meta);
    let nData = dataFn();
    if(!xtt.eq_nested(data,nData)){
      setData(nData);
    }
    return function (){
      event_box.remove_listener(box,listener_id);
    };
  },[path_str]);
  return data;
}

// js.react.ext-box/useBox [43] 
export function useBox(box,path,meta){
  let data = useListenBox(box,path,meta);
  let setData = React.useCallback(function (value){
    event_box.set_data(box,path,value);
  },[box,path]);
  return [data,setData];
}

// js.react.ext-box/attachLocalStorage [55] 
export function attachLocalStorage(storage_key,box,listener_id,path){
  let initial = event_box.get_data(box,path);
  if(((typeof localStorage) != "undefined") && localStorage.getItem){
    let stored = localStorage.getItem(storage_key);
    if(stored){
      let stored_data = initial;
      try{
        stored_data = xtd.get_in(JSON.parse(stored),path);
      }
      catch(e){
        stored_data = initial;
      }
      event_box.set_data(box,path,stored_data);
    }
    event_box.add_listener(box,listener_id,path,function (__unused0,payload,__unused1,__unused2){
      Promise.resolve().then(function (){
        localStorage.setItem(storage_key,JSON.stringify(payload["data"]));
      });
    });
  }
  return box;
}

// js.react.ext-box/listenBox [83] 
export var listenBox = useListenBox;

// js.react.ext-box/getData [85] 
export var getData = event_box.get_data;

// js.react.ext-box/setData [88] 
export var setData = event_box.set_data;

// js.react.ext-box/delData [91] 
export var delData = event_box.del_data;

// js.react.ext-box/resetData [94] 
export var resetData = event_box.reset_data;

// js.react.ext-box/mergeData [97] 
export var mergeData = event_box.merge_data;

// js.react.ext-box/appendData [100] 
export var appendData = event_box.append_data;

// js.react.ext-box/addListener [103] 
export var addListener = event_box.add_listener;

// js.react.ext-box/removeListener [106] 
export var removeListener = event_box.remove_listener;