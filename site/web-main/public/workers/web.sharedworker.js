// StatsTrade site SharedWorker; site maps are loaded through kernel-init.
import sqlite3InitModule from './sqlite-wasm/index.mjs'
import * as Postgres from 'data:text/javascript,export default {Client: function() {}}'

function xt_lang_common_data$$is_emptyp(res){
  if(null == res){
    return true;
  }
  else if("string" == (typeof res)){
    return 0 == res.length;
  }
  else if(Array.isArray(res)){
    return 0 == res.length;
  }
  else if((null != res) && ("object" == (typeof res)) && !Array.isArray(res)){
    for(let [i,v] of Object.entries(res)){
      return false;
    };
    return true;
  }
  else{
    throw "Invalid type - " + String(res);
  }
}

function xt_lang_common_data$$not_emptyp(res){
  if(null == res){
    return false;
  }
  else if("string" == (typeof res)){
    return 0 < res.length;
  }
  else if(Array.isArray(res)){
    return 0 < res.length;
  }
  else if((null != res) && ("object" == (typeof res)) && !Array.isArray(res)){
    for(let [i,v] of Object.entries(res)){
      return true;
    };
    return false;
  }
  else{
    throw "Invalid type - " + String(res);
  }
}

function xt_lang_common_data$$first(arr){
  return arr[0];
}

function xt_lang_common_data$$second(arr){
  return arr[1];
}

function xt_lang_common_data$$nth(arr,i){
  return arr[i];
}

function xt_lang_common_data$$arr_emptyp(arr){
  if(null == arr){
    return true;
  }
  else{
    return 0 == arr.length;
  }
}

function xt_lang_common_data$$arrayify(x){
  if(Array.isArray(x)){
    return x;
  }
  if(null == x){
    return [];
  }
  return [x];
}

function xt_lang_common_data$$arr_lookup(arr){
  let out = {};
  for(let k of arr){
    out[k] = true;
  };
  return out;
}

function xt_lang_common_data$$arr_zip(ks,vs){
  let out = {};
  for(let i = 0; i < ks.length; ++i){
    let k = ks[i];
    out[k] = vs[i];
  };
  return out;
}

function xt_lang_common_data$$arr_assign(arr,other){
  for(let e of other){
    arr.push(e);
  };
  return arr;
}

function xt_lang_common_data$$arr_slice(arr,start,finish){
  let out = [];
  let finish_idx = null;
  if("number" == (typeof finish)){
    finish_idx = finish;
  }
  else{
    finish_idx = arr.length;
  }
  for(let i = start; i < finish_idx; i = (i + 1)){
    out.push(arr[i]);
  };
  return out;
}

function xt_lang_common_data$$obj_first_key(obj){
  for(let k of Object.keys(obj)){
    return k;
  };
  return null;
}

function xt_lang_common_data$$obj_first_val(obj){
  for(let v of Object.values(obj)){
    return v;
  };
  return null;
}

function xt_lang_common_data$$obj_keys(obj){
  let out = [];
  if(null != obj){
    for(let k of Object.keys(obj)){
      out.push(k);
    };
  }
  return out;
}

function xt_lang_common_data$$obj_assign(obj,m){
  if(null == obj){
    obj = {};
  }
  if(null != m){
    for(let [k,v] of Object.entries(m)){
      obj[k] = v;
    };
  }
  return obj;
}

function xt_lang_common_data$$obj_assign_nested(obj,m){
  if(null == obj){
    obj = {};
  }
  if(null != m){
    for(let [k,mv] of Object.entries(m)){
      let v = null;
      if(null != obj[k]){
        v = obj[k];
      }
      if(((null != mv) && ("object" == (typeof mv)) && !Array.isArray(mv)) && ((null != v) && ("object" == (typeof v)) && !Array.isArray(v))){
        obj[k] = xt_lang_common_data$$obj_assign_nested(v,mv);
      }
      else{
        obj[k] = mv;
      }
    };
  }
  return obj;
}

function xt_lang_common_data$$obj_assign_with(obj,m,f){
  if(null != m){
    let input = {};
    if((null != m) && ("object" == (typeof m)) && !Array.isArray(m)){
      input = m;
    }
    for(let [k,mv] of Object.entries(input)){
      let merged = mv;
      if(null != obj[k]){
        merged = f(obj[k],mv);
      }
      obj[k] = merged;
    };
  }
  return obj;
}

function xt_lang_common_data$$obj_from_pairs(pairs){
  let out = {};
  for(let pair of pairs){
    out[pair[0]] = pair[1];
  };
  return out;
}

function xt_lang_common_data$$obj_pick(obj,ks){
  let out = {};
  if(null == obj){
    return out;
  }
  for(let k of ks){
    let v = obj[k];
    if(null != v){
      out[k] = v;
    }
  };
  return out;
}

function xt_lang_common_data$$get_in(obj,arr){
  if(null == obj){
    return null;
  }
  else if(null == arr){
    return obj;
  }
  else if(0 == arr.length){
    return obj;
  }
  else if(1 == arr.length){
    let k = arr[0];
    if(Array.isArray(obj)){
      return ("number" == (typeof k)) ? obj[k] : null;
    }
    else if((null != obj) && ("object" == (typeof obj)) && !Array.isArray(obj)){
      return obj[k];
    }
    else{
      return null;
    }
  }
  let total = arr.length;
  let i = 0;
  let curr = obj;
  while(i < total){
    if(null == curr){
      return null;
    }
    let k = arr[i];
    if(Array.isArray(curr)){
      if("number" == (typeof k)){
        curr = curr[k];
      }
      else{
        return null;
      }
    }
    else if((null != curr) && ("object" == (typeof curr)) && !Array.isArray(curr)){
      curr = curr[k];
    }
    else{
      return null;
    }
    if(null == curr){
      return null;
    }
    else{
      i = (i + 1);
    }
  }
  return curr;
}

function xt_lang_common_data$$set_in(obj,arr,v){
  if(null == arr){
    arr = [];
  }
  if(0 == arr.length){
    return obj;
  }
  if(!((null != obj) && ("object" == (typeof obj)) && !Array.isArray(obj))){
    let idx = arr.length;
    let out = v;
    while(true){
      if(idx == 0){
        return out;
      }
      let nested = {};
      let k = arr[idx + -1];
      nested[k] = out;
      out = nested;
      idx = (idx - 1);
    }
  }
  let k = arr[0];
  let narr = xt_lang_common_data$$arr_slice(arr,1,null);
  let child = obj[k];
  if(0 == narr.length){
    obj[k] = v;
  }
  else{
    obj[k] = xt_lang_common_data$$set_in(child,narr,v);
  }
  return obj;
}

function xt_lang_common_data$$swap_key(obj,k,f,args){
  let inputs = args.slice();
  inputs.unshift(obj[k]);
  obj[k] = f.apply(null,inputs);
  return obj;
}

function xt_lang_common_data$$arr_mapcat(arr,f){
  let out = [];
  for(let e of arr){
    let res = f(e);
    if(null != res){
      for(let v of res){
        out.push(v);
      };
    }
  };
  return out;
}

function xt_lang_common_data$$arr_keep(arr,f){
  let out = [];
  for(let e of arr){
    let v = f(e);
    if(null != v){
      out.push(v);
    }
  };
  return out;
}

function xt_lang_common_data$$arr_keepf(arr,pred,f){
  let out = [];
  for(let e of arr){
    if(pred(e)){
      out.push(f(e));
    }
  };
  return out;
}

function xt_lang_common_data$$arr_sort(arr,key_fn,comp_fn){
  let tmp = null;
  let total = arr.length;
  for(let i = 0; i < (total - 1); i = (i + 1)){
    for(let j = i + 1; j < total; j = (j + 1)){
      let left = arr[i];
      let right = arr[j];
      if(comp_fn(key_fn(right),key_fn(left))){
        tmp = left;
        arr[i] = right;
        arr[j] = tmp;
      }
    };
  };
  return arr;
}

function xt_lang_common_data$$obj_filter(obj,pred){
  let out = {};
  if(null != obj){
    for(let [k,v] of Object.entries(obj)){
      if(pred(v)){
        out[k] = v;
      }
    };
  }
  return out;
}

function xt_lang_common_data$$obj_keep(obj,f){
  let out = {};
  if(null != obj){
    for(let [k,e] of Object.entries(obj)){
      let v = f(e);
      if(null != v){
        out[k] = v;
      }
    };
  }
  return out;
}

function xt_lang_common_data$$obj_keepf(obj,pred,f){
  let out = {};
  if(null != obj){
    for(let [k,e] of Object.entries(obj)){
      if(pred(e)){
        out[k] = f(e);
      }
    };
  }
  return out;
}

function xt_lang_common_data$$clone_nested_loop(x,lu){
  if(null == x){
    return x;
  }
  let cached = lu.get(x);
  if(null != cached){
    return cached;
  }
  else if((null != x) && ("object" == (typeof x)) && !Array.isArray(x)){
    let out = {};
    lu.set(x,out);
    for(let [k,v] of Object.entries(x)){
      out[k] = xt_lang_common_data$$clone_nested_loop(v,lu);
    };
    return out;
  }
  else if(Array.isArray(x)){
    let out = [];
    lu.set(x,out);
    for(let e of x){
      out.push(xt_lang_common_data$$clone_nested_loop(e,lu));
    };
    return out;
  }
  else{
    return x;
  }
}

function xt_lang_common_data$$clone_nested(x){
  if(!(((null != x) && ("object" == (typeof x)) && !Array.isArray(x)) || Array.isArray(x))){
    return x;
  }
  else{
    return xt_lang_common_data$$clone_nested_loop(x,new Map());
  }
}

function xt_event_base_listener$$blank_container(type_name,opts){
  let container = Object.assign({"::":type_name,"listeners":{}},opts);
  return container;
}

function xt_event_base_listener$$make_listener_entry(listener_id,listener_type,callback,meta,pred){
  return {
    "callback":callback,
    "pred":pred,
    "meta":Object.assign(
        {"listener/id":listener_id,"listener/type":listener_type},
        meta
      )
  };
}

function xt_event_base_listener$$listener_entryp(entry){
  return (null != entry) && ("function" == (typeof entry["callback"]));
}

function xt_event_base_listener$$callback_data(event){
  if(!((null != event) && ("object" == (typeof event)) && !Array.isArray(event))){
    return event;
  }
  let out = Object.assign({},event);
  if(null != out["meta"]){
    delete(out["meta"]);
  }
  return out;
}

function xt_event_base_listener$$callback_time(event){
  if(!((null != event) && ("object" == (typeof event)) && !Array.isArray(event))){
    return null;
  }
  if(null != event["time"]){
    return event["time"];
  }
  if(null != event["t"]){
    return event["t"];
  }
  return null;
}

function xt_event_base_listener$$add_listener(container,listener_id,listener_type,callback,meta,pred){
  let {listeners} = container;
  let entry = xt_event_base_listener$$make_listener_entry(listener_id,listener_type,callback,meta,pred);
  listeners[listener_id] = entry;
  return entry;
}

function xt_event_base_listener$$trigger_entry(entry,event){
  let {callback,meta,pred} = entry;
  if((null == pred) || pred(event)){
    let nmeta = Object.assign(event["meta"] || {},meta);
    let listener_id = meta["listener/id"];
    return callback(
      listener_id,
      xt_event_base_listener$$callback_data(event),
      xt_event_base_listener$$callback_time(event),
      nmeta
    );
  }
}

function xt_event_base_listener$$trigger_listeners(container,event){
  if(null == event){
    event = {};
  }
  let {listeners} = container;
  let triggered = [];
  for(let [id,entry] of Object.entries(listeners)){
    if(xt_event_base_listener$$listener_entryp(entry)){
      xt_event_base_listener$$trigger_entry(entry,event);
      triggered.push(id);
    }
  };
  return triggered;
}

function xt_event_base_listener$$trigger_keyed_listeners(container,key,event){
  if(null == event){
    event = {};
  }
  let {listeners} = container;
  let group = listeners[key];
  let triggered = [];
  if((null != group) && !xt_event_base_listener$$listener_entryp(group)){
    for(let [id,entry] of Object.entries(group)){
      xt_event_base_listener$$trigger_entry(entry,event);
      triggered.push(id);
    };
  }
  return triggered;
}

function xt_event_base_model$$async_fn_promise(handler,context,callbacks){
  let {error,success} = callbacks;
  try{
    let output = handler(context);
    if(output instanceof Promise){
      return output.then(success).catch(error);
    }
    else{
      return Promise.resolve().then(function (){
        return success(output);
      });
    }
  }
  catch(err){
    return Promise.resolve().then(function (){
      return error(err);
    });
  }
}

function xt_event_base_model$$wrap_args(handler){
  let wrapped_fn = function (context){
    let {args} = context;
    if(null == args){
      args = [];
    }
    return handler.apply(null,args);
  };
  return wrapped_fn;
}

function xt_event_base_model$$check_disabled(context){
  let {input} = context;
  if(null == input){
    return true;
  }
  if(null == input["data"]){
    return true;
  }
  if(true == input["disabled"]){
    return true;
  }
  return false;
}

function xt_event_base_model$$parse_args(context){
  let {input} = context;
  return input["data"];
}

function xt_event_base_model$$create_model(main_handler,pipeline,default_args,default_output,default_process,options){
  let identity_fn = function (x){
    return x;
  };
  if(null == options){
    options = {};
  }
  let default_args_fn = default_args;
  if(!("function" == (typeof default_args_fn))){
    let args_value = default_args_fn;
    default_args_fn = (function (){
      return args_value;
    });
  }
  let default_output_fn = default_output;
  if(!("function" == (typeof default_output_fn))){
    let output_value = default_output_fn;
    default_output_fn = (function (){
      return output_value;
    });
  }
  let process_fn = default_process;
  if(null == process_fn){
    process_fn = identity_fn;
  }
  let entry = {
    "pipeline":xt_lang_common_data$$obj_assign_nested({
        "main":{
            "handler":main_handler,
            "wrapper":xt_event_base_model$$wrap_args
          },
        "remote":{"wrapper":xt_event_base_model$$wrap_args},
        "sync":{"wrapper":xt_event_base_model$$wrap_args},
        "check_args":xt_event_base_model$$parse_args,
        "check_disabled":xt_event_base_model$$check_disabled
      },pipeline),
    "options":options,
    "input":{"current":null,"updated":null,"default":default_args_fn},
    "output":{
        "type":"output",
        "current":null,
        "updated":null,
        "elapsed":null,
        "process":process_fn,
        "default":default_output_fn
      }
  };
  if(null != xt_lang_common_data$$get_in(pipeline,["remote"])){
    entry["remote"] = {
      "type":"remote",
      "current":null,
      "updated":null,
      "elapsed":null,
      "process":process_fn,
      "default":default_output_fn
    };
  }
  if(null != xt_lang_common_data$$get_in(pipeline,["sync"])){
    entry["sync"] = {
      "type":"sync",
      "current":null,
      "updated":null,
      "elapsed":null,
      "process":process_fn,
      "default":default_output_fn
    };
  }
  return xt_event_base_listener$$blank_container("event.model",entry);
}

function xt_event_base_model$$model_context(model){
  let {options,pipeline} = model;
  let {input} = model;
  let context = Object.assign({"model":model,"input":input["current"]},options["context"]);
  return context;
}

function xt_event_base_model$$add_listener(model,listener_id,callback,meta,pred){
  return xt_event_base_listener$$add_listener(model,listener_id,"model",callback,meta,pred);
}

function xt_event_base_model$$trigger_listeners(model,type_name,data){
  return xt_event_base_listener$$trigger_listeners(model,{"type":type_name,"data":data});
}

function xt_event_base_model$$get_input(model){
  let {input} = model;
  return input;
}

function xt_event_base_model$$get_output(model,dest_key){
  if(null == dest_key){
    dest_key = "output";
  }
  return model[dest_key];
}

function xt_event_base_model$$set_input(model,current){
  let {callback,input} = model;
  Object.assign(input,{"current":current,"updated":Date.now()});
  xt_event_base_model$$trigger_listeners(model,"model.input",xt_event_base_model$$get_input(model));
  return input;
}

function xt_event_base_model$$set_output(model,current,errored,tag,dest_key,meta){
  if(null == dest_key){
    dest_key = "output";
  }
  let output = model[dest_key];
  let {callback,options} = model;
  let {accumulate} = options;
  if(errored){
    output["errored"] = true;
  }
  else{
    if(null != output["errored"]){
      delete(output["errored"]);
    }
  }
  output["updated"] = Date.now();
  output["tag"] = tag;
  if(accumulate){
    let prev = xt_lang_common_data$$arrayify(output["current"]);
    let next = xt_lang_common_data$$arr_assign(prev.slice(),xt_lang_common_data$$arrayify(current));
    output["current"] = next;
  }
  else{
    output["current"] = current;
  }
  xt_event_base_model$$trigger_listeners(model,"model.output",output);
  return current;
}

function xt_event_base_model$$set_output_disabled(model,value,dest_key){
  if(null == dest_key){
    dest_key = "output";
  }
  let output = model[dest_key];
  let {callback} = model;
  if(value){
    output["disabled"] = value;
  }
  else{
    if(null != output["disabled"]){
      delete(output["disabled"]);
    }
  }
  xt_event_base_model$$trigger_listeners(model,"model.disabled",output);
  return output;
}

function xt_event_base_model$$set_pending(model,value,dest_key){
  if(null == dest_key){
    dest_key = "output";
  }
  let output = model[dest_key];
  if(value){
    output["pending"] = value;
  }
  else{
    if(null != output["pending"]){
      delete(output["pending"]);
    }
  }
  xt_event_base_model$$trigger_listeners(model,"model.pending",output);
  return output;
}

function xt_event_base_model$$set_elapsed(model,value,dest_key){
  if(null == dest_key){
    dest_key = "output";
  }
  let output = model[dest_key];
  if("number" == (typeof value)){
    output["elapsed"] = value;
  }
  else{
    if(null != output["elapsed"]){
      delete(output["elapsed"]);
    }
  }
  xt_event_base_model$$trigger_listeners(model,"model.elapsed",output);
  return output;
}

function xt_event_base_model$$init_model(model){
  let {input,options} = model;
  let {init} = options;
  let data = input["default"]();
  return xt_event_base_model$$set_input(model,Object.assign({"data":data},init));
}

function xt_event_base_model$$pipeline_prep(model,opts){
  let {pipeline} = model;
  let {check_args,check_disabled} = pipeline;
  let context = Object.assign(xt_event_base_model$$model_context(model),opts);
  let disabled = check_disabled(context);
  let {args} = context;
  if(null == args){
    if(!disabled){
      args = check_args(context);
    }
  }
  if(null == args){
    disabled = true;
  }
  context["args"] = xt_lang_common_data$$arrayify(args);
  context["acc"] = {"::":"model.run"};
  return [context,disabled];
}

function xt_event_base_model$$pipeline_set(context,tag,acc,dest_key){
  let {model} = context;
  if(null == dest_key){
    dest_key = "output";
  }
  let process = xt_lang_common_data$$get_in(model,[dest_key,"process"]);
  let record = acc[tag];
  let should_update = null;
  if(0 < record.length){
    should_update = record[0];
  }
  let current = null;
  if(1 < record.length){
    current = record[1];
  }
  let errored = null;
  if(2 < record.length){
    errored = record[2];
  }
  if(null == current){
    current = xt_lang_common_data$$get_in(model,[dest_key,"default"])();
  }
  if(should_update){
    let output = current;
    if(!errored){
      output = process(current);
    }
    xt_event_base_model$$set_output(model,output,errored,tag,dest_key,context["meta"]);
  }
  return acc;
}

function xt_event_base_model$$pipeline_call(context,tag,disabled,async_fn,hook_fn,skip_guard){
  let identity_hook = function (acc,_tag){
    return acc;
  };
  let identity_wrapper = function (handler){
    return handler;
  };
  if(null == skip_guard){
    skip_guard = {};
  }
  if(null == hook_fn){
    hook_fn = identity_hook;
  }
  let {acc,args,model} = context;
  let {pipeline} = model;
  let stage = pipeline[tag];
  if(null == stage){
    stage = {};
  }
  let {guard,handler,wrapper} = stage;
  if(null == wrapper){
    wrapper = identity_wrapper;
  }
  let error_fn = function (err){
    acc[tag] = [true,err,true];
    acc["error"] = true;
    return hook_fn(acc,tag);
  };
  let skipped_fn = function (res){
    acc[tag] = [false];
    return hook_fn(acc,tag);
  };
  let result_fn = function (res){
    acc[tag] = [true,res];
    return hook_fn(acc,tag);
  };
  let handler_fn = null;
  let success_fn = null;
  if(!disabled && ("function" == (typeof handler)) && ((null == guard) || skip_guard[tag] || guard(context,acc))){
    handler_fn = wrapper(handler);
    success_fn = result_fn;
  }
  else{
    handler_fn = (function (_){
      return null;
    });
    success_fn = skipped_fn;
  }
  return async_fn(handler_fn,context,{"success":success_fn,"error":error_fn});
}

function xt_event_base_model$$pipeline_run_impl(context,stages,index,async_fn,hook_fn,complete_fn,skip_guard){
  if(index < stages.length){
    let next_hook = function (acc,tag){
      if(hook_fn){
        hook_fn(acc,tag);
      }
      return xt_event_base_model$$pipeline_run_impl(context,stages,index + 1,async_fn,hook_fn,complete_fn,skip_guard);
    };
    return xt_event_base_model$$pipeline_call(context,stages[index],false,async_fn,next_hook,skip_guard);
  }
  else{
    return complete_fn(context);
  }
}

function xt_event_base_model$$pipeline_run(context,disabled,async_fn,hook_fn,complete_fn,dest_key){
  let {acc,model} = context;
  if(null == dest_key){
    dest_key = "output";
  }
  let dest_tag = dest_key;
  if(dest_key == "output"){
    dest_tag = "main";
  }
  let output = model[dest_key];
  let started = Date.now();
  if(null != output["elapsed"]){
    delete(output["elapsed"]);
  }
  if(disabled){
    let disabled_hook = function (acc,tag){
      if(hook_fn){
        hook_fn(acc,tag);
      }
      if(complete_fn){
        complete_fn(acc);
      }
    };
    xt_event_base_model$$set_output_disabled(model,true,dest_key);
    return xt_event_base_model$$pipeline_call(context,dest_tag,true,async_fn,disabled_hook,null);
  }
  else{
    let run_hook = function (acc,tag){
      if(hook_fn){
        hook_fn(acc,tag);
      }
      if(tag == dest_tag){
        xt_event_base_model$$pipeline_set(context,tag,acc,dest_key);
      }
    };
    let run_complete = function (acc){
      if(complete_fn){
        complete_fn(acc);
      }
      xt_event_base_model$$set_elapsed(model,Date.now() - started,dest_key);
      xt_event_base_model$$set_pending(model,false,dest_key);
    };
    if(output["disabled"]){
      xt_event_base_model$$set_output_disabled(model,false,dest_key);
    }
    xt_event_base_model$$set_pending(model,true,dest_key);
    return xt_event_base_model$$pipeline_run_impl(
      context,
      ["pre",dest_tag,"post"],
      0,
      async_fn,
      run_hook,
      run_complete,
      null
    );
  }
}

function xt_event_base_model$$pipeline_run_force(context,save_output,async_fn,hook_fn,complete_fn,dest_key){
  let {acc,model} = context;
  let started = Date.now();
  let force_hook = function (acc,tag){
    if(hook_fn){
      hook_fn(acc,tag);
    }
    if(tag == dest_key){
      xt_event_base_model$$pipeline_set(context,tag,acc,dest_key);
      if(save_output){
        xt_event_base_model$$pipeline_set(context,tag,acc,"output");
      }
    }
  };
  let force_complete = function (acc){
    if(complete_fn){
      complete_fn(acc);
    }
    xt_event_base_model$$set_elapsed(model,Date.now() - started,dest_key);
    xt_event_base_model$$set_pending(model,false,dest_key);
  };
  xt_event_base_model$$set_pending(model,true,dest_key);
  return xt_event_base_model$$pipeline_run_impl(
    context,
    ["pre",dest_key,"post"],
    0,
    async_fn,
    force_hook,
    force_complete,
    null
  );
}

function xt_event_base_model$$pipeline_run_remote(context,save_output,async_fn,hook_fn,complete_fn){
  return xt_event_base_model$$pipeline_run_force(context,save_output,async_fn,hook_fn,complete_fn,"remote");
}

function xt_lang_common_string$$to_uppercase(s){
  return s.toUpperCase();
}

function xt_lang_common_string$$sym_ns(sym){
  let idx = sym.indexOf("/");
  if(0 < idx){
    return (sym.split("/"))[0];
  }
  else{
    return null;
  }
}

function xt_lang_common_string$$pad_left(s,n,ch){
  let l = n - s.length;
  let out = s;
  for(let i = 0; i < l; i = (i + 1)){
    out = (ch + out);
  };
  return out;
}

function xt_lang_common_string$$pad_lines(s,n,ch){
  let lines = s.split("\n");
  let out = "";
  for(let line of lines){
    if(0 < out.length){
      out = (out + "\n");
    }
    out = (out + xt_lang_common_string$$pad_left("",n," ") + line);
  };
  return out;
}

function xt_lang_common_string$$str_rand(n){
  let choices = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8"
  ];
  let out = "";
  for(let i = 0; i < n; i = (i + 1)){
    let rand_idx = Math.random() * choices.length;
    let idx = Math.floor(rand_idx);
    out = (out + choices[idx]);
  };
  return out;
}

function xt_substrate_base_frame$$rand_id(prefix,n){
  return (prefix || "") + xt_lang_common_string$$str_rand(n);
}

function xt_substrate_base_frame$$frame(kind,id,space,meta,extra){
  return Object.assign({
    "kind":kind,
    "id":id,
    "space":space || "__NODE__",
    "meta":meta || {}
  },extra || {});
}

function xt_substrate_base_frame$$response_frame(reply_to,space,status,data,error,meta){
  meta = (meta || {});
  return xt_substrate_base_frame$$frame(
    "response",
    meta["id"] || xt_substrate_base_frame$$rand_id("res-",6),
    space,
    meta,
    {"reply_to":reply_to,"status":status,"data":data,"error":error}
  );
}

function xt_substrate_base_frame$$response_ok_frame(reply_to,space,data,meta){
  return xt_substrate_base_frame$$response_frame(reply_to,space,"ok",data,null,meta);
}

function xt_substrate_base_frame$$response_error_frame(reply_to,space,error,meta){
  return xt_substrate_base_frame$$response_frame(reply_to,space,"error",null,error,meta);
}

function xt_substrate_base_frame$$stream_frame(space,signal,data,meta,cause){
  meta = (meta || {});
  return xt_substrate_base_frame$$frame(
    "stream",
    meta["id"] || xt_substrate_base_frame$$rand_id("evt-",6),
    space,
    meta,
    {"signal":signal,"data":data,"cause":cause}
  );
}

function xt_substrate_base_space$$space(space_id,opts){
  opts = (opts || {});
  return {
    "id":space_id,
    "state":opts["state"] || {},
    "meta":opts["meta"] || {}
  };
}

function xt_substrate_base_space$$get_space(node,space_id){
  return (node["spaces"])[space_id || "__NODE__"];
}

function xt_substrate_base_space$$create_space(node,space_id,opts){
  let entry = xt_substrate_base_space$$space(space_id || "__NODE__",opts);
  node["spaces"][entry["id"]] = entry;
  return entry;
}

function xt_substrate_base_space$$ensure_space(node,space_id,opts){
  let sid = space_id || "__NODE__";
  let entry = xt_substrate_base_space$$get_space(node,sid);
  if(null == entry){
    entry = xt_substrate_base_space$$create_space(node,sid,opts);
  }
  return entry;
}

function xt_substrate_base_space$$list_spaces(node){
  return xt_lang_common_data$$arr_sort(Object.keys(node["spaces"]),function (x){
    return x;
  },function (x,y){
    return 0 > x.localeCompare(y);
  });
}

function xt_substrate_page_util$$wrap_space_args(handler){
  return function (context){
    let args = context["args"] || [];
    let params = [context];
    xt_lang_common_data$$arr_assign(params,args);
    return handler.apply(null,params);
  };
}

function xt_substrate_page_util$$check_event(pred,signal,event,ctx){
  let check = false;
  try{
    let t = null;
    if(null == pred){
      t = true;
    }
    else if("boolean" == (typeof pred)){
      t = pred;
    }
    else if("function" == (typeof pred)){
      t = pred(signal,ctx);
    }
    else if((null != pred) && ("object" == (typeof pred)) && !Array.isArray(pred)){
      t = pred[signal];
    }
    else{
      t = (signal == pred);
    }
    if(true == t){
      check = true;
    }
    else if("function" == (typeof t)){
      check = t.apply(null,[event,ctx]);
    }
  }
  catch(err){
    check = false;
  }
  return check;
}

function xt_substrate_page_util$$run_tail_call(context,refresh_deps_fn){
  let {acc,node,path} = context;
  let space_id = context["space"]["id"];
  let group_id = path[0];
  let model_id = path[1];
  if(acc && !acc["error"] && refresh_deps_fn){
    return Promise.resolve().then(function (){
      return refresh_deps_fn(node,space_id,group_id,model_id,refresh_deps_fn);
    }).then(function (_){
      return acc;
    });
  }
  else{
    return acc;
  }
}

function xt_substrate_page_util$$run_remote(context,save_output,path,refresh_deps_fn){
  context["acc"]["path"] = path;
  return xt_event_base_model$$pipeline_run_remote(
    context,
    save_output,
    xt_event_base_model$$async_fn_promise,
    null,
    null
  ).then(function (_){
    return xt_substrate_page_util$$run_tail_call(context,refresh_deps_fn);
  });
}

function xt_substrate_page_util$$run_refresh(context,disabled,path,refresh_deps_fn){
  context["acc"]["path"] = path;
  return xt_event_base_model$$pipeline_run(
    context,
    disabled,
    xt_event_base_model$$async_fn_promise,
    null,
    null
  ).then(function (_){
    return xt_substrate_page_util$$run_tail_call(context,refresh_deps_fn);
  });
}

function xt_substrate_page_util$$get_group_deps(group_id,models){
  let all_deps = {};
  for(let [model_id,model_entry] of Object.entries(models)){
    let {deps} = model_entry;
    for(let path of deps || []){
      path = (Array.isArray(path) ? path : [group_id,path]);
      xt_lang_common_data$$set_in(all_deps,[path[0],path[1],model_id],true);
    };
  };
  return all_deps;
}

function xt_event_util_throttle$$throttle_create(handler,now_fn){
  return {
    "now_fn":(null == now_fn) ? (function (){
        return Date.now();
      }) : now_fn,
    "handler":handler,
    "active":{},
    "queued":{}
  };
}

function xt_event_util_throttle$$throttle_run_async(throttle,id,args){
  let {active,handler,queued} = throttle;
  let key = String(id);
  args = xt_lang_common_data$$arrayify(args);
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
      xt_event_util_throttle$$throttle_run_async(throttle,id,qentry["args"]);
    }
  });
}

function xt_event_util_throttle$$throttle_run(throttle,id,args){
  let {active,now_fn,queued} = throttle;
  let key = String(id);
  args = xt_lang_common_data$$arrayify(args);
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
  let promise = xt_event_util_throttle$$throttle_run_async(throttle,id,args);
  aentry["promise"] = promise;
  return aentry;
}

function xt_substrate_page_core$$proxy_groupp(group){
  let {remote} = group;
  return (null != remote) && (false != remote);
}

function xt_substrate_page_core$$runtime_page(opts){
  opts = (opts || {});
  return {
    "::":"substrate.page",
    "groups":{},
    "meta":opts["meta"] || {},
    "opts":opts
  };
}

function xt_substrate_page_core$$space_ensure_page(node,space_id){
  let space = xt_substrate_base_space$$ensure_space(node,space_id,null);
  let {state} = space;
  if((null == state) || !((null != state) && ("object" == (typeof state)) && !Array.isArray(state))){
    state = {};
    space["state"] = state;
  }
  let runtime = state["page"];
  if(!((null != runtime) && (runtime["::"] == "substrate.page"))){
    runtime = xt_substrate_page_core$$runtime_page(null);
    state["page"] = runtime;
  }
  return runtime;
}

function xt_substrate_page_core$$group_get(node,space_id,group_id){
  return xt_lang_common_data$$get_in(
    xt_substrate_page_core$$space_ensure_page(node,space_id),
    ["groups",group_id]
  );
}

function xt_substrate_page_core$$group_ensure(node,space_id,group_id){
  let group = xt_substrate_page_core$$group_get(node,space_id,group_id);
  if(null == group){
    throw "ERR - Group not found - " + group_id;
  }
  return group;
}

function xt_substrate_page_core$$model_ensure(node,space_id,group_id,model_id){
  let group = xt_substrate_page_core$$group_ensure(node,space_id,group_id);
  let model = (group["models"])[model_id];
  if(null == model){
    throw "ERR - Model not found - " + JSON.stringify([group_id,model_id]);
  }
  return [group,model];
}

function xt_substrate_page_core$$trigger_listeners(node,space_id,path,event){
  let view_key = JSON.stringify([space_id,path]);
  return xt_event_base_listener$$trigger_keyed_listeners(
    node,
    view_key,
    Object.assign({"space_id":space_id,"path":path},event)
  );
}

function xt_substrate_page_core$$model_prep(node,space_id,group_id,model_id,opts){
  let path = [group_id,model_id];
  let space = xt_substrate_base_space$$ensure_space(node,space_id,null);
  let group_value = xt_substrate_page_core$$model_ensure(node,space_id,group_id,model_id);
  let [group,model] = group_value;
  let context_value = xt_event_base_model$$pipeline_prep(model,Object.assign(
    {"path":path,"node":node,"space":space,"group":group},
    opts || {}
  ));
  let [context,disabled] = context_value;
  return [path,context,disabled];
}

function xt_substrate_page_core$$model_get_dependents(node,space_id,group_id,model_id){
  let out = {};
  let groups = xt_substrate_page_core$$space_ensure_page(node,space_id)["groups"];
  for(let [dgroup_id,dgroup] of Object.entries(groups)){
    let {deps} = dgroup;
    let model_lu = xt_lang_common_data$$get_in(deps,[group_id,model_id]);
    if(null != model_lu){
      out[dgroup_id] = Object.keys(model_lu);
    }
  };
  return out;
}

function xt_substrate_page_core$$model_remote_call(node,space_id,group_id,model_id,args,save_output){
  let group_value = xt_substrate_page_core$$model_ensure(node,space_id,group_id,model_id);
  let [group,model] = group_value;
  let dispatch_fn = group["proxy_dispatch"];
  if(dispatch_fn){
    return dispatch_fn("proxy-call",node,space_id,group_id,[model_id,args,save_output]);
  }
  let path_value = xt_substrate_page_core$$model_prep(node,space_id,group_id,model_id,{"args":args});
  let [path,context,disabled] = path_value;
  return xt_substrate_page_util$$run_remote(context,save_output,path,null);
}

