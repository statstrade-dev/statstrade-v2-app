import * as global_table from '@statstrade/web-superadmin/a03/s03/global-table.jsx'

// statstrade-superadmin.a03.s03.global-currency/COMMODITY-DATAVIEW [22] 
export var COMMODITY_DATAVIEW = {
  "table":"Commodity",
  "select_entry":{
    "input":[],
    "view":{"table":"Commodity","type":"select","query":{}}
  },
  "select_args":[],
  "return_entry":{
    "input":[{"symbol":"i_id","type":"uuid"}],
    "view":{
      "table":"Commodity",
      "type":"return",
      "query":[
        "id",
        "name",
        "code",
        "color",
        "title",
        "icon",
        "picture",
        "type",
        "issuer",
        "detail",
        "is_archived",
        "op_created",
        "time_created"
      ],
      "identity":["id"]
    }
  },
  "return_args":[]
};

// statstrade-superadmin.a03.s03.global-currency/A03S03GlobalCurrency [24] 
export function A03S03GlobalCurrency({context}){
  let {realtimeError,realtimeStatus,rows} = global_table.useDataviewRows(COMMODITY_DATAVIEW,context);
  return (
    <global_table.TableList
      title="Commodity"
      subtitle="id · name · code · color · title · icon · picture · type · issuer · detail · is_archived · op_created · time_created"
      rows={rows}
      realtimeStatus={realtimeStatus}
      realtimeError={realtimeError}/>);
}

// statstrade-superadmin.a03.s03.global-currency/MODULE [39] 
export var MODULE = {
  "COMMODITY_DATAVIEW":COMMODITY_DATAVIEW,
  "A03S03GlobalCurrency":A03S03GlobalCurrency,
  "MODULE":MODULE
};