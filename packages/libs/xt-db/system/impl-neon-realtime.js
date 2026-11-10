const xtd = require("@xtalk/lang/common-data.js")

const addon = require("@xtalk/net/addon-neon.js")

const common = require("@xtalk/db/system/impl-common.js")

const fetch = require("@xtalk/net/http-fetch.js")

const http = require("@xtalk/net/http-util.js")

function currentp(impl,conn_id,entry){
  return entry["active"] && (entry["generation"] == xtd.get_in(impl,["state","connections",conn_id,"generation"]));
}

function cache_impl(impl){
  let f = xtd.get_in(impl,["metadata","caching_fn"]) || xtd.get_in(impl,["client","defaults","caching_fn"]);
  return ("function" == (typeof f)) ? f() : null;
}

function sequence_afterp(next,previous){
  return (null == previous) || (next.length > previous.length) || ((next.length == previous.length) && (0 > previous.localeCompare(next)));
}

function apply_events(impl,entry,batch){
  let caching = cache_impl(impl);
  if(null == caching){
    throw "Neon caching_fn is required for subscriptions";
  }
  for(let event of batch["events"]){
    let topic = event["topic"];
    let seq = event["seq"];
    if(sequence_afterp(seq,xtd.get_in(entry,["seen",topic]))){
      common.sync_process_payload(caching,event["payload"]);
      xtd.set_in(entry,["seen",topic],seq);
    }
  };
  entry["cursor"] = batch["cursor"];
  return true;
}

function poll_loop(impl,conn_id,entry){
  if(!currentp(impl,conn_id,entry)){
    return Promise.resolve().then(function (){
      return null;
    });
  }
  let client = impl["client"];
  let input = addon.bridge_input(
    client,
    "/events/poll",
    {"connection":entry["connection"],"cursor":entry["cursor"]}
  );
  return fetch.request_http(client,input).then(function (response){
    if(!currentp(impl,conn_id,entry)){
      return null;
    }
    let normalized = http.response_normalize(response);
    let {body,status} = normalized;
    if(status == 200){
      apply_events(impl,entry,body);
      entry["status"] = "live";
      entry["delay"] = 250;
      return new Promise(function (async_resolve__47614,async_reject__47615){
        setTimeout(function (){
          Promise.resolve((function (){
            return poll_loop(impl,conn_id,entry);
          })()).then(async_resolve__47614,async_reject__47615);
        },0);
      });
    }
    else if(status == 409){
      let resync = xtd.get_in(impl,["client","defaults","resync"]);
      entry["status"] = "resync_required";
      if(!("function" == (typeof resync))){
        entry["active"] = false;
        return null;
      }
      return addon.bridge_request(client,"/events/subscribe",{"topics":entry["topics"]}).then(function (subscription){
        entry["connection"] = subscription["connection"];
        entry["cursor"] = subscription["cursor"];
        if(!currentp(impl,conn_id,entry)){
          return null;
        }
        return resync(impl,entry["topics"]);
      }).then(function (_){
        entry["status"] = "connecting";
        if(currentp(impl,conn_id,entry)){
          return new Promise(function (async_resolve__47626,async_reject__47627){
            setTimeout(function (){
              Promise.resolve((function (){
                return poll_loop(impl,conn_id,entry);
              })()).then(async_resolve__47626,async_reject__47627);
            },0);
          });
        }
        return null;
      });
    }
    else if((status == 401) || (status == 403)){
      entry["active"] = false;
      let cache = cache_impl(impl);
      if(cache){
        common.clear_db(cache);
      }
      entry["status"] = (body["code"] || "error");
      return null;
    }
    else{
      throw "Neon poll failed";
    }
  }).catch(function (err){
    if(!currentp(impl,conn_id,entry)){
      return null;
    }
    if("resync_required" == entry["status"]){
      entry["active"] = false;
      entry["status"] = "resync_failed";
      return addon.bridge_request(
        client,
        "/events/unsubscribe",
        {"connection":entry["connection"]}
      ).catch(function (_){
        return null;
      });
    }
    entry["status"] = "retrying";
    let delay = entry["delay"];
    entry["delay"] = ((delay < 15000) ? (delay * 2) : 30000);
    return addon.backoff(delay,function (){
      return new Promise(function (async_resolve__47602,async_reject__47603){
        setTimeout(function (){
          Promise.resolve((function (){
            return poll_loop(impl,conn_id,entry);
          })()).then(async_resolve__47602,async_reject__47603);
        },0);
      });
    });
  });
}

