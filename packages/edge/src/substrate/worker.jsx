import * as runtime from '@statstrade/edge/lib/xt/db/node/runtime.jsx'

import * as proxy_supabase from '@statstrade/edge/lib/xt/db/node/proxy-supabase.jsx'

import * as common from '@statstrade/edge/substrate/common.jsx'

import * as substrate from '@statstrade/edge/lib/xt/substrate.jsx'

import * as browser_transport from '@statstrade/edge/lib/xt/substrate/transport-browser.jsx'

// statsui.edge.substrate.worker/SubstrateContext [13] 
export var SubstrateContext = common.SubstrateContext;

// statsui.edge.substrate.worker/pageSpaceId [15] 
export function pageSpaceId(scope_id,page_id){
  return (scope_id.startsWith("web-main/") ? "" : "statstrade-superadmin/") + scope_id + "/" + page_id;
}

// statsui.edge.substrate.worker/createWorkerSource [20] 
export function createWorkerSource(worker_url){
  return browser_transport.sharedworker_url_source(worker_url,{
    "type":"module",
    "name":process.env.NEXT_PUBLIC_SHAREDWORKER_NAME || "statstrade-shared-worker"
  });
}

// statsui.edge.substrate.worker/createConfig [28] 
export function createConfig(token,actor_id){
  let actor = actor_id || "GUEST";
  let config = common.createConfig("sqlite",{"filename":":memory:"});
  config["common"] = {"id":"db/common/" + actor};
  config["primary"]["id"] = ("db/primary/" + actor);
  config["caching"]["id"] = ("db/caching/" + actor);
  if(token){
    config["primary"]["defaults"]["token"] = token;
  }
  return config;
}

// statsui.edge.substrate.worker/initNode [43] 
export async function initNode(client_id,worker_url,config){
  let client = substrate.node_create({"id":client_id || "statstrade-superadmin-client"});
  let node_config = config || createConfig(null,null);
  let state = await runtime.sharedworker_connect_state(
    client,
    node_config,
    {},
    {},
    createWorkerSource(worker_url || "/workers/web.sharedworker.js"),
    null,
    {"init_proxy_handlers":[proxy_supabase.init_proxy_handlers]}
  );
  return {
    "client":client,
    "config":node_config,
    "state":state,
    "scope-id":client_id,
    "backend":"worker",
    "closed":false
  };
}

// statsui.edge.substrate.worker/closeNode [65] 
export async function closeNode(resource){
  if(resource && !resource["closed"]){
    resource["closed"] = true;
    await runtime.sharedworker_disconnect(resource["state"]);
  }
  return true;
}

// statsui.edge.substrate.worker/useSubstrateContext [73] 
export function useSubstrateContext(){
  return common.useSubstrateContext();
}

// statsui.edge.substrate.worker/useSubstrateNode [79] 
export function useSubstrateNode(options){
  return common.useSubstrateNode(options,initNode,closeNode);
}

// statsui.edge.substrate.worker/SubstrateProvider [85] 
export function SubstrateProvider({children,options}){
  return common.SubstrateProvider(children,options,initNode,closeNode);
}