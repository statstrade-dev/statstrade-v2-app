import React from 'react'

import * as kd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as page_proxy from '@statstrade/edge/lib/xt/substrate/page-proxy.jsx'

import * as proxy_base from '@statstrade/edge/lib/xt/db/node/proxy-base.jsx'

import * as kl from '@statstrade/edge/lib/xt/lang/common-lib.jsx'

import * as client_base from '@statstrade/edge/lib/xt/db/node/client-base.jsx'

import * as proxy_supabase from '@statstrade/edge/lib/xt/db/node/proxy-supabase.jsx'

import * as client_supabase from '@statstrade/edge/lib/xt/db/node/client-supabase.jsx'

import * as gs from '@statstrade/edge/global-store.jsx'

import * as proxy_util from '@statstrade/edge/lib/xt/db/node/proxy-util.jsx'

import * as ks from '@statstrade/edge/lib/xt/lang/common-string.jsx'

import * as substrate from '@statstrade/edge/lib/xt/substrate.jsx'

import * as browser_transport from '@statstrade/edge/lib/xt/substrate/transport-browser.jsx'

// statsui.edge.remote.util-supabase/SERVICE_ID [21] 
export var SERVICE_ID = "db/primary";

// statsui.edge.remote.util-supabase/AUTH_SPACE [22] 
export var AUTH_SPACE = "statstrade-web-auth";

// statsui.edge.remote.util-supabase/AUTH_SIGNAL [23] 
export var AUTH_SIGNAL = "session.changed";

// statsui.edge.remote.util-supabase/REFRESH_TOKEN_KEY [24] 
export var REFRESH_TOKEN_KEY = "statstrade-web-refresh-token";

// statsui.edge.remote.util-supabase/CLIENTS [25] 
globalThis["statsui_edge_remote_util_supabase$$CLIENTS"] = {};

// statsui.edge.remote.util-supabase/AUTH_LISTENERS [26] 
globalThis["statsui_edge_remote_util_supabase$$AUTH_LISTENERS"] = {};

// statsui.edge.remote.util-supabase/AUTH_SUBSCRIPTION [27] 
globalThis["statsui_edge_remote_util_supabase$$AUTH_SUBSCRIPTION"] = null;

// statsui.edge.remote.util-supabase/AUTH_SUBSCRIPTION_ID [28] 
globalThis["statsui_edge_remote_util_supabase$$AUTH_SUBSCRIPTION_ID"] = "statstrade-auth-session";

// statsui.edge.remote.util-supabase/RUNTIME_GENERATION [29] 
globalThis["statsui_edge_remote_util_supabase$$RUNTIME_GENERATION"] = 0;

// statsui.edge.remote.util-supabase/WEB_AUTH_CLIENT [30] 
globalThis["statsui_edge_remote_util_supabase$$WEB_AUTH_CLIENT"] = null;

// statsui.edge.remote.util-supabase/WEB_DATA_CLIENT [31] 
globalThis["statsui_edge_remote_util_supabase$$WEB_DATA_CLIENT"] = null;

// statsui.edge.remote.util-supabase/WEB_AUTH_QUERY_CLIENT [32] 
globalThis["statsui_edge_remote_util_supabase$$WEB_AUTH_QUERY_CLIENT"] = null;

// statsui.edge.remote.util-supabase/WEB_AUTH_CLEAR_SESSION [33] 
globalThis["statsui_edge_remote_util_supabase$$WEB_AUTH_CLEAR_SESSION"] = null;

// statsui.edge.remote.util-supabase/AuthEntryContext [34] 
export var AuthEntryContext = React.createContext(null);

// statsui.edge.remote.util-supabase/newEntry [36] 
export function newEntry(instance,params){
  return {
    "instance":instance,
    "params":params,
    "ready":false,
    "connecting":null,
    "connection":null,
    "error":null,
    "waiters":[],
    "subscriptions":[]
  };
}

// statsui.edge.remote.util-supabase/unsyncEntry [48] 
export async function unsyncEntry(entry){
  if(null == entry){
    return true;
  }
  if(entry["connecting"]){
    try{
      await entry["connecting"];
    }
    catch(_){
      null;
    }
  }
  if(entry["ready"]){
    await browser_transport.disconnect(entry["connection"]["connection"]);
  }
  entry["ready"] = false;
  entry["connecting"] = null;
  entry["connection"] = null;
  return true;
}

