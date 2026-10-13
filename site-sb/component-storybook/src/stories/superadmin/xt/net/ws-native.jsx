import * as protocol from '@statstrade/edge/lib/xt/lang/common-protocol.jsx'

// xt.net.ws-native/IWebsocket [] 
export var IWebsocket = protocol.create_protocol_fn("xt.net.ws_native/IWebsocket",{
  "connect":{"name":"connect","arglist":["client","opts"]},
  "disconnect":{"name":"disconnect","arglist":["client"]},
  "send":{"name":"send","arglist":["client","input"]},
  "add_listeners":{"name":"add_listeners","arglist":["client","m"]}
});

// xt.net.ws-native/connect [] 
export function connect(client,opts){
  let method_fn = protocol.protocol_method(client,"xt.net.ws_native/IWebsocket","connect");
  return method_fn(client,opts);
}

// xt.net.ws-native/disconnect [] 
export function disconnect(client){
  let method_fn = protocol.protocol_method(client,"xt.net.ws_native/IWebsocket","disconnect");
  return method_fn(client);
}

// xt.net.ws-native/send [] 
export function send(client,input){
  let method_fn = protocol.protocol_method(client,"xt.net.ws_native/IWebsocket","send");
  return method_fn(client,input);
}

// xt.net.ws-native/add-listeners [] 
export function add_listeners(client,m){
  let method_fn = protocol.protocol_method(client,"xt.net.ws_native/IWebsocket","add_listeners");
  return method_fn(client,m);
}

// xt.net.ws-native/IWebsocketHeartbeat [] 
export var IWebsocketHeartbeat = protocol.create_protocol_fn("xt.net.ws_native/IWebsocketHeartbeat",{
  "start_heartbeat":{
    "name":"start_heartbeat",
    "arglist":["client","name","f","interval"]
  },
  "stop_heartbeat":{"name":"stop_heartbeat","arglist":["client","name"]}
});

// xt.net.ws-native/start-heartbeat [] 
export function start_heartbeat(client,name,f,interval){
  let method_fn = protocol.protocol_method(
    client,
    "xt.net.ws_native/IWebsocketHeartbeat",
    "start_heartbeat"
  );
  return method_fn(client,name,f,interval);
}

// xt.net.ws-native/stop-heartbeat [] 
export function stop_heartbeat(client,name){
  let method_fn = protocol.protocol_method(
    client,
    "xt.net.ws_native/IWebsocketHeartbeat",
    "stop_heartbeat"
  );
  return method_fn(client,name);
}

// xt.net.ws-native/prepare-url [21] 
export function prepare_url(client,input){
  let {path,url} = input;
  if(!(null == url)){
    return url;
  }
  let {defaults} = client;
  let {basepath,host,port,secured} = defaults;
  return "ws" + (secured ? "s" : "") + "://" + host + ":" + String(port || 80) + (basepath || "") + (path || "");
}