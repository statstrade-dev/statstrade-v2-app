const xtd = require("@xtalk/lang/common-data.js")

const addon = require("@xtalk/net/addon-neon.js")

const realtime = require("@xtalk/db/system/impl-neon-realtime.js")

const common = require("@xtalk/db/system/impl-common.js")

function set_session(impl,session){
  let current = xtd.get_in(impl,["client","defaults","bridge_token"]);
  xtd.set_in(impl,["state","session"],session);
  xtd.set_in(impl,["client","defaults","token"],session["access_token"]);
  xtd.set_in(
    impl,
    ["client","defaults","bridge_token"],
    session["bridge_token"] || current
  );
  return session;
}

function reset_session(impl){
  xtd.set_in(
    impl,
    ["state","auth_epoch"],
    1 + (xtd.get_in(impl,["state","auth_epoch"]) || 0)
  );
  let closing = realtime.stop(impl);
  let caching = realtime.cache_impl(impl);
  if(caching){
    common.clear_db(caching);
  }
  xtd.set_in(impl,["state","session"],null);
  xtd.set_in(impl,["client","defaults","token"],null);
  xtd.set_in(impl,["client","defaults","bridge_token"],null);
  return closing;
}

function authenticate(impl,path,credentials){
  reset_session(impl);
  let epoch = xtd.get_in(impl,["state","auth_epoch"]);
  return addon.bridge_request(impl["client"],path,credentials).then(function (session){
    if(epoch == xtd.get_in(impl,["state","auth_epoch"])){
      return set_session(impl,session);
    }
    return null;
  });
}

function sign_up(impl,credentials){
  return authenticate(impl,"/auth/sign-up",credentials);
}

function sign_in(impl,credentials){
  return authenticate(impl,"/auth/sign-in",credentials);
}

function refresh_session(impl){
  let epoch = xtd.get_in(impl,["state","auth_epoch"]);
  return addon.bridge_request(impl["client"],"/auth/refresh",{}).then(function (session){
    if(!(epoch == xtd.get_in(impl,["state","auth_epoch"]))){
      throw "Neon session changed";
    }
    return set_session(impl,session);
  }).catch(function (err){
    if(epoch == xtd.get_in(impl,["state","auth_epoch"])){
      reset_session(impl);
    }
    throw err;
  });
}

function current_session(impl){
  return refresh_session(impl);
}

function sign_out(impl){
  let task = addon.bridge_request(impl["client"],"/auth/sign-out",{});
  reset_session(impl);
  return task;
}

module.exports = {
  ["set_session"]:set_session,
  ["reset_session"]:reset_session,
  ["authenticate"]:authenticate,
  ["sign_up"]:sign_up,
  ["sign_in"]:sign_in,
  ["refresh_session"]:refresh_session,
  ["current_session"]:current_session,
  ["sign_out"]:sign_out
}