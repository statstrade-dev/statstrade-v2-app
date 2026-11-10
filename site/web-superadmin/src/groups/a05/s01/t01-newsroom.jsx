import * as common from '@statstrade/web-superadmin/lib/substrate-model-common.jsx'

// statstrade-superadmin.groups.a05.s01.t01-newsroom/Group [16] 
export var Group = {
  "area":"superadmin",
  "label":"Newsroom imports",
  "key":"content/newsroom",
  "parent":"superadmin/content",
  "id":"superadmin/content/newsroom",
  "href":"/newsroom/imports",
  "gaps":[],
  "commands":{},
  "number":"A05.S01.T01",
  "source":"runtime",
  "category":"governance",
  "namespace":"statstrade-superadmin.groups.a05.s01.t01-newsroom",
  "models":{
    "snapshot":{
      "kind":"rpc",
      "rpc":{
        "id":"super-newsroom-submissions",
        "schema":"stats_rpc",
        "input":[
          {"name":"actor_id","symbol":"actor_id","type":"uuid"},
          {"name":"query","symbol":"query","type":"jsonb"}
        ],
        "return":"jsonb",
        "flags":{}
      },
      "requires-actor":true,
      "model":{"defaults":{"args":[],"output":null},"options":{}},
      "actor-tail":[{}]
    }
  },
  "actions":{
    "import":{
      "rpc":{
        "id":"super-newsroom-import",
        "schema":"stats_rpc",
        "input":[
          {"name":"actor_id","symbol":"actor_id","type":"uuid"},
          {
          "name":"organization_id",
          "symbol":"organization_id",
          "type":"uuid"
        },
          {"name":"desk_id","symbol":"desk_id","type":"uuid"},
          {"name":"edition_id","symbol":"edition_id","type":"uuid"},
          {"name":"bundle","symbol":"bundle","type":"jsonb"}
        ],
        "return":"jsonb",
        "flags":{}
      }
    },
    "review":{
      "rpc":{
        "id":"super-newsroom-review",
        "schema":"stats_rpc",
        "input":[
          {"name":"actor_id","symbol":"actor_id","type":"uuid"},
          {"name":"submission_id","symbol":"submission_id","type":"uuid"},
          {"name":"action","symbol":"action","type":"text"},
          {"name":"reason","symbol":"reason","type":"text"}
        ],
        "return":"jsonb",
        "flags":{}
      }
    }
  }
};

// statstrade-superadmin.groups.a05.s01.t01-newsroom/createPageSpec [17] 
export function createPageSpec(bindings){
  return common.createPageSpec(Group,bindings);
}