// statsui.edge.remote.util-supabase/createParams [65] 
export function createParams(input = {}){
  let params = {
    "url":input["url"] || process.env.NEXT_PUBLIC_SUPABASE_URL,
    "key":input["key"] || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    "token":input["token"]
  };
  if(input.actor_id){
    params.actor_id = input.actor_id;
  }
  return params;
}

// statsui.edge.remote.util-supabase/getEntry [74] 
export function getEntry(client_id = "default"){
  return globalThis["statsui_edge_remote_util_supabase$$CLIENTS"][client_id];
}

// statsui.edge.remote.util-supabase/createClient [79] 
export function createClient(params){
  let config = params || {};
  return substrate.node_create({"id":config["client_id"] || "statstrade-shared-client"});
}

// statsui.edge.remote.util-supabase/getDefaultClient [86] 
export function getDefaultClient(client_id = "default"){
  return getEntry(client_id);
}

// statsui.edge.remote.util-supabase/getClient [91] 
export function getClient(client_id = "default",params){
  let entry = getEntry(client_id);
  let config = Object.assign({},params || {},{"client_id":client_id});
  let next_params = (entry && (null == params)) ? entry["params"] : createParams(params || {});
  if(entry && ((entry["params"]["url"] != next_params["url"]) || (entry["params"]["key"] != next_params["key"]) || (entry["params"]["token"] != next_params["token"]) || (entry["params"]["actor_id"] != next_params["actor_id"]))){
    unsyncEntry(entry);
    delete globalThis["statsui_edge_remote_util_supabase$$CLIENTS"][client_id];
    entry = null;
  }
  if(!entry){
    let client = createClient(config);
    entry = newEntry(client,next_params);
    globalThis["statsui_edge_remote_util_supabase$$CLIENTS"][client_id] = entry;
  }
  return entry["instance"];
}

// statsui.edge.remote.util-supabase/workerConfig [112] 
export function workerConfig(input = {}){
  let params = createParams(input);
  let url = new URL(params["url"]);
  let secured = url["protocol"] == "https:";
  return {
    "worker_name":(process.env.NEXT_PUBLIC_SHAREDWORKER_NAME || "statstrade-shared-worker") + (params.actor_id ? ("/" + params.actor_id) : ""),
    "site_map_url":"/worker/site-map/manifest.json",
    "primary":{
        "type":"supabase",
        "defaults":{
            "host":url["hostname"],
            "port":url["port"] ? url["port"] : (secured ? 443 : 80),
            "secured":secured,
            "basepath":(url["pathname"] == "/") ? "" : url["pathname"],
            "apikey":params["key"],
            "token":params["token"]
          }
      },
    "caching":{"type":"sqlite","defaults":{"filename":":memory:"}}
  };
}

// statsui.edge.remote.util-supabase/connectProxyNode [134] 
export async function connectProxyNode(client,config){
  page_proxy.install(client);
  proxy_base.init_proxy_handlers(client);
  proxy_supabase.init_proxy_handlers(client);
  let connection = await browser_transport.connect_sharedworker(client,{
    "transport_id":"worker",
    "source":browser_transport.sharedworker_url_source("/workers/web.sharedworker.js",{
        "type":"module",
        "name":config.worker_name || process.env.NEXT_PUBLIC_SHAREDWORKER_NAME || "statstrade-shared-worker"
      })
  });
  proxy_util.set_default_transport(client,connection["transport_id"]);
  let init_result = await client_base.kernel_init(client,config,{},{},{});
  return {"connection":connection,"init":init_result};
}

// statsui.edge.remote.util-supabase/markClientReady [153] 
export function markClientReady(client_id = "default",connection = null){
  let entry = getEntry(client_id);
  if(!entry){
    throw new Error("SharedWorker client was not created.");
  }
  entry["ready"] = true;
  entry["connection"] = connection;
  entry["error"] = null;
  let waiters = entry["waiters"];
  entry["waiters"] = [];
  waiters.forEach(function (waiter){
    waiter.resolve(entry["instance"]);
  });
  return entry["instance"];
}

// statsui.edge.remote.util-supabase/markClientFailed [171] 
export function markClientFailed(error,client_id = "default"){
  let entry = getEntry(client_id);
  if(!entry){
    return false;
  }
  entry["ready"] = false;
  entry["error"] = error;
  let waiters = entry["waiters"];
  entry["waiters"] = [];
  waiters.forEach(function (waiter){
    waiter.reject(error);
  });
  return true;
}

