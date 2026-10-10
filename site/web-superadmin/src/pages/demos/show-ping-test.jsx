'use client'

import * as T from 'tamagui'

import React from 'react'

import * as substrate from '@statstrade/web-superadmin/lib/substrate-bare.jsx'

import * as ext_page from '@statstrade/edge/lib/js/react/ext-page.js'

import * as page_base from '@xtalk/db/node/page-base.js'

import * as layout_base from '@statstrade/component/layout/layout-base.jsx'

import * as logo from '@statstrade/component/logo/logo-statstrade.jsx'

// statstrade-superadmin.pages.demos.show-ping-test/PING-PAGE [21] 
var PING_PAGE = {
  "group_id":"demos/show-ping-test",
  "models":{
    "ping":{
      "rpc":"ping",
      "model":{"pipeline":{},"options":{},"defaults":{"args":[],"output":{}}}
    }
  }
};

// statstrade-superadmin.pages.demos.show-ping-test/usePingProps [31] 
function usePingProps(page){
  let output = ext_page.listenModel(
    page["client"],
    page["space_id"],
    ["demos/show-ping-test","ping"],
    "output",
    {}
  );
  let [busy,setBusy] = React.useState(false);
  let [error,setError] = React.useState(null);
  let actions = {
    "ping":async function (){
        if(!busy){
          setBusy(true);
          setError(null);
          try{
            await ext_page.remoteCall(
              page["client"],
              page["space_id"],
              ["demos/show-ping-test","ping"],
              [],
              true
            );
          }
          catch(e){
            setError("The live Supabase ping failed. Please try again.");
          }
          finally{
            setBusy(false);
          }
        }
      }
  };
  let views = {
    "output_text":((typeof output) == "string") ? output : "ready",
    "output":output,
    "busy":busy,
    "error":error
  };
  return {actions,views};
}

// statstrade-superadmin.pages.demos.show-ping-test/PingApp [67] 
function PingApp({page}){
  let props = usePingProps(page);
  let {actions,views} = props;
  let {ping} = actions;
  let {busy,error,output,output_text} = views;
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
        <T.Text fontWeight="600" fontSize="$4">Live Supabase status</T.Text>
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
        <T.Text fontSize="$2" color="$color10">RPC response</T.Text>
        <T.Text fontFamily="monospace" fontSize="$6" color="$color12">{output_text}</T.Text>
      </T.YStack>
      <T.Button size="$4" disabled={busy} onPress={ping}>{busy ? "Pinging..." : "Send live ping"}</T.Button>
      {error ? (
        <T.Text color="$red10" fontSize="$3" accessibilityRole="alert">{error}</T.Text>) : null}
    </T.YStack>);
}

// statstrade-superadmin.pages.demos.show-ping-test/usePingPage [114] 
function usePingPage(resource){
  let [page,setPage] = React.useState(null);
  let [page_error,setPageError] = React.useState(null);
  React.useEffect(function (){
    let cancelled = false;
    let page_node = null;
    let attach = async function (){
      if(resource){
        try{
          page_node = await page_base.page_attach(resource["client"],"db/primary","room/superadmin",PING_PAGE,{});
          if(cancelled){
            await page_base.page_detach(page_node,{});
          }
          else{
            setPage(page_node);
          }
        }
        catch(e){
          if(!cancelled){
            setPageError(e);
          }
        }
      }
    };
    setPage(null);
    setPageError(null);
    attach();
    return function (){
      cancelled = true;
      if(page_node){
        page_base.page_detach(page_node,{});
      }
    };
  },[resource]);
  return {page,page_error};
}

// statstrade-superadmin.pages.demos.show-ping-test/PingContent [152] 
function PingContent(){
  let state = substrate.useSubstrateContext();
  let resource = state["resource"];
  let page_state = usePingPage(resource);
  let page = page_state["page"];
  let page_error = page_state["error"];
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
            <T.H2 color="$color12">Live Supabase ping test</T.H2>
            <T.Text color="$color10" fontSize="$4">Send a ping against the live Supabase RPC.</T.Text>
          </T.YStack>
          {page ? (
            <PingApp page={page}/>) : (
            <T.YStack
              gap="$3"
              padding="$5"
              borderWidth={1}
              borderColor="$color4"
              borderRadius="$4"
              backgroundColor="$background"
              accessibilityLiveRegion="polite">
              {page_error ? (
                <T.YStack gap="$2">
                  <T.Text fontWeight="600" color="$red10" accessibilityRole="alert">Unable to connect to Supabase</T.Text>
                  <T.Text color="$color10">Refresh the page to try again.</T.Text>
                </T.YStack>) : (
                <T.XStack gap="$3" alignItems="center">
                  <T.Spinner size="small" color="$color10"/>
                  <T.Text color="$color10">Connecting to Supabase...</T.Text>
                </T.XStack>)}
            </T.YStack>)}
        </T.YStack>
      </T.YStack>
    </layout_base.LayoutBase>);
}

// statstrade-superadmin.pages.demos.show-ping-test/Page [207] 
function Page(){
  // 9c2f3ea4-a586-4b4e-be80-ead691c948ee
  return (
    <substrate.SubstrateProvider
      options={{"client_id":"statstrade-superadmin-demo-ping-test"}}><PingContent/>
    </substrate.SubstrateProvider>);
}

export default Page