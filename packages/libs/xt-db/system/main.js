const main_client = require("@xtalk/db/system/main-client.js")

const memory = require("@xtalk/db/system/impl-memory.js")

const protocol = require("@xtalk/lang/common-protocol.js")

const common = require("@xtalk/db/system/impl-common.js")

function create_impl(type,defaults,schema,lookup,...optional){
  let backends = (optional.length > 0) ? optional[0] : null;
  if(type == "memory"){
    return memory.impl_memory(schema,lookup);
  }
  let provider = main_client.get_provider(type,backends);
  let create = provider["create_impl"];
  if(!("function" == (typeof create))){
    throw "Backend provider is missing create_impl";
  }
  return create(
    main_client.create_client(type,defaults,backends),
    schema,
    lookup
  );
}

function create_impl_init(impl){
  if(protocol.protocol_implements(impl,common.ISourceInit["on"])){
    return common.init_db(impl);
  }
  return Promise.resolve().then(function (){
    return impl;
  });
}

module.exports = {
  ["create_impl"]:create_impl,
  ["create_impl_init"]:create_impl_init
}