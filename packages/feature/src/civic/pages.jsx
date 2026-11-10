import Link from 'next/link'

import React from 'react'

import * as page_api from '@statstrade/edge/substrate/page-api.jsx'

// statstrade-web.feature.civic.pages/Regions [3] 
export var Regions = [
  {"id":"national","title":"National"},
  {"id":"NSW","title":"New South Wales"},
  {"id":"VIC","title":"Victoria"},
  {"id":"QLD","title":"Queensland"},
  {"id":"WA","title":"Western Australia"},
  {"id":"SA","title":"South Australia"},
  {"id":"TAS","title":"Tasmania"},
  {"id":"ACT","title":"ACT"},
  {"id":"NT","title":"Northern Territory"},
  {"id":"Monash","title":"Monash Council, VIC"},
  {"id":"Waverley","title":"Waverley Council, NSW"}
];

// statstrade-web.feature.civic.pages/dateLabel [4] 
export function dateLabel(value){
  if((null == value) || (value == "")){
    return "Not yet set";
  }
  let date = new Date(((typeof value) == "number") ? value : value);
  if(Number.isNaN(date.getTime())){
    return "Not yet set";
  }
  return date.toLocaleDateString("en-AU",{
    "day":"numeric",
    "month":"short",
    "year":"numeric",
    "timeZone":"Australia/Melbourne"
  });
}

// statstrade-web.feature.civic.pages/Sources [9] 
export function Sources({rows}){
  return (
    <ul className="st-civic-sources">
      {(rows || []).map(function (source,index){
        return (
          <li key={index}>
            <a href={source.url} target="_blank" rel="noopener noreferrer">{source.title || source.url} ↗</a>
          </li>);
      })}
    </ul>);
}

// statstrade-web.feature.civic.pages/ForecastCard [12] 
export function ForecastCard({row}){
  return (
    <article className="st-civic-forecast">
      <div>
        <span className="st-badge">{row.status}</span>
        <Link href={"/issues/" + row.issue_id} prefetch={false}>{row.issue_title}</Link>
      </div>
      <h3>
        <Link href={"/questions/" + row.id} prefetch={false}>{row.title}</Link>
      </h3>
      <p>
        {"Closes " + dateLabel(row.closes_at) + " · Expected resolution " + dateLabel(row.resolution_estimate)}
      </p>
      {(row.status == "resolved") ? (
        <p>{"Outcome: " + (row.result || "Awaiting published result")}</p>) : null}
      <Link
        href={"/questions/" + row.id}
        className="st-civic-text-link"
        prefetch={false}>
        {(row.status == "open") ? "Make a forecast →" : "View forecast and outcome →"}
      </Link>
    </article>);
}

// statstrade-web.feature.civic.pages/IssueCard [19] 
export function IssueCard({row,featured}){
  return (
    <article
      className={"st-civic-issue-card" + (featured ? " st-civic-issue-card--lead" : "")}>
      <p className="st-kicker">{(row.subjects || []).join(" / ")}</p>
      <h2>
        <Link href={"/issues/" + row.id} prefetch={false}>{row.title}</Link>
      </h2>
      <p>{row.summary}</p>
      <div className="st-civic-meta">
        <span>{(row.regions || []).join(" · ")}</span>
        <span>{"Updated " + dateLabel(row.updated_at)}</span>
      </div>
      <Link
        className="st-civic-text-link"
        href={"/issues/" + row.id}
        prefetch={false}>Understand the issue →
      </Link>
    </article>);
}

// statstrade-web.feature.civic.pages/Pagination [25] 
export function Pagination({api}){
  let offset = Number((api.data.pagination && api.data.pagination.offset) || 0);
  let limit = Number((api.data.pagination && api.data.pagination.limit) || 20);
  let more = [
    "issues",
    "contributions",
    "pending",
    "published",
    "reports",
    "audit",
    "followed",
    "predictions",
    "forecasts"
  ].some(function (key){
    return (api.data[key] || []).length >= limit;
  });
  if((offset == 0) && !more){
    return null;
  }
  return (
    <div className="st-civic-pagination">
      <button
        className="st-secondary-button"
        disabled={api.busy || (offset <= 0)}
        onClick={function (){
            api.setInput({"offset":Math.max(0,offset - limit)});
          }}>Previous
      </button>
      <span>{"Page " + (1 + (offset / limit))}</span>
      <button
        className="st-secondary-button"
        disabled={api.busy || !more}
        onClick={function (){
            api.setInput({"offset":offset + limit});
          }}>Next
      </button>
    </div>);
}

