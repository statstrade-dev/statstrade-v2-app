import React from 'react'

import * as rq from '@statstrade/edge/lib/js/lib/react-query.jsx'

import * as page from '@statstrade/edge/substrate/group-page.jsx'

import * as spec from '@statstrade/edge/substrate/group-spec.jsx'

import * as core from '@statstrade/edge/lib/xt/substrate/page-core.jsx'

// statsui.edge.substrate.page-api/PageContext [9] 
export var PageContext = React.createContext(null);

// statsui.edge.substrate.page-api/keyName [10] 
export function keyName(name){
  return name.replace(new RegExp("-","g"),"_");
}

// statsui.edge.substrate.page-api/snapshot [12] 
export function snapshot(owner){
  if(!(owner.status == "ready")){
    return {};
  }
  let handle = owner.handle;
  return core.model_get_output(
    handle.context.node,
    handle.context["space-id"],
    handle.spec.group_id,
    "snapshot"
  ) || {};
}

// statsui.edge.substrate.page-api/payload [16] 
export function payload(input,brand_id){
  let result = {};
  Object.entries(input || {}).forEach(function ([key,value]){
    result[keyName(key)] = value;
  });
  if(result.orgName){
    result.title = result.orgName;
  }
  if(result.orgId){
    result.org_id = result.orgId;
  }
  if(result.campaignId){
    result.campaign_id = result.campaignId;
  }
  if(result.topicId){
    result.topic_id = result.topicId;
  }
  if(result.organisation_id && !result.org_id){
    result.org_id = result.organisation_id;
  }
  if(brand_id){
    result.org_id = brand_id;
  }
  return result;
}

// statsui.edge.substrate.page-api/actionArgs [27] 
export function actionArgs(action,input,brand_id){
  let values = payload(input,brand_id);
  return action.rpc.input.map(function (arg){
    let name = arg.symbol || arg.name;
    if(name == "m"){
      return values.m || values;
    }
    if(!Object.prototype.hasOwnProperty.call(values,name)){
      throw new Error("Missing action field: " + name);
    }
    let value = values[name];
    if((arg.type == "jsonb") && ((typeof value) == "string")){
      return JSON.parse(value);
    }
    return value;
  });
}

// statsui.edge.substrate.page-api/queryValues [37] 
export function queryValues(key,data){
  let metrics = data.metrics || {};
  let mapping = {
    "organisation-token-list":data.tokens,
    "get-profile":data.brand,
    "list-campaigns":data.campaigns,
    "organisations-list":data.organisations,
    "list-invoices":data.invoices,
    "organisation-invite-list":data.invites,
    "topics-list":data.topics,
    "user-list-owner-organisations":data.organisations,
    "get-settings":data.brand,
    "list-campaign-members":data.members,
    "organisation-member-list":data.members,
    "prospect-market-list":data.topics
  };
  if(key == "get-stats"){
    return Object.assign({},metrics,{
      "users":metrics.members,
      "totalCampaigns":metrics.campaigns,
      "activeCampaigns":metrics.campaigns
    });
  }
  if(key == "get-market-stats"){
    return {
      "activeMarkets":metrics.topics,
      "totalParticipants":metrics.forecasters
    };
  }
  if(key == "get-token-stats"){
    return data.token_stats || null;
  }
  return mapping[key];
}

// statsui.edge.substrate.page-api/QueryKeys [48] 
export var QueryKeys = {
  "shell":["organisations-list"],
  "dashboard":["user-list-owner-organisations","get-stats"],
  "campaigns":["list-campaigns","get-stats"],
  "markets":["topics-list","prospect-market-list","get-market-stats"],
  "tokens":["organisation-token-list","get-token-stats"],
  "invites":["organisation-invite-list"],
  "settings":["get-settings","organisation-member-list"],
  "billing":["list-invoices"]
};

