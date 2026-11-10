import * as xtd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as protocol from '@statstrade/edge/lib/xt/lang/common-protocol.jsx'

import * as base_tree from '@statstrade/edge/lib/xt/db/text/base-tree.jsx'

import * as impl_common from '@statstrade/edge/lib/xt/db/system/impl-common.jsx'

import * as page_core from '@statstrade/edge/lib/xt/substrate/page-core.jsx'

import * as impl_main from '@statstrade/edge/lib/xt/db/system/main.jsx'

import * as substrate from '@statstrade/edge/lib/xt/substrate.jsx'

import * as site_map from '@statstrade/edge/lib/xt/db/node/site-map.jsx'

// xt.db.node.kernel-base/get-primary-impl [26] 
export function get_primary_impl(node,service_id){
  let impl = substrate.get_service(node,service_id);
  let primary_id = xtd.get_in(impl,["metadata","primary_id"]);
  if(primary_id){
    return substrate.get_service(node,primary_id);
  }
  else{
    return impl;
  }
}

// xt.db.node.kernel-base/get-caching-impl [36] 
export function get_caching_impl(node,service_id){
  let impl = substrate.get_service(node,service_id);
  let caching_id = xtd.get_in(impl,["metadata","caching_id"]);
  if(caching_id){
    return substrate.get_service(node,caching_id);
  }
}

// xt.db.node.kernel-base/kernel-create-config [46] 
export function kernel_create_config(config){
  let common = Object.assign({"id":"db/common"},config["common"]);
  let primary = Object.assign({"id":"db/primary"},config["primary"]);
  let caching = Object.assign({"id":"db/caching"},config["caching"]);
  return {"common":common,"primary":primary,"caching":caching};
}

// xt.db.node.kernel-base/kernel-check-exists [58] 
export function kernel_check_exists(node,config){
  config = kernel_create_config(config);
  return (null != substrate.get_service(node,xtd.get_in(config,["common","id"]))) && (null != substrate.get_service(node,xtd.get_in(config,["primary","id"]))) && (null != substrate.get_service(node,xtd.get_in(config,["caching","id"])));
}

// xt.db.node.kernel-base/set-backends [68] 
export function set_backends(node,backends){
  xtd.set_in(node,["state","db_backends"],backends || {});
  return node;
}

// xt.db.node.kernel-base/kernel-setup-single [74] 
export function kernel_setup_single(node,service_id,type,defaults,schema,lookup){
  return impl_main.create_impl_init(impl_main.create_impl(
    type,
    defaults,
    schema,
    lookup,
    xtd.get_in(node,["state","db_backends"])
  )).then(function (impl){
    substrate.set_service(node,service_id,impl);
    return node;
  });
}

// xt.db.node.kernel-base/kernel-teardown-single [86] 
export function kernel_teardown_single(node,service_id){
  let impl = substrate.get_service(node,service_id);
  if(protocol.protocol_implements(impl,impl_common.ISourceLifecycle["on"])){
    impl_common.stop_db(impl);
  }
  substrate.remove_service(node,service_id);
  return node;
}

// xt.db.node.kernel-base/kernel-setup-main [102] 
export function kernel_setup_main(node,config,schema,lookup){
  config = kernel_create_config(config);
  let common_id = xtd.get_in(config,["common","id"]);
  let primary_id = xtd.get_in(config,["primary","id"]);
  let caching_id = xtd.get_in(config,["caching","id"]);
  substrate.set_service(node,common_id,{
    "config":config,
    "schema":schema,
    "lookup":lookup,
    "metadata":{"common_id":common_id}
  });
  return Promise.all([
    kernel_setup_single(
      node,
      primary_id,
      xtd.get_in(config,["primary","type"]),
      xtd.get_in(config,["primary","defaults"]),
      schema,
      lookup
    ),
    kernel_setup_single(
      node,
      caching_id,
      xtd.get_in(config,["caching","type"]),
      xtd.get_in(config,["caching","defaults"]),
      schema,
      lookup
    )
  ]).then(function (init){
    Object.assign((substrate.get_service(node,primary_id))["metadata"],{
      "common_id":common_id,
      "caching_id":caching_id,
      "caching_fn":function (){
            return substrate.get_service(node,caching_id);
          }
    });
    Object.assign((substrate.get_service(node,caching_id))["metadata"],{
      "common_id":common_id,
      "primary_id":primary_id,
      "primary_fn":function (){
            return substrate.get_service(node,primary_id);
          }
    });
    return {"status":"setup","data":config};
  });
}

