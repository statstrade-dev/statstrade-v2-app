const impl = require("@xtalk/db/system/impl-neon.js")

const http_fetch = require("@xtalk/net/http-fetch.js")

const js_native = require("@xtalk/net/net/http-fetch.js")

function provider(){
  return {"create_client":create_client,"create_impl":impl.impl_neon};
}

function create_client(defaults){
  return js_native.create(
    defaults,
    [http_fetch.wrap_prepare_input,http_fetch.wrap_normalise]
  );
}

module.exports = {["provider"]:provider,["create_client"]:create_client}