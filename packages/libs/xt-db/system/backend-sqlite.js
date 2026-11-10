const js_native = require("@xtalk/net/net/conn-sqlite.js")

const impl = require("@xtalk/db/system/impl-sqlite.js")

function provider(){
  return {"create_client":create_client,"create_impl":impl.impl_sqlite};
}

function create_client(defaults){
  return js_native.create(defaults);
}

module.exports = {["provider"]:provider,["create_client"]:create_client}