// xt.net.http-util/request-body [9] 
export function request_body(body){
  if(null == body){
    return null;
  }
  else if("string" == (typeof body)){
    return body;
  }
  else{
    return JSON.stringify(body);
  }
}

// xt.net.http-util/decode-body [22] 
export function decode_body(body){
  if(!("string" == (typeof body))){
    return body;
  }
  else if("" == body){
    return null;
  }
  else{
    try{
      return JSON.parse(body);
    }
    catch(err){
      return body;
    }
  }
}

// xt.net.http-util/request-prepare [38] 
export function request_prepare(input){
  let source = input || {};
  let {body,headers,method} = source;
  return {"method":method || "GET","headers":headers,"body":body || ""};
}

// xt.net.http-util/response-normalize [50] 
export function response_normalize(response){
  if(null == response){
    return {"status":null,"headers":{},"body":null,"error":null};
  }
  else if(((null != response) && ("object" == (typeof response)) && !Array.isArray(response)) && (null != response["body"])){
    let out = Object.assign({},response);
    out["headers"] = Object.assign({},out["headers"]);
    out["body"] = decode_body(out["body"]);
    return out;
  }
  else if((null != response) && ("object" == (typeof response)) && !Array.isArray(response)){
    return response;
  }
  else{
    return {
      "status":null,
      "headers":{},
      "body":decode_body(response),
      "error":null
    };
  }
}

// xt.net.http-util/encode-query-params [81] 
export function encode_query_params(params){
  let out = [];
  for(let [k,v] of Object.entries(params || {})){
    if(null != v){
      out.push(k + "=" + String(v));
    }
  };
  return out.join("&");
}

// xt.net.http-util/get-body-data [91] 
export function get_body_data(response){
  let out = response["body"];
  if(((null != out) && ("object" == (typeof out)) && !Array.isArray(out)) && (null != out["data"])){
    return out["data"];
  }
  else{
    return out;
  }
}