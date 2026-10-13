import * as proto from '@statstrade/edge/lib/xt/lang/common-protocol.jsx'

import * as graph from '@statstrade/edge/lib/xt/db/system/memory-graph.jsx'

import * as util from '@statstrade/edge/lib/xt/db/system/memory-util.jsx'

import * as impl_common from '@statstrade/edge/lib/xt/db/system/impl-common.jsx'

import * as f from '@statstrade/edge/lib/xt/db/text/base-flatten.jsx'

// xt.db.system.impl-memory/ImplMemory [] 
export function ImplMemory(rows,schema,lookup,listeners,metadata){
  globalThis["xt_lang_common_protocol$$IMPLEMENTATIONS"]["xt.db.system.impl_memory/ImplMemory"] = true;
  proto.register_protocol_impl(impl_common.ISourceLocal["on"],"xt.db.system.impl_memory/ImplMemory",{
    "clear_db":clear_db,
    "pull":pull,
    "record_add":record_add,
    "record_delete":record_delete,
    "process_add_event":process_add_event,
    "process_remove_event":process_remove_event
  });
  proto.register_protocol_impl(
    impl_common.ISourceRemote["on"],
    "xt.db.system.impl_memory/ImplMemory",
    {"pull_async":pull_async,"rpc_call_async":rpc_call_async}
  );
  proto.register_protocol_impl(impl_common.ISourceListener["on"],"xt.db.system.impl_memory/ImplMemory",{
    "add_db_listener":impl_common.add_db_listener_default,
    "remove_db_listener":impl_common.remove_db_listener_default,
    "get_db_listener":impl_common.get_db_listener_default
  });
  return {
    "::":"xt.db.system.impl_memory/ImplMemory",
    "::/protocols":[
        impl_common.ISourceLocal["on"],
        impl_common.ISourceRemote["on"],
        impl_common.ISourceListener["on"]
      ],
    "::/protocol-impls":{
        [impl_common.ISourceLocal["on"]]:{
          "clear_db":clear_db,
          "pull":pull,
          "record_add":record_add,
          "record_delete":record_delete,
          "process_add_event":process_add_event,
          "process_remove_event":process_remove_event
        },
        [impl_common.ISourceRemote["on"]]:{"pull_async":pull_async,"rpc_call_async":rpc_call_async},
        [impl_common.ISourceListener["on"]]:{
          "add_db_listener":impl_common.add_db_listener_default,
          "remove_db_listener":impl_common.remove_db_listener_default,
          "get_db_listener":impl_common.get_db_listener_default
        }
      },
    "rows":rows,
    "schema":schema,
    "lookup":lookup,
    "listeners":listeners,
    "metadata":metadata
  };
}

// xt.db.system.impl-memory/pull [14] 
export function pull(impl,tree){
  let {opts,rows,schema} = impl;
  return graph.pull(rows,schema,tree,opts);
}

// xt.db.system.impl-memory/pull-async [24] 
export function pull_async(impl,tree){
  return Promise.resolve().then(function (){
    return pull(impl,tree);
  });
}

// xt.db.system.impl-memory/record-add [32] 
export function record_add(impl,table_name,records){
  let {opts,rows,schema} = impl;
  return util.add_bulk(rows,schema,{[table_name]:records});
}

// xt.db.system.impl-memory/record-delete [41] 
export function record_delete(impl,table_name,ids){
  let {opts,rows,schema} = impl;
  return util.remove_bulk(rows,schema,table_name,ids);
}

// xt.db.system.impl-memory/process-add-event [56] 
export function process_add_event(impl,data){
  let {rows,schema} = impl;
  return util.add_bulk(rows,schema,data);
}

// xt.db.system.impl-memory/process-remove-event [62] 
export function process_remove_event(impl,data){
  let {lookup,rows,schema} = impl;
  let ordered = f.flatten_bulk_ids(schema,lookup,data);
  for(let entry of ordered){
    let [table_name,ids] = entry;
    util.remove_bulk(rows,schema,table_name,ids);
  };
  return ordered.map(function (arr){
    return arr[0];
  });
}

// xt.db.system.impl-memory/clear-db [71] 
export function clear_db(impl){
  let {rows} = impl;
  for(let table_key of Object.keys(rows)){
    delete(rows[table_key]);
  };
  return null;
}

// xt.db.system.impl-memory/rpc-call-async [80] 
export function rpc_call_async(_impl,_rpc_spec,_args){
  throw "db.impl.memory does not support rpc_call_async";
}

// xt.db.system.impl-memory/impl-memory [110] 
export function impl_memory(schema,lookup){
  return ImplMemory({},schema,lookup,{},{});
}