import * as main_client from '@statstrade/edge/lib/xt/db/system/main-client.jsx'

import * as memory from '@statstrade/edge/lib/xt/db/system/impl-memory.jsx'

import * as protocol from '@statstrade/edge/lib/xt/lang/common-protocol.jsx'

import * as common from '@statstrade/edge/lib/xt/db/system/impl-common.jsx'

// xt.db.system.main/create-impl [12] 
export function create_impl(type,defaults,schema,lookup,...optional){
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

// xt.db.system.main/create-impl-init [22] 
export function create_impl_init(impl){
  if(protocol.protocol_implements(impl,common.ISourceInit["on"])){
    return common.init_db(impl);
  }
  return Promise.resolve().then(function (){
    return impl;
  });
}