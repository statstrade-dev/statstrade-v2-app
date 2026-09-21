'use client'

import React from 'react'

import * as kernel_supabase from '@xtalk/db/node/kernel-supabase.js'

import * as client_supabase from '@xtalk/db/node/client-supabase.js'

import * as dbmain from '@xtalk/db/system/main.js'

import * as substrate from '@xtalk/substrate/substrate.js'

// statstrade-superadmin.pages.index/createNode [14] 
function createNode(){
  let url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
  let secured = url.protocol == "https:";
  let pathname = url.pathname;
  let defaults = {
    "host":url.hostname,
    "port":url.port ? url.port : (secured ? 443 : 80),
    "secured":secured,
    "basepath":(pathname == "/") ? "" : pathname,
    "apikey":process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  };
  let impl = dbmain.create_impl("supabase",defaults,null,null);
  let node = substrate.node_create({"id":"statstrade-superadmin-node"});
  substrate.set_service(node,"db/primary",impl);
  kernel_supabase.init_handlers(node);
  return node;
}

// statstrade-superadmin.pages.index/ping [31] 
async function ping(node){
  return await client_supabase.rpc_call(node,"db/primary","ping",{},{
    "headers":{"Accept-Profile":"stats_rpc","Content-Profile":"stats_rpc"}
  });
}

// statstrade-superadmin.pages.index/Page [43] 
function Page(){
  let [status,setStatus] = React.useState("loading");
  React.useEffect(function (){
    let cancelled = false;
    let run = async function (){
      try{
        let node = createNode();
        let result = await ping(node);
        if(!cancelled){
          setStatus(result);
        }
      }
      catch(e){
        if(!cancelled){
          setStatus("error");
        }
      }
    };
    run();
    return function (){
      cancelled = true;
    };
  },[]);
  return (status == "loading") ? "XTalk ping: loading" : ((status == "pong") ? "XTalk ping: pong" : "XTalk ping: error");
}

export default Page