import * as proto from '@statstrade/edge/lib/xt/lang/common-protocol.jsx'

import * as impl_common from '@statstrade/edge/lib/xt/db/system/impl-common.jsx'

import * as sql_call from '@statstrade/edge/lib/xt/db/text/sql-call.jsx'

import * as sql_util from '@statstrade/edge/lib/xt/db/text/sql-util.jsx'

import * as sql_graph from '@statstrade/edge/lib/xt/db/text/sql-graph.jsx'

import * as conn_sql from '@statstrade/edge/lib/xt/net/conn-sql.jsx'

// xt.db.system.impl-postgres/ImplPostgres [] 
export function ImplPostgres(client,schema,lookup,listeners,opts,metadata){
  globalThis["xt_lang_common_protocol$$IMPLEMENTATIONS"]["xt.db.system.impl_postgres/ImplPostgres"] = true;
  proto.register_protocol_impl(
    impl_common.ISourceRemote["on"],
    "xt.db.system.impl_postgres/ImplPostgres",
    {"pull_async":pull_async,"rpc_call_async":rpc_call_async}
  );
  proto.register_protocol_impl(impl_common.ISourceListener["on"],"xt.db.system.impl_postgres/ImplPostgres",{
    "add_db_listener":impl_common.add_db_listener_default,
    "remove_db_listener":impl_common.remove_db_listener_default,
    "get_db_listener":impl_common.get_db_listener_default
  });
  proto.register_protocol_impl(
    impl_common.ISourceLifecycle["on"],
    "xt.db.system.impl_postgres/ImplPostgres",
    {"stop_db":stop_db}
  );
  return {
    "::/protocol-impls":{
        [impl_common.ISourceRemote["on"]]:{"pull_async":pull_async,"rpc_call_async":rpc_call_async},
        [impl_common.ISourceListener["on"]]:{
          "add_db_listener":impl_common.add_db_listener_default,
          "remove_db_listener":impl_common.remove_db_listener_default,
          "get_db_listener":impl_common.get_db_listener_default
        },
        [impl_common.ISourceLifecycle["on"]]:{"stop_db":stop_db}
      },
    "schema":schema,
    "lookup":lookup,
    "opts":opts,
    "::":"xt.db.system.impl_postgres/ImplPostgres",
    "metadata":metadata,
    "::/protocols":[
        impl_common.ISourceRemote["on"],
        impl_common.ISourceListener["on"],
        impl_common.ISourceLifecycle["on"]
      ],
    "client":client,
    "listeners":listeners
  };
}

// xt.db.system.impl-postgres/pull-async [16] 
export function pull_async(impl,tree){
  let {client,opts,schema} = impl;
  return conn_sql.query_async(client,sql_graph.select(schema,tree,opts));
}

// xt.db.system.impl-postgres/rpc-call-async [26] 
export function rpc_call_async(impl,rpc_spec,args){
  let {client} = impl;
  return sql_call.call_raw(client,rpc_spec,args);
}

// xt.db.system.impl-postgres/stop-db [32] 
export function stop_db(impl){
  let {client} = impl;
  conn_sql.disconnect(client);
  return null;
}

// xt.db.system.impl-postgres/impl-postgres [55] 
export function impl_postgres(client,schema,lookup){
  return ImplPostgres(client,schema,lookup,{},sql_util.postgres_opts(lookup),{});
}

// xt.db.system.impl-postgres/impl-postgres-init [60] 
export function impl_postgres_init(impl){
  let {client,lookup,opts,schema} = impl;
  return conn_sql.connect(client).then(function (client){
    return impl;
  });
}