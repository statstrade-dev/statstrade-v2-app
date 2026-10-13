import * as protocol from '@statstrade/edge/lib/xt/lang/common-protocol.jsx'

import * as http_fetch from '@statstrade/edge/lib/xt/net/http-fetch.jsx'

// js.net.http-fetch/HttpFetchClient [] 
export function HttpFetchClient(defaults,middleware){
  globalThis["xt_lang_common_protocol$$IMPLEMENTATIONS"]["js.net.http_fetch/HttpFetchClient"] = true;
  protocol.register_protocol_impl(
    http_fetch.IHttpClient["on"],
    "js.net.http_fetch/HttpFetchClient",
    {"request_http":request_http}
  );
  return {
    "::":"js.net.http_fetch/HttpFetchClient",
    "::/protocols":[http_fetch.IHttpClient["on"]],
    "::/protocol-impls":{
        [http_fetch.IHttpClient["on"]]:{"request_http":request_http}
      },
    "defaults":defaults,
    "middleware":middleware
  };
}

// js.net.http-fetch/request-http-raw [11] 
export function request_http_raw(client,input){
  let {body,headers,method,url} = input;
  return fetch(url,{"method":method,"headers":headers,"body":body}).then(function (res){
    return res.text().then(function (text){
      return {"status":res["status"],"headers":res["headers"],"body":text};
    });
  });
}

// js.net.http-fetch/request-http [28] 
export function request_http(client,input){
  let handler = http_fetch.prepare_middleware(client,request_http_raw);
  return handler(client,input);
}

// js.net.http-fetch/create [40] 
export function create(defaults,middleware){
  return HttpFetchClient(defaults,middleware || [http_fetch.wrap_prepare_input]);
}