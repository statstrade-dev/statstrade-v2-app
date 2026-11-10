'use client'

import * as newsroom from '@statstrade/feature/newsroom/group.jsx'

import * as page from '@statstrade/edge/substrate/group-page.jsx'

// statstrade-admindebug.pages.newsroom/Snapshot [9] 
function Snapshot({owner}){
  let rows = page.useGroupModel(owner["handle"],"articles");
  return (
    <section>
      <h2>Public projection</h2>
      <p>{rows.length + " published article(s)"}</p>
      <pre>{JSON.stringify(rows,null,2)}</pre>
      <button
        onClick={function (){
            owner["controller"].refresh("articles");
          }}>Refresh publications
      </button>
    </section>);
}

// statstrade-admindebug.pages.newsroom/Page [15] 
function Page(){
  let owner = page.useGroupPage(newsroom.Group,"newsroom-diagnostic",null);
  return (
    <main>
      <a href="/">Admin debug</a>
      <h1>Newsroom diagnostics</h1>
      <p>
        Anonymous publication RPC through the site SharedWorker. Pending imports, predictions and review events are private.
      </p>
      <p role="status">{owner["status"]}</p>
      {owner["error"] ? (
        <p role="alert">{owner["error"]}</p>) : null}
      {(owner["status"] == "ready") ? (
        <Snapshot owner={owner}/>) : null}
    </main>);
}

export default Page