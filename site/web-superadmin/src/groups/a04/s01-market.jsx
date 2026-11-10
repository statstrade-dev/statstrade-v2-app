import * as common from '@statstrade/web-superadmin/lib/substrate-model-common.jsx'

// statstrade-superadmin.groups.a04.s01-market/Group [29] 
export var Group = {
  "area":"superadmin",
  "label":"Market operations",
  "key":"market",
  "id":"superadmin/market",
  "href":"/superadmin/market",
  "gaps":[],
  "commands":{},
  "number":"A04.S01",
  "source":"visual-language",
  "category":"network",
  "namespace":"statstrade-superadmin.groups.a04.s01-market",
  "models":{
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
    },
    "prospects":{
      "model":{
        "options":{"refresh":{"Prospect":true}},
        "defaults":{"output":[],"args":[{"return_args":[],"select_args":[]}]}
      },
      "dataview":{
        "select_entry":{
          "input":[],
          "view":{"table":"Prospect","type":"select","query":{}}
        },
        "select_args":[],
        "table":"Prospect",
        "return_entry":{
          "input":[{"symbol":"i_id","type":"uuid"}],
          "view":{
            "table":"Prospect",
            "type":"return",
            "query":["id","name","title"],
            "identity":["id"]
          }
        },
        "return_args":[]
      },
      "select":{},
      "kind":"dataview",
      "fields":["id","name","title"]
    }
  },
  "actions":{}
};

// statstrade-superadmin.groups.a04.s01-market/createPageSpec [31] 
export function createPageSpec(bindings){
  return common.createPageSpec(Group,bindings);
}