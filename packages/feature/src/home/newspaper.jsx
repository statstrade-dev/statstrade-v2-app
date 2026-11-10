import Head from 'next/head'

import React from 'react'

import * as auth from '@statstrade/edge/remote/util-supabase.jsx'

import * as page_api from '@statstrade/edge/substrate/page-api.jsx'

// statstrade-web.feature.home.newspaper/safeSourceUrl [10] 
export function safeSourceUrl(value){
  try{
    let url = new URL(value);
    if(["https:","http:"].includes(url.protocol) && !url.username && !url.password){
      return url.href;
    }
  }
  catch(_){
    null;
  }
  return null;
}

// statstrade-web.feature.home.newspaper/closingLabel [17] 
export function closingLabel(value){
  if((null == value) || !Number.isFinite(Number(value))){
    return "Closing date to be announced";
  }
  let date = new Date(Number(value));
  if(Number.isNaN(date.getTime())){
    return "Closing date to be announced";
  }
  return "Closes " + new Intl.DateTimeFormat("en-AU",{
    "day":"numeric",
    "month":"short",
    "year":"numeric",
    "timeZone":"Australia/Melbourne"
  }).format(date);
}

// statstrade-web.feature.home.newspaper/sectionFor [23] 
export function sectionFor(topic){
  return (topic.detail && topic.detail.pillar_title) || topic.location || "Public predictions";
}

// statstrade-web.feature.home.newspaper/selectHome [26] 
export function selectHome(snapshot,query,section,campaign,now){
  let discovery = snapshot.discovery || {};
  let terms = (query || "").trim().toLowerCase();
  let match = function (values){
    return values.filter(Boolean).join(" ").toLowerCase().includes(terms);
  };
  let topics = (discovery.topics || []).filter(function (t){
    return ((null == t.time_close) || (Number(t.time_close) > now)) && (!section || (sectionFor(t) == section)) && (!campaign || (t.campaign_id == campaign)) && match([t.title,t.description,sectionFor(t)]);
  });
  let sections = Object.create(null);
  (discovery.topics || []).forEach(function (t){
    if((null == t.time_close) || (Number(t.time_close) > now)){
      let key = sectionFor(t);
      sections[key] = ((sections[key] || 0) + 1);
    }
  });
  let closing = topics.filter(function (t){
    return !(null == t.time_close) && Number.isFinite(Number(t.time_close));
  }).slice().sort(function (a,b){
    return Number(a.time_close) - Number(b.time_close);
  }).slice(0,5);
  return {
    "topics":topics,
    "closing":closing,
    "sections":Object.entries(sections).map(function ([title,count]){
        return {"title":title,"count":count};
      }),
    "campaigns":(discovery.campaigns || []).filter(function (c){
        return match([c.title,c.description]);
      }),
    "communities":(discovery.communities || []).filter(function (c){
        return match([c.title,c.description,c.location]);
      }),
    "articles":(snapshot.articles || []).filter(function (a){
        return match([a.headline,a.standfirst,a.organization]);
      })
  };
}

// statstrade-web.feature.home.newspaper/Wordmark [48] 
export function Wordmark(){
  return (
    <a
      className="st-newspaper__wordmark"
      href="/"
      aria-label="Statstrade home">
      <img
        className="st-newspaper__mark"
        src="/statstrade-mark.svg"
        alt=""
        width={36}
        height={37}/>
      <span><strong>statstrade</strong></span>
    </a>);
}

// statstrade-web.feature.home.newspaper/Empty [53] 
export function Empty({title,children}){
  return (
    <div className="st-newspaper__empty"><h3>{title}</h3><p>{children}</p></div>);
}

// statstrade-web.feature.home.newspaper/Heading [56] 
export function Heading({kicker,title,count}){
  return (
    <header className="st-newspaper__section-heading">
      <div>
        <p className="st-newspaper__kicker">{kicker}</p>
        <h2>{title}</h2>
      </div>
      {!(null == count) ? (
        <span className="st-newspaper__section-index">{count + " records"}</span>) : null}
    </header>);
}

// statstrade-web.feature.home.newspaper/Cover [61] 
export function Cover({label}){
  return (
    <div className="st-newspaper__cover" aria-hidden={true}>{label}</div>);
}

