import * as js_sqlite from '@statstrade/edge/lib/js/net/conn-sqlite.jsx'

import * as js_ws from '@statstrade/edge/lib/js/net/ws-native.jsx'

import * as js_postgres from '@statstrade/edge/lib/js/net/conn-postgres.jsx'

import * as addon from '@statstrade/edge/lib/xt/net/addon-supabase.jsx'

import * as js_fetch from '@statstrade/edge/lib/js/net/http-fetch.jsx'

// xt.db.system.main-client/create-client [20] 
export function create_client(type,defaults){
  if(type == "sqlite"){
    return js_sqlite.create(defaults);
  }
  else if(type == "postgres"){
    return js_postgres.create(defaults);
  }
  else if(type == "supabase"){
    let client = js_fetch.create(defaults,addon.middleware_supabase());
    client["create_ws_client"] = js_ws.create;
    return client;
  }
  else{
    return null;
  }
}