// xt.db.node.kernel-base/kernel-setup-handler [145] 
export function kernel_setup_handler(space,args,request,node){
  let config = args[0];
  let schema = args[1];
  let lookup = args[2];
  return kernel_setup_main(node,config,schema,lookup);
}

// xt.db.node.kernel-base/kernel-teardown-main [162] 
export function kernel_teardown_main(node,config){
  config = kernel_create_config(config);
  kernel_teardown_single(node,xtd.get_in(config,["primary","id"]));
  kernel_teardown_single(node,xtd.get_in(config,["caching","id"]));
  substrate.remove_service(node,xtd.get_in(config,["common","id"]));
  delete(node["meta"]["xt.db/kernel-init"]);
  delete(node["meta"]["xt.db/site-map"]);
  return {"status":"teardown","data":config};
}

// xt.db.node.kernel-base/kernel-teardown-handler [176] 
export function kernel_teardown_handler(space,args,request,node){
  let config = args[0];
  if("string" == (typeof config)){
    let common_id = xtd.get_in(substrate.get_service(node,config),["metadata","common_id"]);
    config = xtd.get_in(substrate.get_service(node,common_id),["config"]);
  }
  return kernel_teardown_main(node,config);
}

// xt.db.node.kernel-base/kernel-store-site-map-rpc [194] 
export function kernel_store_site_map_rpc(node,config,loaded){
  let setup_config = kernel_create_config(config);
  let common_id = xtd.get_in(setup_config,["common","id"]);
  let common = substrate.get_service(node,common_id);
  common["rpc"] = (loaded["rpc"] || {});
  return loaded;
}

// xt.db.node.kernel-base/kernel-init-main [206] 
export function kernel_init_main(node,config,schema,lookup){
  let meta = node["meta"];
  let pending = xtd.get_in(meta,["xt.db/kernel-init"]);
  if(null != pending){
    return pending.then(function (_){
      return kernel_init_main(node,config,schema,lookup);
    });
  }
  let init = site_map.load_site_map(node,config,schema,lookup).then(function (loaded){
    let next_schema = loaded["schema"] || schema;
    let next_lookup = loaded["lookup"] || lookup;
    if(kernel_check_exists(node,config)){
      kernel_store_site_map_rpc(node,config,loaded);
      return Promise.resolve().then(function (){
        return {"status":"no_change","data":kernel_create_config(config)};
      });
    }
    else{
      let setup = kernel_setup_main(node,config,next_schema,next_lookup);
      return setup.then(function (result){
        kernel_store_site_map_rpc(node,config,loaded);
        return result;
      });
    }
  });
  let guarded = init.then(function (result){
    delete(meta["xt.db/kernel-init"]);
    return result;
  }).catch(function (err){
    delete(meta["xt.db/kernel-init"]);
    throw err;
  });
  meta["xt.db/kernel-init"] = guarded;
  return guarded;
}

// xt.db.node.kernel-base/kernel-init-handler [255] 
export function kernel_init_handler(space,args,request,node){
  let config = args[0];
  let schema = args[1];
  let lookup = args[2];
  return kernel_init_main(node,config,schema,lookup);
}

// xt.db.node.kernel-base/subscribe-db-handler [278] 
export function subscribe_db_handler(space,args,request,node){
  let primary_id = args[0];
  let conn_id = args[1];
  let topics = args[2];
  let primary = get_primary_impl(node,primary_id);
  return impl_common.subscribe_db(primary,conn_id,topics);
}

