import * as common from '@statstrade/web-superadmin/lib/substrate-model-common.jsx'

// statstrade-superadmin.groups.a03.s02-catalog/Group [29] 
export var Group = {
  "area":"superadmin",
  "label":"Catalog & pricing",
  "key":"catalog",
  "id":"superadmin/catalog",
  "href":"/superadmin/catalog",
  "gaps":[],
  "commands":{
    "system_catalog_items":["activate","retire"],
    "system_catalog_plans":["activate","retire"]
  },
  "number":"A03.S02",
  "source":"visual-language",
  "category":"control-plane",
  "namespace":"statstrade-superadmin.groups.a03.s02-catalog",
  "models":{
    "items":{
      "model":{
        "options":{"refresh":{"SystemCatalogItem":true}},
        "defaults":{"output":[],"args":[{"return_args":[],"select_args":[]}]}
      },
      "dataview":{
        "select_entry":{
          "input":[],
          "view":{"table":"SystemCatalogItem","type":"select","query":{}}
        },
        "select_args":[],
        "table":"SystemCatalogItem",
        "return_entry":{
          "input":[{"symbol":"i_id","type":"uuid"}],
          "view":{
            "table":"SystemCatalogItem",
            "type":"return",
            "query":["id","code","title","item_type","status"],
            "identity":["id"]
          }
        },
        "return_args":[]
      },
      "select":{},
      "kind":"dataview",
      "fields":["id","code","title","item_type","status"]
    },
    "plans":{
      "model":{
        "options":{"refresh":{"SystemCatalogPlan":true}},
        "defaults":{"output":[],"args":[{"return_args":[],"select_args":[]}]}
      },
      "dataview":{
        "select_entry":{
          "input":[],
          "view":{"table":"SystemCatalogPlan","type":"select","query":{}}
        },
        "select_args":[],
        "table":"SystemCatalogPlan",
        "return_entry":{
          "input":[{"symbol":"i_id","type":"uuid"}],
          "view":{
            "table":"SystemCatalogPlan",
            "type":"return",
            "query":["id","code","title","currency","base_cost","status"],
            "identity":["id"]
          }
        },
        "return_args":[]
      },
      "select":{},
      "kind":"dataview",
      "fields":["id","code","title","currency","base_cost","status"]
    }
  },
  "actions":{
    "command":{
      "rpc":{
        "id":"super-operations-command",
        "schema":"stats_rpc",
        "input":[
          {"name":"actor_id","symbol":"actor_id","type":"uuid"},
          {"name":"resource","symbol":"resource","type":"citext"},
          {"name":"target_id","symbol":"target_id","type":"uuid"},
          {"name":"action","symbol":"action","type":"citext"},
          {"name":"payload","symbol":"payload","type":"jsonb"}
        ],
        "return":"jsonb",
        "flags":{}
      }
    }
  }
};

// statstrade-superadmin.groups.a03.s02-catalog/createPageSpec [31] 
export function createPageSpec(bindings){
  return common.createPageSpec(Group,bindings);
}