function close_entry(impl,entry){
  entry["active"] = false;
  if(entry["connection"]){
    return addon.bridge_request(
      impl["client"],
      "/events/unsubscribe",
      {"connection":entry["connection"]}
    ).catch(function (_){
      return null;
    });
  }
  return Promise.resolve().then(function (){
    return null;
  });
}

function subscribe(impl,conn_id,topics){
  if(null == cache_impl(impl)){
    throw "Neon caching_fn is required for subscriptions";
  }
  let previous = xtd.get_in(impl,["state","connections",conn_id]);
  let wanted = {};
  if(previous){
    for(let topic of previous["topics"]){
      wanted[topic] = true;
    };
  }
  for(let topic of topics){
    wanted[topic] = true;
  };
  let merged = Object.keys(wanted);
  if(previous && previous["active"] && (merged.length == previous["topics"].length)){
    return Promise.resolve().then(function (){
      return true;
    });
  }
  let generation = 1 + (xtd.get_in(impl,["state","generation"]) || 0);
  xtd.set_in(impl,["state","generation"],generation);
  let cursor = previous ? previous["cursor"] : null;
  let entry = {
    "generation":generation,
    "topics":merged,
    "active":true,
    "status":"connecting",
    "seen":{},
    "delay":250,
    "cursor":cursor
  };
  xtd.set_in(impl,["state","connections",conn_id],entry);
  let client = impl["client"];
  let closing = previous ? close_entry(impl,previous) : Promise.resolve().then(function (){
    return null;
  });
  return closing.then(function (_){
    return addon.bridge_request(client,"/events/subscribe",{"topics":merged,"cursor":cursor});
  }).catch(function (err){
    let data = (err instanceof Error) ? err["data"] : null;
    let resync = xtd.get_in(impl,["client","defaults","resync"]);
    if(!((409 == xtd.get_in(data,["status"])) && ("function" == (typeof resync)))){
      throw err;
    }
    return addon.bridge_request(client,"/events/subscribe",{"topics":merged}).then(function (subscription){
      entry["connection"] = subscription["connection"];
      if(!currentp(impl,conn_id,entry)){
        return close_entry(impl,entry);
      }
      return Promise.resolve().then(function (){
        return resync(impl,merged);
      }).then(function (_){
        return subscription;
      });
    });
  }).then(function (result){
    entry["connection"] = result["connection"];
    entry["cursor"] = result["cursor"];
    if(!currentp(impl,conn_id,entry)){
      return close_entry(impl,entry);
    }
    entry["task"] = new Promise(function (resolve,reject){
      (function (resolve,reject){
        new Promise(function (async_resolve__47660,async_reject__47661){
          setTimeout(function (){
            Promise.resolve((function (){
              poll_loop(impl,conn_id,entry).then(resolve).catch(reject);
            })()).then(async_resolve__47660,async_reject__47661);
          },0);
        });
      })(resolve,reject);
    });
    return true;
  }).catch(function (err){
    entry["status"] = "error";
    close_entry(impl,entry);
    throw err;
  });
}

function unsubscribe(impl,conn_id,topics){
  let entry = xtd.get_in(impl,["state","connections",conn_id]);
  if(null == entry){
    return Promise.resolve().then(function (){
      return true;
    });
  }
  let removed = {};
  for(let topic of topics){
    removed[topic] = true;
  };
  let remaining = [];
  for(let topic of entry["topics"]){
    if(!removed[topic]){
      remaining.push(topic);
    }
  };
  if(remaining.length > 0){
    entry["topics"] = remaining;
    return subscribe(impl,conn_id,remaining);
  }
  delete(xtd.get_in(impl,["state","connections"])[conn_id]);
  return close_entry(impl,entry);
}

function stop(impl){
  let tasks = [];
  for(let entry of Object.values(xtd.get_in(impl,["state","connections"]))){
    tasks.push(close_entry(impl,entry));
  };
  xtd.set_in(impl,["state","connections"],{});
  return Promise.all(tasks);
}

module.exports = {
  ["currentp"]:currentp,
  ["cache_impl"]:cache_impl,
  ["sequence_afterp"]:sequence_afterp,
  ["apply_events"]:apply_events,
  ["poll_loop"]:poll_loop,
  ["close_entry"]:close_entry,
  ["subscribe"]:subscribe,
  ["unsubscribe"]:unsubscribe,
  ["stop"]:stop
}