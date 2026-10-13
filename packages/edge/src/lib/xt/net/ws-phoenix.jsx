import * as websocket from '@statstrade/edge/lib/xt/net/ws-native.jsx'

// xt.net.ws-phoenix/IPhxFrame [8] 
export var IPhxFrame = [
  "encode_frame",
  "decode_frame",
  "frame",
  "join_frame",
  "leave_frame",
  "push_frame",
  "send_frame",
  "join",
  "leave",
  "push"
];

// xt.net.ws-phoenix/extract-message-data [21] 
export function extract_message_data(message){
  if("string" == (typeof message)){
    return message;
  }
  else if(null != message["data"]){
    return message["data"];
  }
  else if(null != message["body"]){
    return message["body"];
  }
  else{
    return message;
  }
}

// xt.net.ws-phoenix/decode-frame [37] 
export function decode_frame(message){
  let data = extract_message_data(message);
  if(!("string" == (typeof data))){
    return data;
  }
  return JSON.parse(data);
}

// xt.net.ws-phoenix/get-frame-ref [53] 
export function get_frame_ref(opts){
  return String(opts["ref"] || opts["join_ref"] || Date.now());
}

// xt.net.ws-phoenix/make-frame [62] 
export function make_frame(topic,event,payload,opts){
  let ref = get_frame_ref(opts);
  let join_ref = opts["join_ref"] || ref;
  return {
    "topic":topic,
    "event":event,
    "payload":payload || {},
    "ref":ref,
    "join_ref":join_ref
  };
}

// xt.net.ws-phoenix/make-frame-join [75] 
export function make_frame_join(payload,opts){
  let {topic} = opts;
  if(null == topic){
    throw "Phoenix channel missing topic";
  }
  return make_frame(topic,"phx_join",payload || {},opts || {});
}

// xt.net.ws-phoenix/make-frame-leave [87] 
export function make_frame_leave(opts){
  let {topic} = opts;
  if(null == topic){
    throw "Phoenix channel missing topic";
  }
  return make_frame(topic,"phx_leave",{},opts || {});
}

// xt.net.ws-phoenix/make-frame-heartbeat [96] 
export function make_frame_heartbeat(opts){
  let ref = get_frame_ref(opts || {});
  return {
    "topic":"phoenix",
    "event":"heartbeat",
    "payload":{},
    "ref":ref,
    "join_ref":ref
  };
}

// xt.net.ws-phoenix/encode-frame [107] 
export function encode_frame(frame){
  return {
    "join_ref":frame["join_ref"] || frame["ref"],
    "ref":frame["ref"],
    "topic":frame["topic"],
    "event":frame["event"],
    "payload":frame["payload"] || {}
  };
}

// xt.net.ws-phoenix/send-frame [123] 
export function send_frame(client,frame){
  return websocket.send(client,JSON.stringify(encode_frame(frame)));
}

// xt.net.ws-phoenix/wrap-phoenix [129] 
export function wrap_phoenix(handlers){
  return function (event){
    let frame = decode_frame(event);
    let handler = handlers[frame["event"]];
    if("function" == (typeof handler)){
      handler(frame);
    }
  };
}

// xt.net.ws-phoenix/start-heartbeat [143] 
export function start_heartbeat(client){
  return websocket.start_heartbeat(client,"phoenix.default",function (client,name){
    send_frame(client,make_frame_heartbeat({}));
  },30000);
}