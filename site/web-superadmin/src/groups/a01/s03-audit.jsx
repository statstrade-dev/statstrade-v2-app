import * as common from '@statstrade/web-superadmin/lib/substrate-model-common.jsx'

// statstrade-superadmin.groups.a01.s03-audit/Group [29] 
export var Group = {
  "area":"superadmin",
  "label":"Audit",
  "key":"audit",
  "id":"superadmin/audit",
  "href":"/superadmin/audit",
  "gaps":[
    "Snapshot exposes a bounded operations audit, not paginated audit search."
  ],
  "commands":{},
  "number":"A01.S03",
  "source":"visual-language",
  "category":"operations",
  "namespace":"statstrade-superadmin.groups.a01.s03-audit",
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

// statstrade-superadmin.groups.a01.s03-audit/createPageSpec [31] 
export function createPageSpec(bindings){
  return common.createPageSpec(Group,bindings);
}