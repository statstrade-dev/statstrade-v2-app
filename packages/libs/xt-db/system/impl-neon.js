const session = require("@xtalk/db/system/impl-neon-session.js")

const xtd = require("@xtalk/lang/common-data.js")

const proto = require("@xtalk/lang/common-protocol.js")

const addon = require("@xtalk/net/addon-neon.js")

const realtime = require("@xtalk/db/system/impl-neon-realtime.js")

const common = require("@xtalk/db/system/impl-common.js")

const graph = require("@xtalk/db/text/pgrest-graph.js")

const fetch = require("@xtalk/net/http-fetch.js")

const str = require("@xtalk/lang/common-string.js")

function ImplNeon(client,schema,lookup,state,listeners,opts,metadata){
  globalThis["xt_lang_common_protocol$$IMPLEMENTATIONS"]["xt.db.system.impl_neon/ImplNeon"] = true;
  proto.register_protocol_impl(
    common.ISourceRemote["on"],
    "xt.db.system.impl_neon/ImplNeon",
    {"pull_async":pull_async,"rpc_call_async":rpc_call_async}
  );
  proto.register_protocol_impl(common.ISourceRealtime["on"],"xt.db.system.impl_neon/ImplNeon",{
    "subscribe_db":realtime.subscribe,
    "unsubscribe_db":realtime.unsubscribe
  });
  proto.register_protocol_impl(
    common.ISourceLifecycle["on"],
    "xt.db.system.impl_neon/ImplNeon",
    {"stop_db":stop_db}
  );
  proto.register_protocol_impl(common.ISourceListener["on"],"xt.db.system.impl_neon/ImplNeon",{
    "add_db_listener":common.add_db_listener_default,
    "remove_db_listener":common.remove_db_listener_default,
    "get_db_listener":common.get_db_listener_default
  });
  return {
    "::/protocol-impls":{
        [common.ISourceRemote["on"]]:{"pull_async":pull_async,"rpc_call_async":rpc_call_async},
        [common.ISourceRealtime["on"]]:{
          "subscribe_db":realtime.subscribe,
          "unsubscribe_db":realtime.unsubscribe
        },
        [common.ISourceLifecycle["on"]]:{"stop_db":stop_db},
        [common.ISourceListener["on"]]:{
          "add_db_listener":common.add_db_listener_default,
          "remove_db_listener":common.remove_db_listener_default,
          "get_db_listener":common.get_db_listener_default
        }
      },
    "schema":schema,
    "lookup":lookup,
    "opts":opts,
    "::":"xt.db.system.impl_neon/ImplNeon",
    "metadata":metadata,
    "::/protocols":[
        common.ISourceRemote["on"],
        common.ISourceRealtime["on"],
        common.ISourceLifecycle["on"],
        common.ISourceListener["on"]
      ],
    "state":state,
    "client":client,
    "listeners":listeners
  };
}

function response_data(response){
  return addon.response_data(response);
}

function request_input(impl,input){
  let defaults = xtd.get_in(impl,["client","defaults"]);
  let path = input["path"];
  if(str.substring(path,0,9) == "/rest/v1/"){
    path = str.substring(path,8,path.length);
  }
  let headers = Object.assign(Object.assign({
    "Accept":"application/json",
    "Content-Type":"application/json"
  },defaults["headers"]),input["headers"]);
  let token = defaults["token"];
  if(token){
    headers["Authorization"] = ("Bearer " + token);
  }
  return Object.assign(Object.assign({},input),{
    "headers":headers,
    "url":addon.join_url(defaults["data_url"],path)
  });
}

function request(impl,input){
  let refresh = xtd.get_in(impl,["state","session"]) ? session.refresh_session(impl) : Promise.resolve().then(function (){
    return null;
  });
  return refresh.then(function (_){
    return fetch.request_http(impl["client"],request_input(impl,input));
  }).then(response_data);
}

function cmd_pull_async(impl,tree){
  let {lookup,opts,schema} = impl;
  let query = graph.select(schema,tree,opts);
  let schema_name = lookup[tree[0]]["schema"];
  let headers = Object.assign({},query["headers"]);
  if(schema_name){
    headers["Accept-Profile"] = schema_name;
  }
  return {"path":query["url"],"method":"GET","headers":headers};
}

function pull_async(impl,tree){
  return request(impl,cmd_pull_async(impl,tree));
}

function cmd_rpc_call_async(impl,rpc_spec,args){
  let body = {};
  for(let i = 0; i < (rpc_spec["input"] || []).length; ++i){
    let input = (rpc_spec["input"] || [])[i];
    let key = input["symbol"] || input["name"];
    if(key){
      body[key] = args[i];
    }
  };
  let headers = {};
  let schema_name = rpc_spec["schema"];
  if(schema_name){
    headers["Content-Profile"] = schema_name;
    headers["Accept-Profile"] = schema_name;
  }
  return {
    "path":"/rpc/" + str.replace(rpc_spec["id"],"-","_"),
    "method":"POST",
    "headers":headers,
    "body":JSON.stringify(body)
  };
}

function rpc_call_async(impl,rpc_spec,args){
  return request(impl,cmd_rpc_call_async(impl,rpc_spec,args));
}

function stop_db(impl){
  return session.reset_session(impl);
}

function impl_neon(client,schema,lookup){
  return ImplNeon(client,schema,lookup,{"connections":{}},{},{},{});
}

module.exports = {
  ["response_data"]:response_data,
  ["request_input"]:request_input,
  ["request"]:request,
  ["cmd_pull_async"]:cmd_pull_async,
  ["pull_async"]:pull_async,
  ["cmd_rpc_call_async"]:cmd_rpc_call_async,
  ["rpc_call_async"]:rpc_call_async,
  ["stop_db"]:stop_db,
  ["ImplNeon"]:ImplNeon,
  ["impl_neon"]:impl_neon
}