import React from 'react'

import * as civic from '@statstrade/feature/civic/pages.jsx'

import * as page_api from '@statstrade/edge/substrate/page-api.jsx'

// statstrade-web.feature.civic.editorial/IssueEditor [3] 
export function IssueEditor({api,row,onDone}){
  let [values,setValues] = React.useState({
    "questions":row.questions || [],
    "perspectives":row.perspectives || [],
    "sources":(row.sources || []).map(function (s){
        return s.url;
      }).join("\n"),
    "regions":row.regions || ["national"],
    "title":row.title,
    "summary":row.summary || "",
    "priority":row.priority || 100,
    "status":row.status || "draft",
    "uncertainty":row.uncertainty || "",
    "subjects":(row.subjects || []).join(", "),
    "publication_ids":row.publication_ids || [],
    "importance":row.importance || ""
  });
  let [error,setError] = React.useState(null);
  function field(key,value){
    setValues(function (old){
      let next = Object.assign({},old);
      next[key] = value;
      return next;
    });
  }
  function toggle(key,id,checked){
    let list = values[key] || [];
    field(key,checked ? list.concat([id]) : list.filter(function (v){
      return !(id == v);
    }));
  }
  function perspective(index,key,value){
    let list = values.perspectives.map(function (item,i){
      let copy = Object.assign({},item);
      if(i == index){
        copy[key] = value;
      }
      return copy;
    });
    field("perspectives",list);
  }
  function linkQuestion(id,checked){
    let list = values.questions.filter(function (item){
      return !(item.id == id);
    });
    field(
      "questions",
      checked ? list.concat([{"id":id,"primary":false}]) : list
    );
  }
  function primaryQuestion(id,checked){
    field("questions",values.questions.map(function (item){
      return (item.id == id) ? Object.assign({},item,{"primary":checked}) : item;
    }));
  }
  function questionRegions(id,regions){
    field("questions",values.questions.map(function (item){
      return (item.id == id) ? Object.assign({},item,{"regions":regions}) : item;
    }));
  }
  return (
    <form
      className="st-civic-form"
      onSubmit={function (event){
          event.preventDefault();
          setError(null);
          let m = Object.assign({},values,{
            "expected_revision":row.revision,
            "priority":Number(values.priority),
            "subjects":values.subjects.split(",").map(function (s){
                      return s.trim();
                    }).filter(function (s){
                      return s;
                    }),
            "sources":values.sources.split("\n").map(function (s){
                      let url = s.trim();
                      return (row.sources || []).find(function (old){
                        return old.url == url;
                      }) || {"url":url};
                    }).filter(function (s){
                      return s.url;
                    })
          });
          api.mutations.save_issue.mutateAsync({"campaign_id":row.id,"m":m}).then(onDone).catch(function (e){
            setError(e.message);
          });
        }}>
      <h2>{"Edit issue: " + row.title}</h2>
      <label>
        Issue title
        <input
          required={true}
          maxLength={300}
          value={values.title}
          onChange={function (e){
              field("title",e.target.value);
            }}/>
      </label>
      {[
        {"key":"summary","label":"What’s happening"},
        {"key":"importance","label":"Why it matters"},
        {"key":"uncertainty","label":"What remains uncertain"}
      ].map(function (f){
        return (
          <label key={f.key}>
            {f.label}
            <textarea
              aria-label={f.label}
              required={true}
              maxLength={5000}
              value={values[f.key]}
              onChange={function (e){
                  field(f.key,e.target.value);
                }}/>
          </label>);
      })}
      <label>
        Subjects (separated by commas)
        <input
          value={values.subjects}
          onChange={function (e){
              field("subjects",e.target.value);
            }}/>
      </label>
      <fieldset>
        <legend>Coverage regions</legend>
        <div className="st-civic-checkboxes">
          {civic.Regions.map(function (region){
            return (
              <label key={region.id}>
                <input
                  type="checkbox"
                  checked={values.regions.includes(region.id)}
                  onChange={function (e){
                      toggle("regions",region.id,e.target.checked);
                    }}/>
                {region.title}
              </label>);
          })}
        </div>
      </fieldset>
      <label>
        Briefing sources (one URL per line)
        <textarea
          value={values.sources}
          onChange={function (e){
              field("sources",e.target.value);
            }}/>
      </label>
      <fieldset>
        <legend>Selected perspectives</legend>
        {values.perspectives.map(function (voice,index){
          return (
            <section className="st-civic-editor-perspective" key={index}>
              <label>
                Attribution
                <input
                  required={true}
                  value={voice.attribution}
                  onChange={function (e){
                      perspective(index,"attribution",e.target.value);
                    }}/>
              </label>
              <label>
                Perspective
                <textarea
                  required={true}
                  value={voice.argument}
                  onChange={function (e){
                      perspective(index,"argument",e.target.value);
                    }}/>
              </label>
              <label>
                Original source
                <input
                  type="url"
                  required={true}
                  value={voice.url}
                  onChange={function (e){
                      perspective(index,"url",e.target.value);
                    }}/>
              </label>
              <button
                type="button"
                className="st-secondary-button"
                onClick={function (){
                    field("perspectives",values.perspectives.filter(function (item,i){
                      return !(i == index);
                    }));
                  }}>Remove perspective
              </button>
            </section>);
        })}
        <button
          type="button"
          className="st-secondary-button"
          onClick={function (){
              field(
                "perspectives",
                values.perspectives.concat([{"attribution":"","argument":"","url":""}])
              );
            }}>Add perspective
        </button>
      </fieldset>
      <fieldset>
        <legend>Related forecasts</legend>
        {(api.data.questions || []).map(function (q){
          let linked = values.questions.find(function (item){
            return item.id == q.id;
          });
          return (
            <div className="st-civic-editor-question" key={q.id}>
              <label>
                <input
                  type="checkbox"
                  checked={Boolean(linked)}
                  onChange={function (e){
                      linkQuestion(q.id,e.target.checked);
                    }}/>
                {q.title}
              </label>
              {linked ? (
                <label>
                  <input
                    type="checkbox"
                    checked={linked.primary}
                    onChange={function (e){
                        primaryQuestion(q.id,e.target.checked);
                      }}/>
                  Primary issue for this forecast
                </label>) : null}
              {linked ? (
                <label>
                  Forecast regions (empty inherits issue coverage)
                  <select
                    aria-label={"Forecast regions for " + q.title}
                    multiple={true}
                    value={linked.regions || []}
                    onChange={function (e){
                        questionRegions(q.id,Array.from(e.target.selectedOptions).map(function (option){
                          return option.value;
                        }));
                      }}>
                    {civic.Regions.map(function (region){
                      return (
                        <option key={region.id} value={region.id}>{region.title}</option>);
                    })}
                  </select>
                </label>) : null}
            </div>);
        })}
      </fieldset>
      <fieldset>
        <legend>Published reporting</legend>
        {(api.data.articles || []).map(function (article){
          return (
            <label key={article.id}>
              <input
                type="checkbox"
                checked={values.publication_ids.includes(article.id)}
                onChange={function (e){
                    toggle("publication_ids",article.id,e.target.checked);
                  }}/>
              {article.headline}
            </label>);
        })}
      </fieldset>
      <div className="st-civic-filter-grid">
        <label>
          Publication status
          <select
            aria-label="Publication status"
            value={values.status}
            onChange={function (e){
                field("status",e.target.value);
              }}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </label>
        <label>
          Editorial order (lower appears first)
          <input
            type="number"
            value={values.priority}
            onChange={function (e){
                field("priority",e.target.value);
              }}/>
        </label>
      </div>
      {error ? (
        <p role="alert">{error}</p>) : null}
      <div className="st-cluster">
        <button className="st-primary-button" disabled={api.busy}>Save issue</button>
        <button
          type="button"
          className="st-secondary-button"
          onClick={onDone}>Cancel
        </button>
      </div>
    </form>);
}

