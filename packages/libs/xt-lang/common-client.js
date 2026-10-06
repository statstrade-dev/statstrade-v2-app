const lib = require("@xtalk/lang/common-lib.js")

function client_ws(host,port,opts = {}){
  let {path,secured,listeners = []} = opts || {};
  let conn = new WebSocket(
    "ws" + (secured ? "s" : "") + "://" + host + ":" + port + "/" + (path || "")
  );
  let interval = setInterval(function (){
    conn.send("ping");
  },30000);
  conn.addEventListener("message",function (msg){
    if(msg.data == "pong"){
      return;
    }
    let {body,id} = JSON.parse(msg.data);
    let out = lib.return_eval(body);
    conn.send(JSON.stringify({"id":id,"status":"ok","body":out}))
  });
  conn.addEventListener("close",function (){
    window.clearInterval(interval);
  });
  for(let [tag,callback] of Object.entries(listeners)){
    conn.addEventListener(tag,callback);
  };
  return conn;
}

module.exports = {["client_ws"]:client_ws}