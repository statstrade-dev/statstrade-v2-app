import * as global_table from '@statstrade/web-superadmin/a03/s03/global-table.jsx'

// statstrade-superadmin.a03.s03.global-token/TOKEN-DATAVIEW [23] 
export var TOKEN_DATAVIEW = {
  "table":"Token",
  "select_entry":{
    "input":[],
    "view":{"table":"Token","type":"select","query":{}}
  },
  "select_args":[],
  "return_entry":{
    "input":[{"symbol":"i_id","type":"uuid"}],
    "view":{
      "table":"Token",
      "type":"return",
      "query":[
        "id",
        "name",
        "code",
        "color",
        "title",
        "description",
        "icon",
        "picture",
        "type",
        "symbol",
        "native",
        "decimal",
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

// statstrade-superadmin.a03.s03.global-token/A03S03GlobalToken [25] 
export function A03S03GlobalToken({context}){
  let {realtimeError,realtimeStatus,rows} = global_table.useDataviewRows(TOKEN_DATAVIEW,context);
  return (
    <global_table.TableList
      title="Token"
      subtitle="id · name · code · color · title · description · icon · picture · type · symbol · native · decimal · issuer · detail · is_archived · op_created · time_created"
      rows={rows}
      realtimeStatus={realtimeStatus}
      realtimeError={realtimeError}/>);
}

// statstrade-superadmin.a03.s03.global-token/MODULE [40] 
export var MODULE = {
  "TOKEN_DATAVIEW":TOKEN_DATAVIEW,
  "A03S03GlobalToken":A03S03GlobalToken,
  "MODULE":MODULE
};