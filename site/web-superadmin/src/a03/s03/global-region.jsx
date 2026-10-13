import * as global_table from '@statstrade/web-superadmin/a03/s03/global-table.jsx'

// statstrade-superadmin.a03.s03.global-region/COUNTRY-DATAVIEW [23] 
export var COUNTRY_DATAVIEW = {
  "table":"Country",
  "select_entry":{
    "input":[],
    "view":{"table":"Country","type":"select","query":{}}
  },
  "select_args":[],
  "return_entry":{
    "input":[{"symbol":"i_id","type":"uuid"}],
    "view":{
      "table":"Country",
      "type":"return",
      "query":[
        "id",
        "code",
        "title",
        "iso",
        "iso_numeric",
        "iso_tld",
        "iso_phone",
        "capital",
        "flag",
        "region",
        "subregion",
        "timezones",
        "detail",
        "op_created",
        "op_updated",
        "time_created",
        "time_updated"
      ],
      "identity":["id"]
    }
  },
  "return_args":[]
};

// statstrade-superadmin.a03.s03.global-region/A03S03GlobalRegion [25] 
export function A03S03GlobalRegion({context}){
  let {realtimeError,realtimeStatus,rows} = global_table.useDataviewRows(COUNTRY_DATAVIEW,context);
  return (
    <global_table.TableList
      title="Country"
      subtitle="id · code · title · iso · iso_numeric · iso_tld · iso_phone · capital · flag · region · subregion · timezones · detail · op_created · op_updated · time_created · time_updated"
      rows={rows}
      realtimeStatus={realtimeStatus}
      realtimeError={realtimeError}/>);
}

// statstrade-superadmin.a03.s03.global-region/MODULE [40] 
export var MODULE = {
  "COUNTRY_DATAVIEW":COUNTRY_DATAVIEW,
  "A03S03GlobalRegion":A03S03GlobalRegion,
  "MODULE":MODULE
};