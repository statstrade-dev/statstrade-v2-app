'use client'

import React from 'react'

import * as T from 'tamagui'

import * as kernel_supabase from '@xtalk/db/node/kernel-supabase.js'

import * as client_supabase from '@xtalk/db/node/client-supabase.js'

import * as worker from '@statstrade/web-superadmin/worker.jsx'

import * as db_main from '@xtalk/db/system/main.js'

import * as layout_base from '@statstrade/component/layout/layout-base.jsx'

import * as substrate from '@xtalk/substrate/substrate.js'

// statstrade-superadmin.pages.demos.show-supabase-auth/SUPABASE-SERVICE-ID [21] 
var SUPABASE_SERVICE_ID = "example/supabase-auth";

// statstrade-superadmin.pages.demos.show-supabase-auth/createNode [24] 
function createNode(){
  let node = substrate.node_create({"id":"statstrade-superadmin-demo-supabase-auth"});
  let worker_config = worker.createWorkerConfig();
  let primary = worker_config["primary"];
  let defaults = primary["defaults"];
  let impl = db_main.create_impl("supabase",defaults,null,null);
  substrate.set_service(node,SUPABASE_SERVICE_ID,impl);
  kernel_supabase.init_handlers(node);
  return node;
}

// statstrade-superadmin.pages.demos.show-supabase-auth/closeNode [36] 
async function closeNode(node){
  if(node){
    try{
      let curr_session = await client_supabase.current_session(node,SUPABASE_SERVICE_ID,{});
      if(curr_session){
        await client_supabase.sign_out(
          node,
          SUPABASE_SERVICE_ID,
          {"token":curr_session["access_token"]}
        );
      }
    }
    catch(e){
      null;
    }
  }
  return true;
}

// statstrade-superadmin.pages.demos.show-supabase-auth/signIn [53] 
async function signIn(node,email,password){
  return await client_supabase.sign_in(
    node,
    SUPABASE_SERVICE_ID,
    {"email":email,"password":password},
    {}
  );
}

// statstrade-superadmin.pages.demos.show-supabase-auth/signOut [63] 
async function signOut(node,curr_session){
  return await client_supabase.sign_out(
    node,
    SUPABASE_SERVICE_ID,
    {"token":curr_session["access_token"]}
  );
}

// statstrade-superadmin.pages.demos.show-supabase-auth/AuthApp [71] 
function AuthApp({node}){
  let [email,setEmail] = React.useState("");
  let [password,setPassword] = React.useState("");
  let [curr_session,setSession] = React.useState(null);
  let [busy,setBusy] = React.useState(false);
  let [error,setError] = React.useState(null);
  let user = curr_session ? curr_session["user"] : null;
  let current_email = user ? user["email"] : null;
  let onSignIn = async function (){
    if(!busy){
      setBusy(true);
      setError(null);
      try{
        let result = await signIn(node,email,password);
        setSession(result);
      }
      catch(e){
        setError("Sign-in failed. Check your email and password.");
      }
      finally{
        setBusy(false);
      }
    }
  };
  let onSignOut = async function (){
    if(!busy && curr_session){
      setBusy(true);
      setError(null);
      try{
        await signOut(node,curr_session);
        setSession(null);
      }
      catch(e){
        setError("Sign-out failed. Please try again.");
      }
      finally{
        setBusy(false);
      }
    }
  };
  return (
    <T.YStack
      width="100%"
      maxWidth={480}
      gap="$4"
      padding="$5"
      borderWidth={1}
      borderColor="$color4"
      borderRadius="$4"
      backgroundColor="$background">
      <T.Text fontSize="$6" fontWeight="700" color="$color12">Supabase auth</T.Text>
      {curr_session ? (
        <T.YStack gap="$3">
          <T.Text color="$color10">Signed in as</T.Text>
          <T.Text fontWeight="600" color="$color12">{current_email ? current_email : "Authenticated user"}</T.Text>
          <T.Button disabled={busy} onPress={onSignOut}>{busy ? "Signing out..." : "Sign out"}</T.Button>
        </T.YStack>) : (
        <T.YStack gap="$3">
          <T.Input
            value={email}
            onChangeText={setEmail}
            placeholder="Email address"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"/>
          <T.Input
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry={true}
            autoComplete="current-password"/>
          <T.Button disabled={busy || !email || !password} onPress={onSignIn}>{busy ? "Signing in..." : "Sign in"}</T.Button>
        </T.YStack>)}
      {error ? (
        <T.Text color="$red10" accessibilityRole="alert">{error}</T.Text>) : null}
    </T.YStack>);
}

// statstrade-superadmin.pages.demos.show-supabase-auth/Page [156] 
function Page(){
  let [readyState,setReadyState] = React.useState("loading");
  let [node,setNode] = React.useState(null);
  React.useEffect(function (){
    let cancelled = false;
    let page_node = null;
    try{
      page_node = createNode();
      if(cancelled){
        closeNode(page_node);
      }
      else{
        setNode(page_node);
        setReadyState("ready");
      }
    }
    catch(e){
      if(!cancelled){
        setReadyState("error");
      }
    }
    return function (){
      cancelled = true;
      if(page_node){
        closeNode(page_node);
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
        <T.YStack width="100%" maxWidth={480} gap="$4">
          <T.Text fontSize="$7" fontWeight="700" color="$color12">Sign in and sign out</T.Text>
          <T.Text fontSize="$4" color="$color10">
            A small example using the Supabase kernel handlers and client calls.
          </T.Text>
          {(readyState == "ready") ? (
            <AuthApp node={node}/>) : (
            <T.Text color={(readyState == "error") ? "$red10" : "$color10"}>
              {(readyState == "error") ? "Unable to initialize Supabase." : "Connecting to Supabase..."}
            </T.Text>)}
        </T.YStack>
      </T.YStack>
    </layout_base.LayoutBase>);
}

export default Page