// xt.db.node.kernel-base/unsubscribe-db-handler [289] 
export function unsubscribe_db_handler(space,args,request,node){
  let primary_id = args[0];
  let conn_id = args[1];
  let topics = args[2];
  let primary = get_primary_impl(node,primary_id);
  return impl_common.unsubscribe_db(primary,conn_id,topics);
}

// xt.db.node.kernel-base/sync-cached-handler [300] 
export function sync_cached_handler(space,args,request,node){
  let primary_id = args[0];
  let payload = args[1];
  let caching = get_caching_impl(node,primary_id);
  return impl_common.sync_process_payload(caching,payload);
}

// xt.db.node.kernel-base/attach-base-model [315] 
export function attach_base_model(node,primary_id,space_id,group_id,model_id,model_spec){
  page_core.group_add_attach(node,space_id,group_id,{[model_id]:model_spec});
  let refresh_map = xtd.get_in(model_spec,["options","refresh"]);
  let caching = get_caching_impl(node,primary_id);
  if(caching && ((null != refresh_map) && ("object" == (typeof refresh_map)) && !Array.isArray(refresh_map))){
    impl_common.add_db_listener(caching,space_id + "/" + group_id + "/" + model_id,{
      "guard":refresh_map,
      "callback":function (event){
            return page_core.model_update(node,space_id,group_id,model_id,event);
          }
    });
  }
  return {
    "status":"attached",
    "space":space_id,
    "group":group_id,
    "model":model_id
  };
}

// xt.db.node.kernel-base/attach-model-handler [339] 
export function attach_model_handler(space,args,request,node){
  let primary_id = args[0];
  let page_args = args[1];
  let {group_id,model_id,space_id} = page_args;
  let model_spec = args[2];
  return attach_base_model(node,primary_id,space_id,group_id,model_id,model_spec);
}

// xt.db.node.kernel-base/detach-base-model [356] 
export function detach_base_model(node,primary_id,space_id,group_id,model_id){
  page_core.model_remove(node,space_id,group_id,model_id);
  let caching = get_caching_impl(node,primary_id);
  if(null != caching){
    impl_common.remove_db_listener(caching,space_id + "/" + group_id + "/" + model_id);
  }
  return {
    "status":"removed",
    "space":space_id,
    "group":group_id,
    "model":model_id
  };
}

// xt.db.node.kernel-base/detach-model-handler [371] 
export function detach_model_handler(space,args,request,node){
  let primary_id = args[0];
  let page_args = args[1];
  let {group_id,model_id,space_id} = page_args;
  return detach_base_model(node,primary_id,space_id,group_id,model_id);
}

// xt.db.node.kernel-base/rpc-resolve [388] 
export function rpc_resolve(node,primary_id,rpc_spec){
  if("string" == (typeof rpc_spec)){
    let primary = get_primary_impl(node,primary_id);
    let common_id = xtd.get_in(primary,["metadata","common_id"]);
    let common = substrate.get_service(node,common_id);
    let resolved = xtd.get_in(common,["rpc",rpc_spec]);
    if(null == resolved){
      throw "Unknown site-map RPC: " + rpc_spec;
    }
    return resolved;
  }
  else{
    return rpc_spec;
  }
}

// xt.db.node.kernel-base/rpc-call-baseline-fn [403] 
export function rpc_call_baseline_fn(node,primary_id,rpc_spec,rpc_args){
  rpc_spec = rpc_resolve(node,primary_id,rpc_spec);
  let primary = get_primary_impl(node,primary_id);
  return impl_common.rpc_call_async(primary,rpc_spec,rpc_args).then(function (result){
    let {table} = rpc_spec;
    let caching = get_caching_impl(node,primary_id);
    if(table && caching){
      let {base,type} = table;
      impl_common.sync_process_payload(caching,{[type]:{[base]:result}});
    }
    return result;
  });
}

// xt.db.node.kernel-base/rpc-call-handler [420] 
export function rpc_call_handler(space,args,request,node){
  let service_id = args[0];
  let rpc_spec = args[1];
  let rpc_args = args[2];
  return rpc_call_baseline_fn(node,service_id,rpc_spec,rpc_args);
}

