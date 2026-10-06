import React from 'react'

import * as runtime from '@xtalk/db/node/runtime.js'

import * as substrate from '@xtalk/substrate/substrate.js'

import * as browser_transport from '@xtalk/substrate/transport-browser.js'

// statstrade-superadmin.worker/createWorkerSource [14] 
export function createWorkerSource(worker_url){
  return browser_transport.sharedworker_url_source(worker_url,{"type":"module","name":"statstrade-superadmin"});
}

// statstrade-superadmin.worker/createWorkerConfig [22] 
export function createWorkerConfig(){
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
    "caching":{"type":"sqlite","defaults":{"filename":":memory:"}}
  };
}

// statstrade-superadmin.worker/initNode [40] 
export async function initNode(client_id,worker_url,config){
  let client = substrate.node_create({"id":client_id});
  let worker_config = config || createWorkerConfig();
  let state = await runtime.sharedworker_connect_state(client,worker_config,{},{},createWorkerSource(worker_url),null);
  return {"client":client,"state":state};
}

// statstrade-superadmin.worker/closeNode [55] 
export async function closeNode(resource){
  if(resource && !resource["closed"]){
    resource["closed"] = true;
    await runtime.sharedworker_disconnect(resource["state"]);
  }
  return true;
}

// statstrade-superadmin.worker/useSharedWorkerNode [63] 
export function useSharedWorkerNode(options){
  let settings = options || {};
  let client_id = settings["client_id"] || "statstrade-superadmin-client";
  let worker_url = settings["worker_url"] || "/workers/web.sharedworker.js";
  let config = settings["config"];
  let [readyState,setReadyState] = React.useState("loading");
  let [resource,setResource] = React.useState(null);
  React.useEffect(function (){
    let cancelled = false;
    let page = null;
    let run_fn = async function (){
      try{
        page = await initNode(client_id,worker_url,config);
        if(cancelled){
          await closeNode(page);
        }
        else{
          setResource(page);
          setReadyState("ready");
        }
      }
      catch(err){
        if(!cancelled){
          setReadyState("error");
        }
      }
    };
    run_fn();
    return function (){
      cancelled = true;
      if(page){
        closeNode(page);
      }
    };
  },[client_id,worker_url,config]);
  return {"readyState":readyState,"resource":resource};
}