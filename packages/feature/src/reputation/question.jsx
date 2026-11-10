import React from 'react'

import * as pool from '@statstrade/feature/reputation/pool-ticket.jsx'

import * as civic from '@statstrade/feature/civic/pages.jsx'

import * as page_api from '@statstrade/edge/substrate/page-api.jsx'

import * as home from '@statstrade/feature/home/newspaper.jsx'

// statstrade-web.feature.reputation.question/QuestionPage [7] 
export function QuestionPage(){
  let api = page_api.usePageApi("question");
  let context = React.useContext(page_api.PageContext);
  let [values,setValues] = React.useState({});
  let [command,setCommand] = React.useState(crypto.randomUUID());
  let [message,setMessage] = React.useState(null);
  let [error,setError] = React.useState(null);
  let question = api.data.question;
  let [now,setNow] = React.useState(Date.now());
  React.useEffect(function (){
    let deadline = question && ((now < Number(question.opens_at)) ? Number(question.opens_at) : Number(question.locks_at));
    if(deadline && (deadline > now)){
      let timer = setTimeout(function (){
        setNow(Date.now());
      },Math.min(2147483647,25 + (deadline - now)));
      return function (){
        clearTimeout(timer);
      };
    }
  },[
    question && question.opens_at,
    question && question.locks_at,
    now
  ]);
  let prospects = api.data.prospects || [];
  let total = prospects.reduce(function (sum,p){
    return sum + Number(values[p.id] || 0);
  },0);
  let open = question && (now >= Number(question.opens_at)) && (now < Number(question.locks_at)) && ["subscription","vesting","trading"].includes(question.status) && prospects.every(function (p){
    return p.result == "pending";
  });
  let valid = (Math.abs(total - 100) < 1.0E-4) && prospects.every(function (p){
    let value = Number(values[p.id]);
    return Number.isFinite(value) && (value >= 0) && (value <= 100);
  });
  function submit(){
    setError(null);
    setMessage(null);
    let probabilities = {};
    prospects.forEach(function (p){
      probabilities[p.id] = (Number(values[p.id] || 0) / 100);
    });
    api.mutations.submit_forecast.mutateAsync({
      "topic_id":question.id,
      "command_id":command,
      "probabilities":probabilities
    }).then(function (){
      setMessage("Forecast recorded.");
      setCommand(crypto.randomUUID());
    }).catch(function (e){
      setError(e.message);
    });
  }
  return (
    <section className="st-page st-user-page st-user-call-page">
      <civic.QuestionContext/>
      <div className="st-user-detail-back">
        <a href="/forecasts">← Back to forecasts</a>
        <span className="st-code">Forecast / question</span>
      </div>
      {(api.owner.status == "loading") ? (
        <p role="status" className="st-notice">Loading prediction question…</p>) : null}
      {(api.error || error) ? (
        <p role="alert" className="st-notice st-outcome-error">{api.error || error}</p>) : null}
      {question ? (
        <React.Fragment>
          <header className="st-user-call-heading">
            <div>
              <p className="st-kicker">Forecast / evidence and outlook</p>
              <h1>{question.title}</h1>
              <p className="st-user-call-heading__status">{question.description}</p>
            </div>
            <div className="st-user-heading__aside">
              <span
                className="st-badge"
                data-tone={open ? "success" : "neutral"}>{open ? "Open for forecasts" : "Forecasting closed"}
              </span>
              {question.example ? (
                <span className="st-badge">Local example</span>) : null}
            </div>
          </header>
          <div className="st-user-call-desk">
            <div className="st-user-call-desk__context">
              <section className="st-panel st-user-market-panel">
                <header className="st-user-call-section-heading">
                  <div>
                    <p className="st-section-label">01 / question context</p>
                    <h2>The question at a glance</h2>
                  </div>
                </header>
                <p>{question.description}</p>
                <dl className="st-question-facts">
                  <div>
                    <dt>Forecast closes</dt>
                    <dd>
                      {new Date(Number(question.locks_at)).toLocaleString(
                        "en-AU",
                        {"timeZone":"Australia/Melbourne","timeZoneName":"short"}
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt>Expected resolution</dt>
                    <dd>
                      {question.resolution_estimate ? new Date(question.resolution_estimate).toLocaleDateString("en-AU",{
                        "day":"numeric",
                        "month":"short",
                        "year":"numeric",
                        "timeZone":"Australia/Melbourne"
                      }) : "Not specified"}
                    </dd>
                  </div>
                  <div>
                    <dt>Outcomes</dt>
                    <dd>
                      {prospects.map(function (p){
                        return p.title;
                      }).join(" / ")}
                    </dd>
                  </div>
                </dl>
              </section>
              <section
                className="st-panel st-user-market-panel"
                aria-label="Question resolution rules">
                <header className="st-user-call-section-heading">
                  <div>
                    <p className="st-section-label">02 / evidence and resolution</p>
                    <h2>How this resolves</h2>
                  </div>
                </header>
                <p className="st-question-rules">
                  {question.rules || "Resolution rules have not been supplied for this question."}
                </p>
                {home.safeSourceUrl(question.resolution_url) ? (
                  <a
                    className="st-secondary-button st-source-link"
                    href={home.safeSourceUrl(question.resolution_url)}
                    target="_blank"
                    rel="noopener noreferrer">
                    {question.resolution_source || "Official resolution source"}
                     ↗
                  </a>) : null}
              </section>
              <section className="st-panel st-user-market-panel">
                <header className="st-user-call-section-heading">
                  <div>
                    <p className="st-section-label">03 / personal record</p>
                    <h2>Your forecast history</h2>
                  </div>
                </header>
                {((api.data.history || []).length == 0) ? (
                  <p className="st-muted-copy">
                    {context.actor ? "No forecasts recorded for this question yet." : "Sign in to see your forecast history."}
                  </p>) : null}
                {(api.data.history || []).map(function (revision){
                  return (
                    <article className="st-history-entry" key={revision.id}>
                      <time>
                        {new Date(Number(revision.received_at)).toLocaleString("en-AU")}
                      </time>
                      {prospects.map(function (p){
                        return (
                          <p key={p.id}>
                            {p.title + ": " + (100 * Number(revision.probabilities[p.id])) + "%"}
                          </p>);
                      })}
                    </article>);
                })}
              </section>
            </div>
            <aside
              className="st-user-call-desk__decision"
              aria-label="Your forecast">
              {api.data.pool ? (
                <pool.PoolTicket api={api} question={question} open={open}/>) : (
                <form
                  className="st-user-trade-ticket"
                  onSubmit={function (event){
                      event.preventDefault();
                      if(context.actor && valid && open && !api.busy){
                        submit();
                      }
                    }}>
                  <header className="st-user-call-section-heading">
                    <div>
                      <p className="st-section-label">Your forecast</p>
                      <h2>Make your call</h2>
                    </div>
                  </header>
                  <p className="st-user-trade-ticket__intro">
                    Enter a probability for every outcome. Your probabilities must total 100%. You can revise them before the forecast closes.
                  </p>
                  {prospects.map(function (p){
                    let change = function (event){
                      let next = Object.assign({},values);
                      next[p.id] = event.target.value;
                      setValues(next);
                      setCommand(crypto.randomUUID());
                    };
                    return (
                      <div className="st-outcome-input" key={p.id}>
                        <div>
                          <label htmlFor={"probability-" + p.id}>{p.title}</label>
                          <input
                            min="0"
                            aria-label={p.title + " probability (%)"}
                            placeholder="—"
                            disabled={!open}
                            value={values[p.id] || ""}
                            type="number"
                            max="100"
                            id={"probability-" + p.id}
                            onChange={change}
                            step="0.01"/>
                        </div>
                        <input
                          type="range"
                          disabled={!open}
                          min="0"
                          max="100"
                          step="1"
                          value={Number(values[p.id] || 0)}
                          onChange={change}
                          aria-label={p.title + " probability slider"}/>
                      </div>);
                  })}
                  <div className="st-probability-total" role="status">
                    <span>Total probability</span>
                    <strong>{total + "%"}</strong>
                  </div>
                  {!open ? (
                    <p className="st-notice">
                      Forecasting is closed outside the opening and lock times, and after a result is recorded.
                    </p>) : null}
                  {context.actor ? (
                    <button
                      type="submit"
                      className="st-primary-button"
                      disabled={api.busy || !valid || !open}>{api.busy ? "Recording…" : "Record forecast"}
                    </button>) : (
                    <a className="st-primary-button" href="/sign-in">Sign in to record your forecast</a>)}
                  {question.example ? (
                    <p className="st-muted-copy">
                      Local example question. Forecast history starts empty; sample activity is not generated.
                    </p>) : null}
                  {message ? (
                    <p role="status" className="st-notice">{message}</p>) : null}
                </form>)}
            </aside>
          </div>
        </React.Fragment>) : ((api.owner.status == "ready") ? (
        <section className="st-panel st-user-empty">
          <h1>Question unavailable</h1>
          <p>
            This question is unavailable or has not been enrolled for reputation scoring.
          </p>
          <a href="/forecasts" className="st-primary-button">Explore open questions</a>
        </section>) : null)}
    </section>);
}