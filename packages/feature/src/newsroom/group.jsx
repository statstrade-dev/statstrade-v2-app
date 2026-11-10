// statstrade-web.feature.newsroom.group/Group [13] 
export var Group = {
  "id":"public/newsroom",
  "key":"newsroom",
  "area":"public",
  "label":"Newsroom",
  "models":{
    "articles":{
      "kind":"rpc",
      "rpc":{
        "id":"newsroom-publications",
        "schema":"stats_rpc",
        "input":[{"name":"query","symbol":"query","type":"jsonb"}],
        "return":"jsonb",
        "flags":{}
      },
      "model":{"defaults":{"args":[{}],"output":[]},"options":{}}
    }
  },
  "actions":{},
  "commands":{}
};