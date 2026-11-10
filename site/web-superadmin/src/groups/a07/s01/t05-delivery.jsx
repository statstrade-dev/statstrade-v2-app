import * as common from '@statstrade/web-superadmin/lib/substrate-model-common.jsx'

// statstrade-superadmin.groups.a07.s01.t05-delivery/Group [30] 
export var Group = {
  "area":"superadmin",
  "label":"Delivery",
  "key":"marketing/delivery",
  "parent":"superadmin/marketing",
  "id":"superadmin/marketing/delivery",
  "href":"/superadmin/marketing/delivery",
  "gaps":[
    "Delivery records are readable; resend and cancellation need operator RPCs."
  ],
  "commands":{},
  "number":"A07.S01.T05",
  "source":"visual-language",
  "category":"growth",
  "namespace":"statstrade-superadmin.groups.a07.s01.t05-delivery",
  "models":{
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

// statstrade-superadmin.groups.a07.s01.t05-delivery/createPageSpec [32] 
export function createPageSpec(bindings){
  return common.createPageSpec(Group,bindings);
}