import React from 'react'

import * as T from 'tamagui'

import * as client_base from '@xtalk/db/node/client-base.js'

import * as global_table from '@statstrade/web-superadmin/a03/s03/global-table.jsx'

// statstrade-superadmin.a03.s03.global-sitevar/GLOBAL-DATAVIEW [39] 
export var GLOBAL_DATAVIEW = {
  "table":"Global",
  "select_entry":{
    "input":[],
    "view":{
      "table":"Global",
      "type":"select",
      "query":{"is_registered":true}
    }
  },
  "select_args":[],
  "return_entry":{
    "input":[{"symbol":"i_id","type":"uuid"}],
    "view":{
      "table":"Global",
      "type":"return",
      "query":[
        "id",
        "class_table",
        "class_context",
        "key",
        "value",
        "value_json",
        "default_json",
        "schema",
        "revision",
        "title",
        "description",
        "visibility",
        "lifecycle",
        "status",
        "is_registered",
        "rev",
        "op_created",
        "op_updated",
        "time_created",
        "time_updated"
      ],
      "identity":["id"]
    }
  },
  "return_args":[]
};

// statstrade-superadmin.a03.s03.global-sitevar/GLOBAL-ACTIONS [41] 
export var GLOBAL_ACTIONS = {
  "actions":{
    "update":{
      "rpc-spec":{
        "id":"super-global-section-update",
        "schema":"stats_rpc",
        "input":[
          {"name":"actor_id","symbol":"actor_id","type":"uuid"},
          {"name":"key","symbol":"key","type":"citext"},
          {
          "name":"expected_revision",
          "symbol":"expected_revision",
          "type":"integer"
        },
          {"name":"value","symbol":"value","type":"jsonb"},
          {"name":"reason","symbol":"reason","type":"text"}
        ],
        "return":"jsonb",
        "flags":{}
      }
    },
    "reset":{
      "rpc-spec":{
        "id":"super-global-section-reset",
        "schema":"stats_rpc",
        "input":[
          {"name":"actor_id","symbol":"actor_id","type":"uuid"},
          {"name":"key","symbol":"key","type":"citext"},
          {
          "name":"expected_revision",
          "symbol":"expected_revision",
          "type":"integer"
        },
          {"name":"reason","symbol":"reason","type":"text"}
        ],
        "return":"jsonb",
        "flags":{}
      }
    },
    "compute-publish":{
      "rpc-spec":{
        "id":"super-compute-configuration-publish",
        "schema":"stats_rpc",
        "input":[
          {"name":"actor_id","symbol":"actor_id","type":"uuid"},
          {
          "name":"expected_revision",
          "symbol":"expected_revision",
          "type":"integer"
        },
          {"name":"value","symbol":"value","type":"jsonb"},
          {"name":"reason","symbol":"reason","type":"text"}
        ],
        "return":"jsonb",
        "flags":{}
      }
    }
  }
};

