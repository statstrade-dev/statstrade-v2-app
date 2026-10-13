import React from 'react'

import * as kd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as runtime from '@statstrade/edge/lib/xt/db/node/runtime.jsx'

import * as kl from '@statstrade/edge/lib/xt/lang/common-lib.jsx'

import * as client_supabase from '@statstrade/edge/lib/xt/db/node/client-supabase.jsx'

import * as gs from '@statstrade/edge/global-store.jsx'

import * as ks from '@statstrade/edge/lib/xt/lang/common-string.jsx'

import * as substrate from '@statstrade/edge/lib/xt/substrate.jsx'

import * as browser_transport from '@statstrade/edge/lib/xt/substrate/transport-browser.jsx'

// statsui.edge.remote.util-supabase/SERVICE_ID [17] 
export var SERVICE_ID = "db/primary";

// statsui.edge.remote.util-supabase/AUTH_SPACE [18] 
export var AUTH_SPACE = "statstrade-web-auth";

// statsui.edge.remote.util-supabase/AUTH_SIGNAL [19] 
export var AUTH_SIGNAL = "session.changed";

// statsui.edge.remote.util-supabase/REFRESH_TOKEN_KEY [20] 
export var REFRESH_TOKEN_KEY = "statstrade-web-refresh-token";

// statsui.edge.remote.util-supabase/CLIENTS [21] 
globalThis["statsui_edge_remote_util_supabase$$CLIENTS"] = {};

// statsui.edge.remote.util-supabase/AUTH_LISTENERS [22] 
globalThis["statsui_edge_remote_util_supabase$$AUTH_LISTENERS"] = {};

// statsui.edge.remote.util-supabase/AUTH_SUBSCRIPTION [23] 
globalThis["statsui_edge_remote_util_supabase$$AUTH_SUBSCRIPTION"] = null;

// statsui.edge.remote.util-supabase/AUTH_SUBSCRIPTION_ID [24] 
globalThis["statsui_edge_remote_util_supabase$$AUTH_SUBSCRIPTION_ID"] = "statstrade-auth-session";

// statsui.edge.remote.util-supabase/RUNTIME_GENERATION [25] 
globalThis["statsui_edge_remote_util_supabase$$RUNTIME_GENERATION"] = 0;

// statsui.edge.remote.util-supabase/newEntry [27] 
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

// statsui.edge.remote.util-supabase/unsyncEntry [39] 
export async function unsyncEntry(entry){
  if(nilp(entry)){
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
    await runtime.sharedworker_disconnect(entry["connection"]);
  }
  entry["ready"] = false;
  entry["connecting"] = null;
  entry["connection"] = null;
  return true;
}

// statsui.edge.remote.util-supabase/createParams [55] 
export function createParams(input = {}){
  return {
    "url":input["url"] || process.env.NEXT_PUBLIC_SUPABASE_URL,
    "key":input["key"] || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  };
}

// statsui.edge.remote.util-supabase/getEntry [61] 
export function getEntry(client_id = "default"){
  return globalThis["statsui_edge_remote_util_supabase$$CLIENTS"][client_id];
}

// statsui.edge.remote.util-supabase/createClient [66] 
export function createClient(params){
  return substrate.node_create({"id":params["client_id"] || "statstrade-shared-client"});
}

// statsui.edge.remote.util-supabase/getDefaultClient [72] 
export function getDefaultClient(client_id = "default"){
  return getEntry(client_id);
}

// statsui.edge.remote.util-supabase/getClient [77] 
export function getClient(client_id = "default",params){
  let entry = getEntry(client_id);
  let next_params = createParams(params);
  if(entry && ((entry["params"]["url"] != next_params["url"]) || (entry["params"]["key"] != next_params["key"]))){
    unsyncEntry(entry);
    delete globalThis["statsui_edge_remote_util_supabase$$CLIENTS"][client_id];
    entry = null;
  }
  if(!entry){
    let client = createClient(params);
    entry = newEntry(client,next_params);
    globalThis["statsui_edge_remote_util_supabase$$CLIENTS"][client_id] = entry;
  }
  return entry["instance"];
}