function xt_substrate_page_core$$model_refresh(node,space_id,group_id,model_id,event,refresh_deps_fn){
  let group_value = xt_substrate_page_core$$model_ensure(node,space_id,group_id,model_id);
  let [group,model] = group_value;
  let dispatch_fn = group["proxy_dispatch"];
  if(dispatch_fn){
    return dispatch_fn("model-update",node,space_id,group_id,[model_id,event || {}]);
  }
  let path_value = xt_substrate_page_core$$model_prep(node,space_id,group_id,model_id,{"event":event});
  let [path,context,disabled] = path_value;
  return xt_substrate_page_util$$run_refresh(context,disabled,path,refresh_deps_fn);
}

function xt_substrate_page_core$$model_refresh_dependents_unthrottled(node,space_id,group_id,model_id,refresh_deps_fn){
  let dependents = xt_substrate_page_core$$model_get_dependents(node,space_id,group_id,model_id);
  let out = [];
  for(let [dgroup_id,dmodel_ids] of Object.entries(dependents)){
    for(let dmodel_id of dmodel_ids){
      out.push(
        xt_substrate_page_core$$model_refresh(node,space_id,dgroup_id,dmodel_id,{},refresh_deps_fn)
      );
    };
  };
  return Promise.all(out);
}

function xt_substrate_page_core$$create_throttle(node,space_id,group_id,refresh_deps_fn){
  return xt_event_util_throttle$$throttle_create(function (model_id,event){
    return xt_substrate_page_core$$model_refresh(node,space_id,group_id,model_id,event,refresh_deps_fn).catch(function (err){
      return err;
    });
  },function (){
    return Date.now();
  });
}

function xt_substrate_page_core$$create_model(node,space_id,group_id,model_id,opts){
  let {defaults,handler,options,pipeline} = opts;
  let model = xt_event_base_model$$create_model(null,xt_lang_common_data$$obj_assign_nested({
    "main":{
        "handler":handler,
        "wrapper":xt_substrate_page_util$$wrap_space_args
      },
    "remote":{"wrapper":xt_substrate_page_util$$wrap_space_args},
    "sync":{"wrapper":xt_substrate_page_util$$wrap_space_args}
  },pipeline),defaults["args"],defaults["output"],defaults["process"],options);
  xt_event_base_model$$init_model(model);
  xt_event_base_model$$add_listener(model,"@/page",function (_id,data,_t,meta){
    let emitted = Object.assign({},data);
    emitted["meta"] = meta;
    return xt_substrate_page_core$$trigger_listeners(node,space_id,[group_id,model_id],emitted);
  },null,null);
  return model;
}

function xt_substrate_page_core$$group_add_attach(node,space_id,group_id,models){
  let runtime = xt_substrate_page_core$$space_ensure_page(node,space_id);
  let {groups} = runtime;
  let group = groups[group_id];
  if(null == group){
    group = {
      "name":group_id,
      "models":{},
      "specs":{},
      "throttle":xt_substrate_page_core$$create_throttle(
            node,
            space_id,
            group_id,
            xt_substrate_page_core$$model_refresh_dependents_unthrottled
          ),
      "deps":{}
    };
    groups[group_id] = group;
  }
  let group_models = group["models"];
  let group_specs = group["specs"];
  if(null == group_models){
    group_models = {};
    group["models"] = group_models;
  }
  if(null == group_specs){
    group_specs = {};
    group["specs"] = group_specs;
  }
  xt_lang_common_data$$obj_assign(group_specs,models);
  for(let [model_id,model] of Object.entries(models)){
    group_models[model_id] = xt_substrate_page_core$$create_model(node,space_id,group_id,model_id,model);
  };
  group["deps"] = xt_substrate_page_util$$get_group_deps(group_id,group_specs);
  return group;
}

function xt_substrate_page_core$$model_remove(node,space_id,group_id,model_id){
  let dependents = xt_substrate_page_core$$model_get_dependents(node,space_id,group_id,model_id);
  if(Object.keys(dependents).length > 0){
    throw "ERR - existing model dependents - " + JSON.stringify(dependents);
  }
  let group = xt_substrate_page_core$$group_get(node,space_id,group_id);
  if(group){
    let {models} = group;
    let curr = models[model_id];
    delete(models[model_id]);
    return curr;
  }
}

function xt_substrate_page_core$$group_update(node,space_id,group_id,event){
  let group = xt_substrate_page_core$$group_ensure(node,space_id,group_id);
  let dispatch_fn = group["proxy_dispatch"];
  if(dispatch_fn){
    return dispatch_fn("group-update",node,space_id,group_id,[event]);
  }
  let {models,throttle} = group;
  let out = [];
  for(let model_id of Object.keys(models)){
    let entry = xt_event_util_throttle$$throttle_run(throttle,model_id,[event || {}]);
    out.push([model_id,entry["promise"]]);
  };
  return Promise.all(out.map(function (arr){
    return arr[1];
  })).then(function (arr){
    return xt_lang_common_data$$arr_zip(out.map(function (arr){
      return arr[0];
    }),arr);
  });
}

function xt_substrate_page_core$$model_update(node,space_id,group_id,model_id,event){
  let group_value = xt_substrate_page_core$$model_ensure(node,space_id,group_id,model_id);
  let [group,model] = group_value;
  let dispatch_fn = group["proxy_dispatch"];
  if(dispatch_fn){
    return dispatch_fn("model-update",node,space_id,group_id,[model_id,event]);
  }
  let {throttle} = group;
  let entry = xt_event_util_throttle$$throttle_run(throttle,model_id,[event || {}]);
  return entry["promise"];
}

function xt_substrate_page_core$$model_set_input(node,space_id,group_id,model_id,current,event){
  let group_value = xt_substrate_page_core$$model_ensure(node,space_id,group_id,model_id);
  let [group,model] = group_value;
  let dispatch_fn = group["proxy_dispatch"];
  if(dispatch_fn){
    return dispatch_fn(
      "model-set-input",
      node,
      space_id,
      group_id,
      [model_id,current,event]
    );
  }
  xt_event_base_model$$set_input(model,current);
  return xt_substrate_page_core$$model_update(node,space_id,group_id,model_id,event || {});
}

function xt_substrate_page_core$$group_trigger_raw(node,space_id,group,signal,event){
  let {models} = group;
  let out = [];
  for(let [model_id,model] of Object.entries(models)){
    let {options} = model;
    let {trigger} = options;
    let check = xt_substrate_page_util$$check_event(
      trigger,
      signal,
      event,
      {"model":model,"group":group,"node":node,"space_id":space_id}
    );
    if(check){
      xt_event_util_throttle$$throttle_run(group["throttle"],model_id,[event]);
      out.push(model_id);
    }
  };
  return xt_lang_common_data$$arr_sort(out,function (model_id){
    return model_id;
  },function (x,y){
    return 0 > x.localeCompare(y);
  });
}

function xt_substrate_page_core$$group_trigger(node,space_id,group_id,signal,event){
  let group = xt_substrate_page_core$$group_ensure(node,space_id,group_id);
  let dispatch_fn = group["proxy_dispatch"];
  if(dispatch_fn){
    return dispatch_fn("trigger-group",node,space_id,group_id,[signal,event]);
  }
  return xt_substrate_page_core$$group_trigger_raw(node,space_id,group,signal,event);
}

function xt_substrate_page_core$$model_trigger(node,space_id,group_id,model_id,signal,event){
  let group_value = xt_substrate_page_core$$model_ensure(node,space_id,group_id,model_id);
  let [group,model] = group_value;
  let dispatch_fn = group["proxy_dispatch"];
  if(dispatch_fn){
    return dispatch_fn("trigger-model",node,space_id,group_id,[model_id,signal,event]);
  }
  let {options} = model;
  let {trigger} = options;
  if(xt_substrate_page_util$$check_event(
    trigger,
    signal,
    event,
    {"model":model,"group":group,"node":node,"space_id":space_id}
  )){
    let entry = xt_event_util_throttle$$throttle_run(group["throttle"],model_id,[event]);
    return entry["promise"];
  }
  return null;
}

function xt_substrate_base_router$$ensure_router(node){
  let {router} = node;
  if(null == router){
    router = {"connections":{},"subscriptions":{}};
    node["router"] = router;
  }
  return router;
}

function xt_substrate_base_router$$get_connections(node){
  return (xt_substrate_base_router$$ensure_router(node))["connections"];
}

function xt_substrate_base_router$$get_subscriptions(node){
  return (xt_substrate_base_router$$ensure_router(node))["subscriptions"];
}

function xt_substrate_base_router$$register_connection(node,transport_id,meta){
  let entry = {"id":transport_id,"meta":meta || {}};
  xt_substrate_base_router$$get_connections(node)[transport_id] = entry;
  return entry;
}

function xt_substrate_base_router$$prune_subscription_signal_loop(space_subs,signal_ids,transport_id,index){
  if(index >= signal_ids.length){
    return null;
  }
  let signal = signal_ids[index];
  let signal_subs = space_subs[signal];
  if(null != signal_subs){
    delete(signal_subs[transport_id]);
    if(0 == Object.keys(signal_subs).length){
      delete(space_subs[signal]);
    }
  }
  return xt_substrate_base_router$$prune_subscription_signal_loop(space_subs,signal_ids,transport_id,index + 1);
}

function xt_substrate_base_router$$prune_subscription_space_loop(subscriptions,space_ids,transport_id,index){
  if(index >= space_ids.length){
    return null;
  }
  let space = space_ids[index];
  let space_subs = subscriptions[space];
  if(null != space_subs){
    xt_substrate_base_router$$prune_subscription_signal_loop(space_subs,Object.keys(space_subs),transport_id,0);
    if(0 == Object.keys(space_subs).length){
      delete(subscriptions[space]);
    }
  }
  return xt_substrate_base_router$$prune_subscription_space_loop(subscriptions,space_ids,transport_id,index + 1);
}

function xt_substrate_base_router$$unregister_connection(node,transport_id){
  let connections = xt_substrate_base_router$$get_connections(node);
  let prev = connections[transport_id];
  delete(connections[transport_id]);
  let subscriptions = xt_substrate_base_router$$get_subscriptions(node);
  xt_substrate_base_router$$prune_subscription_space_loop(subscriptions,Object.keys(subscriptions),transport_id,0);
  return prev;
}

function xt_substrate_base_router$$ensure_space_subscriptions(node,space){
  let subscriptions = xt_substrate_base_router$$get_subscriptions(node);
  let space_id = space || "__NODE__";
  let space_subs = subscriptions[space_id];
  if(null == space_subs){
    space_subs = {};
    subscriptions[space_id] = space_subs;
  }
  return space_subs;
}

function xt_substrate_base_router$$ensure_signal_subscriptions(node,space,signal){
  let space_subs = xt_substrate_base_router$$ensure_space_subscriptions(node,space);
  let signal_subs = space_subs[signal];
  if(null == signal_subs){
    signal_subs = {};
    space_subs[signal] = signal_subs;
  }
  return signal_subs;
}

function xt_substrate_base_router$$add_subscription(node,transport_id,space,signal,subscription_id,meta){
  let signal_subs = xt_substrate_base_router$$ensure_signal_subscriptions(node,space,signal);
  let entry = {
    "id":subscription_id || xt_substrate_base_frame$$rand_id("sub-",6),
    "meta":meta || {}
  };
  signal_subs[transport_id] = entry;
  return entry;
}

function xt_substrate_base_router$$remove_subscription(node,transport_id,space,signal){
  let subscriptions = xt_substrate_base_router$$get_subscriptions(node);
  let space_subs = subscriptions[space || "__NODE__"];
  if(null == space_subs){
    return null;
  }
  let signal_subs = space_subs[signal];
  if(null == signal_subs){
    return null;
  }
  let prev = signal_subs[transport_id];
  delete(signal_subs[transport_id]);
  if(0 == Object.keys(signal_subs).length){
    delete(space_subs[signal]);
  }
  if(0 == Object.keys(space_subs).length){
    delete(subscriptions[space || "__NODE__"]);
  }
  return prev;
}

function xt_substrate_base_router$$list_subscriptions(node,space,signal){
  let subscriptions = xt_substrate_base_router$$get_subscriptions(node);
  if(null == space){
    return subscriptions;
  }
  else{
    let space_subs = subscriptions[space || "__NODE__"];
    if(null == signal){
      return space_subs || {};
    }
    else{
      if(null == space_subs){
        return [];
      }
      else{
        return xt_lang_common_data$$arr_sort(Object.keys(space_subs[signal] || {}),function (x){
          return x;
        },function (x,y){
          return 0 > x.localeCompare(y);
        });
      }
    }
  }
}

function xt_substrate_base_router$$target_ids(node,space,signal){
  return xt_substrate_base_router$$list_subscriptions(node,space,signal);
}

function xt_substrate_base_router$$receive_subscribe(node,event,ctx){
  let {transport_id} = ctx;
  if(null != transport_id){
    xt_substrate_base_router$$add_subscription(
      node,
      transport_id,
      event["space"],
      event["signal"],
      event["id"],
      event["meta"]
    );
  }
  return Promise.resolve().then(function (){
    return event;
  });
}

function xt_substrate_base_router$$receive_unsubscribe(node,event,ctx){
  let {transport_id} = ctx;
  if(null != transport_id){
    xt_substrate_base_router$$remove_subscription(node,transport_id,event["space"],event["signal"]);
  }
  return Promise.resolve().then(function (){
    return event;
  });
}

function xt_substrate_base_request$$ensure_promise(value){
  if((value instanceof Promise) || (((null != value) && ("object" == (typeof value)) && !Array.isArray(value)) && ("function" == (typeof value["then"])))){
    return value;
  }
  else{
    return Promise.resolve().then(function (){
      return value;
    });
  }
}

function xt_substrate_base_request$$remove_pending(node,request_id){
  let {pending} = node;
  let entry = pending[request_id];
  delete(pending[request_id]);
  return entry;
}

