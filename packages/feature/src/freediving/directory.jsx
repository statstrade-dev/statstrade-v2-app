import React from 'react'

import Link from 'next/link'

import * as page_api from '@statstrade/edge/substrate/page-api.jsx'

// statstrade-web.feature.freediving.directory/Categories [3] 
export var Categories = ["club","school","instructor","community"];

// statstrade-web.feature.freediving.directory/States [4] 
export var States = ["ACT","NSW","NT","QLD","SA","TAS","VIC","WA"];

// statstrade-web.feature.freediving.directory/ProfileForm [5] 
export function ProfileForm({listing,api,run}){
  let [profile,setProfile] = React.useState((listing && listing.draft) || {
    "description":"",
    "category":"club",
    "locality":"",
    "name":"",
    "state":"VIC",
    "membership":false,
    "contact_url":"",
    "website":"",
    "social_url":""
  });
  function change(key,value){
    setProfile(Object.assign({},profile,Object.fromEntries([[key,value]])));
  }
  return (
    <form
      className="st-civic-form"
      onSubmit={function (e){
          e.preventDefault();
          run(
            listing ? "submit" : "create",
            listing ? {"id":listing.id,"revision":listing.revision,"profile":profile} : profile
          );
        }}>
      <h2>{listing ? profile.name : "Create a page or group"}</h2>
      {[
        "name",
        "description",
        "locality",
        "website",
        "contact_url",
        "social_url"
      ].map(function (key){
        return (
          <label key={key}>
            {key}
            <input
              ariaLabel={key}
              value={profile[key] || ""}
              required={["name","description","locality"].includes(key)}
              maxLength={(key == "description") ? 4000 : 1000}
              onChange={function (e){
                  change(key,e.target.value);
                }}/>
          </label>);
      })}
      <label>
        Category
        <select
          value={profile.category}
          onChange={function (e){
              change("category",e.target.value);
            }}>
          {Categories.map(function (v){
            return (
              <option key={v} value={v}>{v}</option>);
          })}
        </select>
      </label>
      <label>
        State
        <select
          value={profile.state}
          onChange={function (e){
              change("state",e.target.value);
            }}>
          {States.map(function (v){
            return (
              <option key={v} value={v}>{v}</option>);
          })}
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={profile.membership}
          onChange={function (e){
              change("membership",e.target.checked);
            }}/>
        Enable group membership requests
      </label>
      <p>
        Public profiles and changes are reviewed before publication. Creating a page does not verify your affiliation.
      </p>
      <button className="st-primary-button" disabled={api.busy}>{listing ? "Submit for review" : "Create draft"}</button>
      {listing ? (
        <button
          className="st-secondary-button"
          type="button"
          disabled={api.busy}
          onClick={function (){
              run(
                "save",
                {"id":listing.id,"revision":listing.revision,"profile":profile}
              );
            }}>Save draft
        </button>) : null}
    </form>);
}

