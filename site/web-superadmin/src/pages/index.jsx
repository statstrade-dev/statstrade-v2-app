'use client'

import React from 'react'

import * as page_proxy from '@xtalk/substrate/page-proxy.js'

import * as runtime from '@xtalk/db/node/runtime.js'

import * as client_base from '@xtalk/db/node/client-base.js'

import * as ext_page from '@statstrade/edge/lib/js/react/ext-page.js'

import * as admin from '@statstrade/component/layout/admin-page.jsx'

import * as devtool from '@statstrade/component/layout/common/frame-devtool.jsx'

import * as substrate from '@xtalk/substrate/substrate.js'

import * as browser_transport from '@xtalk/substrate/transport-browser.js'

// statstrade-superadmin.pages.index/PING-RPC [20] 
var PING_RPC = {
  "id":"ping",
  "schema":"stats_rpc",
  "input":[],
  "return":"text",
  "flags":{}
};

// statstrade-superadmin.pages.index/createWorkerSource [27] 
function createWorkerSource(){
  return browser_transport.sharedworker_url_source(
    "/workers/web.sharedworker.js?v=2",
    {"type":"module","name":"statstrade-superadmin"}
  );
}

// statstrade-superadmin.pages.index/createConfig [35] 
function createConfig(){
  let url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
  let secured = url.protocol == "https:";
  let pathname = url.pathname;
  return {
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

// statstrade-superadmin.pages.index/createClient [52] 
function createClient(){
  return substrate.node_create({"id":"statstrade-superadmin-client"});
}

// statstrade-superadmin.pages.index/initState [56] 
async function initState(client){
  return await runtime.sharedworker_connect_state(client,createConfig(),{},{},createWorkerSource(),null);
}

// statstrade-superadmin.pages.index/initNode [68] 
async function initNode(){
  let client = createClient();
  let state = await initState(client);
  return {"client":client,"state":state};
}

// statstrade-superadmin.pages.index/attachPing [75] 
async function attachPing(resource){
  let client = resource["client"];
  let page_args = {
    "space_id":"room/superadmin",
    "group_id":"system",
    "model_id":"ping"
  };
  await client_base.rpc_attach_model(
    client,
    "db/primary",
    page_args,
    PING_RPC,
    {"pipeline":{},"options":{},"defaults":{"args":[],"output":{}}},
    {}
  );
  return resource;
}

// statstrade-superadmin.pages.index/initPing [94] 
async function initPing(resource){
  return await attachPing(resource);
}

// statstrade-superadmin.pages.index/initProxy [98] 
async function initProxy(resource){
  await page_proxy.group_open_proxy(resource["client"],"room/superadmin","system",{});
  return resource;
}

// statstrade-superadmin.pages.index/callPing [108] 
function callPing(resource){
  return page_proxy.model_proxy_call(resource["client"],"room/superadmin","system","ping",[],true,{});
}

// statstrade-superadmin.pages.index/closeNode [120] 
async function closeNode(resource){
  if(resource && !resource["closed"]){
    resource["closed"] = true;
    let client = resource["client"];
    let page_args = {
      "space_id":"room/superadmin",
      "group_id":"system",
      "model_id":"ping"
    };
    try{
      await client_base.detach_model(client,"db/primary",page_args,{});
    }
    catch(e){
      null;
    }
    await runtime.sharedworker_disconnect(resource["state"]);
  }
  return true;
}

// statstrade-superadmin.pages.index/initPage [134] 
async function initPage(){
  let resource = await initNode();
  try{
    await initPing(resource);
    await initProxy(resource);
    return resource;
  }
  catch(e){
    await closeNode(resource);
    throw e;
  }
}

// statstrade-superadmin.pages.index/PingApp [145] 
function PingApp({resource}){
  let client = resource["client"];
  devtool.useDevtoolSharedWorker(resource);
  let output = ext_page.listenModel(client,"room/superadmin",["system","ping"],"output",{});
  let [busy,setBusy] = React.useState(false);
  let [error,setError] = React.useState(null);
  let onPing = async function (){
    if(!busy){
      setBusy(true);
      setError(null);
      try{
        await callPing(resource);
      }
      catch(e){
        setError("error");
      }
      finally{
        setBusy(false);
      }
    }
  };
  let output_text = ((typeof output) == "string") ? output : "ready";
  return React.createElement("div",{},React.createElement(
    "button",
    {"disabled":busy,"onClick":onPing},
    busy ? "Pinging..." : "Ping"
  ),React.createElement("div",{},output_text),error ? React.createElement("div",{},error) : null);
}

// statstrade-superadmin.pages.index/Page [186] 
function Page(){
  let [readyState,setReadyState] = React.useState("loading");
  let [resource,setResource] = React.useState(null);
  React.useEffect(function (){
    let cancelled = false;
    let page = null;
    let run = async function (){
      try{
        page = await initPage();
        if(cancelled){
          await closeNode(page);
        }
        else{
          setResource(page);
          setReadyState("ready");
        }
      }
      catch(e){
        if(!cancelled){
          setReadyState("error");
        }
      }
    };
    run();
    return function (){
      cancelled = true;
      if(page){
        closeNode(page);
      }
    };
  },[]);
  return (readyState == "ready") ? React.createElement(admin.AdminApp,{"resource":resource}) : React.createElement(
    "div",
    {},
    (readyState == "error") ? "XTalk admin: error" : "XTalk admin: loading"
  );
}

export default Page