// statstrade-web.feature.civic.editorial/ReviewCard [51] 
export function ReviewCard({entry,api,report,published}){
  let [note,setNote] = React.useState("");
  let [error,setError] = React.useState(null);
  function review(decision){
    api.mutations.review_reasoning.mutateAsync({
      "m":{
            "id":entry.id,
            "revision_id":entry.revision_id,
            "report_id":entry.report_id,
            "decision":decision,
            "note":note
          }
    }).catch(function (e){
      setError(e.message);
    });
  }
  return (
    <article className="st-civic-reasoning">
      <p className="st-kicker">
        {report ? "Reported contribution" : (published ? "Published reasoning" : "Pending review")}
      </p>
      {entry.handle ? (
        <h3>{entry.handle}</h3>) : null}
      {entry.reason ? (
        <p><strong>Report: </strong>{entry.reason}</p>) : null}
      <p>{entry.content.argument}</p>
      <p>
        <strong>What this changes: </strong>
        {entry.content.implication}
      </p>
      <civic.Sources rows={entry.content.sources}/>
      {entry.parent_id ? (
        <p>Response to an approved contribution</p>) : null}
      <label>
        Review note
        <textarea
          value={note}
          maxLength={2000}
          onChange={function (e){
              setNote(e.target.value);
            }}/>
      </label>
      {error ? (
        <p role="alert">{error}</p>) : null}
      <div className="st-cluster">
        {(report || published) ? null : (
          <React.Fragment>
            <button
              className="st-primary-button"
              disabled={api.busy}
              onClick={function (){
                  review("approve");
                }}>Approve
            </button>
            <button
              className="st-secondary-button"
              disabled={api.busy}
              onClick={function (){
                  review("reject");
                }}>Reject
            </button>
          </React.Fragment>)}
        {report ? (
          <button
            className="st-secondary-button"
            disabled={api.busy}
            onClick={function (){
                review("dismiss-report");
              }}>Dismiss report
          </button>) : null}
        {(report || published) ? (
          <button
            className="st-secondary-button"
            disabled={api.busy}
            onClick={function (){
                review("remove");
              }}>Remove contribution
          </button>) : null}
      </div>
    </article>);
}

