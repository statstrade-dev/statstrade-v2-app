import * as xtd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as base_schema from '@statstrade/edge/lib/xt/db/text/base-schema.jsx'

import * as proto from '@statstrade/edge/lib/xt/lang/common-protocol.jsx'

import * as raw from '@statstrade/edge/lib/xt/db/text/sql-raw.jsx'

import * as manage from '@statstrade/edge/lib/xt/db/text/sql-manage.jsx'

import * as sql_table from '@statstrade/edge/lib/xt/db/text/sql-table.jsx'

import * as impl_common from '@statstrade/edge/lib/xt/db/system/impl-common.jsx'

import * as f from '@statstrade/edge/lib/xt/db/text/base-flatten.jsx'

import * as sql_util from '@statstrade/edge/lib/xt/db/text/sql-util.jsx'

import * as sql_graph from '@statstrade/edge/lib/xt/db/text/sql-graph.jsx'

import * as conn_sql from '@statstrade/edge/lib/xt/net/conn-sql.jsx'

// xt.db.system.impl-sqlite/ImplSqlite [] 
export function ImplSqlite(client,schema,lookup,listeners,opts,metadata){
  globalThis["xt_lang_common_protocol$$IMPLEMENTATIONS"]["xt.db.system.impl_sqlite/ImplSqlite"] = true;
  proto.register_protocol_impl(impl_common.ISourceLocal["on"],"xt.db.system.impl_sqlite/ImplSqlite",{
    "clear_db":clear_db,
    "pull":pull,
    "record_add":record_add,
    "record_delete":record_delete,
    "process_add_event":process_add_event,
    "process_remove_event":process_remove_event
  });
  proto.register_protocol_impl(
    impl_common.ISourceRemote["on"],
    "xt.db.system.impl_sqlite/ImplSqlite",
    {"pull_async":pull_async,"rpc_call_async":rpc_call_async}
  );
  proto.register_protocol_impl(impl_common.ISourceListener["on"],"xt.db.system.impl_sqlite/ImplSqlite",{
    "add_db_listener":impl_common.add_db_listener_default,
    "remove_db_listener":impl_common.remove_db_listener_default,
    "get_db_listener":impl_common.get_db_listener_default
  });
  return {
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
    "schema":schema,
    "lookup":lookup,
    "opts":opts,
    "::":"xt.db.system.impl_sqlite/ImplSqlite",
    "metadata":metadata,
    "::/protocols":[
        impl_common.ISourceLocal["on"],
        impl_common.ISourceRemote["on"],
        impl_common.ISourceListener["on"]
      ],
    "client":client,
    "listeners":listeners
  };
}

// xt.db.system.impl-sqlite/pull [20] 
export function pull(impl,tree){
  let {client,opts,schema} = impl;
  return conn_sql.query(client,sql_graph.select(schema,tree,opts));
}

// xt.db.system.impl-sqlite/pull-async [30] 
export function pull_async(impl,tree){
  return Promise.resolve().then(function (){
    return pull(impl,tree);
  });
}

// xt.db.system.impl-sqlite/record-add [37] 
export function record_add(impl,table_name,records){
  let {client,lookup,opts,schema} = impl;
  let input = sql_table.prepare_add_input({[table_name]:records},schema,lookup,opts);
  if("" == input){
    return null;
  }
  return conn_sql.query(client,input);
}

// xt.db.system.impl-sqlite/record-delete [54] 
export function record_delete(impl,table_name,ids){
  let {client,opts} = impl;
  let statements = ids.map(function (id){
    return raw.raw_delete(table_name,{"id":id},opts);
  });
  return conn_sql.query(client,statements.join("\n\n"));
}

// xt.db.system.impl-sqlite/process-add-event [73] 
export function process_add_event(impl,data){
  let {client,lookup,opts,schema} = impl;
  let flat = f.flatten_bulk(schema,data);
  conn_sql.query(client,sql_table.prepare_add_input(data,schema,lookup,opts));
  return xtd.arr_keep(base_schema.table_order(lookup),function (table_name){
    return (null != flat[table_name]) ? table_name : null;
  });
}

// xt.db.system.impl-sqlite/process-remove-event [91] 
export function process_remove_event(impl,data){
  let {client,lookup,opts,schema} = impl;
  let ordered = f.flatten_bulk_ids(schema,lookup,data);
  conn_sql.query(
    client,
    sql_table.prepare_remove_input(data,schema,lookup,opts)
  );
  return ordered.map(function (arr){
    return arr[0];
  });
}

// xt.db.system.impl-sqlite/clear-db [104] 
export function clear_db(impl){
  let {client,lookup,opts,schema} = impl;
  conn_sql.query(
    client,
    manage.table_drop_all(schema,lookup,opts).join("\n\n")
  );
  conn_sql.query(
    client,
    manage.table_create_all(schema,lookup,opts).join("\n\n")
  );
  return impl;
}

// xt.db.system.impl-sqlite/rpc-call-async [120] 
export function rpc_call_async(_impl,_rpc_spec,_args){
  throw "ImplSqlite does not support rpc_call_async";
}

// xt.db.system.impl-sqlite/impl-sqlite [152] 
export function impl_sqlite(client,schema,lookup){
  return ImplSqlite(client,schema,lookup,{},{
    "return_join_fn":function (arr){
        return "json_group_array(json_object(" + arr.join(", ") + "))";
      },
    "strict":false,
    "wrapper_fn":function (s,indent){
        return (indent < 2) ? s : ("(\n" + xt.lang.common_string.pad_lines(s,2," ") + ")");
      },
    "querystr_fn":sql_util.encode_query_string,
    "types":sql_util.SQLITE,
    "operators":{"ilike":"LIKE"},
    "values":{"cast":false,"replace":sql_util.SQLITE_FN},
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
    "column_fn":sql_util.default_quote_fn,
    "table_fn":sql_util.default_quote_fn
  },{});
}

// xt.db.system.impl-sqlite/impl-sqlite-init [157] 
export function impl_sqlite_init(impl){
  let {client,lookup,opts,schema} = impl;
  let sql = manage.table_create_all(schema,lookup,opts).join("\n\n");
  return conn_sql.connect(client,{}).then(function (client){
    if(0 < sql.length){
      conn_sql.query(client,sql);
    }
    return impl;
  });
}