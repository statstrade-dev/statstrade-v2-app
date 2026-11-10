import * as page_proxy from '@statstrade/edge/lib/xt/substrate/page-proxy.jsx'

import * as client_base from '@statstrade/edge/lib/xt/db/node/client-base.jsx'

// xt.db.node.page-base/page-model-path [11] 
export function page_model_path(page,model_id){
  return [page["group_id"],model_id];
}

// xt.db.node.page-base/page-detach [18] 
export function page_detach(page,opts){
  if((null == page) || page["closed"]){
    return Promise.resolve().then(function (){
      return true;
    });
  }
  page["closed"] = true;
  let node = page["client"];
  let close_promise = Promise.resolve().then(function (){
    return null;
  });
  if(page["proxy_open"]){
    close_promise = page_proxy.group_close_proxy(node,page["space_id"],page["group_id"],opts || {}).catch(function (_){
      return null;
    });
  }
  let tasks = [];
  for(let page_args of page["attached"]){
    tasks.push(client_base.detach_model(node,page["primary_id"],page_args,opts || {}).catch(function (_){
      return null;
    }));
  };
  return close_promise.then(function (_){
    return Promise.all(tasks);
  }).then(function (_){
    return true;
  });
}

// xt.db.node.page-base/page-attach [60] 
export function page_attach(node,primary_id,space_id,page_spec,opts){
  let group_id = page_spec["group_id"];
  let models = page_spec["models"] || {};
  let page = {
    "client":node,
    "primary_id":primary_id,
    "space_id":space_id,
    "group_id":group_id,
    "models":models,
    "attached":[],
    "proxy_open":false,
    "closed":false
  };
  let invalid = null;
  for(let [model_id,entry] of Object.entries(models)){
    if((null == entry["rpc"]) && (null == entry["dataview"])){
      invalid = ("Unknown page model type: " + model_id);
    }
  };
  if(null != invalid){
    throw invalid;
  }
  let tasks = [];
  for(let [model_id,entry] of Object.entries(models)){
    let page_args = {"space_id":space_id,"group_id":group_id,"model_id":model_id};
    let task = null;
    page["attached"].push(page_args);
    if(null != entry["rpc"]){
      task = client_base.rpc_attach_model(node,primary_id,page_args,entry["rpc"],entry["model"],opts || {});
    }
    else if(null != entry["dataview"]){
      task = client_base.dataview_attach_model(
        node,
        primary_id,
        page_args,
        entry["dataview"],
        entry["model"],
        opts || {}
      );
    }
    else{
      task = Promise.resolve().then(function (){
        return null;
      });
    }
    tasks.push(task.catch(function (err){
      return {"error":err};
    }));
  };
  let open_promise = Promise.all(tasks).then(function (results){
    let error = null;
    for(let result of results){
      if((null == error) && (null != result["error"])){
        error = result["error"];
      }
    };
    if(null != error){
      throw error;
    }
    return page_proxy.group_open_proxy(node,space_id,group_id,opts || {}).then(function (_){
      page["proxy_open"] = true;
      return page;
    });
  });
  return open_promise.catch(function (err){
    let cleanup = page_detach(page,opts);
    return cleanup.then(function (_){
      throw err;
    });
  });
}

// xt.db.node.page-base/page-model-call [148] 
export function page_model_call(page,model_id,args,save_output,opts){
  return page_proxy.model_proxy_call(
    page["client"],
    page["space_id"],
    page["group_id"],
    model_id,
    args,
    save_output,
    opts || {}
  );
}