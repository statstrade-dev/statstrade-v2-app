import * as proto from '@statstrade/edge/lib/xt/lang/common-protocol.jsx'

// xt.net.conn-sql/ISqlClient [] 
export var ISqlClient = proto.create_protocol_fn("xt.net.conn_sql/ISqlClient",{
  "connect":{"name":"connect","arglist":["client","opts"]},
  "disconnect":{"name":"disconnect","arglist":["client"]},
  "query":{"name":"query","arglist":["client","input"]},
  "query_async":{"name":"query_async","arglist":["client","input"]}
});

// xt.net.conn-sql/connect [] 
export function connect(client,opts){
  let method_fn = proto.protocol_method(client,"xt.net.conn_sql/ISqlClient","connect");
  return method_fn(client,opts);
}

// xt.net.conn-sql/disconnect [] 
export function disconnect(client){
  let method_fn = proto.protocol_method(client,"xt.net.conn_sql/ISqlClient","disconnect");
  return method_fn(client);
}

// xt.net.conn-sql/query [] 
export function query(client,input){
  let method_fn = proto.protocol_method(client,"xt.net.conn_sql/ISqlClient","query");
  return method_fn(client,input);
}

// xt.net.conn-sql/query-async [] 
export function query_async(client,input){
  let method_fn = proto.protocol_method(client,"xt.net.conn_sql/ISqlClient","query_async");
  return method_fn(client,input);
}

// xt.net.conn-sql/SqlConnection [] 
export function SqlConnection(raw,impl){
  globalThis["xt_lang_common_protocol$$IMPLEMENTATIONS"]["xt.net.conn_sql/SqlConnection"] = true;
  proto.register_protocol_impl(ISqlClient["on"],"xt.net.conn_sql/SqlConnection",{
    "connect":connection_connect,
    "disconnect":connection_disconnect,
    "query":connection_query,
    "query_async":connection_query_async
  });
  return {
    "::":"xt.net.conn_sql/SqlConnection",
    "::/protocols":[ISqlClient["on"]],
    "::/protocol-impls":{
        [ISqlClient["on"]]:{
          "connect":connection_connect,
          "disconnect":connection_disconnect,
          "query":connection_query,
          "query_async":connection_query_async
        }
      },
    "raw":raw,
    "impl":impl
  };
}

// xt.net.conn-sql/connection-disconnect [15] 
export function connection_disconnect(client){
  let {impl,raw} = client;
  let disconnect_fn = impl["disconnect"];
  return disconnect_fn(raw);
}

// xt.net.conn-sql/connection-query [21] 
export function connection_query(client,input){
  let {impl,raw} = client;
  let query_fn = impl["query"] || impl["query_sync"];
  return query_fn(raw,input);
}

// xt.net.conn-sql/connection-query-async [28] 
export function connection_query_async(client,input){
  let {impl,raw} = client;
  let query_async_fn = impl["query_async"] || impl["query"];
  return query_async_fn(raw,input);
}

// xt.net.conn-sql/connection-connect [35] 
export function connection_connect(client,opts){
  let {impl} = client;
  let connect_fn = impl["connect"];
  if(null == connect_fn){
    return client;
  }
  else{
    return connect_fn(client["raw"],opts);
  }
}

// xt.net.conn-sql/connection-create [51] 
export function connection_create(raw,impl){
  return SqlConnection(raw,impl);
}