// statstrade-web.feature.home.newspaper/TopicCard [64] 
export function TopicCard({topic}){
  return (
    <article className="st-newspaper__story">
      <a
        className="st-newspaper__story-media"
        href={"/questions/" + topic.id}
        tabIndex={-1}
        aria-hidden={true}><Cover label={sectionFor(topic)}/>
      </a>
      <div className="st-newspaper__story-body">
        <p className="st-newspaper__article-kicker">
          {sectionFor(topic)}
          {((topic.detail && topic.detail.stage) == "local-example") ? " · Local example" : ""}
        </p>
        <h3><a href={"/questions/" + topic.id}>{topic.title}</a></h3>
        <p>{topic.description}</p>
        <div className="st-newspaper__story-meta">
          <span>{closingLabel(topic.time_close)}</span>
          {(topic.detail && topic.detail.resolution_source) ? (
            <span>{topic.detail.resolution_source}</span>) : null}
        </div>
        <div className="st-newspaper__story-footer"><a href={"/questions/" + topic.id}>Open question →</a></div>
      </div>
    </article>);
}

// statstrade-web.feature.home.newspaper/Newspaper [77] 
export function Newspaper({snapshot,loading,error,refresh,busy,signedIn}){
  let [query,setQuery] = React.useState("");
  let [section,setSection] = React.useState("");
  let [campaign,setCampaign] = React.useState("");
  let [dark,setDark] = React.useState(false);
  let [now] = React.useState(Date.now());
  React.useEffect(function (){
    setDark(localStorage.getItem("statstrade-home-theme") == "dark");
  },[]);
  let model = selectHome(snapshot || {},query,section,campaign,now);
  let lead = model.topics[0];
  let article = model.articles[0];
  let edition = new Intl.DateTimeFormat("en-AU",{
    "weekday":"long",
    "day":"numeric",
    "month":"long",
    "year":"numeric",
    "timeZone":"Australia/Melbourne"
  }).format(new Date(now));
  let choose = function (value){
    setSection(value);
    setCampaign("");
    document.getElementById("latest").scrollIntoView({"behavior":"smooth"});
  };
  let reset = function (){
    setQuery("");
    setSection("");
    setCampaign("");
  };
  return (
    <div
      className="st-newspaper"
      data-theme={dark ? "dark" : "light"}>
      <Head>
        <title>Statstrade · prediction newsroom</title>
        <meta
          name="description"
          content="Public prediction questions, published reporting and evidence from Statstrade."/>
        <link rel="stylesheet" href="/newspaper.css"/>
      </Head>
      <a href="#front-page" className="st-newspaper__skip">Skip to content</a>
      <header className="st-newspaper__header">
        <div className="st-newspaper__utility">
          <span>Prediction newsroom</span>
          <span>Australian politics + economics</span>
        </div>
        <div className="st-newspaper__masthead">
          <Wordmark/>
          <div className="st-newspaper__edition">{edition}</div>
          <div className="st-newspaper__tools">
            <a
              className="st-newspaper__text-link"
              href={signedIn ? "/manage" : "/sign-in"}>{signedIn ? "Your workspace ↗" : "Sign in ↗"}
            </a>
            <button
              className="st-newspaper__theme"
              aria-label="Toggle colour theme"
              aria-pressed={dark}
              onClick={function (){
                  setDark(!dark);
                  localStorage.setItem("statstrade-home-theme",dark ? "light" : "dark");
                }}>{dark ? "Light" : "Dark"}
            </button>
          </div>
        </div>
        <nav className="st-newspaper__nav" aria-label="Newsroom sections">
          <a href="#front-page">Front page</a>
          <a href="#latest">Open calls</a>
          <a href="#closing">Closing soon</a>
          <a href="#desks">Desks</a>
          <a href="#evidence">Evidence</a>
          <a href="/newsroom">Published reporting →</a>
        </nav>
      </header>
      <main className="st-newspaper__main" id="front-page">
        <section
          className="st-newspaper__intro"
          aria-labelledby="newspaper-title">
          <div>
            <p className="st-newspaper__kicker">Front page / Public edition</p>
            <h1 id="newspaper-title">What happens <em>next?</em></h1>
          </div>
        </section>
        {((snapshot && snapshot.discovery && snapshot.discovery.topics) || []).some(function (topic){
          return (topic.detail && topic.detail.stage) == "local-example";
        }) ? (
          <p className="st-newspaper__status" role="note">
            Local example edition · Real-world questions with official resolution sources. Forecast history starts empty; no crowd numbers are invented.
          </p>) : null}
        <form
          className="st-newspaper__search"
          role="search"
          onSubmit={function (event){
              event.preventDefault();
            }}>
          <input
            type="search"
            value={query}
            aria-label="Search this public edition"
            placeholder="Search this edition’s questions, subjects and reporting…"
            onChange={function (event){
                setQuery(event.target.value);
              }}/>
          <button
            className="st-newspaper__refresh"
            type="button"
            disabled={busy}
            onClick={refresh}>{busy ? "Refreshing…" : "Refresh edition"}
          </button>
        </form>
        {loading ? (
          <div role="status" className="st-newspaper__status">
            Loading public questions and published reporting…
            <div className="st-newspaper__loading"/>
          </div>) : null}
        {error ? (
          <div role="alert" className="st-newspaper__status">
            Unable to load this edition. 
            {error}
            <button
              className="st-newspaper__refresh"
              onClick={refresh}
              disabled={busy}>Try again
            </button>
          </div>) : null}
        {(loading || error) ? null : (
          <div>
            {(section || campaign || query) ? (
              <div className="st-newspaper__filters" role="status">
                <p>
                  {model.topics.length + " questions · " + model.articles.length + " articles" + (section ? (" · " + section) : "")}
                </p>
                <button onClick={reset}>Clear filters</button>
              </div>) : null}
            <section className="st-newspaper__section" id="communities">
              <Heading
                kicker="Communities"
                title="Current-event files"
                count={model.campaigns.length}/>
              {(model.campaigns.length > 0) ? (
                <div className="st-newspaper__story-grid">
                  {model.campaigns.map(function (file){
                    let owner = model.communities.find(function (c){
                      return c.id == file.owner_id;
                    });
                    let count = ((snapshot.discovery && snapshot.discovery.topics) || []).filter(function (t){
                      return t.campaign_id == file.id;
                    });
                    return (
                      <article className="st-newspaper__story" key={file.id}>
                        <Cover label={(owner && owner.title) || "Current events"}/>
                        <div className="st-newspaper__story-body">
                          <p className="st-newspaper__article-kicker">{(owner && owner.title) || "Campaign"}</p>
                          <h3>{file.title}</h3>
                          <p>{file.description}</p>
                          <div className="st-newspaper__story-meta"><span>{count.length + " public topics"}</span></div>
                          <div className="st-newspaper__story-footer">
                            <button
                              onClick={function (){
                                  setCampaign(file.id);
                                  setSection("");
                                  document.getElementById("latest").scrollIntoView({"behavior":"smooth"});
                                }}>View calls →
                            </button>
                          </div>
                        </div>
                      </article>);
                  })}
                </div>) : (
                <Empty title="No public campaign files yet">
                  Published, discoverable campaigns will appear here. Private workspaces and draft content stay private.
                </Empty>)}
            </section>
            <section
              className="st-newspaper__lead-grid"
              aria-label="Featured prediction and open calls">
              <article className="st-newspaper__lead-story">
                <Cover
                  label={lead ? sectionFor(lead) : (article ? "Published reporting" : "The next edition")}/>
                <div className="st-newspaper__lead-copy">
                  <p className="st-newspaper__article-kicker">{lead ? "Featured question" : "From the newsroom"}</p>
                  {lead ? (
                    <div>
                      <h2><a href={"/questions/" + lead.id}>{lead.title}</a></h2>
                      <p>{lead.description}</p>
                      <div className="st-newspaper__prediction-read">
                        <div>
                          <span>Resolution horizon</span>
                          <strong>
                            {(lead.detail && lead.detail.horizon) || closingLabel(lead.time_close)}
                          </strong>
                        </div>
                        <div className="st-newspaper__prediction-meta"><span>{closingLabel(lead.time_close)}</span></div>
                      </div>
                      <div className="st-newspaper__story-footer"><a href={"/questions/" + lead.id}>Open question →</a></div>
                    </div>) : (article ? (
                    <div>
                      <h2><a href={"/newsroom/" + article.id}>{article.headline}</a></h2>
                      <p>{article.standfirst}</p>
                      <div className="st-newspaper__story-footer">
                        <a href={"/newsroom/" + article.id}>Read the full article →</a>
                      </div>
                    </div>) : (
                    <Empty title="No open prediction calls yet">
                      Questions appear once they are public and open for forecasts. Draft proposals are not published questions.
                    </Empty>))}
                </div>
              </article>
              <aside className="st-newspaper__dispatches">
                <Heading
                  kicker="Dispatches"
                  title="Open calls"
                  count={model.topics.length}/>
                <div className="st-newspaper__dispatch-list">
                  {model.topics.slice(1,4).map(function (topic,index){
                    return (
                      <article className="st-newspaper__dispatch" key={topic.id}>
                        <span className="st-newspaper__dispatch-number">{"0" + (index + 1)}</span>
                        <div>
                          <p className="st-newspaper__article-kicker">{sectionFor(topic)}</p>
                          <h3><a href={"/questions/" + topic.id}>{topic.title}</a></h3>
                          <div className="st-newspaper__dispatch-signal"><span>{closingLabel(topic.time_close)}</span></div>
                        </div>
                      </article>);
                  })}
                  {(model.topics.length < 2) ? (
                    <p className="st-newspaper__empty">More public questions will appear as they open.</p>) : null}
                </div>
              </aside>
            </section>
            <section className="st-newspaper__section" id="latest">
              <Heading
                kicker="Latest"
                title="Open prediction calls"
                count={model.topics.length}/>
              {(model.topics.length > 0) ? (
                <div className="st-newspaper__story-grid">
                  {model.topics.map(function (topic){
                    return (
                      <TopicCard key={topic.id} topic={topic}/>);
                  })}
                </div>) : (
                <Empty
                  title={(query || section || campaign) ? "No questions match these filters" : "The edition is awaiting public questions"}>
                  Only public questions in active campaigns are listed. Use Refresh edition after publishing content.
                </Empty>)}
            </section>
            <section className="st-newspaper__read-grid" id="closing">
              <section className="st-newspaper__most-read">
                <Heading kicker="Closing soon" title="The next deadlines"/>
                {(model.closing.length > 0) ? (
                  <ol>
                    {model.closing.map(function (topic,index){
                      return (
                        <li key={topic.id}>
                          <span>{"0" + (index + 1)}</span>
                          <div>
                            <p className="st-newspaper__article-kicker">{sectionFor(topic)}</p>
                            <h3><a href={"/questions/" + topic.id}>{topic.title}</a></h3>
                            <small>{closingLabel(topic.time_close)}</small>
                          </div>
                        </li>);
                    })}
                  </ol>) : (
                  <p className="st-newspaper__empty">No upcoming public deadlines.</p>)}
              </section>
              <aside className="st-newspaper__principle">
                <p className="st-newspaper__kicker">Your next call</p>
                <h2>Call what happens next.</h2>
                <a className="st-newspaper__button" href="#latest">Explore open questions →</a>
              </aside>
            </section>
            <section className="st-newspaper__evidence" id="evidence">
              <Heading
                kicker="Evidence"
                title="Published reporting"
                count={model.articles.length}/>
              {(model.articles.length > 0) ? (
                <div className="st-newspaper__evidence-grid">
                  {model.articles.slice(0,6).map(function (row){
                    return (
                      <article key={row.id}>
                        <span>{row.organization}</span>
                        <h3><a href={"/newsroom/" + row.id}>{row.headline}</a></h3>
                        <p>{row.standfirst}</p>
                        <small>
                          {((row.sources && row.sources.length) || 0) + " cited sources"}
                        </small>
                        <ul className="st-newspaper__source-list">
                          {(row.sources || []).slice(0,2).map(function (source,index){
                            let url = safeSourceUrl(source.url);
                            return (
                              <li key={index}>
                                {url ? (
                                  <a href={url} rel="noopener noreferrer" target="_blank">{source.title}</a>) : (
                                  <span>{source.title}</span>)}
                              </li>);
                          })}
                        </ul>
                        <a href={"/newsroom/" + row.id}>Read the file →</a>
                      </article>);
                  })}
                </div>) : (
                <Empty title="No published reporting yet">
                  Only approved and explicitly published articles appear here. Sources and citations remain attached to each article.
                </Empty>)}
              <div className="st-newspaper__evidence-footer"><a href="/newsroom">Browse the newsroom →</a></div>
            </section>
            <section
              className="st-newspaper__section st-newspaper__beats"
              id="desks">
              <Heading
                kicker="Desks"
                title="By subject"
                count={model.sections.length}/>
              {(model.sections.length > 0) ? (
                <div className="st-newspaper__beat-grid">
                  {model.sections.map(function (desk,index){
                    return (
                      <button
                        className="st-newspaper__beat"
                        key={desk.title}
                        onClick={function (){
                            choose(desk.title);
                          }}
                        aria-pressed={section == desk.title}>
                        <span className="st-newspaper__beat-number">{"0" + (index + 1)}</span>
                        <span className="st-newspaper__article-kicker">Public questions</span>
                        <strong>{desk.title}</strong>
                        <small>{desk.count + " calls →"}</small>
                      </button>);
                  })}
                </div>) : (
                <p className="st-newspaper__empty">Subject desks will populate from published questions.</p>)}
            </section>
          </div>)}
      </main>
      <footer className="st-newspaper__footer">
        <Wordmark/>
        <nav aria-label="Footer navigation">
          <a href="/newsroom">Newsroom</a>
          <a href="/manage">Brand workspace</a>
          <a href="/about/privacy">Privacy</a>
          <a href="/about/terms">Terms</a>
        </nav>
      </footer>
    </div>);
}

// statstrade-web.feature.home.newspaper/Homepage [207] 
export function Homepage(){
  let api = page_api.usePageApi("landing");
  let entry = React.useContext(auth.AuthEntryContext);
  return (
    <Newspaper
      snapshot={api.data}
      loading={api.owner.status == "loading"}
      error={api.error}
      refresh={api.refresh}
      busy={api.busy}
      signedIn={Boolean(entry && entry.authenticated)}/>);
}