import * as common from '@statstrade/web-superadmin/lib/substrate-model-common.jsx'

// statstrade-superadmin.groups.a03.s03-inventory/Group [29] 
export var Group = {
  "area":"superadmin",
  "label":"Inventory & tokens",
  "key":"inventory",
  "id":"superadmin/inventory",
  "href":"/superadmin/inventory",
  "gaps":[],
  "commands":{},
  "number":"A03.S03",
  "source":"visual-language",
  "category":"control-plane",
  "namespace":"statstrade-superadmin.groups.a03.s03-inventory",
  "models":{
    "tokens":{
      "model":{
        "options":{"refresh":{"Token":true}},
        "defaults":{"output":[],"args":[{"return_args":[],"select_args":[]}]}
      },
      "dataview":{
        "select_entry":{
          "input":[],
          "view":{"table":"Token","type":"select","query":{}}
        },
        "select_args":[],
        "table":"Token",
        "return_entry":{
          "input":[{"symbol":"i_id","type":"uuid"}],
          "view":{
            "table":"Token",
            "type":"return",
            "query":["id","code","title"],
            "identity":["id"]
          }
        },
        "return_args":[]
      },
      "select":{},
      "kind":"dataview",
      "fields":["id","code","title"]
    },
    "assets":{
      "model":{
        "options":{"refresh":{"Asset":true}},
        "defaults":{"output":[],"args":[{"return_args":[],"select_args":[]}]}
      },
      "dataview":{
        "select_entry":{
          "input":[],
          "view":{"table":"Asset","type":"select","query":{}}
        },
        "select_args":[],
        "table":"Asset",
        "return_entry":{
          "input":[{"symbol":"i_id","type":"uuid"}],
          "view":{
            "table":"Asset",
            "type":"return",
            "query":["id","balance"],
            "identity":["id"]
          }
        },
        "return_args":[]
      },
      "select":{},
      "kind":"dataview",
      "fields":["id","balance"]
    }
  },
  "actions":{}
};

// statstrade-superadmin.groups.a03.s03-inventory/createPageSpec [31] 
export function createPageSpec(bindings){
  return common.createPageSpec(Group,bindings);
}