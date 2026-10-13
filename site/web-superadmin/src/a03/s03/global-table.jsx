import React from 'react'

import * as ReactNative from 'react-native'

import * as client_base from '@xtalk/db/node/client-base.js'

import * as ext_page from '@statstrade/edge/lib/js/react/ext-page.js'

import * as page_core from '@xtalk/substrate/page-core.js'

import * as substrate from '@xtalk/substrate/substrate.js'

// statstrade-superadmin.a03.s03.global-table/tableImpl [13] 
export function tableImpl(table,fields){
  let spec = [table,{"data":fields}];
  return {
    "base":{"list":{"spec":spec},"data":{"spec":spec}},
    "call":{},
    "cached":{}
  };
}

// statstrade-superadmin.a03.s03.global-table/tablePageModel [22] 
export function tablePageModel(primary_id,spec,opts){
  return {
    "handler":function (context){
        return client_base.pull_call(context["node"],primary_id,spec,opts);
      },
    "defaults":{"args":[],"output":[]},
    "options":{}
  };
}

// statstrade-superadmin.a03.s03.global-table/dataviewPageModel [35] 
export function dataviewPageModel(primary_id,dataview,opts){
  return {
    "handler":function (context){
        return client_base.dataview_call(context["node"],primary_id,dataview,opts);
      },
    "defaults":{"args":[],"output":[]},
    "options":{}
  };
}

// statstrade-superadmin.a03.s03.global-table/tableRealtimeEnabled [48] 
export function tableRealtimeEnabled(opts){
  return !(false == (opts || {})["realtime-enabled"]);
}

// statstrade-superadmin.a03.s03.global-table/useRows [53] 
export function useRows(spec,context,model_builder){
  let node = context["node"];
  let primary_id = context["primary-id"] || "db/primary/GUEST";
  let space_id = context["space-id"] || "app/GUEST";
  let opts = context["opts"] || {};
  let hook_id = React.useRef(Math.random().toString(36).substr(2,8)).current;
  let group_id = "a03-s03-global-table-" + hook_id;
  let model_spec = React.useMemo(function (){
    return model_builder(primary_id,spec,opts);
  },[primary_id,spec,JSON.stringify(opts),model_builder]);
  let attached = React.useMemo(function (){
    return page_core.group_add_attach(node,space_id,group_id,{"rows":model_spec});
  },[node,space_id,group_id,model_spec]);
  let output = ext_page.listenModelOutput(node,space_id,[group_id,"rows"],["output"],null);
  let rows = output["current"] || [];
  let [error,set_error] = React.useState(null);
  let mounted = React.useRef(false);
  let refresh = React.useMemo(function (){
    return async function (){
      try{
        let result = await ext_page.refreshModel(node,space_id,[group_id,"rows"],{});
        if(mounted["current"]){
          set_error(null);
        }
        return result;
      }
      catch(e){
        if(mounted["current"]){
          set_error("Unable to load records.");
        }
        return [];
      }
    };
  },[node,space_id,group_id,model_spec]);
  React.useEffect(function (){
    page_core.group_add_attach(node,space_id,group_id,{"rows":model_spec});
    mounted["current"] = true;
    let load = async function (){
      await refresh();
    };
    load();
    return function (){
      mounted["current"] = false;
      page_core.group_remove(node,space_id,group_id);
    };
  },[node,space_id,group_id,model_spec,refresh]);
  let [realtimeStatus,set_realtimeStatus] = React.useState(tableRealtimeEnabled(opts) ? "CONNECTING" : "DISABLED");
  let [realtimeError,set_realtimeError] = React.useState(null);
  React.useEffect(function (){
    if(!tableRealtimeEnabled(opts)){
      return null;
    }
    let active = true;
    let refresh_timeout = null;
    let subscription_id = group_id + "-realtime-" + Math.random().toString(36).substr(2,8);
    let signal = "realtime.changed/" + subscription_id;
    let schedule_refresh = function (){
      if(null == refresh_timeout){
        refresh_timeout = setTimeout(function (){
          refresh_timeout = null;
          if(active){
            refresh();
          }
        },100);
      }
    };
    substrate.register_trigger(node,signal,function (_space,_stream,_trigger_node){
      if(active){
        schedule_refresh();
      }
    },null);
    substrate.subscribe(node,space_id,signal,subscription_id,{}).then(function (_){
      return substrate.request(node,null,"@xt.db/realtime/subscribe",[
        primary_id,
        space_id,
        subscription_id,
        "realtime:Superadmin:Global",
        signal
      ],{});
    }).then(function (result){
      if("live" == result["status"]){
        set_realtimeStatus("LIVE");
        set_realtimeError(null);
      }
      else{
        set_realtimeStatus("OFFLINE");
        set_realtimeError(
          result["message"] || "Unable to subscribe to Global updates."
        );
      }
    }).catch(function (subscribe_error){
      if(active){
        set_realtimeStatus("OFFLINE");
        set_realtimeError(
          subscribe_error["message"] || "Unable to subscribe to Global updates."
        );
      }
      return null;
    });
    return function (){
      active = false;
      if(!(null == refresh_timeout)){
        clearTimeout(refresh_timeout);
        refresh_timeout = null;
      }
      substrate.unregister_trigger(node,signal);
      substrate.unsubscribe(node,space_id,signal,subscription_id,{}).then(function (_){
        return substrate.request(
          node,
          null,
          "@xt.db/realtime/unsubscribe",
          [primary_id,subscription_id],
          {}
        );
      }).catch(function (_){
        return null;
      });
    };
  },[node,primary_id,space_id,group_id,refresh]);
  return {
    "view":refresh,
    "rows":rows,
    "error":error,
    "realtimeStatus":realtimeStatus,
    "realtimeError":realtimeError
  };
}

