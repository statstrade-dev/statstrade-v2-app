import React from 'react'

import * as spending from '@statstrade/feature/reputation/spending-settings.jsx'

import * as page_api from '@statstrade/edge/substrate/page-api.jsx'

import * as reputation from '@statstrade/feature/reputation/screen.jsx'

// statstrade-web.feature.manage.page-workspace/BodyFields [9] 
export var BodyFields = {
  "campaigns":[
    "title",
    "description",
    "code",
    "token_id",
    "playable_id",
    "time_start",
    "time_end"
  ],
  "markets":[
    "campaign_id",
    "title",
    "description",
    "format",
    "outcomes",
    "token_id",
    "playable_id",
    "time_open",
    "time_close",
    "rules"
  ],
  "tokens":["name","title","symbol","type","decimal"],
  "settings":["title","description","website"],
  "billing":["currency","financial_role"],
  "reputation-budgets":["limit","status","starts_at","ends_at"],
  "reputation":["limit","status","starts_at","ends_at"]
};

// statstrade-web.feature.manage.page-workspace/PageTitles [16] 
export var PageTitles = {
  "dashboard":"Overview",
  "settings":"Settings",
  "campaigns":"Campaigns",
  "billing":"Billing",
  "invites":"Team & invitations",
  "reputation-budgets":"Reward budgets",
  "markets":"Prediction questions",
  "analytics":"Analytics",
  "tokens":"Points & playables"
};

// statstrade-web.feature.manage.page-workspace/label [17] 
export function label(value){
  return value.replace(new RegExp("[_-]","g")," ").replace(new RegExp("^org ",""),"Brand ");
}

// statstrade-web.feature.manage.page-workspace/cell [19] 
export function cell(value){
  if(null == value){
    return "—";
  }
  if(Array.isArray(value) && value.every(function (entry){
    return !((typeof entry) == "object");
  })){
    return value.join(", ");
  }
  if((typeof value) == "object"){
    return "Configured";
  }
  return String(value);
}