// xt.db.node.kernel-base/rpc-create-model [430] 
export function rpc_create_model(primary_id,rpc_spec,model){
  let {defaults,options,pipeline} = model;
  let rpc_handler = function (context){
    let {args,node,space} = context;
    return rpc_call_baseline_fn(node,primary_id,rpc_spec,args);
  };
  return {
    "handler":rpc_handler,
    "pipeline":xtd.obj_assign_nested({
        "remote":{
            "handler":function (context){
                let {node} = context;
                let {args} = context;
                return rpc_call_baseline_fn(node,primary_id,rpc_spec,args);
              }
          }
      },pipeline),
    "defaults":defaults,
    "options":options
  };
}

// xt.db.node.kernel-base/rpc-attach-model [453] 
export function rpc_attach_model(space,args,request,node){
  let primary_id = args[0];
  let page_args = args[1];
  let rpc_spec = rpc_resolve(node,primary_id,args[2]);
  let model = args[3];
  let {group_id,model_id,space_id} = page_args;
  let model_spec = rpc_create_model(primary_id,rpc_spec,model);
  return attach_base_model(node,primary_id,space_id,group_id,model_id,model_spec);
}

// xt.db.node.kernel-base/pull-call-baseline-fn [475] 
export function pull_call_baseline_fn(node,primary_id,tree){
  let primary = get_primary_impl(node,primary_id);
  return impl_common.pull_async(primary,tree).then(function (result){
    let table = tree[0];
    let caching = get_caching_impl(node,primary_id);
    if(caching){
      let payload = {"db/sync":{[table]:result}};
      impl_common.sync_process_payload(caching,payload);
    }
    return result;
  });
}

// xt.db.node.kernel-base/pull-call-handler [491] 
export function pull_call_handler(space,args,request,node){
  let primary_id = args[0];
  let tree = args[1];
  return pull_call_baseline_fn(node,primary_id,tree);
}

// xt.db.node.kernel-base/pull-cached-handler [500] 
export function pull_cached_handler(space,args,request,node){
  let primary_id = args[0];
  let tree = args[1];
  let caching = get_caching_impl(node,primary_id);
  return impl_common.pull(caching,tree);
}

// xt.db.node.kernel-base/pull-create-model [510] 
export function pull_create_model(primary_id,tree,model){
  let {defaults,options,pipeline} = model;
  let table = tree[0];
  return {
    "handler":function (context){
        let {node} = context;
        let caching = get_caching_impl(node,primary_id);
        return impl_common.pull(caching,tree);
      },
    "pipeline":xtd.obj_assign_nested({
        "remote":{
            "handler":function (context){
                let {node} = context;
                return pull_call_baseline_fn(node,primary_id,tree);
              }
          }
      },pipeline),
    "defaults":defaults,
    "options":options
  };
}

// xt.db.node.kernel-base/pull-attach-model [532] 
export function pull_attach_model(space,args,request,node){
  let primary_id = args[0];
  let page_args = args[1];
  let tree = args[2];
  let model = args[3];
  let {group_id,model_id,space_id} = page_args;
  let model_spec = pull_create_model(primary_id,tree,model);
  return attach_base_model(node,primary_id,space_id,group_id,model_id,model_spec);
}

// xt.db.node.kernel-base/dataview-prep-tree [552] 
export function dataview_prep_tree(impl,dataview){
  let {schema} = impl;
  let ok_value = base_tree.plan_view(
    schema,
    Object.assign({"select_args":[],"return_args":[]},dataview)
  );
  let [ok,tree] = ok_value;
  if(!ok){
    throw Object.assign(new Error("Invalid Dataview"),{"data":dataview});
  }
  return tree;
}

