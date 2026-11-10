import React from 'react'

import * as router from 'next/router'

import Head from 'next/head'

import Link from 'next/link'

import * as T from 'tamagui'

import * as auth from '@statstrade/edge/remote/util-supabase.jsx'

import * as global from '@statstrade/edge/global-store.jsx'

import * as page_api from '@statstrade/edge/substrate/page-api.jsx'

// statstrade-web.feature.visual.shell/ShellContext [12] 
export var ShellContext = React.createContext(null);

// statstrade-web.feature.visual.shell/RouteDesigns [13] 
export var RouteDesigns = {
  "/manage/invite":{
    "mode":"organisation",
    "title":"Team & invitations",
    "reference":"/organization/team"
  },
  "/about/privacy":{
    "mode":"document",
    "title":"Privacy",
    "reference":"shared editorial foundations"
  },
  "/manage/settings":{
    "mode":"organisation",
    "title":"Settings",
    "reference":"/organization/settings"
  },
  "/about/cookies":{
    "mode":"document",
    "title":"Cookies",
    "reference":"shared editorial foundations"
  },
  "/about/pricing":{
    "mode":"document",
    "title":"Pricing",
    "reference":"/brand/settings/billing"
  },
  "/manage/analytics":{
    "mode":"organisation",
    "title":"Analytics",
    "reference":"/brand/insights"
  },
  "/manage":{
    "mode":"organisation",
    "title":"Overview",
    "reference":"/organization"
  },
  "/":{"mode":"participant","title":"Today","reference":"/www"},
  "/new-account":{
    "mode":"auth",
    "title":"Create account",
    "reference":"shared foundations"
  },
  "/issues/[issue_id]":{
    "mode":"participant",
    "title":"Issue briefing",
    "reference":"/user/campaign/[id]"
  },
  "/newsroom":{
    "mode":"participant",
    "title":"Published reporting",
    "reference":"/www#evidence"
  },
  "/manage/billing":{
    "mode":"organisation",
    "title":"Billing",
    "reference":"/brand/settings/billing"
  },
  "/manage/tokens":{
    "mode":"organisation",
    "title":"Points & playables",
    "reference":"/brand/rewards"
  },
  "/reputation/design":{
    "mode":"preview",
    "title":"Reputation design preview",
    "reference":"/brand/rewards"
  },
  "/profile":{
    "mode":"participant",
    "title":"Your profile",
    "reference":"/user/profile"
  },
  "/forecasts":{
    "mode":"participant",
    "title":"Forecasts",
    "reference":"/user/discover"
  },
  "/questions/[topic_id]":{
    "mode":"participant",
    "title":"Prediction question",
    "reference":"/user/call/[id]"
  },
  "/activity":{
    "mode":"participant",
    "title":"My activity",
    "reference":"/user/record"
  },
  "/newsroom/[publication_id]":{
    "mode":"participant",
    "title":"Published article",
    "reference":"/www#evidence"
  },
  "/manage/editorial":{
    "mode":"organisation",
    "title":"Editorial desk",
    "reference":"/organization/stories"
  },
  "/about/terms":{
    "mode":"document",
    "title":"Terms",
    "reference":"shared editorial foundations"
  },
  "/about/features":{
    "mode":"document",
    "title":"Features",
    "reference":"shared editorial foundations"
  },
  "/manage/campaigns":{
    "mode":"organisation",
    "title":"Campaigns",
    "reference":"/brand/campaigns"
  },
  "/sign-in":{
    "mode":"auth",
    "title":"Sign in",
    "reference":"shared foundations"
  },
  "/manage/reputation/budgets":{
    "mode":"organisation",
    "title":"Reward budgets",
    "reference":"/brand/rewards"
  },
  "/manage/markets":{
    "mode":"organisation",
    "title":"Prediction questions",
    "reference":"/organization/questions"
  },
  "/u/[handle]":{
    "mode":"participant",
    "title":"Public profile",
    "reference":"/user/person/[handle]"
  },
  "/forgot-password":{
    "mode":"auth",
    "title":"Account recovery",
    "reference":"shared foundations"
  },
  "/manage/reputation":{
    "mode":"organisation",
    "title":"Reputation & rewards",
    "reference":"/brand/rewards"
  },
  "/issues":{
    "mode":"participant",
    "title":"Issues",
    "reference":"/user/discover"
  }
};

// statstrade-web.feature.visual.shell/ParticipantLinks [44] 
export var ParticipantLinks = [
  {"href":"/","label":"Today","icon":"newspaper"},
  {"href":"/issues","label":"Issues","icon":"explore"},
  {"href":"/forecasts","label":"Forecasts","icon":"query_stats"},
  {"href":"/freediving","label":"Freediving","icon":"explore"},
  {"href":"/activity","label":"My activity","icon":"person"}
];

