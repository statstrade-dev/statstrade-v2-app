// xt.db.system.main-client/get-provider [8] 
export function get_provider(type,backends){
  let selected = backends || {};
  let provider = selected[type];
  if(null == provider){
    throw Object.assign(
      new Error("Database backend is not selected"),
      {"data":{"type":type,"selected":Object.keys(selected)}}
    );
  }
  return provider;
}

// xt.db.system.main-client/create-client [18] 
export function create_client(type,defaults,...optional){
  let backends = (optional.length > 0) ? optional[0] : null;
  if(type == "memory"){
    return null;
  }
  let provider = get_provider(type,backends);
  let create = provider["create_client"];
  if(!("function" == (typeof create))){
    throw "Backend provider is missing create_client";
  }
  let client = create(defaults);
  if(null == client){
    throw "Selected backend has no client for this runtime";
  }
  return client;
}