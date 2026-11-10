import * as common from '@statstrade/web-superadmin/lib/substrate-model-common.jsx'

// statstrade-superadmin.groups.a00.s01-shell/Group [28] 
export var Group = {
  "area":"superadmin",
  "label":"Navigation",
  "key":"shell",
  "id":"superadmin/shell",
  "gaps":[],
  "commands":{},
  "number":"A00.S01",
  "source":"runtime",
  "category":"operations",
  "namespace":"statstrade-superadmin.groups.a00.s01-shell",
  "models":{"route":{"kind":"local","binding":"route"}},
  "actions":{}
};

// statstrade-superadmin.groups.a00.s01-shell/createPageSpec [30] 
export function createPageSpec(bindings){
  return common.createPageSpec(Group,bindings);
}