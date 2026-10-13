const xtd = require("@xtalk/lang/common-data.js")

const k = require("@xtalk/lang/common-lib.js")

const client = require("@xtalk/db/node/client-base.js")

function context_node(context){
  return context["node"];
}

function context_primary_id(context){
  return (null == context["primary-id"]) ? "db/primary" : context["primary-id"];
}

function context_opts(context){
  return (null == context["opts"]) ? {} : context["opts"];
}

function request_data(context,request_type,request_kind,spec,entry){
  let node = context_node(context);
  let primary_id = context_primary_id(context);
  let opts = context_opts(context);
  if(request_kind == "pull"){
    if(request_type == "cached"){
      return client.pull_cached(node,primary_id,spec,opts);
    }
    else{
      return client.pull_call(node,primary_id,spec,opts);
    }
  }
  else if(request_kind == "view"){
    if(request_type == "cached"){
      return client.dataview_cached(node,primary_id,spec,opts);
    }
    else{
      return client.dataview_call(node,primary_id,spec,opts);
    }
  }
  else if(request_kind == "rpc"){
    let rpc_spec = entry["rpc-spec"] || spec["rpc-spec"];
    let rpc_args = entry["rpc-args"] || spec["rpc-args"] || [];
    return client.rpc_call(node,primary_id,rpc_spec,rpc_args,opts);
  }
  else{
    return null;
  }
}

function table_impl_entry(impl,request_type){
  return xtd.arr_foldl(["base",request_type],function (acc,key){
    return xtd.obj_assign(acc,impl[key] || {});
  },{});
}

function table_check_entry(entry,sel_input){
  let list_entry = entry["list"];
  if((null == entry) || (null == list_entry)){
    return false;
  }
  return (list_entry["check"] || k.T)(sel_input);
}

function table_level_entry(entry,request_level){
  return entry[request_level];
}

function table_level_spec(entry,input){
  return input || entry["spec"] || entry["query"];
}

function table_request_kind(entry,spec){
  let type = entry["type"];
  if((type == "raw") || (type == "pull") || Array.isArray(spec)){
    return "pull";
  }
  else if((type == "custom") || (type == "rpc")){
    return "rpc";
  }
  else{
    return "view";
  }
}

function table_rows(result){
  return Array.isArray(result) ? result : [];
}

function table_ids_from(result,id_key){
  return xtd.arr_filter(xtd.arr_map(table_rows(result),function (row){
    return row[id_key || "id"];
  }),k.identity);
}

function table_pull_with_data(spec,data){
  if((null == spec) || !Array.isArray(spec)){
    return spec;
  }
  let out = spec.slice();
  let params = xtd.obj_clone(out[1] || {});
  params["data"] = xtd.arr_union(params["data"] || [],data || []);
  out[1] = params;
  return out;
}

function table_pull_with_ids(spec,ids){
  if(null == spec){
    return spec;
  }
  if(Array.isArray(spec)){
    let out = spec.slice();
    let params = xtd.obj_clone(out[1] || {});
    let where = (params["where"] || []).slice();
    where.push({"id":["in",ids]});
    params["where"] = where;
    out[1] = params;
    return out;
  }
  else if((null != spec) && ("object" == (typeof spec)) && !Array.isArray(spec)){
    return xtd.obj_assign(xtd.obj_clone(spec),{"return_bulk":ids});
  }
  else{
    return spec;
  }
}

function table_ids(impl,request_type,sel_input,context){
  let entry = table_impl_entry(impl,request_type);
  if(!table_check_entry(entry,sel_input)){
    return;
  }
  let list_entry = table_level_entry(entry,"list");
  let spec = table_level_spec(list_entry,sel_input);
  let kind = table_request_kind(list_entry,spec);
  return request_data(context,request_type,kind,spec,list_entry).then(function (result){
    return table_ids_from(
      result,
      (null == list_entry["id-key"]) ? "id" : list_entry["id-key"]
    );
  });
}

function table_ids_updated(impl,request_type,sel_input,context){
  let entry = table_impl_entry(impl,request_type);
  if(!table_check_entry(entry,sel_input)){
    return;
  }
  let list_entry = table_level_entry(entry,"list");
  let update_key = (null == list_entry["update-key"]) ? "time_updated" : list_entry["update-key"];
  let spec = list_entry["updated-spec"] || table_pull_with_data(table_level_spec(list_entry,sel_input),["id",update_key]);
  return request_data(
    context,
    request_type,
    table_request_kind(list_entry,spec),
    spec,
    list_entry
  );
}