function xt_substrate_base_request$$settle_pending(node,response){
  let {reply_to} = response;
  let entry = xt_substrate_base_request$$remove_pending(node,reply_to);
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

function xt_substrate_base_request$$invoke_handler(node,request){
  let {action} = request;
  let entry = (node["handlers"])[action];
  if(null == entry){
    throw "handler not found - " + action;
  }
  let handler = entry["fn"];
  let current_space = xt_substrate_base_space$$ensure_space(node,request["space"],null);
  return xt_substrate_base_request$$ensure_promise(
    handler.apply(null,[current_space,request["args"],request,node])
  );
}

function xt_substrate_base_pubsub$$invoke_trigger(node,stream){
  let {signal} = stream;
  let entry = (node["triggers"])[signal];
  if(null == entry){
    return Promise.resolve().then(function (){
      return null;
    });
  }
  let current_space = xt_substrate_base_space$$ensure_space(node,stream["space"],null);
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

function xt_substrate_base_pubsub$$receive_publish(node,stream){
  xt_substrate_base_space$$ensure_space(node,stream["space"],null);
  return xt_substrate_base_pubsub$$invoke_trigger(node,stream).then(function (_){
    return stream;
  });
}

function xt_substrate_base_json$$normalize_error(err){
  if(null == err){
    return null;
  }
  else if(err instanceof Error){
    return {
      "message":(err instanceof Error) ? err["message"] : null,
      "data":(err instanceof Error) ? err["data"] : null
    };
  }
  else if("string" == (typeof err)){
    return {"message":err};
  }
  else if((null != err) && ("object" == (typeof err)) && !Array.isArray(err)){
    let out = Object.assign({},err);
    if(!(null != out["message"]) && (null != out["error"]) && ("string" == (typeof out["error"]))){
      out["message"] = out["error"];
    }
    if(!(null != out["message"]) && (null != out["status"]) && ("string" == (typeof out["status"]))){
      out["message"] = out["status"];
    }
    if(!(null != out["message"])){
      out["message"] = String(err);
    }
    return out;
  }
  else{
    return {"message":String(err)};
  }
}

function xt_substrate_base_util$$transport_get(node,transport_id){
  return (node["transports"])[transport_id];
}

function xt_substrate_base_util$$transport_list(node){
  return xt_lang_common_data$$arr_sort(Object.keys(node["transports"]),function (x){
    return x;
  },function (x,y){
    return 0 > x.localeCompare(y);
  });
}

function xt_substrate_base_util$$transport_send(node,transport_id,frame){
  let transport = xt_substrate_base_util$$transport_get(node,transport_id);
  if(null == transport){
    throw "transport not found - " + transport_id;
  }
  let {send_fn} = transport;
  if(null == send_fn){
    throw "transport missing send_fn - " + transport_id;
  }
  return xt_substrate_base_request$$ensure_promise(send_fn(frame));
}

function xt_substrate_base_util$$stream_route_loop(node,ids,frame,exclude_id,index){
  if(index >= ids.length){
    return Promise.resolve().then(function (){
      return frame;
    });
  }
  let transport_id = ids[index];
  if(transport_id == exclude_id){
    return xt_substrate_base_util$$stream_route_loop(node,ids,frame,exclude_id,index + 1);
  }
  else{
    return xt_substrate_base_util$$transport_send(node,transport_id,frame).then(function (_){
      return xt_substrate_base_util$$stream_route_loop(node,ids,frame,exclude_id,index + 1);
    });
  }
}

function xt_substrate_base_util$$request_context_merge(request,ctx){
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

function xt_substrate_base_util$$response_ok(node,request,data,meta,ctx){
  let response = xt_substrate_base_frame$$response_ok_frame(request["id"],request["space"],data,meta);
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
    return xt_substrate_base_util$$transport_send(node,transport_id,response).then(function (_){
      return response;
    });
  }
}

function xt_substrate_base_util$$response_error(node,request,error,meta,ctx){
  let response = xt_substrate_base_frame$$response_error_frame(
    request["id"],
    request["space"],
    xt_substrate_base_json$$normalize_error(error),
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
    return xt_substrate_base_util$$transport_send(node,transport_id,response).then(function (_){
      return response;
    });
  }
}

function xt_substrate_base_util$$config_normalize_space(space_id,config){
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

function xt_substrate_base_util$$config_normalize_handler(action,config){
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

function xt_substrate_base_util$$config_normalize_trigger(signal,config){
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

function xt_substrate_base_util$$node_base_opts(opts){
  let base = Object.assign({},opts || {});
  delete(base["spaces"]);
  delete(base["handlers"]);
  delete(base["triggers"]);
  return base;
}

function xt_substrate_base_util$$register_handler(node,action,handler,meta){
  let entry = {"id":action,"fn":handler,"meta":meta || {}};
  node["handlers"][action] = entry;
  return entry;
}

function xt_substrate_base_util$$list_handlers(node){
  return xt_lang_common_data$$arr_sort(Object.keys(node["handlers"]),function (x){
    return x;
  },function (x,y){
    return 0 > x.localeCompare(y);
  });
}

function xt_substrate_base_util$$register_trigger(node,signal,trigger_fn,meta){
  let entry = {"id":signal,"fn":trigger_fn,"meta":meta || {}};
  node["triggers"][signal] = entry;
  return entry;
}

function xt_substrate_base_util$$list_triggers(node){
  return xt_lang_common_data$$arr_sort(Object.keys(node["triggers"]),function (x){
    return x;
  },function (x,y){
    return 0 > x.localeCompare(y);
  });
}

function xt_substrate_base_util$$publish(node,space,signal,data,meta){
  meta = (meta || {});
  let stream = xt_substrate_base_frame$$stream_frame(space,signal,data,meta,meta["cause"]);
  return xt_substrate_base_pubsub$$receive_publish(node,stream).then(function (_){
    return xt_substrate_base_util$$stream_route_loop(
      node,
      xt_substrate_base_router$$target_ids(node,stream["space"],stream["signal"]),
      stream,
      meta["transport_id"],
      0
    );
  });
}

function xt_substrate_base_util_handlers$$ping(space,args,request,node){
  return {"pong":true,"node":node["id"]};
}

function xt_substrate_base_util_handlers$$echo(space,args,request,node){
  return args;
}

function xt_substrate_base_util_handlers$$list_handlers(space,args,request,node){
  return xt_substrate_base_util$$list_handlers(node);
}

function xt_substrate_base_util_handlers$$list_triggers(space,args,request,node){
  return xt_substrate_base_util$$list_triggers(node);
}

function xt_substrate_base_util_handlers$$list_spaces(space,args,request,node){
  return xt_substrate_base_space$$list_spaces(node);
}

function xt_substrate_base_util_handlers$$list_transports(space,args,request,node){
  return xt_substrate_base_util$$transport_list(node);
}

function xt_substrate_base_util_handlers$$node_info(space,args,request,node){
  return {"id":node["id"],"meta":node["meta"]};
}

function xt_substrate_base_util_handlers$$handle_get_service(space,args,request,node){
  return (node["services"] || {})[args];
}

function xt_substrate_base_util_handlers$$install_util_handlers(node){
  xt_substrate_base_util$$register_handler(
    node,
    "@/ping",
    xt_substrate_base_util_handlers$$ping,
    {"substrate/fn":"@/ping"}
  );
  xt_substrate_base_util$$register_handler(
    node,
    "@/echo",
    xt_substrate_base_util_handlers$$echo,
    {"substrate/fn":"@/echo"}
  );
  xt_substrate_base_util$$register_handler(
    node,
    "@/list-handlers",
    xt_substrate_base_util_handlers$$list_handlers,
    {"substrate/fn":"@/list-handlers"}
  );
  xt_substrate_base_util$$register_handler(
    node,
    "@/list-triggers",
    xt_substrate_base_util_handlers$$list_triggers,
    {"substrate/fn":"@/list-triggers"}
  );
  xt_substrate_base_util$$register_handler(
    node,
    "@/list-spaces",
    xt_substrate_base_util_handlers$$list_spaces,
    {"substrate/fn":"@/list-spaces"}
  );
  xt_substrate_base_util$$register_handler(
    node,
    "@/list-transports",
    xt_substrate_base_util_handlers$$list_transports,
    {"substrate/fn":"@/list-transports"}
  );
  xt_substrate_base_util$$register_handler(
    node,
    "@/get-service",
    xt_substrate_base_util_handlers$$handle_get_service,
    {"substrate/fn":"@/get-service"}
  );
  xt_substrate_base_util$$register_handler(
    node,
    "@/node-info",
    xt_substrate_base_util_handlers$$node_info,
    {"substrate/fn":"@/node-info"}
  );
  return node;
}

function xt_substrate_page_proxy$$model_serialize_input(input){
  return {"current":input["current"],"updated":input["updated"]};
}

function xt_substrate_page_proxy$$model_serialize_output(output){
  return {
    "type":output["type"],
    "current":output["current"],
    "updated":output["updated"],
    "elapsed":output["elapsed"],
    "pending":output["pending"],
    "disabled":output["disabled"],
    "errored":output["errored"],
    "tag":output["tag"]
  };
}

function xt_substrate_page_proxy$$model_serialize(model){
  let input = xt_event_base_model$$get_input(model);
  let output = xt_event_base_model$$get_output(model,null);
  let {remote,sync} = model;
  let out = {
    "input":xt_substrate_page_proxy$$model_serialize_input(input),
    "output":xt_substrate_page_proxy$$model_serialize_output(output)
  };
  if(null != remote){
    out["remote"] = xt_substrate_page_proxy$$model_serialize_output(remote);
  }
  if(null != sync){
    out["sync"] = xt_substrate_page_proxy$$model_serialize_output(sync);
  }
  return out;
}

function xt_substrate_page_proxy$$group_snapshot(node,space_id,group_id){
  let group = xt_substrate_page_core$$group_get(node,space_id,group_id);
  if(null == group){
    return {};
  }
  let {models} = group;
  let out = {};
  for(let [model_id,model] of Object.entries(models)){
    out[model_id] = xt_substrate_page_proxy$$model_serialize(model);
  };
  return out;
}

function xt_substrate_page_proxy$$publish_model_output(node,space_id,path,output){
  let target_ids = xt_substrate_base_router$$target_ids(node,space_id,"page.model/output");
  if(0 == target_ids.length){
    return null;
  }
  return xt_substrate_base_util$$publish(node,space_id,"page.model/output",{
    "path":path,
    "output":xt_substrate_page_proxy$$model_serialize_output(output)
  },{});
}

function xt_substrate_page_proxy$$publish_model_input(node,space_id,path,input){
  let target_ids = xt_substrate_base_router$$target_ids(node,space_id,"page.model/input");
  if(0 == target_ids.length){
    return null;
  }
  return xt_substrate_base_util$$publish(node,space_id,"page.model/input",{
    "path":path,
    "input":xt_substrate_page_proxy$$model_serialize_input(input)
  },{});
}

function xt_substrate_page_proxy$$ensure_model_listeners(node,space_id,group_id,model_id,model){
  let listeners_map = model["listeners"];
  if(null == listeners_map["@/page-proxy/output"]){
    xt_event_base_model$$add_listener(model,"@/page-proxy/output",function (_id,data,_t,meta){
      return xt_substrate_page_proxy$$publish_model_output(node,space_id,[group_id,model_id],data["data"]);
    },null,function (event){
      return "model.output" == event["type"];
    });
  }
  if(null == listeners_map["@/page-proxy/input"]){
    xt_event_base_model$$add_listener(model,"@/page-proxy/input",function (_id,data,_t,meta){
      return xt_substrate_page_proxy$$publish_model_input(node,space_id,[group_id,model_id],data["data"]);
    },null,function (event){
      return "model.input" == event["type"];
    });
  }
  return model;
}

function xt_substrate_page_proxy$$group_handle_list(space,args,request,node){
  let space_id = args[0];
  let runtime = xt_substrate_page_core$$space_ensure_page(node,space_id);
  let {groups} = runtime;
  let out = {};
  for(let [group_id,group] of Object.entries(groups)){
    let {models} = group;
    let model_ids = [];
    for(let model_id of Object.keys(models)){
      model_ids.push(model_id);
    };
    out[group_id] = {"models":model_ids};
  };
  return out;
}

function xt_substrate_page_proxy$$group_handle_open(space,args,request,node){
  let payload = args[0];
  let space_id = payload["space"];
  let group_id = payload["group"];
  let transport_id = xt_lang_common_data$$get_in(request,["meta","transport_id"]);
  let group = xt_substrate_page_core$$group_get(node,space_id,group_id);
  if(null == group){
    return {"error":"group not found","space":space_id,"group":group_id};
  }
  let {models} = group;
  for(let [model_id,model] of Object.entries(models)){
    xt_substrate_page_proxy$$ensure_model_listeners(node,space_id,group_id,model_id,model);
  };
  if(null != transport_id){
    xt_substrate_base_router$$add_subscription(node,transport_id,space_id,"page.model/output",null,{});
    xt_substrate_base_router$$add_subscription(node,transport_id,space_id,"page.model/input",null,{});
  }
  let {init} = group;
  if(null != init){
    return init.then(function (_){
      return {
        "space":space_id,
        "group":group_id,
        "models":xt_substrate_page_proxy$$group_snapshot(node,space_id,group_id)
      };
    });
  }
  else{
    return {
      "space":space_id,
      "group":group_id,
      "models":xt_substrate_page_proxy$$group_snapshot(node,space_id,group_id)
    };
  }
}

function xt_substrate_page_proxy$$group_handle_close(space,args,request,node){
  let payload = args[0];
  let space_id = payload["space"];
  let group_id = payload["group"];
  let transport_id = xt_lang_common_data$$get_in(request,["meta","transport_id"]);
  if(null != transport_id){
    xt_substrate_base_router$$remove_subscription(node,transport_id,space_id,"page.model/output");
    xt_substrate_base_router$$remove_subscription(node,transport_id,space_id,"page.model/input");
  }
  return {"status":"closed","space":space_id,"group":group_id};
}

function xt_substrate_page_proxy$$group_handle_update(space,args,request,node){
  let payload = args[0];
  return xt_substrate_page_core$$group_update(node,payload["space"],payload["group"],payload["event"] || {}).then(function (_){
    return {"status":"ok"};
  });
}

function xt_substrate_page_proxy$$model_handle_update(space,args,request,node){
  let payload = args[0];
  return xt_substrate_page_core$$model_update(
    node,
    payload["space"],
    payload["group"],
    payload["model"],
    payload["event"] || {}
  );
}

function xt_substrate_page_proxy$$model_handle_set_input(space,args,request,node){
  let payload = args[0];
  return xt_substrate_page_core$$model_set_input(
    node,
    payload["space"],
    payload["group"],
    payload["model"],
    payload["current"],
    payload["event"] || {}
  ).then(function (_){
    return {"status":"ok"};
  });
}

function xt_substrate_page_proxy$$model_handle_trigger(space,args,request,node){
  let payload = args[0];
  let out = xt_substrate_page_core$$model_trigger(
    node,
    payload["space"],
    payload["group"],
    payload["model"],
    payload["signal"],
    payload["event"] || {}
  );
  return {"status":"ok","triggered":null != out};
}

function xt_substrate_page_proxy$$group_handle_trigger(space,args,request,node){
  let payload = args[0];
  let out = xt_substrate_page_core$$group_trigger(
    node,
    payload["space"],
    payload["group"],
    payload["signal"],
    payload["event"] || {}
  );
  return {"status":"ok","models":out};
}

function xt_substrate_page_proxy$$model_handle_proxy_call(space,args,request,node){
  let payload = args[0];
  let space_id = payload["space"];
  let group_id = payload["group"];
  let model_id = payload["model"];
  return xt_substrate_page_core$$model_remote_call(
    node,
    space_id,
    group_id,
    model_id,
    payload["args"] || [],
    payload["save_output"]
  ).then(function (_){
    let model_value = xt_substrate_page_core$$model_ensure(node,space_id,group_id,model_id);
    let [_group,model] = model_value;
    return {
      "status":"ok",
      "output":xt_substrate_page_proxy$$model_serialize_output(model["output"])
    };
  }).catch(function (err){
    return {
      "status":"error",
      "message":(err instanceof Error) ? err["message"] : null,
      "stack":err["stack"],
      "data":(err instanceof Error) ? err["data"] : null
    };
  });
}

function xt_substrate_page_proxy$$install_handlers(node){
  xt_substrate_base_util$$register_handler(
    node,
    "@page/group-list",
    xt_substrate_page_proxy$$group_handle_list,
    null
  );
  xt_substrate_base_util$$register_handler(
    node,
    "@page/group-open",
    xt_substrate_page_proxy$$group_handle_open,
    null
  );
  xt_substrate_base_util$$register_handler(
    node,
    "@page/group-close",
    xt_substrate_page_proxy$$group_handle_close,
    null
  );
  xt_substrate_base_util$$register_handler(
    node,
    "@page/group-update",
    xt_substrate_page_proxy$$group_handle_update,
    null
  );
  xt_substrate_base_util$$register_handler(
    node,
    "@page/model-update",
    xt_substrate_page_proxy$$model_handle_update,
    null
  );
  xt_substrate_base_util$$register_handler(
    node,
    "@page/model-set-input",
    xt_substrate_page_proxy$$model_handle_set_input,
    null
  );
  xt_substrate_base_util$$register_handler(
    node,
    "@page/model-trigger",
    xt_substrate_page_proxy$$model_handle_trigger,
    null
  );
  xt_substrate_base_util$$register_handler(
    node,
    "@page/model-proxy-call",
    xt_substrate_page_proxy$$model_handle_proxy_call,
    null
  );
  xt_substrate_base_util$$register_handler(
    node,
    "@page/group-trigger",
    xt_substrate_page_proxy$$group_handle_trigger,
    null
  );
  return node;
}

function xt_substrate_page_proxy$$model_apply_output(space,stream,node){
  let {data} = stream;
  let space_id = stream["space"];
  let {path} = data;
  let group_id = path[0];
  let model_id = path[1];
  let {output} = data;
  let group = xt_substrate_page_core$$group_get(node,space_id,group_id);
  if((null == group) || !xt_substrate_page_core$$proxy_groupp(group)){
    return null;
  }
  let model = xt_lang_common_data$$get_in(group,["models",model_id]);
  if(null == model){
    return null;
  }
  Object.assign(model["output"],output);
  return xt_event_base_model$$trigger_listeners(model,"model.output",model["output"]);
}

function xt_substrate_page_proxy$$model_apply_input(space,stream,node){
  let {data} = stream;
  let space_id = stream["space"];
  let {path} = data;
  let group_id = path[0];
  let model_id = path[1];
  let {input} = data;
  let group = xt_substrate_page_core$$group_get(node,space_id,group_id);
  if((null == group) || !xt_substrate_page_core$$proxy_groupp(group)){
    return null;
  }
  let model = xt_lang_common_data$$get_in(group,["models",model_id]);
  if(null == model){
    return null;
  }
  Object.assign(model["input"],input);
  return xt_event_base_model$$trigger_listeners(model,"model.input",model["input"]);
}

function xt_substrate_page_proxy$$install_triggers(node){
  xt_substrate_base_util$$register_trigger(
    node,
    "page.model/output",
    xt_substrate_page_proxy$$model_apply_output,
    null
  );
  xt_substrate_base_util$$register_trigger(
    node,
    "page.model/input",
    xt_substrate_page_proxy$$model_apply_input,
    null
  );
  return node;
}

function xt_substrate_page_proxy$$install(node){
  xt_substrate_page_proxy$$install_handlers(node);
  xt_substrate_page_proxy$$install_triggers(node);
  return node;
}

function xt_substrate$$transportp(obj){
  return ((null != obj) && ("object" == (typeof obj)) && !Array.isArray(obj)) && ("substrate.transport" == obj["::"]);
}

function xt_substrate$$transport_create(transport_id,impl){
  return Object.assign(
    {"::":"substrate.transport","id":transport_id,"listener":null},
    impl || {}
  );
}

function xt_substrate$$get_services(node){
  return node["services"] || {};
}

function xt_substrate$$get_service(node,service_id){
  return (xt_substrate$$get_services(node))[service_id];
}

function xt_substrate$$set_service(node,service_id,service){
  node["services"][service_id] = service;
  return service;
}

function xt_substrate$$remove_service(node,service_id){
  let service = xt_substrate$$get_service(node,service_id);
  delete(node["services"][service_id]);
  return service;
}

function xt_substrate$$transport_get(node,transport_id){
  return xt_substrate_base_util$$transport_get(node,transport_id);
}

function xt_substrate$$register_trigger(node,signal,trigger_fn,meta){
  return xt_substrate_base_util$$register_trigger(node,signal,trigger_fn,meta);
}

function xt_substrate$$register_handler(node,action,handler,meta){
  return xt_substrate_base_util$$register_handler(node,action,handler,meta);
}

function xt_substrate$$route_stream(node,stream,exclude_id){
  return xt_substrate_base_util$$stream_route_loop(
    node,
    xt_substrate_base_router$$target_ids(node,stream["space"],stream["signal"]),
    stream,
    exclude_id,
    0
  );
}

function xt_substrate$$receive_request(node,request,ctx){
  ctx = (ctx || {});
  xt_substrate_base_util$$request_context_merge(request,ctx);
  try{
    return xt_substrate_base_request$$invoke_handler(node,request).then(function (data){
      return xt_substrate_base_util$$response_ok(node,request,data,null,ctx);
    }).catch(function (err){
      return xt_substrate_base_util$$response_error(node,request,err,null,ctx);
    });
  }
  catch(err){
    return xt_substrate_base_util$$response_error(node,request,err,null,ctx);
  }
}

function xt_substrate$$receive_response(node,response){
  xt_substrate_base_request$$settle_pending(node,response);
  return Promise.resolve().then(function (){
    return response;
  });
}

function xt_substrate$$receive_publish(node,stream,ctx){
  ctx = (ctx || {});
  return xt_substrate_base_pubsub$$receive_publish(node,stream).then(function (_){
    return xt_substrate$$route_stream(node,stream,ctx["transport_id"]);
  });
}

function xt_substrate$$receive_frame(node,event,ctx){
  let {kind} = event;
  if(kind == "request"){
    return xt_substrate$$receive_request(node,event,ctx);
  }
  else if(kind == "response"){
    return xt_substrate$$receive_response(node,event);
  }
  else if(kind == "stream"){
    return xt_substrate$$receive_publish(node,event,ctx);
  }
  else if(kind == "subscribe"){
    return xt_substrate_base_router$$receive_subscribe(node,event,ctx);
  }
  else if(kind == "unsubscribe"){
    return xt_substrate_base_router$$receive_unsubscribe(node,event,ctx);
  }
  else{
    return Promise.resolve().then(function (){
      return event;
    });
  }
}

function xt_substrate$$attach_transport(node,transport_id,transport){
  transport = (xt_substrate$$transportp(transport) ? transport : xt_substrate$$transport_create(transport_id,transport));
  node["transports"][transport_id] = transport;
  xt_substrate_base_router$$register_connection(node,transport_id,{"meta":transport["meta"]});
  let {start_fn} = transport;
  if(null == start_fn){
    return Promise.resolve().then(function (){
      return transport;
    });
  }
  return xt_substrate_base_request$$ensure_promise(start_fn(function (event,ctx){
    ctx = (ctx || {});
    if(null == ctx["transport_id"]){
      ctx["transport_id"] = transport_id;
    }
    return xt_substrate$$receive_frame(node,event,ctx);
  })).then(function (listener){
    transport["listener"] = listener;
    return transport;
  });
}

function xt_substrate$$detach_transport(node,transport_id){
  let {transports} = node;
  let transport = transports[transport_id];
  if(null == transport){
    return Promise.resolve().then(function (){
      return null;
    });
  }
  delete(transports[transport_id]);
  xt_substrate_base_router$$unregister_connection(node,transport_id);
  let {stop_fn} = transport;
  if(null == stop_fn){
    return Promise.resolve().then(function (){
      return transport;
    });
  }
  return xt_substrate_base_request$$ensure_promise(stop_fn(transport["listener"])).then(function (_){
    return transport;
  });
}

function xt_substrate$$node_configure(node,opts){
  opts = (opts || {});
  xt_substrate_base_util_handlers$$install_util_handlers(node);
  for(let [space_id,config] of Object.entries(opts["spaces"] || {})){
    xt_substrate_base_space$$create_space(
      node,
      space_id,
      xt_substrate_base_util$$config_normalize_space(space_id,config)
    );
  };
  for(let [action,config] of Object.entries(opts["handlers"] || {})){
    let entry = xt_substrate_base_util$$config_normalize_handler(action,config);
    xt_substrate$$register_handler(node,action,entry["fn"],entry["meta"]);
  };
  for(let [signal,config] of Object.entries(opts["triggers"] || {})){
    let entry = xt_substrate_base_util$$config_normalize_trigger(signal,config);
    xt_substrate$$register_trigger(node,signal,entry["fn"],entry["meta"]);
  };
  return node;
}

function xt_substrate$$node_create(opts){
  opts = (opts || {});
  let node = xt_event_base_listener$$blank_container("substrate",Object.assign({
    "meta":opts["meta"] || {},
    "router":{"connections":{},"subscriptions":{}},
    "pending":{},
    "handlers":{},
    "triggers":{},
    "spaces":{},
    "id":opts["id"] || xt_substrate_base_frame$$rand_id("node-",6),
    "transports":{},
    "services":{}
  },xt_substrate_base_util$$node_base_opts(opts)));
  xt_substrate$$node_configure(node,opts);
  return node;
}

function xt_substrate_transport_browser$$connection_record(node,transport_id,ready){
  let transport = xt_substrate$$transport_get(node,transport_id);
  return {
    "node":node,
    "transport_id":transport_id,
    "transport":transport,
    "target":(null == transport) ? null : transport["listener"],
    "ready":ready,
    "disconnect_fn":function (){
        return xt_substrate$$detach_transport(node,transport_id);
      }
  };
}

function xt_substrate_transport_browser$$event_data(event){
  return (((null != event) && ("object" == (typeof event)) && !Array.isArray(event)) && (null != event["data"])) ? event["data"] : event;
}

function xt_substrate_transport_browser$$self_endpoint(worker_self){
  let current_callback = null;
  let send_fn = function (frame){
    worker_self.postMessage(frame);
    return Promise.resolve().then(function (){
      return true;
    });
  };
  let start_fn = function (listener){
    current_callback = (function (event){
      return listener(xt_substrate_transport_browser$$event_data(event),null);
    });
    worker_self.addEventListener("message",current_callback,false);
    return worker_self;
  };
  let stop_fn = function (_){
    if((null != current_callback) && ("function" == (typeof worker_self["removeEventListener"]))){
      worker_self.removeEventListener("message",current_callback,false);
    }
    current_callback = null;
    return true;
  };
  return {
    "meta":{"kind":"webworker.self"},
    "send_fn":send_fn,
    "start_fn":start_fn,
    "stop_fn":stop_fn
  };
}

function xt_substrate_transport_browser$$boot_self(node,opts){
  let config = opts || {};
  let {target} = config;
  let transport_id = config["transport_id"] || "host";
  let {ready} = config;
  if(null == target){
    throw "boot-self requires `target`";
  }
  return xt_substrate$$attach_transport(
    node,
    transport_id,
    xt_substrate_transport_browser$$self_endpoint(target)
  ).then(function (_){
    if(null == ready){
      return xt_substrate_transport_browser$$connection_record(node,transport_id,null);
    }
    else{
      return xt_substrate$$transport_get(node,transport_id)["send_fn"](ready).then(function (_){
        return xt_substrate_transport_browser$$connection_record(node,transport_id,ready);
      });
    }
  });
}

function xt_db_node_site_map$$fetch_json(url){
  let fetch_fn = globalThis["fetch"];
  if(null == fetch_fn){
    throw "SharedWorker site-map loading requires fetch";
  }
  return fetch_fn(url).then(function (response){
    if((null != response["ok"]) && !response["ok"]){
      throw "Unable to load SharedWorker site map: " + url;
    }
    return response.text().then(function (body){
      return JSON.parse(body);
    });
  });
}

function xt_db_node_site_map$$load_remote(url){
  return xt_db_node_site_map$$fetch_json(url).then(function (manifest){
    let schema_url = manifest["schema_url"] || manifest["schema"];
    let lookup_url = manifest["lookup_url"] || manifest["lookup"];
    let rpc_url = manifest["rpc_url"] || manifest["rpc"];
    return Promise.all([
      xt_db_node_site_map$$fetch_json(schema_url),
      xt_db_node_site_map$$fetch_json(lookup_url),
      xt_db_node_site_map$$fetch_json(rpc_url)
    ]).then(function (values){
      let [schema,lookup,rpc] = values;
      return {"schema":schema,"lookup":lookup,"rpc":rpc,"manifest":manifest};
    });
  });
}

function xt_db_node_site_map$$load_site_map(node,config,schema,lookup){
  let meta = node["meta"];
  let url = config["site_map_url"] || config["site-map-url"];
  let cached = xt_lang_common_data$$get_in(meta,["xt.db/site-map"]);
  if(null != cached){
    if((null != url) && (url != cached["url"])){
      throw "SharedWorker already loaded site map: " + cached["url"];
    }
    return cached["promise"] || Promise.resolve().then(function (){
      return cached["data"];
    });
  }
  if(null == url){
    let fallback = {"schema":schema,"lookup":lookup,"rpc":{}};
    meta["xt.db/site-map"] = {"url":null,"data":fallback};
    return Promise.resolve().then(function (){
      return fallback;
    });
  }
  let pending = xt_db_node_site_map$$load_remote(url);
  let guarded = pending.then(function (data){
    meta["xt.db/site-map"] = {"url":url,"data":data};
    return data;
  }).catch(function (err){
    delete(meta["xt.db/site-map"]);
    throw err;
  });
  meta["xt.db/site-map"] = {"url":url,"promise":guarded};
  return guarded;
}

function xt_net_http_util$$decode_body(body){
  if(!("string" == (typeof body))){
    return body;
  }
  else if("" == body){
    return null;
  }
  else{
    try{
      return JSON.parse(body);
    }
    catch(err){
      return body;
    }
  }
}

function xt_net_http_util$$response_normalize(response){
  if(null == response){
    return {"status":null,"headers":{},"body":null,"error":null};
  }
  else if(((null != response) && ("object" == (typeof response)) && !Array.isArray(response)) && (null != response["body"])){
    let out = Object.assign({},response);
    out["headers"] = Object.assign({},out["headers"]);
    out["body"] = xt_net_http_util$$decode_body(out["body"]);
    return out;
  }
  else if((null != response) && ("object" == (typeof response)) && !Array.isArray(response)){
    return response;
  }
  else{
    return {
      "status":null,
      "headers":{},
      "body":xt_net_http_util$$decode_body(response),
      "error":null
    };
  }
}

function xt_net_http_util$$encode_query_params(params){
  let out = [];
  for(let [k,v] of Object.entries(params || {})){
    if(null != v){
      out.push(k + "=" + String(v));
    }
  };
  return out.join("&");
}

function xt_net_http_util$$get_body_data(response){
  let out = response["body"];
  if(((null != out) && ("object" == (typeof out)) && !Array.isArray(out)) && (null != out["data"])){
    return out["data"];
  }
  else{
    return out;
  }
}

globalThis["xt_lang_common_protocol$$PROTOCOLS"] = {};

globalThis["xt_lang_common_protocol$$IMPLEMENTATIONS"] = {};

function xt_lang_common_protocol$$protocol_implements(obj,protocol){
  let type = obj["::"];
  if(null == type){
    return false;
  }
  let entry = globalThis["xt_lang_common_protocol$$PROTOCOLS"][protocol];
  if(null == entry){
    return false;
  }
  let {impls} = entry;
  return null != impls[type];
}

function xt_lang_common_protocol$$protocol_method(obj,on,method){
  let type = obj["::"];
  let override_map = obj["::/override"];
  if(!(null == override_map)){
    let override_fn = override_map[method];
    if(!(null == override_fn)){
      return override_fn;
    }
  }
  let local_impls = obj["::/protocol-impls"];
  let local_impl_map = local_impls && local_impls[on];
  let protocol = globalThis["xt_lang_common_protocol$$PROTOCOLS"][on];
  if((null == protocol) && (null == local_impl_map)){
    throw "Missing protocol entry " + on;
  }
  let protocol_impls = protocol && protocol["impls"];
  let protocol_impl_map = (protocol_impls && protocol_impls[type]) || local_impl_map;
  if(null == protocol_impl_map){
    throw "Missing protocol implementation " + on + " for " + type;
  }
  let method_fn = protocol_impl_map[method];
  if(null == method_fn){
    throw "Missing protocol method " + on + "/" + method + " for " + type;
  }
  return method_fn;
}

function xt_lang_common_protocol$$register_protocol_impl(protocolname,typename,impl_map){
  let protocol = globalThis["xt_lang_common_protocol$$PROTOCOLS"][protocolname];
  if(null == protocol){
    throw "Missing protocol " + protocolname;
  }
  let {impls} = protocol;
  impls[typename] = impl_map;
  return impl_map;
}

function xt_lang_common_protocol$$register_protocol(protocol){
  globalThis["xt_lang_common_protocol$$PROTOCOLS"][protocol["on"]] = protocol;
  return protocol;
}

function xt_lang_common_protocol$$create_protocol_fn(on,sig_map){
  let protocol = {"::":"type/protocol","on":on,"sigs":sig_map,"impls":{}};
  return xt_lang_common_protocol$$register_protocol(protocol);
}

var xt_net_http_fetch$$IHttpClient = xt_lang_common_protocol$$create_protocol_fn("xt.net.http_fetch/IHttpClient",{
  "request_http":{"name":"request_http","arglist":["client","input"]}
});

function xt_net_http_fetch$$request_http(client,input){
  let method_fn = xt_lang_common_protocol$$protocol_method(client,"xt.net.http_fetch/IHttpClient","request_http");
  return method_fn(client,input);
}

function xt_net_http_fetch$$prepare_url(client,input){
  let {path,url} = input;
  if(!(null == url)){
    return url;
  }
  let {defaults} = client;
  let {basepath,host,port,secured} = defaults;
  return "http" + (secured ? "s" : "") + "://" + host + ":" + String(port || 80) + (basepath || "") + (path || "");
}

function xt_net_http_fetch$$prepare_input(client,input){
  let {defaults} = client;
  let {body,method} = input;
  let headers = Object.assign(Object.assign({},defaults["headers"]),input["headers"]);
  let output = {
    "url":xt_net_http_fetch$$prepare_url(client,input),
    "method":method || "GET",
    "headers":headers
  };
  if(null != body){
    output = Object.assign(output,{"body":body});
  }
  return output;
}

function xt_net_http_fetch$$wrap_prepare_input(handler){
  return function (client,input){
    let prepped = xt_net_http_fetch$$prepare_input(client,input);
    return handler(client,prepped);
  };
}

function xt_net_http_fetch$$wrap_normalise(handler){
  return function (client,input){
    return handler(client,input).then(function (response){
      return xt_net_http_util$$response_normalize(response);
    });
  };
}

function xt_net_http_fetch$$prepare_middleware(client,handler){
  let {middleware} = client;
  for(let wrapper of middleware || []){
    handler = wrapper(handler);
  };
  return handler;
}

function xt_net_addon_supabase$$wrap_supabase_auth(handler){
  return function (client,input){
    let {defaults} = client;
    let apikey = input["apikey"] || defaults["apikey"];
    let token = input["token"] || defaults["token"];
    let headers = Object.assign(Object.assign(Object.assign({
      "Content-Type":"application/json",
      "Accept":"application/json"
    },input["headers"]),token ? {"Authorization":"Bearer " + token} : null),apikey ? {"apikey":apikey} : null);
    return handler(
      client,
      Object.assign(Object.assign({},input),{"headers":headers})
    );
  };
}

function xt_net_addon_supabase$$middleware_supabase(){
  return [
    xt_net_http_fetch$$wrap_prepare_input,
    xt_net_addon_supabase$$wrap_supabase_auth,
    xt_net_http_fetch$$wrap_normalise
  ];
}

function xt_net_addon_supabase$$cmd_rpc_call(rpc_name,data,opts){
  let path = "/rest/v1/rpc/" + rpc_name;
  return Object.assign(
    {"path":path,"method":"POST","body":JSON.stringify(data || {})},
    opts
  );
}

function xt_net_addon_supabase$$cmd_query_table(table_name,query,opts){
  let path = "/rest/v1/" + table_name + "?" + query;
  return Object.assign({"path":path,"method":"GET"},opts);
}

function xt_net_addon_supabase$$cmd_health(opts){
  return Object.assign({"path":"/auth/v1/health","method":"GET"},opts);
}

function xt_net_addon_supabase$$cmd_signup(data,opts){
  return Object.assign({
    "path":"/auth/v1/signup",
    "method":"POST",
    "body":JSON.stringify(data)
  },opts);
}

function xt_net_addon_supabase$$cmd_admin_create_user(data,opts){
  return Object.assign({
    "path":"/auth/v1/admin/users",
    "method":"POST",
    "body":JSON.stringify(data)
  },opts);
}

function xt_net_addon_supabase$$cmd_admin_delete_user(user_id,opts){
  return Object.assign(
    {"path":"/auth/v1/admin/users/" + user_id,"method":"DELETE"},
    opts
  );
}

function xt_net_addon_supabase$$cmd_admin_generate_link(data,opts){
  return Object.assign({
    "path":"/auth/v1/admin/generate_link",
    "method":"POST",
    "body":JSON.stringify(data)
  },opts);
}

function xt_net_addon_supabase$$cmd_admin_get_user(user_id,opts){
  return Object.assign(
    {"path":"/auth/v1/admin/users/" + user_id,"method":"GET"},
    opts
  );
}

function xt_net_addon_supabase$$cmd_admin_list_users(opts){
  return Object.assign({"path":"/auth/v1/admin/users","method":"GET"},opts);
}

function xt_net_addon_supabase$$cmd_admin_update_user(user_id,opts){
  return Object.assign(
    {"path":"/auth/v1/admin/users/" + user_id,"method":"PUT"},
    opts
  );
}

function xt_net_addon_supabase$$cmd_authorize(data,opts){
  return Object.assign({
    "path":"/auth/v1/authorize?" + xt_net_http_util$$encode_query_params(data),
    "method":"GET"
  },opts);
}

function xt_net_addon_supabase$$cmd_callback(opts){
  return Object.assign({"path":"/auth/v1/callback","method":"GET"},opts);
}

function xt_net_addon_supabase$$cmd_invite(data,opts){
  return Object.assign({
    "path":"/auth/v1/invite",
    "method":"POST",
    "body":JSON.stringify(data)
  },opts);
}

function xt_net_addon_supabase$$cmd_logout(opts){
  return Object.assign({"path":"/auth/v1/logout","method":"POST"},opts);
}

function xt_net_addon_supabase$$cmd_otp(data,opts){
  return Object.assign({
    "path":"/auth/v1/otp",
    "method":"POST",
    "body":JSON.stringify(data)
  },opts);
}

function xt_net_addon_supabase$$cmd_recovery(data,opts){
  return Object.assign({
    "path":"/auth/v1/recover",
    "method":"POST",
    "body":JSON.stringify(data)
  },opts);
}

function xt_net_addon_supabase$$cmd_settings(opts){
  return Object.assign({"path":"/auth/v1/settings","method":"GET"},opts);
}

function xt_net_addon_supabase$$cmd_token_password(data,opts){
  return Object.assign({
    "path":"/auth/v1/token?grant_type=password",
    "method":"POST",
    "body":JSON.stringify(data)
  },opts);
}

function xt_net_addon_supabase$$cmd_token_refresh(data,opts){
  return Object.assign({
    "path":"/auth/v1/token?grant_type=refresh_token",
    "method":"POST",
    "body":JSON.stringify(data)
  },opts);
}

function xt_net_addon_supabase$$cmd_user_get(opts){
  return Object.assign({"path":"/auth/v1/user","method":"GET"},opts);
}

function xt_net_addon_supabase$$cmd_user_put(data,opts){
  return Object.assign({
    "path":"/auth/v1/user",
    "method":"PUT",
    "body":JSON.stringify(data)
  },opts);
}

function xt_net_addon_supabase$$cmd_verify_get(data,opts){
  return Object.assign({
    "path":"/auth/v1/verify?" + xt_net_http_util$$encode_query_params(data),
    "method":"GET"
  },opts);
}

function xt_net_addon_supabase$$cmd_verify_post(data,opts){
  return Object.assign({
    "path":"/auth/v1/verify",
    "method":"POST",
    "body":JSON.stringify(data)
  },opts);
}

function xt_db_system_impl_supabase_session$$get_session(impl){
  return xt_lang_common_data$$get_in(impl,["state","session"]);
}

function xt_db_system_impl_supabase_session$$set_session(impl,session){
  xt_lang_common_data$$set_in(impl,["state","session"],session);
  xt_lang_common_data$$set_in(
    impl,
    ["client","defaults","token"],
    xt_lang_common_data$$get_in(session,["access_token"])
  );
  return session;
}

function xt_db_system_impl_supabase_session$$refresh_session(impl){
  let {client} = impl;
  let session = xt_lang_common_data$$get_in(impl,["state","session"]);
  let refresh_token = xt_lang_common_data$$get_in(session,"refresh_token");
  if(null == refresh_token){
    return Promise.resolve().then(function (){
      return null;
    });
  }
  else{
    return xt_net_http_fetch$$request_http(
      client,
      xt_net_addon_supabase$$cmd_token_refresh({"refresh_token":refresh_token},{})
    ).then(function (response){
      return xt_db_system_impl_supabase_session$$set_session(impl,xt_net_http_util$$get_body_data(response));
    }).catch(function (err){
      return err;
    });
  }
}

function xt_db_system_impl_supabase_session$$auto_refresh_interval(impl){
  let configured = xt_lang_common_data$$get_in(impl,["opts","auto_refresh_interval"]);
  let expires_in = xt_lang_common_data$$get_in(impl,["state","session","expires_in"]);
  if(null != configured){
    return configured;
  }
  else if(null != expires_in){
    return ((expires_in * 1000) >= 60000) ? ((expires_in * 1000) - 60000) : 1000;
  }
  else{
    return 300000;
  }
}

function xt_db_system_impl_supabase_session$$auto_refresh_fn(impl,delay,refresh_id){
  let current_id = xt_lang_common_data$$get_in(impl,["state","auto_refresh","current"]);
  if(current_id == refresh_id){
    xt_db_system_impl_supabase_session$$refresh_session(impl).catch(function (err){
      return err;
    }).then(function (_){
      return new Promise(function (resolve,reject){
        setTimeout(function (){
          new Promise(function (inner_resolve){
            inner_resolve((function (){
              return xt_db_system_impl_supabase_session$$auto_refresh_fn(
                impl,
                xt_db_system_impl_supabase_session$$auto_refresh_interval(impl),
                refresh_id
              );
            })());
          }).then(function (value){
            resolve(value);
          }).catch(function (err){
            reject(err);
          });
        },delay);
      });
    });
    return refresh_id;
  }
  else{
    return current_id;
  }
}

function xt_db_system_impl_supabase_session$$auto_refresh_stop(impl){
  let current_id = xt_lang_common_data$$get_in(impl,["state","auto_refresh","current"]);
  xt_lang_common_data$$set_in(impl,["state","auto_refresh","current"],null);
  return current_id;
}

function xt_db_system_impl_supabase_session$$auto_refresh_start(impl){
  let current_id = xt_lang_common_data$$get_in(impl,["state","auto_refresh","current"]);
  if(null != current_id){
    return current_id;
  }
  let refresh_id = xt_lang_common_string$$str_rand(8);
  xt_lang_common_data$$set_in(impl,["state","auto_refresh","current"],refresh_id);
  return xt_db_system_impl_supabase_session$$auto_refresh_fn(
    impl,
    xt_db_system_impl_supabase_session$$auto_refresh_interval(impl),
    refresh_id
  );
}

var xt_net_ws_native$$IWebsocket = xt_lang_common_protocol$$create_protocol_fn("xt.net.ws_native/IWebsocket",{
  "connect":{"name":"connect","arglist":["client","opts"]},
  "disconnect":{"name":"disconnect","arglist":["client"]},
  "send":{"name":"send","arglist":["client","input"]},
  "add_listeners":{"name":"add_listeners","arglist":["client","m"]}
});

function xt_net_ws_native$$connect(client,opts){
  let method_fn = xt_lang_common_protocol$$protocol_method(client,"xt.net.ws_native/IWebsocket","connect");
  return method_fn(client,opts);
}

function xt_net_ws_native$$send(client,input){
  let method_fn = xt_lang_common_protocol$$protocol_method(client,"xt.net.ws_native/IWebsocket","send");
  return method_fn(client,input);
}

function xt_net_ws_native$$add_listeners(client,m){
  let method_fn = xt_lang_common_protocol$$protocol_method(client,"xt.net.ws_native/IWebsocket","add_listeners");
  return method_fn(client,m);
}

var xt_net_ws_native$$IWebsocketHeartbeat = xt_lang_common_protocol$$create_protocol_fn("xt.net.ws_native/IWebsocketHeartbeat",{
  "start_heartbeat":{
    "name":"start_heartbeat",
    "arglist":["client","name","f","interval"]
  },
  "stop_heartbeat":{"name":"stop_heartbeat","arglist":["client","name"]}
});

function xt_net_ws_native$$start_heartbeat(client,name,f,interval){
  let method_fn = xt_lang_common_protocol$$protocol_method(
    client,
    "xt.net.ws_native/IWebsocketHeartbeat",
    "start_heartbeat"
  );
  return method_fn(client,name,f,interval);
}

function xt_net_ws_native$$prepare_url(client,input){
  let {path,url} = input;
  if(!(null == url)){
    return url;
  }
  let {defaults} = client;
  let {basepath,host,port,secured} = defaults;
  return "ws" + (secured ? "s" : "") + "://" + host + ":" + String(port || 80) + (basepath || "") + (path || "");
}

function xt_net_ws_phoenix$$extract_message_data(message){
  if("string" == (typeof message)){
    return message;
  }
  else if(null != message["data"]){
    return message["data"];
  }
  else if(null != message["body"]){
    return message["body"];
  }
  else{
    return message;
  }
}

function xt_net_ws_phoenix$$decode_frame(message){
  let data = xt_net_ws_phoenix$$extract_message_data(message);
  if(!("string" == (typeof data))){
    return data;
  }
  return JSON.parse(data);
}

function xt_net_ws_phoenix$$get_frame_ref(opts){
  return String(opts["ref"] || opts["join_ref"] || Date.now());
}

function xt_net_ws_phoenix$$make_frame(topic,event,payload,opts){
  let ref = xt_net_ws_phoenix$$get_frame_ref(opts);
  let join_ref = opts["join_ref"] || ref;
  return {
    "topic":topic,
    "event":event,
    "payload":payload || {},
    "ref":ref,
    "join_ref":join_ref
  };
}

function xt_net_ws_phoenix$$make_frame_join(payload,opts){
  let {topic} = opts;
  if(null == topic){
    throw "Phoenix channel missing topic";
  }
  return xt_net_ws_phoenix$$make_frame(topic,"phx_join",payload || {},opts || {});
}

function xt_net_ws_phoenix$$make_frame_leave(opts){
  let {topic} = opts;
  if(null == topic){
    throw "Phoenix channel missing topic";
  }
  return xt_net_ws_phoenix$$make_frame(topic,"phx_leave",{},opts || {});
}

function xt_net_ws_phoenix$$make_frame_heartbeat(opts){
  let ref = xt_net_ws_phoenix$$get_frame_ref(opts || {});
  return {
    "topic":"phoenix",
    "event":"heartbeat",
    "payload":{},
    "ref":ref,
    "join_ref":ref
  };
}

function xt_net_ws_phoenix$$encode_frame(frame){
  return {
    "join_ref":frame["join_ref"] || frame["ref"],
    "ref":frame["ref"],
    "topic":frame["topic"],
    "event":frame["event"],
    "payload":frame["payload"] || {}
  };
}

function xt_net_ws_phoenix$$send_frame(client,frame){
  return xt_net_ws_native$$send(
    client,
    JSON.stringify(xt_net_ws_phoenix$$encode_frame(frame))
  );
}

function xt_net_ws_phoenix$$wrap_phoenix(handlers){
  return function (event){
    let frame = xt_net_ws_phoenix$$decode_frame(event);
    let handler = handlers[frame["event"]];
    if("function" == (typeof handler)){
      handler(frame);
    }
  };
}

function xt_net_ws_phoenix$$start_heartbeat(client){
  return xt_net_ws_native$$start_heartbeat(client,"phoenix.default",function (client,name){
    xt_net_ws_phoenix$$send_frame(client,xt_net_ws_phoenix$$make_frame_heartbeat({}));
  },30000);
}

var xt_net_conn_sql$$ISqlClient = xt_lang_common_protocol$$create_protocol_fn("xt.net.conn_sql/ISqlClient",{
  "connect":{"name":"connect","arglist":["client","opts"]},
  "disconnect":{"name":"disconnect","arglist":["client"]},
  "query":{"name":"query","arglist":["client","input"]},
  "query_async":{"name":"query_async","arglist":["client","input"]}
});

function xt_net_conn_sql$$connect(client,opts){
  let method_fn = xt_lang_common_protocol$$protocol_method(client,"xt.net.conn_sql/ISqlClient","connect");
  return method_fn(client,opts);
}

function xt_net_conn_sql$$disconnect(client){
  let method_fn = xt_lang_common_protocol$$protocol_method(client,"xt.net.conn_sql/ISqlClient","disconnect");
  return method_fn(client);
}

function xt_net_conn_sql$$query(client,input){
  let method_fn = xt_lang_common_protocol$$protocol_method(client,"xt.net.conn_sql/ISqlClient","query");
  return method_fn(client,input);
}

function xt_net_conn_sql$$query_async(client,input){
  let method_fn = xt_lang_common_protocol$$protocol_method(client,"xt.net.conn_sql/ISqlClient","query_async");
  return method_fn(client,input);
}

var xt_db_text_sql_util$$OPERATORS = {
  "neq":"!=",
  "gt":">",
  "gte":">=",
  "lt":"<",
  "lte":"<=",
  "eq":"=",
  "is_not_null":"IS NOT NULL",
  "is_null":"IS NULL"
};

var xt_db_text_sql_util$$INFIX = {"||":true,"+":true,"-":true,"*":true,"/":true};

var xt_db_text_sql_util$$PG = {
  "map":"jsonb",
  "long":"bigint",
  "enum":"text",
  "image":"jsonb",
  "array":"jsonb"
};

var xt_db_text_sql_util$$SQLITE = {
  "enum":"text",
  "long":"integer",
  "citext":"text",
  "jsonb":"text",
  "inet":"text",
  "array":"text",
  "image":"text",
  "uuid":"text",
  "map":"text"
};

function xt_db_text_sql_util$$sqlite_json_values(v){
  return "(SELECT value from json_each(" + v + "))";
}

function xt_db_text_sql_util$$sqlite_json_keys(v){
  return "(SELECT key from json_each(" + v + "))";
}

var xt_db_text_sql_util$$SQLITE_FN = {
  "jsonb_build_object":{"type":"alias","name":"json_object"},
  "jsonb_build_array":{"type":"alias","name":"json_array"},
  "jsonb_array_elements_text":{"type":"macro","fn":xt_db_text_sql_util$$sqlite_json_values},
  "jsonb_array_elements":{"type":"macro","fn":xt_db_text_sql_util$$sqlite_json_values},
  "jsonb_object_keys":{"type":"macro","fn":xt_db_text_sql_util$$sqlite_json_keys},
  "\"core/util\".as_array":{
    "type":"macro",
    "fn":function (x){
      return x;
    }
  }
};

function xt_db_text_sql_util$$encode_bool(b){
  if(b == true){
    return "TRUE";
  }
  else if(b == false){
    return "FALSE";
  }
  else{
    throw "Not Valid";
  }
}

function xt_db_text_sql_util$$encode_number(v){
  return "'" + (Number.isInteger(v) ? v.toFixed(0) : String(v)) + "'";
}

function xt_db_text_sql_util$$encode_operator(op,opts){
  if(null != xt_db_text_sql_util$$OPERATORS[op]){
    return xt_db_text_sql_util$$OPERATORS[op];
  }
  else if(((null != opts) && ("object" == (typeof opts)) && !Array.isArray(opts)) && ((null != opts["operators"]) && ("object" == (typeof opts["operators"])) && !Array.isArray(opts["operators"])) && (null != opts["operators"][op])){
    return xt_lang_common_data$$get_in(opts,["operators",op]);
  }
  else{
    return op;
  }
}

function xt_db_text_sql_util$$encode_json(v){
  return "'" + JSON.stringify(v).replace(new RegExp("'","g"),"''") + "'";
}

function xt_db_text_sql_util$$encode_value(v){
  if(null == v){
    return "NULL";
  }
  else if("string" == (typeof v)){
    return "'" + v.replace(new RegExp("'","g"),"''") + "'";
  }
  else if("boolean" == (typeof v)){
    return xt_db_text_sql_util$$encode_bool(v);
  }
  else if(Array.isArray(v) || ((null != v) && ("object" == (typeof v)) && !Array.isArray(v))){
    return xt_db_text_sql_util$$encode_json(v);
  }
  else if("number" == (typeof v)){
    return xt_db_text_sql_util$$encode_number(v);
  }
  else{
    return "'" + String(v) + "'";
  }
}

function xt_db_text_sql_util$$encode_sql_arg(v,column_fn,opts,loop_fn){
  let {name} = v;
  return xt_db_text_sql_util$$encode_value(name);
}

function xt_db_text_sql_util$$encode_sql_column(v,column_fn,opts,loop_fn){
  let {name} = v;
  return column_fn(name);
}

function xt_db_text_sql_util$$encode_sql_tuple(v,column_fn,opts,loop_fn){
  let {args} = v;
  let arg_fn = function (arg){
    return loop_fn(arg,column_fn,opts,loop_fn);
  };
  let arg_arr = Array.isArray(args) ? args : [];
  let fargs = arg_arr.map(arg_fn);
  return fargs.join(", ");
}

function xt_db_text_sql_util$$encode_sql_table(v,column_fn,opts,loop_fn){
  let {name,schema} = v;
  if(opts["strict"]){
    return column_fn(schema) + "." + column_fn(name);
  }
  else{
    return column_fn(name);
  }
}

function xt_db_text_sql_util$$encode_sql_cast(v,column_fn,opts,loop_fn){
  let [out,cast] = v["args"];
  if(opts["strict"]){
    return loop_fn(out,column_fn,opts,loop_fn) + "::" + xt_db_text_sql_util$$encode_sql_table(cast,column_fn,opts,loop_fn);
  }
  else{
    return loop_fn(out,column_fn,opts,loop_fn);
  }
}

function xt_db_text_sql_util$$encode_sql_keyword(v,column_fn,opts,loop_fn){
  let {args,name} = v;
  let arg_fn = function (arg){
    return loop_fn(arg,column_fn,opts,loop_fn);
  };
  let arg_arr = Array.isArray(args) ? args : [];
  let fargs = arg_arr.map(arg_fn);
  if(xt_lang_common_data$$arr_emptyp(fargs)){
    return String(name);
  }
  else{
    return name + " " + fargs.join(" ");
  }
}

function xt_db_text_sql_util$$encode_sql_fn(v,column_fn,opts,loop_fn){
  let {args,name} = v;
  let arg_fn = function (arg){
    return loop_fn(arg,column_fn,opts,loop_fn);
  };
  let fargs = args.map(arg_fn);
  if(null != xt_db_text_sql_util$$INFIX[name]){
    return "(" + fargs.join(" " + name + " ") + ")";
  }
  else{
    let lu = opts["values"]["replace"];
    let fspec = lu[name];
    if(null == fspec){
      return name + "(" + fargs.join(", ") + ")";
    }
    else if("alias" == fspec["type"]){
      return fspec["name"] + "(" + fargs.join(", ") + ")";
    }
    else if("macro" == fspec["type"]){
      return fspec["fn"].apply(null,fargs);
    }
    else{
      throw "Invalid Spec Type - " + fspec["type"];
    }
  }
}

function xt_db_text_sql_util$$encode_sql_select(v,column_fn,opts,loop_fn){
  let {args} = v;
  let {querystr_fn} = opts;
  let arg_fn = function (arg){
    if(((null != arg) && ("object" == (typeof arg)) && !Array.isArray(arg)) && !(null != arg["::"])){
      return querystr_fn(arg,"",opts);
    }
    else{
      return loop_fn(arg,column_fn,opts,loop_fn);
    }
  };
  let fargs = args.map(arg_fn);
  return "(SELECT " + fargs.join(" ") + ")";
}

var xt_db_text_sql_util$$ENCODE_SQL = {
  "sql/arg":xt_db_text_sql_util$$encode_sql_arg,
  "sql/keyword":xt_db_text_sql_util$$encode_sql_keyword,
  "sql/defenum":xt_db_text_sql_util$$encode_sql_table,
  "sql/deftype":xt_db_text_sql_util$$encode_sql_table,
  "sql/fn":xt_db_text_sql_util$$encode_sql_fn,
  "sql/column":xt_db_text_sql_util$$encode_sql_column,
  "sql/cast":xt_db_text_sql_util$$encode_sql_cast,
  "sql/tuple":xt_db_text_sql_util$$encode_sql_tuple,
  "sql/select":xt_db_text_sql_util$$encode_sql_select
};

function xt_db_text_sql_util$$encode_sql(v,column_fn,opts,loop_fn){
  let tcls = v["::"];
  let arg_fn = function (arg){
    return loop_fn(arg,column_fn,opts,loop_fn);
  };
  let f = xt_db_text_sql_util$$ENCODE_SQL[tcls];
  if(null == f){
    throw "Unsupported Type - " + tcls;
  }
  return f(v,column_fn,opts,loop_fn);
}

function xt_db_text_sql_util$$encode_loop_fn(v,column_fn,opts,loop_fn){
  if(((null != v) && ("object" == (typeof v)) && !Array.isArray(v)) && (null != v["::"])){
    return xt_db_text_sql_util$$encode_sql(v,column_fn,opts,loop_fn);
  }
  else if("string" == (typeof v)){
    return v;
  }
  else{
    return xt_db_text_sql_util$$encode_value(v);
  }
}

function xt_db_text_sql_util$$encode_query_value(v,column_fn,opts){
  if(((null != v) && ("object" == (typeof v)) && !Array.isArray(v)) && (null != v["::"])){
    return xt_db_text_sql_util$$encode_loop_fn(v,column_fn,opts,xt_db_text_sql_util$$encode_loop_fn);
  }
  else if(Array.isArray(v)){
    if((1 == v.length) && Array.isArray(v[0]) && v[0].every(function (value){
      return "string" == (typeof value);
    })){
      return "(" + v[0].map(xt_db_text_sql_util$$encode_value).join(", ") + ")";
    }
    else if((1 == v.length) && ("string" == (typeof v[0]))){
      return v[0];
    }
    else{
      let map_fn = function (item){
        return xt_db_text_sql_util$$encode_query_value(item,column_fn,opts);
      };
      return v.map(map_fn).join(" ");
    }
  }
  else if((v == "and") || (v == "or")){
    return v;
  }
  else{
    return xt_db_text_sql_util$$encode_value(v);
  }
}

function xt_db_text_sql_util$$encode_query_segment(key,v,column_fn,opts){
  let col = column_fn(key);
  if(Array.isArray(v)){
    let map_fn = function (item){
      return xt_db_text_sql_util$$encode_query_value(item,column_fn,opts);
    };
    let tail_values = v.slice(1,v.length);
    let encoded = tail_values.map(map_fn);
    return col + " " + xt_db_text_sql_util$$encode_operator(v[0],opts) + " " + encoded.join(" ");
  }
  else{
    return col + " = " + xt_db_text_sql_util$$encode_query_value(v,column_fn,opts);
  }
}

function xt_db_text_sql_util$$encode_query_single_string(params,opts){
  let column_fn = (null == opts["column_fn"]) ? (function (x){
    return x;
  }) : opts["column_fn"];
  let sort_keys = (null == opts["sort_keys"]) ? true : opts["sort_keys"];
  let out = "";
  let query_pairs = Object.entries(params);
  if(sort_keys){
    query_pairs = xt_lang_common_data$$arr_sort(query_pairs,function (arr){
      return arr[0];
    },function (x,y){
      return 0 > x.localeCompare(y);
    });
  }
  for(let e of query_pairs){
    let [key,v] = e;
    if(0 < out.length){
      out = (out + " AND ");
    }
    out = (out + xt_db_text_sql_util$$encode_query_segment(key,v,column_fn,opts));
  };
  return out;
}

function xt_db_text_sql_util$$encode_query_string(params,prefix,opts){
  let out = xt_lang_common_data$$arrayify(params).map(function (p){
    return xt_db_text_sql_util$$encode_query_single_string(p,opts);
  }).filter(function (e){
    return (null != e) && (0 < e.length);
  });
  let joined = out.map(function (s){
    return "(" + s + ")";
  }).join(" OR ");
  if(0 == out.length){
    return "";
  }
  else if(1 == out.length){
    return xt_lang_common_data$$not_emptyp(prefix) ? (prefix + " " + out[0]) : out[0];
  }
  else{
    return xt_lang_common_data$$not_emptyp(prefix) ? (prefix + " " + joined) : joined;
  }
}

function xt_db_text_sql_util$$LIMIT(val){
  return {
    "::":"sql/keyword",
    "name":"LIMIT",
    "args":[{"::":"sql/keyword","name":val}]
  };
}

function xt_db_text_sql_util$$OFFSET(val){
  return {
    "::":"sql/keyword",
    "name":"OFFSET",
    "args":[{"::":"sql/keyword","name":val}]
  };
}

function xt_db_text_sql_util$$ORDER_BY(columns){
  return {
    "::":"sql/keyword",
    "name":"ORDER BY",
    "args":[
        {
          "::":"sql/tuple",
          "args":columns.map(function (column){
              return {"::":"sql/column","name":column};
            })
        }
      ]
  };
}

function xt_db_text_sql_util$$ORDER_SORT(order){
  return {
    "::":"sql/keyword",
    "name":xt_lang_common_string$$to_uppercase(order)
  };
}

function xt_db_text_sql_util$$default_quote_fn(s){
  return "\"" + s + "\"";
}

function xt_db_text_sql_util$$default_return_format_fn(input,nest_fn,column_fn,opts){
  if((null != input) && ("object" == (typeof input)) && !Array.isArray(input)){
    if(null != input["::"]){
      return xt_db_text_sql_util$$encode_sql(input,column_fn,opts,xt_db_text_sql_util$$encode_loop_fn);
    }
    else{
      return input["expr"] + ((null != input["as"]) ? (" AS " + input["as"]) : "");
    }
  }
  else if(Array.isArray(input)){
    return nest_fn(input);
  }
  else if("string" == (typeof input)){
    return column_fn(input);
  }
  else{
    throw "Invalid input - " + String(input);
  }
}

function xt_db_text_sql_util$$default_table_fn(table,lookup){
  return "\"" + lookup[table]["schema"] + "\".\"" + table + "\"";
}

function xt_db_text_sql_util$$postgres_wrapper_fn(s,indent){
  return "WITH j_ret AS (\n" + xt_lang_common_string$$pad_lines(s,2," ") + "\n) SELECT jsonb_agg(j_ret) FROM j_ret";
}

function xt_db_text_sql_util$$postgres_opts(lookup){
  return {
    "return_join_fn":function (arr){
        return arr.join(", ");
      },
    "strict":true,
    "wrapper_fn":xt_db_text_sql_util$$postgres_wrapper_fn,
    "querystr_fn":xt_db_text_sql_util$$encode_query_string,
    "types":xt_db_text_sql_util$$PG,
    "values":{"cast":true,"replace":{}},
    "return_link_fn":function (s,link_name){
        return "(" + s + ") AS " + link_name;
      },
    "return_format_fn":xt_db_text_sql_util$$default_return_format_fn,
    "coerce":{},
    "return_count_fn":function (){
        return "count" + "(*)";
      },
    "column_fn":xt_db_text_sql_util$$default_quote_fn,
    "table_fn":function (table){
        return xt_db_text_sql_util$$default_table_fn(table,lookup);
      }
  };
}

function xt_lang_common_tree$$tree_walk(x,pre_fn,post_fn){
  x = pre_fn(x);
  if(null == x){
    return post_fn(x);
  }
  else if((null != x) && ("object" == (typeof x)) && !Array.isArray(x)){
    let out = {};
    for(let [k,v] of Object.entries(x)){
      out[k] = xt_lang_common_tree$$tree_walk(v,pre_fn,post_fn);
    };
    return post_fn(out);
  }
  else if(Array.isArray(x)){
    let out = [];
    for(let e of x){
      out.push(xt_lang_common_tree$$tree_walk(e,pre_fn,post_fn));
    };
    return post_fn(out);
  }
  else{
    return post_fn(x);
  }
}

var xt_db_text_base_scope$$Scopes = {
  "*/min":{"-/id":true,"-/key":true},
  "*/info":{"-/info":true,"-/id":true,"-/key":true},
  "*/data":{"-/info":true,"-/id":true,"-/data":true,"-/key":true},
  "*/default":{
    "-/info":true,
    "-/id":true,
    "-/ref":true,
    "-/data":true,
    "-/key":true
  },
  "*/detail":{
    "-/detail":true,
    "-/info":true,
    "-/id":true,
    "-/data":true,
    "-/key":true
  },
  "*/standard":{
    "-/detail":true,
    "-/info":true,
    "-/id":true,
    "-/ref":true,
    "-/data":true,
    "-/key":true
  },
  "*/all":{
    "-/detail":true,
    "-/info":true,
    "-/id":true,
    "-/ref":true,
    "-/data":true,
    "-/system":true,
    "-/key":true
  },
  "*/everything":{
    "-/detail":true,
    "-/info":true,
    "-/hidden":true,
    "-/id":true,
    "-/ref":true,
    "-/data":true,
    "-/system":true,
    "-/key":true
  }
};

function xt_db_text_base_scope$$merge_queries(q_0,q_1){
  let arr_0 = xt_lang_common_data$$arrayify(q_0).filter(xt_lang_common_data$$not_emptyp);
  let arr_1 = xt_lang_common_data$$arrayify(q_1).filter(xt_lang_common_data$$not_emptyp);
  if(xt_lang_common_data$$arr_emptyp(arr_0)){
    return arr_1;
  }
  if(xt_lang_common_data$$arr_emptyp(arr_1)){
    return arr_0;
  }
  let out = [];
  for(let e_0 of arr_0){
    for(let e_1 of arr_1){
      out.push(xt_lang_common_data$$obj_assign_nested(xt_lang_common_tree$$tree_walk(e_0,function (x){
        return x;
      },function (x){
        return x;
      }),xt_lang_common_tree$$tree_walk(e_1,function (x){
        return x;
      },function (x){
        return x;
      })));
    };
  };
  return out;
}

function xt_db_text_base_scope$$filter_scope(ks){
  let mscopes = ks.filter(function (s){
    return "-" == xt_lang_common_string$$sym_ns(s);
  });
  let ascopes = ks.filter(function (s){
    return "*" == xt_lang_common_string$$sym_ns(s);
  });
  return ascopes.map(function (s){
    return xt_db_text_base_scope$$Scopes[s];
  }).reduce(function (obj,other){
    return Object.assign(obj,other);
  },xt_lang_common_data$$arr_lookup(mscopes));
}

function xt_db_text_base_scope$$filter_plain_key(s){
  if(null == xt_lang_common_string$$sym_ns(s)){
    return ((s.length >= 3) && s.endsWith("_id")) ? s.substring(0,s.length - 3) : s;
  }
}

function xt_db_text_base_scope$$filter_plain(ks){
  return xt_lang_common_data$$arr_lookup(
    xt_lang_common_data$$arr_keep(ks,xt_db_text_base_scope$$filter_plain_key)
  );
}

function xt_db_text_base_scope$$get_data_columns(schema,table_key,ks){
  let str_ks = ks.filter(function (value){
    return "string" == (typeof value);
  });
  let scopes = xt_db_text_base_scope$$filter_scope(str_ks);
  let plains = xt_db_text_base_scope$$filter_plain(str_ks);
  let cols = schema[table_key];
  if(null == cols){
    throw "ERR - Table not in Schema - " + table_key;
  }
  let scoped = Object.values(cols).filter(function (e){
    return ((null != e["scope"]) && (true == scopes["-/" + e["scope"]])) || (null != plains[e["ident"]]);
  });
  return xt_lang_common_data$$arr_sort(scoped,function (e){
    return e["order"];
  },function (a,b){
    return a < b;
  });
}

function xt_db_text_base_scope$$get_link_standard(link){
  let ltag = link[0];
  let llen = link.length;
  if(1 == llen){
    return [ltag,[{},["*/data"]]];
  }
  let lmap = link.filter(function (value){
    return (null != value) && ("object" == (typeof value)) && !Array.isArray(value);
  });
  let larr = link.filter(function (value){
    return Array.isArray(value);
  });
  if(0 == larr.length){
    larr = [["*/data"]];
  }
  if(0 == lmap.length){
    lmap = [{}];
  }
  let lout = [];
  xt_lang_common_data$$arr_assign(lout,lmap);
  xt_lang_common_data$$arr_assign(lout,larr);
  return [ltag,lout];
}

function xt_db_text_base_scope$$get_link_columns(schema,table_key,ks){
  let link_arr = ks.filter(function (value){
    return Array.isArray(value);
  });
  let linked = xt_lang_common_data$$obj_from_pairs(link_arr.map(xt_db_text_base_scope$$get_link_standard));
  let cols = schema[table_key];
  return xt_lang_common_data$$arr_keepf(Object.values(cols),function (col){
    return null != linked[col["ident"]];
  },function (col){
    return [col,linked[col["ident"]]];
  });
}

function xt_db_text_base_scope$$as_where_input(input){
  if(xt_lang_common_data$$is_emptyp(input)){
    return [];
  }
  else if(Array.isArray(input)){
    return input;
  }
  else{
    return [input];
  }
}

function xt_db_text_base_scope$$get_tree(schema,table_name,where,returning,opts){
  let table_fn = (null == opts["table_fn"]) ? (function (x){
    return x;
  }) : opts["table_fn"];
  let column_fn = (null == opts["column_fn"]) ? (function (x){
    return x;
  }) : opts["column_fn"];
  where = xt_db_text_base_scope$$as_where_input(where);
  returning = (Array.isArray(returning) ? returning : ["*/data"]);
  let where_pred = function (e){
    return ((null != e) && ("object" == (typeof e)) && !Array.isArray(e)) && (null == e["::"]);
  };
  let custom_pred = function (e){
    return ((null != e) && ("object" == (typeof e)) && !Array.isArray(e)) && ("string" == (typeof e["::"]));
  };
  let custom = returning.filter(custom_pred);
  let data = xt_db_text_base_scope$$get_data_columns(schema,table_name,returning);
  let links = xt_db_text_base_scope$$get_link_columns(schema,table_name,returning);
  let get_child_tree = function (link){
    let attr = link[0];
    let link_query = xt_lang_common_data$$second(link);
    let link_where_query = link_query.filter(where_pred);
    let link_returning = link_query[link_query.length + -1];
    let link_where_returning = link_returning.filter(where_pred);
    let link_where = xt_db_text_base_scope$$merge_queries(link_where_query,link_where_returning);
    let link_table = attr["ref"]["ns"];
    let link_type = attr["ref"]["type"];
    let link_extra = {};
    if("reverse" == link_type){
      link_extra[attr["ref"]["rkey"]] = ["eq",[table_fn(table_name) + "." + column_fn("id")]];
    }
    else{
      link_extra["id"] = [
        "eq",
        [
              table_fn(table_name) + "." + column_fn(attr["ref"]["key"] + "_id")
            ]
      ];
    }
    return [
      attr["ident"],
      link_type,
      xt_db_text_base_scope$$get_tree(
          schema,
          link_table,
          xt_db_text_base_scope$$merge_queries(link_where,link_extra),
          link_returning,
          opts
        )
    ];
  };
  return [
    table_name,
    {
      "where":where,
      "data":data.map(function (e){
          return ("ref" == e["type"]) ? (e["ident"] + "_id") : e["ident"];
        }),
      "links":links.map(get_child_tree),
      "custom":custom
    }
  ];
}

function xt_db_text_base_graph$$tree_paramsp(params){
  return ((null != params) && ("object" == (typeof params)) && !Array.isArray(params)) && !Array.isArray(params) && ((null != params["where"]) || (null != params["data"]) || (null != params["links"]) || (null != params["custom"]));
}

function xt_db_text_base_graph$$treep(query){
  return Array.isArray(query) && (query.length >= 2) && xt_db_text_base_graph$$tree_paramsp(xt_lang_common_data$$second(query));
}

function xt_db_text_base_graph$$normalise_tree_params(params){
  let out = Object.assign({},params || {});
  if(null == out["where"]){
    out["where"] = [];
  }
  if(null == out["data"]){
    out["data"] = [];
  }
  if(null == out["links"]){
    out["links"] = [];
  }
  if(null == out["custom"]){
    out["custom"] = [];
  }
  return out;
}

function xt_db_text_base_graph$$normalise_tree(query){
  if(!xt_db_text_base_graph$$treep(query)){
    return query;
  }
  else{
    return [
      query[0],
      xt_db_text_base_graph$$normalise_tree_params(xt_lang_common_data$$second(query))
    ];
  }
}

function xt_db_text_base_graph$$select_tree(schema,query,opts){
  opts = (opts || {});
  if(xt_db_text_base_graph$$treep(query)){
    return xt_db_text_base_graph$$normalise_tree(query);
  }
  else{
    let input = xt_db_text_base_scope$$get_link_standard(query);
    let table_name = input[0];
    let linked = xt_lang_common_data$$second(input);
    let return_params = linked[linked.length + -1];
    let where_params = linked.filter(function (x){
      return ((null != x) && ("object" == (typeof x)) && !Array.isArray(x)) && xt_lang_common_data$$not_emptyp(x);
    });
    return xt_db_text_base_scope$$get_tree(schema,table_name,where_params,return_params,opts);
  }
}

function xt_db_text_sql_graph$$select_where_pair(schema,table_name,key,clause,indent,opts,where_fn){
  let column_fn = (null == opts["column_fn"]) ? (function (x){
    return x;
  }) : opts["column_fn"];
  let attr = schema[table_name][key];
  if(null == attr){
    throw "Attribute not found - " + table_name + " - " + key;
  }
  let arr_fn = function (clause_fn,clause_arr){
    return "(" + clause_arr.map(function (clause_obj){
      return "(" + clause_fn(clause_obj) + ")";
    }).join(" OR ") + ")";
  };
  let forward_fn = function (clause_obj){
    return key + "_id" + " IN (\n" + "".padStart(indent," ") + where_fn(schema,attr["ref"]["ns"],column_fn("id"),clause_obj,indent,opts) + "\n" + "".padStart(indent - 2," ") + ")";
  };
  let reverse_fn = function (clause_obj){
    return "id IN (\n" + "".padStart(indent," ") + where_fn(
      schema,
      attr["ref"]["ns"],
      column_fn(attr["ref"]["rkey"] + "_id"),
      clause_obj,
      indent,
      opts
    ) + "\n" + "".padStart(indent - 2," ") + ")";
  };
  if("ref" == attr["type"]){
    if("forward" == attr["ref"]["type"]){
      if((null != clause) && ("object" == (typeof clause)) && !Array.isArray(clause)){
        return forward_fn(clause);
      }
      else if(Array.isArray(clause) && ((null != clause[0]) && ("object" == (typeof clause[0])) && !Array.isArray(clause[0]))){
        return arr_fn(forward_fn,clause);
      }
      else{
        return xt_db_text_sql_util$$encode_query_segment(key + "_id",clause,column_fn,opts);
      }
    }
    else if("reverse" == attr["ref"]["type"]){
      if("string" == (typeof clause)){
        clause = {"id":clause};
      }
      else if(Array.isArray(clause) && ("string" == (typeof clause[0]))){
        clause = {"id":clause};
      }
      if((null != clause) && ("object" == (typeof clause)) && !Array.isArray(clause)){
        return reverse_fn(clause);
      }
      else if(Array.isArray(clause) && ((null != clause[0]) && ("object" == (typeof clause[0])) && !Array.isArray(clause[0]))){
        return arr_fn(reverse_fn,clause);
      }
    }
  }
  else{
    return xt_db_text_sql_util$$encode_query_segment(key,clause,column_fn,opts);
  }
}

function xt_db_text_sql_graph$$select_where(schema,table_name,return_str,where_params,indent,opts){
  let table_fn = (null == opts["table_fn"]) ? (function (x){
    return x;
  }) : opts["table_fn"];
  let column_fn = (null == opts["column_fn"]) ? (function (x){
    return x;
  }) : opts["column_fn"];
  if(!Array.isArray(where_params)){
    where_params = [where_params];
  }
  let clause_fn = function (clause){
    let sort_keys = (null == opts["sort_keys"]) ? true : opts["sort_keys"];
    let pair_fn = function (pair){
      return xt_db_text_sql_graph$$select_where_pair(
        schema,
        table_name,
        pair[0],
        pair[1],
        indent + 2,
        opts,
        xt_db_text_sql_graph$$select_where
      );
    };
    let query_pairs = Object.entries(clause);
    if(sort_keys){
      query_pairs = xt_lang_common_data$$arr_sort(query_pairs,function (arr){
        return arr[0];
      },function (x,y){
        return 0 > x.localeCompare(y);
      });
    }
    let clause_arr = query_pairs.map(pair_fn);
    return clause_arr.join(" AND ");
  };
  let where_arr = where_params.map(clause_fn).filter(xt_lang_common_data$$not_emptyp);
  let where_str = "";
  if(1 == where_arr.length){
    where_str = ("" + where_arr[0]);
  }
  if(1 < where_arr.length){
    where_str = ("" + where_arr.map(function (s){
      return "(" + s + ")";
    }).join(" OR "));
  }
  let out_arr = ["SELECT " + return_str," FROM " + table_fn(table_name)];
  if(0 < where_str.length){
    out_arr.push("\n" + "".padStart(indent," ") + "WHERE " + where_str);
  }
  return out_arr.join("");
}

function xt_db_text_sql_graph$$select_return_str(schema,params,return_fn,indent,opts){
  let column_fn = (null == opts["column_fn"]) ? (function (x){
    return x;
  }) : opts["column_fn"];
  let return_count_fn = (null == opts["return_count_fn"]) ? (function (){
    return "count" + "(*)";
  }) : opts["return_count_fn"];
  let return_format_fn = (null == opts["return_format_fn"]) ? xt_db_text_sql_util$$default_return_format_fn : opts["return_format_fn"];
  let return_join_fn = (null == opts["return_join_fn"]) ? (function (arr){
    return arr.join(", ");
  }) : opts["return_join_fn"];
  let return_link_fn = (null == opts["return_link_fn"]) ? (function (s,link_name){
    return "(" + s + ") AS " + link_name;
  }) : opts["return_link_fn"];
  let nest_fn = function (link){
    let link_name = link[0];
    let link_tree = link[link.length + -1];
    let link_ret = return_fn(schema,link_tree,2,opts);
    return return_link_fn(link_ret,link_name);
  };
  let format_fn = function (v){
    return return_format_fn(v,nest_fn,column_fn,opts);
  };
  let data_params = params["data"];
  let link_params = params["links"];
  let custom_params = params["custom"];
  let sort_keys = (null == opts["sort_keys"]) ? true : opts["sort_keys"];
  if((1 == custom_params.length) && ("sql/count" == custom_params[0]["::"])){
    return return_count_fn();
  }
  let return_data = data_params.map(format_fn);
  if(sort_keys){
    link_params = xt_lang_common_data$$arr_sort(link_params,function (arr){
      return arr[0];
    },function (x,y){
      return 0 > x.localeCompare(y);
    });
  }
  let return_links = link_params.map(format_fn);
  return return_join_fn(xt_lang_common_data$$arr_mapcat([return_data,return_links],function (x){
    return x;
  }));
}

function xt_db_text_sql_graph$$select_return(schema,tree,indent,opts){
  tree = xt_db_text_base_graph$$select_tree(schema,tree,opts);
  let column_fn = (null == opts["column_fn"]) ? (function (x){
    return x;
  }) : opts["column_fn"];
  let wrapper_fn = (null == opts["wrapper_fn"]) ? (function (s,indent){
    return s;
  }) : opts["wrapper_fn"];
  let format_fn = function (input){
    return xt_db_text_sql_util$$encode_sql(input,column_fn,opts,xt_db_text_sql_util$$encode_loop_fn);
  };
  let table_name = tree[0];
  let params = xt_lang_common_data$$second(tree);
  let where_params = params["where"];
  let custom_input = params["custom"];
  let custom_params = (Array.isArray(custom_input) ? custom_input : []).filter(function (e){
    return e["::"] == "sql/keyword";
  });
  let return_str = xt_db_text_sql_graph$$select_return_str(schema,params,xt_db_text_sql_graph$$select_return,indent,opts);
  let return_base = xt_db_text_sql_graph$$select_where(schema,table_name,return_str,where_params,2,opts);
  let custom_str = custom_params.map(format_fn).join(" ");
  return wrapper_fn(
    xt_lang_common_data$$not_emptyp(custom_str) ? (return_base + " " + custom_str) : return_base,
    (indent > 0) ? 2 : 0
  );
}

function xt_db_text_sql_graph$$select_tree(schema,query,opts){
  return xt_db_text_base_graph$$select_tree(schema,query,opts);
}

function xt_db_text_sql_graph$$select(schema,query,opts){
  let tree = xt_db_text_sql_graph$$select_tree(schema,query,opts);
  return xt_db_text_sql_graph$$select_return(schema,tree,0,opts);
}

function xt_db_text_base_check$$is_uuidp(s){
  if(!("string" == (typeof s))){
    return false;
  }
  if(!(36 == s.length)){
    return false;
  }
  let parts = s.split("-");
  return (5 == parts.length) && (8 == parts[0].length) && (4 == parts[1].length) && (4 == parts[2].length) && (4 == parts[3].length) && (12 == parts[4].length);
}

function xt_db_text_base_check$$check_arg_type(arg_type,arg){
  if(arg_type == "any"){
    return true;
  }
  else if((arg_type == "citext") || (arg_type == "inet") || (arg_type == "text")){
    return "string" == (typeof arg);
  }
  else if(arg_type == "uuid"){
    return xt_db_text_base_check$$is_uuidp(arg);
  }
  else if(arg_type == "boolean"){
    return "boolean" == (typeof arg);
  }
  else if((arg_type == "integer") || (arg_type == "int") || (arg_type == "long") || (arg_type == "bigint") || (arg_type == "float")){
    return "number" == (typeof arg);
  }
  else if(arg_type == "numeric"){
    return ("number" == (typeof arg)) || ("string" == (typeof arg));
  }
  else if(arg_type == "jsonb"){
    return ((null != arg) && ("object" == (typeof arg)) && !Array.isArray(arg)) || Array.isArray(arg);
  }
  else{
    return false;
  }
}

function xt_db_text_base_check$$check_args_type(args,targs){
  let i = 0;
  for(let spec of targs){
    let arg = args[i];
    if(!xt_db_text_base_check$$check_arg_type(spec["type"],arg)){
      return [
        false,
        {
              "status":"error",
              "tag":"net/arg-typecheck-failed",
              "data":{"input":arg,"spec":spec}
            }
      ];
    }
    i = (i + 1);
  };
  return [true,null];
}

function xt_db_text_base_check$$check_args_length(args,targs){
  if(args.length != targs.length){
    return [
      false,
      {
          "status":"error",
          "tag":"net/args-not-same-length",
          "data":{"expected":targs.length,"actual":args.length,"input":args}
        }
    ];
  }
  return [true,null];
}

function xt_db_text_sql_call$$call_format_input(spec,args){
  let targs = spec["input"];
  let out = [];
  for(let i = 0; i < args.length; ++i){
    let arg = args[i];
    let input = targs[i];
    let dbarg = null;
    if(input["type"] == "jsonb"){
      if("string" == (typeof arg)){
        dbarg = arg;
      }
      else{
        dbarg = xt_db_text_sql_util$$encode_json(arg);
      }
    }
    else{
      dbarg = xt_db_text_sql_util$$encode_value(arg);
    }
    out.push(dbarg);
  };
  return out;
}

function xt_db_text_sql_call$$call_format_query(spec,args){
  let {id,schema} = spec;
  let dbname = "\"" + schema + "\"." + id.replace(new RegExp("-","g"),"_") + "";
  let dbargs = xt_db_text_sql_call$$call_format_input(spec,args).join(", ");
  return "SELECT " + dbname + "(" + dbargs + ");";
}

function xt_db_text_sql_call$$call_raw(client,spec,args){
  let targs = spec["input"];
  let l_ok_value = xt_db_text_base_check$$check_args_length(args,targs);
  let [l_ok,l_err] = l_ok_value;
  if(!l_ok){
    throw "ERR: - " + JSON.stringify(l_err);
  }
  let t_ok_value = xt_db_text_base_check$$check_args_type(args,targs);
  let [t_ok,t_err] = t_ok_value;
  if(!t_ok){
    throw "ERR: - " + JSON.stringify(t_err);
  }
  let q = xt_db_text_sql_call$$call_format_query(spec,args);
  let success_fn = function (val){
    if("jsonb" == spec["return"]){
      if((null == val) || (val == "")){
        return null;
      }
      else{
        return ("string" == (typeof val)) ? JSON.parse(val) : val;
      }
    }
    else{
      return val;
    }
  };
  let error_fn = function (err){
    throw "ERR: - " + JSON.stringify(err);
  };
  return xt_net_conn_sql$$query_async(client,q).then(success_fn).catch(error_fn);
}

function js_net_http_fetch$$HttpFetchClient(defaults,middleware){
  globalThis["xt_lang_common_protocol$$IMPLEMENTATIONS"]["js.net.http_fetch/HttpFetchClient"] = true;
  xt_lang_common_protocol$$register_protocol_impl(
    xt_net_http_fetch$$IHttpClient["on"],
    "js.net.http_fetch/HttpFetchClient",
    {"request_http":js_net_http_fetch$$request_http}
  );
  return {
    "::":"js.net.http_fetch/HttpFetchClient",
    "::/protocols":[xt_net_http_fetch$$IHttpClient["on"]],
    "::/protocol-impls":{
        [xt_net_http_fetch$$IHttpClient["on"]]:{"request_http":js_net_http_fetch$$request_http}
      },
    "defaults":defaults,
    "middleware":middleware
  };
}

function js_net_http_fetch$$request_http_raw(client,input){
  let {body,headers,method,url} = input;
  return fetch(url,{"method":method,"headers":headers,"body":body}).then(function (res){
    return res.text().then(function (text){
      return {"status":res["status"],"headers":res["headers"],"body":text};
    });
  });
}

function js_net_http_fetch$$request_http(client,input){
  let handler = xt_net_http_fetch$$prepare_middleware(client,js_net_http_fetch$$request_http_raw);
  return handler(client,input);
}

function js_net_http_fetch$$create(defaults,middleware){
  return js_net_http_fetch$$HttpFetchClient(
    defaults,
    middleware || [xt_net_http_fetch$$wrap_prepare_input]
  );
}

var xt_db_system_impl_supabase_ws$$ISupabaseWebsocketFactory = xt_lang_common_protocol$$create_protocol_fn("xt.db.system.impl_supabase_ws/ISupabaseWebsocketFactory",{
  "create_ws_client":{"name":"create_ws_client","arglist":["impl","defaults"]}
});

function xt_db_system_impl_supabase_ws$$create_ws_client(impl,defaults){
  let method_fn = xt_lang_common_protocol$$protocol_method(
    impl,
    "xt.db.system.impl_supabase_ws/ISupabaseWebsocketFactory",
    "create_ws_client"
  );
  return method_fn(impl,defaults);
}

var xt_db_text_base_schema$$CACHED_SCHEMA = new Map();

var xt_db_text_base_schema$$CACHED_LOOKUP = new Map();

var xt_db_text_base_schema$$get_order = function (e){
  return e["order"];
};

var xt_db_text_base_schema$$get_ident = function (e){
  return e["ident"];
};

function xt_db_text_base_schema$$get_ident_id(e){
  return ("ref" == e["type"]) ? (e["ident"] + "_id") : e["ident"];
}

function xt_db_text_base_schema$$get_cached_schema(schema){
  let cached = xt_db_text_base_schema$$CACHED_SCHEMA.get(schema);
  if(null == cached){
    cached = {};
    xt_db_text_base_schema$$CACHED_SCHEMA.set(schema,cached);
  }
  return cached;
}

function xt_db_text_base_schema$$create_data_keys(schema,table_name){
  let table_def = schema[table_name];
  return xt_lang_common_data$$arr_sort(Object.values(table_def).filter(function (e){
    return ("number" == (typeof e["order"])) && (e["type"] != "ref");
  }),xt_db_text_base_schema$$get_order,function (x,y){
    return x < y;
  }).map(xt_db_text_base_schema$$get_ident);
}

function xt_db_text_base_schema$$create_ref_keys(schema,table_name){
  let table_def = schema[table_name];
  return xt_lang_common_data$$arr_sort(Object.values(table_def).filter(function (e){
    return ("number" == (typeof e["order"])) && (e["type"] == "ref");
  }),xt_db_text_base_schema$$get_order,function (x,y){
    return x < y;
  }).map(xt_db_text_base_schema$$get_ident);
}

function xt_db_text_base_schema$$create_rev_keys(schema,table_name){
  let table_def = schema[table_name];
  return Object.values(table_def).filter(function (e){
    return !("number" == (typeof e["order"]));
  }).map(xt_db_text_base_schema$$get_ident);
}

function xt_db_text_base_schema$$create_table_entries(schema,table_name){
  let table_def = schema[table_name];
  return xt_lang_common_data$$arr_sort(Object.values(table_def).filter(function (e){
    return "number" == (typeof e["order"]);
  }),xt_db_text_base_schema$$get_order,function (x,y){
    return x < y;
  });
}

function xt_db_text_base_schema$$create_defaults(schema,table_name){
  let table_def = schema[table_name];
  return xt_lang_common_data$$obj_keepf(table_def,function (m){
    return ((null != m["sql"]) && ("object" == (typeof m["sql"])) && !Array.isArray(m["sql"])) && (null != m["sql"]["default"]);
  },function (m){
    return m["sql"]["default"];
  });
}

function xt_db_text_base_schema$$create_all_keys(schema,table_name){
  let ref_ks = xt_db_text_base_schema$$create_ref_keys(schema,table_name);
  let ref_id_ks = xt_lang_common_data$$obj_from_pairs(ref_ks.map(function (k){
    return [k + "_id",k];
  }));
  return {
    "data":xt_db_text_base_schema$$create_data_keys(schema,table_name),
    "ref":ref_ks,
    "ref_id":ref_id_ks,
    "rev":xt_db_text_base_schema$$create_rev_keys(schema,table_name),
    "defaults":xt_db_text_base_schema$$create_defaults(schema,table_name),
    "table":xt_db_text_base_schema$$create_table_entries(schema,table_name)
  };
}

function xt_db_text_base_schema$$get_all_keys(schema,table_name){
  let cached = xt_db_text_base_schema$$get_cached_schema(schema);
  let table_keys = cached[table_name];
  if(null == table_keys){
    table_keys = xt_db_text_base_schema$$create_all_keys(schema,table_name);
    cached[table_name] = table_keys;
  }
  return table_keys;
}

function xt_db_text_base_schema$$data_keys(schema,table_name){
  return (xt_db_text_base_schema$$get_all_keys(schema,table_name))["data"];
}

function xt_db_text_base_schema$$ref_keys(schema,table_name){
  return (xt_db_text_base_schema$$get_all_keys(schema,table_name))["ref"];
}

function xt_db_text_base_schema$$ref_id_keys(schema,table_name){
  return (xt_db_text_base_schema$$get_all_keys(schema,table_name))["ref_id"];
}

function xt_db_text_base_schema$$rev_keys(schema,table_name){
  return (xt_db_text_base_schema$$get_all_keys(schema,table_name))["rev"];
}

function xt_db_text_base_schema$$table_defaults(schema,table_name){
  return (xt_db_text_base_schema$$get_all_keys(schema,table_name))["defaults"];
}

function xt_db_text_base_schema$$table_entries(schema,table_name){
  return (xt_db_text_base_schema$$get_all_keys(schema,table_name))["table"];
}

function xt_db_text_base_schema$$table_columns(schema,table_name){
  return xt_db_text_base_schema$$table_entries(schema,table_name).map(xt_db_text_base_schema$$get_ident_id);
}

function xt_db_text_base_schema$$create_table_order(lookup){
  return xt_lang_common_data$$arr_sort(Object.entries(lookup),function (pair){
    return pair[1]["position"];
  },function (x,y){
    return x < y;
  }).map(function (arr){
    return arr[0];
  });
}

function xt_db_text_base_schema$$table_order(lookup){
  let cached = xt_db_text_base_schema$$CACHED_LOOKUP.get(lookup);
  if(null == cached){
    cached = xt_db_text_base_schema$$create_table_order(lookup);
    xt_db_text_base_schema$$CACHED_LOOKUP.set(lookup,cached);
  }
  return cached;
}

function xt_db_text_base_flatten$$flatten_get_links(obj){
  let link_fn = function (e){
    if("string" == (typeof e)){
      return [e,true];
    }
    else{
      if(null == e){
        throw "Invalid link - " + JSON.stringify(obj);
      }
      else{
        return [e["id"],true];
      }
    }
  };
  return xt_lang_common_data$$obj_keep(obj,function (v){
    return Array.isArray(v) ? xt_lang_common_data$$obj_from_pairs(v.map(link_fn)) : null;
  });
}

function xt_db_text_base_flatten$$flatten_merge(table_map,data_obj,ref_links,rev_links){
  let {id} = data_obj;
  let rec = table_map[id];
  if(!((null != rec) && ("object" == (typeof rec)) && !Array.isArray(rec))){
    rec = {"id":id,"data":{},"ref_links":{},"rev_links":{}};
    table_map[id] = rec;
  }
  xt_lang_common_data$$swap_key(rec,"data",xt_lang_common_data$$obj_assign,[data_obj]);
  xt_lang_common_data$$swap_key(rec,"ref_links",xt_lang_common_data$$obj_assign_with,[
    ref_links,
    function (obj,other){
      return Object.assign(obj,other);
    }
  ]);
  xt_lang_common_data$$swap_key(rec,"rev_links",xt_lang_common_data$$obj_assign_with,[
    rev_links,
    function (obj,other){
      return Object.assign(obj,other);
    }
  ]);
  return table_map;
}

function xt_db_text_base_flatten$$flatten_node(schema,table_name,data,parent,acc){
  data = Object.assign(data,xt_lang_common_data$$clone_nested(parent));
  let table_map = acc[table_name];
  if(!((null != table_map) && ("object" == (typeof table_map)) && !Array.isArray(table_map))){
    table_map = {};
    acc[table_name] = table_map;
  }
  let data_obj = xt_lang_common_data$$obj_pick(data,xt_db_text_base_schema$$data_keys(schema,table_name));
  let obj_fn = function (v){
    return ((null != v) && ("object" == (typeof v)) && !Array.isArray(v)) ? [v] : v;
  };
  let rev_obj = xt_lang_common_data$$obj_keep(
    xt_lang_common_data$$obj_pick(data,xt_db_text_base_schema$$rev_keys(schema,table_name)),
    obj_fn
  );
  let rev_links = xt_db_text_base_flatten$$flatten_get_links(rev_obj);
  let ref_obj = xt_lang_common_data$$obj_keep(
    xt_lang_common_data$$obj_pick(data,xt_db_text_base_schema$$ref_keys(schema,table_name)),
    obj_fn
  );
  let ref_links = xt_db_text_base_flatten$$flatten_get_links(ref_obj);
  let ref_id_map = xt_db_text_base_schema$$ref_id_keys(schema,table_name);
  let ref_id_links = {};
  for(let [id_k,k] of Object.entries(ref_id_map)){
    if("string" == (typeof data[id_k])){
      ref_id_links[k] = {[data[id_k]]:true};
    }
  };
  xt_db_text_base_flatten$$flatten_merge(table_map,data_obj,xt_lang_common_data$$obj_assign_with(ref_links,ref_id_links,function (obj,other){
    return Object.assign(obj,other);
  }),rev_links);
  return {
    "table_map":table_map,
    "data_obj":data_obj,
    "ref_obj":ref_obj,
    "rev_obj":rev_obj
  };
}

function xt_db_text_base_flatten$$flatten_linked(schema,table_name,link_obj,link_id,acc,flatten_fn){
  let link_fn = function (e){
    let ref = xt_lang_common_data$$get_in(schema,[table_name,e,"ref"]);
    return [ref["ns"],ref["rval"]];
  };
  for(let [e,v] of Object.entries(link_obj)){
    if(Array.isArray(v)){
      let link_key_value = link_fn(e);
      let [link_key,link_path] = link_key_value;
      for(let e of v.filter(function (value){
        return (null != value) && ("object" == (typeof value)) && !Array.isArray(value);
      })){
        flatten_fn(schema,link_key,e,{[link_path]:[link_id]},acc);
      };
    }
  };
  return acc;
}

function xt_db_text_base_flatten$$flatten_obj(schema,table_name,obj,parent,acc){
  let flattened = xt_db_text_base_flatten$$flatten_node(schema,table_name,obj,parent,acc);
  let {data_obj,ref_obj,rev_obj,table_map} = flattened;
  let link_id = data_obj["id"];
  xt_db_text_base_flatten$$flatten_linked(
    schema,
    table_name,
    rev_obj,
    link_id,
    acc,
    xt_db_text_base_flatten$$flatten_obj
  );
  xt_db_text_base_flatten$$flatten_linked(
    schema,
    table_name,
    ref_obj,
    link_id,
    acc,
    xt_db_text_base_flatten$$flatten_obj
  );
  return acc;
}

function xt_db_text_base_flatten$$flatten_bulk(schema,m){
  let acc = {};
  if(Array.isArray(m)){
    for(let e of m){
      let [table_name,arr] = e;
      let items = Array.isArray(arr) ? arr : [arr];
      for(let obj of items){
        if(null != obj){
          xt_db_text_base_flatten$$flatten_obj(schema,table_name,obj,{},acc);
        }
      };
    };
  }
  else{
    for(let [table_name,arr] of Object.entries(m)){
      let items = Array.isArray(arr) ? arr : [arr];
      for(let obj of items){
        if(null != obj){
          xt_db_text_base_flatten$$flatten_obj(schema,table_name,obj,{},acc);
        }
      };
    };
  }
  return acc;
}

function xt_db_text_base_flatten$$flatten_bulk_ids(schema,lookup,m){
  let flat = xt_db_text_base_flatten$$flatten_bulk(schema,m);
  return xt_lang_common_data$$arr_keep(xt_db_text_base_schema$$table_order(lookup),function (table_name){
    return (null != flat[table_name]) ? [
      table_name,
      xt_lang_common_data$$arr_sort(Object.keys(flat[table_name]),function (id){
          return id;
        },function (x,y){
          return x < y;
        })
    ] : null;
  });
}

function xt_db_text_pgrest_graph$$tree_countp(custom){
  return (custom || []).some(function (entry){
    return entry["::"] == "sql/count";
  });
}

function xt_db_text_pgrest_graph$$pgrest_resolve_value(value){
  if(((null != value) && ("object" == (typeof value)) && !Array.isArray(value)) && (null != value["::"])){
    let tcls = value["::"];
    if(tcls == "sql/arg"){
      return value["name"];
    }
    else if(tcls == "sql/cast"){
      return xt_db_text_pgrest_graph$$pgrest_resolve_value((value["args"])[0]);
    }
    else if(tcls == "sql/defenum"){
      return value["name"];
    }
    else{
      return value;
    }
  }
  else{
    return value;
  }
}

function xt_db_text_pgrest_graph$$value__gtquery_text(value){
  value = xt_db_text_pgrest_graph$$pgrest_resolve_value(value);
  if(null == value){
    return "null";
  }
  else if("string" == (typeof value)){
    return value;
  }
  else if("boolean" == (typeof value)){
    return value ? "true" : "false";
  }
  else if("number" == (typeof value)){
    return String(value);
  }
  else{
    return String(value);
  }
}

function xt_db_text_pgrest_graph$$normalise_in_values(value){
  if(Array.isArray(value) && (1 == value.length) && Array.isArray(value[0])){
    return value[0];
  }
  else if(Array.isArray(value)){
    return value;
  }
  else{
    return [value];
  }
}

function xt_db_text_pgrest_graph$$filter_operatorp(op){
  return (op == "eq") || (op == "neq") || (op == "gt") || (op == "gte") || (op == "lt") || (op == "lte") || (op == "like") || (op == "ilike") || (op == "is") || (op == "in");
}

function xt_db_text_pgrest_graph$$compile_filter_value(op,value){
  if(op == "in"){
    return op + ".(" + xt_db_text_pgrest_graph$$normalise_in_values(value).map(xt_db_text_pgrest_graph$$value__gtquery_text).join(",") + ")";
  }
  else{
    return op + "." + xt_db_text_pgrest_graph$$value__gtquery_text(value);
  }
}

function xt_db_text_pgrest_graph$$compile_filter_fragment(filter){
  return filter["path"] + "." + xt_db_text_pgrest_graph$$compile_filter_value(filter["op"],filter["value"]);
}

function xt_db_text_pgrest_graph$$compile_clause_into(prefix,clause,out){
  for(let key of xt_lang_common_data$$arr_sort(Object.keys(clause || {}),function (value){
    return String(value);
  },function (x,y){
    return 0 > x.localeCompare(y);
  })){
    let value = clause[key];
    let path = xt_lang_common_data$$not_emptyp(prefix) ? (prefix + "." + key) : key;
    if(((null != value) && ("object" == (typeof value)) && !Array.isArray(value)) && !Array.isArray(value) && (null == value["::"])){
      xt_db_text_pgrest_graph$$compile_clause_into(path,value,out);
    }
    else if(Array.isArray(value) && ("string" == (typeof value[0])) && xt_db_text_pgrest_graph$$filter_operatorp(value[0])){
      out.push({"path":path,"op":value[0],"value":value[1]});
    }
    else if(Array.isArray(value) && ("string" == (typeof value[0]))){
      throw "Unsupported filter operator - " + value[0];
    }
    else{
      out.push({"path":path,"op":"eq","value":value});
    }
  };
  return out;
}

function xt_db_text_pgrest_graph$$compile_or_clause(clause){
  let fragments = xt_db_text_pgrest_graph$$compile_clause_into("",clause,[]).map(xt_db_text_pgrest_graph$$compile_filter_fragment);
  if(0 == fragments.length){
    return "";
  }
  else if(1 == fragments.length){
    return fragments[0];
  }
  else{
    return "and(" + fragments.join(",") + ")";
  }
}

function xt_db_text_pgrest_graph$$forward_ref_columnp(schema,table_name,key){
  let table = schema[table_name];
  let col = table && table[key];
  return ((null != col) && ("object" == (typeof col)) && !Array.isArray(col)) && ("ref" == col["type"]) && !("reverse" == col["ref"]["type"]);
}

function xt_db_text_pgrest_graph$$flatten_forward_ref_clause(schema,table_name,clause){
  let out = {};
  for(let [k,v] of Object.entries(clause)){
    if(xt_db_text_pgrest_graph$$forward_ref_columnp(schema,table_name,k) && ((null != v) && ("object" == (typeof v)) && !Array.isArray(v)) && (null != v["id"])){
      out[k + "_id"] = v["id"];
    }
    else if((null != v) && ("object" == (typeof v)) && !Array.isArray(v)){
      out[k] = xt_db_text_pgrest_graph$$flatten_forward_ref_clause(schema,table_name,v);
    }
    else{
      out[k] = v;
    }
  };
  return out;
}

function xt_db_text_pgrest_graph$$flatten_forward_ref_filters(schema,table_name,where){
  where = (Array.isArray(where) ? where : (((null != where) && ("object" == (typeof where)) && !Array.isArray(where)) ? [where] : []));
  return where.map(function (clause){
    return xt_db_text_pgrest_graph$$flatten_forward_ref_clause(schema,table_name,clause);
  });
}

function xt_db_text_pgrest_graph$$compile_where_params(where){
  where = (Array.isArray(where) ? where : (((null != where) && ("object" == (typeof where)) && !Array.isArray(where)) ? [where] : []));
  if(0 == where.length){
    return [];
  }
  if(1 == where.length){
    return xt_db_text_pgrest_graph$$compile_clause_into("",where[0],[]).map(function (filter){
      return filter["path"] + "=" + xt_db_text_pgrest_graph$$compile_filter_value(filter["op"],filter["value"]);
    });
  }
  let clauses = where.map(xt_db_text_pgrest_graph$$compile_or_clause).filter(xt_lang_common_data$$not_emptyp);
  return ["or=(" + clauses.join(",") + ")"];
}

function xt_db_text_pgrest_graph$$compile_tree_select_item(item,select_params_fn){
  if("string" == (typeof item)){
    return item;
  }
  else if(Array.isArray(item) && (item.length >= 3) && ("string" == (typeof item[0]))){
    return item[0] + ":" + (xt_lang_common_data$$nth(item,2))[0] + "(" + select_params_fn(
      xt_lang_common_data$$second(xt_lang_common_data$$nth(item,2))
    ) + ")";
  }
  else{
    return String(xt_db_text_pgrest_graph$$pgrest_resolve_value(item));
  }
}

function xt_db_text_pgrest_graph$$compile_tree_select_params(params){
  let {custom,data,links} = params;
  if(xt_db_text_pgrest_graph$$tree_countp(custom)){
    return "count";
  }
  let out = [];
  xt_lang_common_data$$arr_assign(out,(data || []).map(function (item){
    return xt_db_text_pgrest_graph$$pgrest_resolve_value(item);
  }));
  xt_lang_common_data$$arr_assign(out,(links || []).map(function (item){
    return xt_db_text_pgrest_graph$$compile_tree_select_item(item,xt_db_text_pgrest_graph$$compile_tree_select_params);
  }));
  return (out.length > 0) ? out.join(",") : "*";
}

function xt_db_text_pgrest_graph$$compile_control_params(custom){
  let order_cols = null;
  let order_sort = null;
  let limit = null;
  let offset = null;
  for(let entry of custom || []){
    if(entry["::"] == "sql/keyword"){
      let {name} = entry;
      if(name == "ORDER BY"){
        let tuple = (entry["args"] || [])[0];
        order_cols = (tuple["args"] || []).map(function (arg){
          return arg["name"];
        });
      }
      else if((name == "ASC") || (name == "DESC")){
        order_sort = name.toLowerCase();
      }
      else if(name == "LIMIT"){
        limit = (entry["args"] || [])[0]["name"];
      }
      else if(name == "OFFSET"){
        offset = (entry["args"] || [])[0]["name"];
      }
    }
  };
  let out = [];
  if(Array.isArray(order_cols)){
    out.push("order=" + order_cols.map(function (col){
      return (null != order_sort) ? (col + "." + order_sort) : col;
    }).join(","));
  }
  if(null != limit){
    out.push(
      "limit=" + xt_db_text_pgrest_graph$$value__gtquery_text(limit)
    );
  }
  if(null != offset){
    out.push(
      "offset=" + xt_db_text_pgrest_graph$$value__gtquery_text(offset)
    );
  }
  return out;
}

function xt_db_text_pgrest_graph$$compile_query_string(params){
  return (params || []).join("&");
}

function xt_db_text_pgrest_graph$$compile_url(path,params){
  let query = xt_db_text_pgrest_graph$$compile_query_string(params);
  return xt_lang_common_data$$not_emptyp(query) ? (path + "?" + query) : path;
}

function xt_db_text_pgrest_graph$$select_return(schema,tree,indent,opts){
  tree = xt_db_text_base_graph$$select_tree(schema,tree,opts);
  let table_name = tree[0];
  let params = xt_lang_common_data$$second(tree);
  let where = xt_db_text_pgrest_graph$$flatten_forward_ref_filters(schema,table_name,params["where"] || []);
  params["where"] = where;
  let custom = params["custom"] || [];
  let select = xt_db_text_pgrest_graph$$compile_tree_select_params(params);
  let request_params = ["select=" + select];
  request_params = request_params.concat(xt_db_text_pgrest_graph$$compile_where_params(where));
  request_params = request_params.concat(xt_db_text_pgrest_graph$$compile_control_params(custom));
  let path = "/rest/v1/" + table_name;
  let query = xt_db_text_pgrest_graph$$compile_query_string(request_params);
  let url = xt_db_text_pgrest_graph$$compile_url(path,request_params);
  return {
    "table":table_name,
    "url":url,
    "params":request_params,
    "method":"GET",
    "query":query,
    "path":path,
    "filters":where,
    "select":select,
    "type":"query",
    "headers":{}
  };
}

function xt_db_text_pgrest_graph$$select(schema,query,opts){
  return xt_db_text_pgrest_graph$$select_return(schema,query,0,opts);
}

var xt_db_system_impl_common$$ISourceListener = xt_lang_common_protocol$$create_protocol_fn("xt.db.system.impl_common/ISourceListener",{
  "add_db_listener":{
    "name":"add_db_listener",
    "arglist":["impl","listener_id","handle"]
  },
  "remove_db_listener":{"name":"remove_db_listener","arglist":["impl","listener_id"]},
  "get_db_listener":{"name":"get_db_listener","arglist":["impl","listener_id"]}
});

function xt_db_system_impl_common$$add_db_listener(impl,listener_id,handle){
  let method_fn = xt_lang_common_protocol$$protocol_method(
    impl,
    "xt.db.system.impl_common/ISourceListener",
    "add_db_listener"
  );
  return method_fn(impl,listener_id,handle);
}

function xt_db_system_impl_common$$remove_db_listener(impl,listener_id){
  let method_fn = xt_lang_common_protocol$$protocol_method(
    impl,
    "xt.db.system.impl_common/ISourceListener",
    "remove_db_listener"
  );
  return method_fn(impl,listener_id);
}

var xt_db_system_impl_common$$ISourceRemote = xt_lang_common_protocol$$create_protocol_fn("xt.db.system.impl_common/ISourceRemote",{
  "pull_async":{"name":"pull_async","arglist":["impl","tree"]},
  "rpc_call_async":{"name":"rpc_call_async","arglist":["impl","rpc_spec","args"]}
});

function xt_db_system_impl_common$$pull_async(impl,tree){
  let method_fn = xt_lang_common_protocol$$protocol_method(impl,"xt.db.system.impl_common/ISourceRemote","pull_async");
  return method_fn(impl,tree);
}

function xt_db_system_impl_common$$rpc_call_async(impl,rpc_spec,args){
  let method_fn = xt_lang_common_protocol$$protocol_method(
    impl,
    "xt.db.system.impl_common/ISourceRemote",
    "rpc_call_async"
  );
  return method_fn(impl,rpc_spec,args);
}

var xt_db_system_impl_common$$ISourceRealtime = xt_lang_common_protocol$$create_protocol_fn("xt.db.system.impl_common/ISourceRealtime",{
  "subscribe_db":{"name":"subscribe_db","arglist":["impl","conn_id","topics"]},
  "unsubscribe_db":{
    "name":"unsubscribe_db",
    "arglist":["impl","conn_id","topics"]
  }
});

function xt_db_system_impl_common$$subscribe_db(impl,conn_id,topics){
  let method_fn = xt_lang_common_protocol$$protocol_method(
    impl,
    "xt.db.system.impl_common/ISourceRealtime",
    "subscribe_db"
  );
  return method_fn(impl,conn_id,topics);
}

function xt_db_system_impl_common$$unsubscribe_db(impl,conn_id,topics){
  let method_fn = xt_lang_common_protocol$$protocol_method(
    impl,
    "xt.db.system.impl_common/ISourceRealtime",
    "unsubscribe_db"
  );
  return method_fn(impl,conn_id,topics);
}

var xt_db_system_impl_common$$ISourceLocal = xt_lang_common_protocol$$create_protocol_fn("xt.db.system.impl_common/ISourceLocal",{
  "clear_db":{"name":"clear_db","arglist":["impl"]},
  "pull":{"name":"pull","arglist":["impl","tree"]},
  "record_add":{
    "name":"record_add",
    "arglist":["impl","table_name","records"]
  },
  "record_delete":{"name":"record_delete","arglist":["impl","table_name","ids"]},
  "process_add_event":{"name":"process_add_event","arglist":["impl","data"]},
  "process_remove_event":{"name":"process_remove_event","arglist":["impl","data"]}
});

function xt_db_system_impl_common$$pull(impl,tree){
  let method_fn = xt_lang_common_protocol$$protocol_method(impl,"xt.db.system.impl_common/ISourceLocal","pull");
  return method_fn(impl,tree);
}

function xt_db_system_impl_common$$record_delete(impl,table_name,ids){
  let method_fn = xt_lang_common_protocol$$protocol_method(impl,"xt.db.system.impl_common/ISourceLocal","record_delete");
  return method_fn(impl,table_name,ids);
}

function xt_db_system_impl_common$$process_add_event(impl,data){
  let method_fn = xt_lang_common_protocol$$protocol_method(
    impl,
    "xt.db.system.impl_common/ISourceLocal",
    "process_add_event"
  );
  return method_fn(impl,data);
}

var xt_db_system_impl_common$$ISourceLifecycle = xt_lang_common_protocol$$create_protocol_fn(
  "xt.db.system.impl_common/ISourceLifecycle",
  {"stop_db":{"name":"stop_db","arglist":["impl"]}}
);

function xt_db_system_impl_common$$stop_db(impl){
  let method_fn = xt_lang_common_protocol$$protocol_method(impl,"xt.db.system.impl_common/ISourceLifecycle","stop_db");
  return method_fn(impl);
}

function xt_db_system_impl_common$$add_db_listener_default(impl,listener_id,handle){
  let {listeners} = impl;
  listeners[listener_id] = handle;
  return listener_id;
}

function xt_db_system_impl_common$$remove_db_listener_default(impl,listener_id){
  let {listeners} = impl;
  delete(listeners[listener_id]);
  return listener_id;
}

function xt_db_system_impl_common$$get_db_listener_default(impl,listener_id,handle){
  let {listeners} = impl;
  return listeners[listener_id];
}

function xt_db_system_impl_common$$sync_get_tables(payload){
  let out = {};
  let db_sync = payload["db/sync"];
  let db_remove = payload["db/remove"];
  if((null != db_sync) && ("object" == (typeof db_sync)) && !Array.isArray(db_sync)){
    for(let table of Object.keys(db_sync)){
      out[table] = true;
    };
  }
  if((null != db_remove) && ("object" == (typeof db_remove)) && !Array.isArray(db_remove)){
    for(let table of Object.keys(db_remove)){
      out[table] = true;
    };
  }
  return Object.keys(out);
}

function xt_db_system_impl_common$$sync_notify_listeners(impl,tables,event){
  let {listeners} = impl;
  for(let [listener_id,handle] of Object.entries(listeners)){
    let {callback,guard} = handle;
    let matched = false;
    if("function" == (typeof guard)){
      for(let table of tables){
        if(guard(table)){
          matched = true;
        }
      };
    }
    if((null != guard) && ("object" == (typeof guard)) && !Array.isArray(guard)){
      for(let table of tables){
        let table_guard = guard[table];
        if("function" == (typeof table_guard)){
          let table_payload = {
            "db/sync":xt_lang_common_data$$get_in(event,["db/sync",table]),
            "db/remove":xt_lang_common_data$$get_in(event,["db/remove",table])
          };
          if(table_guard(table_payload)){
            matched = true;
          }
        }
        if(table_guard && !("function" == (typeof table_guard))){
          matched = true;
        }
      };
    }
    if(matched){
      callback(event);
    }
  };
  return true;
}

function xt_db_system_impl_common$$sync_process_payload(impl,payload){
  let db_sync = payload["db/sync"];
  let db_remove = payload["db/remove"];
  if(((null != db_sync) && ("object" == (typeof db_sync)) && !Array.isArray(db_sync)) && xt_lang_common_data$$not_emptyp(db_sync)){
    xt_db_system_impl_common$$process_add_event(impl,db_sync);
  }
  if(((null != db_remove) && ("object" == (typeof db_remove)) && !Array.isArray(db_remove)) && xt_lang_common_data$$not_emptyp(db_remove)){
    for(let [table_name,ids] of Object.entries(db_remove)){
      xt_db_system_impl_common$$record_delete(impl,table_name,ids);
    };
  }
  let tables = xt_db_system_impl_common$$sync_get_tables(payload);
  if(tables.length > 0){
    xt_db_system_impl_common$$sync_notify_listeners(impl,tables,payload);
  }
  return true;
}

function xt_db_system_memory_util$$get_entry(rows,table_key,id){
  return xt_lang_common_data$$get_in(rows,[table_key,id]);
}

function xt_db_system_memory_util$$swap_if_entry(rows,table_key,id,f){
  let entry = xt_lang_common_data$$get_in(rows,[table_key,id]);
  if(null != entry){
    let {record} = entry;
    f(record);
    let new_entry = {"t":Date.now(),"record":record};
    xt_lang_common_data$$set_in(rows,[table_key,id],new_entry);
    return new_entry;
  }
  return entry;
}

function xt_db_system_memory_util$$merge_single(rows,table_key,id,new_record,new_fn){
  let incoming_record = new_record || {};
  let entry = xt_db_system_memory_util$$get_entry(rows,table_key,id);
  if(!((null != entry) && ("object" == (typeof entry)) && !Array.isArray(entry))){
    entry = {"record":{"id":id,"data":{},"ref_links":{},"rev_links":{}}};
  }
  let {record} = entry;
  let data = incoming_record["data"] || {};
  let ref_links = incoming_record["ref_links"] || {};
  let rev_links = incoming_record["rev_links"] || {};
  xt_lang_common_data$$swap_key(record,"data",function (obj,other){
    return Object.assign(obj,other);
  },[data]);
  xt_lang_common_data$$swap_key(record,"ref_links",xt_lang_common_data$$obj_assign_with,[
    ref_links,
    function (obj,other){
      return Object.assign(obj,other);
    }
  ]);
  xt_lang_common_data$$swap_key(record,"rev_links",xt_lang_common_data$$obj_assign_with,[
    rev_links,
    function (obj,other){
      return Object.assign(obj,other);
    }
  ]);
  let new_entry = new_fn({"t":Date.now(),"record":record});
  xt_lang_common_data$$set_in(rows,[table_key,id],new_entry);
  return new_entry;
}

function xt_db_system_memory_util$$merge_bulk(rows,fdata,new_fn){
  let out = {};
  for(let [table_key,m] of Object.entries(fdata)){
    let entries = m || {};
    for(let [id,new_record] of Object.entries(entries)){
      xt_lang_common_data$$set_in(out,[table_key,id],xt_db_system_memory_util$$merge_single(rows,table_key,id,new_record,new_fn || (function (x){
        return x;
      })));
    };
  };
  return out;
}

function xt_db_system_memory_util$$get_link_attrs(schema,table_key,field){
  let attr = xt_lang_common_data$$get_in(schema,[table_key,field,"ref"]);
  if(null == attr){
    throw "Not a valid link type: " + JSON.stringify([table_key,field]);
  }
  let link_ns = attr["ns"];
  let {rval} = attr;
  let link_type = attr["type"];
  let table_link_value =   ({
      "reverse":["rev_links","ref_links"],
      "forward":["ref_links","rev_links"]
    })[link_type];
  let [table_link,inverse_link] = table_link_value;
  return {
    "table_key":table_key,
    "table_link":table_link,
    "table_field":field,
    "inverse_key":link_ns,
    "inverse_link":inverse_link,
    "inverse_field":rval
  };
}

function xt_db_system_memory_util$$remove_single_link_entry(rows,table_key,id,table_link,table_field,link_id,link_cb){
  let remove_fn = function (record){
    let link = record[table_link];
    let lrec = link[table_field];
    if((null != lrec) && (null != lrec[link_id])){
      delete(lrec[link_id]);
      if(0 == Object.keys(lrec).length){
        delete(link[table_field]);
      }
      if(null != link_cb){
        link_cb(link_id);
      }
    }
  };
  return xt_db_system_memory_util$$swap_if_entry(rows,table_key,id,remove_fn);
}

function xt_db_system_memory_util$$remove_single(rows,schema,table_key,id){
  let entry = xt_db_system_memory_util$$get_entry(rows,table_key,id);
  if(null != entry){
    let rec = entry["record"];
    let {ref_links,rev_links} = rec;
    let links = xt_lang_common_data$$arr_assign(Object.entries(ref_links),Object.entries(rev_links));
    for(let pair of links){
      let [field,m] = pair;
      let attrs = xt_db_system_memory_util$$get_link_attrs(schema,table_key,field);
      let {inverse_field,inverse_key,inverse_link} = attrs;
      for(let link_id of Object.keys(m)){
        xt_db_system_memory_util$$remove_single_link_entry(rows,inverse_key,link_id,inverse_link,inverse_field,id,null);
      };
    };
    delete(rows[table_key][id]);
    return [entry];
  }
}

function xt_db_system_memory_util$$remove_bulk(rows,schema,table_key,ids){
  return xt_lang_common_data$$arr_mapcat(xt_lang_common_data$$arr_keep(ids,function (id){
    return xt_db_system_memory_util$$remove_single(rows,schema,table_key,id);
  }),function (x){
    return x;
  });
}

function xt_db_system_memory_util$$add_single_link_entry(rows,table_key,id,table_link,table_field,link_id,link_cb,inverse_key,inverse_field){
  let add_fn = function (record){
    let link = record[table_link];
    let lrec = link[table_field];
    if(null == lrec){
      lrec = {};
      link[table_field] = lrec;
      lrec[link_id] = true;
    }
    else if(table_link == "rev_links"){
      lrec[link_id] = true;
    }
    else{
      let prev_ids = Object.keys(lrec);
      for(let prev_id of prev_ids){
        xt_db_system_memory_util$$remove_single_link_entry(rows,inverse_key,prev_id,"rev_links",inverse_field,id,null);
      };
      link[table_field] = {[link_id]:true};
    }
    if(null != link_cb){
      link_cb(link_id);
    }
  };
  return xt_db_system_memory_util$$swap_if_entry(rows,table_key,id,add_fn);
}

function xt_db_system_memory_util$$add_single_link(rows,schema,table_key,id,field,link_id){
  let attrs = xt_db_system_memory_util$$get_link_attrs(schema,table_key,field);
  let {inverse_field,inverse_key,inverse_link,table_field,table_link} = attrs;
  let l_arr = [false,false];
  let t_has_fn = function (_){
    l_arr[0] = true;
  };
  let t_entry_fn = function (){
    return xt_db_system_memory_util$$add_single_link_entry(
      rows,
      table_key,
      id,
      table_link,
      table_field,
      link_id,
      t_has_fn,
      inverse_key,
      inverse_field
    );
  };
  let i_has_fn = function (_){
    l_arr[1] = true;
  };
  let i_entry_fn = function (){
    return xt_db_system_memory_util$$add_single_link_entry(
      rows,
      inverse_key,
      link_id,
      inverse_link,
      inverse_field,
      id,
      i_has_fn,
      table_key,
      field
    );
  };
  if(table_link == "ref_links"){
    t_entry_fn();
    i_entry_fn();
  }
  else if(table_link == "rev_links"){
    i_entry_fn();
    t_entry_fn();
  }
  return l_arr;
}

function xt_db_system_memory_util$$add_bulk_links(rows,schema,flat){
  let out = [];
  for(let table_key of Object.keys(flat)){
    let bulk = flat[table_key];
    for(let row_id of Object.keys(bulk)){
      let record = bulk[row_id];
      let {ref_links,rev_links} = record;
      for(let field of Object.keys(ref_links)){
        let links = ref_links[field];
        for(let link_id of Object.keys(links)){
          out.push(
            {"table":table_key,"id":row_id,"field":field,"link_id":link_id}
          );
        };
      };
      for(let field of Object.keys(rev_links)){
        let links = rev_links[field];
        for(let link_id of Object.keys(links)){
          out.push(
            {"table":table_key,"id":row_id,"field":field,"link_id":link_id}
          );
        };
      };
    };
  };
  for(let link_spec of out){
    xt_db_system_memory_util$$add_single_link(
      rows,
      schema,
      link_spec["table"],
      link_spec["id"],
      link_spec["field"],
      link_spec["link_id"]
    );
  };
  return out;
}

function xt_db_system_memory_util$$add_bulk(rows,schema,data){
  let flat = xt_db_text_base_flatten$$flatten_bulk(schema,data);
  xt_db_system_memory_util$$merge_bulk(rows,flat,null);
  return xt_db_system_memory_util$$add_bulk_links(rows,schema,flat);
}

function xt_db_text_base_tree$$tree_control_array(control){
  if(xt_lang_common_data$$is_emptyp(control)){
    return [];
  }
  let out = [];
  let {limit,offset,order_by,order_sort} = control;
  if(Array.isArray(order_by)){
    out.push(xt_db_text_sql_util$$ORDER_BY(order_by));
  }
  if(null != order_sort){
    out.push(xt_db_text_sql_util$$ORDER_SORT(order_sort));
  }
  if("number" == (typeof limit)){
    out.push(xt_db_text_sql_util$$LIMIT(limit));
  }
  if("number" == (typeof offset)){
    out.push(xt_db_text_sql_util$$OFFSET(offset));
  }
  return out;
}

function xt_db_text_base_tree$$tree_base(schema,table_name,sel_query,clause,returning,opts){
  let tarr = xt_db_text_base_scope$$merge_queries(sel_query,clause);
  let tree = xt_lang_common_data$$arr_assign([table_name],tarr);
  if(xt_lang_common_data$$not_emptyp(returning)){
    tree.push(returning);
  }
  return xt_db_text_sql_graph$$select_tree(schema,tree,opts);
}

function xt_db_text_base_tree$$tree_count(schema,entry,clause,opts){
  let {control,view} = entry;
  let {query,table} = view;
  return xt_db_text_base_tree$$tree_base(schema,table,query,clause,xt_lang_common_data$$arr_assign(
    [{"::":"sql/count"}],
    xt_db_text_base_tree$$tree_control_array(control)
  ),opts);
}

function xt_db_text_base_tree$$tree_select(schema,entry,clause,opts){
  let {control,view} = entry;
  let {query,table} = view;
  return xt_db_text_base_tree$$tree_base(
    schema,
    table,
    query,
    clause,
    xt_lang_common_data$$arr_assign(["id"],xt_db_text_base_tree$$tree_control_array(control)),
    opts
  );
}

function xt_db_text_base_tree$$tree_return(schema,entry,sel_query,clause,opts){
  let {view} = entry;
  let {query,table} = view;
  return xt_db_text_base_tree$$tree_base(schema,table,sel_query,clause,query,opts);
}

function xt_db_text_base_tree$$tree_combined(schema,sel_entry,ret_entry,ret_omit,clause,opts){
  let {control} = sel_entry;
  let sel_table = sel_entry["view"]["table"];
  let ret_table = ret_entry["view"]["table"];
  let sel_query = sel_entry["view"]["query"];
  let ret_query = ret_entry["view"]["query"];
  if(null == sel_query){
    sel_query = {};
  }
  if(null == ret_query){
    ret_query = {};
  }
  let ret_clause = xt_lang_common_data$$not_emptyp(ret_omit) ? [{"id":{"not_in":[ret_omit]}}] : [];
  let combined_clause = xt_db_text_base_scope$$merge_queries(clause,ret_clause);
  return xt_db_text_base_tree$$tree_base(schema,sel_table,sel_query,combined_clause,xt_lang_common_data$$arr_assign(
    ret_query.slice(),
    xt_db_text_base_tree$$tree_control_array(control)
  ),opts);
}

function xt_db_text_base_tree$$tree_fill_input(tree,args,input_spec,drop_first){
  let arg_map = {};
  if(drop_first){
    input_spec.shift();
  }
  if(0 == input_spec.length){
    return tree;
  }
  for(let i = 0; i < input_spec.length; ++i){
    let e = input_spec[i];
    arg_map["{{" + e["symbol"] + "}}"] = args[i];
  };
  let out = xt_lang_common_tree$$tree_walk(tree,function (x){
    return x;
  },function (x){
    if(("string" == (typeof x)) && (null != arg_map[x])){
      return arg_map[x];
    }
    return x;
  });
  return out;
}

function xt_db_text_base_tree$$plan_select(schema,entry,args,opts){
  let {input} = entry;
  let itree = xt_db_text_base_tree$$tree_select(schema,entry,{},opts);
  let qtree = xt_db_text_base_tree$$tree_fill_input(itree,args,input.slice(),false);
  return qtree;
}

function xt_db_text_base_tree$$plan_count(schema,entry,args,opts){
  let {input} = entry;
  let itree = xt_db_text_base_tree$$tree_count(schema,entry,{},opts);
  let qtree = xt_db_text_base_tree$$tree_fill_input(itree,args,input.slice(),false);
  return qtree;
}

function xt_db_text_base_tree$$plan_return(schema,entry,id,args,opts){
  let {input} = entry;
  let itree = xt_db_text_base_tree$$tree_return(schema,entry,{"id":id},{},opts);
  let qtree = xt_db_text_base_tree$$tree_fill_input(itree,args,input.slice(),true);
  return qtree;
}

function xt_db_text_base_tree$$plan_return_bulk(schema,entry,ids,args,opts){
  let {input} = entry;
  let itree = xt_db_text_base_tree$$tree_return(schema,entry,{"id":["in",[ids]]},{},opts);
  let qtree = xt_db_text_base_tree$$tree_fill_input(itree,args,input.slice(),true);
  return qtree;
}

function xt_db_text_base_tree$$plan_combined(schema,sel_entry,sel_args,ret_entry,ret_args,ret_omit,opts,as_tree){
  let sel_input = sel_entry["input"];
  let ret_input = ret_entry["input"];
  let itree = xt_db_text_base_tree$$tree_combined(schema,sel_entry,ret_entry,ret_omit,[],opts);
  let qtree = xt_db_text_base_tree$$tree_fill_input(
    itree,
    xt_lang_common_data$$arr_assign(ret_args.slice(),sel_args),
    xt_lang_common_data$$arr_assign(ret_input.slice(),sel_input),
    (ret_input.length > 0) ? true : false
  );
  return qtree;
}

function xt_db_text_base_tree$$plan_view_check(entry,args,drop_first){
  let targs = entry["input"];
  if(drop_first){
    targs = [...targs];
    targs.shift();
  }
  let l_ok_value = xt_db_text_base_check$$check_args_length(args,targs);
  let [l_ok,l_err] = l_ok_value;
  if(!l_ok){
    return [l_ok,l_err];
  }
  let t_ok_value = xt_db_text_base_check$$check_args_type(args,targs);
  let [t_ok,t_err] = t_ok_value;
  if(!t_ok){
    return [t_ok,t_err];
  }
  return [true,null];
}

function xt_db_text_base_tree$$plan_view(schema,query_spec){
  let {return_args,return_bulk,return_count,return_entry,return_id,return_omit,select_args,select_entry,table} = query_spec;
  if((null != select_entry) && (null != return_entry)){
    let s_ok_value = xt_db_text_base_tree$$plan_view_check(select_entry,select_args,false);
    let [s_ok,s_err] = s_ok_value;
    if(!s_ok){
      return [s_ok,s_err];
    }
    let r_ok_value = xt_db_text_base_tree$$plan_view_check(return_entry,return_args,true);
    let [r_ok,r_err] = r_ok_value;
    if(!r_ok){
      return [r_ok,r_err];
    }
    return [
      true,
      xt_db_text_base_tree$$plan_combined(
          schema,
          select_entry,
          select_args,
          return_entry,
          return_args,
          return_omit,
          {},
          false
        )
    ];
  }
  else if(null != select_entry){
    let s_ok_value = xt_db_text_base_tree$$plan_view_check(select_entry,select_args,false);
    let [s_ok,s_err] = s_ok_value;
    if(!s_ok){
      return [s_ok,s_err];
    }
    return [
      true,
      return_count ? xt_db_text_base_tree$$plan_count(schema,select_entry,select_args,{}) : xt_db_text_base_tree$$plan_select(schema,select_entry,select_args,{})
    ];
  }
  else if(null != return_id){
    let rargs = [return_id,...return_args];
    let r_ok_value = xt_db_text_base_tree$$plan_view_check(return_entry,rargs,false);
    let [r_ok,r_err] = r_ok_value;
    if(!r_ok){
      return [r_ok,r_err];
    }
    return [
      true,
      xt_db_text_base_tree$$plan_return(schema,return_entry,return_id,return_args,{})
    ];
  }
  else if(null != return_bulk){
    let r_ok_value = xt_db_text_base_tree$$plan_view_check(return_entry,return_args,true);
    let [r_ok,r_err] = r_ok_value;
    if(!r_ok){
      return [r_ok,r_err];
    }
    return [
      true,
      xt_db_text_base_tree$$plan_return_bulk(schema,return_entry,return_bulk,return_args,{})
    ];
  }
  else{
    return [true,null];
  }
}

function js_net_conn_postgres$$PostgresClient(defaults,raw){
  globalThis["xt_lang_common_protocol$$IMPLEMENTATIONS"]["js.net.conn_postgres/PostgresClient"] = true;
  xt_lang_common_protocol$$register_protocol_impl(xt_net_conn_sql$$ISqlClient["on"],"js.net.conn_postgres/PostgresClient",{
    "connect":js_net_conn_postgres$$client_connect,
    "disconnect":js_net_conn_postgres$$client_disconnect,
    "query":function (client,input){
        throw "Not Allowed";
      },
    "query_async":js_net_conn_postgres$$client_query_async
  });
  return {
    "::":"js.net.conn_postgres/PostgresClient",
    "::/protocols":[xt_net_conn_sql$$ISqlClient["on"]],
    "::/protocol-impls":{
        [xt_net_conn_sql$$ISqlClient["on"]]:{
          "connect":js_net_conn_postgres$$client_connect,
          "disconnect":js_net_conn_postgres$$client_disconnect,
          "query":function (client,input){
            throw "Not Allowed";
          },
          "query_async":js_net_conn_postgres$$client_query_async
        }
      },
    "defaults":defaults,
    "raw":raw
  };
}

function js_net_conn_postgres$$coerce_number_string(value){
  if(!("string" == (typeof value))){
    return value;
  }
  let trimmed = value.trim();
  if(trimmed == ""){
    return value;
  }
  if(trimmed.match("^[+-]?(?:\\d+(?:\\.\\d+)?|\\.\\d+)(?:[eE][+-]?\\d+)?$")){
    return Number(trimmed);
  }
  else{
    return value;
  }
}

function js_net_conn_postgres$$normalise_scalar_output(value){
  if((null == value) || ("boolean" == (typeof value)) || Array.isArray(value) || ((null != value) && ("object" == (typeof value)) && !Array.isArray(value))){
    return value;
  }
  else if("string" == (typeof value)){
    return js_net_conn_postgres$$coerce_number_string(value);
  }
  else{
    return value;
  }
}

function js_net_conn_postgres$$normalise_query_output(res){
  let {rows} = res;
  if((1 == rows.length) && (1 == xt_lang_common_data$$obj_keys(xt_lang_common_data$$first(rows)).length)){
    return js_net_conn_postgres$$normalise_scalar_output(
      xt_lang_common_data$$obj_first_val(xt_lang_common_data$$first(rows))
    );
  }
  else{
    return rows;
  }
}

function js_net_conn_postgres$$client_connect(client,opts){
  let {defaults} = client;
  let conn = new Postgres.Client(Object.assign(Object.assign({
    "host":"127.0.0.1",
    "port":5432,
    "user":"postgres",
    "password":"postgres",
    "database":"postgres"
  },defaults),opts));
  return conn.connect().then(function (){
    client["raw"] = conn;
    return client;
  });
}

function js_net_conn_postgres$$client_disconnect(client){
  let {raw} = client;
  raw.end();
  delete(client["raw"]);
  return client;
}

function js_net_conn_postgres$$client_query_async(client,input){
  let {raw} = client;
  return raw.query(input).then(js_net_conn_postgres$$normalise_query_output);
}

function js_net_conn_postgres$$create(defaults){
  return js_net_conn_postgres$$PostgresClient(defaults,null);
}

function xt_lang_common_sort_by$$sort_by(arr,inputs){
  let keys = inputs.map(function (e){
    return Array.isArray(e) ? e[0] : e;
  });
  let inverts = inputs.map(function (e){
    return Array.isArray(e) ? e[1] : false;
  });
  let get_fn = function (e,key){
    if("function" == (typeof key)){
      return key(e);
    }
    else{
      return e[key];
    }
  };
  let key_fn = function (e){
    return keys.map(function (key){
      return get_fn(e,key);
    });
  };
  let comp_fn = function (a0,a1){
    for(let i = 0; i < a0.length; ++i){
      let v0 = a0[i];
      let v1 = a1[i];
      let invert = inverts[i];
      if(v0 != v1){
        if(invert){
          if("number" == (typeof v0)){
            return v1 < v0;
          }
          else{
            return 0 > String(v1).localeCompare(String(v0));
          }
        }
        else{
          if("number" == (typeof v0)){
            return v0 < v1;
          }
          else{
            return 0 > String(v0).localeCompare(String(v1));
          }
        }
      }
    };
    return false;
  };
  let out = arr.slice();
  xt_lang_common_data$$arr_sort(out,key_fn,comp_fn);
  return out;
}

function xt_db_system_memory_graph$$check_in_clause(x,expr){
  return expr[0].some(function (e){
    return e == x;
  });
}

function xt_db_system_memory_graph$$like_char_at(s,i){
  if((i < 0) || (i >= s.length)){
    return "";
  }
  return s.substring(i,i + 1);
}

function xt_db_system_memory_graph$$check_like_clause(x,expr){
  if(!("string" == (typeof x)) || !("string" == (typeof expr))){
    return false;
  }
  let slen = x.length;
  let plen = expr.length;
  let sidx = 0;
  let pidx = 0;
  let star_pidx = -1;
  let star_sidx = -1;
  while(sidx < slen){
    let sch = xt_db_system_memory_graph$$like_char_at(x,sidx);
    let pch = (pidx < plen) ? xt_db_system_memory_graph$$like_char_at(expr,pidx) : null;
    if(("\\" == pch) && ((pidx + 1) < plen) && (sch == xt_db_system_memory_graph$$like_char_at(expr,pidx + 1))){
      sidx = (sidx + 1);
      pidx = (pidx + 2);
    }
    else if(("\\" == pch) && (sch == "\\") && ((pidx + 1) == plen)){
      sidx = (sidx + 1);
      pidx = (pidx + 1);
    }
    else if("%" == pch){
      star_pidx = pidx;
      star_sidx = sidx;
      pidx = (pidx + 1);
    }
    else if(("_" == pch) || (sch == pch)){
      sidx = (sidx + 1);
      pidx = (pidx + 1);
    }
    else if(star_pidx < 0){
      return false;
    }
    else{
      star_sidx = (star_sidx + 1);
      sidx = star_sidx;
      pidx = (star_pidx + 1);
    }
  }
  while(pidx < plen){
    if("%" == xt_db_system_memory_graph$$like_char_at(expr,pidx)){
      pidx = (pidx + 1);
    }
    else{
      return false;
    }
  }
  return true;
}

var xt_db_system_memory_graph$$LINK_LOOKUP = {"forward":"ref_links","reverse":"rev_links"};

function xt_db_system_memory_graph$$check_ilike_clause(x,expr){
  if(!("string" == (typeof x)) || !("string" == (typeof expr))){
    return false;
  }
  return xt_db_system_memory_graph$$check_like_clause(x.toLowerCase(),expr.toLowerCase());
}

var xt_db_system_memory_graph$$PULL_CHECK = {
  "not_in":function (x,expr){
    return !xt_db_system_memory_graph$$check_in_clause(x,expr);
  },
  "lt":function (x,y){
    return x < y;
  },
  "neq":function (x,expr){
    return x != expr;
  },
  "eq":function (x,y){
    return x == y;
  },
  "is":function (x,expr){
    return x == expr;
  },
  "like":xt_db_system_memory_graph$$check_like_clause,
  "gt":function (x,y){
    return x > y;
  },
  "gte":function (x,y){
    return x >= y;
  },
  "is_not_null":function (value){
    return null != value;
  },
  "is_null":function (value){
    return null == value;
  },
  "between":function (x,start_expr,_and,end_expr){
    return (x >= start_expr) && ((_and == "and") ? (x <= end_expr) : (x <= _and));
  },
  "not_like":function (x,expr){
    return !xt_db_system_memory_graph$$check_like_clause(x,expr);
  },
  "lte":function (x,y){
    return x <= y;
  },
  "ilike":xt_db_system_memory_graph$$check_ilike_clause,
  "in":xt_db_system_memory_graph$$check_in_clause
};

function xt_db_system_memory_graph$$custom_params(custom){
  let out = {
    "count":false,
    "order_by":null,
    "order_sort":null,
    "limit":null,
    "offset":null
  };
  for(let entry of custom || []){
    if(entry["::"] == "sql/count"){
      out["count"] = true;
    }
    else if(entry["::"] == "sql/keyword"){
      let {name} = entry;
      if(name == "ORDER BY"){
        let tuple = (entry["args"] || [])[0];
        out["order_by"] = (tuple["args"] || []).map(function (arg){
          return arg["name"];
        });
      }
      else if((name == "ASC") || (name == "DESC")){
        out["order_sort"] = name.toLowerCase();
      }
      else if(name == "LIMIT"){
        out["limit"] = (entry["args"] || [])[0]["name"];
      }
      else if(name == "OFFSET"){
        out["offset"] = (entry["args"] || [])[0]["name"];
      }
    }
  };
  return out;
}

function xt_db_system_memory_graph$$check_clause_value(record,key,clause){
  if(key.endsWith("_id")){
    let base_key = key.substring(0,key.length - 3);
    return clause ==     (Object.keys(
          xt_lang_common_data$$get_in(record,["ref_links",base_key]) || {}
        ))[0];
  }
  else{
    return clause == xt_lang_common_data$$get_in(record,["data",key]);
  }
}

function xt_db_system_memory_graph$$check_clause_function(record,link_type,key,pred,exprs){
  if(null == pred){
    return false;
  }
  else if(null == link_type){
    return pred(xt_lang_common_data$$get_in(record,["data",key]),...exprs);
  }
  else if(link_type == "forward"){
    if(pred == xt_db_system_memory_graph$$PULL_CHECK["is_null"]){
      return pred(xt_lang_common_data$$get_in(record,["ref_links",key]));
    }
    else{
      return Object.keys(xt_lang_common_data$$get_in(record,["ref_links",key]) || {}).some(function (v){
        return pred(v,...exprs);
      });
    }
  }
  else if(link_type == "reverse"){
    return Object.keys(xt_lang_common_data$$get_in(record,["rev_links",key]) || {}).some(function (v){
      return pred(v,...exprs);
    });
  }
}

function xt_db_system_memory_graph$$where_clause(rows,schema,table_name,record,where_fn,key,clause){
  let link_type = xt_lang_common_data$$get_in(schema,[table_name,key,"ref","type"]);
  if(Array.isArray(clause)){
    let tag = clause[0];
    let exprs = [...clause];
    exprs.shift();
    return xt_db_system_memory_graph$$check_clause_function(
      record,
      link_type,
      key,
      xt_db_system_memory_graph$$PULL_CHECK[tag],
      exprs
    );
  }
  else if("function" == (typeof clause)){
    return xt_db_system_memory_graph$$check_clause_function(record,link_type,key,clause,[]);
  }
  else if((null != clause) && ("object" == (typeof clause)) && !Array.isArray(clause)){
    let ref = xt_lang_common_data$$get_in(schema,[table_name,key,"ref"]);
    let link_table = ref["ns"];
    let link_map_key = xt_db_system_memory_graph$$LINK_LOOKUP[ref["type"]];
    let ids = Object.keys(
      xt_lang_common_data$$get_in(record,[link_map_key,key]) || {}
    );
    let entries = Object.values(xt_lang_common_data$$obj_pick(rows[link_table] || {},ids));
    let found = entries.filter(function (entry){
      return where_fn(rows,schema,link_table,clause,entry["record"]);
    });
    return 0 < found.length
  }
  else{
    return xt_db_system_memory_graph$$check_clause_value(record,key,clause);
  }
}

function xt_db_system_memory_graph$$where(rows,schema,table_name,where,record){
  let clause_fn = function (pair){
    let [k,clause] = pair;
    return xt_db_system_memory_graph$$where_clause(
      rows,
      schema,
      table_name,
      record,
      xt_db_system_memory_graph$$where,
      k,
      clause
    );
  };
  if("function" == (typeof where)){
    return where(record,table_name);
  }
  else if(xt_lang_common_data$$is_emptyp(where)){
    return true;
  }
  else if(Array.isArray(where)){
    return where.some(function (or_clause){
      return xt_db_system_memory_graph$$where(rows,schema,table_name,or_clause,record);
    });
  }
  else{
    return Object.entries(xt_lang_common_data$$obj_filter(where,function (value){
      return null != value;
    })).every(clause_fn);
  }
}

function xt_db_system_memory_graph$$data_field(record,key){
  if(key.endsWith("_id")){
    let base_key = key.substring(0,key.length - 3);
    return     (Object.keys(
          xt_lang_common_data$$get_in(record,["ref_links",base_key]) || {}
        ))[0];
  }
  else{
    return xt_lang_common_data$$get_in(record,["data",key]);
  }
}

function xt_db_system_memory_graph$$project_record(rows,schema,tree,record,opts,pull_entries_fn){
  let params = xt_lang_common_data$$second(tree);
  let data = params["data"] || [];
  let links = params["links"] || [];
  let out = {};
  for(let key of data){
    out[key] = xt_db_system_memory_graph$$data_field(record,key);
  };
  for(let link of links){
    let link_name = link[0];
    let link_type = xt_lang_common_data$$second(link);
    let child_tree = xt_lang_common_data$$nth(link,2);
    let link_map_key = xt_db_system_memory_graph$$LINK_LOOKUP[link_type];
    let ids = Object.keys(
      xt_lang_common_data$$get_in(record,[link_map_key,link_name]) || {}
    );
    let child_table = child_tree[0];
    let child_entries = Object.values(xt_lang_common_data$$obj_pick(rows[child_table] || {},ids));
    let child_output = pull_entries_fn(rows,schema,child_tree,child_entries,opts);
    out[link_name] = ((Array.isArray(child_output) && (0 < child_output.length)) ? child_output : null);
  };
  return out;
}

function xt_db_system_memory_graph$$apply_custom(out,custom){
  if(null != custom["order_by"]){
    out = xt_lang_common_sort_by$$sort_by(out,custom["order_by"]);
  }
  if(custom["order_sort"] == "desc"){
    out = out.slice().reverse();
  }
  if((null != custom["offset"]) || (null != custom["limit"])){
    let sidx = custom["offset"] || 0;
    let total = out.length;
    let eidx = sidx + (custom["limit"] || (total - sidx));
    eidx = Math.min(eidx,total);
    out = out.slice(sidx,eidx);
  }
  return out;
}

function xt_db_system_memory_graph$$pull_entries(rows,schema,tree,entries,opts){
  let table_name = tree[0];
  let params = xt_lang_common_data$$second(tree);
  let where_clause = params["where"];
  let custom = xt_db_system_memory_graph$$custom_params(params["custom"]);
  let matched = (entries || []).filter(function (entry){
    return xt_db_system_memory_graph$$where(rows,schema,table_name,where_clause,entry["record"]);
  });
  if(custom["count"]){
    return matched.length;
  }
  let out = matched.map(function (entry){
    return xt_db_system_memory_graph$$project_record(
      rows,
      schema,
      tree,
      entry["record"],
      opts,
      xt_db_system_memory_graph$$pull_entries
    );
  });
  return xt_db_system_memory_graph$$apply_custom(out,custom);
}

function xt_db_system_memory_graph$$pull(rows,schema,tree,opts){
  tree = xt_db_text_base_graph$$select_tree(schema,tree,opts);
  let table_name = tree[0];
  let entries = Object.values(rows[table_name] || {});
  return xt_db_system_memory_graph$$pull_entries(rows,schema,tree,entries,opts);
}

function xt_db_system_impl_postgres$$ImplPostgres(client,schema,lookup,listeners,opts,metadata){
  globalThis["xt_lang_common_protocol$$IMPLEMENTATIONS"]["xt.db.system.impl_postgres/ImplPostgres"] = true;
  xt_lang_common_protocol$$register_protocol_impl(xt_db_system_impl_common$$ISourceRemote["on"],"xt.db.system.impl_postgres/ImplPostgres",{
    "pull_async":xt_db_system_impl_postgres$$pull_async,
    "rpc_call_async":xt_db_system_impl_postgres$$rpc_call_async
  });
  xt_lang_common_protocol$$register_protocol_impl(xt_db_system_impl_common$$ISourceListener["on"],"xt.db.system.impl_postgres/ImplPostgres",{
    "add_db_listener":xt_db_system_impl_common$$add_db_listener_default,
    "remove_db_listener":xt_db_system_impl_common$$remove_db_listener_default,
    "get_db_listener":xt_db_system_impl_common$$get_db_listener_default
  });
  xt_lang_common_protocol$$register_protocol_impl(
    xt_db_system_impl_common$$ISourceLifecycle["on"],
    "xt.db.system.impl_postgres/ImplPostgres",
    {"stop_db":xt_db_system_impl_postgres$$stop_db}
  );
  return {
    "::/protocol-impls":{
        [xt_db_system_impl_common$$ISourceRemote["on"]]:{
          "pull_async":xt_db_system_impl_postgres$$pull_async,
          "rpc_call_async":xt_db_system_impl_postgres$$rpc_call_async
        },
        [xt_db_system_impl_common$$ISourceListener["on"]]:{
          "add_db_listener":xt_db_system_impl_common$$add_db_listener_default,
          "remove_db_listener":xt_db_system_impl_common$$remove_db_listener_default,
          "get_db_listener":xt_db_system_impl_common$$get_db_listener_default
        },
        [xt_db_system_impl_common$$ISourceLifecycle["on"]]:{"stop_db":xt_db_system_impl_postgres$$stop_db}
      },
    "schema":schema,
    "lookup":lookup,
    "opts":opts,
    "::":"xt.db.system.impl_postgres/ImplPostgres",
    "metadata":metadata,
    "::/protocols":[
        xt_db_system_impl_common$$ISourceRemote["on"],
        xt_db_system_impl_common$$ISourceListener["on"],
        xt_db_system_impl_common$$ISourceLifecycle["on"]
      ],
    "client":client,
    "listeners":listeners
  };
}

function xt_db_system_impl_postgres$$pull_async(impl,tree){
  let {client,opts,schema} = impl;
  return xt_net_conn_sql$$query_async(client,xt_db_text_sql_graph$$select(schema,tree,opts));
}

function xt_db_system_impl_postgres$$rpc_call_async(impl,rpc_spec,args){
  let {client} = impl;
  return xt_db_text_sql_call$$call_raw(client,rpc_spec,args);
}

function xt_db_system_impl_postgres$$stop_db(impl){
  let {client} = impl;
  xt_net_conn_sql$$disconnect(client);
  return null;
}

function xt_db_system_impl_postgres$$impl_postgres(client,schema,lookup){
  return xt_db_system_impl_postgres$$ImplPostgres(
    client,
    schema,
    lookup,
    {},
    xt_db_text_sql_util$$postgres_opts(lookup),
    {}
  );
}

function xt_db_system_impl_postgres$$impl_postgres_init(impl){
  let {client,lookup,opts,schema} = impl;
  return xt_net_conn_sql$$connect(client).then(function (client){
    return impl;
  });
}

function xt_db_text_sql_raw$$raw_delete(table_name,where_params,opts){
  let table_fn = (null == opts["table_fn"]) ? (function (x){
    return x;
  }) : opts["table_fn"];
  let where_str = (null == where_params) ? "" : xt_db_text_sql_util$$encode_query_string(where_params,"WHERE",opts);
  let out_arr = ["DELETE FROM " + table_fn(table_name)];
  if(0 < where_str.length){
    out_arr.push(where_str);
  }
  return out_arr.join(" ") + ";";
}

function xt_db_text_sql_raw$$raw_insert_array(table_name,columns,values,opts){
  let table_fn = (null == opts["table_fn"]) ? (function (x){
    return x;
  }) : opts["table_fn"];
  let column_fn = (null == opts["column_fn"]) ? (function (x){
    return x;
  }) : opts["column_fn"];
  let out_arr = [
    "INSERT INTO " + table_fn(table_name),
    " (" + columns.map(column_fn).join(", ") + ")"
  ];
  let val_fn = function (data){
    let s_arr = columns.map(function (k){
      return xt_db_text_sql_util$$encode_value(data[k]);
    });
    return "(" + s_arr.join(",") + ")";
  };
  let val_arr = values.map(val_fn);
  let val_str = " VALUES\n " + val_arr.join(",\n ");
  out_arr.push(val_str);
  return out_arr;
}

function xt_db_text_sql_raw$$raw_upsert(table_name,id_column,columns,values,opts){
  let table_fn = (null == opts["table_fn"]) ? (function (x){
    return x;
  }) : opts["table_fn"];
  let column_fn = (null == opts["column_fn"]) ? (function (x){
    return x;
  }) : opts["column_fn"];
  let {upsert_clause} = opts;
  let out_arr = xt_db_text_sql_raw$$raw_insert_array(table_name,columns,values,opts);
  let col_arr = columns.filter(function (col){
    return col != id_column;
  }).map(function (col){
    return column_fn(col) + "=coalesce(\"excluded\"." + column_fn(col) + "," + column_fn(col) + ")";
  });
  return out_arr.join("\n") + "\n" + ("ON CONFLICT (" + column_fn(id_column) + ") DO UPDATE SET\n") + col_arr.join(",\n") + (("string" == (typeof upsert_clause)) ? ("\nWHERE " + upsert_clause) : "") + ";";
}

function xt_db_text_sql_table$$table_filter_id(entry){
  return !((0 == Object.keys(entry["ref_links"]).length) && (1 == Object.keys(entry["data"]).length));
}

function xt_db_text_sql_table$$table_get_data(entry){
  let out = Object.assign({},entry["data"]);
  for(let [link,m] of Object.entries(entry["ref_links"])){
    out[link + "_id"] = xt_lang_common_data$$obj_first_key(m);
  };
  return out;
}

var xt_db_text_sql_table$$table_emit_upsert = function (table_name,cols,out,opts){
  return xt_db_text_sql_raw$$raw_upsert(table_name,"id",cols,out,opts);
};

function xt_db_text_sql_table$$table_emit_flat(emit_fn,schema,lookup,flat,opts){
  let ordered = xt_lang_common_data$$arr_keep(xt_db_text_base_schema$$table_order(lookup),function (col){
    return (null != flat[col]) ? [col,flat[col]] : null;
  });
  let column_fn = (null == opts["column_fn"]) ? (function (x){
    return x;
  }) : opts["column_fn"];
  let emit_pair_fn = function (pair){
    let [table_name,data] = pair;
    let cols = xt_db_text_base_schema$$table_columns(schema,table_name);
    let defaults = xt_db_text_base_schema$$table_defaults(schema,table_name);
    let out = xt_lang_common_data$$arr_keepf(
      Object.values(data),
      xt_db_text_sql_table$$table_filter_id,
      xt_db_text_sql_table$$table_get_data
    );
    let sout = out.map(function (v){
      return Object.assign(Object.assign({},defaults),v);
    });
    let schema_update_value = lookup[table_name];
    let {schema_update} = schema_update_value;
    let {update_key} = opts;
    let sopts = null;
    if(schema_update && (null != update_key)){
      sopts = Object.assign({
        "upsert_clause":"\"excluded\"." + column_fn(update_key) + " < " + column_fn(update_key)
      },opts);
    }
    else{
      sopts = Object.assign({},opts);
    }
    if(0 < sout.length){
      return emit_fn(table_name,cols,sout,sopts);
    }
  };
  return xt_lang_common_data$$arr_keep(ordered,emit_pair_fn);
}

function xt_db_text_sql_table$$prepare_add_input(data,schema,lookup,opts){
  let flat = xt_db_text_base_flatten$$flatten_bulk(schema,data);
  let statements = xt_db_text_sql_table$$table_emit_flat(xt_db_text_sql_table$$table_emit_upsert,schema,lookup,flat,opts);
  return statements.join("\n\n");
}

function xt_db_text_sql_table$$prepare_remove_input(data,schema,lookup,opts){
  let ordered = xt_db_text_base_flatten$$flatten_bulk_ids(schema,lookup,data);
  let statements = xt_lang_common_data$$arr_mapcat(ordered,function (entry){
    let [table_name,ids] = entry;
    return ids.map(function (id){
      return xt_db_text_sql_raw$$raw_delete(table_name,{"id":id},opts);
    });
  });
  return statements.join("\n\n");
}

function xt_db_text_sql_manage$$table_create_column(schema,entry,opts){
  let {column_fn,strict,table_fn,types} = opts;
  let {ident} = entry;
  let itype = entry["type"];
  let iprimary = entry["primary"];
  let irequired = entry["required"];
  let stype = (null != types[itype]) ? types[itype] : itype;
  let default_fn = function (ident){
    return column_fn(ident) + " " + (("ref" == stype) ? "text" : stype) + ((true == iprimary) ? " PRIMARY KEY" : "") + (((true == irequired) && (true == strict)) ? " NOT NULL" : "");
  };
  if((stype == "ref") && (null != schema[entry["ref"]["ns"]])){
    let rtable = entry["ref"]["ns"];
    let rtype = xt_lang_common_data$$get_in(schema,[rtable,"id","type"]);
    if(!("string" == (typeof rtype))){
      return default_fn(ident + "_id");
    }
    else{
      return column_fn(ident + "_id") + " " + ((null != types[rtype]) ? types[rtype] : rtype) + " REFERENCES " + table_fn(rtable);
    }
  }
  else{
    return default_fn(ident);
  }
}

function xt_db_text_sql_manage$$table_create(schema,table_name,opts){
  let table_fn = (null == opts["table_fn"]) ? (function (x){
    return x;
  }) : opts["table_fn"];
  let columns = xt_db_text_base_schema$$table_entries(schema,table_name);
  return "CREATE TABLE IF NOT EXISTS " + table_fn(table_name) + " (\n  " + columns.map(function (e){
    return xt_db_text_sql_manage$$table_create_column(schema,e,opts);
  }).join(",\n  ") + "\n);";
}

function xt_db_text_sql_manage$$table_create_all(schema,lookup,opts){
  let table_list = xt_db_text_base_schema$$table_order(lookup);
  return table_list.map(function (table_name){
    return xt_db_text_sql_manage$$table_create(schema,table_name,opts);
  });
}

function xt_db_text_sql_manage$$table_drop(schema,table_name,opts){
  let table_fn = (null == opts["table_fn"]) ? (function (x){
    return x;
  }) : opts["table_fn"];
  return "DROP TABLE IF EXISTS " + table_fn(table_name) + ";";
}

function xt_db_text_sql_manage$$table_drop_all(schema,lookup,opts){
  let ks = xt_db_text_base_schema$$table_order(lookup).slice().reverse();
  return ks.map(function (table_name){
    return xt_db_text_sql_manage$$table_drop(schema,table_name,opts);
  });
}

function xt_db_system_impl_sqlite$$ImplSqlite(client,schema,lookup,listeners,opts,metadata){
  globalThis["xt_lang_common_protocol$$IMPLEMENTATIONS"]["xt.db.system.impl_sqlite/ImplSqlite"] = true;
  xt_lang_common_protocol$$register_protocol_impl(xt_db_system_impl_common$$ISourceLocal["on"],"xt.db.system.impl_sqlite/ImplSqlite",{
    "clear_db":xt_db_system_impl_sqlite$$clear_db,
    "pull":xt_db_system_impl_sqlite$$pull,
    "record_add":xt_db_system_impl_sqlite$$record_add,
    "record_delete":xt_db_system_impl_sqlite$$record_delete,
    "process_add_event":xt_db_system_impl_sqlite$$process_add_event,
    "process_remove_event":xt_db_system_impl_sqlite$$process_remove_event
  });
  xt_lang_common_protocol$$register_protocol_impl(xt_db_system_impl_common$$ISourceRemote["on"],"xt.db.system.impl_sqlite/ImplSqlite",{
    "pull_async":xt_db_system_impl_sqlite$$pull_async,
    "rpc_call_async":xt_db_system_impl_sqlite$$rpc_call_async
  });
  xt_lang_common_protocol$$register_protocol_impl(xt_db_system_impl_common$$ISourceListener["on"],"xt.db.system.impl_sqlite/ImplSqlite",{
    "add_db_listener":xt_db_system_impl_common$$add_db_listener_default,
    "remove_db_listener":xt_db_system_impl_common$$remove_db_listener_default,
    "get_db_listener":xt_db_system_impl_common$$get_db_listener_default
  });
  return {
    "::/protocol-impls":{
        [xt_db_system_impl_common$$ISourceLocal["on"]]:{
          "clear_db":xt_db_system_impl_sqlite$$clear_db,
          "pull":xt_db_system_impl_sqlite$$pull,
          "record_add":xt_db_system_impl_sqlite$$record_add,
          "record_delete":xt_db_system_impl_sqlite$$record_delete,
          "process_add_event":xt_db_system_impl_sqlite$$process_add_event,
          "process_remove_event":xt_db_system_impl_sqlite$$process_remove_event
        },
        [xt_db_system_impl_common$$ISourceRemote["on"]]:{
          "pull_async":xt_db_system_impl_sqlite$$pull_async,
          "rpc_call_async":xt_db_system_impl_sqlite$$rpc_call_async
        },
        [xt_db_system_impl_common$$ISourceListener["on"]]:{
          "add_db_listener":xt_db_system_impl_common$$add_db_listener_default,
          "remove_db_listener":xt_db_system_impl_common$$remove_db_listener_default,
          "get_db_listener":xt_db_system_impl_common$$get_db_listener_default
        }
      },
    "schema":schema,
    "lookup":lookup,
    "opts":opts,
    "::":"xt.db.system.impl_sqlite/ImplSqlite",
    "metadata":metadata,
    "::/protocols":[
        xt_db_system_impl_common$$ISourceLocal["on"],
        xt_db_system_impl_common$$ISourceRemote["on"],
        xt_db_system_impl_common$$ISourceListener["on"]
      ],
    "client":client,
    "listeners":listeners
  };
}

function xt_db_system_impl_sqlite$$pull(impl,tree){
  let {client,opts,schema} = impl;
  return xt_net_conn_sql$$query(client,xt_db_text_sql_graph$$select(schema,tree,opts));
}

function xt_db_system_impl_sqlite$$pull_async(impl,tree){
  return Promise.resolve().then(function (){
    return xt_db_system_impl_sqlite$$pull(impl,tree);
  });
}

function xt_db_system_impl_sqlite$$record_add(impl,table_name,records){
  let {client,lookup,opts,schema} = impl;
  let input = xt_db_text_sql_table$$prepare_add_input({[table_name]:records},schema,lookup,opts);
  if("" == input){
    return null;
  }
  return xt_net_conn_sql$$query(client,input);
}

function xt_db_system_impl_sqlite$$record_delete(impl,table_name,ids){
  let {client,opts} = impl;
  let statements = ids.map(function (id){
    return xt_db_text_sql_raw$$raw_delete(table_name,{"id":id},opts);
  });
  return xt_net_conn_sql$$query(client,statements.join("\n\n"));
}

function xt_db_system_impl_sqlite$$process_add_event(impl,data){
  let {client,lookup,opts,schema} = impl;
  let flat = xt_db_text_base_flatten$$flatten_bulk(schema,data);
  xt_net_conn_sql$$query(
    client,
    xt_db_text_sql_table$$prepare_add_input(data,schema,lookup,opts)
  );
  return xt_lang_common_data$$arr_keep(xt_db_text_base_schema$$table_order(lookup),function (table_name){
    return (null != flat[table_name]) ? table_name : null;
  });
}

function xt_db_system_impl_sqlite$$process_remove_event(impl,data){
  let {client,lookup,opts,schema} = impl;
  let ordered = xt_db_text_base_flatten$$flatten_bulk_ids(schema,lookup,data);
  xt_net_conn_sql$$query(
    client,
    xt_db_text_sql_table$$prepare_remove_input(data,schema,lookup,opts)
  );
  return ordered.map(function (arr){
    return arr[0];
  });
}

function xt_db_system_impl_sqlite$$clear_db(impl){
  let {client,lookup,opts,schema} = impl;
  xt_net_conn_sql$$query(
    client,
    xt_db_text_sql_manage$$table_drop_all(schema,lookup,opts).join("\n\n")
  );
  xt_net_conn_sql$$query(
    client,
    xt_db_text_sql_manage$$table_create_all(schema,lookup,opts).join("\n\n")
  );
  return impl;
}

function xt_db_system_impl_sqlite$$rpc_call_async(_impl,_rpc_spec,_args){
  throw "ImplSqlite does not support rpc_call_async";
}

function xt_db_system_impl_sqlite$$impl_sqlite(client,schema,lookup){
  return xt_db_system_impl_sqlite$$ImplSqlite(client,schema,lookup,{},{
    "return_join_fn":function (arr){
        return "json_group_array(json_object(" + arr.join(", ") + "))";
      },
    "strict":false,
    "wrapper_fn":function (s,indent){
        return (indent < 2) ? s : ("(\n" + xt_lang_common_string$$pad_lines(s,2," ") + ")");
      },
    "querystr_fn":xt_db_text_sql_util$$encode_query_string,
    "types":xt_db_text_sql_util$$SQLITE,
    "operators":{"ilike":"LIKE"},
    "values":{"cast":false,"replace":xt_db_text_sql_util$$SQLITE_FN},
    "return_link_fn":function (s,link_name){
        return "'" + link_name + "', " + s;
      },
    "return_format_fn":function (input,nest_fn,column_fn,opts){
        if((null != input) && ("object" == (typeof input)) && !Array.isArray(input)){
          return "'" + input["as"] + "', " + input["expr"];
        }
        else if(Array.isArray(input)){
          return nest_fn(input);
        }
        else if("string" == (typeof input)){
          return "'" + input + "', " + column_fn(input);
        }
        else{
          throw "Invalid input - " + String(input);
        }
      },
    "coerce":{
        "boolean":function (v){
            if("number" == (typeof v)){
              return 1 == v;
            }
            return v;
          },
        "jsonb":function (expr){
            return JSON.parse(expr);
          },
        "map":function (expr){
            return JSON.parse(expr);
          },
        "array":function (expr){
            return JSON.parse(expr);
          }
      },
    "return_count_fn":function (){
        return "json_array(json_object('count',count" + "(*)))";
      },
    "column_fn":xt_db_text_sql_util$$default_quote_fn,
    "table_fn":xt_db_text_sql_util$$default_quote_fn
  },{});
}

function xt_db_system_impl_sqlite$$impl_sqlite_init(impl){
  let {client,lookup,opts,schema} = impl;
  let sql = xt_db_text_sql_manage$$table_create_all(schema,lookup,opts).join("\n\n");
  return xt_net_conn_sql$$connect(client,{}).then(function (client){
    if(0 < sql.length){
      xt_net_conn_sql$$query(client,sql);
    }
    return impl;
  });
}

function js_net_ws_native$$WebsocketClient(raw,defaults,state){
  globalThis["xt_lang_common_protocol$$IMPLEMENTATIONS"]["js.net.ws_native/WebsocketClient"] = true;
  xt_lang_common_protocol$$register_protocol_impl(xt_net_ws_native$$IWebsocket["on"],"js.net.ws_native/WebsocketClient",{
    "connect":js_net_ws_native$$connect_ws,
    "disconnect":js_net_ws_native$$disconnect_ws,
    "send":js_net_ws_native$$send_ws,
    "add_listeners":js_net_ws_native$$add_listeners_ws
  });
  xt_lang_common_protocol$$register_protocol_impl(xt_net_ws_native$$IWebsocketHeartbeat["on"],"js.net.ws_native/WebsocketClient",{
    "start_heartbeat":js_net_ws_native$$start_heartbeat_ws,
    "stop_heartbeat":js_net_ws_native$$stop_heartbeat_ws
  });
  return {
    "::":"js.net.ws_native/WebsocketClient",
    "::/protocols":[
        xt_net_ws_native$$IWebsocket["on"],
        xt_net_ws_native$$IWebsocketHeartbeat["on"]
      ],
    "::/protocol-impls":{
        [xt_net_ws_native$$IWebsocket["on"]]:{
          "connect":js_net_ws_native$$connect_ws,
          "disconnect":js_net_ws_native$$disconnect_ws,
          "send":js_net_ws_native$$send_ws,
          "add_listeners":js_net_ws_native$$add_listeners_ws
        },
        [xt_net_ws_native$$IWebsocketHeartbeat["on"]]:{
          "start_heartbeat":js_net_ws_native$$start_heartbeat_ws,
          "stop_heartbeat":js_net_ws_native$$stop_heartbeat_ws
        }
      },
    "raw":raw,
    "defaults":defaults,
    "state":state
  };
}

function js_net_ws_native$$connect_ws(client,opts){
  let url = xt_net_ws_native$$prepare_url(client,opts || {});
  let raw = new WebSocket(url);
  client["raw"] = raw;
  return new Promise(function (resolve,reject){
    let cleanup_fn = function (){
      raw.removeEventListener("open",on_open);
      raw.removeEventListener("error",on_error);
      raw.removeEventListener("close",on_close);
    };
    let on_open = function (event){
      cleanup_fn();
      resolve(client);
    };
    let on_error = function (event){
      cleanup_fn();
      reject(event);
    };
    let on_close = function (event){
      cleanup_fn();
      reject(event);
    };
    raw.addEventListener("open",on_open);
    raw.addEventListener("error",on_error);
    raw.addEventListener("close",on_close);
  });
}

function js_net_ws_native$$disconnect_ws(client){
  let {raw} = client;
  if(raw){
    raw.close(1000,"done");
  }
  client["raw"] = null;
  return client;
}

function js_net_ws_native$$send_ws(client,input){
  let {raw} = client;
  if(raw){
    return raw.send(input);
  }
}

function js_net_ws_native$$add_listeners_ws(client,m){
  let {raw} = client;
  if(raw){
    for(let [k,handler] of Object.entries(m)){
      raw.addEventListener(k,handler);
    };
    return Object.keys(m);
  }
}

function js_net_ws_native$$default_heartbeat_fn(client,name){
  return xt_net_ws_native$$send(client,"heartbeat");
}

function js_net_ws_native$$start_heartbeat_ws(client,name,f,interval){
  let {defaults,state} = client;
  let heartbeats = state["heartbeats"] || {};
  let stop_fn = heartbeats[name];
  if("function" == (typeof stop_fn)){
    stop_fn();
  }
  f = (f || defaults["heartbeat_fn"] || js_net_ws_native$$default_heartbeat_fn);
  interval = (interval || defaults["heartbeat_interval"] || 30000);
  let timer = setInterval(function (){
    f(client,name);
  },interval);
  heartbeats[name] = (function (){
    clearInterval(timer);
    delete(heartbeats[name]);
    return true;
  });
  state["heartbeats"] = heartbeats;
  return timer;
}

function js_net_ws_native$$stop_heartbeat_ws(client,name){
  let {state} = client;
  let heartbeats = state["heartbeats"] || {};
  let stop_fn = heartbeats[name];
  if("function" == (typeof stop_fn)){
    stop_fn();
  }
  return client;
}

function js_net_ws_native$$create(defaults){
  return js_net_ws_native$$WebsocketClient(null,defaults,{"heartbeats":{},"callbacks":{}});
}

function xt_db_system_impl_memory$$ImplMemory(rows,schema,lookup,listeners,metadata){
  globalThis["xt_lang_common_protocol$$IMPLEMENTATIONS"]["xt.db.system.impl_memory/ImplMemory"] = true;
  xt_lang_common_protocol$$register_protocol_impl(xt_db_system_impl_common$$ISourceLocal["on"],"xt.db.system.impl_memory/ImplMemory",{
    "clear_db":xt_db_system_impl_memory$$clear_db,
    "pull":xt_db_system_impl_memory$$pull,
    "record_add":xt_db_system_impl_memory$$record_add,
    "record_delete":xt_db_system_impl_memory$$record_delete,
    "process_add_event":xt_db_system_impl_memory$$process_add_event,
    "process_remove_event":xt_db_system_impl_memory$$process_remove_event
  });
  xt_lang_common_protocol$$register_protocol_impl(xt_db_system_impl_common$$ISourceRemote["on"],"xt.db.system.impl_memory/ImplMemory",{
    "pull_async":xt_db_system_impl_memory$$pull_async,
    "rpc_call_async":xt_db_system_impl_memory$$rpc_call_async
  });
  xt_lang_common_protocol$$register_protocol_impl(xt_db_system_impl_common$$ISourceListener["on"],"xt.db.system.impl_memory/ImplMemory",{
    "add_db_listener":xt_db_system_impl_common$$add_db_listener_default,
    "remove_db_listener":xt_db_system_impl_common$$remove_db_listener_default,
    "get_db_listener":xt_db_system_impl_common$$get_db_listener_default
  });
  return {
    "::":"xt.db.system.impl_memory/ImplMemory",
    "::/protocols":[
        xt_db_system_impl_common$$ISourceLocal["on"],
        xt_db_system_impl_common$$ISourceRemote["on"],
        xt_db_system_impl_common$$ISourceListener["on"]
      ],
    "::/protocol-impls":{
        [xt_db_system_impl_common$$ISourceLocal["on"]]:{
          "clear_db":xt_db_system_impl_memory$$clear_db,
          "pull":xt_db_system_impl_memory$$pull,
          "record_add":xt_db_system_impl_memory$$record_add,
          "record_delete":xt_db_system_impl_memory$$record_delete,
          "process_add_event":xt_db_system_impl_memory$$process_add_event,
          "process_remove_event":xt_db_system_impl_memory$$process_remove_event
        },
        [xt_db_system_impl_common$$ISourceRemote["on"]]:{
          "pull_async":xt_db_system_impl_memory$$pull_async,
          "rpc_call_async":xt_db_system_impl_memory$$rpc_call_async
        },
        [xt_db_system_impl_common$$ISourceListener["on"]]:{
          "add_db_listener":xt_db_system_impl_common$$add_db_listener_default,
          "remove_db_listener":xt_db_system_impl_common$$remove_db_listener_default,
          "get_db_listener":xt_db_system_impl_common$$get_db_listener_default
        }
      },
    "rows":rows,
    "schema":schema,
    "lookup":lookup,
    "listeners":listeners,
    "metadata":metadata
  };
}

function xt_db_system_impl_memory$$pull(impl,tree){
  let {opts,rows,schema} = impl;
  return xt_db_system_memory_graph$$pull(rows,schema,tree,opts);
}

function xt_db_system_impl_memory$$pull_async(impl,tree){
  return Promise.resolve().then(function (){
    return xt_db_system_impl_memory$$pull(impl,tree);
  });
}

function xt_db_system_impl_memory$$record_add(impl,table_name,records){
  let {opts,rows,schema} = impl;
  return xt_db_system_memory_util$$add_bulk(rows,schema,{[table_name]:records});
}

function xt_db_system_impl_memory$$record_delete(impl,table_name,ids){
  let {opts,rows,schema} = impl;
  return xt_db_system_memory_util$$remove_bulk(rows,schema,table_name,ids);
}

function xt_db_system_impl_memory$$process_add_event(impl,data){
  let {rows,schema} = impl;
  return xt_db_system_memory_util$$add_bulk(rows,schema,data);
}

function xt_db_system_impl_memory$$process_remove_event(impl,data){
  let {lookup,rows,schema} = impl;
  let ordered = xt_db_text_base_flatten$$flatten_bulk_ids(schema,lookup,data);
  for(let entry of ordered){
    let [table_name,ids] = entry;
    xt_db_system_memory_util$$remove_bulk(rows,schema,table_name,ids);
  };
  return ordered.map(function (arr){
    return arr[0];
  });
}

function xt_db_system_impl_memory$$clear_db(impl){
  let {rows} = impl;
  for(let table_key of Object.keys(rows)){
    delete(rows[table_key]);
  };
  return null;
}

function xt_db_system_impl_memory$$rpc_call_async(_impl,_rpc_spec,_args){
  throw "db.impl.memory does not support rpc_call_async";
}

function xt_db_system_impl_memory$$impl_memory(schema,lookup){
  return xt_db_system_impl_memory$$ImplMemory({},schema,lookup,{},{});
}

function xt_db_system_impl_supabase_realtime$$prepare_connect_url(impl,params){
  let {client} = impl;
  let {defaults} = client;
  let path = "/realtime/v1/websocket" + "?" + xt_net_http_util$$encode_query_params(
    Object.assign({"vsn":"1.0.0","apikey":defaults["apikey"]},params)
  );
  return xt_net_ws_native$$prepare_url(client,{"path":path});
}

function xt_db_system_impl_supabase_realtime$$get_auth_token(impl){
  return xt_lang_common_data$$get_in(impl,["state","session","access_token"]) || xt_lang_common_data$$get_in(impl,["client","defaults","token"]) || xt_lang_common_data$$get_in(impl,["client","defaults","apikey"]);
}

function xt_db_system_impl_supabase_realtime$$topic_join_payload(impl,topic){
  let auth_token = xt_db_system_impl_supabase_realtime$$get_auth_token(impl);
  let payload = {
    "config":{"broadcast":{"ack":false,"self":false},"private":true}
  };
  if(null != auth_token){
    payload["access_token"] = auth_token;
  }
  return xt_net_ws_phoenix$$make_frame_join(payload,{"topic":topic,"ref":"#/join/" + topic});
}

function xt_db_system_impl_supabase_realtime$$topic_leave_payload(impl,topic){
  return xt_net_ws_phoenix$$make_frame_leave({"topic":topic,"ref":"#/leave/" + topic});
}

function xt_db_system_impl_supabase_realtime$$create_realtime_on_message(realtime_client){
  return xt_net_ws_phoenix$$wrap_phoenix({
    "broadcast":function (frame){
        let envelope = frame["payload"];
        let {event} = envelope;
        if(("xt.db/event" == event) || ("db/sync" == event) || ("db/remove" == event)){
          let {payload} = envelope;
          let {topic} = frame;
          let callbacks = xt_lang_common_data$$get_in(realtime_client,["state","callbacks"]);
          for(let [_id,callback] of Object.entries(callbacks)){
            callback(Object.assign({"topic":topic},payload));
          };
        }
      },
    "phx_reply":function (frame){
        let {topic} = frame;
        let entry = xt_lang_common_data$$get_in(realtime_client,["state","topics",topic]);
        if((null != entry) && ("object" == (typeof entry)) && !Array.isArray(entry)){
          let status = xt_lang_common_data$$get_in(frame,["payload","status"]);
          let ok = status == "ok";
          let {deferred} = entry;
          let {resolve} = deferred;
          xt_lang_common_data$$set_in(realtime_client,["state","topics",topic,"ready"],ok);
          if("function" == (typeof resolve)){
            resolve(ok);
          }
        }
      }
  });
}

function xt_db_system_impl_supabase_realtime$$create_realtime(impl,conn_id){
  let realtime_client = xt_db_system_impl_supabase_ws$$create_ws_client(impl,{"id":conn_id});
  xt_lang_common_data$$set_in(realtime_client,["state","callbacks"],{});
  xt_lang_common_data$$set_in(realtime_client,["state","topics"],{});
  let ws_url = xt_db_system_impl_supabase_realtime$$prepare_connect_url(impl,{});
  let init = xt_net_ws_native$$connect(realtime_client,{"url":ws_url});
  xt_lang_common_data$$set_in(realtime_client,["state","init"],init);
  xt_net_ws_native$$add_listeners(realtime_client,{
    "open":function (raw){
        xt_net_ws_phoenix$$start_heartbeat(realtime_client);
      },
    "message":xt_db_system_impl_supabase_realtime$$create_realtime_on_message(realtime_client)
  });
  return realtime_client;
}

function xt_db_system_impl_supabase_realtime$$get_realtime(impl,conn_id){
  return xt_lang_common_data$$get_in(impl,["state","realtimes",conn_id]);
}

function xt_db_system_impl_supabase_realtime$$set_realtime(impl,conn_id,client){
  xt_lang_common_data$$set_in(impl,["state","realtimes",conn_id],client);
  return client;
}

function xt_db_system_impl_supabase_realtime$$ensure_realtime(impl,conn_id){
  let client = xt_db_system_impl_supabase_realtime$$get_realtime(impl,conn_id);
  if(null != client){
    return client;
  }
  client = xt_db_system_impl_supabase_realtime$$create_realtime(impl,conn_id);
  xt_db_system_impl_supabase_realtime$$set_realtime(impl,conn_id,client);
  return client;
}

function xt_db_system_impl_supabase_realtime$$add_realtime_callback(impl,conn_id,callback_id,handler){
  let client = xt_db_system_impl_supabase_realtime$$ensure_realtime(impl,conn_id);
  let callbacks = xt_lang_common_data$$get_in(client,["state","callbacks"]);
  if(null == callbacks){
    callbacks = {};
    xt_lang_common_data$$set_in(client,["state","callbacks"],callbacks);
  }
  callbacks[callback_id] = handler;
  return handler;
}

function xt_db_system_impl_supabase_realtime$$create_sync_callback(impl){
  return function (event){
    let caching_fn = xt_lang_common_data$$get_in(impl,["metadata","caching_fn"]) || xt_lang_common_data$$get_in(impl,["state","caching_fn"]);
    if("function" == (typeof caching_fn)){
      let caching_impl = caching_fn();
      if((null != caching_impl) && ((null != event["db/sync"]) || (null != event["db/remove"]))){
        let payload = Object.assign({},event);
        delete(payload["topic"]);
        xt_db_system_impl_common$$sync_process_payload(caching_impl,payload);
      }
    }
  };
}

function xt_db_system_impl_supabase_realtime$$subscribe(impl,conn_id,topics){
  let client = xt_db_system_impl_supabase_realtime$$ensure_realtime(impl,conn_id);
  xt_db_system_impl_supabase_realtime$$add_realtime_callback(
    impl,
    conn_id,
    "db-sync",
    xt_db_system_impl_supabase_realtime$$create_sync_callback(impl)
  );
  for(let topic of topics){
    let join_ref = "#/join/" + topic;
    let deferred = {"resolve":null,"reject":null};
    let init = new Promise(function (resolve,reject){
      (function (resolve,reject){
        deferred["resolve"] = resolve;
        deferred["reject"] = reject;
      })(resolve,reject);
    });
    xt_lang_common_data$$set_in(client,["state","topics",topic],{
      "init":init,
      "join_ref":join_ref,
      "deferred":deferred,
      "ready":false
    });
  };
  return xt_lang_common_data$$get_in(client,["state","init"]).then(function (_){
    let out = [];
    let chain = Promise.resolve().then(function (){
      return null;
    });
    for(let topic of topics){
      chain = chain.then(function (_){
        xt_net_ws_phoenix$$send_frame(
          client,
          xt_db_system_impl_supabase_realtime$$topic_join_payload(impl,topic)
        );
        return xt_lang_common_data$$get_in(client,["state","topics",topic,"init"]).then(function (ready){
          out.push(ready);
          return null;
        });
      });
    };
    return chain.then(function (_){
      return out;
    });
  });
}

function xt_db_system_impl_supabase_realtime$$unsubscribe(impl,conn_id,topics){
  return Promise.resolve().then(function (){
    let client = xt_db_system_impl_supabase_realtime$$get_realtime(impl,conn_id);
    if(null != client){
      for(let topic of topics){
        let entry = xt_lang_common_data$$get_in(client,["state","topics",topic]);
        if(null != entry){
          xt_net_ws_phoenix$$send_frame(
            client,
            xt_db_system_impl_supabase_realtime$$topic_leave_payload(impl,topic)
          );
          delete(
            xt_lang_common_data$$get_in(client,["state","topics"])[topic]
          );
        }
      };
    }
    return true;
  });
}

function js_net_conn_sqlite$$SqliteClient(defaults,raw){
  globalThis["xt_lang_common_protocol$$IMPLEMENTATIONS"]["js.net.conn_sqlite/SqliteClient"] = true;
  xt_lang_common_protocol$$register_protocol_impl(xt_net_conn_sql$$ISqlClient["on"],"js.net.conn_sqlite/SqliteClient",{
    "connect":js_net_conn_sqlite$$client_connect,
    "disconnect":js_net_conn_sqlite$$client_disconnect,
    "query":js_net_conn_sqlite$$client_query,
    "query_async":js_net_conn_sqlite$$client_query_async
  });
  return {
    "::":"js.net.conn_sqlite/SqliteClient",
    "::/protocols":[xt_net_conn_sql$$ISqlClient["on"]],
    "::/protocol-impls":{
        [xt_net_conn_sql$$ISqlClient["on"]]:{
          "connect":js_net_conn_sqlite$$client_connect,
          "disconnect":js_net_conn_sqlite$$client_disconnect,
          "query":js_net_conn_sqlite$$client_query,
          "query_async":js_net_conn_sqlite$$client_query_async
        }
      },
    "defaults":defaults,
    "raw":raw
  };
}

function js_net_conn_sqlite$$decode_json_scalar(value){
  if(("string" == (typeof value)) && (value.startsWith("[") || value.startsWith("{") || (value == "true") || (value == "false") || (value == "null"))){
    return JSON.parse(value);
  }
  else{
    return value;
  }
}

function js_net_conn_sqlite$$raw_query(db,query){
  let columns = [];
  let values = db.exec({
    "sql":query,
    "rowMode":"array",
    "columnNames":columns,
    "returnValue":"resultRows"
  });
  if((1 == values.length) && (1 == values[0].length)){
    return js_net_conn_sqlite$$decode_json_scalar(values[0][0]);
  }
  return columns.length ? [{"columns":columns,"values":values}] : values;
}

function js_net_conn_sqlite$$raw_init(sqlite3,opts){
  let config = opts || {};
  let filename = config["filename"] || ":memory:";
  let flags = config["flags"] || "c";
  let conn = new sqlite3["oo1"]["DB"](filename,flags);
  return conn;
}

function js_net_conn_sqlite$$client_connect(client,opts){
  let {defaults} = client;
  let init_module = sqlite3InitModule["default"] || sqlite3InitModule;
  return init_module().then(function (sqlite3){
    return js_net_conn_sqlite$$raw_init(sqlite3,Object.assign(Object.assign({},defaults),opts));
  }).then(function (raw){
    client["raw"] = raw;
    return client;
  });
}

function js_net_conn_sqlite$$client_disconnect(client){
  let {raw} = client;
  raw.close();
  return true;
}

function js_net_conn_sqlite$$client_query(client,query){
  let {raw} = client;
  return js_net_conn_sqlite$$raw_query(raw,query);
}

function js_net_conn_sqlite$$client_query_async(client,query){
  let {raw} = client;
  return Promise.resolve().then(function (){
    return js_net_conn_sqlite$$raw_query(raw,query);
  });
}

function js_net_conn_sqlite$$create(defaults){
  return js_net_conn_sqlite$$SqliteClient(defaults,null);
}

function xt_db_system_main_client$$create_client(type,defaults){
  if(type == "sqlite"){
    return js_net_conn_sqlite$$create(defaults);
  }
  else if(type == "postgres"){
    return js_net_conn_postgres$$create(defaults);
  }
  else if(type == "supabase"){
    let client = js_net_http_fetch$$create(defaults,xt_net_addon_supabase$$middleware_supabase());
    client["create_ws_client"] = js_net_ws_native$$create;
    return client;
  }
  else{
    return null;
  }
}

function xt_db_system_impl_supabase$$ImplSupabase(client,schema,lookup,state,listeners,opts,metadata){
  globalThis["xt_lang_common_protocol$$IMPLEMENTATIONS"]["xt.db.system.impl_supabase/ImplSupabase"] = true;
  xt_lang_common_protocol$$register_protocol_impl(xt_db_system_impl_common$$ISourceRemote["on"],"xt.db.system.impl_supabase/ImplSupabase",{
    "pull_async":xt_db_system_impl_supabase$$pull_async,
    "rpc_call_async":xt_db_system_impl_supabase$$rpc_call_async
  });
  xt_lang_common_protocol$$register_protocol_impl(xt_db_system_impl_common$$ISourceListener["on"],"xt.db.system.impl_supabase/ImplSupabase",{
    "add_db_listener":xt_db_system_impl_common$$add_db_listener_default,
    "remove_db_listener":xt_db_system_impl_common$$remove_db_listener_default,
    "get_db_listener":xt_db_system_impl_common$$get_db_listener_default
  });
  xt_lang_common_protocol$$register_protocol_impl(xt_db_system_impl_common$$ISourceRealtime["on"],"xt.db.system.impl_supabase/ImplSupabase",{
    "subscribe_db":xt_db_system_impl_supabase_realtime$$subscribe,
    "unsubscribe_db":xt_db_system_impl_supabase_realtime$$unsubscribe
  });
  xt_lang_common_protocol$$register_protocol_impl(xt_db_system_impl_supabase_ws$$ISupabaseWebsocketFactory["on"],"xt.db.system.impl_supabase/ImplSupabase",{
    "create_ws_client":xt_db_system_impl_supabase$$create_ws_client
  });
  return {
    "::/protocol-impls":{
        [xt_db_system_impl_common$$ISourceRemote["on"]]:{
          "pull_async":xt_db_system_impl_supabase$$pull_async,
          "rpc_call_async":xt_db_system_impl_supabase$$rpc_call_async
        },
        [xt_db_system_impl_common$$ISourceListener["on"]]:{
          "add_db_listener":xt_db_system_impl_common$$add_db_listener_default,
          "remove_db_listener":xt_db_system_impl_common$$remove_db_listener_default,
          "get_db_listener":xt_db_system_impl_common$$get_db_listener_default
        },
        [xt_db_system_impl_common$$ISourceRealtime["on"]]:{
          "subscribe_db":xt_db_system_impl_supabase_realtime$$subscribe,
          "unsubscribe_db":xt_db_system_impl_supabase_realtime$$unsubscribe
        },
        [xt_db_system_impl_supabase_ws$$ISupabaseWebsocketFactory["on"]]:{
          "create_ws_client":xt_db_system_impl_supabase$$create_ws_client
        }
      },
    "schema":schema,
    "lookup":lookup,
    "opts":opts,
    "::":"xt.db.system.impl_supabase/ImplSupabase",
    "metadata":metadata,
    "::/protocols":[
        xt_db_system_impl_common$$ISourceRemote["on"],
        xt_db_system_impl_common$$ISourceListener["on"],
        xt_db_system_impl_common$$ISourceRealtime["on"],
        xt_db_system_impl_supabase_ws$$ISupabaseWebsocketFactory["on"]
      ],
    "state":state,
    "client":client,
    "listeners":listeners
  };
}

function xt_db_system_impl_supabase$$cmd_pull_async(impl,tree){
  let {client,lookup,opts,schema} = impl;
  let request = xt_db_text_pgrest_graph$$select(schema,tree,opts);
  let table_name = tree[0];
  let schema_name = lookup[table_name]["schema"];
  let headers = Object.assign(
    Object.assign({},request["headers"]),
    schema_name ? {"Accept-Profile":schema_name,"Content-Profile":schema_name} : null
  );
  return Object.assign({"path":request["url"],"method":"GET"},{"headers":headers});
}

function xt_db_system_impl_supabase$$pull_async(impl,tree){
  let {client} = impl;
  let input = xt_db_system_impl_supabase$$cmd_pull_async(impl,tree);
  return xt_net_http_fetch$$request_http(client,input).then(xt_net_http_util$$get_body_data);
}

function xt_db_system_impl_supabase$$cmd_rpc_call_async(impl,rpc_spec,args,opts){
  let input_spec = rpc_spec["input"] || [];
  let body = {};
  opts = (opts || {});
  for(let i = 0; i < input_spec.length; ++i){
    let input = input_spec[i];
    let key = input["symbol"] || input["name"] || null;
    if(null != key){
      body[key] = args[i];
    }
  };
  let {schema} = rpc_spec;
  let headers = Object.assign({},opts["headers"]);
  if(null != schema){
    headers["Content-Profile"] = schema;
    headers["Accept-Profile"] = schema;
  }
  return xt_net_addon_supabase$$cmd_rpc_call(
    rpc_spec["id"],
    body,
    Object.assign(Object.assign({},opts),{"headers":headers})
  );
}

function xt_db_system_impl_supabase$$rpc_call_async(impl,rpc_spec,args,opts){
  let {client} = impl;
  let input = xt_db_system_impl_supabase$$cmd_rpc_call_async(impl,rpc_spec,args,opts);
  return xt_net_http_fetch$$request_http(client,input).then(xt_net_http_util$$get_body_data);
}

function xt_db_system_impl_supabase$$create_ws_client(impl,defaults){
  let create_fn = xt_lang_common_data$$get_in(impl,["client","create_ws_client"]);
  if(null == create_fn){
    throw "Supabase websocket client factory is not configured";
  }
  return create_fn(defaults);
}

function xt_db_system_impl_supabase$$impl_supabase(client,schema,lookup){
  let impl = xt_db_system_impl_supabase$$ImplSupabase(
    client,
    schema,
    lookup,
    {"session":null,"auto_refresh":null,"realtimes":{}},
    {},
    {},
    {}
  );
  impl["::/override"] = {
    "create_ws_client":xt_db_system_impl_supabase$$create_ws_client
  };
  return impl;
}

function xt_db_system_main$$create_impl(type,defaults,schema,lookup){
  let client = xt_db_system_main_client$$create_client(type,defaults);
  if(type == "memory"){
    return xt_db_system_impl_memory$$impl_memory(schema,lookup);
  }
  else if(type == "sqlite"){
    return xt_db_system_impl_sqlite$$impl_sqlite(client,schema,lookup);
  }
  else if(type == "postgres"){
    return xt_db_system_impl_postgres$$impl_postgres(client,schema,lookup);
  }
  else if(type == "supabase"){
    return xt_db_system_impl_supabase$$impl_supabase(client,schema,lookup);
  }
}

function xt_db_system_main$$create_impl_init(impl){
  let {lookup,schema} = impl;
  let type = impl["::"];
  if(type == "xt.db.system.impl_sqlite/ImplSqlite"){
    return xt_db_system_impl_sqlite$$impl_sqlite_init(impl);
  }
  else if(type == "xt.db.system.impl_postgres/ImplPostgres"){
    return xt_db_system_impl_postgres$$impl_postgres_init(impl);
  }
  else{
    return Promise.resolve().then(function (){
      return impl;
    });
  }
}

function xt_db_node_kernel_supabase$$supabase_rpc_error_detail(body){
  let detail = body["details"] || body["detail"];
  if("string" == (typeof detail)){
    try{
      return JSON.parse(detail);
    }
    catch(err){
      return detail;
    }
  }
  else{
    return detail;
  }
}

function xt_db_node_kernel_supabase$$supabase_error_data(response){
  let {body,status} = response;
  let detail = xt_db_node_kernel_supabase$$supabase_rpc_error_detail(body);
  let data = body;
  if(((null != detail) && ("object" == (typeof detail)) && !Array.isArray(detail)) && ("gw.rpc.error" == detail["type"])){
    data = detail;
  }
  if((null != data) && ("object" == (typeof data)) && !Array.isArray(data)){
    data["status"] = status;
    if(null == data["http_status"]){
      data["http_status"] = status;
    }
  }
  return data;
}

function xt_db_node_kernel_supabase$$supabase_response_data(response){
  let {body,status} = response;
  if(status && (status >= 400)){
    let data = xt_db_node_kernel_supabase$$supabase_error_data(response);
    throw Object.assign(new Error(
      data["message"] || data["msg"] || data["error_description"] || data["error"] || body["message"] || body["msg"] || body["error_description"] || body["error"] || "Supabase request failed"
    ),{"data":data});
  }
  return xt_net_http_util$$get_body_data(response);
}

function xt_db_node_kernel_supabase$$supabase_request(node,service_id,cmd){
  return Promise.resolve().then(function (){
    return xt_substrate$$get_service(node,service_id);
  }).then(function (impl){
    let {client} = impl;
    return xt_net_http_fetch$$request_http(client,cmd).then(xt_db_node_kernel_supabase$$supabase_response_data);
  });
}

function xt_db_node_kernel_supabase$$supabase_sign_up_handler(space,args,request,node){
  let service_id = args[0];
  let credentials = args[1];
  let opts = args[2] || {};
  return Promise.resolve().then(function (){
    return xt_substrate$$get_service(node,service_id);
  }).then(function (impl){
    let {client} = impl;
    return xt_net_http_fetch$$request_http(client,xt_net_addon_supabase$$cmd_signup(credentials,opts)).then(xt_db_node_kernel_supabase$$supabase_response_data).then(function (session){
      xt_db_system_impl_supabase_session$$set_session(impl,session);
      xt_db_system_impl_supabase_session$$auto_refresh_start(impl);
      return session;
    });
  });
}

function xt_db_node_kernel_supabase$$supabase_sign_in_handler(space,args,request,node){
  let service_id = args[0];
  let credentials = args[1];
  let opts = args[2] || {};
  return Promise.resolve().then(function (){
    return xt_substrate$$get_service(node,service_id);
  }).then(function (impl){
    let {client} = impl;
    return xt_net_http_fetch$$request_http(
      client,
      xt_net_addon_supabase$$cmd_token_password(credentials,opts)
    ).then(xt_db_node_kernel_supabase$$supabase_response_data).then(function (session){
      xt_db_system_impl_supabase_session$$set_session(impl,session);
      xt_db_system_impl_supabase_session$$auto_refresh_start(impl);
      return session;
    });
  });
}

function xt_db_node_kernel_supabase$$supabase_sign_out_handler(space,args,request,node){
  let service_id = args[0];
  let opts = args[1] || {};
  return Promise.resolve().then(function (){
    return xt_substrate$$get_service(node,service_id);
  }).then(function (impl){
    xt_db_system_impl_supabase_session$$auto_refresh_stop(impl);
    let {client} = impl;
    return xt_net_http_fetch$$request_http(client,xt_net_addon_supabase$$cmd_logout(opts)).then(function (_){
      xt_db_system_impl_supabase_session$$set_session(impl,null);
      return {"status":"ok"};
    });
  });
}

function xt_db_node_kernel_supabase$$supabase_refresh_handler(space,args,request,node){
  let service_id = args[0];
  return Promise.resolve().then(function (){
    return xt_substrate$$get_service(node,service_id);
  }).then(function (impl){
    return xt_db_system_impl_supabase_session$$refresh_session(impl);
  });
}

function xt_db_node_kernel_supabase$$supabase_signed_in_handler(space,args,request,node){
  let service_id = args[0];
  let impl = xt_substrate$$get_service(node,service_id);
  return null != xt_db_system_impl_supabase_session$$get_session(impl);
}

function xt_db_node_kernel_supabase$$supabase_current_session_handler(space,args,request,node){
  let service_id = args[0];
  let impl = xt_substrate$$get_service(node,service_id);
  return xt_db_system_impl_supabase_session$$get_session(impl);
}

function xt_db_node_kernel_supabase$$supabase_rpc_call_handler(space,args,request,node){
  let service_id = args[0];
  let rpc_name = args[1];
  let data = args[2] || {};
  let opts = args[3] || {};
  return xt_db_node_kernel_supabase$$supabase_request(
    node,
    service_id,
    xt_net_addon_supabase$$cmd_rpc_call(rpc_name,data,opts)
  );
}

function xt_db_node_kernel_supabase$$supabase_query_table_handler(space,args,request,node){
  let service_id = args[0];
  let table_name = args[1];
  let query = args[2];
  let opts = args[3] || {};
  return xt_db_node_kernel_supabase$$supabase_request(
    node,
    service_id,
    xt_net_addon_supabase$$cmd_query_table(table_name,query,opts)
  );
}

function xt_db_node_kernel_supabase$$supabase_health_handler(space,args,request,node){
  let service_id = args[0];
  let opts = args[1] || {};
  return xt_db_node_kernel_supabase$$supabase_request(node,service_id,xt_net_addon_supabase$$cmd_health(opts));
}

function xt_db_node_kernel_supabase$$supabase_admin_create_user_handler(space,args,request,node){
  let service_id = args[0];
  let data = args[1];
  let opts = args[2] || {};
  return xt_db_node_kernel_supabase$$supabase_request(
    node,
    service_id,
    xt_net_addon_supabase$$cmd_admin_create_user(data,opts)
  );
}

function xt_db_node_kernel_supabase$$supabase_admin_delete_user_handler(space,args,request,node){
  let service_id = args[0];
  let user_id = args[1];
  let opts = args[2] || {};
  return xt_db_node_kernel_supabase$$supabase_request(
    node,
    service_id,
    xt_net_addon_supabase$$cmd_admin_delete_user(user_id,opts)
  );
}

function xt_db_node_kernel_supabase$$supabase_admin_generate_link_handler(space,args,request,node){
  let service_id = args[0];
  let data = args[1];
  let opts = args[2] || {};
  return xt_db_node_kernel_supabase$$supabase_request(
    node,
    service_id,
    xt_net_addon_supabase$$cmd_admin_generate_link(data,opts)
  );
}

function xt_db_node_kernel_supabase$$supabase_admin_get_user_handler(space,args,request,node){
  let service_id = args[0];
  let user_id = args[1];
  let opts = args[2] || {};
  return xt_db_node_kernel_supabase$$supabase_request(
    node,
    service_id,
    xt_net_addon_supabase$$cmd_admin_get_user(user_id,opts)
  );
}

function xt_db_node_kernel_supabase$$supabase_admin_list_users_handler(space,args,request,node){
  let service_id = args[0];
  let opts = args[1] || {};
  return xt_db_node_kernel_supabase$$supabase_request(
    node,
    service_id,
    xt_net_addon_supabase$$cmd_admin_list_users(opts)
  );
}

function xt_db_node_kernel_supabase$$supabase_admin_update_user_handler(space,args,request,node){
  let service_id = args[0];
  let user_id = args[1];
  let opts = args[2] || {};
  return xt_db_node_kernel_supabase$$supabase_request(
    node,
    service_id,
    xt_net_addon_supabase$$cmd_admin_update_user(user_id,opts)
  );
}

function xt_db_node_kernel_supabase$$supabase_authorize_handler(space,args,request,node){
  let service_id = args[0];
  let data = args[1];
  let opts = args[2] || {};
  return xt_db_node_kernel_supabase$$supabase_request(
    node,
    service_id,
    xt_net_addon_supabase$$cmd_authorize(data,opts)
  );
}

function xt_db_node_kernel_supabase$$supabase_callback_handler(space,args,request,node){
  let service_id = args[0];
  let opts = args[1] || {};
  return xt_db_node_kernel_supabase$$supabase_request(node,service_id,xt_net_addon_supabase$$cmd_callback(opts));
}

function xt_db_node_kernel_supabase$$supabase_invite_handler(space,args,request,node){
  let service_id = args[0];
  let data = args[1];
  let opts = args[2] || {};
  return xt_db_node_kernel_supabase$$supabase_request(node,service_id,xt_net_addon_supabase$$cmd_invite(data,opts));
}

function xt_db_node_kernel_supabase$$supabase_otp_handler(space,args,request,node){
  let service_id = args[0];
  let data = args[1];
  let opts = args[2] || {};
  return xt_db_node_kernel_supabase$$supabase_request(node,service_id,xt_net_addon_supabase$$cmd_otp(data,opts));
}

function xt_db_node_kernel_supabase$$supabase_recovery_handler(space,args,request,node){
  let service_id = args[0];
  let data = args[1];
  let opts = args[2] || {};
  return xt_db_node_kernel_supabase$$supabase_request(
    node,
    service_id,
    xt_net_addon_supabase$$cmd_recovery(data,opts)
  );
}

function xt_db_node_kernel_supabase$$supabase_settings_handler(space,args,request,node){
  let service_id = args[0];
  let opts = args[1] || {};
  return xt_db_node_kernel_supabase$$supabase_request(node,service_id,xt_net_addon_supabase$$cmd_settings(opts));
}

function xt_db_node_kernel_supabase$$supabase_token_refresh_handler(space,args,request,node){
  let service_id = args[0];
  let data = args[1];
  let opts = args[2] || {};
  return xt_db_node_kernel_supabase$$supabase_request(
    node,
    service_id,
    xt_net_addon_supabase$$cmd_token_refresh(data,opts)
  );
}

function xt_db_node_kernel_supabase$$supabase_user_get_handler(space,args,request,node){
  let service_id = args[0];
  let opts = args[1] || {};
  let impl = xt_substrate$$get_service(node,service_id);
  let session = xt_db_system_impl_supabase_session$$get_session(impl);
  if(null != session){
    return {"user":session["user"]};
  }
  else{
    return xt_db_node_kernel_supabase$$supabase_request(node,service_id,xt_net_addon_supabase$$cmd_user_get(opts));
  }
}

function xt_db_node_kernel_supabase$$supabase_user_put_handler(space,args,request,node){
  let service_id = args[0];
  let data = args[1];
  let opts = args[2] || {};
  return xt_db_node_kernel_supabase$$supabase_request(
    node,
    service_id,
    xt_net_addon_supabase$$cmd_user_put(data,opts)
  );
}

function xt_db_node_kernel_supabase$$supabase_verify_get_handler(space,args,request,node){
  let service_id = args[0];
  let data = args[1];
  let opts = args[2] || {};
  return xt_db_node_kernel_supabase$$supabase_request(
    node,
    service_id,
    xt_net_addon_supabase$$cmd_verify_get(data,opts)
  );
}

function xt_db_node_kernel_supabase$$supabase_verify_post_handler(space,args,request,node){
  let service_id = args[0];
  let data = args[1];
  let opts = args[2] || {};
  return xt_db_node_kernel_supabase$$supabase_request(
    node,
    service_id,
    xt_net_addon_supabase$$cmd_verify_post(data,opts)
  );
}

function xt_db_node_kernel_supabase$$supabase_create_model(service_id,supabase_handler,model){
  let {defaults,options,pipeline} = model;
  let model_handler = function (context){
    let {node} = context;
    let cmd = ("function" == (typeof supabase_handler)) ? supabase_handler(context) : supabase_handler;
    return xt_db_node_kernel_supabase$$supabase_request(node,service_id,cmd);
  };
  return {
    "handler":model_handler,
    "pipeline":xt_lang_common_data$$obj_assign_nested({"remote":{"handler":model_handler}},pipeline),
    "defaults":defaults,
    "options":options
  };
}

function xt_db_node_kernel_supabase$$supabase_attach_model(space,args,request,node){
  let service_id = args[0];
  let page_args = args[1];
  let supabase_handler = args[2];
  let model = args[3];
  let {group_id,model_id,space_id} = page_args;
  let model_spec = xt_db_node_kernel_supabase$$supabase_create_model(service_id,supabase_handler,model);
  xt_substrate_page_core$$group_add_attach(node,space_id,group_id,{[model_id]:model_spec});
  return {
    "status":"attached",
    "space":space_id,
    "group":group_id,
    "model":model_id
  };
}

function xt_db_node_kernel_supabase$$init_handlers(node){
  xt_substrate$$register_handler(
    node,
    "@xt.supabase/sign-up",
    xt_db_node_kernel_supabase$$supabase_sign_up_handler,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.supabase/sign-in",
    xt_db_node_kernel_supabase$$supabase_sign_in_handler,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.supabase/sign-out",
    xt_db_node_kernel_supabase$$supabase_sign_out_handler,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.supabase/refresh",
    xt_db_node_kernel_supabase$$supabase_refresh_handler,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.supabase/signed-in?",
    xt_db_node_kernel_supabase$$supabase_signed_in_handler,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.supabase/current-session",
    xt_db_node_kernel_supabase$$supabase_current_session_handler,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.supabase/rpc-call",
    xt_db_node_kernel_supabase$$supabase_rpc_call_handler,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.supabase/query-table",
    xt_db_node_kernel_supabase$$supabase_query_table_handler,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.supabase/health",
    xt_db_node_kernel_supabase$$supabase_health_handler,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.supabase/admin-create-user",
    xt_db_node_kernel_supabase$$supabase_admin_create_user_handler,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.supabase/admin-delete-user",
    xt_db_node_kernel_supabase$$supabase_admin_delete_user_handler,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.supabase/admin-generate-link",
    xt_db_node_kernel_supabase$$supabase_admin_generate_link_handler,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.supabase/admin-get-user",
    xt_db_node_kernel_supabase$$supabase_admin_get_user_handler,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.supabase/admin-list-users",
    xt_db_node_kernel_supabase$$supabase_admin_list_users_handler,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.supabase/admin-update-user",
    xt_db_node_kernel_supabase$$supabase_admin_update_user_handler,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.supabase/authorize",
    xt_db_node_kernel_supabase$$supabase_authorize_handler,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.supabase/callback",
    xt_db_node_kernel_supabase$$supabase_callback_handler,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.supabase/invite",
    xt_db_node_kernel_supabase$$supabase_invite_handler,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.supabase/otp",
    xt_db_node_kernel_supabase$$supabase_otp_handler,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.supabase/recovery",
    xt_db_node_kernel_supabase$$supabase_recovery_handler,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.supabase/settings",
    xt_db_node_kernel_supabase$$supabase_settings_handler,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.supabase/token-refresh",
    xt_db_node_kernel_supabase$$supabase_token_refresh_handler,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.supabase/user-get",
    xt_db_node_kernel_supabase$$supabase_user_get_handler,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.supabase/user-info",
    xt_db_node_kernel_supabase$$supabase_user_get_handler,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.supabase/user-put",
    xt_db_node_kernel_supabase$$supabase_user_put_handler,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.supabase/verify-get",
    xt_db_node_kernel_supabase$$supabase_verify_get_handler,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.supabase/verify-post",
    xt_db_node_kernel_supabase$$supabase_verify_post_handler,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.supabase/attach-model",
    xt_db_node_kernel_supabase$$supabase_attach_model,
    null
  );
  return node;
}

function xt_db_node_kernel_base$$get_primary_impl(node,service_id){
  let impl = xt_substrate$$get_service(node,service_id);
  let primary_id = xt_lang_common_data$$get_in(impl,["metadata","primary_id"]);
  if(primary_id){
    return xt_substrate$$get_service(node,primary_id);
  }
  else{
    return impl;
  }
}

function xt_db_node_kernel_base$$get_caching_impl(node,service_id){
  let impl = xt_substrate$$get_service(node,service_id);
  let caching_id = xt_lang_common_data$$get_in(impl,["metadata","caching_id"]);
  if(caching_id){
    return xt_substrate$$get_service(node,caching_id);
  }
}

function xt_db_node_kernel_base$$kernel_create_config(config){
  let common = Object.assign({"id":"db/common"},config["common"]);
  let primary = Object.assign({"id":"db/primary"},config["primary"]);
  let caching = Object.assign({"id":"db/caching"},config["caching"]);
  return {"common":common,"primary":primary,"caching":caching};
}

function xt_db_node_kernel_base$$kernel_check_exists(node,config){
  config = xt_db_node_kernel_base$$kernel_create_config(config);
  return (null != xt_substrate$$get_service(node,xt_lang_common_data$$get_in(config,["common","id"]))) && (null != xt_substrate$$get_service(node,xt_lang_common_data$$get_in(config,["primary","id"]))) && (null != xt_substrate$$get_service(node,xt_lang_common_data$$get_in(config,["caching","id"])));
}

function xt_db_node_kernel_base$$kernel_setup_single(node,service_id,type,defaults,schema,lookup){
  return xt_db_system_main$$create_impl_init(xt_db_system_main$$create_impl(type,defaults,schema,lookup)).then(function (impl){
    xt_substrate$$set_service(node,service_id,impl);
    return node;
  });
}

function xt_db_node_kernel_base$$kernel_teardown_single(node,service_id){
  let impl = xt_substrate$$get_service(node,service_id);
  if(xt_lang_common_protocol$$protocol_implements(impl,"xt.db.system.impl_common/ISourceLifecycle")){
    xt_db_system_impl_common$$stop_db(impl);
  }
  xt_substrate$$remove_service(node,service_id);
  return node;
}

function xt_db_node_kernel_base$$kernel_setup_main(node,config,schema,lookup){
  config = xt_db_node_kernel_base$$kernel_create_config(config);
  let common_id = xt_lang_common_data$$get_in(config,["common","id"]);
  let primary_id = xt_lang_common_data$$get_in(config,["primary","id"]);
  let caching_id = xt_lang_common_data$$get_in(config,["caching","id"]);
  xt_substrate$$set_service(node,common_id,{
    "config":config,
    "schema":schema,
    "lookup":lookup,
    "metadata":{"common_id":common_id}
  });
  return Promise.all([
    xt_db_node_kernel_base$$kernel_setup_single(
      node,
      primary_id,
      xt_lang_common_data$$get_in(config,["primary","type"]),
      xt_lang_common_data$$get_in(config,["primary","defaults"]),
      schema,
      lookup
    ),
    xt_db_node_kernel_base$$kernel_setup_single(
      node,
      caching_id,
      xt_lang_common_data$$get_in(config,["caching","type"]),
      xt_lang_common_data$$get_in(config,["caching","defaults"]),
      schema,
      lookup
    )
  ]).then(function (init){
    Object.assign((xt_substrate$$get_service(node,primary_id))["metadata"],{
      "common_id":common_id,
      "caching_id":caching_id,
      "caching_fn":function (){
            return xt_substrate$$get_service(node,caching_id);
          }
    });
    Object.assign((xt_substrate$$get_service(node,caching_id))["metadata"],{
      "common_id":common_id,
      "primary_id":primary_id,
      "primary_fn":function (){
            return xt_substrate$$get_service(node,primary_id);
          }
    });
    return {"status":"setup","data":config};
  });
}

function xt_db_node_kernel_base$$kernel_setup_handler(space,args,request,node){
  let config = args[0];
  let schema = args[1];
  let lookup = args[2];
  return xt_db_node_kernel_base$$kernel_setup_main(node,config,schema,lookup);
}

function xt_db_node_kernel_base$$kernel_teardown_main(node,config){
  config = xt_db_node_kernel_base$$kernel_create_config(config);
  xt_db_node_kernel_base$$kernel_teardown_single(node,xt_lang_common_data$$get_in(config,["primary","id"]));
  xt_db_node_kernel_base$$kernel_teardown_single(node,xt_lang_common_data$$get_in(config,["caching","id"]));
  xt_substrate$$remove_service(node,xt_lang_common_data$$get_in(config,["common","id"]));
  delete(node["meta"]["xt.db/kernel-init"]);
  delete(node["meta"]["xt.db/site-map"]);
  return {"status":"teardown","data":config};
}

function xt_db_node_kernel_base$$kernel_teardown_handler(space,args,request,node){
  let config = args[0];
  if("string" == (typeof config)){
    let common_id = xt_lang_common_data$$get_in(
      xt_substrate$$get_service(node,config),
      ["metadata","common_id"]
    );
    config = xt_lang_common_data$$get_in(xt_substrate$$get_service(node,common_id),["config"]);
  }
  return xt_db_node_kernel_base$$kernel_teardown_main(node,config);
}

function xt_db_node_kernel_base$$kernel_store_site_map_rpc(node,config,loaded){
  let setup_config = xt_db_node_kernel_base$$kernel_create_config(config);
  let common_id = xt_lang_common_data$$get_in(setup_config,["common","id"]);
  let common = xt_substrate$$get_service(node,common_id);
  common["rpc"] = (loaded["rpc"] || {});
  return loaded;
}

function xt_db_node_kernel_base$$kernel_init_main(node,config,schema,lookup){
  let meta = node["meta"];
  let pending = xt_lang_common_data$$get_in(meta,["xt.db/kernel-init"]);
  if(null != pending){
    return pending.then(function (_){
      return xt_db_node_kernel_base$$kernel_init_main(node,config,schema,lookup);
    });
  }
  let init = xt_db_node_site_map$$load_site_map(node,config,schema,lookup).then(function (loaded){
    let next_schema = loaded["schema"] || schema;
    let next_lookup = loaded["lookup"] || lookup;
    if(xt_db_node_kernel_base$$kernel_check_exists(node,config)){
      xt_db_node_kernel_base$$kernel_store_site_map_rpc(node,config,loaded);
      return Promise.resolve().then(function (){
        return {
          "status":"no_change",
          "data":xt_db_node_kernel_base$$kernel_create_config(config)
        };
      });
    }
    else{
      let setup = xt_db_node_kernel_base$$kernel_setup_main(node,config,next_schema,next_lookup);
      return setup.then(function (result){
        xt_db_node_kernel_base$$kernel_store_site_map_rpc(node,config,loaded);
        return result;
      });
    }
  });
  let guarded = init.then(function (result){
    delete(meta["xt.db/kernel-init"]);
    return result;
  }).catch(function (err){
    delete(meta["xt.db/kernel-init"]);
    throw err;
  });
  meta["xt.db/kernel-init"] = guarded;
  return guarded;
}

function xt_db_node_kernel_base$$kernel_init_handler(space,args,request,node){
  let config = args[0];
  let schema = args[1];
  let lookup = args[2];
  return xt_db_node_kernel_base$$kernel_init_main(node,config,schema,lookup);
}

function xt_db_node_kernel_base$$subscribe_db_handler(space,args,request,node){
  let primary_id = args[0];
  let conn_id = args[1];
  let topics = args[2];
  let primary = xt_db_node_kernel_base$$get_primary_impl(node,primary_id);
  return xt_db_system_impl_common$$subscribe_db(primary,conn_id,topics);
}

function xt_db_node_kernel_base$$unsubscribe_db_handler(space,args,request,node){
  let primary_id = args[0];
  let conn_id = args[1];
  let topics = args[2];
  let primary = xt_db_node_kernel_base$$get_primary_impl(node,primary_id);
  return xt_db_system_impl_common$$unsubscribe_db(primary,conn_id,topics);
}

function xt_db_node_kernel_base$$sync_cached_handler(space,args,request,node){
  let primary_id = args[0];
  let payload = args[1];
  let caching = xt_db_node_kernel_base$$get_caching_impl(node,primary_id);
  return xt_db_system_impl_common$$sync_process_payload(caching,payload);
}

function xt_db_node_kernel_base$$attach_base_model(node,primary_id,space_id,group_id,model_id,model_spec){
  xt_substrate_page_core$$group_add_attach(node,space_id,group_id,{[model_id]:model_spec});
  let refresh_map = xt_lang_common_data$$get_in(model_spec,["options","refresh"]);
  let caching = xt_db_node_kernel_base$$get_caching_impl(node,primary_id);
  if(caching && ((null != refresh_map) && ("object" == (typeof refresh_map)) && !Array.isArray(refresh_map))){
    xt_db_system_impl_common$$add_db_listener(caching,space_id + "/" + group_id + "/" + model_id,{
      "guard":refresh_map,
      "callback":function (event){
            return xt_substrate_page_core$$model_update(node,space_id,group_id,model_id,event);
          }
    });
  }
  return {
    "status":"attached",
    "space":space_id,
    "group":group_id,
    "model":model_id
  };
}

function xt_db_node_kernel_base$$attach_model_handler(space,args,request,node){
  let primary_id = args[0];
  let page_args = args[1];
  let {group_id,model_id,space_id} = page_args;
  let model_spec = args[2];
  return xt_db_node_kernel_base$$attach_base_model(node,primary_id,space_id,group_id,model_id,model_spec);
}

function xt_db_node_kernel_base$$detach_base_model(node,primary_id,space_id,group_id,model_id){
  xt_substrate_page_core$$model_remove(node,space_id,group_id,model_id);
  let caching = xt_db_node_kernel_base$$get_caching_impl(node,primary_id);
  if(null != caching){
    xt_db_system_impl_common$$remove_db_listener(caching,space_id + "/" + group_id + "/" + model_id);
  }
  return {
    "status":"removed",
    "space":space_id,
    "group":group_id,
    "model":model_id
  };
}

function xt_db_node_kernel_base$$detach_model_handler(space,args,request,node){
  let primary_id = args[0];
  let page_args = args[1];
  let {group_id,model_id,space_id} = page_args;
  return xt_db_node_kernel_base$$detach_base_model(node,primary_id,space_id,group_id,model_id);
}

function xt_db_node_kernel_base$$rpc_resolve(node,primary_id,rpc_spec){
  if("string" == (typeof rpc_spec)){
    let primary = xt_db_node_kernel_base$$get_primary_impl(node,primary_id);
    let common_id = xt_lang_common_data$$get_in(primary,["metadata","common_id"]);
    let common = xt_substrate$$get_service(node,common_id);
    let resolved = xt_lang_common_data$$get_in(common,["rpc",rpc_spec]);
    if(null == resolved){
      throw "Unknown site-map RPC: " + rpc_spec;
    }
    return resolved;
  }
  else{
    return rpc_spec;
  }
}

function xt_db_node_kernel_base$$rpc_call_baseline_fn(node,primary_id,rpc_spec,rpc_args){
  rpc_spec = xt_db_node_kernel_base$$rpc_resolve(node,primary_id,rpc_spec);
  let primary = xt_db_node_kernel_base$$get_primary_impl(node,primary_id);
  return xt_db_system_impl_common$$rpc_call_async(primary,rpc_spec,rpc_args).then(function (result){
    let {table} = rpc_spec;
    let caching = xt_db_node_kernel_base$$get_caching_impl(node,primary_id);
    if(table && caching){
      let {base,type} = table;
      xt_db_system_impl_common$$sync_process_payload(caching,{[type]:{[base]:result}});
    }
    return result;
  });
}

function xt_db_node_kernel_base$$rpc_call_handler(space,args,request,node){
  let service_id = args[0];
  let rpc_spec = args[1];
  let rpc_args = args[2];
  return xt_db_node_kernel_base$$rpc_call_baseline_fn(node,service_id,rpc_spec,rpc_args);
}

function xt_db_node_kernel_base$$rpc_create_model(primary_id,rpc_spec,model){
  let {defaults,options,pipeline} = model;
  let rpc_handler = function (context){
    let {args,node,space} = context;
    return xt_db_node_kernel_base$$rpc_call_baseline_fn(node,primary_id,rpc_spec,args);
  };
  return {
    "handler":rpc_handler,
    "pipeline":xt_lang_common_data$$obj_assign_nested({
        "remote":{
            "handler":function (context){
                let {node} = context;
                let {args} = context;
                return xt_db_node_kernel_base$$rpc_call_baseline_fn(node,primary_id,rpc_spec,args);
              }
          }
      },pipeline),
    "defaults":defaults,
    "options":options
  };
}

function xt_db_node_kernel_base$$rpc_attach_model(space,args,request,node){
  let primary_id = args[0];
  let page_args = args[1];
  let rpc_spec = xt_db_node_kernel_base$$rpc_resolve(node,primary_id,args[2]);
  let model = args[3];
  let {group_id,model_id,space_id} = page_args;
  let model_spec = xt_db_node_kernel_base$$rpc_create_model(primary_id,rpc_spec,model);
  return xt_db_node_kernel_base$$attach_base_model(node,primary_id,space_id,group_id,model_id,model_spec);
}

function xt_db_node_kernel_base$$pull_call_baseline_fn(node,primary_id,tree){
  let primary = xt_db_node_kernel_base$$get_primary_impl(node,primary_id);
  return xt_db_system_impl_common$$pull_async(primary,tree).then(function (result){
    let table = tree[0];
    let caching = xt_db_node_kernel_base$$get_caching_impl(node,primary_id);
    if(caching){
      let payload = {"db/sync":{[table]:result}};
      xt_db_system_impl_common$$sync_process_payload(caching,payload);
    }
    return result;
  });
}

function xt_db_node_kernel_base$$pull_call_handler(space,args,request,node){
  let primary_id = args[0];
  let tree = args[1];
  return xt_db_node_kernel_base$$pull_call_baseline_fn(node,primary_id,tree);
}

function xt_db_node_kernel_base$$pull_cached_handler(space,args,request,node){
  let primary_id = args[0];
  let tree = args[1];
  let caching = xt_db_node_kernel_base$$get_caching_impl(node,primary_id);
  return xt_db_system_impl_common$$pull(caching,tree);
}

function xt_db_node_kernel_base$$pull_create_model(primary_id,tree,model){
  let {defaults,options,pipeline} = model;
  let table = tree[0];
  return {
    "handler":function (context){
        let {node} = context;
        let caching = xt_db_node_kernel_base$$get_caching_impl(node,primary_id);
        return xt_db_system_impl_common$$pull(caching,tree);
      },
    "pipeline":xt_lang_common_data$$obj_assign_nested({
        "remote":{
            "handler":function (context){
                let {node} = context;
                return xt_db_node_kernel_base$$pull_call_baseline_fn(node,primary_id,tree);
              }
          }
      },pipeline),
    "defaults":defaults,
    "options":options
  };
}

function xt_db_node_kernel_base$$pull_attach_model(space,args,request,node){
  let primary_id = args[0];
  let page_args = args[1];
  let tree = args[2];
  let model = args[3];
  let {group_id,model_id,space_id} = page_args;
  let model_spec = xt_db_node_kernel_base$$pull_create_model(primary_id,tree,model);
  return xt_db_node_kernel_base$$attach_base_model(node,primary_id,space_id,group_id,model_id,model_spec);
}

function xt_db_node_kernel_base$$dataview_prep_tree(impl,dataview){
  let {schema} = impl;
  let ok_value = xt_db_text_base_tree$$plan_view(
    schema,
    Object.assign({"select_args":[],"return_args":[]},dataview)
  );
  let [ok,tree] = ok_value;
  if(!ok){
    throw Object.assign(new Error("Invalid Dataview"),{"data":dataview});
  }
  return tree;
}

function xt_db_node_kernel_base$$dataview_call_baseline_fn(node,primary_id,dataview){
  let impl = xt_db_node_kernel_base$$get_primary_impl(node,primary_id);
  let tree = xt_db_node_kernel_base$$dataview_prep_tree(impl,dataview);
  return xt_db_system_impl_common$$pull_async(impl,tree).then(function (result){
    let {table} = dataview;
    let caching = xt_db_node_kernel_base$$get_caching_impl(node,primary_id);
    if(caching){
      let payload = {"db/sync":{[table]:result}};
      xt_db_system_impl_common$$sync_process_payload(caching,payload);
    }
    return result;
  });
}

function xt_db_node_kernel_base$$dataview_call_handler(space,args,request,node){
  let primary_id = args[0];
  let dataview = args[1];
  return xt_db_node_kernel_base$$dataview_call_baseline_fn(node,primary_id,dataview);
}

function xt_db_node_kernel_base$$dataview_cached_handler(space,args,request,node){
  let primary_id = args[0];
  let dataview = args[1];
  let caching = xt_db_node_kernel_base$$get_caching_impl(node,primary_id);
  let tree = xt_db_node_kernel_base$$dataview_prep_tree(caching,dataview);
  return xt_db_system_impl_common$$pull(caching,tree);
}

function xt_db_node_kernel_base$$dataview_create_model(primary_id,dataview,model){
  let {defaults,options,pipeline} = model;
  let {table} = dataview;
  return {
    "handler":function (context){
        let {node} = context;
        let {args} = context;
        let caching = xt_db_node_kernel_base$$get_caching_impl(node,primary_id);
        let {schema} = caching;
        let ok_value = xt_db_text_base_tree$$plan_view(schema,Object.assign(
          Object.assign({"select_args":[],"return_args":[]},args[0]),
          dataview
        ));
        let [ok,tree] = ok_value;
        if(!ok){
          throw Object.assign(new Error("Invalid Dataview"),{"data":dataview});
        }
        return xt_db_system_impl_common$$pull(caching,tree);
      },
    "pipeline":xt_lang_common_data$$obj_assign_nested({
        "remote":{
            "handler":function (context){
                let {node} = context;
                let {args} = context;
                return xt_db_node_kernel_base$$dataview_call_baseline_fn(
                  node,
                  primary_id,
                  Object.assign(Object.assign({},dataview),args[0])
                );
              }
          }
      },pipeline),
    "defaults":defaults,
    "options":options
  };
}

function xt_db_node_kernel_base$$dataview_attach_model(space,args,request,node){
  let primary_id = args[0];
  let page_args = args[1];
  let dataview = args[2];
  let model = args[3];
  let {group_id,model_id,space_id} = page_args;
  let model_spec = xt_db_node_kernel_base$$dataview_create_model(primary_id,dataview,model);
  return xt_db_node_kernel_base$$attach_base_model(node,primary_id,space_id,group_id,model_id,model_spec);
}

function xt_db_node_kernel_base$$init_handlers(node){
  xt_substrate$$register_handler(
    node,
    "@xt.db/kernel-init",
    xt_db_node_kernel_base$$kernel_init_handler
  );
  xt_substrate$$register_handler(
    node,
    "@xt.db/kernel-setup",
    xt_db_node_kernel_base$$kernel_setup_handler
  );
  xt_substrate$$register_handler(
    node,
    "@xt.db/kernel-teardown",
    xt_db_node_kernel_base$$kernel_teardown_handler
  );
  xt_substrate$$register_handler(
    node,
    "@xt.db/subscribe-db",
    xt_db_node_kernel_base$$subscribe_db_handler,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.db/unsubscribe-db",
    xt_db_node_kernel_base$$unsubscribe_db_handler,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.db/sync-cached",
    xt_db_node_kernel_base$$sync_cached_handler,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.db/attach-model",
    xt_db_node_kernel_base$$attach_model_handler,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.db/detach-model",
    xt_db_node_kernel_base$$detach_model_handler,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.db/rpc-call",
    xt_db_node_kernel_base$$rpc_call_handler,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.db/rpc-attach-model",
    xt_db_node_kernel_base$$rpc_attach_model,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.db/pull-call",
    xt_db_node_kernel_base$$pull_call_handler,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.db/pull-cached",
    xt_db_node_kernel_base$$pull_cached_handler,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.db/pull-attach-model",
    xt_db_node_kernel_base$$pull_attach_model,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.db/dataview-call",
    xt_db_node_kernel_base$$dataview_call_handler,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.db/dataview-cached",
    xt_db_node_kernel_base$$dataview_cached_handler,
    null
  );
  xt_substrate$$register_handler(
    node,
    "@xt.db/dataview-attach-model",
    xt_db_node_kernel_base$$dataview_attach_model,
    null
  );
  return node;
}

var xt_db_node_runtime$$DEFAULT_TRANSPORT = "xt.db.default.transport";

var xt_db_node_runtime$$DEFAULT_WORKER = "xt.db.default.worker";

function xt_db_node_runtime$$init_server(node){
  xt_substrate_page_proxy$$install(node);
  xt_db_node_kernel_base$$init_handlers(node);
  xt_db_node_kernel_supabase$$init_handlers(node);
}

function xt_db_node_runtime$$sharedworker_init_kernel(node,transport_id,worker_id){
  xt_db_node_runtime$$init_server(node);
  globalThis["onconnect"] = (function (e){
    let port = e["ports"][0];
    let connection_transport_id = xt_substrate_base_frame$$rand_id(
      (transport_id || xt_db_node_runtime$$DEFAULT_TRANSPORT) + ".",
      12
    );
    port.start();
    return xt_substrate_transport_browser$$boot_self(node,{
      "transport_id":connection_transport_id,
      "target":port,
      "ready":{
            "signal":"ready",
            "transport":connection_transport_id,
            "worker":worker_id || xt_db_node_runtime$$DEFAULT_WORKER
          }
    });
  });
}

let node = xt_substrate$$node_create({"id":xt_db_node_runtime$$DEFAULT_WORKER});
xt_db_node_runtime$$sharedworker_init_kernel(node);