import React from 'react'

import * as T from 'tamagui'

import * as editor from '@statstrade/web-superadmin/adminweb/group-editor.jsx'

import * as global_table from '@statstrade/web-superadmin/a03/s03/global-table.jsx'

import * as page from '@statstrade/web-superadmin/lib/substrate-page.jsx'

import * as global from '@statstrade/web-superadmin/groups/a03/s01/t01-global.jsx'

// statstrade-superadmin.a03.s03.global-sitevar/Fields [13] 
export var Fields = ["value_json"];

// statstrade-superadmin.a03.s03.global-sitevar/GlobalEditor [15] 
export function GlobalEditor({owner,actor_id}){
  let rows = page.useGroupModel(owner["handle"],"rows");
  let draft = editor.useRecordEditor(rows,"key",Fields);
  let realtime = global_table.useGlobalRealtime(owner["handle"]);
  let [reason,set_reason] = React.useState("");
  let [error,set_error] = React.useState(null);
  let [conflict,set_conflict] = React.useState(false);
  let row = draft["row"];
  let base = draft["base"];
  let control = owner["controller"];
  let busy = owner["busy"];
  let document = draft["values"]["value_json"];
  let valid = true;
  try{
    JSON.parse(document || "");
  }
  catch(_){
    valid = false;
  }
  let stale = conflict || (row && base && !(row["revision"] == base["revision"]));
  React.useEffect(function (){
    set_reason("");
    set_error(null);
    set_conflict(false);
  },[draft["selected"]]);
  let mutate = async function (action){
    set_error(null);
    let args = [actor_id,base["key"],base["revision"]];
    if(action == "update-global"){
      args.push(JSON.parse(document),reason);
    }
    else if(action == "reset-global"){
      args.push(reason);
    }
    else{
      args = [actor_id,base["revision"],JSON.parse(document),reason];
    }
    let result = await control.save(action,args,"rows");
    if(control["active"]){
      if(result["conflict"]){
        set_conflict(true);
      }
      if(result["refreshed"]){
        draft.accept();
        set_reason("");
      }
    }
  };
  let reload = async function (){
    if(await control.refresh("rows")){
      if(control["active"]){
        draft.accept();
        set_conflict(false);
        set_error(null);
      }
    }
  };
  let refresh = async function (){
    let saved = owner["needs-refresh"];
    if(await control.refresh("rows") && saved && control["active"]){
      draft.accept();
    }
  };
  let disabled = busy || !row || stale || owner["needs-refresh"] || (reason.trim().length == 0);
  return (
    <T.YStack gap="$3" flex={1} padding="$3">
      <T.XStack gap="$2" alignItems="center">
        <T.Text fontSize="$5" fontWeight="600" flex={1}>Global configuration</T.Text>
        <T.Button disabled={busy} onPress={refresh}>{busy ? "Working…" : "Refresh"}</T.Button>
      </T.XStack>
      <T.Text color="$color10">{realtime["realtimeStatus"]}</T.Text>
      {realtime["realtimeError"] ? (
        <T.Text accessibilityRole="alert">{realtime["realtimeError"]}</T.Text>) : null}
      <editor.PageMessages page={owner}/>
      <editor.SelectionPrompt editor={draft}/>
      <T.XStack gap="$2" flexWrap="wrap">
        {rows.map(function (item){
          return (
            <T.Button
              key={item["id"]}
              disabled={busy}
              ariaPressed={item["key"] == draft["selected"]}
              onPress={function (){
                  draft.choose(item["key"]);
                }}>{item["title"] || item["key"]}
            </T.Button>);
        })}
      </T.XStack>
      {base ? (
        <T.YStack gap="$3">
          <T.Text fontWeight="600">
            {(base["title"] || base["key"]) + " · revision " + base["revision"]}
          </T.Text>
          {!row ? (
            <T.Text accessibilityRole="alert">
              This section is no longer available. Your draft is retained.
            </T.Text>) : null}
          <T.TextArea
            value={document || ""}
            disabled={busy}
            accessibilityLabel="Global JSON document"
            onChangeText={function (value){
                draft.set("value_json",value);
              }}
            minHeight={240}
            fontFamily="monospace"/>
          {!valid ? (
            <T.Text accessibilityRole="alert" color="$red10">Enter valid JSON before saving.</T.Text>) : null}
          <T.TextArea
            value={reason}
            disabled={busy}
            accessibilityLabel="Reason for change"
            onChangeText={set_reason}
            placeholder="Reason for this change"/>
          {stale ? (
            <T.YStack gap="$2">
              <T.Text accessibilityRole="alert">
                This section changed. Your draft is retained. Reloading discards it and adopts the latest revision.
              </T.Text>
              <T.Button disabled={busy} onPress={reload}>Discard draft and reload latest</T.Button>
            </T.YStack>) : null}
          <T.XStack gap="$2" flexWrap="wrap">
            <T.Button
              disabled={disabled || !valid || !draft["dirty"]}
              onPress={function (){
                  mutate("update-global");
                }}>Save
            </T.Button>
            <T.Button
              disabled={disabled}
              onPress={function (){
                  mutate("reset-global");
                }}>Reset to default
            </T.Button>
            {(base["key"] == "compute") ? (
              <T.Button
                disabled={disabled || !valid}
                onPress={function (){
                    mutate("publish-compute");
                  }}>Publish compute
              </T.Button>) : null}
            <T.Button
              disabled={busy}
              onPress={function (){
                  draft.discard();
                  set_conflict(false);
                }}>Discard changes
            </T.Button>
          </T.XStack>
        </T.YStack>) : (
        <T.Text>No registered Global sections found.</T.Text>)}
      {error ? (
        <T.Text accessibilityRole="alert">{error}</T.Text>) : null}
    </T.YStack>);
}

// statstrade-superadmin.a03.s03.global-sitevar/A03S03GlobalSiteVar [82] 
export function A03S03GlobalSiteVar({context,actor_id}){
  let owner = page.useGroupPage(global.Group,"global/configuration",actor_id);
  return (owner["status"] == "ready") ? (
    <GlobalEditor
      key={owner["handle"]["spec"]["group_id"]}
      owner={owner}
      actor_id={actor_id}/>) : (
    <editor.PageStatus page={owner}/>);
}