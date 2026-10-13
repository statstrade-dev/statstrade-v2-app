import * as xtd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as impl_common from '@statstrade/edge/lib/xt/db/system/impl-common.jsx'

import * as supabase_ws from '@statstrade/edge/lib/xt/db/system/impl-supabase-ws.jsx'

import * as websocket from '@statstrade/edge/lib/xt/net/ws-native.jsx'

import * as http_util from '@statstrade/edge/lib/xt/net/http-util.jsx'

import * as phoenix from '@statstrade/edge/lib/xt/net/ws-phoenix.jsx'

// xt.db.system.impl-supabase-realtime/prepare-connect-url [36] 
export function prepare_connect_url(impl,params){
  let {client} = impl;
  let {defaults} = client;
  let path = "/realtime/v1/websocket" + "?" + http_util.encode_query_params(
    Object.assign({"vsn":"1.0.0","apikey":defaults["apikey"]},params)
  );
  return websocket.prepare_url(client,{"path":path});
}

// xt.db.system.impl-supabase-realtime/get-auth-token [53] 
export function get_auth_token(impl){
  return xtd.get_in(impl,["state","session","access_token"]) || xtd.get_in(impl,["client","defaults","token"]) || xtd.get_in(impl,["client","defaults","apikey"]);
}

// xt.db.system.impl-supabase-realtime/topic-join-payload [61] 
export function topic_join_payload(impl,topic){
  let auth_token = get_auth_token(impl);
  let payload = {
    "config":{"broadcast":{"ack":false,"self":false},"private":true}
  };
  if(null != auth_token){
    payload["access_token"] = auth_token;
  }
  return phoenix.make_frame_join(payload,{"topic":topic,"ref":"#/join/" + topic});
}

// xt.db.system.impl-supabase-realtime/topic-leave-payload [77] 
export function topic_leave_payload(impl,topic){
  return phoenix.make_frame_leave({"topic":topic,"ref":"#/leave/" + topic});
}

// xt.db.system.impl-supabase-realtime/create-realtime-on-message [90] 
export function create_realtime_on_message(realtime_client){
  return phoenix.wrap_phoenix({
    "broadcast":function (frame){
        let envelope = frame["payload"];
        let {event} = envelope;
        if(("xt.db/event" == event) || ("db/sync" == event) || ("db/remove" == event)){
          let {payload} = envelope;
          let {topic} = frame;
          let callbacks = xtd.get_in(realtime_client,["state","callbacks"]);
          for(let [_id,callback] of Object.entries(callbacks)){
            callback(Object.assign({"topic":topic},payload));
          };
        }
      },
    "phx_reply":function (frame){
        let {topic} = frame;
        let entry = xtd.get_in(realtime_client,["state","topics",topic]);
        if((null != entry) && ("object" == (typeof entry)) && !Array.isArray(entry)){
          let status = xtd.get_in(frame,["payload","status"]);
          let ok = status == "ok";
          let {deferred} = entry;
          let {resolve} = deferred;
          xtd.set_in(realtime_client,["state","topics",topic,"ready"],ok);
          if("function" == (typeof resolve)){
            resolve(ok);
          }
        }
      }
  });
}

// xt.db.system.impl-supabase-realtime/create-realtime [120] 
export function create_realtime(impl,conn_id){
  let realtime_client = supabase_ws.create_ws_client(impl,{"id":conn_id});
  xtd.set_in(realtime_client,["state","callbacks"],{});
  xtd.set_in(realtime_client,["state","topics"],{});
  let ws_url = prepare_connect_url(impl,{});
  let init = websocket.connect(realtime_client,{"url":ws_url});
  xtd.set_in(realtime_client,["state","init"],init);
  websocket.add_listeners(realtime_client,{
    "open":function (raw){
        phoenix.start_heartbeat(realtime_client);
      },
    "message":create_realtime_on_message(realtime_client)
  });
  return realtime_client;
}

// xt.db.system.impl-supabase-realtime/get-realtime [139] 
export function get_realtime(impl,conn_id){
  return xtd.get_in(impl,["state","realtimes",conn_id]);
}

// xt.db.system.impl-supabase-realtime/set-realtime [145] 
export function set_realtime(impl,conn_id,client){
  xtd.set_in(impl,["state","realtimes",conn_id],client);
  return client;
}

