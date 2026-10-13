import * as xtd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as proto from '@statstrade/edge/lib/xt/lang/common-protocol.jsx'

// xt.db.system.impl-common/ISourceListener [] 
export var ISourceListener = proto.create_protocol_fn("xt.db.system.impl_common/ISourceListener",{
  "add_db_listener":{
    "name":"add_db_listener",
    "arglist":["impl","listener_id","handle"]
  },
  "remove_db_listener":{"name":"remove_db_listener","arglist":["impl","listener_id"]},
  "get_db_listener":{"name":"get_db_listener","arglist":["impl","listener_id"]}
});

// xt.db.system.impl-common/add-db-listener [] 
export function add_db_listener(impl,listener_id,handle){
  let method_fn = proto.protocol_method(
    impl,
    "xt.db.system.impl_common/ISourceListener",
    "add_db_listener"
  );
  return method_fn(impl,listener_id,handle);
}

// xt.db.system.impl-common/remove-db-listener [] 
export function remove_db_listener(impl,listener_id){
  let method_fn = proto.protocol_method(
    impl,
    "xt.db.system.impl_common/ISourceListener",
    "remove_db_listener"
  );
  return method_fn(impl,listener_id);
}

// xt.db.system.impl-common/get-db-listener [] 
export function get_db_listener(impl,listener_id){
  let method_fn = proto.protocol_method(
    impl,
    "xt.db.system.impl_common/ISourceListener",
    "get_db_listener"
  );
  return method_fn(impl,listener_id);
}

// xt.db.system.impl-common/ISourceRemote [] 
export var ISourceRemote = proto.create_protocol_fn("xt.db.system.impl_common/ISourceRemote",{
  "pull_async":{"name":"pull_async","arglist":["impl","tree"]},
  "rpc_call_async":{"name":"rpc_call_async","arglist":["impl","rpc_spec","args"]}
});

// xt.db.system.impl-common/pull-async [] 
export function pull_async(impl,tree){
  let method_fn = proto.protocol_method(impl,"xt.db.system.impl_common/ISourceRemote","pull_async");
  return method_fn(impl,tree);
}

// xt.db.system.impl-common/rpc-call-async [] 
export function rpc_call_async(impl,rpc_spec,args){
  let method_fn = proto.protocol_method(
    impl,
    "xt.db.system.impl_common/ISourceRemote",
    "rpc_call_async"
  );
  return method_fn(impl,rpc_spec,args);
}

// xt.db.system.impl-common/ISourceRealtime [] 
export var ISourceRealtime = proto.create_protocol_fn("xt.db.system.impl_common/ISourceRealtime",{
  "subscribe_db":{"name":"subscribe_db","arglist":["impl","conn_id","topics"]},
  "unsubscribe_db":{
    "name":"unsubscribe_db",
    "arglist":["impl","conn_id","topics"]
  }
});

// xt.db.system.impl-common/subscribe-db [] 
export function subscribe_db(impl,conn_id,topics){
  let method_fn = proto.protocol_method(
    impl,
    "xt.db.system.impl_common/ISourceRealtime",
    "subscribe_db"
  );
  return method_fn(impl,conn_id,topics);
}

// xt.db.system.impl-common/unsubscribe-db [] 
export function unsubscribe_db(impl,conn_id,topics){
  let method_fn = proto.protocol_method(
    impl,
    "xt.db.system.impl_common/ISourceRealtime",
    "unsubscribe_db"
  );
  return method_fn(impl,conn_id,topics);
}

// xt.db.system.impl-common/ISourceLocal [] 
export var ISourceLocal = proto.create_protocol_fn("xt.db.system.impl_common/ISourceLocal",{
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

// xt.db.system.impl-common/clear-db [] 
export function clear_db(impl){
  let method_fn = proto.protocol_method(impl,"xt.db.system.impl_common/ISourceLocal","clear_db");
  return method_fn(impl);
}

// xt.db.system.impl-common/pull [] 
export function pull(impl,tree){
  let method_fn = proto.protocol_method(impl,"xt.db.system.impl_common/ISourceLocal","pull");
  return method_fn(impl,tree);
}

// xt.db.system.impl-common/record-add [] 
export function record_add(impl,table_name,records){
  let method_fn = proto.protocol_method(impl,"xt.db.system.impl_common/ISourceLocal","record_add");
  return method_fn(impl,table_name,records);
}

// xt.db.system.impl-common/record-delete [] 
export function record_delete(impl,table_name,ids){
  let method_fn = proto.protocol_method(impl,"xt.db.system.impl_common/ISourceLocal","record_delete");
  return method_fn(impl,table_name,ids);
}

// xt.db.system.impl-common/process-add-event [] 
export function process_add_event(impl,data){
  let method_fn = proto.protocol_method(
    impl,
    "xt.db.system.impl_common/ISourceLocal",
    "process_add_event"
  );
  return method_fn(impl,data);
}

// xt.db.system.impl-common/process-remove-event [] 
export function process_remove_event(impl,data){
  let method_fn = proto.protocol_method(
    impl,
    "xt.db.system.impl_common/ISourceLocal",
    "process_remove_event"
  );
  return method_fn(impl,data);
}

// xt.db.system.impl-common/ISourceLifecycle [] 
export var ISourceLifecycle = proto.create_protocol_fn(
  "xt.db.system.impl_common/ISourceLifecycle",
  {"stop_db":{"name":"stop_db","arglist":["impl"]}}
);

// xt.db.system.impl-common/stop-db [] 
export function stop_db(impl){
  let method_fn = proto.protocol_method(impl,"xt.db.system.impl_common/ISourceLifecycle","stop_db");
  return method_fn(impl);
}

// xt.db.system.impl-common/add-db-listener-default [38] 
export function add_db_listener_default(impl,listener_id,handle){
  let {listeners} = impl;
  listeners[listener_id] = handle;
  return listener_id;
}

// xt.db.system.impl-common/remove-db-listener-default [44] 
export function remove_db_listener_default(impl,listener_id){
  let {listeners} = impl;
  delete(listeners[listener_id]);
  return listener_id;
}

// xt.db.system.impl-common/get-db-listener-default [50] 
export function get_db_listener_default(impl,listener_id,handle){
  let {listeners} = impl;
  return listeners[listener_id];
}

// xt.db.system.impl-common/sync-get-tables [56] 
export function sync_get_tables(payload){
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

// xt.db.system.impl-common/sync-notify-listeners [71] 
export function sync_notify_listeners(impl,tables,event){
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
            "db/sync":xtd.get_in(event,["db/sync",table]),
            "db/remove":xtd.get_in(event,["db/remove",table])
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

// xt.db.system.impl-common/sync-process-payload [104] 
export function sync_process_payload(impl,payload){
  let db_sync = payload["db/sync"];
  let db_remove = payload["db/remove"];
  if(((null != db_sync) && ("object" == (typeof db_sync)) && !Array.isArray(db_sync)) && xtd.not_emptyp(db_sync)){
    process_add_event(impl,db_sync);
  }
  if(((null != db_remove) && ("object" == (typeof db_remove)) && !Array.isArray(db_remove)) && xtd.not_emptyp(db_remove)){
    for(let [table_name,ids] of Object.entries(db_remove)){
      record_delete(impl,table_name,ids);
    };
  }
  let tables = sync_get_tables(payload);
  if(tables.length > 0){
    sync_notify_listeners(impl,tables,payload);
  }
  return true;
}