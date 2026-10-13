'use client'

import React from 'react'

import * as T from 'tamagui'

import * as sb from '@statstrade/edge/remote/util-supabase.jsx'

import * as global_table from '@statstrade/web-superadmin/a03/s03/global-table.jsx'

import * as substrate from '@statstrade/web-superadmin/lib/substrate-worker.jsx'

import * as logo from '@statstrade/component/logo/logo-statstrade.jsx'

// statstrade-superadmin.pages.demos.show-ping/PING-RPC-SPEC [23] 
var PING_RPC_SPEC = {
  "id":"ping",
  "schema":"stats_rpc",
  "input":[],
  "return":"text",
  "flags":{}
};

// statstrade-superadmin.pages.demos.show-ping/usePingProps [25] 
function usePingProps(context){
  let node = context["node"];
  let primary_id = context["primary-id"] || "db/primary";
  let opts = context["opts"] || {};
  let [busy,setBusy] = React.useState(false);
  let [error,setError] = React.useState(null);
  let [output,setOutput] = React.useState(null);
  let ping = async function (){
    if(!busy){
      setBusy(true);
      setError(null);
      try{
        setOutput(
          await global_table.rpcCall(node,primary_id,PING_RPC_SPEC,[],opts)
        );
      }
      catch(e){
        setError("The ping failed. Please try again.");
      }
      finally{
        setBusy(false);
      }
    }
  };
  let views = {
    "output-text":((typeof output) == "string") ? output : "ready",
    "output":output,
    "busy":busy,
    "error":error
  };
  return {"actions":{"ping":ping},"views":views};
}

// statstrade-superadmin.pages.demos.show-ping/PingApp [55] 
function PingApp({context}){
  let props = usePingProps(context);
  let actions = props["actions"];
  let views = props["views"];
  let ping = actions["ping"];
  let output_text = views["output-text"];
  let output = views["output"];
  let busy = views["busy"];
  let error = views["error"];
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
      <T.Button size="$4" disabled={busy} onPress={ping}>{busy ? "Pinging..." : "Send ping"}</T.Button>
      {error ? (
        <T.Text color="$red10" fontSize="$3" accessibilityRole="alert">{error}</T.Text>) : null}
    </T.YStack>);
}

// statstrade-superadmin.pages.demos.show-ping/PingContent [106] 
function PingContent({actor_id}){
  let state = substrate.useSubstrateContext();
  let resource = state["resource"];
  let runtime_context = {
    "node":resource["client"],
    "primary-id":resource["config"]["primary"]["id"] || ("db/primary/" + (actor_id || "GUEST")),
    "space-id":substrate.pageSpaceId(resource["scope-id"],"demo/ping"),
    "opts":{}
  };
  return (
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
        <PingApp context={runtime_context}/>
      </T.YStack>
    </T.YStack>);
}

// statstrade-superadmin.pages.demos.show-ping/Page [142] 
function Page(){
  let [session] = sb.useListenSession();
  let current_session = session || {};
  let user = current_session["user"] || {};
  let actor_id = user["id"];
  return (
    <PingContent actor-id={actor_id}/>);
}

export default Page