// statstrade-superadmin.a03.s03.global-sitevar/useGlobalProps [43] 
export function useGlobalProps(context,actor_id){
  let {realtimeError,realtimeStatus,rows,view} = global_table.useDataviewRows(GLOBAL_DATAVIEW,context);
  let registered_rows = rows.filter(function (row){
    return !row["__deleted__"];
  }) || [];
  let [selected_key_state,set_selected_key] = React.useState(null);
  let [draft,set_draft] = React.useState(null);
  let [reason,set_reason] = React.useState("");
  let [busy,set_busy] = React.useState(false);
  let [error,set_error] = React.useState(null);
  let selected_key = selected_key_state || ((registered_rows.length > 0) ? registered_rows[0]["key"] : null);
  let selected = registered_rows.find(function (row){
    return row["key"] == selected_key;
  });
  let value_text = (draft == null) ? (selected ? JSON.stringify(selected["value_json"]) : "") : draft;
  let node = context["node"];
  let service_id = context["primary-id"] || "db/primary";
  let opts = context["opts"] || {};
  let rpc_actions = React.useMemo(function (){
    return {
      "update":function (...args){
            return client_base.rpc_call(
              node,
              service_id,
              GLOBAL_ACTIONS["actions"]["update"]["rpc-spec"],
              args,
              opts
            );
          },
      "reset":function (...args){
            return client_base.rpc_call(
              node,
              service_id,
              GLOBAL_ACTIONS["actions"]["reset"]["rpc-spec"],
              args,
              opts
            );
          },
      "compute-publish":function (...args){
            return client_base.rpc_call(
              node,
              service_id,
              GLOBAL_ACTIONS["actions"]["compute-publish"]["rpc-spec"],
              args,
              opts
            );
          }
    };
  },[node,service_id]);
  let update_rpc = rpc_actions["update"];
  let reset_rpc = rpc_actions["reset"];
  let publish_rpc = rpc_actions["compute-publish"];
  let valid_reasonp = function (){
    return reason && (reason.trim().length > 0);
  };
  let actions = {
    "select":function (key){
        let row = registered_rows.find(function (item){
          return item["key"] == key;
        });
        set_selected_key(key);
        set_draft(row ? JSON.stringify(row["value_json"]) : "");
        set_reason("");
        set_error(null);
      },
    "setDraft":function (value){
        set_draft(value);
        set_error(null);
      },
    "setReason":function (value){
        set_reason(value);
        set_error(null);
      }
  };
  actions["update"] = async function (){
    if(selected && actor_id && valid_reasonp() && !busy){
      set_busy(true);
      set_error(null);
      try{
        let value = JSON.parse(value_text);
        await update_rpc(actor_id,selected["key"],selected["revision"],value,reason);
        set_draft(null);
        await view();
      }
      catch(e){
        set_error("Unable to update the Global section.");
      }
      finally{
        set_busy(false);
      }
    }
  };
  actions["reset"] = async function (){
    if(selected && actor_id && valid_reasonp() && !busy){
      set_busy(true);
      set_error(null);
      try{
        await reset_rpc(actor_id,selected["key"],selected["revision"],reason);
        set_draft(null);
        await view();
      }
      catch(e){
        set_error("Unable to reset the Global section.");
      }
      finally{
        set_busy(false);
      }
    }
  };
  actions["publishCompute"] = async function (){
    if(selected && (selected["key"] == "compute") && actor_id && valid_reasonp() && !busy){
      set_busy(true);
      set_error(null);
      try{
        let value = JSON.parse(value_text);
        await publish_rpc(actor_id,selected["revision"],value,reason);
        set_draft(null);
        await view();
      }
      catch(e){
        set_error("Unable to publish the compute configuration.");
      }
      finally{
        set_busy(false);
      }
    }
  };
  return {
    "views":{
        "selected":selected,
        "error":error,
        "draft":value_text,
        "realtimeError":realtimeError,
        "selectedKey":selected_key,
        "busy":busy,
        "reason":reason,
        "realtimeStatus":realtimeStatus,
        "rows":registered_rows
      },
    "actions":actions
  };
}

// statstrade-superadmin.a03.s03.global-sitevar/A03S03GlobalSiteVar [194] 
export function A03S03GlobalSiteVar({context,actor_id}){
  let props = useGlobalProps(context,actor_id);
  let {actions,views} = props;
  let {busy,draft,error,realtimeError,realtimeStatus,reason,rows,selected,selectedKey} = views;
  let {publishCompute,reset,select,setDraft,setReason,update} = actions;
  return (
    <T.YStack gap="$4" flex={1} padding="$3">
      <T.Text fontSize="$5" fontWeight="600">Global configuration</T.Text>
      <T.Text fontSize="$2" color="$color10">{realtimeStatus || "CONNECTING"}</T.Text>
      {realtimeError ? (
        <T.Text fontSize="$2" color="$red10">{realtimeError}</T.Text>) : null}
      <T.XStack gap="$2" flexWrap="wrap">
        {rows.map(function (row){
          return (
            <T.Button
              key={row["id"]}
              size="$2"
              chromeless={true}
              backgroundColor={(row["key"] == selectedKey) ? "$color3" : "transparent"}
              onPress={function (){
                  select(row["key"]);
                }}>{row["title"] || row["key"]}
            </T.Button>);
        })}
      </T.XStack>
      {selected ? (
        <T.YStack gap="$3">
          <T.Text fontWeight="600">{selected["title"] || selected["key"]}</T.Text>
          <T.TextArea
            value={draft}
            onChangeText={setDraft}
            minHeight={240}
            fontFamily="monospace"
            numberOfLines={12}/>
          <T.TextArea
            value={reason}
            onChangeText={setReason}
            placeholder="Reason for this change"
            numberOfLines={3}/>
          <T.XStack gap="$2" flexWrap="wrap">
            <T.Button disabled={busy} onPress={update}>{busy ? "Saving..." : "Save"}</T.Button>
            <T.Button disabled={busy} onPress={reset}>Reset</T.Button>
            {(selected["key"] == "compute") ? (
              <T.Button disabled={busy} onPress={publishCompute}>Publish compute</T.Button>) : null}
          </T.XStack>
        </T.YStack>) : (
        <T.Text color="$color10">No registered Global sections found.</T.Text>)}
      {error ? (
        <T.Text color="$red10" accessibilityRole="alert">{error}</T.Text>) : null}
    </T.YStack>);
}