import * as sb from '@statstrade/edge/remote/util-supabase.jsx'

// statsui.edge.remote.query.ql-general/get-profile [8] 
export function get_profile({user_id}){
  return sb.queryTable("User",{
    "select":"*",
    "filters":[{"column":"id","operator":"eq","value":user_id}],
    "single":true
  },{"schema":"szn_type"});
}