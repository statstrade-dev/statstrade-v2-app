// statsui.edge.substrate.network-trace/LIMIT [6] 
export var LIMIT = 150;

// statsui.edge.substrate.network-trace/BODY_LIMIT [7] 
export var BODY_LIMIT = 16384;

// statsui.edge.substrate.network-trace/sensitive [9] 
export function sensitive(key){
  let name = String(key).toLowerCase().replace(new RegExp("[-_]","g"),"");
  return new RegExp(
    "authorization|cookie|password|passwd|passphrase|secret|credential"
  ).test(name) || [
    "pwd",
    "apikey",
    "anonkey",
    "publishablekey",
    "servicerolekey",
    "privatekey",
    "signingkey",
    "session",
    "sessionid",
    "codeverifier",
    "codechallenge"
  ].includes(name) || name.endsWith("token") || name.endsWith("jwt") || name.endsWith("apikey");
}

// statsui.edge.substrate.network-trace/safeString [15] 
export function safeString(value){
  return String(value).replace(new RegExp("Bearer[ ]+[^ <>]+","gi"),"Bearer [REDACTED]").replace(
    new RegExp("eyJ[A-Za-z0-9_-]+[.][A-Za-z0-9_-]+[.][A-Za-z0-9_-]+","g"),
    "[REDACTED]"
  ).replace(
    new RegExp("sb_(secret|publishable)_[A-Za-z0-9_-]+","g"),
    "[REDACTED]"
  ).slice(0,1500);
}

// statsui.edge.substrate.network-trace/sanitize [22] 
export function sanitize(value,depth = 0){
  if(depth > 6){
    return "[Depth limit]";
  }
  if(value == null){
    return null;
  }
  if((typeof value) == "string"){
    return safeString(value);
  }
  if(Array.isArray(value)){
    let result = value.slice(0,40).map(function (item){
      return sanitize(item,depth + 1);
    });
    if(value.length > 40){
      result.push("[Remaining items omitted]");
    }
    return result;
  }
  if((typeof value) == "object"){
    let out = {};
    Object.keys(value).slice(0,60).forEach(function (key){
      if(!["__proto__","constructor","prototype"].includes(key)){
        out[key] = (sensitive(key) ? "[REDACTED]" : sanitize(value[key],depth + 1));
      }
    });
    return out;
  }
  return value;
}

// statsui.edge.substrate.network-trace/parseBody [39] 
export function parseBody(body){
  if(body == null){
    return null;
  }
  if(!((typeof body) == "string") || (body.length > BODY_LIMIT)){
    return "[Non-JSON or oversized body omitted]";
  }
  try{
    return sanitize(JSON.parse(body));
  }
  catch(_){
    return "[Non-JSON body omitted]";
  }
}

// statsui.edge.substrate.network-trace/safeUrl [46] 
export function safeUrl(url){
  let result = new URL(url);
  result.username = "";
  result.password = "";
  result.hash = "";
  result.searchParams.forEach(function (value,key){
    result.searchParams.set(key,sensitive(key) ? "[REDACTED]" : safeString(value));
  });
  return result.toString();
}

// statsui.edge.substrate.network-trace/headers [53] 
export function headers(input,response){
  let source = new Headers(input);
  let out = {};
  (response ? ["content-type","content-range"] : ["content-type","content-profile","accept-profile"]).forEach(function (key){
    let value = source.get(key);
    if(value){
      out[key] = safeString(value);
    }
  });
  return out;
}

// statsui.edge.substrate.network-trace/responseBody [62] 
export async function responseBody(response){
  let type = response.headers.get("content-type") || "";
  if(!type.includes("json")){
    return "[Non-JSON body omitted]";
  }
  if(Number(response.headers.get("content-length")) > BODY_LIMIT){
    return "[Oversized body omitted]";
  }
  let copy = response.clone();
  if(!copy.body){
    return null;
  }
  let reader = copy.body.getReader();
  let decoder = new TextDecoder();
  let text = "";
  let size = 0;
  try{
    while(true){
      let part = await reader.read();
      if(part.done){
        break;
      }
      size = (size + part.value.byteLength);
      if(size > BODY_LIMIT){
        reader.cancel().catch(function (){
          return null;
        });
        return "[Oversized body omitted]";
      }
      text = (text + decoder.decode(part.value,{"stream":true}));
    }
    text = (text + decoder.decode());
    return parseBody(text);
  }
  catch(_){
    return "[Body unavailable]";
  }
}

