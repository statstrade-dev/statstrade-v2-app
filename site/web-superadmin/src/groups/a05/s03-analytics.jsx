import * as common from '@statstrade/web-superadmin/lib/substrate-model-common.jsx'

// statstrade-superadmin.groups.a05.s03-analytics/Group [29] 
export var Group = {
  "area":"superadmin",
  "label":"Data & analytics",
  "key":"analytics",
  "id":"superadmin/analytics",
  "href":"/superadmin/analytics",
  "gaps":[
    "Operational snapshot counts only; funnel, quality and export-job APIs are not implemented."
  ],
  "commands":{},
  "number":"A05.S03",
  "source":"visual-language",
  "category":"governance",
  "namespace":"statstrade-superadmin.groups.a05.s03-analytics",
  "models":{
    "snapshot":{
      "kind":"rpc",
      "rpc":{
        "id":"super-operations-snapshot",
        "schema":"stats_rpc",
        "input":[{"name":"actor_id","symbol":"actor_id","type":"uuid"}],
        "return":"jsonb",
        "flags":{}
      },
      "requires-actor":true,
      "model":{"defaults":{"args":[],"output":null},"options":{}}
    }
  },
  "actions":{}
};

// statstrade-superadmin.groups.a05.s03-analytics/createPageSpec [31] 
export function createPageSpec(bindings){
  return common.createPageSpec(Group,bindings);
}