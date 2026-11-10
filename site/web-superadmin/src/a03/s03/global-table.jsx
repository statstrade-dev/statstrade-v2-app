import React from 'react'

import * as ReactNative from 'react-native'

import * as client_base from '@xtalk/db/node/client-base.js'

import * as group_tables from '@statstrade/web-superadmin/groups/a00/s02-tables.jsx'

import * as ext_page from '@statstrade/edge/lib/js/react/ext-page.js'

import * as group_common from '@statstrade/web-superadmin/lib/substrate-model-common.jsx'

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
  let options = {};
  let table_name = spec[0];
  if(table_name && !(false == (opts || {})["realtime-enabled"])){
    let refresh = {};
    refresh[table_name] = true;
    options["refresh"] = refresh;
  }
  return {
    "attach-type":"pull",
    "defaults":{"args":[],"output":[]},
    "options":options
  };
}

// statstrade-superadmin.a03.s03.global-table/dataviewPageModel [36] 
export function dataviewPageModel(primary_id,dataview,opts){
  let options = {};
  let table_name = dataview["table"];
  if(table_name && !(false == (opts || {})["realtime-enabled"])){
    let refresh = {};
    refresh[table_name] = true;
    options["refresh"] = refresh;
  }
  return {
    "attach-type":"dataview",
    "defaults":{"args":[{"select_args":[],"return_args":[]}],"output":[]},
    "options":options
  };
}

// statstrade-superadmin.a03.s03.global-table/tableRealtimeEnabled [51] 
export function tableRealtimeEnabled(opts){
  return !(false == (opts || {})["realtime-enabled"]);
}

// statstrade-superadmin.a03.s03.global-table/useGlobalRealtime [56] 
export function useGlobalRealtime(handle){
  let context = handle["context"];
  let node = context["node"];
  let primary_id = context["primary-id"];
  let space_id = context["space-id"];
  let group_id = handle["spec"]["group_id"];
  let opts = context["opts"] || {};
  let [realtimeStatus,set_realtimeStatus] = React.useState(tableRealtimeEnabled(opts) ? "CONNECTING" : "DISABLED");
  let [realtimeError,set_realtimeError] = React.useState(null);
  React.useEffect(function (){
    if(!tableRealtimeEnabled(opts)){
      return null;
    }
    let active = true;
    let topic = "realtime:Superadmin:Global";
    let subscriber_id = group_id + "-realtime-" + Math.random().toString(36).substr(2,8);
    let connection_id = "page-realtime/" + primary_id + "/" + space_id + "/" + subscriber_id;
    let subscription = client_base.subscribe_db(node,primary_id,connection_id,[topic],{}).then(function (results){
      if(active){
        if(true == results[0]){
          set_realtimeStatus("LIVE");
          set_realtimeError(null);
        }
        else{
          set_realtimeStatus("OFFLINE");
          set_realtimeError("Unable to subscribe to Global updates.");
        }
      }
      return results;
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
      subscription.then(function (_){
        return client_base.unsubscribe_db(node,primary_id,connection_id,[topic],{});
      }).catch(function (_){
        return null;
      });
    };
  },[node,primary_id,space_id,group_id]);
  return {
    "realtimeStatus":realtimeStatus,
    "realtimeError":realtimeError
  };
}

// statstrade-superadmin.a03.s03.global-table/useRows [126] 
export function useRows(spec,context,model_builder){
  let node = context["node"];
  let primary_id = context["primary-id"] || "db/primary/GUEST";
  let space_id = context["space-id"] || "app/GUEST";
  let opts = context["opts"] || {};
  let hook_id = React.useRef(Math.random().toString(36).substr(2,8)).current;
  let group = context["group"] || group_tables.Group;
  let group_id = group_common.instanceGroupId(group,hook_id);
  let page_args = {"space_id":space_id,"group_id":group_id,"model_id":"rows"};
  let model_spec = React.useMemo(function (){
    return model_builder(primary_id,spec,opts);
  },[primary_id,spec,JSON.stringify(opts),model_builder]);
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
    let active = true;
    mounted["current"] = true;
    let setup = async function (){
      try{
        await ("dataview" == model_spec["attach-type"]) ? client_base.dataview_attach_model(node,primary_id,page_args,spec,model_spec,{}) : client_base.pull_attach_model(node,primary_id,page_args,spec,model_spec,{});
        if(active){
          await ("dataview" == model_spec["attach-type"]) ? client_base.dataview_call(node,primary_id,spec,opts) : client_base.pull_call(node,primary_id,spec,opts);
          if(active){
            set_error(null);
            await refresh();
          }
        }
      }
      catch(e){
        if(active){
          set_error("Unable to load records.");
        }
      }
    };
    setup();
    return function (){
      active = false;
      mounted["current"] = false;
      setup.then(function (_){
        return client_base.detach_model(node,primary_id,page_args,{});
      }).catch(function (_){
        return null;
      });
    };
  },[node,primary_id,space_id,group_id,spec,model_spec,refresh]);
  let realtime = useGlobalRealtime({
    "context":{
        "node":node,
        "primary-id":primary_id,
        "space-id":space_id,
        "opts":opts
      },
    "spec":{"group_id":group_id}
  });
  let {realtimeError,realtimeStatus} = realtime;
  return {
    "view":refresh,
    "group":group,
    "group-id":group_id,
    "rows":rows,
    "error":error,
    "realtimeStatus":realtimeStatus,
    "realtimeError":realtimeError
  };
}

// statstrade-superadmin.a03.s03.global-table/useTableRows [217] 
export function useTableRows(table,fields,context){
  let spec = React.useMemo(function (){
    return [table,{"data":fields}];
  },[table,JSON.stringify(fields)]);
  return useRows(spec,context,tablePageModel);
}

// statstrade-superadmin.a03.s03.global-table/useDataviewRows [226] 
export function useDataviewRows(dataview,context){
  return useRows(dataview,context,dataviewPageModel);
}

// statstrade-superadmin.a03.s03.global-table/rpcCall [231] 
export function rpcCall(node,primary_id,rpc_spec,args,opts){
  return client_base.rpc_call(node,primary_id,rpc_spec,args,opts);
}

// statstrade-superadmin.a03.s03.global-table/TableList [236] 
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