// statstrade-web.feature.civic.pages/Status [34] 
export function Status({api}){
  return (
    <React.Fragment>
      {(api.owner.status == "loading") ? (
        <p role="status" className="st-muted-copy">Loading…</p>) : null}
      {api.error ? (
        <div role="alert" className="st-notice">
          {api.error}
          <button className="st-secondary-button" onClick={api.refresh}>Retry</button>
        </div>) : null}
    </React.Fragment>);
}

// statstrade-web.feature.civic.pages/BrowsePagination [38] 
export function BrowsePagination({api,filters,setFilters}){
  let more = (api.data.questions || api.data.issues || []).length >= 20;
  if((filters.offset == 0) && !more){
    return null;
  }
  return (
    <div className="st-civic-pagination">
      <button
        className="st-secondary-button"
        disabled={api.busy || (filters.offset <= 0)}
        onClick={function (){
            let next = Object.assign({},filters,{"offset":Math.max(0,filters.offset - 20)});
            setFilters(next);
            api.setInput(next);
          }}>Previous
      </button>
      <span>{"Page " + (1 + (filters.offset / 20))}</span>
      <button
        className="st-secondary-button"
        disabled={api.busy || !more}
        onClick={function (){
            let next = Object.assign({},filters,{"offset":filters.offset + 20});
            setFilters(next);
            api.setInput(next);
          }}>Next
      </button>
    </div>);
}