// statstrade-web.feature.freediving.directory/Screen [17] 
export function Screen({mode}){
  let api = page_api.usePageApi(mode);
  let context = React.useContext(page_api.PageContext);
  let [error,setError] = React.useState(null);
  let [notice,setNotice] = React.useState(null);
  let [filters,setFilters] = React.useState({"q":"","category":"","state":"","locality":"","offset":0});
  let [evidence,setEvidence] = React.useState("");
  let [reviewNote,setReviewNote] = React.useState("");
  let [listingId,setListingId] = React.useState("");
  let [ownerId,setOwnerId] = React.useState("");
  let item = api.data.listing;
  let run = async function (action,m){
    setError(null);
    setNotice(null);
    try{
      await api.mutations.command.mutateAsync({"action":action,"m":m});
      api.refresh();
      setNotice("Saved. Publication and ownership claims require review.");
    }
    catch(e){
      setError(e.message);
    }
  };
  function filterChange(key,value){
    setFilters(Object.assign(
      {},
      filters,
      Object.assign(Object.fromEntries([[key,value]]),{"offset":0})
    ));
  }
  return (
    <section className="st-page st-civic-page">
      <header className="st-civic-heading">
        <p className="st-kicker">Australian freediving</p>
        <h1>
          {(mode == "dive-review") ? "Directory reviews" : ((mode == "dive-manage") ? "Your pages and groups" : "Freediving pages and groups")}
        </h1>
        <nav className="st-cluster">
          <Link href="/freediving">Directory</Link>
          <Link href="/freediving/manage">Create or manage</Link>
          {api.data.is_staff ? (
            <Link href="/freediving/review">Review queue</Link>) : null}
        </nav>
      </header>
      {(api.owner.status == "loading") ? (
        <p role="status">Loading…</p>) : null}
      {(error || api.error) ? (
        <p role="alert">
          {error || api.error}
          <button onClick={api.refresh}>Retry</button>
        </p>) : null}
      {notice ? (
        <p role="status">{notice}</p>) : null}
      {(mode == "dive-browse") ? (
        <div>
          <form
            className="st-civic-filters"
            onSubmit={function (e){
                e.preventDefault();
                api.setInput(filters);
              }}>
            {["q","locality"].map(function (key){
              return (
                <label key={key}>
                  {(key == "q") ? "Search" : "Locality"}
                  <input
                    value={filters[key]}
                    onChange={function (e){
                        filterChange(key,e.target.value);
                      }}/>
                </label>);
            })}
            {["category","state"].map(function (key){
              return (
                <label key={key}>
                  {key}
                  <select
                    value={filters[key]}
                    onChange={function (e){
                        filterChange(key,e.target.value);
                      }}>
                    <option value="">All</option>
                    {((key == "category") ? Categories : States).map(function (v){
                      return (
                        <option key={v} value={v}>{v}</option>);
                    })}
                  </select>
                </label>);
            })}
            <button className="st-primary-button">Search</button>
          </form>
          <div className="st-civic-issue-grid">
            {(api.data.listings || []).map(function (row){
              return (
                <article className="st-civic-issue-card" key={row.id}>
                  <p>{row.ownership}</p>
                  <h2>
                    <Link href={"/freediving/" + row.slug}>{row.profile.name}</Link>
                  </h2>
                  <p>
                    {row.profile.locality + ", " + row.profile.state + " · " + row.profile.category}
                  </p>
                  <p>{row.profile.description}</p>
                </article>);
            })}
          </div>
          {((api.owner.status == "ready") && ((api.data.listings || []).length == 0)) ? (
            <p>No listings match. Create a page to add your community.</p>) : null}
          <div className="st-civic-pagination">
            <button
              disabled={api.busy || (filters.offset == 0)}
              onClick={function (){
                  let next = Object.assign({},filters,{"offset":Math.max(0,filters.offset - 20)});
                  setFilters(next);
                  api.setInput(next);
                }}>Previous
            </button>
            <button
              disabled={api.busy || ((api.data.listings || []).length < 20)}
              onClick={function (){
                  let next = Object.assign({},filters,{"offset":filters.offset + 20});
                  setFilters(next);
                  api.setInput(next);
                }}>Next
            </button>
          </div>
        </div>) : null}
      {(mode == "dive-detail") ? (item ? (
        <article>
          <p>{item.ownership}</p>
          <h2>{item.profile.name}</h2>
          <p>{item.profile.locality + ", " + item.profile.state}</p>
          <p>{item.profile.description}</p>
          {["website","contact_url","social_url"].map(function (key){
            let url = item.profile[key];
            return url ? (
              <p key={key}>
                <a href={url} target="_blank" rel="noopener noreferrer">{key}</a>
              </p>) : null;
          })}
          {item.source_url ? (
            <p>
              <a
                href={item.source_url}
                target="_blank"
                rel="noopener noreferrer">Listing source
              </a>
              {" · Researched " + item.researched_at}
            </p>) : null}
          {context.actor ? (
            <div>
              {item.claimable ? (
                <form
                  className="st-civic-form"
                  onSubmit={function (e){
                      e.preventDefault();
                      run("claim",{"id":item.id,"evidence":evidence});
                    }}>
                  <label>
                    Your relationship and evidence of representation
                    <textarea
                      required={true}
                      minLength={10}
                      maxLength={4000}
                      value={evidence}
                      onChange={function (e){
                          setEvidence(e.target.value);
                        }}/>
                  </label>
                  <button disabled={api.busy}>Claim this page</button>
                </form>) : null}
              {(item.can_join && !item.is_owner) ? (
                <button
                  disabled={api.busy}
                  onClick={function (){
                      run(item.membership ? "leave" : "join",{"id":item.id});
                    }}>
                  {item.membership ? ((item.membership == "pending") ? "Cancel join request" : "Leave group") : "Request to join"}
                </button>) : null}
              {item.is_owner ? (
                <div>
                  <Link href="/freediving/manage">Manage this page</Link>
                  <h3>Membership</h3>
                  {(item.members || []).map(function (member){
                    return (
                      <p key={member.user_id}>
                        {member.user_id + " · " + member.status}
                        {(member.status == "pending") ? (
                          <button
                            disabled={api.busy}
                            onClick={function (){
                                run("accept-member",{"id":item.id,"user_id":member.user_id});
                              }}>Approve
                          </button>) : null}
                        <button
                          disabled={api.busy}
                          onClick={function (){
                              run("remove-member",{"id":item.id,"user_id":member.user_id});
                            }}>Remove
                        </button>
                      </p>);
                  })}
                </div>) : null}
            </div>) : (
            <Link href="/sign-in">Sign in to claim or join</Link>)}
        </article>) : ((api.owner.status == "ready") ? (
        <p>This page is unavailable.</p>) : null)) : null}
      {(mode == "dive-manage") ? (
        <div>
          <ProfileForm api={api} run={run}/>
          {(api.data.listings || []).map(function (row){
            return (
              <article key={row.id}>
                <p>{row.status + " · revision " + row.revision}</p>
                <p>{row.review_note}</p>
                <Link href={"/freediving/" + row.slug}>View published page</Link>
                <ProfileForm
                  key={row.id + "/" + row.revision}
                  listing={row}
                  api={api}
                  run={run}/>
              </article>);
          })}
          <h2>Your claims</h2>
          {(api.data.claims || []).map(function (c){
            return (
              <p key={c.id}>
                {c.listing_id + " · " + c.status + " · " + (c.note || "Awaiting review")}
              </p>);
          })}
        </div>) : null}
      {(mode == "dive-review") ? (
        <div>
          <label>
            Review note
            <textarea
              value={reviewNote}
              maxLength={2000}
              onChange={function (e){
                  setReviewNote(e.target.value);
                }}/>
          </label>
          <details>
            <summary>Remove a listing or correct ownership</summary>
            <label>
              Listing ID
              <input
                value={listingId}
                onChange={function (e){
                    setListingId(e.target.value);
                  }}/>
            </label>
            <label>
              New owner user ID (empty to revoke ownership)
              <input
                value={ownerId}
                onChange={function (e){
                    setOwnerId(e.target.value);
                  }}/>
            </label>
            <button
              disabled={api.busy || !listingId}
              onClick={function (){
                  run("remove",{"id":listingId,"note":reviewNote});
                }}>Remove listing
            </button>
            <button
              disabled={api.busy || !listingId}
              onClick={function (){
                  run(
                    "reassign",
                    {"id":listingId,"owner_id":ownerId || null,"note":reviewNote}
                  );
                }}>Update ownership
            </button>
          </details>
          {(api.data.listings || []).map(function (row){
            return (
              <article className="st-civic-issue-card" key={row.id}>
                <h2>{row.draft.name}</h2>
                <pre>{JSON.stringify(row.draft,null,2)}</pre>
                {["publish","reject"].map(function (action){
                  return (
                    <button
                      key={action}
                      disabled={api.busy}
                      onClick={function (){
                          run(
                            action,
                            {"id":row.id,"revision":row.revision,"note":reviewNote}
                          );
                        }}>{action}
                    </button>);
                })}
              </article>);
          })}
          {(api.data.claims || []).map(function (c){
            return (
              <article className="st-civic-issue-card" key={c.id}>
                <h2>Ownership claim</h2>
                <p>{"Listing " + c.listing_id + " · applicant " + c.user_id}</p>
                <p>{c.evidence}</p>
                {["approved","rejected"].map(function (decision){
                  return (
                    <button
                      key={decision}
                      disabled={api.busy}
                      onClick={function (){
                          run("review-claim",{
                            "id":c.listing_id,
                            "claim_id":c.id,
                            "decision":decision,
                            "note":reviewNote
                          });
                        }}>{decision}
                    </button>);
                })}
              </article>);
          })}
        </div>) : null}
    </section>);
}