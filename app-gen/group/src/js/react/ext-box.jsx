import React from 'react'

import * as k from '@statstrade/edge/lib/xt/lang/base-lib'

import * as event_box from '@statstrade/edge/lib/xt/lang/event-box'

// js.react.ext-box/createBox [10] 
export function createBox(initial){
  return event_box.make_box(initial);
}

// js.react.ext-box/useListenBox [16] 
export function useListenBox(box,path,meta){
  let dataFn = React.useCallback(function (){
    return k.clone_shallow(event_box.get_data(box,path));
  },[box,path]);
  let [data,setData] = React.useState(dataFn());
  let path_str = JSON.stringify(path);
  React.useEffect(function (){
    let listener_id = Math.random().toString(36).substr(2,4 || 4);
    event_box.add_listener(box,listener_id,path,function (m){
      setData(dataFn());
    },meta);
    let nData = dataFn();
    if(!k.eq_nested(data,nData)){
      setData(nData);
    }
    return function (){
      event_box.remove_listener(box,listener_id);
    };
  },[path_str]);
  return data;
}

// js.react.ext-box/useBox [39] 
export function useBox(box,path,meta){
  let data = useListenBox(box,path,meta);
  let setData = React.useCallback(function (value){
    event_box.set_data(box,path,value);
  },[box,path]);
  return [data,setData];
}

// js.react.ext-box/attachLocalStorage [51] 
export function attachLocalStorage(storage_key,box,listener_id,path){
  let initial = event_box.get_data(box,path);
  if(((typeof localStorage) != "undefined") && localStorage.getItem){
    let stored = localStorage.getItem(storage_key);
    if(stored){
      try{
        stored = JSON.parse(stored);
      }
      catch(e){
        stored = initial;
      }
      event_box.set_data(box,path,stored);
    }
    event_box.add_listener(box,listener_id,path,function ({data}){
      new Promise(function (resolve,reject){
        try{
          resolve(          (function (){
                      localStorage.setItem(storage_key,JSON.stringify(data));
                    })());
        }
        catch(e){
          reject(e);
        }
      });
    });
  }
  return box;
}

// js.react.ext-box/listenBox [76] 
export var listenBox = useListenBox;

// js.react.ext-box/getData [78] 
export var getData = event_box.get_data;

// js.react.ext-box/setData [81] 
export var setData = event_box.set_data;

// js.react.ext-box/delData [84] 
export var delData = event_box.del_data;

// js.react.ext-box/resetData [87] 
export var resetData = event_box.reset_data;

// js.react.ext-box/mergeData [90] 
export var mergeData = event_box.merge_data;

// js.react.ext-box/appendData [93] 
export var appendData = event_box.append_data;

// js.react.ext-box/addListener [96] 
export var addListener = event_box.add_listener;

// js.react.ext-box/removeListener [99] 
export var removeListener = event_box.remove_listener;