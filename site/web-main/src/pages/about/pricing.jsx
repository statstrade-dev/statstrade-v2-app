// statstrade-web.page.about.pricing/Page [5] 
export function Page(){
  return (
    <section className="st-civic-page">
      <h1>Forecasting points</h1>
      <p>
        Auspolitics points fund forecast allocations. Reputation and category rewards are recorded separately.
      </p>
      <h2>Understand the issue</h2>
      <p>
        Read a sourced briefing, consider what remains uncertain and examine different perspectives.
      </p>
      <h2>Contribute reasoning</h2>
      <p>
        Signed-in members can submit arguments, sources and responses. Editors review contributions before publication.
      </p>
      <h2>Make a forecast</h2>
      <p>
        Choose a clearly resolvable question, review the evidence and track its outcome. Your spending bank and rewards remain private.
      </p>
      <a className="st-primary-button" href="/issues">Explore Australian issues</a>
    </section>);
}

// statstrade-web.page.about.pricing/page-model-key [11] 
Page["pageModelKey"] = "/about/pricing";

export default Page