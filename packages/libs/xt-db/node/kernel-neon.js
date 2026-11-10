const session = require("@xtalk/db/system/impl-neon-session.js")

const substrate = require("@xtalk/substrate/substrate.js")

function sign_up_handler(space,args,request,node){
  return session.sign_up(substrate.get_service(node,args[0]),args[1]);
}

function sign_in_handler(space,args,request,node){
  return session.sign_in(substrate.get_service(node,args[0]),args[1]);
}

function sign_out_handler(space,args,request,node){
  return session.sign_out(substrate.get_service(node,args[0]));
}

function current_session_handler(space,args,request,node){
  return session.current_session(substrate.get_service(node,args[0]));
}

function refresh_session_handler(space,args,request,node){
  return session.refresh_session(substrate.get_service(node,args[0]));
}

function init_handlers(node){
  substrate.register_handler(node,"@xt.neon/sign-up",sign_up_handler,null);
  substrate.register_handler(node,"@xt.neon/sign-in",sign_in_handler,null);
  substrate.register_handler(node,"@xt.neon/sign-out",sign_out_handler,null);
  substrate.register_handler(node,"@xt.neon/current-session",current_session_handler,null);
  substrate.register_handler(node,"@xt.neon/refresh-session",refresh_session_handler,null);
  return node;
}

module.exports = {
  ["sign_up_handler"]:sign_up_handler,
  ["sign_in_handler"]:sign_in_handler,
  ["sign_out_handler"]:sign_out_handler,
  ["current_session_handler"]:current_session_handler,
  ["refresh_session_handler"]:refresh_session_handler,
  ["init_handlers"]:init_handlers
}