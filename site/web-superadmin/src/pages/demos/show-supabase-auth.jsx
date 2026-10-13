'use client'

import React from 'react'

import * as T from 'tamagui'

import * as client_supabase from '@xtalk/db/node/client-supabase.js'

import * as substrate from '@statstrade/web-superadmin/lib/substrate-worker.jsx'

import * as logo from '@statstrade/component/logo/logo-statstrade.jsx'

// statstrade-superadmin.pages.demos.show-supabase-auth/useAuthProps [18] 
function useAuthProps(page){
  let node = page["client"];
  let primary_id = page["primary-id"] || "db/primary/GUEST";
  let [email,setEmail] = React.useState("");
  let [password,setPassword] = React.useState("");
  let [session,setSession] = React.useState(null);
  let [busy,setBusy] = React.useState(false);
  let [error,setError] = React.useState(null);
  React.useEffect(function (){
    let cancelled = false;
    let run = async function (){
      try{
        let result = await client_supabase.current_session(node,primary_id,{});
        if(!cancelled){
          setSession(result);
        }
      }
      catch(e){
        if(!cancelled){
          setError("Unable to load the current session.");
        }
      }
    };
    run();
    return function (){
      cancelled = true;
    };
  },[node]);
  let user = session ? session["user"] : null;
  let current_email = user ? user["email"] : null;
  let actions = {"setEmail":setEmail,"setPassword":setPassword};
  actions["signIn"] = async function (){
    if(!busy){
      setBusy(true);
      setError(null);
      try{
        await client_supabase.sign_in(node,primary_id,{"email":email,"password":password},{});
        let result = await client_supabase.current_session(node,primary_id,{});
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
  actions["signOut"] = async function (){
    if(!busy && session){
      setBusy(true);
      setError(null);
      try{
        await client_supabase.sign_out(node,primary_id,{});
        let result = await client_supabase.current_session(node,primary_id,{});
        setSession(result);
      }
      catch(e){
        setError("Sign-out failed. Please try again.");
      }
      finally{
        setBusy(false);
      }
    }
  };
  let views = {
    "email":email,
    "password":password,
    "session":session,
    "current_email":current_email,
    "busy":busy,
    "error":error,
    "status":busy ? "busy" : (session ? "signed-in" : "ready")
  };
  return {actions,views};
}

// statstrade-superadmin.pages.demos.show-supabase-auth/AuthApp [103] 
function AuthApp({actions,views}){
  let {busy,current_email,email,error,password,session,status} = views;
  let {setEmail,setPassword,signIn,signOut} = actions;
  return (
    <T.YStack
      width="100%"
      maxWidth={560}
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
        <T.Text fontWeight="600" fontSize="$4">Authentication status</T.Text>
        <T.Text
          fontSize="$2"
          fontWeight="600"
          color={error ? "$red10" : ((status == "signed-in") ? "$green10" : "$color10")}>
          {busy ? "Working..." : (error ? "Failed" : ((status == "signed-in") ? "Signed in" : "Ready"))}
        </T.Text>
      </T.XStack>
      {session ? (
        <T.YStack gap="$3">
          <T.Text fontWeight="600" fontSize="$4">Current session</T.Text>
          <T.YStack
            gap="$2"
            padding="$4"
            borderRadius="$3"
            backgroundColor="$color2"
            accessibilityLiveRegion="polite">
            <T.Text fontSize="$2" color="$color10">Authenticated user</T.Text>
            <T.Text fontWeight="600" color="$color12">{current_email ? current_email : "Authenticated user"}</T.Text>
          </T.YStack>
          <T.Button size="$4" disabled={busy} onPress={signOut}>{busy ? "Signing out..." : "Sign out"}</T.Button>
        </T.YStack>) : (
        <T.YStack gap="$3">
          <T.Text fontWeight="600" fontSize="$4">Sign in</T.Text>
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
          <T.Button
            size="$4"
            disabled={busy || !email || !password}
            onPress={signIn}>{busy ? "Signing in..." : "Sign in"}
          </T.Button>
        </T.YStack>)}
      {error ? (
        <T.Text color="$red10" fontSize="$3" accessibilityRole="alert">{error}</T.Text>) : null}
    </T.YStack>);
}

// statstrade-superadmin.pages.demos.show-supabase-auth/AuthController [193] 
function AuthController({page}){
  let {actions,views} = useAuthProps(page);
  return (
    <AuthApp actions={actions} views={views}/>);
}

// statstrade-superadmin.pages.demos.show-supabase-auth/AuthContent [198] 
function AuthContent(){
  let state = substrate.useSubstrateContext();
  let resource = state["resource"];
  let page = {
    "client":resource["client"],
    "primary-id":resource["config"]["primary"]["id"] || "db/primary/GUEST"
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
          <T.H2 color="$color12">Supabase authentication</T.H2>
          <T.Text fontSize="$4" color="$color10">Sign in and sign out through the provider-owned substrate.</T.Text>
        </T.YStack>
        <AuthController page={page}/>
      </T.YStack>
    </T.YStack>);
}

// statstrade-superadmin.pages.demos.show-supabase-auth/Page [230] 
function Page(){
  // 45cc2703-4ef4-4f0b-8e38-577674501731
  return (
    <AuthContent/>);
}

export default Page