// statsui.edge.remote.util-supabase/publishSession [187] 
export async function publishSession(client,session,type){
  let result = await substrate.request(
    client,
    null,
    "@statstrade-web/auth/session-set",
    [session,type],
    {}
  );
  if(session && session["refresh_token"]){
    localStorage.setItem(REFRESH_TOKEN_KEY,session["refresh_token"]);
  }
  if(null == session){
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
  return result;
}

// statsui.edge.remote.util-supabase/loadInitialSession [203] 
export async function loadInitialSession(client){
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
    let delegated_session = {
      "access_token":body["token"],
      "token_type":"bearer",
      "user":body["session"]["user"],
      "expires_at":Date.parse(body["session"]["expires_at"]) / 1000,
      "is_impersonated":true,
      "actor_id":body["session"]["actor_id"],
      "session_id":body["session"]["session_id"]
    };
    return await publishSession(client,delegated_session,"SIGNED_IN");
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
    let user_response = await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL + "/auth/v1/user",{
      "headers":{
            "apikey":process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            "Authorization":"Bearer " + callback_access_token
          },
      "signal":AbortSignal.timeout(20000)
    });
    if(!user_response.ok){
      throw new Error("Unable to verify your sign-in. Please sign in again.");
    }
    callback_session["user"] = await user_response.json();
    if(!callback_session["user"]["id"]){
      throw new Error("The sign-in response did not include a user.");
    }
    await publishSession(client,callback_session,"SIGNED_IN");
    localStorage.setItem(REFRESH_TOKEN_KEY,callback_refresh_token);
    window.history.replaceState(
      window.history.state,
      "",
      window.location["pathname"] + window.location["search"]
    );
    return callback_session;
  }
  let session = await client_supabase.current_session(client,SERVICE_ID,{});
  let refresh_token = (session && session["refresh_token"]) || localStorage.getItem(REFRESH_TOKEN_KEY);
  let refresh_at = (Date.now() / 1000) + 180;
  if(refresh_token && ((null == session) || (null == session["expires_at"]) || (session["expires_at"] <= refresh_at))){
    try{
      session = await client_supabase.token_refresh(client,SERVICE_ID,{"refresh_token":refresh_token},{});
      await publishSession(client,session,"TOKEN_REFRESHED");
    }
    catch(_){
      await publishSession(client,null,"SIGNED_OUT");
      session = null;
    }
  }
  return session;
}

// statsui.edge.remote.util-supabase/connectClient [271] 
export async function connectClient(client_id = "default",params){
  let client = getClient(client_id,params);
  let entry = getEntry(client_id);
  if(entry["ready"]){
    return entry["connection"];
  }
  if(entry["connecting"]){
    return await entry["connecting"];
  }
  let connect_fn = async function (){
    try{
      let state = await connectProxyNode(client,workerConfig(entry["params"]));
      markClientReady(client_id,state);
      await loadInitialSession(client);
      return state;
    }
    catch(error){
      markClientFailed(error,client_id);
      throw error;
    }
  };
  let connection_promise = connect_fn();
  entry["connecting"] = connection_promise;
  try{
    let state = await connection_promise;
    entry["connecting"] = null;
    return state;
  }
  catch(error){
    entry["connecting"] = null;
    throw error;
  }
}

// statsui.edge.remote.util-supabase/unsubscribeWorkerAuthEvents [305] 
export async function unsubscribeWorkerAuthEvents(client){
  if(null == globalThis["statsui_edge_remote_util_supabase$$AUTH_SUBSCRIPTION"]){
    return false;
  }
  try{
    await globalThis["statsui_edge_remote_util_supabase$$AUTH_SUBSCRIPTION"];
    await substrate.unsubscribe(
      client,
      AUTH_SPACE,
      AUTH_SIGNAL,
      globalThis["statsui_edge_remote_util_supabase$$AUTH_SUBSCRIPTION_ID"],
      {}
    );
    substrate.unregister_trigger(client,AUTH_SIGNAL);
    globalThis["statsui_edge_remote_util_supabase$$AUTH_SUBSCRIPTION"] = null;
    return true;
  }
  catch(_){
    globalThis["statsui_edge_remote_util_supabase$$AUTH_SUBSCRIPTION"] = null;
    substrate.unregister_trigger(client,AUTH_SIGNAL);
    return false;
  }
}

