'use client'

import React from 'react'

import * as sb from '@statstrade/edge/remote/util-supabase.jsx'

import * as substrate from '@statstrade/web-superadmin/lib/substrate-worker.jsx'

import * as layout_base from '@statstrade/component/layout/layout-base.jsx'

// statstrade-superadmin.pages._app/AppLayout [15] 
function AppLayout({Component,pageProps}){
  let [session] = sb.useListenSession();
  let user = session["user"] || {};
  let actor_id = user["id"];
  let token = session["access_token"];
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
        options={{
            "client_id":"statstrade-superadmin-" + tab_scope,
            "worker_url":"/workers/web.sharedworker.js",
            "config":config
          }}><Component>{pageProps}</Component>
      </substrate.SubstrateProvider>
    </layout_base.LayoutBase>);
}

export default AppLayout