import React from 'react'

import * as ReactQuery from '@tanstack/react-query'

import * as impl_supabase from '@xtalk/db/system/impl-supabase.js'

import * as rq from '@statstrade/edge/lib/js/lib/react-query.jsx'

import * as kernel_supabase from '@xtalk/db/node/kernel-supabase.js'

import * as client_auth from '@statstrade/edge/remote/util-supabase.jsx'

import * as client_supabase from '@xtalk/db/node/client-supabase.js'

import * as supabase_addon from '@xtalk/net/addon-supabase.js'

import * as browser_http from '@statstrade/edge/lib/js/net/http-fetch.js'

import * as impl_session from '@xtalk/db/system/impl-supabase-session.js'

import * as substrate from '@xtalk/substrate/substrate.js'

// statstrade-web.lib.auth-runtime/authEntryFromSession [17] 
export function authEntryFromSession(session,impersonated,actor_id,session_id){
  if(null == session){
    return null;
  }
  let user = session["user"] || {};
  let user_id = user["id"];
  let token = session["access_token"];
  if(session && user_id && token){
    return {
      "session":session,
      "scope":user_id,
      "token":token,
      "impersonated":Boolean(impersonated),
      "actor_id":actor_id,
      "session_id":session_id
    };
  }
  return null;
}

// statstrade-web.lib.auth-runtime/verifiedOAuthUser [34] 
export function verifiedOAuthUser(url,api_key,token){
  return fetch(url.replace(new RegExp("/$",""),"") + "/auth/v1/user",{
    "headers":{"apikey":api_key,"Authorization":"Bearer " + token},
    "signal":AbortSignal.timeout(20000)
  }).then(async function (response){
    if(!response.ok){
      throw new Error("Unable to verify your sign-in. Please sign in again.");
    }
    let user = await response.json();
    if(!user.id){
      throw new Error("The sign-in response did not include a user.");
    }
    return user;
  });
}

// statstrade-web.lib.auth-runtime/shouldStartWorker [46] 
export function shouldStartWorker(entry){
  return Boolean(entry && entry["scope"] && entry["token"]);
}

// statstrade-web.lib.auth-runtime/startEntryWorker [51] 
export function startEntryWorker(entry,connect){
  if(shouldStartWorker(entry)){
    return connect(entry["scope"],entry["token"]);
  }
  return null;
}

// statstrade-web.lib.auth-runtime/authDefaults [58] 
export function authDefaults(url_text,api_key){
  let url = new URL(url_text);
  let secured = url["protocol"] == "https:";
  return {
    "host":url["hostname"],
    "port":url["port"] ? url["port"] : (secured ? 443 : 80),
    "secured":secured,
    "basepath":(url["pathname"] == "/") ? "" : url["pathname"],
    "apikey":api_key
  };
}

// statstrade-web.lib.auth-runtime/workerConfig [73] 
export function workerConfig(url,api_key,access_token){
  return client_auth.workerConfig({"url":url["href"],"key":api_key,"token":access_token});
}

