import * as runtime from '@xtalk/db/node/runtime.js'

import * as client_base from '@xtalk/db/node/client-base.js'

import * as common from '@statstrade/web-superadmin/lib/substrate-common.jsx'

import * as substrate from '@xtalk/substrate/substrate.js'

// statstrade-superadmin.lib.substrate-bare/SubstrateContext [11] 
export var SubstrateContext = common.SubstrateContext;

// statstrade-superadmin.lib.substrate-bare/createConfig [13] 
export function createConfig(token){
  let config = common.createConfig("memory",{});
  if(token){
    config["primary"]["defaults"]["token"] = token;
  }
  return config;
}

// statstrade-superadmin.lib.substrate-bare/initNode [21] 
export async function initNode(client_id,worker_url,config){
  let client = substrate.node_create({"id":client_id || "statstrade-superadmin-client"});
  runtime.init_server(client);
  let node_config = config || createConfig();
  let init = await client_base.kernel_init(client,node_config,{},{},{});
  return {
    "client":client,
    "config":node_config,
    "state":{"connection":null,"init":init},
    "backend":"bare",
    "closed":false
  };
}

// statstrade-superadmin.lib.substrate-bare/closeNode [36] 
export async function closeNode(resource){
  if(resource && !resource["closed"]){
    resource["closed"] = true;
    await client_base.kernel_teardown(resource["client"],resource["config"],{});
  }
  return true;
}

// statstrade-superadmin.lib.substrate-bare/useSubstrateContext [47] 
export function useSubstrateContext(){
  return common.useSubstrateContext();
}

// statstrade-superadmin.lib.substrate-bare/useSubstrateNode [53] 
export function useSubstrateNode(options){
  return common.useSubstrateNode(options,initNode,closeNode);
}

// statstrade-superadmin.lib.substrate-bare/SubstrateProvider [59] 
export function SubstrateProvider({children,options}){
  return common.SubstrateProvider(children,options,initNode,closeNode);
}