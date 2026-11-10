import React from 'react'

import * as worker from '@statstrade/edge/substrate/worker.jsx'

import * as ext_page from '@statstrade/edge/lib/js/react/ext-page.js'

import * as runtime from '@statstrade/edge/substrate/group-runtime.jsx'

// statsui.edge.substrate.group-page/errorMessage [11] 
export function errorMessage(error){
  if((typeof error) == "string"){
    return error;
  }
  let detail = JSON.stringify((error && error["data"]) || error || {});
  if(detail.includes("global-revision-conflict")){
    return "This section changed. Reload the latest revision before saving.";
  }
  else if(detail.includes("reauth-required")){
    return "Please sign in again with a recent MFA verification, then retry.";
  }
  else if(detail.includes("permission-denied")){
    return "You do not have permission to perform this action.";
  }
  else{
    return (error && error["message"]) || "Unable to complete the request.";
  }
}

// statsui.edge.substrate.group-page/createPageController [22] 
export function createPageController(context,definition,notify){
  let state = {
    "handle":null,
    "status":"loading",
    "busy":false,
    "error":null,
    "notice":null,
    "needs-refresh":false
  };
  let control = {"active":true,"state":state,"setup":null,"work":null};
  let emit = function (){
    if(control["active"]){
      notify(Object.assign({},state));
    }
  };
  control["start"] = async function (){
    if(!control["active"] || state["busy"] || state["handle"] || (control["setup"] && (state["status"] == "loading"))){
      return null;
    }
    if(!context["actor-id"] && !(definition["area"] == "public")){
      state["status"] = "error";
      state["error"] = "Sign in again to load this page.";
      emit();
      return null;
    }
    state["status"] = "loading";
    state["error"] = null;
    emit();
    let task = async function (){
      try{
        let handle = await runtime.openGroup(context,definition,{"instance-id":crypto.randomUUID()});
        if(control["active"]){
          state["handle"] = handle;
          state["status"] = "ready";
          emit();
        }
        else{
          await runtime.closeGroup(handle);
        }
      }
      catch(error){
        state["error"] = errorMessage(error);
        state["status"] = "error";
        emit();
      }
    };
    control["setup"] = task();
    return await control["setup"];
  };
  control["refresh"] = async function (model_id){
    if(!control["active"] || state["busy"]){
      return false;
    }
    state["busy"] = true;
    state["error"] = null;
    emit();
    let task = async function (){
      try{
        if(model_id){
          await runtime.loadModel(state["handle"],model_id);
        }
        else{
          await runtime.refreshGroup(state["handle"]);
        }
        state["notice"] = null;
        state["needs-refresh"] = false;
        return true;
      }
      catch(error){
        state["error"] = errorMessage(error);
        return false;
      }
      finally{
        state["busy"] = false;
        emit();
      }
    };
    control["work"] = task();
    return await control["work"];
  };
  control["save"] = async function (action,args,model_id,receive){
    if(!control["active"] || state["busy"] || state["needs-refresh"]){
      return {"saved":false,"refreshed":false};
    }
    state["busy"] = true;
    state["error"] = null;
    state["notice"] = null;
    emit();
    let task = async function (){
      try{
        let result = await runtime.callAction(state["handle"],action,args);
        state["notice"] = "Saved.";
        state["needs-refresh"] = true;
        try{
          if(receive && control["active"]){
            receive(result);
          }
          await runtime.loadModel(state["handle"],model_id);
          state["needs-refresh"] = false;
          return {"saved":true,"refreshed":true};
        }
        catch(error){
          state["notice"] = "Saved; refresh failed. Refresh the page data before making another change.";
          state["error"] = errorMessage(error);
          return {"saved":true,"refreshed":false};
        }
      }
      catch(error){
        state["error"] = errorMessage(error);
        return {
          "saved":false,
          "refreshed":false,
          "conflict":JSON.stringify((error && error["data"]) || error || {}).includes("global-revision-conflict")
        };
      }
      finally{
        state["busy"] = false;
        emit();
      }
    };
    control["work"] = task();
    return await control["work"];
  };
  control["close"] = async function (){
    control["active"] = false;
    await control["setup"];
    await control["work"];
    await runtime.closeGroup(state["handle"]);
  };
  return control;
}

// statsui.edge.substrate.group-page/useGroupPage [100] 
export function useGroupPage(definition,page_id,actor_id,enabled = true){
  let provider = worker.useSubstrateContext();
  let resource = provider["resource"];
  let node = resource["client"];
  let primary_id = resource["config"]["primary"]["id"];
  let space_id = worker.pageSpaceId(resource["scope-id"],page_id);
  let [state,set_state] = React.useState(null);
  let owner = React.useRef(null);
  React.useEffect(function (){
    let control = createPageController({
      "node":node,
      "primary-id":primary_id,
      "space-id":space_id,
      "actor-id":actor_id,
      "opts":{}
    },definition,function (value){
      set_state({
        "node":node,
        "actor":actor_id,
        "page":page_id,
        "primary":primary_id,
        "space":space_id,
        "definition":definition,
        "value":value
      });
    });
    owner["current"] = control;
    if(enabled){
      control.start();
    }
    return function (){
      control.close();
    };
  },[node,primary_id,space_id,actor_id,definition,enabled]);
  let current = state && (state["node"] == node) && (state["actor"] == actor_id) && (state["page"] == page_id) && (state["primary"] == primary_id) && (state["space"] == space_id) && (state["definition"] == definition);
  return Object.assign(
    {},
    current ? state["value"] : {"status":"loading"},
    {"controller":owner["current"]}
  );
}

// statsui.edge.substrate.group-page/useGroupModel [124] 
export function useGroupModel(handle,model_id){
  let context = handle["context"];
  let output = ext_page.listenModelOutput(
    context["node"],
    context["space-id"],
    runtime.modelPath(handle,model_id),
    ["output"],
    null
  );
  return output["current"] || [];
}