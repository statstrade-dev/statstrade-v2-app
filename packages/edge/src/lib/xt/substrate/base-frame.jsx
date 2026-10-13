import * as str from '@statstrade/edge/lib/xt/lang/common-string.jsx'

// xt.substrate.base-frame/rand-id [91] 
export function rand_id(prefix,n){
  return (prefix || "") + str.str_rand(n);
}

// xt.substrate.base-frame/frame [98] 
export function frame(kind,id,space,meta,extra){
  return Object.assign({
    "kind":kind,
    "id":id,
    "space":space || "__NODE__",
    "meta":meta || {}
  },extra || {});
}

// xt.substrate.base-frame/request-frame [110] 
export function request_frame(space,action,args,meta){
  meta = (meta || {});
  return frame(
    "request",
    meta["id"] || rand_id("req-",6),
    space,
    meta,
    {"action":action,"args":args || []}
  );
}

// xt.substrate.base-frame/response-frame [124] 
export function response_frame(reply_to,space,status,data,error,meta){
  meta = (meta || {});
  return frame(
    "response",
    meta["id"] || rand_id("res-",6),
    space,
    meta,
    {"reply_to":reply_to,"status":status,"data":data,"error":error}
  );
}

// xt.substrate.base-frame/response-ok-frame [140] 
export function response_ok_frame(reply_to,space,data,meta){
  return response_frame(reply_to,space,"ok",data,null,meta);
}

// xt.substrate.base-frame/response-error-frame [146] 
export function response_error_frame(reply_to,space,error,meta){
  return response_frame(reply_to,space,"error",null,error,meta);
}

// xt.substrate.base-frame/stream-frame [152] 
export function stream_frame(space,signal,data,meta,cause){
  meta = (meta || {});
  return frame(
    "stream",
    meta["id"] || rand_id("evt-",6),
    space,
    meta,
    {"signal":signal,"data":data,"cause":cause}
  );
}

// xt.substrate.base-frame/request-frame? [167] 
export function request_framep(frame){
  return "request" == frame["kind"];
}

// xt.substrate.base-frame/response-frame? [174] 
export function response_framep(frame){
  return "response" == frame["kind"];
}

// xt.substrate.base-frame/stream-frame? [181] 
export function stream_framep(frame){
  return "stream" == frame["kind"];
}