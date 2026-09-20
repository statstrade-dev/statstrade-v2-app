import React from 'react'

import * as SupabaseClient from '@supabase/supabase-js'

import * as k from '@statstrade/group/lib/xt/lang/base-lib'

import * as gs from '@statstrade/group/lib/sznui/lib/edge/global-store'

// sznui.lib.edge.remote.util-supabase/newEntry [15] 
export function newEntry(instance,params){
  return {"instance":instance,"params":params,"subscriptions":[]};
}

// sznui.lib.edge.remote.util-supabase/unsyncEntry [23] 
export function unsyncEntry({instance,params,subscriptions}){
  return {
    "instance":instance,
    "params":params,
    "subscriptions":subscriptions.map(function (s){
        return s.unsubscribe();
      })
  };
}

// sznui.lib.edge.remote.util-supabase/createParams [36] 
export function createParams(input = {}){
  return {
    "url":input.url || process.env.NEXT_PUBLIC_SUPABASE_URL,
    "key":input.key || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  };
}

// sznui.lib.edge.remote.util-supabase/CLIENTS [43] 
globalThis["sznui_lib_edge_remote_util_supabase$$CLIENTS"] = {};

// sznui.lib.edge.remote.util-supabase/getEntry [47] 
export function getEntry(client_id = "default"){
  return globalThis["sznui_lib_edge_remote_util_supabase$$CLIENTS"][client_id];
}

// sznui.lib.edge.remote.util-supabase/createClient [53] 
export function createClient(params){
  let {url,key} = createParams(params);
  return SupabaseClient.createClient(url,key);
}

// sznui.lib.edge.remote.util-supabase/getDefaultClient [61] 
export function getDefaultClient(client_id = "default"){
  return globalThis["sznui_lib_edge_remote_util_supabase$$CLIENTS"][client_id];
}

// sznui.lib.edge.remote.util-supabase/getClient [67] 
export function getClient(client_id = "default",params){
  let {key,url} = createParams(params);
  let entry = globalThis["sznui_lib_edge_remote_util_supabase$$CLIENTS"][client_id];
  if(entry && ((url != entry.params.url) || (key != entry.params.key))){
    unsyncEntry(entry);
    delete globalThis["sznui_lib_edge_remote_util_supabase$$CLIENTS"][client_id];
    entry = null;
  }
  if(!entry){
    let instance = createClient({key,url});
    entry = newEntry(instance,{key,url});
    globalThis["sznui_lib_edge_remote_util_supabase$$CLIENTS"][client_id] = entry;
    instance.entry = entry;
    return instance;
  }
  return entry.instance;
}

// sznui.lib.edge.remote.util-supabase/removeSubscription [91] 
export function removeSubscription(client,subscription){
  let {entry} = client;
  if(!entry){
    return null;
  }
  entry.subscriptions = k.arr_omit(entry.subscriptions,function (s){
    return s == subscription;
  });
}

// sznui.lib.edge.remote.util-supabase/initLocal [103] 
export async function initLocal(client = getClient()){
  let {data,error} = await client.auth.getSession();
  if(!error){
    let {session,user} = null;
    gs.setStore(["account"],{user,...session});
  }
  return gs.getStore(["account"]);
}

// sznui.lib.edge.remote.util-supabase/getLocalStore [117] 
export function getLocalStore(storage_key){
  let stored = localStorage.getItem(storage_key);
  try{
    stored = JSON.parse(stored);
  }
  catch(e){
    
  }
  return stored;
}

// sznui.lib.edge.remote.util-supabase/addListeners [127] 
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

// sznui.lib.edge.remote.util-supabase/getCurrentUserId [181] 
export async function getCurrentUserId(){
  let {data,error} = await getClient().auth.getUser();
  return k.get_in(data,["user","id"]);
}

// sznui.lib.edge.remote.util-supabase/wrapProcess [190] 
export async function wrapProcess(f){
  let client = getClient();
  let {data,error} = await f(client);
  if(error){
    console.error(error);
  }
  return {data,error};
}

// sznui.lib.edge.remote.util-supabase/useListeners [205] 
export function useListeners(listeners,client = getClient()){
  React.useEffect(function (){
    let subscription = addListeners(listeners,client);
    return function (){
      removeSubscription(client,subscription);
    };
  },[]);
}

// sznui.lib.edge.remote.util-supabase/useStoreSync [216] 
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

// sznui.lib.edge.remote.util-supabase/useListenSession [229] 
export function useListenSession(client = getClient()){
  let [session,setSession] = React.useState();
  useListeners({
    "onAll":function ({session}){
        setSession(session);
      }
  },client);
  return [session,setSession];
}

// sznui.lib.edge.remote.util-supabase/useListenPrint [240] 
export function useListenPrint(client = getClient()){
  useListeners({"onAll":console.log},client);
}

// sznui.lib.edge.remote.util-supabase/callRemote [253] 
export function callRemote(fstr,margs,options = {}){
  let {sbClient = getClient()} = options;
  return sbClient.schema("szn_rpc").rpc(fstr,margs);
}

// sznui.lib.edge.remote.util-supabase/callRemoteDebug [264] 
export function callRemoteDebug(fstr,margs,options = {}){
  let {sbClient = getClient()} = options;
  return sbClient.schema("szn_debug").rpc(fstr,margs);
}

// sznui.lib.edge.remote.util-supabase/callGraphql [279] 
export function callGraphql(query,variables = {}){
  return wrapProcess(function (client){
    return client.graphql.query(query,variables);
  });
}

// sznui.lib.edge.remote.util-supabase/toSelect [295] 
export function toSelect(spec){
  if(Array.isArray(spec)){
    return spec.join(",");
  }
  return k.arr_map(k.obj_pairs(spec),function ([key,val]){
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