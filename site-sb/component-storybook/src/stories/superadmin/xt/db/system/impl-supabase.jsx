import * as impl_realtime from '@statstrade/edge/lib/xt/db/system/impl-supabase-realtime.jsx'

import * as xtd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as proto from '@statstrade/edge/lib/xt/lang/common-protocol.jsx'

import * as impl_common from '@statstrade/edge/lib/xt/db/system/impl-common.jsx'

import * as pgrest_graph from '@statstrade/edge/lib/xt/db/text/pgrest-graph.jsx'

import * as addon from '@statstrade/edge/lib/xt/net/addon-supabase.jsx'

import * as supabase_ws from '@statstrade/edge/lib/xt/db/system/impl-supabase-ws.jsx'

import * as http_fetch from '@statstrade/edge/lib/xt/net/http-fetch.jsx'

import * as str from '@statstrade/edge/lib/xt/lang/common-string.jsx'

import * as http_util from '@statstrade/edge/lib/xt/net/http-util.jsx'

// xt.db.system.impl-supabase/ImplSupabase [] 
export function ImplSupabase(client,schema,lookup,state,listeners,opts,metadata){
  globalThis["xt_lang_common_protocol$$IMPLEMENTATIONS"]["xt.db.system.impl_supabase/ImplSupabase"] = true;
  proto.register_protocol_impl(
    impl_common.ISourceRemote["on"],
    "xt.db.system.impl_supabase/ImplSupabase",
    {"pull_async":pull_async,"rpc_call_async":rpc_call_async}
  );
  proto.register_protocol_impl(impl_common.ISourceListener["on"],"xt.db.system.impl_supabase/ImplSupabase",{
    "add_db_listener":impl_common.add_db_listener_default,
    "remove_db_listener":impl_common.remove_db_listener_default,
    "get_db_listener":impl_common.get_db_listener_default
  });
  proto.register_protocol_impl(impl_common.ISourceRealtime["on"],"xt.db.system.impl_supabase/ImplSupabase",{
    "subscribe_db":impl_realtime.subscribe,
    "unsubscribe_db":impl_realtime.unsubscribe
  });
  proto.register_protocol_impl(
    supabase_ws.ISupabaseWebsocketFactory["on"],
    "xt.db.system.impl_supabase/ImplSupabase",
    {"create_ws_client":create_ws_client}
  );
  return {
    "::/protocol-impls":{
        [impl_common.ISourceRemote["on"]]:{"pull_async":pull_async,"rpc_call_async":rpc_call_async},
        [impl_common.ISourceListener["on"]]:{
          "add_db_listener":impl_common.add_db_listener_default,
          "remove_db_listener":impl_common.remove_db_listener_default,
          "get_db_listener":impl_common.get_db_listener_default
        },
        [impl_common.ISourceRealtime["on"]]:{
          "subscribe_db":impl_realtime.subscribe,
          "unsubscribe_db":impl_realtime.unsubscribe
        },
        [supabase_ws.ISupabaseWebsocketFactory["on"]]:{"create_ws_client":create_ws_client}
      },
    "schema":schema,
    "lookup":lookup,
    "opts":opts,
    "::":"xt.db.system.impl_supabase/ImplSupabase",
    "metadata":metadata,
    "::/protocols":[
        impl_common.ISourceRemote["on"],
        impl_common.ISourceListener["on"],
        impl_common.ISourceRealtime["on"],
        supabase_ws.ISupabaseWebsocketFactory["on"]
      ],
    "state":state,
    "client":client,
    "listeners":listeners
  };
}

// xt.db.system.impl-supabase/cmd-pull-async [20] 
export function cmd_pull_async(impl,tree){
  let {client,lookup,opts,schema} = impl;
  let request = pgrest_graph.select(schema,tree,opts);
  let table_name = tree[0];
  let schema_name = lookup[table_name]["schema"];
  let headers = Object.assign(
    Object.assign({},request["headers"]),
    schema_name ? {"Accept-Profile":schema_name,"Content-Profile":schema_name} : null
  );
  return Object.assign({"path":request["url"],"method":"GET"},{"headers":headers});
}

// xt.db.system.impl-supabase/pull-async [42] 
export function pull_async(impl,tree){
  let {client} = impl;
  let input = cmd_pull_async(impl,tree);
  return http_fetch.request_http(client,input).then(http_util.get_body_data);
}

// xt.db.system.impl-supabase/cmd-rpc-call-async [52] 
export function cmd_rpc_call_async(impl,rpc_spec,args,opts){
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
  return addon.cmd_rpc_call(
    str.replace(rpc_spec["id"],"-","_"),
    body,
    Object.assign(Object.assign({},opts),{"headers":headers})
  );
}

// xt.db.system.impl-supabase/rpc-call-async [74] 
export function rpc_call_async(impl,rpc_spec,args,opts){
  let {client} = impl;
  let input = cmd_rpc_call_async(impl,rpc_spec,args,opts);
  return http_fetch.request_http(client,input).then(http_util.get_body_data);
}

// xt.db.system.impl-supabase/create-ws-client [82] 
export function create_ws_client(impl,defaults){
  let create_fn = xtd.get_in(impl,["client","create_ws_client"]);
  if(null == create_fn){
    throw "Supabase websocket client factory is not configured";
  }
  return create_fn(defaults);
}

// xt.db.system.impl-supabase/impl-supabase [107] 
export function impl_supabase(client,schema,lookup){
  let impl = ImplSupabase(
    client,
    schema,
    lookup,
    {"session":null,"auto_refresh":null,"realtimes":{}},
    {},
    {},
    {}
  );
  impl["::/override"] = {"create_ws_client":create_ws_client};
  return impl;
}