// statstrade-web.feature.civic.pages/Browse [45] 
export function Browse({mode}){
  let api = page_api.usePageApi(mode);
  let [filters,setFilters] = React.useState({
    "q":"",
    "region":"",
    "subject":"",
    "status":"open",
    "sort":"closing",
    "offset":0
  });
  let today = mode == "today";
  let forecasts = mode == "forecasts";
  let issues = api.data.issues || [];
  let questions = api.data.questions || [];
  function change(key,value){
    let next = Object.assign({},filters,{"offset":0});
    next[key] = value;
    setFilters(next);
  }
  return (
    <section className="st-page st-civic-page">
      <header className="st-civic-heading">
        <p className="st-kicker">Australian public affairs</p>
        <h1>
          {today ? "Understand what’s happening." : (forecasts ? "What happens next?" : "Explore the issues.")}
        </h1>
        <p>
          {today ? "Briefings, evidence and perspectives on the issues shaping Australia." : (forecasts ? "Make a clear forecast. Follow the evidence. See how it resolves." : "Find the context, hear different perspectives and consider what comes next.")}
        </p>
      </header>
      {today ? null : (
        <form
          className="st-civic-filters"
          onSubmit={function (event){
              event.preventDefault();
              api.setInput(filters);
            }}>
          <label>
            Search
            <input
              type="search"
              value={filters.q}
              onChange={function (e){
                  change("q",e.target.value);
                }}/>
          </label>
          <label>
            Subject
            <select
              aria-label="Subject"
              value={filters.subject}
              onChange={function (e){
                  change("subject",e.target.value);
                }}>
              <option value="">All subjects</option>
              {(api.data.subjects || []).map(function (subject){
                return (
                  <option key={subject} value={subject}>{subject}</option>);
              })}
            </select>
          </label>
          <label>
            Region
            <select
              aria-label="Region"
              value={filters.region}
              onChange={function (e){
                  change("region",e.target.value);
                }}>
              <option value="">All Australia</option>
              {Regions.map(function (region){
                return (
                  <option key={region.id} value={region.id}>{region.title}</option>);
              })}
            </select>
          </label>
          {forecasts ? (
            <React.Fragment>
              <label>
                Status
                <select
                  aria-label="Status"
                  value={filters.status}
                  onChange={function (e){
                      change("status",e.target.value);
                    }}>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                  <option value="resolved">Resolved</option>
                  <option value="all">All forecasts</option>
                </select>
              </label>
              <label>
                Sort by
                <select
                  aria-label="Sort by"
                  value={filters.sort}
                  onChange={function (e){
                      change("sort",e.target.value);
                    }}>
                  <option value="closing">Closing date</option>
                  <option value="resolution">Resolution date</option>
                </select>
              </label>
            </React.Fragment>) : null}
          <button
            className="st-primary-button"
            type="submit"
            disabled={api.busy}>Apply filters
          </button>
        </form>)}
      <Status api={api}/>
      {issues.some(function (row){
        return row.example;
      }) ? (
        <p className="st-civic-example">
          Local example edition · sourced questions, with no fabricated participation.
        </p>) : null}
      {(api.owner.status == "ready") ? (
        <div>
          {forecasts ? (
            <div className="st-civic-forecast-grid">
              {questions.map(function (row){
                return (
                  <ForecastCard key={row.id} row={row}/>);
              })}
              {(questions.length == 0) ? (
                <p>No forecasts match these filters.</p>) : null}
            </div>) : (
            <div className="st-civic-issue-grid">
              {issues.map(function (row,index){
                return (
                  <IssueCard key={row.id} row={row} featured={today && (index == 0)}/>);
              })}
              {(issues.length == 0) ? (
                <p>No published issues match these filters.</p>) : null}
            </div>)}
          {today ? (
            <section className="st-civic-section" id="latest">
              <div className="st-civic-section-heading">
                <h2>Closing soon</h2>
                <Link href="/forecasts" prefetch={false}>All forecasts →</Link>
              </div>
              <div className="st-civic-forecast-grid">
                {(api.data.closing || []).map(function (row){
                  return (
                    <ForecastCard key={row.id} row={row}/>);
                })}
              </div>
            </section>) : (
            <BrowsePagination api={api} filters={filters} setFilters={setFilters}/>)}
          <p className="st-civic-publisher">
            Editorial publisher: Auspolitics · Briefings are reviewed before publication.
          </p>
        </div>) : null}
    </section>);
}

// statstrade-web.feature.civic.pages/ReasoningForm [82] 
export function ReasoningForm({api,issueId,questions,existing,parent,onDone}){
  let [argument,setArgument] = React.useState(
    (existing && existing.content && existing.content.argument) || ""
  );
  let [implication,setImplication] = React.useState(
    (existing && existing.content && existing.content.implication) || ""
  );
  let [sources,setSources] = React.useState(((existing && existing.content && existing.content.sources) || []).map(function (s){
    return s.url;
  }).join("\n"));
  let [question,setQuestion] = React.useState((existing && existing.question_id) || "");
  let [error,setError] = React.useState(null);
  return (
    <form
      className="st-civic-form"
      onSubmit={function (event){
          event.preventDefault();
          setError(null);
          let m = {
            "argument":argument,
            "implication":implication,
            "sources":sources.split("\n").map(function (url){
                      return {"url":url.trim()};
                    }).filter(function (s){
                      return s.url;
                    }),
            "question_id":question ? question : null,
            "parent_id":parent || null
          };
          if(existing){
            m.id = existing.id;
            m.expected_revision = existing.revision_id;
          }
          api.mutations.submit_reasoning.mutateAsync({"issue_id":issueId,"m":m}).then(function (){
            onDone();
          }).catch(function (e){
            setError(e.message);
          });
        }}>
      <h3>
        {existing ? "Edit your reasoning" : (parent ? "Respond with reasoning" : "Contribute your reasoning")}
      </h3>
      <p>
        Your submission will be reviewed before it appears publicly. An approved version stays public while an edit is reviewed.
      </p>
      <label>
        Your argument
        <textarea
          aria-label="Your argument"
          required={true}
          minLength={10}
          maxLength={4000}
          value={argument}
          onChange={function (e){
              setArgument(e.target.value);
            }}/>
      </label>
      <label>
        What does this change?
        <textarea
          aria-label="What does this change?"
          required={true}
          minLength={5}
          maxLength={2000}
          value={implication}
          onChange={function (e){
              setImplication(e.target.value);
            }}/>
      </label>
      <label>
        Sources (one URL per line)
        <textarea
          aria-label="Sources (one URL per line)"
          value={sources}
          onChange={function (e){
              setSources(e.target.value);
            }}
          placeholder="https://…"/>
      </label>
      {(existing || parent) ? null : (
        <label>
          Related forecast (optional)
          <select
            aria-label="Related forecast (optional)"
            value={question}
            onChange={function (e){
                setQuestion(e.target.value);
              }}>
            <option value="">The broader issue</option>
            {(questions || []).map(function (q){
              return (
                <option key={q.id} value={q.id}>{q.title}</option>);
            })}
          </select>
        </label>)}
      {error ? (
        <p role="alert">{error}</p>) : null}
      <div className="st-cluster">
        <button
          className="st-primary-button"
          type="submit"
          disabled={api.busy}>Submit for review
        </button>
        <button
          className="st-secondary-button"
          type="button"
          onClick={onDone}>Cancel
        </button>
      </div>
    </form>);
}

