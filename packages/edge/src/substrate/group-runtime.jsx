import * as db from '@statstrade/edge/lib/xt/db/node/client-base.jsx'

import * as common from '@statstrade/edge/substrate/group-spec.jsx'

import * as page_core from '@statstrade/edge/lib/xt/substrate/page-core.jsx'

import * as page_base from '@statstrade/edge/lib/xt/db/node/page-base.jsx'

// statsui.edge.substrate.group-runtime/createRouteModel [11] 
export function createRouteModel(route){
  let value = JSON.parse(JSON.stringify(route || {}));
  return {
    "handler":function (_context){
        return value;
      },
    "defaults":{"args":[],"output":value},
    "options":{}
  };
}

// statsui.edge.substrate.group-runtime/ensureOpen [19] 
export function ensureOpen(handle){
  if(!handle || handle["closed"]){
    throw new Error("Superadmin group is closed.");
  }
  return handle;
}

// statsui.edge.substrate.group-runtime/attachGroup [25] 
export async function attachGroup(context,definition,bindings){
  let node = context["node"];
  let primary_id = context["primary-id"];
  let space_id = context["space-id"];
  if(!node || !primary_id || !space_id){
    throw new Error("Group context requires node, primary-id and space-id.");
  }
  if(!(definition || {})["models"]){
    throw new Error("Group definition is required.");
  }
  let values = Object.assign({},bindings);
  let opts = context["opts"] || {};
  let runtime_id = values["instance-id"] ? common.instanceGroupId(definition,values["instance-id"]) : definition["id"];
  if(page_core.group_get(node,space_id,runtime_id)){
    throw new Error("Group is already attached: " + runtime_id);
  }
  if(!values["actor-id"] && context["actor-id"]){
    values["actor-id"] = context["actor-id"];
  }
  let handle = {
    "definition":definition,
    "context":context,
    "closed":false,
    "page":null,
    "spec":null,
    "local":false
  };
  if(definition["models"]["route"] && (definition["models"]["route"]["kind"] == "local")){
    let group_id = runtime_id;
    let route = values["route"] || {};
    let spec = {
      "group_id":group_id,
      "models":{"route":createRouteModel(route)}
    };
    page_core.group_add_attach(node,space_id,group_id,spec["models"]);
    handle["spec"] = spec;
    handle["local"] = true;
  }
  else{
    let spec = common.createPageSpec(definition,values);
    handle["spec"] = spec;
    handle["page"] = await page_base.page_attach(node,primary_id,space_id,spec,opts);
  }
  return handle;
}

// statsui.edge.substrate.group-runtime/closeGroup [62] 
export async function closeGroup(handle){
  if(!handle || handle["closed"]){
    return true;
  }
  handle["closed"] = true;
  let context = handle["context"];
  if(handle["local"]){
    page_core.group_remove(
      context["node"],
      context["space-id"],
      handle["spec"]["group_id"]
    );
  }
  else{
    await page_base.page_detach(handle["page"],context["opts"] || {});
  }
  return true;
}

// statsui.edge.substrate.group-runtime/modelPath [77] 
export function modelPath(handle,model_id){
  ensureOpen(handle);
  if(!handle["spec"]["models"][model_id]){
    throw new Error("Unknown group model: " + model_id);
  }
  return [handle["spec"]["group_id"],model_id];
}

// statsui.edge.substrate.group-runtime/checkedResult [85] 
export function checkedResult(result){
  let output = (result && result["output"]) || {};
  let current = output.current || result || {};
  if(current.code && current.message && (Object.prototype.hasOwnProperty.call(current,"details") || Object.prototype.hasOwnProperty.call(current,"hint"))){
    let error = new Error(current.message);
    error.data = current;
    throw error;
  }
  if(result && ((result["status"] == "error") || result["error"] || output["errored"])){
    let current = output["current"];
    let error = new Error(
      result["message"] || (current && current["message"]) || "Group request failed."
    );
    error["data"] = result;
    throw error;
  }
  return result;
}

// statsui.edge.substrate.group-runtime/loadModel [105] 
export async function loadModel(handle,model_id){
  let path = modelPath(handle,model_id);
  let context = handle["context"];
  if(handle["local"]){
    return await page_core.model_refresh(context["node"],context["space-id"],path[0],model_id,{},null);
  }
  else{
    let args = handle["spec"]["models"][model_id]["model"]["defaults"]["args"] || [];
    return checkedResult(
      await page_base.page_model_call(handle["page"],model_id,args,true,context["opts"] || {})
    );
  }
}

// statsui.edge.substrate.group-runtime/refreshGroup [122] 
export async function refreshGroup(handle){
  ensureOpen(handle);
  let results = await Promise.allSettled(Object.keys(handle["spec"]["models"]).map(function (id){
    return loadModel(handle,id);
  }));
  results.forEach(function (entry){
    if(entry["status"] == "rejected"){
      throw entry["reason"];
    }
  });
  return results.map(function (entry){
    return entry["value"];
  });
}

// statsui.edge.substrate.group-runtime/openGroup [134] 
export async function openGroup(context,definition,bindings){
  let handle = await attachGroup(context,definition,bindings);
  try{
    await refreshGroup(handle);
    return handle;
  }
  catch(error){
    await closeGroup(handle);
    throw error;
  }
}

// statsui.edge.substrate.group-runtime/callAction [145] 
export async function callAction(handle,action_id,args){
  ensureOpen(handle);
  let action = handle["definition"]["actions"][action_id];
  if(!action){
    throw new Error("Unknown group action: " + action_id);
  }
  let rpc = action["rpc"];
  if(!Array.isArray(args) || !(args.length == rpc["input"].length)){
    throw new Error("Invalid argument count for group action: " + action_id);
  }
  if(action_id == "command"){
    let resource = args[1];
    let operation = args[3];
    let allowed = handle["definition"]["commands"][resource];
    if(!allowed || !allowed.includes(operation)){
      throw new Error("Unsupported group command: " + resource + "/" + operation);
    }
  }
  let context = handle["context"];
  return checkedResult(await db.rpc_call(
    context["node"],
    context["primary-id"],
    rpc,
    args,
    context["opts"] || {}
  ));
}

// statsui.edge.substrate.group-runtime/callCommand [168] 
export async function callCommand(handle,actor_id,resource,target_id,operation,payload){
  ensureOpen(handle);
  let allowed = handle["definition"]["commands"][resource];
  if(!allowed || !allowed.includes(operation)){
    throw new Error("Unsupported group command: " + resource + "/" + operation);
  }
  return await callAction(
    handle,
    "command",
    [actor_id,resource,target_id,operation,payload]
  );
}