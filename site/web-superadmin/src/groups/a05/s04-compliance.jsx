import * as common from '@statstrade/web-superadmin/lib/substrate-model-common.jsx'

// statstrade-superadmin.groups.a05.s04-compliance/Group [29] 
export var Group = {
  "area":"superadmin",
  "label":"Compliance & privacy",
  "key":"compliance",
  "id":"superadmin/compliance",
  "href":"/superadmin/compliance",
  "gaps":[],
  "commands":{"compliance_records":["complete","release","expire"]},
  "number":"A05.S04",
  "source":"visual-language",
  "category":"governance",
  "namespace":"statstrade-superadmin.groups.a05.s04-compliance",
  "models":{
    "records":{
      "model":{
        "options":{"refresh":{"ComplianceRecord":true}},
        "defaults":{"output":[],"args":[{"return_args":[],"select_args":[]}]}
      },
      "dataview":{
        "select_entry":{
          "input":[],
          "view":{"table":"ComplianceRecord","type":"select","query":{}}
        },
        "select_args":[],
        "table":"ComplianceRecord",
        "return_entry":{
          "input":[{"symbol":"i_id","type":"uuid"}],
          "view":{
            "table":"ComplianceRecord",
            "type":"return",
            "query":["id","kind","status","purpose","due_at"],
            "identity":["id"]
          }
        },
        "return_args":[]
      },
      "select":{},
      "kind":"dataview",
      "fields":["id","kind","status","purpose","due_at"]
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

// statstrade-superadmin.groups.a05.s04-compliance/createPageSpec [31] 
export function createPageSpec(bindings){
  return common.createPageSpec(Group,bindings);
}