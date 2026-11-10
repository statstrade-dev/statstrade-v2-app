import * as ui_router from '@statstrade/component/ui-router.jsx'

import * as page_api from '@statstrade/edge/substrate/page-api.jsx'

import * as reputation from '@statstrade/feature/reputation/public-summary.jsx'

// statstrade-web.feature.profile.profile-public/profile-handle-from-path [12] 
export function profile_handle_from_path(pathname){
  let parts = (pathname || "").split("/");
  let handle = parts[2] || "";
  if(!(parts[1] == "u") || !handle){
    return null;
  }
  try{
    return decodeURIComponent(handle);
  }
  catch(e){
    return handle;
  }
}

// statstrade-web.feature.profile.profile-public/profile-display-name [23] 
export function profile_display_name(profile){
  let firstName = (profile.first_name || "").trim();
  let lastName = (profile.last_name || "").trim();
  let hasFirst = !(firstName == "");
  let hasLast = !(lastName == "");
  let name = (hasFirst && hasLast && (firstName + " " + lastName)) || (hasFirst && firstName) || (hasLast && lastName);
  return name || (profile.handle && ("@" + profile.handle)) || "";
}

// statstrade-web.feature.profile.profile-public/profile-location [35] 
export function profile_location(profile){
  let city = (profile.city || "").trim();
  let country = (profile.country_code || "").trim();
  if(city && country){
    return city + ", " + country;
  }
  else if(city){
    return city;
  }
  else if(country){
    return country;
  }
  else{
    return "";
  }
}

// statstrade-web.feature.profile.profile-public/PublicProfile [45] 
export function PublicProfile(){
  let pathname = ui_router.usePathname();
  let handle = profile_handle_from_path(pathname);
  let api = page_api.usePageApi("public-profile");
  let profile = api.data.profile;
  let loading = api.owner.status == "loading";
  let error = api.owner.error;
  return (
    <section className="st-page st-user-page">
      <p className="st-kicker">Participant / public profile</p>
      {loading ? (
        <p role="status" className="st-notice">Loading profile…</p>) : (error ? (
        <p role="alert" className="st-notice">{error}</p>) : (!profile ? (
        <section className="st-panel">
          <h1>Profile not found</h1>
          <p role="status">This public profile is unavailable.</p>
        </section>) : (
        <div>
          <header className="st-profile-identity">
            <div className="st-profile-avatar" aria-hidden={true}>
              {(profile.first_name || profile.handle || "?").slice(0,1).toUpperCase()}
            </div>
            <div>
              <h1>{profile_display_name(profile)}</h1>
              <p>{"@" + profile.handle}</p>
              {profile_location(profile) ? (
                <p>{profile_location(profile)}</p>) : null}
            </div>
          </header>
          {profile.bio ? (
            <section className="st-panel"><h2>About</h2><p>{profile.bio}</p></section>) : null}
          <section className="st-panel">
            <reputation.PublishedReputation summaries={api.data.reputation}/>
          </section>
        </div>)))}
    </section>);
}