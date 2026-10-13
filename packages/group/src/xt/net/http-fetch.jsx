import * as protocol from '@statstrade/edge/lib/xt/lang/common-protocol.jsx'

import * as util from '@statstrade/edge/lib/xt/net/http-util.jsx'

// xt.net.http-fetch/IHttpClient [] 
export var IHttpClient = protocol.create_protocol_fn("xt.net.http_fetch/IHttpClient",{
  "request_http":{"name":"request_http","arglist":["client","input"]}
});

// xt.net.http-fetch/request-http [] 
export function request_http(client,input){
  let method_fn = protocol.protocol_method(client,"xt.net.http_fetch/IHttpClient","request_http");
  return method_fn(client,input);
}

// xt.net.http-fetch/REQUEST_FIELDS [14] 
export var REQUEST_FIELDS = ["method","url","query","headers","body","timeout","opts"];

// xt.net.http-fetch/RESPONSE_FIELDS [23] 
export var RESPONSE_FIELDS = ["status","headers","body","error"];

// xt.net.http-fetch/prepare-url [29] 
export function prepare_url(client,input){
  let {path,url} = input;
  if(!(null == url)){
    return url;
  }
  let {defaults} = client;
  let {basepath,host,port,secured} = defaults;
  return "http" + (secured ? "s" : "") + "://" + host + ":" + String(port || 80) + (basepath || "") + (path || "");
}

// xt.net.http-fetch/prepare-input [48] 
export function prepare_input(client,input){
  let {defaults} = client;
  let {body,method} = input;
  let headers = Object.assign(Object.assign({},defaults["headers"]),input["headers"]);
  let output = {
    "url":prepare_url(client,input),
    "method":method || "GET",
    "headers":headers
  };
  if(null != body){
    output = Object.assign(output,{"body":body});
  }
  return output;
}

// xt.net.http-fetch/wrap-prepare-input [63] 
export function wrap_prepare_input(handler){
  return function (client,input){
    let prepped = prepare_input(client,input);
    return handler(client,prepped);
  };
}

// xt.net.http-fetch/wrap-normalise [71] 
export function wrap_normalise(handler){
  return function (client,input){
    return handler(client,input).then(function (response){
      return util.response_normalize(response);
    });
  };
}

// xt.net.http-fetch/then-normalise [82] 
export function then_normalise(promise){
  return promise.then(util.response_normalize);
}

// xt.net.http-fetch/prepare-middleware [88] 
export function prepare_middleware(client,handler){
  let {middleware} = client;
  for(let wrapper of middleware || []){
    handler = wrapper(handler);
  };
  return handler;
}

// xt.net.http-fetch/prepare-handler [95] 
export function prepare_handler(client,handler){
  return wrap_normalise(prepare_middleware(client,wrap_prepare_input(handler)));
}