import React from 'react'

// statstrade-superadmin.lib.substrate-common/SubstrateContext [9] 
export var SubstrateContext = React.createContext(null);

// statstrade-superadmin.lib.substrate-common/createConfig [11] 
export function createConfig(cache_type,cache_defaults){
  let url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
  let secured = url.protocol == "https:";
  let pathname = url.pathname;
  return {
    "site_map_url":"/worker/site-map/manifest.json",
    "primary":{
        "type":"supabase",
        "defaults":{
            "host":url.hostname,
            "port":url.port ? url.port : (secured ? 443 : 80),
            "secured":secured,
            "basepath":(pathname == "/") ? "" : pathname,
            "apikey":process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          }
      },
    "caching":{"type":cache_type,"defaults":cache_defaults || {}}
  };
}

// statstrade-superadmin.lib.substrate-common/useSubstrateContext [30] 
export function useSubstrateContext(){
  return React.useContext(SubstrateContext);
}

// statstrade-superadmin.lib.substrate-common/useSubstrateNode [36] 
export function useSubstrateNode(options,init_fn,close_fn){
  let settings = options || {};
  let client_id = settings["client_id"] || "statstrade-superadmin-client";
  let worker_url = settings["worker_url"];
  let config = settings["config"];
  let [readyState,setReadyState] = React.useState("loading");
  let [resource,setResource] = React.useState(null);
  let [error,setError] = React.useState(null);
  React.useEffect(function (){
    let cancelled = false;
    let page = null;
    let run_fn = async function (){
      try{
        page = await init_fn(client_id,worker_url,config);
        if(cancelled){
          await close_fn(page);
        }
        else{
          setResource(page);
          setReadyState("ready");
        }
      }
      catch(err){
        if(!cancelled){
          setError(err["message"] || "XTalk substrate: error");
          setReadyState("error");
        }
      }
    };
    run_fn();
    return function (){
      cancelled = true;
      if(page){
        close_fn(page);
      }
    };
  },[client_id,worker_url,config,init_fn,close_fn]);
  return {readyState,resource,error};
}

// statstrade-superadmin.lib.substrate-common/SubstrateProvider [77] 
export function SubstrateProvider(children,options,init_fn,close_fn){
  let state = useSubstrateNode(options,init_fn,close_fn);
  let readyState = state["readyState"];
  let error = state["error"];
  return (readyState == "ready") ? (
    <SubstrateContext.Provider value={state}>{children}</SubstrateContext.Provider>) : ((readyState == "error") ? (
    <div>{error || "XTalk substrate: error"}</div>) : (
    <div>XTalk substrate: loading</div>));
}