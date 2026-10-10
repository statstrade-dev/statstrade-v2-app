const page_proxy = require("@xtalk/substrate/page-proxy.js")

const client_base = require("@xtalk/db/node/client-base.js")

const client_supabase = require("@xtalk/db/node/client-supabase.js")

function page_model_path(page,model_id){
  return [page["group_id"],model_id];
}

function page_view_path(page,view_id){
  return [page["group_id"],"views/" + view_id];
}

function page_action_path(page,action_id){
  return [page["group_id"],"actions/" + action_id];
}

function page_detach(page,opts){
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

function page_refresh_views(node,space_id,group_id,views,opts){
  let tasks = [];
  for(let [view_id,entry] of Object.entries(views || {})){
    let model = entry["model"];
    let defaults = model["defaults"] || {};
    tasks.push(page_proxy.model_proxy_call(
      node,
      space_id,
      group_id,
      "views/" + view_id,
      defaults["args"] || [],
      true,
      opts || {}
    ));
  };
  return Promise.all(tasks);
}

function page_attach(node,primary_id,space_id,page_spec,opts){
  let group_id = page_spec["group_id"];
  let models = page_spec["models"] || {};
  let views = page_spec["views"] || {};
  let actions = page_spec["actions"] || {};
  let declarations = [];
  for(let [model_id,entry] of Object.entries(models)){
    declarations.push({"model_id":model_id,"entry":entry});
  };
  for(let [view_id,entry] of Object.entries(views)){
    declarations.push({"model_id":"views/" + view_id,"entry":entry});
  };
  for(let [action_id,entry] of Object.entries(actions)){
    declarations.push({"model_id":"actions/" + action_id,"entry":entry});
  };
  let page = {
    "attached":[],
    "group_id":group_id,
    "space_id":space_id,
    "primary_id":primary_id,
    "closed":false,
    "views":views,
    "models":models,
    "client":node,
    "proxy_open":false,
    "actions":actions
  };
  let invalid = null;
  for(let declaration of declarations){
    let model_id = declaration["model_id"];
    let entry = declaration["entry"];
    if((null == entry["rpc"]) && (null == entry["dataview"]) && (null == entry["supabase"])){
      invalid = ("Unknown page model type: " + model_id);
    }
  };
  if(null != invalid){
    throw invalid;
  }
  let tasks = [];
  for(let declaration of declarations){
    let model_id = declaration["model_id"];
    let entry = declaration["entry"];
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
    else if(null != entry["supabase"]){
      task = client_supabase.attach_model(
        node,
        primary_id,
        page_args,
        entry["supabase"],
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
      return page_refresh_views(node,space_id,group_id,views,opts).then(function (_){
        return page;
      });
    });
  });
  return open_promise.catch(function (err){
    let cleanup = page_detach(page,opts);
    cleanup.then(function (_){
      throw err;
    });
  });
}

function page_model_call(page,model_id,args,save_output,opts){
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

function page_view_call(page,view_id,args,save_output,opts){
  return page_model_call(page,"views/" + view_id,args,save_output,opts || {});
}

function page_action_call(page,action_id,args,save_output,opts){
  return page_model_call(page,"actions/" + action_id,args,save_output,opts || {});
}

module.exports = {
  ["page_model_path"]:page_model_path,
  ["page_view_path"]:page_view_path,
  ["page_action_path"]:page_action_path,
  ["page_detach"]:page_detach,
  ["page_refresh_views"]:page_refresh_views,
  ["page_attach"]:page_attach,
  ["page_model_call"]:page_model_call,
  ["page_view_call"]:page_view_call,
  ["page_action_call"]:page_action_call
}