import * as global_table from '@statstrade/web-superadmin/a07/s00/global-table.jsx'

// statstrade-superadmin.a07.s00.global-currency/COMMODITY-TABLE [8] 
export var COMMODITY_TABLE = "Commodity";

// statstrade-superadmin.a07.s00.global-currency/COMMODITY-FIELDS [10] 
export var COMMODITY_FIELDS = [
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
];

// statstrade-superadmin.a07.s00.global-currency/A07GlobalCurrency [14] 
export function A07GlobalCurrency({context}){
  let {rows} = global_table.useTableRows(COMMODITY_TABLE,COMMODITY_FIELDS,context);
  return (
    <global_table.TableList
      title="Commodity"
      subtitle="id · name · code · color · title · icon · picture · type · issuer · detail · is_archived · op_created · time_created"
      rows={rows}/>);
}

// statstrade-superadmin.a07.s00.global-currency/MODULE [27] 
export var MODULE = {
  "COMMODITY_TABLE":COMMODITY_TABLE,
  "COMMODITY_FIELDS":COMMODITY_FIELDS,
  "A07GlobalCurrency":A07GlobalCurrency,
  "MODULE":MODULE
};