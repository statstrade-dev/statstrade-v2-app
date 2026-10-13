import * as runtime from '@xtalk/db/node/runtime.js'

import * as common from '@statstrade/web-superadmin/lib/substrate-common.jsx'

import * as substrate from '@xtalk/substrate/substrate.js'

import * as browser_transport from '@xtalk/substrate/transport-browser.js'

// statstrade-superadmin.lib.substrate-worker/SubstrateContext [11] 
export var SubstrateContext = common.SubstrateContext;

// statstrade-superadmin.lib.substrate-worker/pageSpaceId [13] 
export function pageSpaceId(scope_id,page_id){
  return "statstrade-superadmin/" + scope_id + "/" + page_id;
}

// statstrade-superadmin.lib.substrate-worker/createWorkerSource [18] 
export function createWorkerSource(worker_url){
  return browser_transport.sharedworker_url_source(
    worker_url,
    {"type":"module","name":"statstrade-shared-worker"}
  );
}

// statstrade-superadmin.lib.substrate-worker/createConfig [26] 
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

// statstrade-superadmin.lib.substrate-worker/initNode [41] 
export async function initNode(client_id,worker_url,config){
  let client = substrate.node_create({"id":client_id || "statstrade-superadmin-client"});
  let node_config = config || createConfig(null,null);
  let state = await runtime.sharedworker_connect_state(
    client,
    node_config,
    {},
    {},
    createWorkerSource(worker_url || "/workers/web.sharedworker.js"),
    null
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

// statstrade-superadmin.lib.substrate-worker/closeNode [62] 
export async function closeNode(resource){
  if(resource && !resource["closed"]){
    resource["closed"] = true;
    await runtime.sharedworker_disconnect(resource["state"]);
  }
  return true;
}

// statstrade-superadmin.lib.substrate-worker/useSubstrateContext [70] 
export function useSubstrateContext(){
  return common.useSubstrateContext();
}

// statstrade-superadmin.lib.substrate-worker/useSubstrateNode [76] 
export function useSubstrateNode(options){
  return common.useSubstrateNode(options,initNode,closeNode);
}

// statstrade-superadmin.lib.substrate-worker/SubstrateProvider [82] 
export function SubstrateProvider({children,options}){
  return common.SubstrateProvider(children,options,initNode,closeNode);
}