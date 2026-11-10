import * as common from '@statstrade/web-superadmin/lib/substrate-model-common.jsx'

// statstrade-superadmin.groups.a00.s02-tables/Group [28] 
export var Group = {
  "area":"superadmin",
  "label":"Table browser",
  "key":"tables",
  "id":"superadmin/tables",
  "gaps":[],
  "commands":{},
  "number":"A00.S02",
  "source":"runtime",
  "category":"control-plane",
  "namespace":"statstrade-superadmin.groups.a00.s02-tables",
  "models":{"rows":{"kind":"parameter","binding":"table-model"}},
  "actions":{}
};

// statstrade-superadmin.groups.a00.s02-tables/createPageSpec [30] 
export function createPageSpec(bindings){
  return common.createPageSpec(Group,bindings);
}