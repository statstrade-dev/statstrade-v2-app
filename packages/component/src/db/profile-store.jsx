import * as impl_supabase from '@xtalk/db/system/impl-supabase.js'

import * as main_client from '@xtalk/db/system/main-client.js'

import * as impl_session from '@xtalk/db/system/impl-supabase-session.js'

// statsui.basic.db.profile-store/PROFILE-LOOKUP [9] 
export var PROFILE_LOOKUP = {
  "User":{"schema":"stats_type"},
  "UserSecret":{"schema":"stats_type"}
};

// statsui.basic.db.profile-store/PROFILE-PUBLIC-SPEC [13] 
export var PROFILE_PUBLIC_SPEC = {
  "id":"user_set_public",
  "schema":"stats_rpc",
  "input":[{"symbol":"m"}]
};

// statsui.basic.db.profile-store/PROFILE-SECRET-SPEC [17] 
export var PROFILE_SECRET_SPEC = {
  "id":"user_set_secret",
  "schema":"stats_rpc",
  "input":[{"symbol":"m"}]
};

// statsui.basic.db.profile-store/checked-body [21] 
export function checked_body(response){
  if(response && response.message){
    throw new Error(response.message);
  }
  return response;
}

// statsui.basic.db.profile-store/checked-rows [28] 
export function checked_rows(response){
  let body = checked_body(response);
  if(!Array.isArray(body)){
    throw new Error("The profile request returned an unexpected response.");
  }
  return body;
}

// statsui.basic.db.profile-store/profile-adapter-defaults [36] 
export function profile_adapter_defaults(url_value,api_key){
  let url = new URL(url_value);
  let secured = url.protocol == "https:";
  let pathname = url.pathname;
  return {
    "host":url.hostname,
    "port":url.port ? url.port : (secured ? 443 : 80),
    "secured":secured,
    "basepath":(pathname == "/") ? "" : pathname,
    "apikey":api_key
  };
}

// statsui.basic.db.profile-store/create-profile-adapter [48] 
export function create_profile_adapter(url_value,api_key){
  let defaults = profile_adapter_defaults(url_value,api_key);
  let client = main_client.create_client("supabase",defaults);
  return impl_supabase.impl_supabase(client,{},PROFILE_LOOKUP);
}

// statsui.basic.db.profile-store/set-profile-session [55] 
export function set_profile_session(adapter,session){
  return impl_session.set_session(adapter,session);
}

// statsui.basic.db.profile-store/public-profile-tree [60] 
export function public_profile_tree(handle){
  return [
    "User",
    {"handle":handle},
    ["handle","first_name","last_name","country_code","city","bio"]
  ];
}

// statsui.basic.db.profile-store/owner-profile-tree [66] 
export function owner_profile_tree(user_id){
  return [
    "User",
    {"id":user_id},
    [
      "id",
      "handle",
      "first_name",
      "last_name",
      "country_code",
      "city",
      "bio"
    ]
  ];
}

// statsui.basic.db.profile-store/secret-profile-tree [72] 
export function secret_profile_tree(user_id){
  return [
    "UserSecret",
    {"user_id":user_id},
    ["gender","gender_text","pronouns","dob","language"]
  ];
}

// statsui.basic.db.profile-store/fetch-public-profile [78] 
export async function fetch_public_profile(adapter,handle){
  let rows = checked_rows(
    await impl_supabase.pull_async(adapter,public_profile_tree(handle))
  );
  return rows[0] || null;
}

// statsui.basic.db.profile-store/load-owner-profile [86] 
export async function load_owner_profile(adapter,session,user_id){
  impl_session.set_session(adapter,session);
  let user_rows = checked_rows(
    await impl_supabase.pull_async(adapter,owner_profile_tree(user_id))
  );
  let secret_rows = checked_rows(
    await impl_supabase.pull_async(adapter,secret_profile_tree(user_id))
  );
  return {"public":user_rows[0] || {},"secret":secret_rows[0] || {}};
}

// statsui.basic.db.profile-store/save-public-profile [99] 
export async function save_public_profile(adapter,session,values){
  impl_session.set_session(adapter,session);
  return checked_body(
    await impl_supabase.rpc_call_async(adapter,PROFILE_PUBLIC_SPEC,[values],{})
  );
}

// statsui.basic.db.profile-store/save-secret-profile [107] 
export async function save_secret_profile(adapter,session,values){
  impl_session.set_session(adapter,session);
  return checked_body(
    await impl_supabase.rpc_call_async(adapter,PROFILE_SECRET_SPEC,[values],{})
  );
}