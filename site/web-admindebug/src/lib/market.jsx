import React from 'react'

import * as client from '@xtalk/db/node/client-base.js'

import * as page from '@xtalk/db/node/page-base.js'

// statstrade-admindebug.lib.market/DEMO_IDS [24] 
export var DEMO_IDS = [
  "3c1c1146-eb64-3bf4-96d6-999aaae89c11",
  "3e2d7a89-2c05-3948-8b8b-3fcb9ec3cdf2",
  "ead0de0a-c58d-37a4-b80d-0b0931c08a0a",
  "84d263f4-72cc-3ed5-a914-f4f9db4eec56",
  "28908f39-21ba-3d1d-a1c8-617e402a6715",
  "91075757-aa01-3f23-bdb7-7055f9bdbd35",
  "a5aae82b-eba7-3c25-807b-f634d279b7d9",
  "d93ee27e-aeca-32b7-acb9-4a883f4f9243"
];

// statstrade-admindebug.lib.market/MARKET [25] 
export var MARKET = {
  "id":"user-topic-market-state",
  "schema":"stats_rpc",
  "input":[
    {
    "name":"topic_id",
    "symbol":"topic_id",
    "type":"uuid",
    "modifiers":["uuid"],
    "role":"payload"
  }
  ],
  "return":"jsonb",
  "flags":{"sb/grant":"auth"},
  "meta":{
    "db/module":"statsdb.fn.user.user-view-market",
    "sb/grant":"auth"
  }
};

// statstrade-admindebug.lib.market/PORTFOLIO [26] 
export var PORTFOLIO = {
  "id":"user-topic-portfolio",
  "schema":"stats_rpc",
  "input":[
    {
    "name":"topic_id",
    "symbol":"topic_id",
    "type":"uuid",
    "modifiers":["uuid"],
    "role":"payload"
  }
  ],
  "return":"jsonb",
  "flags":{"sb/grant":"auth"},
  "meta":{
    "db/module":"statsdb.fn.user.user-view-market",
    "sb/grant":"auth"
  }
};

// statstrade-admindebug.lib.market/BUY [27] 
export var BUY = {
  "id":"user-topic-buy-full",
  "schema":"stats_rpc",
  "input":[
    {
    "name":"topic_id",
    "symbol":"topic_id",
    "type":"uuid",
    "modifiers":["uuid"],
    "role":"payload"
  },
    {
    "name":"name",
    "symbol":"name",
    "type":"citext",
    "modifiers":["citext"],
    "role":"payload"
  },
    {
    "name":"amount",
    "symbol":"amount",
    "type":"bigint",
    "modifiers":["bigint"],
    "role":"payload"
  },
    {
    "name":"price",
    "symbol":"price",
    "type":"numeric",
    "modifiers":["numeric"],
    "role":"payload"
  }
  ],
  "return":"jsonb",
  "flags":{"sb/grant":"auth"},
  "meta":{
    "db/module":"statsdb.fn.user.user-trade-topic",
    "sb/grant":"auth"
  }
};

// statstrade-admindebug.lib.market/SELL [28] 
export var SELL = {
  "id":"user-topic-sell-full",
  "schema":"stats_rpc",
  "input":[
    {
    "name":"topic_id",
    "symbol":"topic_id",
    "type":"uuid",
    "modifiers":["uuid"],
    "role":"payload"
  },
    {
    "name":"name",
    "symbol":"name",
    "type":"citext",
    "modifiers":["citext"],
    "role":"payload"
  },
    {
    "name":"amount",
    "symbol":"amount",
    "type":"bigint",
    "modifiers":["bigint"],
    "role":"payload"
  },
    {
    "name":"price",
    "symbol":"price",
    "type":"numeric",
    "modifiers":["numeric"],
    "role":"payload"
  }
  ],
  "return":"jsonb",
  "flags":{"sb/grant":"auth"},
  "meta":{
    "db/module":"statsdb.fn.user.user-trade-topic",
    "sb/grant":"auth"
  }
};

// statstrade-admindebug.lib.market/CANCEL [29] 
export var CANCEL = {
  "id":"user-topic-cancel-full",
  "schema":"stats_rpc",
  "input":[
    {
    "name":"order_id",
    "symbol":"order_id",
    "type":"uuid",
    "modifiers":["uuid"],
    "role":"payload"
  }
  ],
  "return":"jsonb",
  "flags":{"sb/grant":"auth"},
  "meta":{
    "db/module":"statsdb.fn.user.user-trade-topic",
    "sb/grant":"auth"
  }
};

