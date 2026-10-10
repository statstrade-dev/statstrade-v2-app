import * as runtime from '@xtalk/db/node/runtime.js'

import * as common from '@statstrade/web-superadmin/lib/substrate-common.jsx'

import * as substrate from '@xtalk/substrate/substrate.js'

import * as browser_transport from '@xtalk/substrate/transport-browser.js'

// statstrade-superadmin.lib.substrate-worker/SubstrateContext [11] 
export var SubstrateContext = common.SubstrateContext;

// statstrade-superadmin.lib.substrate-worker/createWorkerSource [13] 
export function createWorkerSource(worker_url){
  return browser_transport.sharedworker_url_source(worker_url,{"type":"module","name":"statstrade-superadmin"});
}

// statstrade-superadmin.lib.substrate-worker/createConfig [21] 
export function createConfig(){
  return common.createConfig("sqlite",{"filename":":memory:"});
}

// statstrade-superadmin.lib.substrate-worker/initNode [26] 
export async function initNode(client_id,worker_url,config){
  let client = substrate.node_create({"id":client_id || "statstrade-superadmin-client"});
  let node_config = config || createConfig();
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
    "backend":"worker",
    "closed":false
  };
}

// statstrade-superadmin.lib.substrate-worker/closeNode [46] 
export async function closeNode(resource){
  if(resource && !resource["closed"]){
    resource["closed"] = true;
    await runtime.sharedworker_disconnect(resource["state"]);
  }
  return true;
}

// statstrade-superadmin.lib.substrate-worker/useSubstrateContext [54] 
export function useSubstrateContext(){
  return common.useSubstrateContext();
}

// statstrade-superadmin.lib.substrate-worker/useSubstrateNode [60] 
export function useSubstrateNode(options){
  return common.useSubstrateNode(options,initNode,closeNode);
}

// statstrade-superadmin.lib.substrate-worker/SubstrateProvider [66] 
export function SubstrateProvider({children,options}){
  return common.SubstrateProvider(children,options,initNode,closeNode);
}