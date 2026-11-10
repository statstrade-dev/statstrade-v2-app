import * as common from '@statstrade/web-superadmin/lib/substrate-model-common.jsx'

// statstrade-superadmin.groups.a05.s05-support/Group [29] 
export var Group = {
  "area":"superadmin",
  "label":"Support & cases",
  "key":"support",
  "id":"superadmin/support",
  "href":"/superadmin/support",
  "gaps":[],
  "commands":{
    "support_cases":["pending","in-progress","waiting","resolve","close"]
  },
  "number":"A05.S05",
  "source":"visual-language",
  "category":"governance",
  "namespace":"statstrade-superadmin.groups.a05.s05-support",
  "models":{
    "cases":{
      "model":{
        "options":{"refresh":{"SupportCase":true}},
        "defaults":{"output":[],"args":[{"return_args":[],"select_args":[]}]}
      },
      "dataview":{
        "select_entry":{
          "input":[],
          "view":{"table":"SupportCase","type":"select","query":{}}
        },
        "select_args":[],
        "table":"SupportCase",
        "return_entry":{
          "input":[{"symbol":"i_id","type":"uuid"}],
          "view":{
            "table":"SupportCase",
            "type":"return",
            "query":["id","title","category","priority","status","sla_due_at"],
            "identity":["id"]
          }
        },
        "return_args":[]
      },
      "select":{},
      "kind":"dataview",
      "fields":["id","title","category","priority","status","sla_due_at"]
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

// statstrade-superadmin.groups.a05.s05-support/createPageSpec [31] 
export function createPageSpec(bindings){
  return common.createPageSpec(Group,bindings);
}