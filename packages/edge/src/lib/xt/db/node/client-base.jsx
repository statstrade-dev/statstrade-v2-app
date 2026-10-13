import * as proxy_util from '@statstrade/edge/lib/xt/db/node/proxy-util.jsx'

// xt.db.node.client-base/kernel-init [19] 
export function kernel_init(node,config,schema,lookup,opts){
  return proxy_util.request_client(node,"@xt.db/kernel-init",[config,schema,lookup],opts);
}

// xt.db.node.client-base/kernel-setup [26] 
export function kernel_setup(node,config,schema,lookup,opts){
  return proxy_util.request_client(node,"@xt.db/kernel-setup",[config,schema,lookup],opts);
}

// xt.db.node.client-base/kernel-teardown [33] 
export function kernel_teardown(node,config,opts){
  return proxy_util.request_client(node,"@xt.db/kernel-teardown",[config],opts);
}

// xt.db.node.client-base/subscribe-db [40] 
export function subscribe_db(node,primary_id,conn_id,topics,opts){
  return proxy_util.request_client(node,"@xt.db/subscribe-db",[primary_id,conn_id,topics],opts);
}

// xt.db.node.client-base/unsubscribe-db [47] 
export function unsubscribe_db(node,primary_id,conn_id,topics,opts){
  return proxy_util.request_client(node,"@xt.db/unsubscribe-db",[primary_id,conn_id,topics],opts);
}

// xt.db.node.client-base/sync-cached [54] 
export function sync_cached(node,primary_id,payload,opts){
  return proxy_util.request_client(node,"@xt.db/sync-cached",[primary_id,payload],opts);
}

// xt.db.node.client-base/attach-model [61] 
export function attach_model(node,primary_id,page_args,model_spec,opts){
  return proxy_util.request_client(
    node,
    "@xt.db/attach-model",
    [primary_id,page_args,model_spec],
    opts
  );
}

// xt.db.node.client-base/detach-model [68] 
export function detach_model(node,primary_id,page_args,opts){
  return proxy_util.request_client(node,"@xt.db/detach-model",[primary_id,page_args],opts);
}

// xt.db.node.client-base/rpc-call [75] 
export function rpc_call(node,service_id,rpc_spec,rpc_args,opts){
  return proxy_util.request_client(node,"@xt.db/rpc-call",[service_id,rpc_spec,rpc_args],opts);
}

// xt.db.node.client-base/rpc-attach-model [82] 
export function rpc_attach_model(node,primary_id,page_args,rpc_spec,model,opts){
  return proxy_util.request_client(
    node,
    "@xt.db/rpc-attach-model",
    [primary_id,page_args,rpc_spec,model],
    opts
  );
}

// xt.db.node.client-base/pull-call [89] 
export function pull_call(node,primary_id,tree,opts){
  return proxy_util.request_client(node,"@xt.db/pull-call",[primary_id,tree],opts);
}

// xt.db.node.client-base/pull-cached [96] 
export function pull_cached(node,primary_id,tree,opts){
  return proxy_util.request_client(node,"@xt.db/pull-cached",[primary_id,tree],opts);
}

// xt.db.node.client-base/pull-attach-model [103] 
export function pull_attach_model(node,primary_id,page_args,tree,model,opts){
  return proxy_util.request_client(
    node,
    "@xt.db/pull-attach-model",
    [primary_id,page_args,tree,model],
    opts
  );
}

// xt.db.node.client-base/dataview-call [110] 
export function dataview_call(node,primary_id,dataview,opts){
  return proxy_util.request_client(node,"@xt.db/dataview-call",[primary_id,dataview],opts);
}

// xt.db.node.client-base/dataview-cached [117] 
export function dataview_cached(node,primary_id,dataview,opts){
  return proxy_util.request_client(node,"@xt.db/dataview-cached",[primary_id,dataview],opts);
}

// xt.db.node.client-base/dataview-attach-model [124] 
export function dataview_attach_model(node,primary_id,page_args,dataview,model,opts){
  return proxy_util.request_client(
    node,
    "@xt.db/dataview-attach-model",
    [primary_id,page_args,dataview,model],
    opts
  );
}