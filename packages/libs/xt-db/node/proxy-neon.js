const proxy = require("@xtalk/db/node/proxy-util.js")

const substrate = require("@xtalk/substrate/substrate.js")

function init_handlers(node){
  substrate.register_handler(node,"@xt.neon/sign-up",proxy.request_proxy,null);
  substrate.register_handler(node,"@xt.neon/sign-in",proxy.request_proxy,null);
  substrate.register_handler(node,"@xt.neon/sign-out",proxy.request_proxy,null);
  substrate.register_handler(node,"@xt.neon/current-session",proxy.request_proxy,null);
  substrate.register_handler(node,"@xt.neon/refresh-session",proxy.request_proxy,null);
  return node;
}

module.exports = {["init_handlers"]:init_handlers}