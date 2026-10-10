import React from 'react'

import * as T from 'tamagui'

import * as substrate from '@statstrade/web-superadmin/lib/substrate-bare.jsx'

import * as sb from '@statstrade/edge/remote/util-supabase.jsx'

import * as ext_table from '@statstrade/edge/lib/js/react/ext-table.js'

import * as ext_model from '@statstrade/edge/lib/js/react/ext-model.js'

// statstrade-superadmin.adminweb.workspace/WORKSPACES [133] 
export var WORKSPACES = {
  "user":[
    {
    "table":"User",
    "title":"Users",
    "fields":[
      "id",
      "handle",
      "first_name",
      "last_name",
      "is_active",
      "type",
      "country_code",
      "city",
      "is_official",
      "is_onboarded",
      "time_created",
      "time_updated"
    ]
  },
    {
    "table":"AccessRole",
    "title":"Access roles",
    "fields":[
      "class_table",
      "class_context",
      "access",
      "member",
      "level",
      "scope",
      "is_active",
      "is_public",
      "time_created",
      "time_updated"
    ]
  },
    {
    "table":"PlatformGrant",
    "title":"Platform grants",
    "fields":[
      "id",
      "user",
      "level",
      "status",
      "scopes",
      "expires_at",
      "granted_by",
      "reason",
      "time_created",
      "time_updated"
    ]
  }
  ],
  "organisation":[
    {
    "table":"Org",
    "title":"Organizations",
    "fields":[
      "id",
      "name",
      "title",
      "description",
      "category",
      "location",
      "website",
      "is_nonprofit",
      "is_academic",
      "is_archived",
      "time_created",
      "time_updated"
    ]
  },
    {
    "table":"OrgSettings",
    "title":"Organization settings",
    "fields":[
      "id",
      "org",
      "timezone",
      "is_discoverable",
      "allow_followers",
      "show_activity",
      "governance",
      "notifications",
      "time_updated"
    ]
  },
    {
    "table":"Campaign",
    "title":"Campaigns",
    "fields":[
      "id",
      "owner",
      "code",
      "title",
      "status",
      "is_prime",
      "is_template",
      "time_start",
      "time_end",
      "is_archived",
      "time_created"
    ]
  }
  ],
  "brand":[
    {
    "table":"Social",
    "title":"Social profiles",
    "fields":[
      "id",
      "class_table",
      "class_ref",
      "publishing_policy",
      "time_created"
    ]
  },
    {
    "table":"SocialConnection",
    "title":"Social connections",
    "fields":[
      "id",
      "social",
      "provider",
      "provider_account_id",
      "status",
      "permissions",
      "time_created",
      "time_updated"
    ]
  },
    {
    "table":"SocialHandle",
    "title":"Social handles",
    "fields":[
      "id",
      "social",
      "type",
      "handle",
      "is_verified",
      "verified_at",
      "time_created"
    ]
  },
    {
    "table":"SocialPublication",
    "title":"Social publications",
    "fields":[
      "id",
      "variant",
      "connection",
      "status",
      "scheduled_at",
      "published_at",
      "permalink",
      "attempts",
      "time_created"
    ]
  },
    {
    "table":"SocialVariant",
    "title":"Social content variants",
    "fields":["id","content","channel","format","caption","time_created"]
  }
  ],
  "room":[
    {
    "table":"Topic",
    "title":"Topics",
    "fields":[
      "id",
      "code",
      "title",
      "campaign",
      "status",
      "token",
      "playable",
      "time_open",
      "time_close",
      "is_archived",
      "time_created"
    ]
  },
    {
    "table":"Prospect",
    "title":"Prospects",
    "fields":[
      "id",
      "name",
      "title",
      "topic",
      "token",
      "playable",
      "shares",
      "holdings",
      "result",
      "payout_total",
      "time_created"
    ]
  },
    {
    "table":"ProspectOrder",
    "title":"Prospect orders",
    "fields":[
      "id",
      "prospect",
      "wallet",
      "side",
      "status",
      "price",
      "amount",
      "unfilled",
      "time_created",
      "time_updated"
    ]
  },
    {
    "table":"ProspectStake",
    "title":"Prospect stakes",
    "fields":[
      "id",
      "prospect",
      "wallet",
      "shares",
      "spend",
      "payout",
      "claim",
      "time_created",
      "time_updated"
    ]
  },
    {
    "table":"ProspectMarketSnapshot",
    "title":"Market snapshots",
    "fields":[
      "id",
      "prospect",
      "captured_at",
      "probability",
      "volume",
      "participants",
      "market_state",
      "source"
    ]
  }
  ],
  "chain":[
    {
    "table":"Token",
    "title":"Tokens",
    "fields":[
      "id",
      "name",
      "code",
      "title",
      "type",
      "symbol",
      "native",
      "decimal",
      "issuer",
      "is_archived",
      "time_created"
    ]
  },
    {
    "table":"TokenAllowance",
    "title":"Token allowances",
    "fields":["id","token","playable","owner","spender","amount","time_created"]
  },
    {
    "table":"Asset",
    "title":"Assets",
    "fields":["id","wallet","token","playable","balance","time_created"]
  },
    {
    "table":"AssetTx",
    "title":"Asset transactions",
    "fields":["id","asset","type","amount","balance","ref_id","time_created"]
  },
    {
    "table":"WalletAddress",
    "title":"Wallet addresses",
    "fields":["id","wallet","address","time_created"]
  }
  ],
  "super":[
    {
    "table":"Global",
    "title":"Global configuration",
    "fields":[
      "id",
      "key",
      "value_json",
      "default_json",
      "revision",
      "title",
      "visibility",
      "status",
      "is_registered",
      "time_updated"
    ]
  },
    {
    "table":"PlatformGrant",
    "title":"Platform grants",
    "fields":[
      "id",
      "user",
      "level",
      "status",
      "scopes",
      "expires_at",
      "granted_by",
      "reason",
      "time_created"
    ]
  },
    {
    "table":"SystemCatalogItem",
    "title":"System catalog",
    "fields":[
      "id",
      "code",
      "title",
      "item_type",
      "category",
      "status",
      "time_created",
      "time_updated"
    ]
  },
    {
    "table":"IntegrationProvider",
    "title":"Integrations",
    "fields":[
      "id",
      "name",
      "provider_type",
      "status",
      "last_check_at",
      "latency_ms",
      "events_today",
      "error_rate",
      "created_by"
    ]
  },
    {
    "table":"ComputeConnection",
    "title":"Compute connections",
    "fields":[
      "id",
      "owner_type",
      "owner_ref",
      "name",
      "model",
      "status",
      "capabilities",
      "created_by",
      "time_created"
    ]
  },
    {
    "table":"SafetyCase",
    "title":"Safety cases",
    "fields":[
      "id",
      "case_kind",
      "title",
      "target_type",
      "target_id",
      "priority",
      "status",
      "report_count",
      "assigned_to",
      "risk_score",
      "summary",
      "first_seen",
      "last_seen",
      "time_updated"
    ]
  },
    {
    "table":"ComplianceRecord",
    "title":"Compliance records",
    "fields":[
      "id",
      "kind",
      "status",
      "owner",
      "purpose",
      "source",
      "due_at",
      "completed_at",
      "released_at",
      "time_created"
    ]
  },
    {
    "table":"AuditLog",
    "title":"Audit log",
    "fields":["class_table","class_context","audit","entry","time_created"]
  }
  ]
};

