import React from 'react'

import * as router from 'next/router'

import Link from 'next/link'

import * as registry from '@statstrade/web-main/groups/registry.jsx'

import * as worker from '@statstrade/edge/substrate/worker.jsx'

import * as auth from '@statstrade/edge/remote/util-supabase.jsx'

import * as global from '@statstrade/edge/global-store.jsx'

import * as api from '@statstrade/edge/substrate/page-api.jsx'

import * as common from '@statstrade/edge/substrate/common.jsx'

import * as visual from '@statstrade/feature/visual/shell.jsx'

// statstrade-web.lib.page-models/PublicModels [13] 
export function PublicModels({scope,children}){
  let options = React.useMemo(function (){
    return {
      "client_id":"web-main/public/" + scope,
      "worker_url":"/workers/web.sharedworker.js",
      "config":worker.createConfig(null,null)
    };
  },[scope]);
  return (
    <worker.SubstrateProvider options={options}>{children}</worker.SubstrateProvider>);
}

// statstrade-web.lib.page-models/PageModels [17] 
export function PageModels({routeKey,children}){
  let entry = React.useContext(auth.AuthEntryContext);
  let route = router.useRouter();
  let [brand] = global.useStore(["context","organisation"]);
  let scope = React.useRef(null);
  if(!scope.current){
    scope.current = crypto.randomUUID();
  }
  let definition = registry.Routes[routeKey];
  let actor = entry && entry.session && entry.session.user && entry.session.user.id;
  let private_page = definition && ["brand","member"].includes(definition.area);
  let resource = entry && entry.worker && entry.worker.ready && {
    "client":entry.worker.client,
    "config":{"primary":{"id":"db/primary"}},
    "scope-id":"web-main/" + scope.current + "/" + actor
  };
  if(definition && routeKey.includes("[") && !route.isReady){
    return (
      <p role="status">Loading page…</p>);
  }
  if(private_page && (entry && (entry.status == "loading"))){
    return (
      <p role="status">Restoring your sign-in…</p>);
  }
  if(private_page && entry.error){
    return (
      <section className="st-auth-gate">
        <h1>Unable to restore sign-in</h1>
        <p role="alert">{entry.error}</p>
        <button onClick={entry.refetch}>Retry sign-in</button>
        <Link href="/sign-in">Sign in</Link>
      </section>);
  }
  if(private_page && !actor){
    return (
      <section className="st-auth-gate">
        <p className="st-kicker">Your workspace</p>
        <h1>Sign in required</h1>
        <p>Use your account to open this workspace.</p>
        <Link className="st-primary-button" href="/sign-in">Sign in to Statstrade</Link>
      </section>);
  }
  if(private_page && !resource){
    return (
      <section className="st-auth-gate">
        <p role="status">Connecting your page models…</p>
        {(entry && entry.worker && entry.worker.error) ? (
          <p role="alert">{entry.worker.error.message}</p>) : null}
      </section>);
  }
  let content = (
    <api.PageContext.Provider
      value={{
          "groups":registry.Groups,
          "route":definition,
          "params":route.query,
          "actor":actor,
          "token":entry && entry.session && entry.session.access_token,
          "brand":brand && brand.id
        }}>
      <visual.StaffBoundary>
        {(definition && (definition.area == "brand")) ? (
          <visual.BrandBoundary>{children}</visual.BrandBoundary>) : children}
      </visual.StaffBoundary>
    </api.PageContext.Provider>);
  if(resource){
    return (
      <common.SubstrateContext.Provider value={{"resource":resource}}>{content}</common.SubstrateContext.Provider>);
  }
  if(definition && Object.values(definition.models).some(function (model){
    return !(model.kind == "local");
  })){
    return (
      <PublicModels scope={scope.current}>{content}</PublicModels>);
  }
  return content;
}