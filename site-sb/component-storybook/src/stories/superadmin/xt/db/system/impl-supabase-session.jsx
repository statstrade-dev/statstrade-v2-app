import * as xtd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as addon from '@statstrade/edge/lib/xt/net/addon-supabase.jsx'

import * as http_fetch from '@statstrade/edge/lib/xt/net/http-fetch.jsx'

import * as xts from '@statstrade/edge/lib/xt/lang/common-string.jsx'

import * as http_util from '@statstrade/edge/lib/xt/net/http-util.jsx'

// xt.db.system.impl-supabase-session/get-session [13] 
export function get_session(impl){
  return xtd.get_in(impl,["state","session"]);
}

// xt.db.system.impl-supabase-session/set-session [19] 
export function set_session(impl,session){
  xtd.set_in(impl,["state","session"],session);
  xtd.set_in(
    impl,
    ["client","defaults","token"],
    xtd.get_in(session,["access_token"])
  );
  return session;
}

// xt.db.system.impl-supabase-session/refresh-session [28] 
export function refresh_session(impl){
  let {client} = impl;
  let session = xtd.get_in(impl,["state","session"]);
  let refresh_token = xtd.get_in(session,"refresh_token");
  if(null == refresh_token){
    return Promise.resolve().then(function (){
      return null;
    });
  }
  else{
    return http_fetch.request_http(
      client,
      addon.cmd_token_refresh({"refresh_token":refresh_token},{})
    ).then(function (response){
      return set_session(impl,http_util.get_body_data(response));
    }).catch(function (err){
      return err;
    });
  }
}

// xt.db.system.impl-supabase-session/auto-refresh-interval [51] 
export function auto_refresh_interval(impl){
  let configured = xtd.get_in(impl,["opts","auto_refresh_interval"]);
  let expires_in = xtd.get_in(impl,["state","session","expires_in"]);
  if(null != configured){
    return configured;
  }
  else if(null != expires_in){
    return ((expires_in * 1000) >= 60000) ? ((expires_in * 1000) - 60000) : 1000;
  }
  else{
    return 300000;
  }
}

// xt.db.system.impl-supabase-session/auto-refresh-fn [66] 
export function auto_refresh_fn(impl,delay,refresh_id){
  let current_id = xtd.get_in(impl,["state","auto_refresh","current"]);
  if(current_id == refresh_id){
    refresh_session(impl).catch(function (err){
      return err;
    }).then(function (_){
      return new Promise(function (resolve,reject){
        setTimeout(function (){
          new Promise(function (inner_resolve){
            inner_resolve((function (){
              return auto_refresh_fn(impl,auto_refresh_interval(impl),refresh_id);
            })());
          }).then(function (value){
            resolve(value);
          }).catch(function (err){
            reject(err);
          });
        },delay);
      });
    });
    return refresh_id;
  }
  else{
    return current_id;
  }
}

// xt.db.system.impl-supabase-session/auto-refresh-stop [84] 
export function auto_refresh_stop(impl){
  let current_id = xtd.get_in(impl,["state","auto_refresh","current"]);
  xtd.set_in(impl,["state","auto_refresh","current"],null);
  return current_id;
}

// xt.db.system.impl-supabase-session/auto-refresh-start [90] 
export function auto_refresh_start(impl){
  let current_id = xtd.get_in(impl,["state","auto_refresh","current"]);
  if(null != current_id){
    return current_id;
  }
  let refresh_id = xts.str_rand(8);
  xtd.set_in(impl,["state","auto_refresh","current"],refresh_id);
  return auto_refresh_fn(impl,auto_refresh_interval(impl),refresh_id);
}