import * as contract from '@statstrade/feature/newsroom/handoff-contract.js'

import React from 'react'

import * as T from 'tamagui'

import * as editor from '@statstrade/web-superadmin/adminweb/group-editor.jsx'

import * as newsroom from '@statstrade/web-superadmin/groups/a05/s01/t01-newsroom.jsx'

import * as article from '@statstrade/feature/newsroom/article.jsx'

import * as page from '@statstrade/web-superadmin/lib/substrate-page.jsx'

// statstrade-superadmin.adminweb.newsroom/ImportDesk [12] 
export function ImportDesk({owner,actor_id}){
  let snapshot = page.useGroupModel(owner["handle"],"snapshot");
  let submissions = snapshot["submissions"] || [];
  let [bundle,set_bundle] = React.useState(null);
  let [error,set_error] = React.useState(null);
  let [notice,set_notice] = React.useState(null);
  let [organization,set_organization] = React.useState("");
  let [desk_id,set_desk] = React.useState("");
  let [confirmed,set_confirmed] = React.useState(false);
  let [selected_id,set_selected] = React.useState(null);
  let [reason,set_reason] = React.useState("");
  let control = owner["controller"];
  let busy = owner["busy"];
  let desks = (snapshot["desks"] || []).filter(function (d){
    return d["organization_id"] == organization;
  });
  let desk = desks.find(function (d){
    return d["id"] == desk_id;
  });
  let edition = (snapshot["editions"] || []).find(function (e){
    return e["id"] == (desk || {})["edition_id"];
  });
  let selected = submissions.find(function (s){
    return s["id"] == selected_id;
  }) || submissions[0];
  let publication = (snapshot["publications"] || []).find(function (p){
    return p["submission_id"] == (selected || {})["id"];
  });
  let read_file = async function (event){
    set_bundle(null);
    set_error(null);
    set_notice(null);
    set_confirmed(false);
    let file = event["target"]["files"][0];
    if(file){
      try{
        if(file["size"] > contract["MAX_HANDOFF_BYTES"]){
          throw new Error("File exceeds 1 MB.");
        }
        set_bundle(contract.validateHandoff(JSON.parse(await file.text())));
      }
      catch(e){
        set_error(e["message"] || "Invalid handoff file.");
      }
    }
  };
  let import_bundle = async function (){
    if(bundle && desk && confirmed){
      await control.save("import",[actor_id,organization,desk_id,desk["edition_id"],bundle],"snapshot",function (result){
        set_selected(result["submission"]["id"]);
        set_notice(
          result["duplicate"] ? "This revision is already imported; no duplicate was created." : "Imported for separate StatsTrade review."
        );
      });
    }
  };
  let review = async function (action){
    if(selected && (reason.trim().length > 0)){
      let result = await control.save("review",[actor_id,selected["id"],action,reason],"snapshot");
      if(control["active"] && result["refreshed"]){
        set_reason("");
      }
    }
  };
  return (
    <T.YStack gap="$3" padding="$4">
      <T.Text fontSize="$6" fontWeight="700">Newsroom imports</T.Text>
      <T.Text>
        Import a selected collector revision, review it here, then explicitly publish its article. Prediction questions remain drafts.
      </T.Text>
      <editor.PageMessages page={owner}/>
      {error ? (
        <T.Text color="$red10" accessibilityRole="alert">{error}</T.Text>) : null}
      {notice ? (
        <T.Text accessibilityLiveRegion="polite">{notice}</T.Text>) : null}
      <input
        type="file"
        accept=".json,application/json"
        disabled={busy}
        aria-label="Newsroom handoff file"
        onChange={read_file}/>
      {bundle ? (
        <T.YStack
          gap="$2"
          padding="$3"
          borderWidth={1}
          borderColor="$borderColor">
          <T.Text fontWeight="600">{bundle["article"]["headline"]}</T.Text>
          <T.Text>
            {"Source " + bundle["source_instance"] + " / " + bundle["story_id"] + " / " + bundle["revision_id"]}
          </T.Text>
          <T.Text>
            Source identifiers describe provenance; they do not grant organization access or approval.
          </T.Text>
          <label>
            Target organization 
            <select
              value={organization}
              disabled={busy}
              aria-label="Target organization"
              onChange={function (e){
                  set_organization(e["target"]["value"]);
                  set_desk("");
                  set_confirmed(false);
                }}>
              <option value="">Choose organization</option>
              {(snapshot["organizations"] || []).map(function (o){
                return (
                  <option key={o["id"]} value={o["id"]}>{o["title"]}</option>);
              })}
            </select>
          </label>
          <label>
            Target desk 
            <select
              value={desk_id}
              disabled={busy}
              aria-label="Target desk"
              onChange={function (e){
                  set_desk(e["target"]["value"]);
                  set_confirmed(false);
                }}>
              <option value="">Choose desk</option>
              {desks.map(function (d){
                return (
                  <option key={d["id"]} value={d["id"]}>{d["label"]}</option>);
              })}
            </select>
          </label>
          <T.Text>
            {"Edition: " + ((edition || {})["label"] || "Select a desk")}
          </T.Text>
          <label>
            <input
              type="checkbox"
              checked={confirmed}
              disabled={busy}
              onChange={function (e){
                  set_confirmed(e["target"]["checked"]);
                }}/>
             I confirm this organization, desk and edition
          </label>
          <T.Text>
            {bundle["sources"].length + " sources · " + bundle["citations"].length + " citations"}
          </T.Text>
          <details>
            <summary>Preview article and prediction proposal</summary>
            <article.Article
              article={Object.assign({},bundle["article"],{"sources":bundle["sources"]})}/>
            <pre style={{"whiteSpace":"pre-wrap"}}>{JSON.stringify(bundle["prediction"],null,2)}</pre>
          </details>
          <T.Button
            disabled={busy || owner["needs-refresh"] || !desk || !confirmed}
            onPress={import_bundle}>Import for review
          </T.Button>
        </T.YStack>) : null}
      <T.Button
        disabled={busy}
        onPress={function (){
            control.refresh("snapshot");
          }}>Refresh inbox
      </T.Button>
      <T.XStack gap="$3" flexWrap="wrap">
        <T.YStack gap="$2" minWidth={240} flex={1}>
          {submissions.map(function (s){
            return (
              <T.Button
                key={s["id"]}
                disabled={busy}
                onPress={function (){
                    set_selected(s["id"]);
                    set_reason("");
                  }}>{s["status"] + " · " + s["bundle"]["article"]["headline"]}
              </T.Button>);
          })}
          {(submissions.length == 0) ? (
            <T.Text>No imported submissions.</T.Text>) : null}
        </T.YStack>
        {selected ? (
          <T.YStack gap="$2" minWidth={300} flex={2}>
            <T.Text fontWeight="600">{selected["bundle"]["article"]["headline"]}</T.Text>
            <T.Text>
              {"Status: " + selected["status"] + " · revision " + selected["source_revision"]}
            </T.Text>
            <details>
              <summary>Review article, evidence and draft question</summary>
              <article.Article
                article={Object.assign(
                    {},
                    selected["bundle"]["article"],
                    {"sources":selected["bundle"]["sources"]}
                  )}/>
              <pre style={{"whiteSpace":"pre-wrap"}}>{JSON.stringify(selected["bundle"],null,2)}</pre>
            </details>
            <T.TextArea
              value={reason}
              disabled={busy}
              accessibilityLabel="Newsroom decision reason"
              placeholder="Reason for this decision"
              onChangeText={set_reason}/>
            <T.XStack gap="$2" flexWrap="wrap">
              {((selected["status"] == "pending") ? ["approve","reject"] : ((selected["status"] == "approved") ? ((publication || {})["published"] ? ["withdraw"] : ["publish"]) : [])).map(function (action){
                return (
                  <T.Button
                    key={action}
                    disabled={busy || owner["needs-refresh"] || (reason.trim().length == 0)}
                    onPress={function (){
                        review(action);
                      }}>{action}
                  </T.Button>);
              })}
            </T.XStack>
            {(publication || {})["published"] ? (
              <p>Public article: /newsroom/{publication["id"]}</p>) : null}
          </T.YStack>) : null}
      </T.XStack>
    </T.YStack>);
}

// statstrade-superadmin.adminweb.newsroom/NewsroomContent [100] 
export function NewsroomContent({actor_id}){
  let owner = page.useGroupPage(newsroom.Group,"newsroom/imports",actor_id);
  return (owner["status"] == "ready") ? (
    <ImportDesk
      key={owner["handle"]["spec"]["group_id"]}
      owner={owner}
      actor_id={actor_id}/>) : (
    <editor.PageStatus page={owner}/>);
}