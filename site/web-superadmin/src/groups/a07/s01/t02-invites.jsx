import * as common from '@statstrade/web-superadmin/lib/substrate-model-common.jsx'

// statstrade-superadmin.groups.a07.s01.t02-invites/Group [30] 
export var Group = {
  "area":"superadmin",
  "label":"Invites",
  "key":"marketing/invites",
  "parent":"superadmin/marketing",
  "id":"superadmin/marketing/invites",
  "href":"/superadmin/marketing/invites",
  "gaps":[
    "Existing email invites and deliveries are readable; composing and sending marketing invites needs an operator RPC."
  ],
  "commands":{},
  "number":"A07.S01.T02",
  "source":"visual-language",
  "category":"growth",
  "namespace":"statstrade-superadmin.groups.a07.s01.t02-invites",
  "models":{
    "invites":{
      "model":{
        "options":{"refresh":{"AccessInviteEmail":true}},
        "defaults":{"output":[],"args":[{"return_args":[],"select_args":[]}]}
      },
      "dataview":{
        "select_entry":{
          "input":[],
          "view":{"table":"AccessInviteEmail","type":"select","query":{}}
        },
        "select_args":[],
        "table":"AccessInviteEmail",
        "return_entry":{
          "input":[{"symbol":"i_id","type":"uuid"}],
          "view":{
            "table":"AccessInviteEmail",
            "type":"return",
            "query":["id","status"],
            "identity":["id"]
          }
        },
        "return_args":[]
      },
      "select":{},
      "kind":"dataview",
      "fields":["id","status"]
    },
    "deliveries":{
      "model":{
        "options":{"refresh":{"EmailDelivery":true}},
        "defaults":{"output":[],"args":[{"return_args":[],"select_args":[]}]}
      },
      "dataview":{
        "select_entry":{
          "input":[],
          "view":{"table":"EmailDelivery","type":"select","query":{}}
        },
        "select_args":[],
        "table":"EmailDelivery",
        "return_entry":{
          "input":[{"symbol":"i_id","type":"uuid"}],
          "view":{
            "table":"EmailDelivery",
            "type":"return",
            "query":["id","status","recipient_masked","source_type"],
            "identity":["id"]
          }
        },
        "return_args":[]
      },
      "select":{},
      "kind":"dataview",
      "fields":["id","status","recipient_masked","source_type"]
    }
  },
  "actions":{}
};

// statstrade-superadmin.groups.a07.s01.t02-invites/createPageSpec [32] 
export function createPageSpec(bindings){
  return common.createPageSpec(Group,bindings);
}