// statstrade-superadmin.a03.s03.global-table/useTableRows [207] 
export function useTableRows(table,fields,context){
  let spec = React.useMemo(function (){
    return [table,{"data":fields}];
  },[table,JSON.stringify(fields)]);
  return useRows(spec,context,tablePageModel);
}

// statstrade-superadmin.a03.s03.global-table/useDataviewRows [216] 
export function useDataviewRows(dataview,context){
  return useRows(dataview,context,dataviewPageModel);
}

// statstrade-superadmin.a03.s03.global-table/rpcCall [221] 
export function rpcCall(node,primary_id,rpc_spec,args,opts){
  return client_base.rpc_call(node,primary_id,rpc_spec,args,opts);
}

// statstrade-superadmin.a03.s03.global-table/TableList [226] 
export function TableList({title,subtitle,rows,realtimeStatus,realtimeError}){
  let records = rows || [];
  let cards = records.map(function (row){
    return (
      <ReactNative.View
        key={row["id"]}
        style={{"paddingVertical":10,"borderBottomWidth":1}}>
        <ReactNative.Text style={{"fontWeight":"600"}}>
          {row["title"] || row["name"] || row["key"] || row["code"] || row["id"]}
        </ReactNative.Text>
        <ReactNative.Text style={{"fontFamily":"monospace","fontSize":12}}>{JSON.stringify(row)}</ReactNative.Text>
      </ReactNative.View>);
  });
  return (
    <ReactNative.View style={{"flex":1,"padding":12}}>
      <ReactNative.Text style={{"fontSize":20,"fontWeight":"700","marginBottom":4}}>{title}</ReactNative.Text>
      <ReactNative.Text style={{"fontSize":12,"opacity":0.7,"marginBottom":12}}>{subtitle || ""}</ReactNative.Text>
      <ReactNative.Text style={{"fontSize":11,"opacity":0.7,"marginBottom":8}}>{realtimeStatus || "CONNECTING"}</ReactNative.Text>
      {realtimeError ? (
        <ReactNative.Text style={{"fontSize":12,"color":"#b42318","marginBottom":8}}>{realtimeError}</ReactNative.Text>) : null}
      {(records.length > 0) ? cards : (
        <ReactNative.Text style={{"paddingVertical":12}}>No records found.</ReactNative.Text>)}
    </ReactNative.View>);
}