// statstrade-web.feature.visual.shell/OrganisationLinks [50] 
export var OrganisationLinks = [
  {
  "href":"/manage/editorial",
  "label":"Editorial desk",
  "icon":"edit_note"
},
  {"href":"/manage","label":"Overview","icon":"dashboard"},
  {
  "href":"/manage/campaigns",
  "label":"Campaigns",
  "icon":"folder_open"
},
  {
  "href":"/manage/markets",
  "label":"Prediction questions",
  "icon":"query_stats"
},
  {
  "href":"/manage/tokens",
  "label":"Points & playables",
  "icon":"toll"
},
  {
  "href":"/manage/reputation",
  "label":"Reputation & rewards",
  "icon":"workspace_premium"
},
  {
  "href":"/manage/reputation/budgets",
  "label":"Reward budgets",
  "icon":"account_balance_wallet"
},
  {
  "href":"/manage/invite",
  "label":"Team & invitations",
  "icon":"groups"
},
  {
  "href":"/manage/analytics",
  "label":"Analytics",
  "icon":"monitoring"
},
  {
  "href":"/manage/billing",
  "label":"Billing",
  "icon":"credit_card"
},
  {
  "href":"/manage/settings",
  "label":"Settings",
  "icon":"settings"
}
];

// statstrade-web.feature.visual.shell/designFor [62] 
export function designFor(routeKey){
  return RouteDesigns[routeKey] || {
    "mode":"document",
    "title":"Statstrade",
    "reference":"shared foundations"
  };
}

// statstrade-web.feature.visual.shell/activeLink [64] 
export function activeLink(href,path){
  let clean = (path || "").split("#")[0];
  let base = clean.split("?")[0];
  if(href.includes("?")){
    return href == clean;
  }
  if((href == "/manage") && clean.includes("?create=1")){
    return false;
  }
  return (href == base) || ((href == "/newsroom") && base.startsWith("/newsroom/")) || ((href == "/forecasts") && base.startsWith("/questions/")) || ((href == "/issues") && base.startsWith("/issues/"));
}

// statstrade-web.feature.visual.shell/Icon [73] 
export function Icon({name}){
  return (
    <span className="st-material-icon" aria-hidden={true}>{name}</span>);
}

// statstrade-web.feature.visual.shell/NavLink [74] 
export function NavLink({item,path,collapsed,close}){
  let active = activeLink(item.href,path);
  return (
    <Link
      href={item.href}
      prefetch={false}
      className={"st-app-shell__nav-link" + (active ? " active" : "")}
      title={collapsed ? item.label : null}
      aria-label={item.label}
      aria-current={active ? "page" : null}
      onClick={close}>
      <span className="st-app-shell__nav-icon"><Icon name={item.icon}/></span>
      <span>{item.label}</span>
    </Link>);
}

