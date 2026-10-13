import * as serverOnly from 'server-only'

import * as crypto from 'node:crypto'

export var OP_TAG = "super_impersonation";

export var TICKET_TTL_MS = 2 * 60 * 1000;

export var SESSION_TTL_MS = 60 * 60 * 1000;

export var JWT_TTL_SECONDS = 5 * 60;

export var COOKIE_NAME = "statstrade_impersonation";

export function json(data,status,headers){
  return Response.json(data,{"status":status,"headers":headers});
}

export function error(message,status){
  return json({"error":message},status,{});
}

export function encode(value){
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

export function digest(value,cryptoImpl){
  return cryptoImpl.createHash("sha256").update(value).digest("hex");
}

export function rowsFrom(value){
  return Array.isArray(value) ? value : (value ? [value] : []);
}

export function requestOrigin(request){
  return request["headers"].get("origin");
}

export function getAllowedOrigins(env){
  let extra = env["NEXT_SERVER_IMPERSONATION_ORIGINS"] ? env["NEXT_SERVER_IMPERSONATION_ORIGINS"].split(",") : [];
  let origins = [
    env["NEXT_PUBLIC_SITE_URL"],
    env["NEXT_PUBLIC_WEB_MAIN_URL"],
    env["NEXT_PUBLIC_WEB_SUPERADMIN_URL"]
  ].concat(extra);
  let cleaned = origins.map(function (origin){
    return origin ? origin.trim() : "";
  });
  let present = cleaned.filter(function (origin){
    return !(origin === "");
  });
  let normalized = present.map(function (origin){
    try{
      return new URL(origin)["origin"];
    }
    catch(e){
      return null;
    }
  });
  return normalized.filter(function (origin){
    return origin;
  });
}

export function hasAllowedOrigin(request,env){
  let origin = requestOrigin(request);
  return origin && getAllowedOrigins(env).includes(origin);
}

export function parseBearer(request){
  let authorization = request["headers"].get("authorization") || "";
  let matched = authorization.match(new RegExp("^Bearer\\s+(.+)$","i"));
  return matched ? matched[1] : null;
}

export function parseCookie(request,name){
  let cookie = request["headers"].get("cookie") || "";
  let pairs = cookie.split(";");
  let pair = pairs.find(function (item){
    let separator = item.indexOf("=");
    if(separator < 0){
      return false;
    }
    let key = item.slice(0,separator).trim();
    return key === name;
  });
  if(!pair){
    return null;
  }
  let separator = pair.indexOf("=");
  let value = pair.slice(separator + 1).trim();
  return decodeURIComponent(value);
}

export function cookieOptions(env,maxAge){
  let parts = [COOKIE_NAME + "=","Path=/","HttpOnly","SameSite=Lax"];
  if(env["NODE_ENV"] === "production"){
    parts.push("Secure");
  }
  parts.push("Max-Age=" + maxAge);
  return parts.join("; ");
}

export function serverConfig(context){
  let env = context["env"];
  let url = env["NEXT_SERVER_SUPABASE_URL"];
  let key = env["NEXT_SERVER_SUPABASE_KEY"];
  if(!url || !key){
    throw new Error("Server Supabase URL and service key are required");
  }
  return {"url":url.replace(new RegExp("/$"),""),"key":key};
}

export async function supabase(context,path,options){
  let fetchImpl = context["fetchImpl"];
  let config = serverConfig(context);
  let method = options["method"] || "GET";
  let token = options["token"];
  let schema = options["schema"];
  let body = options["body"];
  let headers = Object.assign({
    "apikey":config["key"],
    "Authorization":"Bearer " + (token || config["key"])
  },schema ? {"Accept-Profile":schema,"Content-Profile":schema} : {},body ? {"Content-Type":"application/json"} : {},!(method === "GET") ? {"Prefer":"return=representation"} : {});
  let fetchOptions = Object.assign(
    {"method":method,"headers":headers},
    body ? {"body":JSON.stringify(body)} : {}
  );
  let response = await fetchImpl(config["url"] + path,fetchOptions);
  let text = await response.text();
  let data = null;
  if(text){
    try{
      data = JSON.parse(text);
    }
    catch(e){
      data = text;
    }
  }
  if(!response["ok"]){
    let message = data["message"] || data["msg"] || data["error"] || ("Supabase returned " + response["status"]);
    let failure = new Error(message);
    failure["status"] = response["status"];
    throw failure;
  }
  return data;
}

export async function actorFromRequest(context,request){
  let token = parseBearer(request);
  if(!token){
    return {
      "error":error("A signed-in superadmin session is required",401)
    };
  }
  let actor = null;
  try{
    actor = await supabase(context,"/auth/v1/user",{"token":token});
  }
  catch(e){
    return {
      "error":error("The superadmin session is invalid or expired",401)
    };
  }
  if(!actor || !actor["id"]){
    return {"error":error("The superadmin session is invalid",401)};
  }
  let query = new URLSearchParams(
    {"select":"id,is_super","id":"eq." + actor["id"],"limit":"1"}
  );
  let rows = null;
  try{
    rows = rowsFrom(await supabase(
      context,
      "/rest/v1/User?" + query.toString(),
      {"schema":"stats_type"}
    ));
  }
  catch(e){
    return {"error":error("Could not verify superadmin access",503)};
  }
  if((0 === rows["length"]) || !(true === rows[0]["is_super"])){
    return {"error":error("Superadmin access is required",403)};
  }
  return {"actor":actor};
}

export async function start(context,request){
  let env = context["env"];
  let cryptoImpl = context["cryptoImpl"];
  let now = context["now"];
  if(!hasAllowedOrigin(request,env)){
    return error("Origin is not allowed",403);
  }
  let input = null;
  try{
    input = await request.json();
  }
  catch(e){
    return error("A JSON request body is required",400);
  }
  let targetUserId = input ? input["target_user_id"] : null;
  let reasonValue = input ? input["reason"] : null;
  let reason = ("string" === (typeof reasonValue)) ? reasonValue.trim() : "";
  if(!new RegExp("^[0-9a-f]{8}-[0-9a-f-]{27}$","i").test(targetUserId || "")){
    return error("A valid target user id is required",400);
  }
  if((reason["length"] < 8) || (reason["length"] > 500)){
    return error("Provide an audit reason between 8 and 500 characters",400);
  }
  let actorResult = await actorFromRequest(context,request);
  let actor = actorResult["actor"];
  let actorError = actorResult["error"];
  if(actorError){
    return actorError;
  }
  let webMain = env["NEXT_PUBLIC_WEB_MAIN_URL"] || env["NEXT_PUBLIC_SITE_URL"];
  if(!webMain){
    return error("The main web app URL is not configured",503);
  }
  let targetQuery = new URLSearchParams({"select":"id","id":"eq." + targetUserId,"limit":"1"});
  let targets = null;
  try{
    targets = rowsFrom(await supabase(
      context,
      "/rest/v1/User?" + targetQuery.toString(),
      {"schema":"stats_type"}
    ));
  }
  catch(e){
    return error("Could not verify the target user",503);
  }
  if(0 === targets["length"]){
    return error("Target user was not found",404);
  }
  let ticket = cryptoImpl.randomBytes(32).toString("base64url");
  let ticketHash = digest(ticket,cryptoImpl);
  let id = cryptoImpl.randomUUID();
  let createdAt = now();
  let data = {
    "kind":"impersonation_ticket",
    "status":"pending",
    "target_user_id":targetUserId,
    "ticket_hash":ticketHash,
    "reason":reason,
    "expires_at":new Date(createdAt + TICKET_TTL_MS).toISOString()
  };
  try{
    await supabase(context,"/rest/v1/Op",{
      "method":"POST",
      "schema":"stats_type",
      "body":[{"id":id,"tag":OP_TAG,"user_id":actor["id"],"data":data}]
    });
  }
  catch(e){
    return error("Could not create the impersonation audit record",503);
  }
  return json({
    "ticket":ticket,
    "redeem_url":webMain.replace(new RegExp("/$"),"") + "/api/impersonation/redeem"
  },200,{});
}

export async function readTicket(context,request){
  let ticket = null;
  try{
    if((request["headers"].get("content-type") || "").includes("application/json")){
      let body = await request.json();
      ticket = body["ticket"];
    }
    else{
      let form = await request.formData();
      ticket = form.get("ticket");
    }
  }
  catch(e){
    return {
      "error":error("A valid impersonation ticket is required",400)
    };
  }
  if(!("string" === (typeof ticket)) || (ticket["length"] < 32) || (ticket["length"] > 256)){
    return {
      "error":error("A valid impersonation ticket is required",400)
    };
  }
  return {"ticket":ticket};
}

export async function redeem(context,request){
  let env = context["env"];
  let cryptoImpl = context["cryptoImpl"];
  let now = context["now"];
  if(!hasAllowedOrigin(request,env)){
    return error("Origin is not allowed",403);
  }
  let ticketResult = await readTicket(context,request);
  let ticketError = ticketResult["error"];
  if(ticketError){
    return ticketError;
  }
  let ticket = ticketResult["ticket"];
  let ticketHash = digest(ticket,cryptoImpl);
  let query = new URLSearchParams({
    "select":"id,user_id,data,tag",
    "tag":"eq." + OP_TAG,
    "data->>kind":"eq.impersonation_ticket",
    "data->>status":"eq.pending",
    "data->>ticket_hash":"eq." + ticketHash,
    "limit":"1"
  });
  let row = null;
  try{
    row = rowsFrom(await supabase(
      context,
      "/rest/v1/Op?" + query.toString(),
      {"schema":"stats_type"}
    ))[0];
  }
  catch(e){
    return error("Could not redeem the impersonation ticket",503);
  }
  if(!row || (Date.parse(row["data"]["expires_at"] || "") <= now())){
    return error("The impersonation ticket is invalid or expired",410);
  }
  let rowData = row["data"];
  let secret = cryptoImpl.randomBytes(32).toString("base64url");
  let redeemedAt = now();
  let sessionExpires = Math.min(
    Date.parse(rowData["expires_at"]) + SESSION_TTL_MS,
    redeemedAt + SESSION_TTL_MS
  );
  let updatedData = Object.assign({},rowData,{
    "status":"active",
    "redeemed_at":new Date(redeemedAt).toISOString(),
    "session_expires_at":new Date(sessionExpires).toISOString(),
    "session_secret_hash":digest(secret,cryptoImpl)
  });
  let updateQuery = new URLSearchParams({
    "id":"eq." + row["id"],
    "tag":"eq." + OP_TAG,
    "data->>status":"eq.pending",
    "data->>ticket_hash":"eq." + ticketHash,
    "select":"id"
  });
  let updated = null;
  try{
    updated = rowsFrom(await supabase(context,"/rest/v1/Op?" + updateQuery.toString(),{
      "method":"PATCH",
      "schema":"stats_type",
      "body":{"data":updatedData}
    }));
  }
  catch(e){
    return error("Could not activate the impersonation session",503);
  }
  if(0 === updated["length"]){
    return error("The impersonation ticket has already been used",410);
  }
  let cookieValue = row["id"] + "." + secret;
  let cookie = COOKIE_NAME + "=" + encodeURIComponent(cookieValue) + "; Path=/; HttpOnly; SameSite=Lax; Max-Age=" + Math.floor((sessionExpires - redeemedAt) / 1000).toString() + ((env["NODE_ENV"] === "production") ? "; Secure" : "");
  let redirect = new URL("/?impersonation=active",request["url"]);
  return new Response(null,{
    "status":303,
    "headers":{"Location":redirect.toString(),"Set-Cookie":cookie}
  });
}

export async function activeSession(context,request){
  let cryptoImpl = context["cryptoImpl"];
  let now = context["now"];
  let value = parseCookie(request,COOKIE_NAME);
  if(!value){
    return {"error":error("No active impersonation session",401)};
  }
  let separator = value.indexOf(".");
  if(separator < 1){
    return {"error":error("Invalid impersonation session",401)};
  }
  let id = value.slice(0,separator);
  let secret = value.slice(separator + 1);
  if(!new RegExp("^[0-9a-f-]{36}$","i").test(id) || (secret["length"] < 32)){
    return {"error":error("Invalid impersonation session",401)};
  }
  let query = new URLSearchParams({
    "select":"id,user_id,data",
    "id":"eq." + id,
    "tag":"eq." + OP_TAG,
    "limit":"1"
  });
  let row = null;
  try{
    row = rowsFrom(await supabase(
      context,
      "/rest/v1/Op?" + query.toString(),
      {"schema":"stats_type"}
    ))[0];
  }
  catch(e){
    return {
      "error":error("Could not verify the impersonation session",503)
    };
  }
  let expected = row ? (row["data"]["session_secret_hash"] || "") : "";
  let actual = digest(secret,cryptoImpl);
  let matches = (expected["length"] === actual["length"]) && cryptoImpl.timingSafeEqual(Buffer.from(expected),Buffer.from(actual));
  if(!row || !(row["data"]["status"] === "active") || !matches || (Date.parse(row["data"]["session_expires_at"] || "") <= now())){
    return {
      "error":error("The impersonation session is invalid or expired",401)
    };
  }
  return {"row":row};
}

export function createDelegatedToken(context,row){
  let env = context["env"];
  let cryptoImpl = context["cryptoImpl"];
  let now = context["now"];
  let jwk = null;
  try{
    jwk = JSON.parse(env["SUPABASE_IMPERSONATION_PRIVATE_JWK"] || "");
  }
  catch(e){
    throw new Error(
      "SUPABASE_IMPERSONATION_PRIVATE_JWK must contain a private JWK"
    );
  }
  if(!(jwk["kty"] === "EC") || !(jwk["crv"] === "P-256") || !jwk["d"] || !jwk["kid"]){
    throw new Error(
      "SUPABASE_IMPERSONATION_PRIVATE_JWK must be a P-256 signing JWK with a kid"
    );
  }
  let privateKey = cryptoImpl.createPrivateKey({"key":jwk,"format":"jwk"});
  let issuedAt = Math.floor(now() / 1000);
  let rowData = row["data"];
  let sessionExpires = Math.floor(Date.parse(rowData["session_expires_at"]) / 1000);
  let payload = {
    "role":"authenticated",
    "aud":"authenticated",
    "sub":rowData["target_user_id"],
    "user_metadata":{},
    "iss":serverConfig(context)["url"] + "/auth/v1",
    "exp":Math.min(issuedAt + JWT_TTL_SECONDS,sessionExpires),
    "statstrade_impersonation":{"actor_id":row["user_id"],"session_id":row["id"]},
    "app_metadata":{"provider":"impersonation","providers":["impersonation"]},
    "iat":issuedAt
  };
  let signingInput = encode({"alg":"ES256","typ":"JWT","kid":jwk["kid"]}) + "." + encode(payload);
  let signature = cryptoImpl.sign(
    "sha256",
    Buffer.from(signingInput),
    {"key":privateKey,"dsaEncoding":"ieee-p1363"}
  ).toString("base64url");
  return signingInput + "." + signature;
}

export async function token(context,request){
  let sessionResult = await activeSession(context,request);
  let sessionError = sessionResult["error"];
  if(sessionError){
    return sessionError;
  }
  let row = sessionResult["row"];
  try{
    return json({
      "token":createDelegatedToken(context,row),
      "session":{
            "user":{"id":row["data"]["target_user_id"],"is_impersonated":true},
            "actor_id":row["user_id"],
            "session_id":row["id"],
            "expires_at":row["data"]["session_expires_at"]
          }
    },200,{"Cache-Control":"no-store"});
  }
  catch(failure){
    return error(
      failure["message"] || "Could not create a delegated token",
      503
    );
  }
}

export async function end(context,request){
  let env = context["env"];
  let now = context["now"];
  if(!hasAllowedOrigin(request,env)){
    return error("Origin is not allowed",403);
  }
  let sessionResult = await activeSession(context,request);
  let row = sessionResult["row"];
  let sessionError = sessionResult["error"];
  if(sessionError){
    return new Response(null,{
      "status":303,
      "headers":{
            "Location":new URL("/",request["url"]).toString(),
            "Set-Cookie":cookieOptions(env,0)
          }
    });
  }
  let query = new URLSearchParams({
    "id":"eq." + row["id"],
    "tag":"eq." + OP_TAG,
    "data->>status":"eq.active",
    "select":"id"
  });
  let rowData = row["data"];
  let endedData = Object.assign(
    {},
    rowData,
    {"status":"ended","ended_at":new Date(now()).toISOString()}
  );
  try{
    await supabase(context,"/rest/v1/Op?" + query.toString(),{
      "method":"PATCH",
      "schema":"stats_type",
      "body":{"data":endedData}
    });
  }
  catch(e){
    return error("Could not close the impersonation audit session",503);
  }
  return new Response(null,{
    "status":303,
    "headers":{
        "Location":new URL("/",request["url"]).toString(),
        "Set-Cookie":cookieOptions(env,0)
      }
  });
}

export function createSuperImpersonationHandlers(options){
  Object.keys(serverOnly);
  let opts = options || {};
  let env = opts["env"] || process.env;
  let fetchImpl = opts["fetchImpl"] || fetch;
  let cryptoImpl = opts["cryptoImpl"] || crypto;
  let now = opts["now"] || (function (){
    return Date.now();
  });
  let context = {
    "env":env,
    "fetchImpl":fetchImpl,
    "cryptoImpl":cryptoImpl,
    "now":now
  };
  return {
    "start":function (request){
        return start(context,request);
      },
    "redeem":function (request){
        return redeem(context,request);
      },
    "token":function (request){
        return token(context,request);
      },
    "end":function (request){
        return end(context,request);
      }
  };
}