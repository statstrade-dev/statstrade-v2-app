'use client'

import React from 'react'

import * as page_proxy from '@xtalk/substrate/page-proxy.js'

import * as layout_super from '@statstrade/component/layout/layout-super.jsx'

import * as runtime from '@xtalk/db/node/runtime.js'

import * as client_base from '@xtalk/db/node/client-base.js'

import * as ext_page from '@statstrade/edge/lib/js/react/ext-page.js'

import * as devtool from '@statstrade/component/layout/common/frame-devtool.jsx'

import * as substrate from '@xtalk/substrate/substrate.js'

import * as browser_transport from '@xtalk/substrate/transport-browser.js'

// statstrade-superadmin.pages.demos.show-ping/PING-RPC [24] 
var PING_RPC = "ping";

// statstrade-superadmin.pages.demos.show-ping/createWorkerSource [27] 
function createWorkerSource(){
  return browser_transport.sharedworker_url_source(
    "/workers/web.sharedworker.js",
    {"type":"module","name":"statstrade-superadmin"}
  );
}

// statstrade-superadmin.pages.demos.show-ping/createConfig [35] 
function createConfig(){
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

// statstrade-superadmin.pages.demos.show-ping/createClient [53] 
function createClient(){
  return substrate.node_create({"id":"statstrade-superadmin-demo-ping"});
}

// statstrade-superadmin.pages.demos.show-ping/initState [57] 
async function initState(client){
  return await runtime.sharedworker_connect_state(client,createConfig(),{},{},createWorkerSource(),null);
}

// statstrade-superadmin.pages.demos.show-ping/initNode [69] 
async function initNode(){
  let client = createClient();
  let state = await initState(client);
  return {"client":client,"state":state};
}

// statstrade-superadmin.pages.demos.show-ping/attachPing [76] 
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

// statstrade-superadmin.pages.demos.show-ping/initPing [95] 
async function initPing(resource){
  return await attachPing(resource);
}

// statstrade-superadmin.pages.demos.show-ping/initProxy [99] 
async function initProxy(resource){
  await page_proxy.group_open_proxy(resource["client"],"room/superadmin","system",{});
  return resource;
}

// statstrade-superadmin.pages.demos.show-ping/callPing [109] 
function callPing(resource){
  return page_proxy.model_proxy_call(resource["client"],"room/superadmin","system","ping",[],true,{});
}

// statstrade-superadmin.pages.demos.show-ping/closeNode [121] 
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

// statstrade-superadmin.pages.demos.show-ping/initPage [135] 
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

// statstrade-superadmin.pages.demos.show-ping/PingApp [146] 
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

// statstrade-superadmin.pages.demos.show-ping/Page [187] 
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
  return (
    <layout_super.LayoutSuper>
      {(readyState == "ready") ? React.createElement(PingApp,{"resource":resource}) : React.createElement(
        "div",
        {},
        (readyState == "error") ? "XTalk ping: error" : "XTalk ping: loading"
      )}
    </layout_super.LayoutSuper>);
}

export default Page