// statsui.edge.remote.util-supabase/resetClients [326] 
export async function resetClients(){
  let client_ids = Object.keys(globalThis["statsui_edge_remote_util_supabase$$CLIENTS"]);
  if(globalThis["statsui_edge_remote_util_supabase$$AUTH_SUBSCRIPTION"] && globalThis["statsui_edge_remote_util_supabase$$CLIENTS"]["default"] && globalThis["statsui_edge_remote_util_supabase$$CLIENTS"]["default"]["ready"]){
    await unsubscribeWorkerAuthEvents(
      globalThis["statsui_edge_remote_util_supabase$$CLIENTS"]["default"]["instance"]
    );
  }
  await Promise.all(client_ids.map(async function (client_id){
    let entry = globalThis["statsui_edge_remote_util_supabase$$CLIENTS"][client_id];
    if(entry["connecting"]){
      try{
        await entry["connecting"];
      }
      catch(_){
        null;
      }
    }
    if(entry["ready"]){
      await browser_transport.disconnect(entry["connection"]["connection"]);
    }
    let waiters = entry["waiters"];
    waiters.forEach(function (waiter){
      waiter.reject(new Error("The SharedWorker client was reset."));
    });
    entry["waiters"] = [];
    entry["ready"] = false;
    entry["connection"] = null;
    entry["connecting"] = null;
    delete globalThis["statsui_edge_remote_util_supabase$$CLIENTS"][client_id];
  }));
  globalThis["statsui_edge_remote_util_supabase$$AUTH_LISTENERS"] = {};
  globalThis["statsui_edge_remote_util_supabase$$AUTH_SUBSCRIPTION"] = null;
  return true;
}

// statsui.edge.remote.util-supabase/SharedWorkerRuntime [362] 
export function SharedWorkerRuntime({children,enabled}){
  React.useEffect(function (){
    if(enabled == false){
      return undefined;
    }
    globalThis["statsui_edge_remote_util_supabase$$RUNTIME_GENERATION"] = (globalThis["statsui_edge_remote_util_supabase$$RUNTIME_GENERATION"] + 1);
    let generation = globalThis["statsui_edge_remote_util_supabase$$RUNTIME_GENERATION"];
    let active = true;
    let init = async function (){
      try{
        await connectClient("default");
      }
      catch(error){
        if(active){
          console.error("Unable to connect the Supabase SharedWorker.",error);
        }
      }
    };
    init();
    return function (){
      active = false;
      setTimeout(function (){
        if(generation == globalThis["statsui_edge_remote_util_supabase$$RUNTIME_GENERATION"]){
          resetClients();
        }
      },0);
    };
  },[enabled]);
  return children;
}

// statsui.edge.remote.util-supabase/awaitClient [392] 
export async function awaitClient(client_id = "default"){
  if(globalThis["statsui_edge_remote_util_supabase$$WEB_DATA_CLIENT"]){
    return globalThis["statsui_edge_remote_util_supabase$$WEB_DATA_CLIENT"];
  }
  if(globalThis["statsui_edge_remote_util_supabase$$WEB_AUTH_CLIENT"]){
    return globalThis["statsui_edge_remote_util_supabase$$WEB_AUTH_CLIENT"];
  }
  let client = getClient(client_id);
  let entry = getEntry(client_id);
  if(entry["ready"]){
    return client;
  }
  if(entry["error"]){
    throw entry["error"];
  }
  return await new Promise(function (resolve,reject){
    entry["waiters"].push({"resolve":resolve,"reject":reject});
  });
}

// statsui.edge.remote.util-supabase/awaitAuthClient [413] 
export async function awaitAuthClient(client_id = "default"){
  if(globalThis["statsui_edge_remote_util_supabase$$WEB_AUTH_CLIENT"]){
    return globalThis["statsui_edge_remote_util_supabase$$WEB_AUTH_CLIENT"];
  }
  return await awaitClient(client_id);
}

// statsui.edge.remote.util-supabase/setWebAuthRuntime [420] 
export function setWebAuthRuntime(client,query_client,clear_session){
  globalThis["statsui_edge_remote_util_supabase$$WEB_AUTH_CLIENT"] = client;
  globalThis["statsui_edge_remote_util_supabase$$WEB_AUTH_QUERY_CLIENT"] = query_client;
  globalThis["statsui_edge_remote_util_supabase$$WEB_AUTH_CLEAR_SESSION"] = clear_session;
  return client;
}

// statsui.edge.remote.util-supabase/setWebDataClient [428] 
export function setWebDataClient(client){
  globalThis["statsui_edge_remote_util_supabase$$WEB_DATA_CLIENT"] = client;
  return client;
}