// statsui.edge.remote.util-supabase/workerConfig [95] 
export function workerConfig(input = {}){
  let params = createParams(input);
  let url = new URL(params["url"]);
  let secured = url["protocol"] == "https:";
  return {
    "site_map_url":"/worker/site-map/manifest.json",
    "primary":{
        "type":"supabase",
        "defaults":{
            "host":url["hostname"],
            "port":url["port"] ? url["port"] : (secured ? 443 : 80),
            "secured":secured,
            "basepath":(url["pathname"] == "/") ? "" : url["pathname"],
            "apikey":params["key"]
          }
      },
    "caching":{"type":"sqlite","defaults":{"filename":":memory:"}}
  };
}

// statsui.edge.remote.util-supabase/loadInitialSession [115] 
export async function loadInitialSession(client){
  let impersonation_response = null;
  try{
    impersonation_response = await fetch(
      "/api/impersonation/token",
      {"credentials":"same-origin","cache":"no-store"}
    );
  }
  catch(_){
    null;
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
    await publishSession(client,callback_session,"SIGNED_IN");
    window.history.replaceState(
      null,
      "",
      window.location["pathname"] + window.location["search"]
    );
    return callback_session;
  }
  let session = await client_supabase.current_session(client,SERVICE_ID,{});
  let refresh_token = session["refresh_token"] || localStorage.getItem(REFRESH_TOKEN_KEY);
  let refresh_at = (Date.now() / 1000) + 180;
  if(refresh_token && (nilp(session) || nilp(session["expires_at"]) || (session["expires_at"] <= refresh_at))){
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

// statsui.edge.remote.util-supabase/connectClient [171] 
export async function connectClient(client_id = "default"){
  let entry = getEntry(client_id);
  let client = getClient(client_id);
  if(entry["ready"]){
    return entry["connection"];
  }
  if(entry["connecting"]){
    return await entry["connecting"];
  }
  let connect_fn = async function (){
    try{
      let state = await runtime.sharedworker_connect_state(client,workerConfig(entry["params"]),{},{},browser_transport.sharedworker_url_source(
        "/workers/web.sharedworker.js",
        {"type":"module","name":"statstrade-shared-worker"}
      ),null);
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

// statsui.edge.remote.util-supabase/resetClients [210] 
export async function resetClients(){
  let client_ids = Object.keys(globalThis["statsui_edge_remote_util_supabase$$CLIENTS"]);
  if(globalThis["statsui_edge_remote_util_supabase$$AUTH_SUBSCRIPTION"] && globalThis["statsui_edge_remote_util_supabase$$CLIENTS"]["default"] && globalThis["statsui_edge_remote_util_supabase$$CLIENTS"]["default"]["ready"]){
    await unsubscribeWorkerAuthEvents(
      globalThis["statsui_edge_remote_util_supabase$$CLIENTS"]["default"]["instance"]
    );
  }
  for(let client_id = client_ids){
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
      await runtime.sharedworker_disconnect(entry["connection"]);
    }
    let waiters = entry["waiters"];
    for(let waiter = waiters){
      waiter.reject(new Error("The SharedWorker client was reset."));
    }
    entry["waiters"] = [];
    entry["ready"] = false;
    entry["connection"] = null;
    entry["connecting"] = null;
    delete globalThis["statsui_edge_remote_util_supabase$$CLIENTS"][client_id];
  }
  globalThis["statsui_edge_remote_util_supabase$$AUTH_LISTENERS"] = {};
  globalThis["statsui_edge_remote_util_supabase$$AUTH_SUBSCRIPTION"] = null;
  return true;
}

// statsui.edge.remote.util-supabase/SharedWorkerRuntime [239] 
export function SharedWorkerRuntime({children}){
  React.useEffect(function (){
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
    [];
  });
  return children;
}

// statsui.edge.remote.util-supabase/markClientReady [267] 
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
  for(let waiter = waiters){
    waiter.resolve(entry["instance"]);
  }
  return entry["instance"];
}

// statsui.edge.remote.util-supabase/markClientFailed [283] 
export function markClientFailed(error,client_id = "default"){
  let entry = getEntry(client_id);
  if(!entry){
    return false;
  }
  entry["ready"] = false;
  entry["error"] = error;
  let waiters = entry["waiters"];
  entry["waiters"] = [];
  for(let waiter = waiters){
    waiter.reject(error);
  }
  return true;
}

// statsui.edge.remote.util-supabase/awaitClient [297] 
export async function awaitClient(client_id = "default"){
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

// statsui.edge.remote.util-supabase/setSession [314] 
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
  if(nilp(session) && options["clear_refresh"]){
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
  return result;
}

// statsui.edge.remote.util-supabase/publishSession [332] 
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
  if(nilp(session)){
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
  return result;
}

// statsui.edge.remote.util-supabase/signInWithPassword [348] 
export async function signInWithPassword(client,credentials,options = {}){
  try{
    let active_client = await awaitClient();
    let session = await client_supabase.sign_in(active_client,SERVICE_ID,credentials,options);
    await publishSession(active_client,session,"SIGNED_IN");
    return {
      "data":{"user":session["user"],"session":session},
      "error":null
    };
  }
  catch(error){
    return {"data":null,"error":error};
  }
}

// statsui.edge.remote.util-supabase/signUp [362] 
export async function signUp(client,credentials,options = {}){
  try{
    let active_client = await awaitClient();
    let result = await client_supabase.sign_up(active_client,SERVICE_ID,credentials,options);
    let session = result["session"] || result;
    if(session && session["refresh_token"]){
      await publishSession(active_client,session,"SIGNED_IN");
    }
    return {"data":result,"error":null};
  }
  catch(error){
    return {"data":null,"error":error};
  }
}

// statsui.edge.remote.util-supabase/signOut [376] 
export async function signOut(client,options = {}){
  try{
    let active_client = await awaitClient();
    let session = await client_supabase.current_session(active_client,SERVICE_ID,{});
    if(session["is_impersonated"] && !options["skip_impersonation_end"]){
      await fetch(
        "/api/impersonation/end",
        {"method":"POST","credentials":"same-origin"}
      );
    }
    let result = await client_supabase.sign_out(active_client,SERVICE_ID,options);
    await publishSession(active_client,null,"SIGNED_OUT");
    return {"data":result,"error":null};
  }
  catch(error){
    return {"data":null,"error":error};
  }
}

// statsui.edge.remote.util-supabase/signInWithOAuth [393] 
export async function signInWithOAuth(client,options){
  try{
    let active_client = await awaitClient();
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

// statsui.edge.remote.util-supabase/resetPasswordForEmail [412] 
export async function resetPasswordForEmail(client,email,options = {}){
  try{
    let active_client = await awaitClient();
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

// statsui.edge.remote.util-supabase/callRemote [427] 
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

// statsui.edge.remote.util-supabase/callRemoteDebug [441] 
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

// statsui.edge.remote.util-supabase/callGraphql [455] 
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

// statsui.edge.remote.util-supabase/postgrestValue [474] 
export function postgrestValue(value,quote_string = false){
  if(nilp(value)){
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

// statsui.edge.remote.util-supabase/buildQuery [485] 
export function buildQuery(spec){
  let params = new URLSearchParams();
  if(spec["select"]){
    params.set("select",spec["select"]);
  }
  for(let filter = spec["filters"] || []){
    let column = filter["column"];
    let operator = filter["operator"] || filter["op"] || "eq";
    let value = filter["value"];
    let encoded_value = (operator == "in") ? ("(" + value.map(function (item){
      return postgrestValue(item,true);
    }).join(",") + ")") : postgrestValue(value);
    params.set(column,operator + "." + encoded_value);
  }
  for(let order = spec["order"] || []){
    params.append(
      "order",
      order["column"] + "." + ((false == order["ascending"]) ? "desc" : "asc")
    );
  }
  if(!nilp(spec["limit"])){
    params.set("limit",spec["limit"]);
  }
  if(!nilp(spec["offset"])){
    params.set("offset",spec["offset"]);
  }
  return params.toString();
}

// statsui.edge.remote.util-supabase/queryTable [513] 
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
        data = (nilp(data) ? [] : [data]);
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

// statsui.edge.remote.util-supabase/authHref [540] 
export function authHref(prefix,route){
  return (prefix ? (prefix + "/") : "/") + route;
}

// statsui.edge.remote.util-supabase/authRedirectTo [545] 
export function authRedirectTo(configured,origin){
  return configured || origin;
}

// statsui.edge.remote.util-supabase/getSession [550] 
export async function getSession(){
  try{
    let client = await awaitClient();
    let session = await client_supabase.current_session(client,SERVICE_ID,{});
    return {"data":{"session":session},"error":null};
  }
  catch(error){
    return {"data":null,"error":error};
  }
}

// statsui.edge.remote.util-supabase/getUser [560] 
export async function getUser(){
  try{
    let client = await awaitClient();
    let user = await client_supabase.user_get(client,SERVICE_ID,{});
    return {"data":user,"error":null};
  }
  catch(error){
    return {"data":null,"error":error};
  }
}

// statsui.edge.remote.util-supabase/initLocal [570] 
export async function initLocal(){
  let result = await getSession();
  if(nilp(result["error"])){
    gs.setStore(["account"],result["data"]["session"]);
  }
  return gs.getStore(["account"]);
}

// statsui.edge.remote.util-supabase/getLocalStore [578] 
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

// statsui.edge.remote.util-supabase/getCurrentUserId [591] 
export async function getCurrentUserId(){
  let result = await getUser();
  return kd.get_in(result,["data","user","id"]);
}

// statsui.edge.remote.util-supabase/notifyAuthListeners [597] 
export function notifyAuthListeners(event){
  let event_type = event["type"] || "SESSION_CHANGED";
  let session = event["session"];
  for(let listener_id = Object.keys(
    globalThis["statsui_edge_remote_util_supabase$$AUTH_LISTENERS"]
  )){
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
  }
  return true;
}

// statsui.edge.remote.util-supabase/subscribeWorkerAuthEvents [622] 
export async function subscribeWorkerAuthEvents(client){
  if(nilp(
    globalThis["statsui_edge_remote_util_supabase$$AUTH_SUBSCRIPTION"]
  )){
    globalThis["statsui_edge_remote_util_supabase$$AUTH_SUBSCRIPTION"] = async function (){
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
  }
  return await globalThis["statsui_edge_remote_util_supabase$$AUTH_SUBSCRIPTION"];
}

// statsui.edge.remote.util-supabase/unsubscribeWorkerAuthEvents [645] 
export async function unsubscribeWorkerAuthEvents(client){
  if(nilp(
    globalThis["statsui_edge_remote_util_supabase$$AUTH_SUBSCRIPTION"]
  )){
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

// statsui.edge.remote.util-supabase/addListeners [666] 
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

// statsui.edge.remote.util-supabase/removeSubscription [683] 
export async function removeSubscription(client,subscription){
  if(nilp(subscription)){
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

// statsui.edge.remote.util-supabase/useListeners [693] 
export function useListeners(listeners,client = getClient()){
  React.useEffect(function (){
    let subscription = addListeners(listeners,client);
    return function (){
      removeSubscription(client,subscription);
    };
  },[]);
}

// statsui.edge.remote.util-supabase/useStoreSync [704] 
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

// statsui.edge.remote.util-supabase/useListenSession [715] 
export function useListenSession(client = getClient()){
  let [session,setSession] = React.useState(null);
  let [loaded,setLoaded] = React.useState(false);
  useListeners({
    "onAll":function ({session}){
        setSession(session);
        setLoaded(true);
      }
  },client);
  return [session,setSession,loaded];
}

// statsui.edge.remote.util-supabase/useListenPrint [727] 
export function useListenPrint(client = getClient()){
  useListeners({"onAll":console.log},client);
}

// statsui.edge.remote.util-supabase/wrapProcess [732] 
export async function wrapProcess(f){
  let client = await awaitClient();
  let result = await f(client);
  if(result["error"]){
    console.error(result["error"]);
  }
  return result;
}

// statsui.edge.remote.util-supabase/fileUpload [741] 
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

// statsui.edge.remote.util-supabase/getPublicUrl [752] 
export function getPublicUrl(bucket,object_path){
  let parts = object_path.split("/");
  let encoded = parts.map(function (part){
    return encodeURIComponent(part);
  });
  return process.env.NEXT_PUBLIC_SUPABASE_URL.replace(//$/,"") + "/storage/v1/object/public/" + encodeURIComponent(bucket) + "/" + encoded.join("/");
}

// statsui.edge.remote.util-supabase/toSelect [763] 
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