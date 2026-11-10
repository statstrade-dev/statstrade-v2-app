import * as common from '@statstrade/web-superadmin/lib/substrate-model-common.jsx'

// statstrade-superadmin.groups.a08.s01-moderation/Group [30] 
export var Group = {
  "area":"superadmin",
  "label":"Moderation",
  "key":"moderation",
  "id":"superadmin/moderation",
  "href":"/superadmin/moderation",
  "gaps":[],
  "commands":{
    "safety_cases":["triage","investigate","action","resolve","dismiss"]
  },
  "number":"A08.S01",
  "source":"visual-language",
  "category":"safety",
  "namespace":"statstrade-superadmin.groups.a08.s01-moderation",
  "models":{
    "cases":{
      "model":{
        "options":{"refresh":{"SafetyCase":true}},
        "defaults":{"output":[],"args":[{"return_args":[],"select_args":[]}]}
      },
      "dataview":{
        "select_entry":{
          "input":[],
          "view":{
            "table":"SafetyCase",
            "type":"select",
            "query":{"case_kind":"moderation"}
          }
        },
        "select_args":[],
        "table":"SafetyCase",
        "return_entry":{
          "input":[{"symbol":"i_id","type":"uuid"}],
          "view":{
            "table":"SafetyCase",
            "type":"return",
            "query":["id","case_kind","title","status","priority","reason"],
            "identity":["id"]
          }
        },
        "return_args":[]
      },
      "select":{"case_kind":"moderation"},
      "kind":"dataview",
      "fields":["id","case_kind","title","status","priority","reason"]
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

// statstrade-superadmin.groups.a08.s01-moderation/createPageSpec [32] 
export function createPageSpec(bindings){
  return common.createPageSpec(Group,bindings);
}