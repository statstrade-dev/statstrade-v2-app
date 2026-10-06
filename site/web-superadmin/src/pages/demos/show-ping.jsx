'use client'

import * as T from 'tamagui'

import React from 'react'

import * as page_proxy from '@xtalk/substrate/page-proxy.js'

import * as runtime from '@xtalk/db/node/runtime.js'

import * as client_base from '@xtalk/db/node/client-base.js'

import * as ext_page from '@statstrade/edge/lib/js/react/ext-page.js'

import * as worker from '@statstrade/web-superadmin/worker.jsx'

import * as layout_base from '@statstrade/component/layout/layout-base.jsx'

import * as devtool from '@statstrade/component/layout/common/frame-devtool.jsx'

import * as logo from '@statstrade/component/logo/logo-statstrade.jsx'

// statstrade-superadmin.pages.demos.show-ping/PING-RPC [25] 
var PING_RPC = "ping";

// statstrade-superadmin.pages.demos.show-ping/initNode [28] 
async function initNode(){
  return await worker.initNode(
    "statstrade-superadmin-demo-ping",
    "/workers/web.sharedworker.js"
  );
}

// statstrade-superadmin.pages.demos.show-ping/attachPing [36] 
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

// statstrade-superadmin.pages.demos.show-ping/initPing [55] 
async function initPing(resource){
  return await attachPing(resource);
}

// statstrade-superadmin.pages.demos.show-ping/initProxy [59] 
async function initProxy(resource){
  await page_proxy.group_open_proxy(resource["client"],"room/superadmin","system",{});
  return resource;
}

// statstrade-superadmin.pages.demos.show-ping/callPing [69] 
function callPing(resource){
  return page_proxy.model_proxy_call(resource["client"],"room/superadmin","system","ping",[],true,{});
}

// statstrade-superadmin.pages.demos.show-ping/closeNode [81] 
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

// statstrade-superadmin.pages.demos.show-ping/initPage [95] 
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

// statstrade-superadmin.pages.demos.show-ping/PingApp [106] 
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
        setError("The ping failed. Please try again.");
      }
      finally{
        setBusy(false);
      }
    }
  };
  let output_text = ((typeof output) == "string") ? output : "ready";
  return (
    <T.YStack
      gap="$4"
      padding="$5"
      borderWidth={1}
      borderColor="$color4"
      borderRadius="$4"
      backgroundColor="$background">
      <T.XStack
        alignItems="center"
        justifyContent="space-between"
        gap="$3"
        flexWrap="wrap">
        <T.Text fontWeight="600" fontSize="$4">Service status</T.Text>
        <T.Text
          fontSize="$2"
          fontWeight="600"
          color={error ? "$red10" : ((output == "pong") ? "$green10" : "$color10")}>
          {busy ? "Checking..." : (error ? "Failed" : ((output == "pong") ? "Connected" : "Ready"))}
        </T.Text>
      </T.XStack>
      <T.YStack
        gap="$2"
        padding="$4"
        borderRadius="$3"
        backgroundColor="$color2"
        accessibilityLiveRegion="polite">
        <T.Text fontSize="$2" color="$color10">Response</T.Text>
        <T.Text fontFamily="monospace" fontSize="$6" color="$color12">{output_text}</T.Text>
      </T.YStack>
      <T.Button size="$4" disabled={busy} onPress={onPing}>{busy ? "Pinging..." : "Send ping"}</T.Button>
      {error ? (
        <T.Text color="$red10" fontSize="$3" accessibilityRole="alert">{error}</T.Text>) : null}
    </T.YStack>);
}

// statstrade-superadmin.pages.demos.show-ping/Page [174] 
function Page(){
  // 01ad4fee-ec81-46e0-a216-af95237904f9
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
    <layout_base.LayoutBase showDevtool={true}>
      <T.YStack
        minHeight="100vh"
        width="100%"
        padding="$5"
        alignItems="center"
        justifyContent="center"
        backgroundColor="$background">
        <T.YStack width="100%" maxWidth={560} gap="$5">
          <T.XStack alignItems="center" gap="$2">
            <logo.LogoStatstrade size={28}/>
            <T.Text fontSize="$3" fontWeight="700" color="$color12">STATSTRADE</T.Text>
          </T.XStack>
          <T.YStack gap="$2">
            <T.H2 color="$color12">Connection check</T.H2>
            <T.Text color="$color10" fontSize="$4">Send a ping to check the service connection.</T.Text>
          </T.YStack>
          {(readyState == "ready") ? (
            <PingApp resource={resource}/>) : (
            <T.YStack
              gap="$3"
              padding="$5"
              borderWidth={1}
              borderColor="$color4"
              borderRadius="$4"
              backgroundColor="$background"
              accessibilityLiveRegion="polite">
              {(readyState == "error") ? (
                <T.YStack gap="$2">
                  <T.Text fontWeight="600" color="$red10" accessibilityRole="alert">Unable to connect</T.Text>
                  <T.Text color="$color10">Refresh the page to try again.</T.Text>
                </T.YStack>) : (
                <T.XStack gap="$3" alignItems="center">
                  <T.Spinner size="small" color="$color10"/>
                  <T.Text color="$color10">Connecting to the service...</T.Text>
                </T.XStack>)}
            </T.YStack>)}
        </T.YStack>
      </T.YStack>
    </layout_base.LayoutBase>);
}

export default Page