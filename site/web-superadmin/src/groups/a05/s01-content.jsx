import * as common from '@statstrade/web-superadmin/lib/substrate-model-common.jsx'

// statstrade-superadmin.groups.a05.s01-content/Group [29] 
export var Group = {
  "area":"superadmin",
  "label":"Content operations",
  "key":"content",
  "id":"superadmin/content",
  "href":"/superadmin/content",
  "gaps":[],
  "commands":{"content_controls":["approve","reject","resolve","retire"]},
  "number":"A05.S01",
  "source":"visual-language",
  "category":"governance",
  "namespace":"statstrade-superadmin.groups.a05.s01-content",
  "models":{
    "entries":{
      "model":{
        "options":{"refresh":{"ContentControl":true}},
        "defaults":{"output":[],"args":[{"return_args":[],"select_args":[]}]}
      },
      "dataview":{
        "select_entry":{
          "input":[],
          "view":{"table":"ContentControl","type":"select","query":{}}
        },
        "select_args":[],
        "table":"ContentControl",
        "return_entry":{
          "input":[{"symbol":"i_id","type":"uuid"}],
          "view":{
            "table":"ContentControl",
            "type":"return",
            "query":["id","kind","title","status","priority","reason"],
            "identity":["id"]
          }
        },
        "return_args":[]
      },
      "select":{},
      "kind":"dataview",
      "fields":["id","kind","title","status","priority","reason"]
    },
    "topics":{
      "model":{
        "options":{"refresh":{"Topic":true}},
        "defaults":{"output":[],"args":[{"return_args":[],"select_args":[]}]}
      },
      "dataview":{
        "select_entry":{
          "input":[],
          "view":{"table":"Topic","type":"select","query":{}}
        },
        "select_args":[],
        "table":"Topic",
        "return_entry":{
          "input":[{"symbol":"i_id","type":"uuid"}],
          "view":{
            "table":"Topic",
            "type":"return",
            "query":["id","code","title","status"],
            "identity":["id"]
          }
        },
        "return_args":[]
      },
      "select":{},
      "kind":"dataview",
      "fields":["id","code","title","status"]
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

// statstrade-superadmin.groups.a05.s01-content/createPageSpec [31] 
export function createPageSpec(bindings){
  return common.createPageSpec(Group,bindings);
}