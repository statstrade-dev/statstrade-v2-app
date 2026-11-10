import * as router from 'next/router'

import * as civic from '@statstrade/feature/civic/pages.jsx'

import * as page from '@statstrade/edge/substrate/group-page.jsx'

import * as page_api from '@statstrade/edge/substrate/page-api.jsx'

import * as article from '@statstrade/feature/newsroom/article.jsx'

// statstrade-web.feature.newsroom.public-page/Articles [13] 
export function Articles({owner,publication_id}){
  let rows = page.useGroupModel(owner["handle"],"snapshot");
  let selected = rows.find(function (row){
    return row["id"] == publication_id;
  });
  return (
    <section className="st-page st-reporting-page">
      <header className="st-page__heading">
        <div>
          <p className="st-kicker">Newsroom / published reporting</p>
          <h1>
            {publication_id ? "The article file" : "Published reporting"}
          </h1>
          <p>
            Articles, supporting sources and public evidence from the newsroom.
          </p>
        </div>
        <button
          className="st-secondary-button"
          disabled={owner["busy"]}
          onClick={function (){
              owner["controller"].refresh("snapshot");
            }}>Refresh
        </button>
      </header>
      {publication_id ? (selected ? (
        <div>
          <civic.PublicationContext/>
          <a href="/newsroom">← Back to published reporting</a>
          <article.Article article={selected}/>
        </div>) : (
        <section className="st-panel">
          <h2>Article unavailable</h2>
          <p role="status">This article is unavailable or has been withdrawn.</p>
        </section>)) : (
        <section className="st-report-grid">
          {rows.map(function (row){
            return (
              <article key={row["id"]} className="st-panel">
                <p className="st-kicker">{row["organization"]}</p>
                <h2><a href={"/newsroom/" + row["id"]}>{row["headline"]}</a></h2>
                <p>{row["standfirst"]}</p>
                <a
                  className="st-secondary-button"
                  href={"/newsroom/" + row["id"]}>Read the full file →
                </a>
              </article>);
          })}
          {(rows.length == 0) ? (
            <section className="st-panel st-user-empty">
              <h2>No published reporting yet</h2>
              <p>
                Approved articles will appear here once they are explicitly published.
              </p>
              <a className="st-secondary-button" href="/#latest">Explore open questions</a>
            </section>) : null}
        </section>)}
      {owner["error"] ? (
        <p role="alert" className="st-notice">{owner["error"]}</p>) : null}
    </section>);
}

// statstrade-web.feature.newsroom.public-page/PublicationContent [35] 
export function PublicationContent({publication_id}){
  let api = page_api.usePageApi(publication_id ? "newsroom-detail" : "newsroom");
  let owner = api.owner;
  return (owner.status == "ready") ? (
    <Articles
      key={owner.handle.spec.group_id}
      owner={owner}
      publication_id={publication_id}/>) : (
    <section className="st-page">
      <p role="status">
        {(owner.status == "error") ? "Unable to load newsroom publications." : "Loading newsroom…"}
      </p>
      {owner.error ? (
        <p role="alert">{owner.error}</p>) : null}
    </section>);
}

// statstrade-web.feature.newsroom.public-page/NewsroomPage [44] 
export function NewsroomPage({detail}){
  let route = router.useRouter();
  let id = route["query"]["publication_id"];
  return (detail && !route.isReady) ? (
    <p>Loading article…</p>) : (
    <PublicationContent publication_id={detail ? id : null}/>);
}