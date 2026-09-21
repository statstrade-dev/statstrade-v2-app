import React from 'react'

import * as ext_box from '@statstrade/group/lib/js/react/ext-box'

// statsui.edge.global-store/GlobalStore [10] 
globalThis["sznui_lib_edge_global_store$$GlobalStore"] = ext_box.attachLocalStorage(
  "ST",
  ext_box.createBox({"account":null,"view":{},"flags":{},"context":{}}),
  "global.store",
  []
);

// statsui.edge.global-store/getStore [21] 
export function getStore(path){
  return ext_box.getData(globalThis["sznui_lib_edge_global_store$$GlobalStore"],path);
}

// statsui.edge.global-store/setStore [28] 
export function setStore(path,value){
  return ext_box.setData(
    globalThis["sznui_lib_edge_global_store$$GlobalStore"],
    path,
    value
  );
}

// statsui.edge.global-store/useListenStore [35] 
export function useListenStore(path,meta){
  return ext_box.useListenBox(
    globalThis["sznui_lib_edge_global_store$$GlobalStore"],
    path,
    meta
  );
}

// statsui.edge.global-store/useStore [42] 
export function useStore(path,meta){
  return ext_box.useBox(
    globalThis["sznui_lib_edge_global_store$$GlobalStore"],
    path,
    meta
  );
}

// statsui.edge.global-store/useSync [49] 
export function useSync(path,data){
  React.useEffect(function (){
    ext_box.setData(
      globalThis["sznui_lib_edge_global_store$$GlobalStore"],
      path,
      data
    );
  },[path,data]);
}