// statstrade-web.feature.civic.pages/Issue [101] 
export function Issue(){
  let api = page_api.usePageApi("issue");
  let context = React.useContext(page_api.PageContext);
  let item = api.data.issue;
  let [form,setForm] = React.useState(null);
  let [notice,setNotice] = React.useState(null);
  let [error,setError] = React.useState(null);
  let [report,setReport] = React.useState(null);
  let [reason,setReason] = React.useState("");
  return (
    <section className="st-page st-civic-page">
      <Status api={api}/>
      {item ? (
        <React.Fragment>
          <Link href="/issues" className="st-civic-back" prefetch={false}>← All issues</Link>
          <header className="st-civic-heading">
            <p className="st-kicker">{item.subjects.join(" / ")}</p>
            <h1>{item.title}</h1>
            <p className="st-civic-meta">
              {"Updated " + dateLabel(item.updated_at) + " · Published by " + item.publisher}
            </p>
            {item.example ? (
              <p className="st-civic-example">
                Local example issue · forecasts use sourced resolution criteria.
              </p>) : null}
          </header>
          <nav className="st-civic-tabs" aria-label="Issue sections">
            <a href="#briefing">Briefing</a>
            <a href="#perspectives">Perspectives</a>
            <a href="#next">What happens next</a>
          </nav>
          {context.actor ? (
            <button
              className="st-secondary-button"
              disabled={api.busy}
              onClick={function (){
                  api.mutations.follow_issue.mutateAsync({"issue_id":item.id,"enabled":!api.data.following}).catch(function (e){
                    setError(e.message);
                  });
                }}>{api.data.following ? "Unfollow issue" : "Follow issue"}
            </button>) : (
            <Link href="/sign-in" prefetch={false}>Sign in to follow or contribute</Link>)}
          {error ? (
            <p role="alert">{error}</p>) : null}
          {notice ? (
            <p role="status">{notice}</p>) : null}
          <section className="st-civic-section st-civic-briefing" id="briefing">
            <p className="st-kicker">01 / Briefing</p>
            <h2>The issue at a glance</h2>
            <div className="st-civic-brief-grid">
              <article><h3>What’s happening</h3><p>{item.summary}</p></article>
              <article><h3>Why it matters</h3><p>{item.importance}</p></article>
              <article><h3>What remains uncertain</h3><p>{item.uncertainty}</p></article>
            </div>
            <h3>Sources</h3>
            <Sources rows={item.sources}/>
          </section>
          <section className="st-civic-section" id="perspectives">
            <p className="st-kicker">02 / Perspectives</p>
            <h2>Evidence and reasoning</h2>
            {(item.perspectives || []).map(function (voice,index){
              return (
                <article className="st-civic-reasoning" key={index}>
                  <p className="st-kicker">Selected perspective</p>
                  <h3>{voice.attribution}</h3>
                  <p>{voice.argument}</p>
                  <a href={voice.url} target="_blank" rel="noopener noreferrer">Original source ↗</a>
                </article>);
            })}
            {(api.data.articles || []).map(function (article){
              return (
                <article className="st-civic-reasoning" key={article.id}>
                  <p className="st-kicker">Published reporting</p>
                  <h3>
                    <Link href={"/newsroom/" + article.id} prefetch={false}>{article.headline}</Link>
                  </h3>
                  <p>{article.standfirst}</p>
                </article>);
            })}
            <h3>Community reasoning</h3>
            <p className="st-muted-copy">
              Contributions and responses are reviewed before publication.
            </p>
            {((api.data.contributions || []).length == 0) ? (
              <p>No community reasoning has been published yet.</p>) : null}
            {(api.data.contributions || []).map(function (entry){
              return (
                <article
                  className="st-civic-reasoning"
                  id={"reasoning-" + entry.id}
                  key={entry.id}>
                  <p className="st-kicker">
                    {entry.parent_id ? "Community response" : "Community reasoning"}
                  </p>
                  <h4>{entry.handle}</h4>
                  <p>{entry.content.argument}</p>
                  <p>
                    <strong>What this changes: </strong>
                    {entry.content.implication}
                  </p>
                  <Sources rows={entry.content.sources}/>
                  {entry.question_id ? (
                    <Link href={"/questions/" + entry.question_id} prefetch={false}>Related forecast →</Link>) : null}
                  {context.actor ? (
                    <div className="st-cluster">
                      {entry.parent_id ? null : (
                        <button
                          className="st-secondary-button"
                          onClick={function (){
                              setForm({"parent":entry.id});
                            }}>Respond
                        </button>)}
                      <button
                        className="st-secondary-button"
                        onClick={function (){
                            setReport(entry.id);
                            setReason("");
                          }}>Report
                      </button>
                    </div>) : null}
                </article>);
            })}
            {report ? (
              <form
                className="st-civic-form"
                onSubmit={function (event){
                    event.preventDefault();
                    api.mutations.report_reasoning.mutateAsync({"contribution_id":report,"reason":reason}).then(function (){
                      setReport(null);
                      setNotice("Report sent to the editors.");
                    }).catch(function (e){
                      setError(e.message);
                    });
                  }}>
                <label>
                  Reason for reporting
                  <textarea
                    aria-label="Reason for reporting"
                    required={true}
                    minLength={5}
                    maxLength={2000}
                    value={reason}
                    onChange={function (e){
                        setReason(e.target.value);
                      }}/>
                </label>
                <button className="st-primary-button" disabled={api.busy}>Send report</button>
                <button
                  type="button"
                  className="st-secondary-button"
                  onClick={function (){
                      setReport(null);
                    }}>Cancel
                </button>
              </form>) : null}
            {context.actor ? (
              <button
                className="st-primary-button"
                onClick={function (){
                    setForm({});
                  }}>Add reasoning
              </button>) : null}
            {form ? (
              <ReasoningForm
                key={(form.existing && form.existing.id) || form.parent || "new"}
                api={api}
                issueId={item.id}
                questions={api.data.questions}
                existing={form.existing}
                parent={form.parent}
                onDone={function (){
                    setForm(null);
                    setNotice(
                      "Your submissions are shown below. New text appears publicly after approval."
                    );
                  }}/>) : null}
            {((api.data.mine || []).length > 0) ? (
              <aside className="st-civic-my-submissions">
                <h3>Your submissions</h3>
                {api.data.mine.map(function (entry){
                  return (
                    <article key={entry.id}>
                      <span className="st-badge">{entry.status}</span>
                      <p>{entry.content.argument}</p>
                      {entry.review_note ? (
                        <p>{entry.review_note}</p>) : null}
                      {entry.removed ? (
                        <p>Removed by the editors.</p>) : (
                        <button
                          className="st-secondary-button"
                          onClick={function (){
                              setForm({"existing":entry});
                            }}>Edit reasoning
                        </button>)}
                    </article>);
                })}
              </aside>) : null}
            <Pagination api={api}/>
          </section>
          <section className="st-civic-section" id="next">
            <p className="st-kicker">03 / What happens next</p>
            <h2>Make a forecast</h2>
            <div className="st-civic-forecast-grid">
              {(api.data.questions || []).map(function (q){
                return (
                  <ForecastCard row={q} key={q.id}/>);
              })}
            </div>
            {((api.data.questions || []).length == 0) ? (
              <p>No forecasts are linked to this issue yet.</p>) : null}
          </section>
        </React.Fragment>) : ((api.owner.status == "ready") ? (
        <div>
          <h1>Issue unavailable</h1>
          <p>This issue has not been published or has been withdrawn.</p>
        </div>) : null)}
    </section>);
}