// statstrade-web.feature.manage.page-workspace/Records [24] 
export function Records({name,rows}){
  let columns = Object.keys(rows[0] || {}).filter(function (k){
    return !k.endsWith("_id") && ![
      "id",
      "detail",
      "picture",
      "icon",
      "class_table",
      "class_context",
      "op_created",
      "op_updated"
    ].includes(k);
  });
  columns = columns.slice(0,6);
  return (
    <section className="card section">
      <h2>{label(name)}</h2>
      {(rows.length == 0) ? (
        <p className="muted">No records.</p>) : (
        <div style={{"overflowX":"auto"}}>
          <table style={{"width":"100%","borderCollapse":"collapse"}}>
            <thead>
              <tr>
                {columns.map(function (k){
                  return (
                    <th key={k} style={{"textAlign":"left","padding":10}}>{label(k)}</th>);
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map(function (row,index){
                return (
                  <tr key={(row.id || index) + ":" + (row.class_table || "")}>
                    {columns.map(function (k){
                      return (
                        <td key={k} style={{"padding":10,"borderTop":"1px solid #eee"}}>
                          {((name == "topics") && (k == "title")) ? (
                            <a href={"/questions/" + row.id}>{row.title}</a>) : cell(row[k])}
                        </td>);
                    })}
                  </tr>);
              })}
            </tbody>
          </table>
        </div>)}
    </section>);
}

// statstrade-web.feature.manage.page-workspace/ActionForm [33] 
export function ActionForm({name,action,api,pageKey,onClose}){
  let [values,setValues] = React.useState(Object.assign(
    {"idempotency_key":crypto.randomUUID()},
    action.defaults || {}
  ));
  let [body,setBody] = React.useState({});
  let [error,setError] = React.useState(null);
  let [busy,setBusy] = React.useState(false);
  let [issuedKey,setIssuedKey] = React.useState(null);
  function change(setter,object,key,value){
    let next = Object.assign({},object);
    next[key] = value;
    setter(next);
  }
  let fields = action.rpc.input.map(function (arg){
    return arg.symbol || arg.name;
  });
  let options = {
    "campaign_id":api.data.campaigns,
    "topic_id":api.data.topics,
    "token_id":api.data.tokens,
    "playable_id":api.data.configs,
    "budget_id":api.data.budgets,
    "user_id":api.data.members
  };
  function field(key,object,setter){
    let choices = options[key];
    if((key == "member_id") && (name == "remove-member")){
      choices = api.data.members;
    }
    if(key == "winner_names"){
      let topic = (api.data.topics || []).find(function (t){
        return t.id == values.topic_id;
      });
      choices = (topic && topic.outcomes);
    }
    if(key == "key_lookup"){
      choices = (api.data.api_keys || []).map(function (row){
        return {
          "id":row.lookup_string,
          "title":row.label || row.lookup_string
        };
      });
    }
    if(["status","type","format","level"].includes(key)){
      let names = (key == "type") ? ["points","reputation","timebound"] : ((key == "format") ? ["binary","multiple"] : ((key == "level") ? ["member","admin","owner"] : ["draft","active","paused","closed"]));
      choices = names.map(function (name){
        return {"id":name,"title":name};
      });
    }
    let value = object[key] || "";
    let isDate = [
      "time_start",
      "time_end",
      "time_open",
      "time_close",
      "starts_at",
      "ends_at"
    ].includes(key);
    let isBool = [
      "is_transferable",
      "is_discoverable",
      "allow_followers",
      "show_activity",
      "allow_sharing"
    ].includes(key);
    return (
      <div key={key}>
        <label htmlFor={"action-" + key}>{label(key)}</label>
        {isBool ? (
          <input
            id={"action-" + key}
            type="checkbox"
            checked={true == object[key]}
            onChange={function (e){
                change(setter,object,key,e.target.checked);
              }}/>) : (isDate ? (
          <input
            id={"action-" + key}
            type="datetime-local"
            value={value}
            onChange={function (e){
                change(setter,object,key,e.target.value);
              }}/>) : ((key == "scopes") ? (
          <select
            id={"action-" + key}
            multiple={true}
            value={object[key] || []}
            onChange={function (e){
                change(setter,object,key,Array.from(e.target.selectedOptions).map(function (option){
                  return option.value;
                }));
              }}>
            <option value="task:read">Read tasks</option>
            <option value="task:evidence:write">Submit task evidence</option>
          </select>) : ((key == "winner_names") ? (
          <select
            id={"action-" + key}
            multiple={true}
            value={object[key] || []}
            onChange={function (e){
                change(setter,object,key,Array.from(e.target.selectedOptions).map(function (option){
                  return option.value;
                }));
              }}>
            {(choices || []).map(function (row){
              return (
                <option key={row.id} value={row.id}>{row.title}</option>);
            })}
          </select>) : ((choices && (choices.length > 0)) ? (
          <select
            id={"action-" + key}
            value={value}
            onChange={function (e){
                change(setter,object,key,e.target.value);
              }}>
            <option value="">Select…</option>
            {choices.map(function (row,index){
              let id = (key == "playable_id") ? row.playable_id : row.id;
              return (
                <option key={id + ":" + index} value={id}>
                  {row.title || row.name || row.handle || row.email || (row.display && (row.display.label || row.display.title)) || id}
                </option>);
            })}
          </select>) : (["outcomes","rules","description"].includes(key) ? (
          <textarea
            id={"action-" + key}
            value={value}
            placeholder="One outcome per line for a multiple-outcome question"
            onChange={function (e){
                change(setter,object,key,e.target.value);
              }}/>) : (
          <input
            id={"action-" + key}
            value={value}
            type={[
                "amount",
                "limit",
                "decimal",
                "time_start",
                "time_end",
                "time_open",
                "time_close"
              ].includes(key) ? "number" : "text"}
            onChange={function (e){
                change(setter,object,key,e.target.value);
              }}/>))))))}
      </div>);
  }
  function submit(){
    setError(null);
    setBusy(true);
    let clean = Object.assign({},body);
    [
      "time_start",
      "time_end",
      "time_open",
      "time_close",
      "starts_at",
      "ends_at"
    ].forEach(function (key){
      if(clean[key]){
        clean[key] = new Date(clean[key]).getTime();
      }
    });
    let input = Object.assign({},values,{"m":clean});
    if(name == "configure-playable"){
      input.m = {
        "status":body.status,
        "is_transferable":true == body.is_transferable,
        "earn_limits":body.maximum ? {
                "maximum":Number(body.maximum),
                "period":body.period || "weekly"
              } : {},
        "display":{"title":body.title}
      };
    }
    if(fields.includes("detail")){
      input.detail = {"reason":values.reason};
    }
    if(pageKey == "markets"){
      if(body.format == "multiple"){
        let outcomes = (body.outcomes || "").split("\n").map(function (title,index){
          return {"name":"outcome-" + (index + 1),"title":title.trim()};
        }).filter(function (outcome){
          return outcome.title;
        });
        input.m.detail = {"prospects":outcomes};
      }
    }
    if(name == "save-token"){
      input.m = Object.assign({"type":"points","decimal":0},clean);
    }
    api.mutations[page_api.keyName(name)].mutateAsync(input).then(function (result){
      (result.data && result.data.o_key) ? setIssuedKey(result.data.o_key) : onClose();
    }).catch(function (e){
      setError(e.message);
    }).finally(function (){
      setBusy(false);
    });
  }
  return (
    <section className="card section" aria-label="Action form">
      <h2>{label(name)}</h2>
      {issuedKey ? (
        <div className="notice">
          <p>Copy this API key now. It will not be shown again.</p>
          <code style={{"overflowWrap":"anywhere"}}>{issuedKey}</code>
          <reputation.Button onPress={onClose}>Close key receipt</reputation.Button>
        </div>) : null}
      <div className="grid two">
        {fields.filter(function (key){
          return !["org_id","m","detail","idempotency_key","policy"].includes(key);
        }).map(function (key){
          return field(key,values,setValues);
        })}
        {fields.includes("m") ? ((name == "configure-playable") ? ["title","status","is_transferable","maximum","period"] : ((name == "settings-update") ? [
          "timezone",
          "is_discoverable",
          "allow_followers",
          "show_activity",
          "allow_sharing",
          "call_to_action"
        ] : (BodyFields[pageKey] || ["title","description"]))).map(function (key){
          return field(key,body,setBody);
        }) : null}
        {fields.includes("detail") ? field("reason",values,setValues) : null}
      </div>
      {error ? (
        <p role="alert" className="error">{error}</p>) : null}
      <div className="row section">
        <reputation.Button disabled={busy || issuedKey} onPress={submit}>{busy ? "Saving…" : "Save changes"}</reputation.Button>
        <reputation.Button secondary={true} disabled={busy} onPress={onClose}>Cancel</reputation.Button>
      </div>
    </section>);
}

// statstrade-web.feature.manage.page-workspace/PageContent [104] 
export function PageContent({pageKey}){
  let api = page_api.usePageApi(pageKey);
  let [actionError,setActionError] = React.useState(null);
  let [editing,setEditing] = React.useState(null);
  let context = React.useContext(page_api.PageContext);
  let definition = context.groups[pageKey];
  return (
    <section className="rep">
      <style>{reputation.styles}</style>
      <div className="row between">
        <div>
          <p className="eyebrow">Organisation workspace</p>
          <h1>{PageTitles[pageKey] || label(pageKey)}</h1>
        </div>
        <reputation.Button
          secondary={true}
          disabled={!(api.owner.status == "ready")}
          onPress={function (){
              api.owner.controller.refresh("snapshot");
            }}>Refresh
        </reputation.Button>
      </div>
      {!context.brand ? (
        <p className="notice">Select a brand using the brand selector.</p>) : null}
      {(context.brand && (api.owner.status == "loading")) ? (
        <p role="status">Loading page data…</p>) : null}
      {(api.error || actionError) ? (
        <p className="error" role="alert">{api.error || actionError}</p>) : null}
      {api.owner.notice ? (
        <p className="notice" role="status">{api.owner.notice}</p>) : null}
      {api.data.metrics ? (
        <div className="grid section">
          {Object.entries(api.data.metrics).map(function ([key,value]){
            return (
              <div className="card" key={key}>
                <small>{label(key)}</small>
                <div className="amount">{cell(value)}</div>
              </div>);
          })}
        </div>) : null}
      <div className="row section">
        {Object.keys(definition.actions).map(function (name){
          return (
            <reputation.Button
              key={name}
              disabled={!(api.owner.status == "ready") || api.busy}
              onPress={function (){
                  setActionError(null);
                  if(definition.actions[name]["transport"] == "http"){
                    api.mutations[page_api.keyName(name)].mutateAsync({}).then(function (result){
                      let target = new URL(result.data.url);
                      if(!(target.protocol == "https:") || !["billing.stripe.com","checkout.stripe.com"].includes(target.hostname)){
                        throw new Error("Invalid provider redirect.");
                      }
                      window.location.assign(target.href);
                    }).catch(function (e){
                      setActionError(e.message);
                    });
                  }
                  else{
                    setEditing(name);
                  }
                }}>{label(name)}
            </reputation.Button>);
        })}
      </div>
      {editing ? (
        <ActionForm
          key={editing}
          name={editing}
          action={definition.actions[editing]}
          api={api}
          pageKey={pageKey}
          onClose={function (){
              setEditing(null);
            }}/>) : null}
      {(pageKey == "settings") ? (
        <spending.SpendingSettings/>) : null}
      {(definition.outputs || []).map(function (key){
        let rows = api.data[key];
        return rows ? (
          <Records
            key={key}
            name={key}
            rows={Array.isArray(rows) ? rows : [rows]}/>) : null;
      })}
      <div className="row section">
        <reputation.Button
          secondary={true}
          disabled={!context.brand || (api.owner.status == "loading")}
          onPress={function (){
              api.setInput({
                "offset":Math.max(
                      0,
                      ((api.data.pagination && api.data.pagination.offset) || 0) - 50
                    )
              });
            }}>Previous
        </reputation.Button>
        <reputation.Button
          secondary={true}
          disabled={!context.brand || (api.owner.status == "loading")}
          onPress={function (){
              api.setInput({
                "offset":((api.data.pagination && api.data.pagination.offset) || 0) + 50
              });
            }}>Next
        </reputation.Button>
      </div>
    </section>);
}

// statstrade-web.feature.manage.page-workspace/ManagementPage [137] 
export function ManagementPage({pageKey}){
  return (
    <PageContent pageKey={pageKey}/>);
}