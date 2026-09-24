const xtd = require("@xtalk/lang/common-data.js")

function fetch_json(url){
  let fetch_fn = globalThis["fetch"];
  if(null == fetch_fn){
    throw "SharedWorker site-map loading requires fetch";
  }
  return fetch_fn(url).then(function (response){
    if((null != response["ok"]) && !response["ok"]){
      throw "Unable to load SharedWorker site map: " + url;
    }
    return response.text().then(function (body){
      return JSON.parse(body);
    });
  });
}

function load_remote(url){
  return fetch_json(url).then(function (manifest){
    let schema_url = manifest["schema_url"] || manifest["schema"];
    let lookup_url = manifest["lookup_url"] || manifest["lookup"];
    let rpc_url = manifest["rpc_url"] || manifest["rpc"];
    return Promise.all([
      fetch_json(schema_url),
      fetch_json(lookup_url),
      fetch_json(rpc_url)
    ]).then(function (values){
      let [schema,lookup,rpc] = values;
      return {"schema":schema,"lookup":lookup,"rpc":rpc,"manifest":manifest};
    });
  });
}

function load_site_map(node,config,schema,lookup){
  let meta = node["meta"];
  let url = config["site_map_url"] || config["site-map-url"];
  let cached = xtd.get_in(meta,["xt.db/site-map"]);
  if(null != cached){
    if((null != url) && (url != cached["url"])){
      throw "SharedWorker already loaded site map: " + cached["url"];
    }
    return cached["promise"] || Promise.resolve().then(function (){
      return cached["data"];
    });
  }
  if(null == url){
    let fallback = {"schema":schema,"lookup":lookup,"rpc":{}};
    meta["xt.db/site-map"] = {"url":null,"data":fallback};
    return Promise.resolve().then(function (){
      return fallback;
    });
  }
  let pending = load_remote(url);
  let guarded = pending.then(function (data){
    meta["xt.db/site-map"] = {"url":url,"data":data};
    return data;
  }).catch(function (err){
    delete(meta["xt.db/site-map"]);
    throw err;
  });
  meta["xt.db/site-map"] = {"url":url,"promise":guarded};
  return guarded;
}

module.exports = {
  ["fetch_json"]:fetch_json,
  ["load_remote"]:load_remote,
  ["load_site_map"]:load_site_map
}