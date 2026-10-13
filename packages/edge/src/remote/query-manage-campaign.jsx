import * as sb from '@statstrade/edge/remote/util-supabase.jsx'

// statsui.edge.remote.query-manage-campaign/list-campaigns [8] 
export function list_campaigns({userId}){
  return sb.queryTable("Campaign",{
    "select":"*, access:Access!inner(roles:AccessRole!inner(level,member))",
    "filters":[
        {"column":"access.roles.member","value":userId},
        {
          "column":"access.roles.level",
          "operator":"in",
          "value":["admin","owner"]
        }
      ]
  });
}

// statsui.edge.remote.query-manage-campaign/list-campaign-members [17] 
export function list_campaign_members({campaignId}){
  return sb.queryTable("Campaign",{
    "select":"access:Access ( id, roles:AccessRole ( level, scopes, member:User(id, name, email, picture) ) )",
    "filters":[{"column":"id","value":campaignId}],
    "single":true
  },{"schema":"szn_type"});
}

// statsui.edge.remote.query-manage-campaign/get-campaign-detail [26] 
export function get_campaign_detail({campaignId}){
  return sb.queryTable("Campaign",{
    "select":"*, owner:Organisation(*), topics:Topic(*)",
    "filters":[{"column":"id","value":campaignId}],
    "single":true
  });
}