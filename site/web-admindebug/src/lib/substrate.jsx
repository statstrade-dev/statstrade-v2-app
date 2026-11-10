import * as worker from '@statstrade/edge/substrate/worker.jsx'

import * as common from '@statstrade/edge/substrate/common.jsx'

import * as devtool from '@statstrade/component/layout/common/frame-devtool.jsx'

// statstrade-admindebug.lib.substrate/createConfig [5] 
export function createConfig(token,actor_id){
  return worker.createConfig(token,"admindebug/" + (actor_id || "GUEST"));
}

// statstrade-admindebug.lib.substrate/useSubstrateContext [7] 
export function useSubstrateContext(){
  return worker.useSubstrateContext();
}

// statstrade-admindebug.lib.substrate/SubstrateProvider [8] 
export function SubstrateProvider({children,options}){
  let state = worker.useSubstrateNode(options);
  devtool.useDevtoolSharedWorker(state.resource);
  return common.StateProvider(children,state);
}