// statstrade-web.feature.civic.pages/QuestionContext [153] 
export function QuestionContext(){
  let api = page_api.usePageApi("question-context");
  let issues = api.data.issues || [];
  return (issues.length > 0) ? (
    <nav
      className="st-civic-question-context"
      aria-label="Related issues">
      {issues.map(function (issue){
        return (
          <Link href={"/issues/" + issue.id} key={issue.id} prefetch={false}>{"← " + issue.title}</Link>);
      })}
    </nav>) : null;
}

// statstrade-web.feature.civic.pages/statusLabel [158] 
export function statusLabel(status){
  return ["subscription","vesting","trading"].includes(status) ? "open" : ((status == "discarded") ? "void" : status);
}

// statstrade-web.feature.civic.pages/Activity [160] 
export function Activity(){
  let api = page_api.usePageApi("activity");
  return (
    <section className="st-page st-civic-page">
      <header className="st-civic-heading">
        <p className="st-kicker">Your record</p>
        <h1>My activity</h1>
        <p>
          Followed issues, your reasoning and the forecasts you have made.
        </p>
        <Link href="/profile" prefetch={false}>Edit profile →</Link>
      </header>
      <Status api={api}/>
      <section className="st-civic-section">
        <h2>Following</h2>
        <div className="st-civic-issue-grid">
          {(api.data.followed || []).map(function (row){
            return (
              <IssueCard key={row.id} row={row}/>);
          })}
        </div>
      </section>
      <section className="st-civic-section">
        <h2>Your reasoning</h2>
        {(api.data.contributions || []).map(function (entry){
          return (
            <article className="st-civic-reasoning" key={entry.id}>
              <span className="st-badge">{entry.removed ? "removed" : entry.status}</span>
              <p>{entry.content.argument}</p>
              {entry.review_note ? (
                <p>{entry.review_note}</p>) : null}
              <Link href={"/issues/" + entry.issue_id} prefetch={false}>Open issue and manage submission →</Link>
            </article>);
        })}
      </section>
      <section className="st-civic-section">
        <h2>Your forecasts</h2>
        {(api.data.predictions || []).concat(api.data.forecasts || []).map(function (entry){
          return (
            <article className="st-civic-forecast" key={entry.id}>
              <span className="st-badge">{statusLabel(entry.status)}</span>
              <h3>
                <Link href={"/questions/" + entry.id} prefetch={false}>{entry.title}</Link>
              </h3>
              {entry.total_spend ? (
                <p>{entry.total_spend + " Auspolitics points committed"}</p>) : null}
              {entry.refunded ? (
                <p>Entry refunded</p>) : null}
              {entry.oracle_result ? (
                <p>{"Outcome: " + entry.oracle_result}</p>) : null}
            </article>);
        })}
      </section>
      <Pagination api={api}/>
    </section>);
}

// statstrade-web.feature.civic.pages/PublicationContext [172] 
export function PublicationContext(){
  let api = page_api.usePageApi("publication-context");
  return (
    <nav
      className="st-civic-question-context"
      aria-label="Related issues">
      {(api.data.issues || []).map(function (issue){
        return (
          <Link href={"/issues/" + issue.id} key={issue.id} prefetch={false}>{"← " + issue.title}</Link>);
      })}
    </nav>);
}