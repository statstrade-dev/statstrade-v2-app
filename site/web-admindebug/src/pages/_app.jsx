'use client'

import React from 'react'

import '../styles.css'

import * as sb from '@statstrade/edge/remote/util-supabase.jsx'

import * as substrate from '@statstrade/web-admindebug/lib/substrate.jsx'

import * as layout_base from '@statstrade/component/layout/layout-base.jsx'

// statstrade-admindebug.pages._app/AppLayout [16] 
function AppLayout({Component,pageProps}){
  let [session] = sb.useListenSession();
  let user = (session && session.user) || {};
  let actor_id = user["id"];
  let token = session && session.access_token;
  let tab_scope_ref = React.useRef(null);
  if(!tab_scope_ref["current"]){
    tab_scope_ref["current"] = ("tab-" + Math.random().toString(36).substr(2,14));
  }
  let tab_scope = tab_scope_ref["current"];
  let config = React.useMemo(function (){
    return substrate.createConfig(token,actor_id);
  },[token,actor_id]);
  return (
    <layout_base.LayoutBase showDevtool={true}>
      <substrate.SubstrateProvider
        key={actor_id || "GUEST"}
        options={{
            "client_id":"statstrade-admindebug-" + tab_scope,
            "worker_url":"/workers/web.sharedworker.js",
            "config":config
          }}>{React.createElement(Component,pageProps)}
      </substrate.SubstrateProvider>
    </layout_base.LayoutBase>);
}

export default AppLayout