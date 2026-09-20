import * as sb from '@statstrade/group/lib/sznui/lib/edge/remote/util-supabase'

// sznui.lib.edge.remote.query-manage-campaign/list-campaigns [8] 
export function list_campaigns({userId}){
  return sb.getClient().from("Campaign").select(
    "*, access:Access!inner(roles:AccessRole!inner(level,member))"
  ).eq("access.roles.member",userId).in("access.roles.level",["admin","owner"]);
}

// sznui.lib.edge.remote.query-manage-campaign/list-campaign-members [17] 
export function list_campaign_members({campaignId}){
  return sb.getClient().schema("szn_type").from("Campaign").select(
    "access:Access ( id, roles:AccessRole ( level, scopes, member:User(id, name, email, picture) ) )"
  ).eq("id",campaignId).single();
}

// sznui.lib.edge.remote.query-manage-campaign/get-campaign-detail [27] 
export function get_campaign_detail({campaignId}){
  return sb.getClient().from("Campaign").select("*, owner:Organisation(*), topics:Topic(*)").eq("id",campaignId).single();
}