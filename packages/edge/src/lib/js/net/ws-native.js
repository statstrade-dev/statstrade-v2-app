import * as protocol from '@statstrade/edge/lib/xt/lang/common-protocol.jsx'

import * as websocket from '@statstrade/edge/lib/xt/net/ws-native.jsx'

// js.net.ws-native/WebsocketClient [] 
export function WebsocketClient(raw,defaults,state){
  globalThis["xt_lang_common_protocol$$IMPLEMENTATIONS"]["js.net.ws_native/WebsocketClient"] = true;
  protocol.register_protocol_impl(websocket.IWebsocket["on"],"js.net.ws_native/WebsocketClient",{
    "connect":connect_ws,
    "disconnect":disconnect_ws,
    "send":send_ws,
    "add_listeners":add_listeners_ws
  });
  protocol.register_protocol_impl(websocket.IWebsocketHeartbeat["on"],"js.net.ws_native/WebsocketClient",{
    "start_heartbeat":start_heartbeat_ws,
    "stop_heartbeat":stop_heartbeat_ws
  });
  return {
    "::":"js.net.ws_native/WebsocketClient",
    "::/protocols":[
        websocket.IWebsocket["on"],
        websocket.IWebsocketHeartbeat["on"]
      ],
    "::/protocol-impls":{
        [websocket.IWebsocket["on"]]:{
          "connect":connect_ws,
          "disconnect":disconnect_ws,
          "send":send_ws,
          "add_listeners":add_listeners_ws
        },
        [websocket.IWebsocketHeartbeat["on"]]:{
          "start_heartbeat":start_heartbeat_ws,
          "stop_heartbeat":stop_heartbeat_ws
        }
      },
    "raw":raw,
    "defaults":defaults,
    "state":state
  };
}

// js.net.ws-native/connect-ws [12] 
export function connect_ws(client,opts){
  let url = websocket.prepare_url(client,opts || {});
  let raw = new WebSocket(url);
  client["raw"] = raw;
  return new Promise(function (resolve,reject){
    let cleanup_fn = function (){
      raw.removeEventListener("open",on_open);
      raw.removeEventListener("error",on_error);
      raw.removeEventListener("close",on_close);
    };
    let on_open = function (event){
      cleanup_fn();
      resolve(client);
    };
    let on_error = function (event){
      cleanup_fn();
      reject(event);
    };
    let on_close = function (event){
      cleanup_fn();
      reject(event);
    };
    raw.addEventListener("open",on_open);
    raw.addEventListener("error",on_error);
    raw.addEventListener("close",on_close);
  });
}

// js.net.ws-native/disconnect-ws [43] 
export function disconnect_ws(client){
  let {raw} = client;
  if(raw){
    raw.close(1000,"done");
  }
  client["raw"] = null;
  return client;
}

// js.net.ws-native/send-ws [53] 
export function send_ws(client,input){
  let {raw} = client;
  if(raw){
    return raw.send(input);
  }
}

// js.net.ws-native/add-listeners-ws [62] 
export function add_listeners_ws(client,m){
  let {raw} = client;
  if(raw){
    for(let [k,handler] of Object.entries(m)){
      raw.addEventListener(k,handler);
    };
    return Object.keys(m);
  }
}

// js.net.ws-native/default-heartbeat-fn [72] 
export function default_heartbeat_fn(client,name){
  return websocket.send(client,"heartbeat");
}

// js.net.ws-native/start-heartbeat-ws [78] 
export function start_heartbeat_ws(client,name,f,interval){
  let {defaults,state} = client;
  let heartbeats = state["heartbeats"] || {};
  let stop_fn = heartbeats[name];
  if("function" == (typeof stop_fn)){
    stop_fn();
  }
  f = (f || defaults["heartbeat_fn"] || default_heartbeat_fn);
  interval = (interval || defaults["heartbeat_interval"] || 30000);
  let timer = setInterval(function (){
    f(client,name);
  },interval);
  heartbeats[name] = (function (){
    clearInterval(timer);
    delete(heartbeats[name]);
    return true;
  });
  state["heartbeats"] = heartbeats;
  return timer;
}

// js.net.ws-native/stop-heartbeat-ws [105] 
export function stop_heartbeat_ws(client,name){
  let {state} = client;
  let heartbeats = state["heartbeats"] || {};
  let stop_fn = heartbeats[name];
  if("function" == (typeof stop_fn)){
    stop_fn();
  }
  return client;
}

// js.net.ws-native/create [129] 
export function create(defaults){
  return WebsocketClient(null,defaults,{"heartbeats":{},"callbacks":{}});
}