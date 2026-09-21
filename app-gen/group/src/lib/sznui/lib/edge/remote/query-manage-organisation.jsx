import * as sb from '@statstrade/group/lib/sznui/lib/edge/remote/util-supabase'

// statsui.edge.remote.query-manage-organisation/organisation-list-by-admin [8] 
export function organisation_list_by_admin({userId}){
  return sb.getClient().from("Organisation").select(
    "*, access:Access!inner(roles:AccessRole!inner(level,member))"
  ).eq("access.roles.member",userId).in("access.roles.level",["admin","owner"]);
}

// statsui.edge.remote.query-manage-organisation/organisation-get-by-name [17] 
export function organisation_get_by_name({name}){
  return sb.getClient().schema("szn_type").from("Organisation").select("*").filter("name","eq",name).single();
}

// statsui.edge.remote.query-manage-organisation/organisation-member-list [27] 
export function organisation_member_list({orgId}){
  return sb.getClient().schema("szn_type").from("Organisation").select(
    "access:Access ( id, roles:AccessRole ( level, scopes, member:User(id, name, email, picture) ) )"
  ).eq("id",orgId).single();
}

// statsui.edge.remote.query-manage-organisation/organisation-apikey-list [37] 
export function organisation_apikey_list({orgId}){
  return sb.getClient().schema("szn_type").from("ApiKey").select("*, organisation:Organisation!inner (name)").eq("organisation.id",orgId).eq("is_revoked",false).order("time_created",{"ascending":false});
}

// statsui.edge.remote.query-manage-organisation/organisation-get-detail [48] 
export function organisation_get_detail({orgId}){
  return sb.getClient().from("Organisation").select("*, campaigns:Campaign(*)").eq("id",orgId).single();
}

// statsui.edge.remote.query-manage-organisation/organisation-token-list [57] 
export function organisation_token_list({orgId}){
  return sb.getClient().schema("szn_type").from("Token").select(
    "*, issuer:Wallet!inner(organisation:Organisation!inner(name))"
  ).eq("issuer.organisation.id",orgId);
}

// statsui.edge.remote.query-manage-organisation/organisation-commodity-list [66] 
export function organisation_commodity_list({orgId}){
  return sb.getClient().schema("szn_type").from("Commodity").select(
    "*, issuer:Wallet!inner(organisation:Organisation!inner(name))"
  ).eq("issuer.organisation.id",orgId);
}

// statsui.edge.remote.query-manage-organisation/organisation-invite-list [75] 
export function organisation_invite_list({orgId}){
  return sb.getClient().schema("szn_type").from("Invite").select("*").eq("organisation",orgId).order("time_created",{"ascending":false});
}