import React from 'react'

import * as T from 'tamagui'

import * as editor from '@statstrade/web-superadmin/adminweb/group-editor.jsx'

import * as users from '@statstrade/web-superadmin/groups/a01/s02-users.jsx'

import * as organisations from '@statstrade/web-superadmin/groups/a02/s02-organisations.jsx'

import * as page from '@statstrade/web-superadmin/lib/substrate-page.jsx'

// statstrade-superadmin.adminweb.directories/UserFields [13] 
export var UserFields = ["first_name","last_name"];

// statstrade-superadmin.adminweb.directories/OrgFields [14] 
export var OrgFields = ["title","description"];

// statstrade-superadmin.adminweb.directories/DirectoryBody [16] 
export function DirectoryBody({owner,actor_id,kind}){
  let model_id = (kind == "users") ? "users" : "organisations";
  let fields = (kind == "users") ? UserFields : OrgFields;
  let rows = page.useGroupModel(owner["handle"],model_id);
  let draft = editor.useRecordEditor(rows,"id",fields);
  let [query,set_query] = React.useState("");
  let visible = editor.searchRows(
    rows,
    query,
    (kind == "users") ? ["id","handle","first_name","last_name"] : ["id","name","title"]
  );
  let control = owner["controller"];
  let row = draft["row"];
  let busy = owner["busy"];
  let refresh = async function (){
    let saved = owner["needs-refresh"];
    if(await control.refresh(model_id) && saved && control["active"]){
      draft.accept();
    }
  };
  let save = async function (){
    let result = await control.save(
      (kind == "users") ? "update-user" : "update-org",
      [actor_id,draft["base"]["id"],draft["patch"]],
      model_id
    );
    if(control["active"] && result["refreshed"]){
      draft.accept();
    }
  };
  return (
    <T.YStack gap="$3" padding="$4" flex={1}>
      <T.Text fontSize="$6" fontWeight="600">{(kind == "users") ? "Users" : "Organisations"}</T.Text>
      <T.XStack gap="$2" alignItems="center">
        <T.Input
          value={query}
          onChangeText={set_query}
          placeholder="Search loaded records"
          accessibilityLabel="Search directory"
          flex={1}/>
        <T.Button disabled={busy} onPress={refresh}>{busy ? "Working…" : "Refresh"}</T.Button>
      </T.XStack>
      <T.Text color="$color10">{visible.length + " of " + rows.length + " loaded records"}</T.Text>
      <editor.PageMessages page={owner}/>
      <editor.SelectionPrompt editor={draft}/>
      <T.XStack gap="$4" flexWrap="wrap" alignItems="flex-start">
        <T.YStack gap="$2" minWidth={260} flex={1}>
          {visible.map(function (item){
            return (
              <T.Button
                key={item["id"]}
                disabled={busy}
                ariaPressed={item["id"] == draft["selected"]}
                onPress={function (){
                    draft.choose(item["id"]);
                  }}>
                {item["handle"] || item["title"] || item["name"] || item["id"]}
              </T.Button>);
          })}
          {(visible.length == 0) ? (
            <T.Text>
              {(rows.length == 0) ? "No records found." : "No matching records."}
            </T.Text>) : null}
        </T.YStack>
        <T.YStack gap="$3" minWidth={280} flex={2}>
          {draft["base"] ? (
            <T.YStack gap="$3">
              <T.Text fontWeight="600">{draft["base"]["handle"] || draft["base"]["name"]}</T.Text>
              <T.Text fontFamily="monospace">{draft["base"]["id"]}</T.Text>
              <T.Text>
                {(kind == "users") ? (((row || {})["type"] || "") + " · " + ((row || {})["is_active"] ? "Active" : "Inactive")) : ((row || {})["is_archived"] ? "Archived" : "Active")}
              </T.Text>
              {!row ? (
                <T.Text accessibilityRole="alert">
                  This record is no longer available. Your draft has been retained.
                </T.Text>) : null}
              {fields.map(function (field){
                return (
                  <T.YStack key={field} gap="$1">
                    <T.Text>{field.replaceAll("_"," ")}</T.Text>
                    <T.Input
                      value={draft["values"][field] || ""}
                      disabled={busy}
                      accessibilityLabel={field.replaceAll("_"," ")}
                      onChangeText={function (value){
                          draft.set(field,value);
                        }}/>
                  </T.YStack>);
              })}
              <T.XStack gap="$2">
                <T.Button
                  disabled={busy || !row || !draft["dirty"] || owner["needs-refresh"]}
                  onPress={save}>Save changes
                </T.Button>
                <T.Button disabled={busy} onPress={draft["discard"]}>Discard changes</T.Button>
              </T.XStack>
            </T.YStack>) : (
            <T.Text>Select a record to view and edit its profile.</T.Text>)}
        </T.YStack>
      </T.XStack>
    </T.YStack>);
}

// statstrade-superadmin.adminweb.directories/UsersContent [69] 
export function UsersContent({actor_id}){
  let owner = page.useGroupPage(users.Group,"directory/users",actor_id);
  return (owner["status"] == "ready") ? (
    <DirectoryBody
      key={owner["handle"]["spec"]["group_id"]}
      owner={owner}
      actor_id={actor_id}
      kind="users"/>) : (
    <editor.PageStatus page={owner}/>);
}

// statstrade-superadmin.adminweb.directories/OrganisationsContent [75] 
export function OrganisationsContent({actor_id}){
  let owner = page.useGroupPage(organisations.Group,"directory/organisations",actor_id);
  return (owner["status"] == "ready") ? (
    <DirectoryBody
      key={owner["handle"]["spec"]["group_id"]}
      owner={owner}
      actor_id={actor_id}
      kind="organisations"/>) : (
    <editor.PageStatus page={owner}/>);
}