// statsui.edge.substrate.page-api/usePageApi [53] 
export function usePageApi(key,legacy = null){
  let context = React.useContext(PageContext);
  if(!context && legacy){
    return rq.useApi(legacy);
  }
  if(!context){
    throw new Error("Page model provider is missing.");
  }
  let [input,setInput] = React.useState({});
  let [httpBusy,setHttpBusy] = React.useState(false);
  let [httpError,setHttpError] = React.useState(null);
  let template = context.groups[key];
  if(!template){
    throw new Error("Unknown page group: " + key);
  }
  let enabled = (context.actor || (template.area == "public")) && (((key == "dashboard") || !(template.area == "brand")) || context.brand);
  let params = Object.assign({},context.params || {},input);
  if(key == "newsroom-detail"){
    params.id = params.publication_id;
  }
  let parameters = JSON.stringify(params);
  let definition = React.useMemo(function (){
    let values = JSON.parse(JSON.stringify(template));
    let bound = spec.createPageSpec(template,{
      "page-key":((key == "dashboard") && !context.brand) ? "shell" : (template["read-key"] || key),
      "brand-id":context.brand,
      "params":params,
      "topic-id":params.topic_id
    });
    values.models = bound.models;
    return values;
  },[template,context.brand,parameters]);
  let owner = page.useGroupPage(
    definition,
    "web-main/" + key + "/" + context.brand + "/" + parameters,
    context.actor,
    enabled
  );
  let data = snapshot(owner);
  let queries = {};
  (QueryKeys[key] || []).forEach(function (name){
    let value = queryValues(name,data);
    let wrapped = ["organisations-list","user-list-owner-organisations"].includes(name) ? {"data":value || []} : value;
    queries[keyName(name)] = {
      "data":wrapped,
      "output":value,
      "isLoading":enabled && (owner.status == "loading"),
      "isPending":owner.busy,
      "error":owner.error,
      "input":input,
      "setInput":setInput,
      "refetch":function (){
            return owner.controller.refresh("snapshot");
          }
    };
  });
  let mutations = {};
  Object.entries(template.actions).forEach(function ([name,action]){
    mutations[keyName(name)] = {
      "isPending":owner.busy || httpBusy,
      "error":owner.error || httpError,
      "mutateAsync":async function (value){
            if(!(owner.status == "ready")){
              throw new Error("Load this page before making changes.");
            }
            if(action.transport == "http"){
              setHttpBusy(true);
              setHttpError(null);
              try{
                let response = await fetch(action.path,{
                  "method":"POST",
                  "headers":{
                              "Authorization":"Bearer " + context.token,
                              "Content-Type":"application/json"
                            },
                  "body":JSON.stringify(Object.assign({},value,{"org_id":context.brand}))
                });
                let output = await response.json();
                if(!response.ok){
                  throw new Error(
                    output.message || output.error || "Provider request failed."
                  );
                }
                return {"data":output,"saved":true};
              }
              catch(error){
                setHttpError(error.message);
                throw error;
              }
              finally{
                setHttpBusy(false);
              }
            }
            let received = null;
            let result = await owner.controller.save(name,actionArgs(action,value,context.brand),"snapshot",function (output){
              received = output;
            });
            if(!result.saved){
              throw new Error(
                owner.controller.state.error || "The action failed. Refresh the page and check your access."
              );
            }
            return {"data":received,"saved":true,"refreshed":result.refreshed};
          }
    };
  });
  return {
    "definition":definition,
    "mutations":mutations,
    "setInput":setInput,
    "refresh":function (){
        return owner.controller.refresh("snapshot");
      },
    "busy":owner.busy || httpBusy,
    "error":owner.error || httpError,
    "queries":queries,
    "owner":owner,
    "data":data
  };
}

// statsui.edge.substrate.page-api/useAuthApi [98] 
export function useAuthApi(definition){
  let context = React.useContext(PageContext);
  if(context){
    Object.keys(definition.mutations).forEach(function (name){
      if(!context.route.actions[name.replace(new RegExp("_","g"),"-")]){
        throw new Error(
          "Authentication action is not declared for this route: " + name
        );
      }
    });
  }
  return rq.useApi(definition);
}