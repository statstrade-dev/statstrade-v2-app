const proxy = require("@xtalk/db/node/proxy-util.js")

function sign_up(node,service_id,credentials,opts){
  return proxy.request_client(node,"@xt.neon/sign-up",[service_id,credentials],opts);
}

function sign_in(node,service_id,credentials,opts){
  return proxy.request_client(node,"@xt.neon/sign-in",[service_id,credentials],opts);
}

function sign_out(node,service_id,opts){
  return proxy.request_client(node,"@xt.neon/sign-out",[service_id],opts);
}

function current_session(node,service_id,opts){
  return proxy.request_client(node,"@xt.neon/current-session",[service_id],opts);
}

function refresh_session(node,service_id,opts){
  return proxy.request_client(node,"@xt.neon/refresh-session",[service_id],opts);
}

module.exports = {
  ["sign_up"]:sign_up,
  ["sign_in"]:sign_in,
  ["sign_out"]:sign_out,
  ["current_session"]:current_session,
  ["refresh_session"]:refresh_session
}