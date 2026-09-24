import React from 'react'

import * as SupabaseClient from '@supabase/supabase-js'

import * as kd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as kl from '@statstrade/edge/lib/xt/lang/common-lib.jsx'

import * as gs from '@statstrade/edge/global-store.jsx'

import * as ks from '@statstrade/edge/lib/xt/lang/common-string.jsx'

// statsui.edge.remote.util-supabase/newEntry [19] 
export function newEntry(instance,params){
  return {"instance":instance,"params":params,"subscriptions":[]};
}

// statsui.edge.remote.util-supabase/unsyncEntry [27] 
export function unsyncEntry({instance,params,subscriptions}){
  return {
    "instance":instance,
    "params":params,
    "subscriptions":subscriptions.map(function (s){
        return s.unsubscribe();
      })
  };
}

// statsui.edge.remote.util-supabase/createParams [40] 
export function createParams(input = {}){
  return {
    "url":input.url || process.env.NEXT_PUBLIC_SUPABASE_URL,
    "key":input.key || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  };
}

// statsui.edge.remote.util-supabase/CLIENTS [47] 
globalThis["statsui_edge_remote_util_supabase$$CLIENTS"] = {};

// statsui.edge.remote.util-supabase/getEntry [51] 
export function getEntry(client_id = "default"){
  return globalThis["statsui_edge_remote_util_supabase$$CLIENTS"][client_id];
}

// statsui.edge.remote.util-supabase/createClient [57] 
export function createClient(params){
  let {url,key} = createParams(params);
  return SupabaseClient.createClient(url,key);
}

// statsui.edge.remote.util-supabase/getDefaultClient [65] 
export function getDefaultClient(client_id = "default"){
  return globalThis["statsui_edge_remote_util_supabase$$CLIENTS"][client_id];
}

// statsui.edge.remote.util-supabase/getClient [71] 
export function getClient(client_id = "default",params){
  let {key,url} = createParams(params);
  let entry = globalThis["statsui_edge_remote_util_supabase$$CLIENTS"][client_id];
  if(entry && ((url != entry.params.url) || (key != entry.params.key))){
    unsyncEntry(entry);
    delete globalThis["statsui_edge_remote_util_supabase$$CLIENTS"][client_id];
    entry = null;
  }
  if(!entry){
    let instance = createClient({key,url});
    entry = newEntry(instance,{key,url});
    globalThis["statsui_edge_remote_util_supabase$$CLIENTS"][client_id] = entry;
    instance.entry = entry;
    return instance;
  }
  return entry.instance;
}

// statsui.edge.remote.util-supabase/removeSubscription [95] 
export function removeSubscription(client,subscription){
  let {entry} = client;
  if(!entry){
    return null;
  }
  entry.subscriptions = kd.arr_omit(entry.subscriptions,function (s){
    return s == subscription;
  });
}

// statsui.edge.remote.util-supabase/initLocal [107] 
export async function initLocal(client = getClient()){
  let {data,error} = await client.auth.getSession();
  if(!error){
    let {session,user} = null;
    gs.setStore(["account"],{user,...session});
  }
  return gs.getStore(["account"]);
}

// statsui.edge.remote.util-supabase/getLocalStore [121] 
export function getLocalStore(storage_key){
  let stored = localStorage.getItem(storage_key);
  try{
    stored = JSON.parse(stored);
  }
  catch(e){
    
  }
  return stored;
}

// statsui.edge.remote.util-supabase/addListeners [131] 
export function addListeners(listeners = {},client = getClient()){
  let {onAll,onInitial,onPasswordRecovery,onSignedIn,onSignedOut,onTokenRefreshed,onUserUpdated} = listeners;
  try{
    let box = {};
    let {data} = client.auth.onAuthStateChange(function (type,session){
      if(onAll){
        onAll({type,session,"sub":box.sub});
      }
      if(type == "INITIAL_SESSION"){
        if(onInitial){
          onInitial(session);
        }
      }
      else if(type == "SIGNED_IN"){
        if(onSignedIn){
          onSignedIn(session);
        }
      }
      else if(type == "SIGNED_OUT"){
        if(onSignedOut){
          onSignedOut(session);
        }
      }
      else if(type == "PASSWORD_RECOVERY"){
        if(onPasswordRecovery){
          onPasswordRecovery(session);
        }
      }
      else if(type == "TOKEN_REFRESHED"){
        if(onTokenRefreshed){
          onTokenRefreshed(session);
        }
      }
      else if(type == "USER_UPDATED"){
        if(onUserUpdated){
          onUserUpdated(session);
        }
      }
      else{
        null;
      }
    });
    let {subscription} = data;
    box.sub = subscription.id;
    if(client.entry){
      client.entry.subscriptions.push(subscription);
    }
    return subscription;
  }
  catch(e){
    return null;
  }
}

// statsui.edge.remote.util-supabase/getCurrentUserId [185] 
export async function getCurrentUserId(){
  let {data,error} = await getClient().auth.getUser();
  return kd.get_in(data,["user","id"]);
}

// statsui.edge.remote.util-supabase/wrapProcess [194] 
export async function wrapProcess(f){
  let client = getClient();
  let {data,error} = await f(client);
  if(error){
    console.error(error);
  }
  return {data,error}
}

// statsui.edge.remote.util-supabase/useListeners [209] 
export function useListeners(listeners,client = getClient()){
  React.useEffect(function (){
    let subscription = addListeners(listeners,client);
    return function (){
      removeSubscription(client,subscription);
    };
  },[]);
}

// statsui.edge.remote.util-supabase/useStoreSync [220] 
export function useStoreSync(client = getClient()){
  let [session,setSession] = React.useState();
  useListeners({
    "onAll":function ({session}){
        setSession(session);
        gs.setStore(["account"],session);
      }
  },client);
  return [session,setSession];
}

// statsui.edge.remote.util-supabase/useListenSession [233] 
export function useListenSession(client = getClient()){
  let [session,setSession] = React.useState();
  useListeners({
    "onAll":function ({session}){
        setSession(session);
      }
  },client);
  return [session,setSession];
}

// statsui.edge.remote.util-supabase/useListenPrint [244] 
export function useListenPrint(client = getClient()){
  useListeners({"onAll":console.log},client);
}

// statsui.edge.remote.util-supabase/callRemote [257] 
export function callRemote(fstr,margs,options = {}){
  let {sbClient = getClient()} = options;
  return sbClient.schema("stats_rpc").rpc(fstr,margs);
}

// statsui.edge.remote.util-supabase/callRemoteDebug [268] 
export function callRemoteDebug(fstr,margs,options = {}){
  let {sbClient = getClient()} = options;
  return sbClient.schema("szn_debug").rpc(fstr,margs);
}

// statsui.edge.remote.util-supabase/callGraphql [283] 
export function callGraphql(query,variables = {}){
  return wrapProcess(function (client){
    return client.graphql.query(query,variables);
  });
}

// statsui.edge.remote.util-supabase/toSelect [299] 
export function toSelect(spec){
  if(kl.is_arrayp(spec)){
    return ks.join(",",spec);
  }
  return kd.arr_map(kd.obj_pairs(spec),function ([key,val]){
    if(true == val){
      return key;
    }
    else if(((typeof val) == "object") && val.rel){
      return key + ":" + val.rel + "(" + toSelect(val.fields) + ")";
    }
    else{
      throw new Error("Invalid spec: " + JSON.stringify({key,val}));
    }
  }).join(",");
}