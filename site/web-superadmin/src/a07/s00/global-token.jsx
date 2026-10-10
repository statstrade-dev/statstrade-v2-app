import * as global_table from '@statstrade/web-superadmin/a07/s00/global-table.jsx'

// statstrade-superadmin.a07.s00.global-token/TOKEN-TABLE [8] 
export var TOKEN_TABLE = "Token";

// statstrade-superadmin.a07.s00.global-token/TOKEN-FIELDS [10] 
export var TOKEN_FIELDS = [
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
];

// statstrade-superadmin.a07.s00.global-token/A07GlobalToken [15] 
export function A07GlobalToken({context}){
  let {rows} = global_table.useTableRows(TOKEN_TABLE,TOKEN_FIELDS,context);
  return (
    <global_table.TableList
      title="Token"
      subtitle="id · name · code · color · title · description · icon · picture · type · symbol · native · decimal · issuer · detail · is_archived · op_created · time_created"
      rows={rows}/>);
}

// statstrade-superadmin.a07.s00.global-token/MODULE [28] 
export var MODULE = {
  "TOKEN_TABLE":TOKEN_TABLE,
  "TOKEN_FIELDS":TOKEN_FIELDS,
  "A07GlobalToken":A07GlobalToken,
  "MODULE":MODULE
};