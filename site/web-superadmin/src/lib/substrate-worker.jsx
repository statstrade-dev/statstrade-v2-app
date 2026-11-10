import * as shared from '@statstrade/edge/substrate/worker.jsx'

import * as common from '@statstrade/web-superadmin/lib/substrate-common.jsx'

// statstrade-superadmin.lib.substrate-worker/SubstrateContext [11] 
export var SubstrateContext = common.SubstrateContext;

// statstrade-superadmin.lib.substrate-worker/pageSpaceId [13] 
export function pageSpaceId(scope_id,page_id){
  return "statstrade-superadmin/" + scope_id + "/" + page_id;
}

// statstrade-superadmin.lib.substrate-worker/createWorkerSource [18] 
export function createWorkerSource(worker_url){
  return shared.createWorkerSource(worker_url);
}

// statstrade-superadmin.lib.substrate-worker/createConfig [19] 
export function createConfig(token,actor_id){
  return shared.createConfig(token,actor_id);
}

// statstrade-superadmin.lib.substrate-worker/initNode [20] 
export async function initNode(client_id,worker_url,config){
  return await shared.initNode(client_id,worker_url,config);
}

// statstrade-superadmin.lib.substrate-worker/closeNode [21] 
export async function closeNode(resource){
  return await shared.closeNode(resource);
}

// statstrade-superadmin.lib.substrate-worker/useSubstrateContext [23] 
export function useSubstrateContext(){
  return common.useSubstrateContext();
}

// statstrade-superadmin.lib.substrate-worker/useSubstrateNode [29] 
export function useSubstrateNode(options){
  return common.useSubstrateNode(options,initNode,closeNode);
}

// statstrade-superadmin.lib.substrate-worker/SubstrateProvider [35] 
export function SubstrateProvider({children,options}){
  return common.SubstrateProvider(children,options,initNode,closeNode);
}