// xt.db.system.impl-supabase-realtime/ensure-realtime [152] 
export function ensure_realtime(impl,conn_id){
  let client = get_realtime(impl,conn_id);
  if(null != client){
    return client;
  }
  client = create_realtime(impl,conn_id);
  set_realtime(impl,conn_id,client);
  return client;
}

// xt.db.system.impl-supabase-realtime/remove-realtime [163] 
export function remove_realtime(impl,conn_id){
  let client = get_realtime(impl,conn_id);
  if(null != client){
    xtd.set_in(client,["state","topics"],{});
    websocket.disconnect(client);
  }
  delete(xtd.get_in(impl,["state","realtimes"])[conn_id]);
  return client;
}

// xt.db.system.impl-supabase-realtime/get-realtime-callback [174] 
export function get_realtime_callback(impl,conn_id,callback_id){
  return xtd.get_in(get_realtime(impl,conn_id),["state","callbacks",callback_id]);
}

// xt.db.system.impl-supabase-realtime/add-realtime-callback [181] 
export function add_realtime_callback(impl,conn_id,callback_id,handler){
  let client = ensure_realtime(impl,conn_id);
  let callbacks = xtd.get_in(client,["state","callbacks"]);
  if(null == callbacks){
    callbacks = {};
    xtd.set_in(client,["state","callbacks"],callbacks);
  }
  callbacks[callback_id] = handler;
  return handler;
}

// xt.db.system.impl-supabase-realtime/remove-realtime-callback [193] 
export function remove_realtime_callback(impl,conn_id,callback_id){
  let client = get_realtime(impl,conn_id);
  if(null != client){
    let callbacks = xtd.get_in(client,["state","callbacks"]);
    delete(callbacks[callback_id]);
  }
  return true;
}

// xt.db.system.impl-supabase-realtime/get-topics [203] 
export function get_topics(impl,conn_id){
  let client = get_realtime(impl,conn_id);
  if(null != client){
    return xtd.get_in(client,["state","topics"]);
  }
  else{
    return {};
  }
}

// xt.db.system.impl-supabase-realtime/create-sync-callback [212] 
export function create_sync_callback(impl){
  return function (event){
    let caching_fn = xtd.get_in(impl,["metadata","caching_fn"]) || xtd.get_in(impl,["state","caching_fn"]);
    if("function" == (typeof caching_fn)){
      let caching_impl = caching_fn();
      if((null != caching_impl) && ((null != event["db/sync"]) || (null != event["db/remove"]))){
        let payload = Object.assign({},event);
        delete(payload["topic"]);
        impl_common.sync_process_payload(caching_impl,payload);
      }
    }
  };
}

// xt.db.system.impl-supabase-realtime/subscribe [229] 
export function subscribe(impl,conn_id,topics){
  let client = ensure_realtime(impl,conn_id);
  add_realtime_callback(impl,conn_id,"db-sync",create_sync_callback(impl));
  for(let topic of topics){
    let join_ref = "#/join/" + topic;
    let deferred = {"resolve":null,"reject":null};
    let init = new Promise(function (resolve,reject){
      (function (resolve,reject){
        deferred["resolve"] = resolve;
        deferred["reject"] = reject;
      })(resolve,reject);
    });
    xtd.set_in(client,["state","topics",topic],{
      "init":init,
      "join_ref":join_ref,
      "deferred":deferred,
      "ready":false
    });
  };
  return xtd.get_in(client,["state","init"]).then(function (_){
    let out = [];
    let chain = Promise.resolve().then(function (){
      return null;
    });
    for(let topic of topics){
      chain = chain.then(function (_){
        phoenix.send_frame(client,topic_join_payload(impl,topic));
        return xtd.get_in(client,["state","topics",topic,"init"]).then(function (ready){
          out.push(ready);
          return null;
        });
      });
    };
    return chain.then(function (_){
      return out;
    });
  });
}

// xt.db.system.impl-supabase-realtime/unsubscribe [271] 
export function unsubscribe(impl,conn_id,topics){
  return Promise.resolve().then(function (){
    let client = get_realtime(impl,conn_id);
    if(null != client){
      for(let topic of topics){
        let entry = xtd.get_in(client,["state","topics",topic]);
        if(null != entry){
          phoenix.send_frame(client,topic_leave_payload(impl,topic));
          delete(xtd.get_in(client,["state","topics"])[topic]);
        }
      };
    }
    return true;
  });
}