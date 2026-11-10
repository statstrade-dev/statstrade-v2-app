import * as shared from '@statstrade/edge/substrate/common.jsx'

import * as devtool from '@statstrade/component/layout/common/frame-devtool.jsx'

// statstrade-superadmin.lib.substrate-common/SubstrateContext [6] 
export var SubstrateContext = shared.SubstrateContext;

// statstrade-superadmin.lib.substrate-common/createConfig [7] 
export function createConfig(cache_type,cache_defaults){
  return shared.createConfig(cache_type,cache_defaults);
}

// statstrade-superadmin.lib.substrate-common/useSubstrateContext [8] 
export function useSubstrateContext(){
  return shared.useSubstrateContext();
}

// statstrade-superadmin.lib.substrate-common/useSubstrateNode [9] 
export function useSubstrateNode(options,init_fn,close_fn){
  let state = shared.useSubstrateNode(options,init_fn,close_fn);
  devtool.useDevtoolSharedWorker(state.resource);
  return state;
}

// statstrade-superadmin.lib.substrate-common/SubstrateProvider [13] 
export function SubstrateProvider(children,options,init_fn,close_fn){
  return shared.StateProvider(children,useSubstrateNode(options,init_fn,close_fn));
}