// xt.db.node.kernel-base/dataview-call-baseline-fn [565] 
export function dataview_call_baseline_fn(node,primary_id,dataview){
  let impl = get_primary_impl(node,primary_id);
  let tree = dataview_prep_tree(impl,dataview);
  return impl_common.pull_async(impl,tree).then(function (result){
    let {table} = dataview;
    let caching = get_caching_impl(node,primary_id);
    if(caching){
      let payload = {"db/sync":{[table]:result}};
      impl_common.sync_process_payload(caching,payload);
    }
    return result;
  });
}

// xt.db.node.kernel-base/dataview-call-handler [581] 
export function dataview_call_handler(space,args,request,node){
  let primary_id = args[0];
  let dataview = args[1];
  return dataview_call_baseline_fn(node,primary_id,dataview);
}

// xt.db.node.kernel-base/dataview-cached-handler [590] 
export function dataview_cached_handler(space,args,request,node){
  let primary_id = args[0];
  let dataview = args[1];
  let caching = get_caching_impl(node,primary_id);
  let tree = dataview_prep_tree(caching,dataview);
  return impl_common.pull(caching,tree);
}

// xt.db.node.kernel-base/dataview-create-model [601] 
export function dataview_create_model(primary_id,dataview,model){
  let {defaults,options,pipeline} = model;
  let {table} = dataview;
  return {
    "handler":function (context){
        let {node} = context;
        let {args} = context;
        let caching = get_caching_impl(node,primary_id);
        let {schema} = caching;
        let ok_value = base_tree.plan_view(schema,Object.assign(
          Object.assign({"select_args":[],"return_args":[]},args[0]),
          dataview
        ));
        let [ok,tree] = ok_value;
        if(!ok){
          throw Object.assign(new Error("Invalid Dataview"),{"data":dataview});
        }
        return impl_common.pull(caching,tree);
      },
    "pipeline":xtd.obj_assign_nested({
        "remote":{
            "handler":function (context){
                let {node} = context;
                let {args} = context;
                return dataview_call_baseline_fn(
                  node,
                  primary_id,
                  Object.assign(Object.assign({},dataview),args[0])
                );
              }
          }
      },pipeline),
    "defaults":defaults,
    "options":options
  };
}

// xt.db.node.kernel-base/dataview-attach-model [639] 
export function dataview_attach_model(space,args,request,node){
  let primary_id = args[0];
  let page_args = args[1];
  let dataview = args[2];
  let model = args[3];
  let {group_id,model_id,space_id} = page_args;
  let model_spec = dataview_create_model(primary_id,dataview,model);
  return attach_base_model(node,primary_id,space_id,group_id,model_id,model_spec);
}

// xt.db.node.kernel-base/init-handlers [660] 
export function init_handlers(node){
  substrate.register_handler(node,"@xt.db/kernel-init",kernel_init_handler);
  substrate.register_handler(node,"@xt.db/kernel-setup",kernel_setup_handler);
  substrate.register_handler(node,"@xt.db/kernel-teardown",kernel_teardown_handler);
  substrate.register_handler(node,"@xt.db/subscribe-db",subscribe_db_handler,null);
  substrate.register_handler(node,"@xt.db/unsubscribe-db",unsubscribe_db_handler,null);
  substrate.register_handler(node,"@xt.db/sync-cached",sync_cached_handler,null);
  substrate.register_handler(node,"@xt.db/attach-model",attach_model_handler,null);
  substrate.register_handler(node,"@xt.db/detach-model",detach_model_handler,null);
  substrate.register_handler(node,"@xt.db/rpc-call",rpc_call_handler,null);
  substrate.register_handler(node,"@xt.db/rpc-attach-model",rpc_attach_model,null);
  substrate.register_handler(node,"@xt.db/pull-call",pull_call_handler,null);
  substrate.register_handler(node,"@xt.db/pull-cached",pull_cached_handler,null);
  substrate.register_handler(node,"@xt.db/pull-attach-model",pull_attach_model,null);
  substrate.register_handler(node,"@xt.db/dataview-call",dataview_call_handler,null);
  substrate.register_handler(node,"@xt.db/dataview-cached",dataview_cached_handler,null);
  substrate.register_handler(node,"@xt.db/dataview-attach-model",dataview_attach_model,null);
  return node;
}