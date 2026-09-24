import React from 'react'

import * as ext_page from '@statstrade/edge/lib/js/react/ext-page.js'

import * as ext_box from '@statstrade/edge/lib/js/react/ext-box.js'

// statsui.edge.global-ui/GlobalUI [11] 
globalThis["statsui_edge_global_ui$$GlobalUI"] = ext_box.createBox({"scroll":null,"targets":{}});

// statsui.edge.global-ui/getUI [16] 
export function getUI(path){
  return ext_box.getData(globalThis["statsui_edge_global_ui$$GlobalUI"],path);
}

// statsui.edge.global-ui/setUI [23] 
export function setUI(path,value){
  return ext_box.setData(globalThis["statsui_edge_global_ui$$GlobalUI"],path,value);
}

// statsui.edge.global-ui/useListenUI [30] 
export function useListenUI(path,meta){
  return ext_box.useListenBox(globalThis["statsui_edge_global_ui$$GlobalUI"],path,meta);
}

// statsui.edge.global-ui/useUI [37] 
export function useUI(path,meta){
  return ext_box.useBox(globalThis["statsui_edge_global_ui$$GlobalUI"],path,meta);
}

// statsui.edge.global-ui/showToast [44] 
export function showToast({title,message,...options}){
  getUI(["toast"]).show(title,{message,"duration":10000,...options});
}

// statsui.edge.global-ui/hideToast [52] 
export function hideToast({title,message,...options}){
  getUI(["toast"]).hide();
}

// statsui.edge.global-ui/useSyncContext [59] 
export function useSyncContext(data){
  React.useEffect(function (){
    ext_box.setData(
      globalThis["statsui_edge_global_ui$$GlobalUI"],
      ["dev","context"],
      data
    );
  },[data]);
}

// statsui.edge.global-ui/usePathContext [66] 
export function usePathContext(path,data){
  React.useEffect(function (){
    ext_box.setData(
      globalThis["statsui_edge_global_ui$$GlobalUI"],
      ["dev",...path],
      data
    );
    return function (){
      ext_box.delData(
        globalThis["statsui_edge_global_ui$$GlobalUI"],
        ["dev",...path]
      );
    };
  },[path,data]);
}