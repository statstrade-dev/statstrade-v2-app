import * as common from '@statstrade/web-superadmin/lib/substrate-model-common.jsx'

// statstrade-superadmin.groups.a02.s01-user-operations/Group [29] 
export var Group = {
  "area":"superadmin",
  "label":"User operations",
  "key":"user-operations",
  "id":"superadmin/user-operations",
  "href":"/superadmin/user-operations",
  "gaps":[],
  "commands":{},
  "number":"A02.S01",
  "source":"visual-language",
  "category":"accounts",
  "namespace":"statstrade-superadmin.groups.a02.s01-user-operations",
  "models":{
    "users":{
      "model":{
        "options":{"refresh":{"User":true}},
        "defaults":{"output":[],"args":[{"return_args":[],"select_args":[]}]}
      },
      "dataview":{
        "select_entry":{
          "input":[],
          "view":{"table":"User","type":"select","query":{}}
        },
        "select_args":[],
        "table":"User",
        "return_entry":{
          "input":[{"symbol":"i_id","type":"uuid"}],
          "view":{
            "table":"User",
            "type":"return",
            "query":["id","handle","first_name","last_name","type","is_active"],
            "identity":["id"]
          }
        },
        "return_args":[]
      },
      "select":{},
      "kind":"dataview",
      "fields":["id","handle","first_name","last_name","type","is_active"]
    },
    "roles":{
      "model":{
        "options":{"refresh":{"AccessRole":true}},
        "defaults":{"output":[],"args":[{"return_args":[],"select_args":[]}]}
      },
      "dataview":{
        "select_entry":{
          "input":[],
          "view":{"table":"AccessRole","type":"select","query":{}}
        },
        "select_args":[],
        "table":"AccessRole",
        "return_entry":{
          "input":[
            {"symbol":"i_class_table","type":"enum"},
            {"symbol":"i_class_context","type":"enum"},
            {"symbol":"i_access","type":"ref"},
            {"symbol":"i_member","type":"ref"}
          ],
          "view":{
            "table":"AccessRole",
            "type":"return",
            "query":["class_table","class_context","access","member","level","scope"],
            "identity":["class_table","class_context","access","member"]
          }
        },
        "return_args":[]
      },
      "select":{},
      "kind":"dataview",
      "fields":["class_table","class_context","access","member","level","scope"]
    }
  },
  "actions":{
    "update-user":{
      "rpc":{
        "id":"super-user-update",
        "schema":"stats_rpc",
        "input":[
          {"name":"user_id","symbol":"user_id","type":"uuid"},
          {"name":"target_id","symbol":"target_id","type":"uuid"},
          {"name":"m","symbol":"m","type":"jsonb"}
        ],
        "return":"jsonb",
        "flags":{}
      }
    }
  }
};

// statstrade-superadmin.groups.a02.s01-user-operations/createPageSpec [31] 
export function createPageSpec(bindings){
  return common.createPageSpec(Group,bindings);
}