// statstrade-web.feature.visual.shell/Shell [80] 
export function Shell({routeKey,children}){
  let design = designFor(routeKey);
  let route = router.useRouter();
  let entry = React.useContext(auth.AuthEntryContext);
  let [brand,setBrand] = global.useStore(["context","organisation"]);
  let [isStaff,setStaff] = React.useState(false);
  let [workspaces,setWorkspaces] = React.useState([]);
  let [dark,setDark] = React.useState(false);
  let [collapsed,setCollapsed] = React.useState(false);
  let [mobile,setMobile] = React.useState(false);
  let [small,setSmall] = React.useState(false);
  let [jump,setJump] = React.useState(false);
  let [search,setSearch] = React.useState("");
  let [error,setError] = React.useState(null);
  let focusReturn = React.useRef(null);
  let signedIn = Boolean(entry && entry.authenticated);
  let org = design.mode == "organisation";
  let compact = ["auth","document","preview"].includes(design.mode);
  let selected = workspaces.find(function (row){
    return brand && (row.id == brand.id);
  });
  let links = org ? OrganisationLinks : ParticipantLinks;
  let jumpLinks = links.concat(org ? ParticipantLinks : (isStaff ? [
    {
      "href":"/manage/editorial",
      "label":"Editorial desk",
      "icon":"edit_note"
    }
  ] : [])).filter(function (item){
    return item.label.toLowerCase().includes(search.toLowerCase());
  });
  let context = React.useMemo(function (){
    return {"setWorkspaces":setWorkspaces,"setStaff":setStaff};
  },[]);
  function close(){
    setMobile(false);
    setJump(false);
  }
  React.useEffect(function (){
    setDark(localStorage.getItem("statstrade-home-theme") == "dark");
    setCollapsed(localStorage.getItem("st-sidebar-collapsed") == "true");
    let media = window.matchMedia("(max-width: 64rem)");
    let resize = function (){
      setSmall(media.matches);
    };
    resize();
    media.addEventListener("change",resize);
    return function (){
      media.removeEventListener("change",resize);
    };
  },[]);
  React.useEffect(function (){
    close();
    setSearch("");
  },[route.asPath]);
  React.useEffect(function (){
    setWorkspaces([]);
    setStaff(false);
  },[entry && entry.entry && entry.entry.scope]);
  React.useEffect(function (){
    let dialog = jump ? document.querySelector(".st-shell-quick-jump") : ((mobile && small) ? document.getElementById("st-navigation") : null);
    let oldOverflow = document.body.style.overflow;
    if(dialog){
      document.body.style.overflow = "hidden";
      let first = dialog.querySelector("input,button,a[href],select");
      if(first){
        first.focus();
      }
    }
    let keydown = function (event){
      if((event.metaKey || event.ctrlKey) && (event.key.toLowerCase() == "k") && !compact){
        event.preventDefault();
        focusReturn.current = document.activeElement;
        setJump(true);
        setMobile(false);
      }
      if((mobile || jump) && (event.key == "Escape")){
        close();
        if(focusReturn.current){
          focusReturn.current.focus();
        }
      }
      if(dialog && (event.key == "Tab")){
        let focusable = Array.from(dialog.querySelectorAll(
          "a[href],button:not([disabled]),input,select,[tabindex='0']"
        )).filter(function (element){
          return !(null == element.offsetParent);
        });
        let first = focusable[0];
        let last = focusable[focusable.length - 1];
        if(event.shiftKey && (document.activeElement == first)){
          event.preventDefault();
          last.focus();
        }
        if(!event.shiftKey && (document.activeElement == last)){
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown",keydown);
    return function (){
      document.removeEventListener("keydown",keydown);
      document.body.style.overflow = oldOverflow;
    };
  },[mobile,jump,small,compact]);
  if(design.mode == "newspaper"){
    return children;
  }
  return (
    <ShellContext.Provider value={context}>
      <div
        className="st-vl st-app st-app-shell"
        data-theme={dark ? "dark" : "light"}
        data-mode={design.mode}
        data-sidebar-collapsed={collapsed}>
        <Head>
          <title>{design.title + " · Statstrade"}</title>
          <link rel="stylesheet" href="/visual-language.css"/>
        </Head>
        <a className="st-skip-link" href="#st-main">Skip to content</a>
        <header className="st-app-shell__header">
          <div className="st-app-shell__header-start">
            {!compact ? (
              <button
                type="button"
                className="st-app-shell__mobile-menu"
                aria-label="Open navigation"
                aria-controls="st-navigation"
                aria-expanded={mobile}
                onClick={function (event){
                    focusReturn.current = event.currentTarget;
                    setMobile(true);
                  }}><Icon name="menu"/>
              </button>) : null}
            <Link
              className="st-app-shell__header-brand"
              href="/"
              aria-label="Statstrade home">
              <img
                className="st-app-shell__header-mark"
                src="/statstrade-mark.svg"
                alt=""
                width={28}
                height={29}/>
              <span><strong>Statstrade</strong><small>Australia</small></span>
            </Link>
          </div>
          <div className="st-app-shell__header-context">
            <span className="st-app-shell__header-context-label">{org ? "Staff workspace" : "Australia"}</span>
            <strong>{(org && selected && selected.title) || design.title}</strong>
          </div>
          <div className="st-app-shell__header-tools">
            {!compact ? (
              <button
                className="st-shell-quick-jump__trigger"
                type="button"
                aria-label="Search or jump to a section"
                onClick={function (event){
                    focusReturn.current = event.currentTarget;
                    setJump(true);
                  }}>
                <Icon name="search"/>
                <span className="st-shell-quick-jump__label">Search or jump</span>
                <kbd>⌘K</kbd>
              </button>) : null}
            <button
              className="st-secondary-button"
              type="button"
              aria-label="Toggle colour theme"
              aria-pressed={dark}
              onClick={function (){
                  setDark(!dark);
                  localStorage.setItem("statstrade-home-theme",dark ? "light" : "dark");
                }}><Icon name={dark ? "light_mode" : "dark_mode"}/>
            </button>
            {signedIn ? (
              <button
                className="st-secondary-button"
                type="button"
                onClick={async function (){
                    try{
                      let result = await auth.signOut(null,{});
                      if(result.error){
                        throw result.error;
                      }
                      route.push("/");
                    }
                    catch(e){
                      setError(e.message || "Unable to sign out.");
                    }
                  }}>Sign out
              </button>) : (
              <Link
                className="st-primary-button"
                href="/sign-in"
                prefetch={false}>Sign in
              </Link>)}
          </div>
        </header>
        {compact ? null : (
          <React.Fragment>
            {(small && mobile) ? (
              <button
                className="st-app-shell__backdrop st-app-shell__backdrop--visible"
                aria-label="Close navigation backdrop"
                tabIndex={-1}
                onClick={close}/>) : null}
            <aside
              id="st-navigation"
              className={"st-app-shell__sidebar" + (mobile ? " st-app-shell__sidebar--open" : "")}
              role={(small && mobile) ? "dialog" : "complementary"}
              aria-label="Workspace navigation"
              aria-modal={(small && mobile) ? true : null}
              aria-hidden={small && !mobile}>
              <div className="st-app-shell__sidebar-inner">
                {(mobile && small) ? (
                  <button
                    type="button"
                    className="st-secondary-button"
                    onClick={function (){
                        close();
                        if(focusReturn.current){
                          focusReturn.current.focus();
                        }
                      }}>Close navigation
                  </button>) : null}
                <a
                  className="st-app-shell__sidebar-brand"
                  href={org ? "/manage" : "/"}>
                  <Icon name={org ? "business" : "query_stats"}/>
                  <span>
                    <strong>{org ? "Editorial workspace" : "Statstrade"}</strong>
                    <small>Statstrade</small>
                  </span>
                </a>
                {(org && signedIn) ? (
                  <label className="st-workspace-select">
                    Workspace
                    <select
                      aria-label="Workspace"
                      value={(selected && selected.id) || ""}
                      disabled={workspaces.length == 0}
                      onChange={function (event){
                          let row = workspaces.find(function (row){
                            return row.id == event.target.value;
                          });
                          if(row){
                            setBrand(row);
                          }
                        }}>
                      <option value="">Select a workspace</option>
                      {workspaces.map(function (row){
                        return (
                          <option key={row.id} value={row.id}>{row.title}</option>);
                      })}
                    </select>
                  </label>) : null}
                <p className="st-app-shell__nav-label">{org ? "Organisation operations" : "Explore"}</p>
                <nav
                  className="st-app-shell__nav"
                  aria-label="Primary navigation">
                  {links.map(function (item){
                    return (
                      <NavLink
                        key={item.href}
                        item={item}
                        path={route.asPath}
                        collapsed={collapsed}
                        close={close}/>);
                  })}
                </nav>
                {org ? (
                  <nav className="st-app-shell__nav" aria-label="Other workspaces">
                    <NavLink
                      item={{"href":"/","label":"Public platform","icon":"newspaper"}}
                      path={route.asPath}
                      collapsed={collapsed}
                      close={close}/>
                  </nav>) : null}
                {(!org && isStaff) ? (
                  <nav
                    className="st-app-shell__nav st-civic-staff-link"
                    aria-label="Staff tools">
                    <NavLink
                      item={{
                          "href":"/manage/editorial",
                          "label":"Editorial desk",
                          "icon":"edit_note"
                        }}
                      path={route.asPath}
                      collapsed={collapsed}
                      close={close}/>
                  </nav>) : null}
                <button
                  className="st-app-shell__collapse"
                  type="button"
                  aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                  onClick={function (){
                      setCollapsed(!collapsed);
                      localStorage.setItem("st-sidebar-collapsed",collapsed ? "false" : "true");
                    }}>
                  <Icon name={collapsed ? "left_panel_open" : "left_panel_close"}/>
                  {collapsed ? null : (
                    <span>Collapse sidebar</span>)}
                </button>
              </div>
            </aside>
          </React.Fragment>)}
        <main
          className="st-app-shell__main"
          id="st-main"
          tabIndex={-1}
          inert={jump || (mobile && small)}>
          {error ? (
            <p role="alert" className="st-notice">{error}</p>) : null}
          <T.Theme name={dark ? "dark" : "light"}>{children}</T.Theme>
        </main>
        <footer className="st-app-shell__footer">
          <span>Statstrade · Australian issues, evidence & forecasts</span>
          <span>
            <Link href="/about/privacy">Privacy</Link>
             · 
            <Link href="/about/terms">Terms</Link>
          </span>
        </footer>
        {jump ? (
          <React.Fragment>
            <button
              type="button"
              className="st-shell-quick-jump__backdrop"
              aria-label="Close quick navigation backdrop"
              tabIndex={-1}
              onClick={close}/>
            <section
              className="st-shell-quick-jump"
              role="dialog"
              aria-modal={true}
              aria-label="Search or jump">
              <header className="st-shell-quick-jump__header">
                <strong>Search or jump</strong>
                <button
                  className="st-secondary-button"
                  onClick={function (){
                      close();
                      if(focusReturn.current){
                        focusReturn.current.focus();
                      }
                    }}>Close
                </button>
              </header>
              <input
                type="search"
                aria-label="Find a section"
                value={search}
                onChange={function (e){
                    setSearch(e.target.value);
                  }}
                placeholder="Find a page…"/>
              <nav className="st-jump-results">
                {jumpLinks.map(function (item,index){
                  return (
                    <Link
                      key={item.href + index}
                      href={item.href}
                      prefetch={false}
                      onClick={close}><Icon name={item.icon}/>{item.label}
                    </Link>);
                })}
                {(jumpLinks.length == 0) ? (
                  <p>No matching pages.</p>) : null}
              </nav>
            </section>
          </React.Fragment>) : null}
      </div>
    </ShellContext.Provider>);
}

// statstrade-web.feature.visual.shell/BrandBoundary [197] 
export function BrandBoundary({children}){
  let api = page_api.usePageApi("shell");
  let context = React.useContext(ShellContext);
  let route = router.useRouter();
  let [brand,setBrand] = global.useStore(["context","organisation"]);
  let [busy,setBusy] = React.useState(false);
  let [error,setError] = React.useState(null);
  let rows = api.data.organisations || [];
  let ready = api.owner.status == "ready";
  let selected = rows.find(function (row){
    return brand && (row.id == brand.id);
  });
  let rowsKey = JSON.stringify(rows);
  React.useEffect(function (){
    if(ready && context){
      context.setWorkspaces(rows);
    }
    if(ready && !selected && (rows.length > 0)){
      setBrand(rows[0]);
    }
  },[rowsKey,ready,brand && brand.id]);
  if(!ready){
    return (
      <section className="st-auth-gate">
        <p role={api.error ? "alert" : "status"}>{api.error || "Loading your workspaces…"}</p>
        {api.error ? (
          <button className="st-secondary-button" onClick={api.refresh}>Retry</button>) : null}
      </section>);
  }
  if((route.query.create == "1") || (rows.length == 0)){
    return (
      <section className="st-panel st-create-brand">
        <p className="st-kicker">Organisation / setup</p>
        <h1>Create organisation</h1>
        <form
          onSubmit={async function (event){
              event.preventDefault();
              setError(null);
              setBusy(true);
              let data = new FormData(event.currentTarget);
              try{
                let result = await api.mutations.organisation_create.mutateAsync({
                  "m":{
                          "name":String(data.get("name")).trim().toLowerCase(),
                          "title":String(data.get("title")).trim(),
                          "description":String(data.get("description")).trim()
                        }
                });
                let row = (result.data && result.data.o_org) || result.data;
                if(row && row.id){
                  setBrand(row);
                }
                route.replace("/manage");
              }
              catch(e){
                setError(e.message);
              }
              finally{
                setBusy(false);
              }
            }}>
          <label htmlFor="brand-name">Organisation ID</label>
          <input
            id="brand-name"
            name="name"
            required={true}
            minLength={3}
            maxLength={30}
            pattern="[a-z0-9_]+"/>
          <label htmlFor="brand-title">Title</label>
          <input id="brand-title" name="title" required={true}/>
          <label htmlFor="brand-description">Description</label>
          <textarea id="brand-description" name="description"/>
          {error ? (
            <p role="alert">{error}</p>) : null}
          <button className="st-primary-button" type="submit" disabled={busy}>{busy ? "Creating…" : "Create organisation"}</button>
          {(rows.length > 0) ? (
            <Link className="st-secondary-button" href="/manage">Cancel</Link>) : null}
        </form>
      </section>);
  }
  if(!selected){
    return (
      <p role="status" className="st-page">Selecting your workspace…</p>);
  }
  return children;
}

// statstrade-web.feature.visual.shell/StaffBoundary [234] 
export function StaffBoundary({children}){
  let api = page_api.usePageApi("access");
  let context = React.useContext(ShellContext);
  React.useEffect(function (){
    if(context){
      context.setStaff(
        (api.owner.status == "ready") && (true == api.data.is_staff)
      );
    }
  },[api.owner.status,api.data.is_staff]);
  return children;
}