// statstrade-admindebug.lib.market/model [31] 
export function model(topic){
  return {
    "defaults":{"args":[topic],"output":null},
    "options":{},
    "pipeline":{}
  };
}

// statstrade-admindebug.lib.market/pageSpec [34] 
export function pageSpec(topic){
  return {
    "group_id":"admindebug/trading",
    "models":{
        "market":{"rpc":MARKET,"model":model(topic)},
        "portfolio":{"rpc":PORTFOLIO,"model":model(topic)}
      }
  };
}

// statstrade-admindebug.lib.market/listMarkets [39] 
export async function listMarkets(resource){
  let primary = resource.config.primary["id"];
  let result = await client.pull_call(resource.client,primary,[
    "Topic",
    {
      "data":["id","title","code"],
      "where":[{"id":["in",DEMO_IDS],"status":"trading"}]
    }
  ],{});
  return (result || []).sort(function (a,b){
    return a.code.localeCompare(b.code);
  });
}

// statstrade-admindebug.lib.market/trade [46] 
export async function trade(resource,side,topic,outcome,amount,price){
  if(!Number.isInteger(amount) || (amount < 1) || (amount > 100) || !Number.isFinite(price) || (price <= 0) || (price > 1000)){
    throw new Error(
      "Use 1–100 whole shares and a price greater than zero, up to 1000."
    );
  }
  return await client.rpc_call(
    resource.client,
    resource.config.primary.id,
    (side == "buy") ? BUY : SELL,
    [topic,outcome,amount,price],
    {}
  );
}

// statstrade-admindebug.lib.market/cancel [53] 
export async function cancel(resource,id){
  return await client.rpc_call(resource.client,resource.config.primary.id,CANCEL,[id],{});
}

// statstrade-admindebug.lib.market/modelOutput [56] 
export function modelOutput(response){
  if(!response || !(response.status == "ok") || !response.output || response.output.errored || !response.output.current){
    throw new Error(
      (response && response.message) || "Market model returned no usable output"
    );
  }
  return response.output.current;
}

// statstrade-admindebug.lib.market/useMarket [62] 
export function useMarket(resource,topic,enabled){
  let [state,setState] = React.useState(null);
  let [account,setAccount] = React.useState(null);
  let [error,setError] = React.useState(null);
  let [loading,setLoading] = React.useState(false);
  let refreshRef = React.useRef(async function (){
    return null;
  });
  React.useEffect(function (){
    let active = true;
    let handle = null;
    let busy = false;
    setState(null);
    setAccount(null);
    setError(null);
    if(!enabled || !topic){
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    let refresh = async function (){
      if(!active || busy || !handle){
        return null;
      }
      busy = true;
      try{
        let results = await Promise.all([
          page.page_model_call(handle,"market",[topic],true,{}),
          page.page_model_call(handle,"portfolio",[topic],true,{})
        ]);
        let market_value = modelOutput(results[0]);
        let portfolio_value = modelOutput(results[1]);
        if(active){
          setState(market_value);
          setAccount(portfolio_value);
          setError(null);
        }
      }
      catch(e){
        if(active){
          setError(e.message || JSON.stringify(e) || "Market request failed");
        }
      }
      finally{
        busy = false;
        if(active){
          setLoading(false);
        }
      }
    };
    refreshRef.current = refresh;
    let setup = async function (){
      try{
        handle = await page.page_attach(
          resource.client,
          resource.config.primary.id,
          "statstrade-admindebug/" + resource["scope-id"] + "/trading/" + topic,
          pageSpec(topic),
          {}
        );
        if(active){
          await refresh();
        }
        else{
          await page.page_detach(handle,{});
        }
      }
      catch(e){
        if(active){
          setError(
            e.message || JSON.stringify(e) || "Substrate initialization failed"
          );
          setLoading(false);
        }
      }
    };
    let pending = setup();
    let timer = setInterval(refresh,3000);
    return function (){
      active = false;
      clearInterval(timer);
      refreshRef.current = async function (){
        return null;
      };
      pending.then(function (){
        return page.page_detach(handle,{});
      }).catch(function (){
        return null;
      });
    };
  },[resource,topic,enabled]);
  return {
    "state":state,
    "account":account,
    "error":error,
    "loading":loading,
    "refresh":async function (){
        return await refreshRef.current();
      }
  };
}