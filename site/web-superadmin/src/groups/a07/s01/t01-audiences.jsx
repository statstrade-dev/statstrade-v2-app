import * as common from '@statstrade/web-superadmin/lib/substrate-model-common.jsx'

// statstrade-superadmin.groups.a07.s01.t01-audiences/Group [30] 
export var Group = {
  "area":"superadmin",
  "label":"Audiences",
  "key":"marketing/audiences",
  "parent":"superadmin/marketing",
  "id":"superadmin/marketing/audiences",
  "href":"/superadmin/marketing/audiences",
  "gaps":[
    "Audience reads are available; audience editing needs an operator RPC."
  ],
  "commands":{},
  "number":"A07.S01.T01",
  "source":"visual-language",
  "category":"growth",
  "namespace":"statstrade-superadmin.groups.a07.s01.t01-audiences",
  "models":{
    "audiences":{
      "model":{
        "options":{"refresh":{"MarketingAudience":true}},
        "defaults":{"output":[],"args":[{"return_args":[],"select_args":[]}]}
      },
      "dataview":{
        "select_entry":{
          "input":[],
          "view":{"table":"MarketingAudience","type":"select","query":{}}
        },
        "select_args":[],
        "table":"MarketingAudience",
        "return_entry":{
          "input":[{"symbol":"i_id","type":"uuid"}],
          "view":{
            "table":"MarketingAudience",
            "type":"return",
            "query":["id","name","source","saved"],
            "identity":["id"]
          }
        },
        "return_args":[]
      },
      "select":{},
      "kind":"dataview",
      "fields":["id","name","source","saved"]
    }
  },
  "actions":{}
};

// statstrade-superadmin.groups.a07.s01.t01-audiences/createPageSpec [32] 
export function createPageSpec(bindings){
  return common.createPageSpec(Group,bindings);
}