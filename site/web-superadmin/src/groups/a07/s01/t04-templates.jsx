import * as common from '@statstrade/web-superadmin/lib/substrate-model-common.jsx'

// statstrade-superadmin.groups.a07.s01.t04-templates/Group [30] 
export var Group = {
  "area":"superadmin",
  "label":"Templates",
  "key":"marketing/templates",
  "parent":"superadmin/marketing",
  "id":"superadmin/marketing/templates",
  "href":"/superadmin/marketing/templates",
  "gaps":[
    "Template versions are readable; editing and publishing needs an operator RPC."
  ],
  "commands":{},
  "number":"A07.S01.T04",
  "source":"visual-language",
  "category":"growth",
  "namespace":"statstrade-superadmin.groups.a07.s01.t04-templates",
  "models":{
    "templates":{
      "model":{
        "options":{"refresh":{"EmailTemplate":true}},
        "defaults":{"output":[],"args":[{"return_args":[],"select_args":[]}]}
      },
      "dataview":{
        "select_entry":{
          "input":[],
          "view":{"table":"EmailTemplate","type":"select","query":{}}
        },
        "select_args":[],
        "table":"EmailTemplate",
        "return_entry":{
          "input":[{"symbol":"i_id","type":"uuid"}],
          "view":{
            "table":"EmailTemplate",
            "type":"return",
            "query":["id","key","locale","version","status","subject"],
            "identity":["id"]
          }
        },
        "return_args":[]
      },
      "select":{},
      "kind":"dataview",
      "fields":["id","key","locale","version","status","subject"]
    }
  },
  "actions":{}
};

// statstrade-superadmin.groups.a07.s01.t04-templates/createPageSpec [32] 
export function createPageSpec(bindings){
  return common.createPageSpec(Group,bindings);
}