function table_ids_data(impl,request_type,request_level,ids,ret_input,context){
  ids = xtd.arr_filter(ids || [],k.identity);
  if(0 == ids.length){
    return Promise.resolve().then(function (){
      return [];
    });
  }
  let entry = table_impl_entry(impl,request_type);
  let level_entry = table_level_entry(entry,request_level);
  if((null == entry) || (null == level_entry)){
    return;
  }
  let spec = table_pull_with_ids(table_level_spec(level_entry,ret_input),ids);
  return request_data(
    context,
    request_type,
    table_request_kind(level_entry,spec),
    spec,
    level_entry
  );
}

function table_pull(impl,request_type,request_level,sel_input,ret_input,context){
  let entry = table_impl_entry(impl,request_type);
  if(!table_check_entry(entry,sel_input)){
    return;
  }
  return table_ids(impl,request_type,sel_input,context).then(function (ids){
    return table_ids_data(
      impl,
      request_type,
      request_level,
      xtd.arr_filter(ids || [],k.identity),
      ret_input,
      context
    );
  });
}

function sync_unknown_ids(impl,sel_input,context){
  return Promise.all([
    table_ids(impl,"cached",sel_input,context),
    table_ids(impl,"call",sel_input,context)
  ]).then(function (values){
    return xtd.arr_union(
      xtd.arr_difference(values[0] || [],values[1] || []),
      xtd.arr_difference(values[1] || [],values[0] || [])
    );
  });
}

function sync_outdated_ids(impl,sel_input,context){
  let cached_entry = table_impl_entry(impl,"cached");
  if(!table_check_entry(cached_entry,sel_input)){
    return;
  }
  let list_entry = table_level_entry(cached_entry,"list");
  let update_key = (null == list_entry["update-key"]) ? "time_updated" : list_entry["update-key"];
  return Promise.all([
    table_ids_updated(impl,"cached",sel_input,context),
    table_ids_updated(impl,"call",sel_input,context)
  ]).then(function (values){
    let cached_map = {};
    for(let row of table_rows(values[0])){
      cached_map[row["id"]] = row[update_key];
    };
    let out = [];
    for(let row of table_rows(values[1])){
      let id = row["id"];
      if(!(null != cached_map[id]) || !(row[update_key] == cached_map[id])){
        out.push(id);
      }
    };
    return out;
  });
}

function sync_unknown(impl,request_level,sel_input,ret_input,context){
  return sync_unknown_ids(impl,sel_input,context).then(function (ids){
    return xtd.not_emptyp(ids) ? table_ids_data(impl,"call",request_level,ids,ret_input,context) : [];
  });
}

function sync_outdated(impl,request_level,sel_input,ret_input,context){
  return sync_outdated_ids(impl,sel_input,context).then(function (ids){
    return xtd.not_emptyp(ids) ? table_ids_data(impl,"call",request_level,ids,ret_input,context) : [];
  });
}

function action_fn(action,context){
  let node = context_node(context);
  let primary_id = context_primary_id(context);
  let opts = context_opts(context);
  let rpc_spec = action["rpc-spec"];
  let static_args = action["rpc-args"];
  let args_fn = action["args-fn"];
  let output = action["output"] || k.identity;
  return function (...args){
    let rpc_args = ("function" == (typeof args_fn)) ? args_fn(args,context) : ((null != static_args) ? static_args : args);
    return client.rpc_call(node,primary_id,rpc_spec,rpc_args,opts).then(function (result){
      return output(result);
    });
  };
}

function make_actions(impl,context){
  return xtd.obj_map(impl["actions"] || {},function (action){
    return action_fn(action,context);
  });
}

module.exports = {
  ["context_node"]:context_node,
  ["context_primary_id"]:context_primary_id,
  ["context_opts"]:context_opts,
  ["request_data"]:request_data,
  ["table_impl_entry"]:table_impl_entry,
  ["table_check_entry"]:table_check_entry,
  ["table_level_entry"]:table_level_entry,
  ["table_level_spec"]:table_level_spec,
  ["table_request_kind"]:table_request_kind,
  ["table_rows"]:table_rows,
  ["table_ids_from"]:table_ids_from,
  ["table_pull_with_data"]:table_pull_with_data,
  ["table_pull_with_ids"]:table_pull_with_ids,
  ["table_ids"]:table_ids,
  ["table_ids_updated"]:table_ids_updated,
  ["table_ids_data"]:table_ids_data,
  ["table_pull"]:table_pull,
  ["sync_unknown_ids"]:sync_unknown_ids,
  ["sync_outdated_ids"]:sync_outdated_ids,
  ["sync_unknown"]:sync_unknown,
  ["sync_outdated"]:sync_outdated,
  ["action_fn"]:action_fn,
  ["make_actions"]:make_actions
}