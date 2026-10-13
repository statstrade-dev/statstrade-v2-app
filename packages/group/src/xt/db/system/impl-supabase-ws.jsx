import * as proto from '@statstrade/edge/lib/xt/lang/common-protocol.jsx'

// xt.db.system.impl-supabase-ws/ISupabaseWebsocketFactory [] 
export var ISupabaseWebsocketFactory = proto.create_protocol_fn("xt.db.system.impl_supabase_ws/ISupabaseWebsocketFactory",{
  "create_ws_client":{"name":"create_ws_client","arglist":["impl","defaults"]}
});

// xt.db.system.impl-supabase-ws/create-ws-client [] 
export function create_ws_client(impl,defaults){
  let method_fn = proto.protocol_method(
    impl,
    "xt.db.system.impl_supabase_ws/ISupabaseWebsocketFactory",
    "create_ws_client"
  );
  return method_fn(impl,defaults);
}