// statsui.edge.remote.util-supabase/resetWebRuntime [434] 
export function resetWebRuntime(){
  globalThis["statsui_edge_remote_util_supabase$$WEB_DATA_CLIENT"] = null;
  globalThis["statsui_edge_remote_util_supabase$$WEB_AUTH_CLIENT"] = null;
  globalThis["statsui_edge_remote_util_supabase$$WEB_AUTH_QUERY_CLIENT"] = null;
  globalThis["statsui_edge_remote_util_supabase$$WEB_AUTH_CLEAR_SESSION"] = null;
  return true;
}

// statsui.edge.remote.util-supabase/notifyWebAuthChanged [443] 
export async function notifyWebAuthChanged(){
  if(globalThis["statsui_edge_remote_util_supabase$$WEB_AUTH_QUERY_CLIENT"]){
    await globalThis["statsui_edge_remote_util_supabase$$WEB_AUTH_QUERY_CLIENT"].invalidateQueries({"queryKey":["web-auth-entry"]});
  }
  return true;
}

// statsui.edge.remote.util-supabase/publishOrStoreSession [451] 
export async function publishOrStoreSession(client,session,type){
  if(client == globalThis["statsui_edge_remote_util_supabase$$WEB_AUTH_CLIENT"]){
    if(session && session["refresh_token"]){
      localStorage.setItem(REFRESH_TOKEN_KEY,session["refresh_token"]);
    }
    if((null == session) || (null == session["refresh_token"])){
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
    await notifyWebAuthChanged();
    return session;
  }
  else{
    return await publishSession(client,session,type);
  }
}

// statsui.edge.remote.util-supabase/setSession [465] 
export async function setSession(session,options = {}){
  let client = await awaitClient();
  let result = await substrate.request(
    client,
    null,
    "@statstrade-web/auth/session-set",
    [session,"SESSION_CHANGED"],
    {}
  );
  if(session && session["refresh_token"]){
    localStorage.setItem(REFRESH_TOKEN_KEY,session["refresh_token"]);
  }
  if((null == session) && options["clear_refresh"]){
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
  return result;
}

// statsui.edge.remote.util-supabase/signInWithPassword [483] 
export async function signInWithPassword(client,credentials,options = {}){
  try{
    let active_client = await awaitAuthClient();
    let session = await client_supabase.sign_in(active_client,SERVICE_ID,credentials,options);
    await publishOrStoreSession(active_client,session,"SIGNED_IN");
    return {
      "data":{"user":session["user"],"session":session},
      "error":null
    };
  }
  catch(error){
    return {"data":null,"error":error};
  }
}

// statsui.edge.remote.util-supabase/signUp [497] 
export async function signUp(client,credentials,options = {}){
  try{
    let active_client = await awaitAuthClient();
    let result = await client_supabase.sign_up(active_client,SERVICE_ID,credentials,options);
    let session = result["session"] || result;
    if(session && session["refresh_token"]){
      await publishOrStoreSession(active_client,session,"SIGNED_IN");
    }
    return {"data":result,"error":null};
  }
  catch(error){
    return {"data":null,"error":error};
  }
}

// statsui.edge.remote.util-supabase/signOut [511] 
export async function signOut(client,options = {}){
  try{
    let active_client = await awaitAuthClient();
    let session = await client_supabase.current_session(active_client,SERVICE_ID,{});
    if(session["is_impersonated"] && !options["skip_impersonation_end"]){
      await fetch(
        "/api/impersonation/end",
        {"method":"POST","credentials":"same-origin"}
      );
    }
    let result = null;
    if(session["is_impersonated"]){
      if(globalThis["statsui_edge_remote_util_supabase$$WEB_AUTH_CLEAR_SESSION"]){
        globalThis["statsui_edge_remote_util_supabase$$WEB_AUTH_CLEAR_SESSION"]();
      }
      result = {"status":"ok"};
    }
    else{
      result = await client_supabase.sign_out(active_client,SERVICE_ID,options);
    }
    await publishOrStoreSession(active_client,null,"SIGNED_OUT");
    if(active_client == globalThis["statsui_edge_remote_util_supabase$$WEB_AUTH_CLIENT"]){
      setWebDataClient(null);
    }
    return {"data":result,"error":null};
  }
  catch(error){
    return {"data":null,"error":error};
  }
}

// statsui.edge.remote.util-supabase/signInWithOAuth [536] 
export async function signInWithOAuth(client,options){
  try{
    let active_client = await awaitAuthClient();
    let provider = options["provider"];
    let auth_options = options["options"] || {};
    let redirect_to = auth_options["redirectTo"] || window.location.origin;
    let result = await client_supabase.authorize(
      active_client,
      SERVICE_ID,
      {"provider":provider,"redirect_to":redirect_to},
      {}
    );
    let response_url = result["url"] || result["data"]["url"];
    if(response_url){
      window.location.assign(response_url);
    }
    return {"data":result,"error":null};
  }
  catch(error){
    return {"data":null,"error":error};
  }
}

// statsui.edge.remote.util-supabase/resetPasswordForEmail [555] 
export async function resetPasswordForEmail(client,email,options = {}){
  try{
    let active_client = await awaitAuthClient();
    let result = await client_supabase.recovery(active_client,SERVICE_ID,{
      "email":email,
      "redirect_to":options["redirectTo"] || options["redirect_to"]
    },{});
    return {"data":result,"error":null};
  }
  catch(error){
    return {"data":null,"error":error};
  }
}

// statsui.edge.remote.util-supabase/updateUser [570] 
export async function updateUser(client,attributes,options = {}){
  try{
    let active_client = await awaitAuthClient();
    let result = await client_supabase.user_put(active_client,SERVICE_ID,attributes,options);
    let user = result["user"] || result;
    let session = await client_supabase.current_session(active_client,SERVICE_ID,{});
    if(session && user){
      let updated_session = Object.assign({},session,{"user":user});
      await publishOrStoreSession(active_client,updated_session,"USER_UPDATED");
    }
    return {"data":{"user":user},"error":null};
  }
  catch(error){
    return {"data":null,"error":error};
  }
}

// statsui.edge.remote.util-supabase/callRemote [587] 
export async function callRemote(fstr,margs,options = {}){
  let client = await awaitClient();
  let headers = Object.assign({},options["headers"] || {});
  headers["Accept-Profile"] = "stats_rpc";
  headers["Content-Profile"] = "stats_rpc";
  try{
    let data = await client_supabase.rpc_call(client,SERVICE_ID,fstr,margs,{"headers":headers});
    return {"data":data,"error":null};
  }
  catch(error){
    return {"data":null,"error":error};
  }
}

// statsui.edge.remote.util-supabase/callRemoteDebug [601] 
export async function callRemoteDebug(fstr,margs,options = {}){
  let client = await awaitClient();
  let headers = Object.assign({},options["headers"] || {});
  headers["Accept-Profile"] = "stats_debug";
  headers["Content-Profile"] = "stats_debug";
  try{
    let data = await client_supabase.rpc_call(client,SERVICE_ID,fstr,margs,{"headers":headers});
    return {"data":data,"error":null};
  }
  catch(error){
    return {"data":null,"error":error};
  }
}

// statsui.edge.remote.util-supabase/callGraphql [615] 
export async function callGraphql(query,variables = {}){
  let client = await awaitClient();
  try{
    let result = await substrate.request(client,null,"@statstrade-web/auth/graphql",[query,variables],{});
    return {
      "data":result["data"],
      "error":result["error"] || (result["errors"] ? {"message":result["errors"]} : null)
    };
  }
  catch(error){
    return {"data":null,"error":error};
  }
}

// statsui.edge.remote.util-supabase/postgrestValue [634] 
export function postgrestValue(value,quote_string = false){
  if(null == value){
    return "null";
  }
  if((typeof value) == "string"){
    if(quote_string){
      return JSON.stringify(value);
    }
    return value;
  }
  return JSON.stringify(value);
}

// statsui.edge.remote.util-supabase/buildQuery [645] 
export function buildQuery(spec){
  let params = new URLSearchParams();
  if(spec["select"]){
    params.set("select",spec["select"]);
  }
  (spec["filters"] || []).forEach(function (filter){
    let column = filter["column"];
    let operator = filter["operator"] || filter["op"] || "eq";
    let value = filter["value"];
    let encoded_value = (operator == "in") ? ("(" + value.map(function (item){
      return postgrestValue(item,true);
    }).join(",") + ")") : postgrestValue(value);
    params.set(column,operator + "." + encoded_value);
  });
  (spec["order"] || []).forEach(function (order){
    params.append(
      "order",
      order["column"] + "." + ((false == order["ascending"]) ? "desc" : "asc")
    );
  });
  if(!(null == spec["limit"])){
    params.set("limit",spec["limit"]);
  }
  if(!(null == spec["offset"])){
    params.set("offset",spec["offset"]);
  }
  return params.toString();
}

// statsui.edge.remote.util-supabase/queryTable [677] 
export async function queryTable(table,spec,options = {}){
  let client = await awaitClient();
  let headers = Object.assign({},options["headers"] || {});
  let schema = options["schema"] || spec["schema"];
  if(schema){
    headers["Accept-Profile"] = schema;
    headers["Content-Profile"] = schema;
  }
  try{
    let data = await client_supabase.query_table(client,SERVICE_ID,table,buildQuery(spec),{"headers":headers});
    if(spec["single"] || spec["maybe_single"]){
      if(!Array.isArray(data)){
        data = ((null == data) ? [] : [data]);
      }
      if(data["length"] == 1){
        data = data[0];
      }
      else if(spec["maybe_single"] && (data["length"] == 0)){
        data = null;
      }
      else{
        return {
          "data":null,
          "error":{
                    "message":"JSON object requested, multiple (or no) rows returned."
                  }
        };
      }
    }
    return {"data":data,"error":null};
  }
  catch(error){
    return {"data":null,"error":error};
  }
}

// statsui.edge.remote.util-supabase/authHref [704] 
export function authHref(prefix,route){
  return (prefix ? (prefix + "/") : "/") + route;
}

// statsui.edge.remote.util-supabase/authRedirectTo [709] 
export function authRedirectTo(configured,origin){
  return configured || origin;
}

// statsui.edge.remote.util-supabase/getSession [714] 
export async function getSession(){
  try{
    let client = await awaitAuthClient();
    let session = await client_supabase.current_session(client,SERVICE_ID,{});
    return {"data":{"session":session},"error":null};
  }
  catch(error){
    return {"data":null,"error":error};
  }
}

// statsui.edge.remote.util-supabase/getUser [724] 
export async function getUser(){
  try{
    let client = await awaitAuthClient();
    let user = await client_supabase.user_get(client,SERVICE_ID,{});
    return {"data":user,"error":null};
  }
  catch(error){
    return {"data":null,"error":error};
  }
}

// statsui.edge.remote.util-supabase/initLocal [734] 
export async function initLocal(){
  let result = await getSession();
  if(null == result["error"]){
    gs.setStore(["account"],result["data"]["session"]);
  }
  return gs.getStore(["account"]);
}

// statsui.edge.remote.util-supabase/getLocalStore [742] 
export function getLocalStore(storage_key){
  let stored = null;
  try{
    stored = localStorage.getItem(storage_key);
    if(stored){
      try{
        stored = JSON.parse(stored);
      }
      catch(_){
        null;
      }
    }
  }
  catch(_){
    null;
  }
  return stored;
}

// statsui.edge.remote.util-supabase/getCurrentUserId [755] 
export async function getCurrentUserId(){
  let result = await getUser();
  return kd.get_in(result,["data","user","id"]);
}

// statsui.edge.remote.util-supabase/notifyAuthListeners [761] 
export function notifyAuthListeners(event){
  let event_type = event["type"] || "SESSION_CHANGED";
  let session = event["session"];
  Object.keys(
    globalThis["statsui_edge_remote_util_supabase$$AUTH_LISTENERS"]
  ).forEach(function (listener_id){
    let listeners = globalThis["statsui_edge_remote_util_supabase$$AUTH_LISTENERS"][listener_id];
    if(listeners["onAll"]){
      listeners["onAll"]({"type":event_type,"session":session});
    }
    if((event_type == "INITIAL_SESSION") && listeners["onInitial"]){
      listeners["onInitial"](session);
    }
    else if((event_type == "SIGNED_IN") && listeners["onSignedIn"]){
      listeners["onSignedIn"](session);
    }
    else if((event_type == "SIGNED_OUT") && listeners["onSignedOut"]){
      listeners["onSignedOut"](session);
    }
    else if((event_type == "PASSWORD_RECOVERY") && listeners["onPasswordRecovery"]){
      listeners["onPasswordRecovery"](session);
    }
    else if((event_type == "TOKEN_REFRESHED") && listeners["onTokenRefreshed"]){
      listeners["onTokenRefreshed"](session);
    }
    else if((event_type == "USER_UPDATED") && listeners["onUserUpdated"]){
      listeners["onUserUpdated"](session);
    }
    else{
      null;
    }
  });
  return true;
}

// statsui.edge.remote.util-supabase/subscribeWorkerAuthEvents [788] 
export async function subscribeWorkerAuthEvents(client){
  if(null == globalThis["statsui_edge_remote_util_supabase$$AUTH_SUBSCRIPTION"]){
    let setup = async function (){
      let active_client = await awaitClient();
      substrate.register_trigger(active_client,AUTH_SIGNAL,function (_space,stream,_node){
        notifyAuthListeners(stream["data"]);
        return true;
      },null);
      return await substrate.subscribe(
        active_client,
        AUTH_SPACE,
        AUTH_SIGNAL,
        globalThis["statsui_edge_remote_util_supabase$$AUTH_SUBSCRIPTION_ID"],
        {}
      );
    };
    globalThis["statsui_edge_remote_util_supabase$$AUTH_SUBSCRIPTION"] = setup();
  }
  return await globalThis["statsui_edge_remote_util_supabase$$AUTH_SUBSCRIPTION"];
}

// statsui.edge.remote.util-supabase/addListeners [812] 
export function addListeners(listeners,client = getClient()){
  let listener_id = "auth-listener-" + Date.now() + "-" + Math.random();
  globalThis["statsui_edge_remote_util_supabase$$AUTH_LISTENERS"][listener_id] = listeners;
  let setup = async function (){
    try{
      await subscribeWorkerAuthEvents(client);
      let result = await getSession();
      notifyAuthListeners({
        "type":"INITIAL_SESSION",
        "session":kd.get_in(result,["data","session"])
      });
    }
    catch(error){
      console.error("Unable to subscribe to auth session changes.",error);
    }
  };
  setup();
  return listener_id;
}

// statsui.edge.remote.util-supabase/removeSubscription [829] 
export async function removeSubscription(client,subscription){
  if(null == subscription){
    return false;
  }
  delete globalThis["statsui_edge_remote_util_supabase$$AUTH_LISTENERS"][subscription];
  if(Object.keys(
    globalThis["statsui_edge_remote_util_supabase$$AUTH_LISTENERS"]
  )["length"] == 0){
    await unsubscribeWorkerAuthEvents(client);
  }
  return true;
}

// statsui.edge.remote.util-supabase/useListeners [839] 
export function useListeners(listeners,client = getClient(),enabled = true){
  React.useEffect(function (){
    if(enabled){
      let subscription = addListeners(listeners,client);
      return function (){
        removeSubscription(client,subscription);
      };
    }
    return undefined;
  },[client,enabled]);
}

// statsui.edge.remote.util-supabase/useStoreSync [852] 
export function useStoreSync(client = getClient()){
  let [session,setSession] = React.useState(null);
  useListeners({
    "onAll":function ({session}){
        setSession(session);
        gs.setStore(["account"],session);
      }
  },client);
  return [session,setSession];
}

// statsui.edge.remote.util-supabase/useListenSession [863] 
export function useListenSession(client = getClient()){
  let auth_entry = React.useContext(AuthEntryContext);
  let use_worker = null == auth_entry;
  let [session,setSession] = React.useState(null);
  let [loaded,setLoaded] = React.useState(false);
  useListeners({
    "onAll":function ({session}){
        setSession(session);
        setLoaded(true);
      }
  },client,use_worker);
  React.useEffect(function (){
    if(auth_entry){
      let entry_session = auth_entry["session"];
      setSession(entry_session);
      setLoaded(auth_entry["status"] == "ready");
      gs.setStore(["account"],entry_session);
    }
  },[auth_entry]);
  return [session,setSession,loaded];
}

// statsui.edge.remote.util-supabase/useListenPrint [884] 
export function useListenPrint(client = getClient()){
  useListeners({"onAll":console.log},client);
}

// statsui.edge.remote.util-supabase/wrapProcess [889] 
export async function wrapProcess(f){
  let client = await awaitClient();
  let result = await f(client);
  if(result["error"]){
    console.error(result["error"]);
  }
  return result;
}

// statsui.edge.remote.util-supabase/fileUpload [898] 
export async function fileUpload({file_raw,file_path,bucket,options = {}}){
  try{
    let client = await awaitClient();
    let data = await client_supabase.storage_upload(client,SERVICE_ID,bucket,file_path,file_raw,options);
    return {"data":data,"error":null};
  }
  catch(error){
    return {"data":null,"error":error};
  }
}

// statsui.edge.remote.util-supabase/getPublicUrl [909] 
export function getPublicUrl(bucket,object_path){
  let parts = object_path.split("/");
  let encoded = parts.map(function (part){
    return encodeURIComponent(part);
  });
  return process.env.NEXT_PUBLIC_SUPABASE_URL.replace(new RegExp("/$"),"") + "/storage/v1/object/public/" + encodeURIComponent(bucket) + "/" + encoded.join("/");
}

// statsui.edge.remote.util-supabase/toSelect [920] 
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