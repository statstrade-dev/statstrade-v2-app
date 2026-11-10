const fetch = require("@xtalk/net/http-fetch.js")

const str = require("@xtalk/lang/common-string.js")

const http = require("@xtalk/net/http-util.js")

function join_url(base,path){
  if((null == base) || (base == "")){
    throw "Neon service URL is not configured";
  }
  if(str.substring(base,base.length - 1,base.length) == "/"){
    base = str.substring(base,0,base.length - 1);
  }
  return base + path;
}

function response_data(response){
  let normalized = http.response_normalize(response);
  let {body,error,status} = normalized;
  if(error || (null == status) || (status < 200) || (status >= 300)){
    throw Object.assign(new Error("Neon request failed"),{
      "data":{
            "status":status,
            "code":((null != body) && ("object" == (typeof body)) && !Array.isArray(body)) ? ((null == body["code"]) ? "neon_request_failed" : body["code"]) : "neon_request_failed"
          }
    });
  }
  return body;
}

function bridge_input(client,path,data){
  let defaults = client["defaults"];
  let credential = defaults["bridge_token"];
  let headers = {
    "Content-Type":"application/json",
    "Accept":"application/json"
  };
  if(credential){
    headers["Authorization"] = ("Bearer " + credential);
  }
  return {
    "url":join_url(defaults["bridge_url"],path),
    "method":"POST",
    "headers":headers,
    "body":JSON.stringify(data || {})
  };
}

function bridge_request(client,path,data){
  return fetch.request_http(client,bridge_input(client,path,data)).then(response_data);
}

function backoff(ms,thunk){
  return new Promise(function (resolve,reject){
    setTimeout(function (){
      new Promise(function (inner_resolve){
        inner_resolve(thunk());
      }).then(function (value){
        resolve(value);
      }).catch(function (err){
        reject(err);
      });
    },ms);
  });
}

module.exports = {
  ["join_url"]:join_url,
  ["response_data"]:response_data,
  ["bridge_input"]:bridge_input,
  ["bridge_request"]:bridge_request,
  ["backoff"]:backoff
}