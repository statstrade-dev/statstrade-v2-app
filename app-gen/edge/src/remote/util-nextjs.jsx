import * as k from '@statstrade/edge/lib/xt/lang/base-lib'

// sznui.lib.edge.remote.util-nextjs/callApi [8] 
export async function callApi(path,method,data,options = {}){
  let {headers} = options;
  let fetch_opts = {
    "method":method,
    "headers":k.obj_assign({"Content-Type":"application/json"},headers)
  };
  if((method == "GET") || (method == "DELETE")){
    if(data){
      let qs = new URLSearchParams(data);
      path = (path + "?" + qs.toString());
    }
  }
  else{
    fetch_opts.body = JSON.stringify(data);
  }
  let res = await fetch(path,fetch_opts);
  if(!res.ok){
    throw new Error("API Error: " + res.statusText);
  }
  return await res.json();
}