// statsui.edge.substrate.network-trace/createRecorder [86] 
export function createRecorder(emit,fetchFn,clock = Date.now){
  let entries = [];
  let sequence = 0;
  let revision = 0;
  let floor = 0;
  let epoch = 0;
  let copy = function (value){
    return JSON.parse(JSON.stringify(value));
  };
  let notify = function (event){
    try{
      Promise.resolve(emit(copy(event))).catch(function (){
        return null;
      });
    }
    catch(_){
      return null;
    }
  };
  let save = function (entry,generation){
    if(!(generation == epoch)){
      return;
    }
    revision = (revision + 1);
    entry.revision = revision;
    entries = entries.filter(function (old){
      return !(old.id == entry.id);
    });
    entries.push(copy(entry));
    entries.sort(function (a,b){
      return a.id - b.id;
    });
    entries = entries.slice(-LIMIT);
    notify({
      "type":"upsert",
      "revision":revision,
      "floor":floor,
      "entry":entry
    });
  };
  let snapshot = function (){
    return copy({
      "type":"snapshot",
      "revision":revision,
      "floor":floor,
      "entries":entries
    });
  };
  let clear = function (){
    epoch = (epoch + 1);
    revision = (revision + 1);
    floor = revision;
    entries = [];
    let event = {"type":"clear","revision":revision,"floor":floor,"entries":[]};
    notify(event);
    return copy(event);
  };
  let tracedFetch = async function (input,options){
    let url = null;
    try{
      url = new URL(((typeof input) == "string") ? input : input.url);
    }
    catch(_){
      return await fetchFn(input,options);
    }
    if(!new RegExp("^/(auth/v1|rest/v1|graphql/v1)(/|$)").test(url.pathname)){
      return await fetchFn(input,options);
    }
    let auth = url.pathname.startsWith("/auth/v1");
    let rpc = url.pathname.includes("/rpc/");
    let category = auth ? "Auth" : (rpc ? "RPC" : (url.pathname.startsWith("/graphql") ? "GraphQL" : "REST"));
    let settings = options || {};
    let started = clock();
    let generation = epoch;
    sequence = (sequence + 1);
    let entry = {
      "response":null,
      "path":url.pathname,
      "category":category,
      "rpc":rpc ? url.pathname.split("/").pop() : null,
      "request":{
            "headers":headers(settings.headers || (input && input.headers),false),
            "body":auth ? "[Auth payload omitted]" : parseBody(settings.body)
          },
      "method":settings.method || (input && input.method) || "GET",
      "pending":true,
      "time":started,
      "duration":null,
      "status":null,
      "id":sequence,
      "url":safeUrl(url.href)
    };
    save(entry,generation);
    try{
      let response = await fetchFn(input,options);
      entry.status = response.status;
      entry.pending = false;
      entry.duration = Math.max(0,clock() - started);
      entry.response = {
        "headers":headers(response.headers,true),
        "body":auth ? "[Auth payload omitted]" : "[Loading body]"
      };
      save(entry,generation);
      if(!auth){
        responseBody(response).then(function (body){
          entry.response.body = body;
          save(entry,generation);
        }).catch(function (){
          return null;
        });
      }
      return response;
    }
    catch(error){
      entry.pending = false;
      entry.status = 0;
      entry.duration = Math.max(0,clock() - started);
      entry.error = "Network request failed or was aborted";
      save(entry,generation);
      throw error;
    }
  };
  return {"fetch":tracedFetch,"snapshot":snapshot,"clear":clear};
}

// statsui.edge.substrate.network-trace/install [154] 
export function install(emit){
  if(globalThis.statstradeNetworkRecorder){
    return globalThis.statstradeNetworkRecorder;
  }
  let original = globalThis.fetch.bind(globalThis);
  let recorder = createRecorder(emit,original,Date.now);
  globalThis.fetch = recorder.fetch;
  globalThis.statstradeNetworkRecorder = recorder;
  return recorder;
}