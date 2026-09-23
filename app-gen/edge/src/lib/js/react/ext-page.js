import React from 'react'

import * as event_common from '@statstrade/edge/lib/xt/event/base-listener.jsx'

import * as xtt from '@statstrade/edge/lib/xt/lang/common-tree.jsx'

import * as xtd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as k from '@statstrade/edge/lib/xt/lang/common-lib.jsx'

import * as r from '@statstrade/edge/lib/js/react.js'

import * as page_core from '@statstrade/edge/lib/xt/substrate/page-core.jsx'

import * as event_model from '@statstrade/edge/lib/xt/event/base-model.jsx'

// js.react.ext-page/model-key [15] 
export function model_key(space_id,path){
  return JSON.stringify([space_id,path]);
}

// js.react.ext-page/get-model [21] 
export function get_model(node,space_id,path){
  let [group,model] = page_core.model_ensure(node,space_id,path[0],path[1]);
  return model;
}

// js.react.ext-page/TYPES [31] 
export var TYPES = {
  "input":[event_model.get_input,"current","input"],
  "output":[event_model.get_output,"current","output"],
  "pending":[event_model.get_output,null,"output"],
  "elapsed":[event_model.get_output,null,"output"],
  "disabled":[event_model.get_output,null,"output"],
  "errored":[event_model.get_output,null,"output"],
  "tag":[event_model.get_output,null,"output"],
  "success":[event_model.get_success,null,"output"]
};

// js.react.ext-page/throttled-setter [41] 
export function throttled_setter(setResult,delay){
  let throttle = {"val":null,"thread":null,"mounted":true};
  let throttled_fn = function (result){
    let t = Date.now();
    if(k.not_nilp(throttle["thread"])){
      throttle["val"] = result;
    }
    else{
      throttle["val"] = result;
      setResult(result);
      throttle["thread"] = new Promise(function (resolve,reject){
        setTimeout(function (){
          new Promise(function (inner_resolve){
            inner_resolve((function (){
              if((throttle["val"] != result) && throttle["mounted"]){
                setResult(throttle["val"]);
              }
              delete(throttle["thread"]);
            })());
          }).then(function (value){
            resolve(value);
          }).catch(function (err){
            reject(err);
          });
        },delay);
      });
    }
  };
  return [throttled_fn,throttle];
}

// js.react.ext-page/initModelBase [67] 
export function initModelBase(node,space_id,path,{getResult,meta,pred,resultRef,resultTag,setResult}){
  let key = model_key(space_id,path);
  let {resultFn,resultPrint} = meta || {};
  let listener_id = r.id();
  React.useEffect(function (){
    event_common.add_keyed_listener(node,key,listener_id,"page",function (_id,data,_t,_meta){
      let event = xtd.obj_clone(data);
      let nresult = getResult();
      if((k.nilp(resultTag) || (resultTag == event["data"]["tag"])) && !xtt.eq_nested(resultRef.current,nresult)){
        setResult(nresult);
      }
      if(resultFn){
        resultFn(event);
      }
      if(k.is_functionp(resultPrint)){
        resultPrint({event,nresult,resultTag});
      }
    },meta,pred);
    return function (){
      return event_common.remove_keyed_listener(node,key,listener_id);
    };
  },[]);
}

// js.react.ext-page/listenModel [104] 
export function listenModel(node,space_id,path,type,meta){
  let [tfn,tkey,tevent] = TYPES[type];
  tevent = (tevent || type);
  let getResult = function (){
    let model = get_model(node,space_id,path);
    let out = tfn(model);
    return xtd.clone_shallow(tkey ? out[tkey] : out);
  };
  let [result,setResult] = React.useState(getResult);
  let resultRef = r.useFollowRef(result);
  initModelBase(node,space_id,path,{getResult,meta,resultRef,setResult,"pred":function (event){
      return event["type"] == ("model." + tevent);
    }});
  return result;
}

// js.react.ext-page/listenModelOutput [127] 
export function listenModelOutput(node,space_id,path,types,meta){
  let getOutput = function (){
    return xtd.obj_clone(event_model.get_output(get_model(node,space_id,path),null));
  };
  let [output,setOutput] = React.useState(getOutput);
  let wrap = r.useIsMountedWrap();
  let outputRef = r.useFollowRef(output);
  let pred = function (event){
    return xtd.arr_some(types,function (type){
      return event["type"] == ("model." + type);
    });
  };
  initModelBase(
    node,
    space_id,
    path,
    {meta,pred,"setResult":wrap(setOutput),"getResult":getOutput,"resultRef":outputRef}
  );
  return output;
}

// js.react.ext-page/listenModelThrottled [150] 
export function listenModelThrottled(node,space_id,path,delay,meta){
  let getResult = function (){
    return xtd.clone_shallow(event_model.get_success(get_model(node,space_id,path),null));
  };
  let [result,setResult] = React.useState(getResult);
  let resultRef = r.useFollowRef(result);
  React.useEffect(function (){
    let listener_id = r.id();
    let [setThrottled,throttle] = throttled_setter(setResult,delay);
    let key = model_key(space_id,path);
    event_common.add_keyed_listener(node,key,listener_id,"page",function (_id,data,_t,_meta){
      let nresult = getResult();
      if(!(resultRef.current == nresult)){
        setThrottled(nresult);
      }
    },meta,function (event){
      return "model.output" == event["type"];
    });
    return function (){
      throttle["mounted"] = false;
      event_common.remove_keyed_listener(node,key,listener_id);
    };
  },[]);
  return result;
}

// js.react.ext-page/refreshArgsFn [182] 
export function refreshArgsFn(node,space_id,path,args,opts){
  let group_id = path[0];
  let model_id = path[1];
  if(xtd.arr_every(args,k.not_nilp)){
    return page_core.model_set_input(node,space_id,group_id,model_id,{"data":args},opts || {});
  }
  else{
    return page_core.model_set_input(node,space_id,group_id,model_id,null,opts || {});
  }
}

// js.react.ext-page/useRefreshArgs [204] 
export function useRefreshArgs(node,space_id,path,args,opts){
  opts = (opts || {});
  React.useEffect(function (){
    return refreshArgsFn(node,space_id,path,args,opts);
  },[JSON.stringify(args)]);
}

// js.react.ext-page/refreshModel [213] 
export function refreshModel(node,space_id,path,event){
  return page_core.model_refresh(node,space_id,path[0],path[1],event || {},null);
}

// js.react.ext-page/remoteCall [224] 
export function remoteCall(node,space_id,path,args,save_output){
  return page_core.model_remote_call(node,space_id,path[0],path[1],args,save_output);
}

// js.react.ext-page/listenSuccess [235] 
export function listenSuccess(node,space_id,path,args,opts,meta){
  opts = (opts || {});
  let output = r.useStablized(
    listenModel(node,space_id,path,"success",meta),
    opts.stablized
  );
  useRefreshArgs(node,space_id,path,args,opts);
  return (opts.then || k.identity)(output || opts.default);
}