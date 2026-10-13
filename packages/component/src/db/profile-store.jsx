import * as sb from '@statstrade/edge/remote/util-supabase.jsx'

// statsui.basic.db.profile-store/PROFILE-SCHEMA [7] 
export var PROFILE_SCHEMA = "stats_type";

// statsui.basic.db.profile-store/PROFILE-PUBLIC-SELECT [8] 
export var PROFILE_PUBLIC_SELECT = "id,handle,first_name,last_name,country_code,city,bio";

// statsui.basic.db.profile-store/PROFILE-SECRET-SELECT [9] 
export var PROFILE_SECRET_SELECT = "gender,gender_text,pronouns,dob,language";

// statsui.basic.db.profile-store/checked-body [11] 
export function checked_body(response){
  if(response && response.message){
    throw new Error(response.message);
  }
  return response;
}

// statsui.basic.db.profile-store/checked-rows [18] 
export function checked_rows(response){
  let body = checked_body(response);
  if(!Array.isArray(body)){
    throw new Error("The profile request returned an unexpected response.");
  }
  return body;
}

// statsui.basic.db.profile-store/public-profile-spec [26] 
export function public_profile_spec(handle){
  return {
    "select":"handle,first_name,last_name,country_code,city,bio",
    "filters":[{"column":"handle","value":handle}]
  };
}

// statsui.basic.db.profile-store/owner-profile-spec [32] 
export function owner_profile_spec(user_id){
  return {
    "select":PROFILE_PUBLIC_SELECT,
    "filters":[{"column":"id","value":user_id}]
  };
}

// statsui.basic.db.profile-store/secret-profile-spec [38] 
export function secret_profile_spec(user_id){
  return {
    "select":PROFILE_SECRET_SELECT,
    "filters":[{"column":"user_id","value":user_id}]
  };
}

// statsui.basic.db.profile-store/fetch-public-profile [44] 
export async function fetch_public_profile(handle){
  let response = await sb.queryTable("User",public_profile_spec(handle),{"schema":PROFILE_SCHEMA});
  let rows = checked_rows(response["error"] || response["data"]);
  return rows[0] || null;
}

// statsui.basic.db.profile-store/load-owner-profile [54] 
export async function load_owner_profile(user_id){
  let responses = await Promise.all([
    sb.queryTable("User",owner_profile_spec(user_id),{"schema":PROFILE_SCHEMA}),
    sb.queryTable(
      "UserSecret",
      secret_profile_spec(user_id),
      {"schema":PROFILE_SCHEMA}
    )
  ]);
  let user_rows = checked_rows(responses[0]["error"] || responses[0]["data"]);
  let secret_rows = checked_rows(responses[1]["error"] || responses[1]["data"]);
  return {"public":user_rows[0] || {},"secret":secret_rows[0] || {}};
}

// statsui.basic.db.profile-store/save-public-profile [74] 
export async function save_public_profile(values){
  let response = await sb.callRemote("user_set_public",{"m":values});
  return checked_body(response["error"] || response["data"]);
}

// statsui.basic.db.profile-store/save-secret-profile [81] 
export async function save_secret_profile(values){
  let response = await sb.callRemote("user_set_secret",{"m":values});
  return checked_body(response["error"] || response["data"]);
}