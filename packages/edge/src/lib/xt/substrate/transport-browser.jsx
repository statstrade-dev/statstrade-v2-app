import * as main from '@statstrade/edge/lib/xt/substrate.jsx'

// xt.substrate.transport-browser/ready-event? [71] 
export function ready_eventp(event,opts){
  let {ready_pred} = opts;
  if("function" == (typeof ready_pred)){
    return ready_pred(event);
  }
  else{
    let ready_signal = (null != opts["ready_signal"]) ? opts["ready_signal"] : "ready";
    if(null == ready_signal){
      return false;
    }
    else{
      return ((null != event) && ("object" == (typeof event)) && !Array.isArray(event)) && (event["signal"] == ready_signal);
    }
  }
}

// xt.substrate.transport-browser/await-ready [89] 
export function await_ready(state){
  let {ready,timeout_ms,wait_count} = state;
  if(((null != ready) && ("object" == (typeof ready)) && !Array.isArray(ready)) && (ready["signal"] == "error")){
    throw ready["error"] || new Error("Worker script failed to start.");
  }
  if(null != ready){
    return Promise.resolve().then(function (){
      return ready;
    });
  }
  else{
    if((wait_count * 10) >= timeout_ms){
      throw new Error("Worker connection timed out waiting for its ready signal.");
    }
    else{
      state["wait_count"] = (wait_count + 1);
      return new Promise(function (resolve,reject){
        setTimeout(function (){
          new Promise(function (inner_resolve){
            inner_resolve((function (){
              return null;
            })());
          }).then(function (value){
            resolve(value);
          }).catch(function (err){
            reject(err);
          });
        },10);
      }).then(function (_){
        return await_ready(state);
      });
    }
  }
}

// xt.substrate.transport-browser/connection-record [114] 
export function connection_record(node,transport_id,ready){
  let transport = main.transport_get(node,transport_id);
  return {
    "node":node,
    "transport_id":transport_id,
    "transport":transport,
    "target":(null == transport) ? null : transport["listener"],
    "ready":ready,
    "disconnect_fn":function (){
        return main.detach_transport(node,transport_id);
      }
  };
}

// xt.substrate.transport-browser/wrap-ready-endpoint [131] 
export function wrap_ready_endpoint(endpoint,state,opts){
  let wait_ready = (null != opts["wait_ready"]) ? opts["wait_ready"] : true;
  if(!wait_ready){
    return endpoint;
  }
  else{
    let {start_fn} = endpoint;
    if(null == start_fn){
      return endpoint;
    }
    else{
      return Object.assign(Object.assign({},endpoint),{
        "start_fn":function (listener){
                return start_fn(function (event,ctx){
                  if((((null != event) && ("object" == (typeof event)) && !Array.isArray(event)) && (event["signal"] == "error")) || ready_eventp(event,opts)){
                    state["ready"] = event;
                    return event;
                  }
                  else{
                    return listener(event,ctx);
                  }
                });
              }
      });
    }
  }
}

// xt.substrate.transport-browser/source-endpoint [160] 
export function source_endpoint(source,kind){
  let current_target = null;
  let send_fn = function (frame){
    if(null == current_target){
      throw "source endpoint not started";
    }
    return current_target.postMessage(frame);
  };
  let start_fn = function (listener){
    current_target = source["create_fn"](listener);
    return current_target;
  };
  let stop_fn = function (_){
    if((null != current_target) && ("function" == (typeof current_target["close"]))){
      current_target.close();
    }
    if((null != current_target) && ("function" == (typeof current_target["terminate"]))){
      current_target.terminate();
    }
    current_target = null;
    return true;
  };
  return {
    "meta":{"kind":kind},
    "send_fn":send_fn,
    "start_fn":start_fn,
    "stop_fn":stop_fn
  };
}

// xt.substrate.transport-browser/connect-endpoint [192] 
export function connect_endpoint(node,transport_id,endpoint,opts){
  let config = opts || {};
  let state = {
    "ready":null,
    "wait_count":0,
    "timeout_ms":config["ready_timeout"] || 15000
  };
  let wait_ready = (null != config["wait_ready"]) ? config["wait_ready"] : true;
  return main.attach_transport(node,transport_id,wrap_ready_endpoint(endpoint,state,config)).then(function (_){
    if(wait_ready){
      return await_ready(state).then(function (ready){
        return connection_record(node,transport_id,ready);
      });
    }
    else{
      return connection_record(node,transport_id,null);
    }
  }).catch(function (error){
    return main.detach_transport(node,transport_id).catch(function (_){
      return null;
    }).then(function (_){
      throw error;
    });
  });
}