// statstrade-superadmin.adminweb.workspace/tableImpl [135] 
export function tableImpl(table,fields){
  let spec = [table,{"data":fields}];
  return {
    "base":{"list":{"spec":spec},"data":{"spec":spec}},
    "call":{},
    "cached":{}
  };
}

// statstrade-superadmin.adminweb.workspace/useTableRows [144] 
export function useTableRows(table,fields,context){
  let impl = tableImpl(table,fields);
  let view = ext_table.useListView(impl,"data",{"defaultArgs":[],"defaultOutput":[]},context,{});
  let rows = ext_model.listenSuccess(view,[],{"remote":"always","default":[]});
  return {rows,view};
}

// statstrade-superadmin.adminweb.workspace/WorkspaceContent [162] 
export function WorkspaceContent(props){
  let {section} = props;
  let provider_state = substrate.useSubstrateContext();
  let resource = provider_state["resource"];
  let runtime_context = {
    "node":resource["client"],
    "runtime":{"config":resource["config"],"schema":{},"lookup":{},"opts":{}}
  };
  let tables = WORKSPACES[section] || [];
  let [selectedIndex,setSelectedIndex] = React.useState(0);
  let selected = tables[selectedIndex] || tables[0];
  let {rows} = useTableRows(selected["table"],selected["fields"],runtime_context);
  return (
    <T.YStack flex={1} gap="$3" padding="$4">
      <T.Text fontSize="$6" fontWeight="700">Adminweb v2</T.Text>
      <T.Text color="$color10">Read-only views from the current statstrade-v2 schema.</T.Text>
      <T.XStack gap="$2" flexWrap="wrap">
        {tables.map(function (table,index){
          return (
            <T.Button
              key={table["table"]}
              size="$2"
              chromeless={true}
              backgroundColor={(index == selectedIndex) ? "$color3" : "transparent"}
              onPress={function (){
                  setSelectedIndex(index);
                }}>{table["title"]}
            </T.Button>);
        })}
      </T.XStack>
      <T.Text fontSize="$5" fontWeight="600">{selected["title"]}</T.Text>
      <T.YStack gap="$2">
        {(rows || []).map(function (row,index){
          return (
            <T.YStack
              key={selected["table"] + "-" + index}
              padding="$3"
              borderWidth={1}
              borderColor="$borderColor"
              borderRadius="$3">
              <T.Text fontFamily="monospace" fontSize="$2">{JSON.stringify(row)}</T.Text>
            </T.YStack>);
        })}
      </T.YStack>
      {(0 == (rows || []).length) ? (
        <T.Text color="$color10">No records found.</T.Text>) : null}
    </T.YStack>);
}

// statstrade-superadmin.adminweb.workspace/AdminWorkspace [218] 
export function AdminWorkspace({section}){
  let [session] = sb.useListenSession();
  let token = session["access_token"];
  let config = React.useMemo(function (){
    return substrate.createConfig(token);
  },[token]);
  return token ? (
    <substrate.SubstrateProvider
      options={{
          "client_id":"statstrade-superadmin-adminweb-" + section,
          "config":config
        }}><WorkspaceContent section={section}/>
    </substrate.SubstrateProvider>) : (
    <T.YStack gap="$3" padding="$4">
      <T.Text fontSize="$5" fontWeight="600">Sign in to view admin data.</T.Text>
      <T.Anchor href="/auth/sign-in">Sign in</T.Anchor>
    </T.YStack>);
}

// statstrade-superadmin.adminweb.workspace/MODULE [239] 
export var MODULE = {
  "WORKSPACES":WORKSPACES,
  "tableImpl":tableImpl,
  "useTableRows":useTableRows,
  "WorkspaceContent":WorkspaceContent,
  "AdminWorkspace":AdminWorkspace,
  "MODULE":MODULE
};