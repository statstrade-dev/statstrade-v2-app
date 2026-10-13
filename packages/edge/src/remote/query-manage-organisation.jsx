import * as sb from '@statstrade/edge/remote/util-supabase.jsx'

// statsui.edge.remote.query-manage-organisation/organisation-list-by-admin [8] 
export function organisation_list_by_admin({userId}){
  return sb.queryTable("Organisation",{
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

// statsui.edge.remote.query-manage-organisation/organisation-get-by-name [17] 
export function organisation_get_by_name({name}){
  return sb.queryTable("Organisation",{
    "select":"*",
    "filters":[{"column":"name","value":name}],
    "single":true
  },{"schema":"szn_type"});
}

// statsui.edge.remote.query-manage-organisation/organisation-member-list [26] 
export function organisation_member_list({orgId}){
  return sb.queryTable("Organisation",{
    "select":"access:Access ( id, roles:AccessRole ( level, scopes, member:User(id, name, email, picture) ) )",
    "filters":[{"column":"id","value":orgId}],
    "single":true
  },{"schema":"szn_type"});
}

// statsui.edge.remote.query-manage-organisation/organisation-apikey-list [35] 
export function organisation_apikey_list({orgId}){
  return sb.queryTable("ApiKey",{
    "select":"*, organisation:Organisation!inner (name)",
    "filters":[
        {"column":"organisation.id","value":orgId},
        {"column":"is_revoked","value":false}
      ],
    "order":[{"column":"time_created","ascending":false}]
  },{"schema":"szn_type"});
}

// statsui.edge.remote.query-manage-organisation/organisation-get-detail [45] 
export function organisation_get_detail({orgId}){
  return sb.queryTable("Organisation",{
    "select":"*, campaigns:Campaign(*)",
    "filters":[{"column":"id","value":orgId}],
    "single":true
  });
}

// statsui.edge.remote.query-manage-organisation/organisation-token-list [53] 
export function organisation_token_list({orgId}){
  return sb.queryTable("Token",{
    "select":"*, issuer:Wallet!inner(organisation:Organisation!inner(name))",
    "filters":[{"column":"issuer.organisation.id","value":orgId}]
  },{"schema":"szn_type"});
}

// statsui.edge.remote.query-manage-organisation/organisation-commodity-list [61] 
export function organisation_commodity_list({orgId}){
  return sb.queryTable("Commodity",{
    "select":"*, issuer:Wallet!inner(organisation:Organisation!inner(name))",
    "filters":[{"column":"issuer.organisation.id","value":orgId}]
  },{"schema":"szn_type"});
}

// statsui.edge.remote.query-manage-organisation/organisation-invite-list [69] 
export function organisation_invite_list({orgId}){
  return sb.queryTable("Invite",{
    "select":"*",
    "filters":[{"column":"organisation","value":orgId}],
    "order":[{"column":"time_created","ascending":false}]
  },{"schema":"szn_type"});
}