// statstrade-web.feature.civic.editorial/Editorial [66] 
export function Editorial(){
  let api = page_api.usePageApi("editorial");
  let [editing,setEditing] = React.useState(null);
  return (
    <section className="st-page st-civic-page">
      <header className="st-civic-heading">
        <p className="st-kicker">Staff workspace</p>
        <h1>Editorial desk</h1>
        <p>
          Review issue briefings, community reasoning and reports before they reach the public.
        </p>
      </header>
      <civic.Status api={api}/>
      {(api.owner.status == "ready") ? (
        <div>
          {editing ? (
            <IssueEditor
              api={api}
              row={editing}
              onDone={function (){
                  setEditing(null);
                }}/>) : null}
          <section className="st-civic-section">
            <h2>Issues</h2>
            <p>
              Existing campaign groupings require a completed briefing and sources before publishing. Create new containers in Campaigns.
            </p>
            <div className="st-civic-issue-grid">
              {(api.data.issues || []).map(function (row){
                return (
                  <article className="st-civic-issue-card" key={row.id}>
                    <span className="st-badge">{row.status || "Not reviewed"}</span>
                    <h3>{row.title}</h3>
                    <button
                      className="st-secondary-button"
                      onClick={function (){
                          setEditing(row);
                        }}>Edit briefing
                    </button>
                  </article>);
              })}
            </div>
          </section>
          <section className="st-civic-section">
            <h2>Pending reasoning</h2>
            {(api.data.pending || []).map(function (entry){
              return (
                <ReviewCard key={entry.revision_id} entry={entry} api={api}/>);
            })}
            {((api.data.pending || []).length == 0) ? (
              <p>No submissions awaiting review.</p>) : null}
          </section>
          <section className="st-civic-section">
            <h2>Reports</h2>
            {(api.data.reports || []).map(function (entry){
              return (
                <ReviewCard key={entry.report_id} entry={entry} api={api} report={true}/>);
            })}
          </section>
          <section className="st-civic-section">
            <h2>Published community reasoning</h2>
            {(api.data.published || []).map(function (entry){
              return (
                <ReviewCard key={entry.id} entry={entry} api={api} published={true}/>);
            })}
          </section>
          <details className="st-civic-section">
            <summary>Editorial audit history</summary>
            {(api.data.audit || []).map(function (event){
              return (
                <p key={event.id}>
                  {event.action + " · " + event.subject_id + " · " + event.created_at}
                </p>);
            })}
          </details>
          <civic.Pagination api={api}/>
        </div>) : null}
    </section>);
}