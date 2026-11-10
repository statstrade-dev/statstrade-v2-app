import * as common from '@statstrade/web-superadmin/lib/substrate-model-common.jsx'

// statstrade-superadmin.groups.a07.s01.t03-campaigns/Group [30] 
export var Group = {
  "area":"superadmin",
  "label":"Campaigns",
  "key":"marketing/campaigns",
  "parent":"superadmin/marketing",
  "id":"superadmin/marketing/campaigns",
  "href":"/superadmin/marketing/campaigns",
  "gaps":[],
  "commands":{"marketing_campaigns":["schedule","run","pause","cancel"]},
  "number":"A07.S01.T03",
  "source":"visual-language",
  "category":"growth",
  "namespace":"statstrade-superadmin.groups.a07.s01.t03-campaigns",
  "models":{
    "campaigns":{
      "model":{
        "options":{"refresh":{"MarketingCampaign":true}},
        "defaults":{"output":[],"args":[{"return_args":[],"select_args":[]}]}
      },
      "dataview":{
        "select_entry":{
          "input":[],
          "view":{"table":"MarketingCampaign","type":"select","query":{}}
        },
        "select_args":[],
        "table":"MarketingCampaign",
        "return_entry":{
          "input":[{"symbol":"i_id","type":"uuid"}],
          "view":{
            "table":"MarketingCampaign",
            "type":"return",
            "query":["id","name","status","scheduled_at","expires_at"],
            "identity":["id"]
          }
        },
        "return_args":[]
      },
      "select":{},
      "kind":"dataview",
      "fields":["id","name","status","scheduled_at","expires_at"]
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

// statstrade-superadmin.groups.a07.s01.t03-campaigns/createPageSpec [32] 
export function createPageSpec(bindings){
  return common.createPageSpec(Group,bindings);
}