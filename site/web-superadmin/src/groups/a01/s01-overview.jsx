import * as common from '@statstrade/web-superadmin/lib/substrate-model-common.jsx'

// statstrade-superadmin.groups.a01.s01-overview/Group [29] 
export var Group = {
  "area":"superadmin",
  "label":"Overview",
  "key":"overview",
  "id":"superadmin/overview",
  "href":"/superadmin",
  "gaps":[],
  "commands":{},
  "number":"A01.S01",
  "source":"visual-language",
  "category":"operations",
  "namespace":"statstrade-superadmin.groups.a01.s01-overview",
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

// statstrade-superadmin.groups.a01.s01-overview/createPageSpec [31] 
export function createPageSpec(bindings){
  return common.createPageSpec(Group,bindings);
}