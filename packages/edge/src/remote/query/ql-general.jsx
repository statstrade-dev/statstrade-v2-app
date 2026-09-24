import * as sb from '@statstrade/edge/remote/util-supabase.jsx'

// statsui.edge.remote.query.ql-general/get-profile [8] 
export function get_profile({user_id}){
  return sb.getClient().schema("szn_type").from("User").select("*").filter("id","eq",user_id).single();
}