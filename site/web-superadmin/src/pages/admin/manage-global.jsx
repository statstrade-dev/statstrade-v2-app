import * as T from 'tamagui'

import React from 'react'

import * as sb from '@statstrade/edge/remote/util-supabase.jsx'

import * as ext_page from '@statstrade/edge/lib/js/react/ext-page.js'

// statstrade-superadmin.pages.admin.manage-global/GLOBAL-PAGE [18] 
export var GLOBAL_PAGE = {
  "group_id":"admin/global",
  "views":{
    "globals":{
      "dataview":{
        "table":"Global",
        "select_entry":{
          "input":[],
          "view":{
            "table":"Global",
            "type":"select",
            "query":{"is_registered":true,"__deleted__":false}
          }
        },
        "return_entry":{
          "input":[],
          "view":{
            "table":"Global",
            "type":"return",
            "query":[
              "id",
              "key",
              "value_json",
              "default_json",
              "schema",
              "revision",
              "title",
              "description",
              "visibility",
              "lifecycle",
              "status",
              "is_registered"
            ]
          }
        }
      },
      "model":{
        "pipeline":{},
        "options":{"refresh":{"Global":true}},
        "defaults":{"args":[],"output":[]}
      }
    }
  },
  "actions":{
    "update":{
      "rpc":"super-global-section-update",
      "model":{
        "pipeline":{},
        "options":{},
        "defaults":{"args":[],"output":null}
      }
    },
    "reset":{
      "rpc":"super-global-section-reset",
      "model":{
        "pipeline":{},
        "options":{},
        "defaults":{"args":[],"output":null}
      }
    },
    "compute-publish":{
      "rpc":"super-compute-configuration-publish",
      "model":{
        "pipeline":{},
        "options":{},
        "defaults":{"args":[],"output":null}
      }
    }
  }
};

// statstrade-superadmin.pages.admin.manage-global/useGlobalProps [60] 
export function useGlobalProps(page,actor_id){
  let output = ext_page.listenPageView(page,"globals","output",{});
  let [selected_key_state,setSelectedKey] = React.useState(null);
  let [draft,setDraft] = React.useState("");
  let [reason,setReason] = React.useState("");
  let [busy,setBusy] = React.useState(false);
  let [error,setError] = React.useState(null);
  let rows = output || [];
  let selected_key = selected_key_state || ((rows.length > 0) ? rows[0]["key"] : null);
  let selected = rows.find(function (row){
    return row.key == selected_key;
  });
  let draft_value = draft || (selected ? JSON.stringify(selected.value_json) : "");
  let parse_value = function (){
    try{
      return JSON.parse(draft || JSON.stringify(selected.value_json));
    }
    catch(e){
      setError("Value must contain valid JSON.");
      return null;
    }
  };
  let valid_reasonp = function (){
    return reason && (reason.trim.length > 0);
  };
  let actions = {
    "select":function (key){
        setSelectedKey(key);
        setError(null);
      },
    "setDraft":function (value){
        setDraft(value);
        setError(null);
      },
    "setReason":function (value){
        setReason(value);
        setError(null);
      }
  };
  let run_mutation = function (action_id,args,message){
    setBusy(true);
    setError(null);
    try{
      await ext_page.callPageAction(page,action_id,args,{"refresh":["globals"]});
    }
    catch(e){
      setError(message);
    }
    finally{
      setBusy(false);
    }
  };
  actions["update"] = async function (){
    if(selected && actor_id && !busy){
      let value = parse_value();
      if(value && valid_reasonp()){
        await run_mutation(
          "update",
          [actor_id,selected.key,selected.revision,value,reason],
          "Unable to update the Global section."
        );
      }
    }
  };
  actions["reset"] = async function (){
    if(selected && actor_id && valid_reasonp() && !busy){
      await run_mutation(
        "reset",
        [actor_id,selected.key,selected.revision,reason],
        "Unable to reset the Global section."
      );
    }
  };
  actions["publishCompute"] = async function (){
    if(selected && (selected.key == "compute") && actor_id && !busy){
      let value = parse_value();
      if(value && valid_reasonp()){
        await run_mutation(
          "compute-publish",
          [actor_id,selected.revision,value,reason],
          "Unable to publish the compute configuration."
        );
      }
    }
  };
  return {
    "views":{
        "output":output,
        "rows":rows,
        "selected":selected,
        "selectedKey":selected_key,
        "draft":draft_value,
        "reason":reason,
        "busy":busy,
        "error":error
      },
    "actions":actions
  };
}

// statstrade-superadmin.pages.admin.manage-global/GlobalApp [166] 
export function GlobalApp({actions,views}){
  let {busy,draft,error,reason,rows,selected,selectedKey} = views;
  let {publishCompute,reset,select,setDraft,setReason,update} = actions;
  return (
    <T.YStack gap="$4" flex={1}>
      <T.Text fontSize="$5" fontWeight="600">Global configuration</T.Text>
      <T.XStack gap="$2" flexWrap="wrap">
        {rows.map(function (row){
          return (
            <T.Button
              key={row.key}
              size="$2"
              chromeless={true}
              backgroundColor={(row.key == selectedKey) ? "$color3" : "transparent"}
              onPress={function (){
                  select(row.key);
                }}>{row.title || row.key}
            </T.Button>);
        })}
      </T.XStack>
      {selected ? (
        <T.YStack gap="$3">
          <T.Text fontWeight="600">{selected.title}</T.Text>
          <T.TextArea
            value={draft}
            onChangeText={setDraft}
            minHeight={300}
            fontFamily="monospace"
            numberOfLines={14}/>
          <T.TextArea
            value={reason}
            onChangeText={setReason}
            placeholder="Reason for this change"
            numberOfLines={3}/>
          <T.XStack gap="$2">
            <T.Button disabled={busy} onPress={update}>{busy ? "Saving..." : "Save"}</T.Button>
            <T.Button disabled={busy} onPress={reset}>Reset</T.Button>
            {(selected.key == "compute") ? (
              <T.Button disabled={busy} onPress={publishCompute}>Publish compute</T.Button>) : null}
          </T.XStack>
        </T.YStack>) : (
        <T.Text color="$color10">No Global section selected.</T.Text>)}
      {error ? (
        <T.Text color="$red10" accessibilityRole="alert">{error}</T.Text>) : null}
    </T.YStack>);
}

// statstrade-superadmin.pages.admin.manage-global/GlobalController [226] 
export function GlobalController({page,actor_id}){
  let props = useGlobalProps(page,actor_id);
  return (
    <GlobalApp>{props}</GlobalApp>);
}

// statstrade-superadmin.pages.admin.manage-global/GlobalContent [231] 
export function GlobalContent({resource}){
  let [session] = sb.useListenSession();
  let actor_id = session["user"]["id"];
  let space_id = actor_id ? ("user/" + actor_id) : null;
  let page_state = ext_page.usePage(resource,"db/primary",space_id,GLOBAL_PAGE,{});
  let page = page_state["page"];
  let page_error = page_state["error"];
  return page ? (
    <GlobalController page={page} actorId={actor_id}/>) : (page_error ? (
    <T.Text color="$red10">Unable to connect to the Global page.</T.Text>) : (
    <T.XStack gap="$2" alignItems="center">
      <T.Spinner size="small"/>
      <T.Text color="$color10">Loading Global configuration...</T.Text>
    </T.XStack>));
}