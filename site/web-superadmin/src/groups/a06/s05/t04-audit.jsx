import * as common from '@statstrade/web-superadmin/lib/substrate-model-common.jsx'

// statstrade-superadmin.groups.a06.s05.t04-audit/Group [31] 
export var Group = {
  "area":"superadmin",
  "label":"Audit policy",
  "key":"settings/audit",
  "parent":"superadmin/settings",
  "id":"superadmin/settings/audit",
  "href":"/superadmin/settings/audit",
  "gaps":[
    "Uses the registered operations section; reference audit-policy fields need explicit backend mappings."
  ],
  "commands":{},
  "number":"A06.S05.T04",
  "source":"visual-language",
  "category":"platform",
  "namespace":"statstrade-superadmin.groups.a06.s05.t04-audit",
  "models":{
    "policy":{
      "model":{
        "options":{"refresh":{"Global":true}},
        "defaults":{"output":[],"args":[{"return_args":[],"select_args":[]}]}
      },
      "dataview":{
        "select_entry":{
          "input":[],
          "view":{
            "table":"Global",
            "type":"select",
            "query":{"is_registered":true,"key":"operations"}
          }
        },
        "select_args":[],
        "table":"Global",
        "return_entry":{
          "input":[{"symbol":"i_id","type":"uuid"}],
          "view":{
            "table":"Global",
            "type":"return",
            "query":["id","is_registered","key","value_json","revision"],
            "identity":["id"]
          }
        },
        "return_args":[]
      },
      "select":{"is_registered":true,"key":"operations"},
      "kind":"dataview",
      "fields":["id","is_registered","key","value_json","revision"]
    }
  },
  "actions":{
    "update-global":{
      "rpc":{
        "id":"super-global-section-update",
        "schema":"stats_rpc",
        "input":[
          {"name":"actor_id","symbol":"actor_id","type":"uuid"},
          {"name":"key","symbol":"key","type":"citext"},
          {
          "name":"expected_revision",
          "symbol":"expected_revision",
          "type":"integer"
        },
          {"name":"value","symbol":"value","type":"jsonb"},
          {"name":"reason","symbol":"reason","type":"text"}
        ],
        "return":"jsonb",
        "flags":{}
      }
    },
    "reset-global":{
      "rpc":{
        "id":"super-global-section-reset",
        "schema":"stats_rpc",
        "input":[
          {"name":"actor_id","symbol":"actor_id","type":"uuid"},
          {"name":"key","symbol":"key","type":"citext"},
          {
          "name":"expected_revision",
          "symbol":"expected_revision",
          "type":"integer"
        },
          {"name":"reason","symbol":"reason","type":"text"}
        ],
        "return":"jsonb",
        "flags":{}
      }
    }
  }
};

// statstrade-superadmin.groups.a06.s05.t04-audit/createPageSpec [33] 
export function createPageSpec(bindings){
  return common.createPageSpec(Group,bindings);
}