// xt.substrate.transport-browser/event-data [230] 
export function event_data(event){
  return (((null != event) && ("object" == (typeof event)) && !Array.isArray(event)) && (null != event["data"])) ? event["data"] : event;
}

// xt.substrate.transport-browser/messageport-endpoint [239] 
export function messageport_endpoint(port){
  let current_callback = null;
  let send_fn = function (frame){
    return port.postMessage(frame);
  };
  let start_fn = function (listener){
    current_callback = (function (event){
      return listener(event_data(event),null);
    });
    if("function" == (typeof port["start"])){
      port.start();
    }
    port.addEventListener("message",current_callback,false);
    return port;
  };
  let stop_fn = function (_){
    if((null != current_callback) && ("function" == (typeof port["removeEventListener"]))){
      port.removeEventListener("message",current_callback,false);
    }
    if("function" == (typeof port["close"])){
      port.close();
    }
    current_callback = null;
    return true;
  };
  return {
    "meta":{"kind":"messageport"},
    "send_fn":send_fn,
    "start_fn":start_fn,
    "stop_fn":stop_fn
  };
}

// xt.substrate.transport-browser/sharedworker-endpoint [277] 
export function sharedworker_endpoint(shared_or_port){
  let port = (null != shared_or_port["port"]) ? shared_or_port["port"] : shared_or_port;
  return messageport_endpoint(port);
}

// xt.substrate.transport-browser/worker-endpoint [286] 
export function worker_endpoint(worker_source){
  let current_worker = null;
  let current_callback = null;
  let send_fn = function (frame){
    let worker = current_worker || ((null != worker_source["create_fn"]) ? null : worker_source);
    if(null == worker){
      throw "worker endpoint not started";
    }
    let post_request = worker["postRequest"];
    if("function" == (typeof post_request)){
      return post_request(frame);
    }
    else{
      return worker.postMessage(frame);
    }
  };
  let start_fn = function (listener){
    if(null != worker_source["create_fn"]){
      current_worker = worker_source["create_fn"](listener);
      return current_worker;
    }
    else{
      current_worker = worker_source;
      current_callback = (function (event){
        return listener(event_data(event),null);
      });
      current_worker.addEventListener("message",current_callback,false);
      return current_worker;
    }
  };
  let stop_fn = function (_){
    if((null != current_worker) && (null != current_callback) && ("function" == (typeof current_worker["removeEventListener"]))){
      current_worker.removeEventListener("message",current_callback,false);
    }
    if((null != current_worker) && ("function" == (typeof current_worker["terminate"]))){
      current_worker.terminate();
    }
    current_worker = null;
    current_callback = null;
    return true;
  };
  return {
    "meta":{"kind":"webworker"},
    "send_fn":send_fn,
    "start_fn":start_fn,
    "stop_fn":stop_fn
  };
}

// xt.substrate.transport-browser/self-endpoint [341] 
export function self_endpoint(worker_self){
  let current_callback = null;
  let send_fn = function (frame){
    worker_self.postMessage(frame);
    return Promise.resolve().then(function (){
      return true;
    });
  };
  let start_fn = function (listener){
    current_callback = (function (event){
      return listener(event_data(event),null);
    });
    worker_self.addEventListener("message",current_callback,false);
    return worker_self;
  };
  let stop_fn = function (_){
    if((null != current_callback) && ("function" == (typeof worker_self["removeEventListener"]))){
      worker_self.removeEventListener("message",current_callback,false);
    }
    current_callback = null;
    return true;
  };
  return {
    "meta":{"kind":"webworker.self"},
    "send_fn":send_fn,
    "start_fn":start_fn,
    "stop_fn":stop_fn
  };
}

// xt.substrate.transport-browser/connect-port [376] 
export function connect_port(node,opts){
  let config = opts || {};
  let port = config["port"] || config["source"];
  let transport_id = config["transport_id"] || "port";
  if(null == port){
    throw "connect-port requires `port` or `source`";
  }
  return connect_endpoint(node,transport_id,messageport_endpoint(port),config);
}

