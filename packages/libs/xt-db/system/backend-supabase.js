const impl = require("@xtalk/db/system/impl-supabase.js")

const js_ws = require("@xtalk/net/net/ws-native.js")

const addon = require("@xtalk/net/addon-supabase.js")

const js_native = require("@xtalk/net/net/http-fetch.js")

function provider(){
  return {
    "create_client":create_client,
    "create_impl":impl.impl_supabase
  };
}

function create_client(defaults){
  let client = js_native.create(defaults,addon.middleware_supabase());
  client["create_ws_client"] = js_ws.create;
  return client;
}

module.exports = {["provider"]:provider,["create_client"]:create_client}