// statstrade-web.lib.auth-runtime/AuthRuntimeProvider [81] 
export function AuthRuntimeProvider({children}){
  let query_client = ReactQuery.useQueryClient();
  let [resource,setResource] = React.useState(null);
  let resource_ref = React.useRef(null);
  let [worker,setWorker] = React.useState(null);
  React.useEffect(function (){
    let defaults = authDefaults(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    let http_client = browser_http.create(defaults,supabase_addon.middleware_supabase());
    let impl = impl_supabase.impl_supabase(http_client,null,null);
    let node = substrate.node_create({"id":"statstrade-web-auth"});
    kernel_supabase.init_handlers(node);
    substrate.set_service(node,client_auth.SERVICE_ID,impl);
    let current = {"node":node,"impl":impl};
    resource_ref["current"] = current;
    client_auth.setWebAuthRuntime(node,query_client,function (){
      impl_session.auto_refresh_stop(impl);
      impl_session.set_session(impl,null);
    });
    setResource(current);
    return function (){
      impl_session.auto_refresh_stop(impl);
      client_auth.setWebDataClient(null);
      client_auth.resetClients();
      client_auth.resetWebRuntime();
    };
  },[]);
  let load_entry = async function (){
    let current = resource_ref["current"];
    if(null == current){
      return null;
    }
    let node = current["node"];
    let impl = current["impl"];
    let impersonation_response = null;
    if(!(process.env.NEXT_PUBLIC_IMPERSONATION_ENABLED == "false")){
      try{
        impersonation_response = await fetch(
          "/api/impersonation/token",
          {"credentials":"same-origin","cache":"no-store"}
        );
      }
      catch(_){
        null;
      }
    }
    if(impersonation_response && impersonation_response["ok"]){
      let body = await impersonation_response.json();
      let session = {
        "access_token":body["token"],
        "token_type":"bearer",
        "user":body["session"]["user"],
        "expires_at":Date.parse(body["session"]["expires_at"]) / 1000,
        "is_impersonated":true
      };
      impl_session.set_session(impl,session);
      return authEntryFromSession(
        session,
        true,
        body["session"]["actor_id"],
        body["session"]["session_id"]
      );
    }
    let params = new URLSearchParams(window.location["hash"].slice(1));
    let callback_access_token = params.get("access_token");
    let callback_refresh_token = params.get("refresh_token");
    if(callback_access_token && callback_refresh_token){
      let expires_in = parseInt(params.get("expires_in") || "3600");
      let callback_session = {
        "access_token":callback_access_token,
        "refresh_token":callback_refresh_token,
        "token_type":params.get("token_type") || "bearer",
        "expires_in":expires_in,
        "expires_at":(Date.now() / 1000) + expires_in
      };
      impl_session.set_session(impl,callback_session);
      let callback_user = await verifiedOAuthUser(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        callback_access_token
      );
      callback_session["user"] = (callback_user["user"] || callback_user);
      impl_session.set_session(impl,callback_session);
      impl_session.auto_refresh_start(impl);
      localStorage.setItem(client_auth.REFRESH_TOKEN_KEY,callback_refresh_token);
      window.history.replaceState(
        window.history.state,
        "",
        window.location["pathname"] + window.location["search"]
      );
    }
    let session = await client_supabase.current_session(node,client_auth.SERVICE_ID,{});
    let refresh_token = (session && session["refresh_token"]) || localStorage.getItem(client_auth.REFRESH_TOKEN_KEY);
    let refresh_at = (Date.now() / 1000) + 180;
    if(refresh_token && ((null == session) || (null == session["expires_at"]) || (session["expires_at"] <= refresh_at))){
      try{
        session = await client_supabase.token_refresh(node,client_auth.SERVICE_ID,{"refresh_token":refresh_token},{});
        impl_session.set_session(impl,session);
        impl_session.auto_refresh_start(impl);
      }
      catch(_){
        localStorage.removeItem(client_auth.REFRESH_TOKEN_KEY);
        impl_session.set_session(impl,null);
        session = null;
      }
    }
    if(session && session["user"] && session["user"]["id"]){
      return authEntryFromSession(session,false,null,null);
    }
    impl_session.set_session(impl,null);
    return null;
  };
  let entry_query = ReactQuery.useQuery({
    "queryKey":["web-auth-entry"],
    "queryFn":load_entry,
    "enabled":!(null == resource),
    "retry":false,
    "refetchInterval":120000,
    "refetchOnWindowFocus":true
  });
  let entry = entry_query["data"];
  let scope = entry && entry["scope"];
  let token = entry && entry["token"];
  React.useEffect(function (){
    if(resource && shouldStartWorker(entry)){
      let cancelled = false;
      setWorker({"ready":false,"scope":scope});
      let params = {
        "url":process.env.NEXT_PUBLIC_SUPABASE_URL,
        "key":process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        "token":token,
        "actor_id":scope
      };
      let connect = async function (){
        try{
          await client_auth.connectClient("default",params);
          let client = client_auth.getClient("default",params);
          if(cancelled){
            await client_auth.unsyncEntry(client_auth.getEntry("default"));
          }
          else{
            client_auth.setWebDataClient(client);
            setWorker({"ready":true,"client":client,"scope":scope});
          }
        }
        catch(error){
          if(!cancelled){
            setWorker({"ready":false,"scope":scope,"error":error});
          }
        }
      };
      connect();
      return function (){
        cancelled = true;
        client_auth.setWebDataClient(null);
        client_auth.unsyncEntry(client_auth.getEntry("default"));
      };
    }
    setWorker(null);
    client_auth.setWebDataClient(null);
    return;
  },[resource,scope,token]);
  let status = ((null == resource) || entry_query["isPending"]) ? "loading" : "ready";
  let value = {
    "status":status,
    "entry":entry,
    "session":entry && entry["session"],
    "authenticated":Boolean(token),
    "impersonated":Boolean(entry && entry["impersonated"]),
    "worker":worker,
    "error":entry_query["error"] && entry_query["error"]["message"],
    "refetch":entry_query["refetch"]
  };
  return (
    <client_auth.AuthEntryContext.Provider value={value}>
      <rq.EntryScopeProvider scope={scope}>{children}</rq.EntryScopeProvider>
    </client_auth.AuthEntryContext.Provider>);
}