// xt.substrate.transport-browser/connect-sharedworker [394] 
export function connect_sharedworker(node,opts){
  let config = opts || {};
  let source = config["source"] || config["sharedworker"];
  let transport_id = config["transport_id"] || "worker";
  if(null == source){
    throw "connect-sharedworker requires `source` or `sharedworker`";
  }
  return connect_endpoint(
    node,
    transport_id,
    (null != source["create_fn"]) ? source_endpoint(source,"sharedworker") : sharedworker_endpoint(source),
    config
  );
}

// xt.substrate.transport-browser/connect-worker [414] 
export function connect_worker(node,opts){
  let config = opts || {};
  let source = config["source"] || config["worker"];
  let transport_id = config["transport_id"] || "worker";
  if(null == source){
    throw "connect-worker requires `source` or `worker`";
  }
  return connect_endpoint(
    node,
    transport_id,
    (null != source["create_fn"]) ? source_endpoint(source,"webworker") : worker_endpoint(source),
    config
  );
}

// xt.substrate.transport-browser/boot-self [434] 
export function boot_self(node,opts){
  let config = opts || {};
  let {target} = config;
  let transport_id = config["transport_id"] || "host";
  let {ready} = config;
  if(null == target){
    throw "boot-self requires `target`";
  }
  return main.attach_transport(node,transport_id,self_endpoint(target)).then(function (_){
    if(null == ready){
      return connection_record(node,transport_id,null);
    }
    else{
      return main.transport_get(node,transport_id)["send_fn"](ready).then(function (_){
        return connection_record(node,transport_id,ready);
      });
    }
  });
}

// xt.substrate.transport-browser/disconnect [461] 
export function disconnect(connection){
  return main.detach_transport(connection["node"],connection["transport_id"]);
}

// xt.substrate.transport-browser/blob-url [470] 
export function blob_url(script){
  let blob = new Blob([script],{"type":"text/javascript"});
  return globalThis["URL"].createObjectURL(blob);
}

// xt.substrate.transport-browser/webworker-source [478] 
export function webworker_source(script,opts){
  let worker_opts = opts || {};
  return {
    "create_fn":function (listener){
        let url = blob_url(script);
        try{
          let worker = new Worker(url,worker_opts);
          worker.addEventListener("message",function (e){
            return listener(e["data"]);
          },false);
          globalThis["URL"].revokeObjectURL(url);
          return worker;
        }
        catch(err){
          globalThis["URL"].revokeObjectURL(url);
          throw err;
        }
      }
  };
}

// xt.substrate.transport-browser/sharedworker-source [502] 
export function sharedworker_source(script,opts){
  let worker_opts = opts || {};
  return {
    "create_fn":function (listener){
        let url = blob_url(script);
        try{
          let shared = new SharedWorker(url,worker_opts);
          let {port} = shared;
          port.start();
          port.addEventListener("message",function (e){
            return listener(e["data"]);
          },false);
          globalThis["URL"].revokeObjectURL(url);
          return port;
        }
        catch(err){
          globalThis["URL"].revokeObjectURL(url);
          throw err;
        }
      }
  };
}

// xt.substrate.transport-browser/sharedworker-url-source [528] 
export function sharedworker_url_source(url,opts){
  let worker_opts = opts || {};
  return {
    "create_fn":function (listener){
        let shared = new SharedWorker(url,worker_opts);
        let {port} = shared;
        port["sharedworker"] = shared;
        shared.addEventListener("error",function (event){
          listener({
            "signal":"error",
            "error":new Error(
                    event["message"] || "SharedWorker script failed to load or initialize."
                  )
          });
          return null;
        },false);
        port.addEventListener("message",function (e){
          return listener(e["data"]);
        },false);
        port.addEventListener("messageerror",function (_){
          listener({
            "signal":"error",
            "error":new Error("SharedWorker message could not be read.")
          });
          return null;
        },false);
        port.start();
        return port;
      }
  };
}

// xt.substrate.transport-browser/node-worker-source [568] 
export function node_worker_source(script,opts){
  let config = opts || {};
  let eval_flag = config["eval"];
  let eval_mode = (null == eval_flag) ? true : eval_flag;
  let load = eval("require");
  let Worker_value = load("worker_threads");
  let {Worker} = Worker_value;
  return {
    "create_fn":function (listener){
        let worker = new Worker(script,eval_mode ? {"eval":true,"type":"module"} : {});
        worker.on("message",function (data){
          return listener(data);
        });
        return worker;
      }
  };
}