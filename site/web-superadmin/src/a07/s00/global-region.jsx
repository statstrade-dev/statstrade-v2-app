import * as global_table from '@statstrade/web-superadmin/a07/s00/global-table.jsx'

// statstrade-superadmin.a07.s00.global-region/COUNTRY-TABLE [8] 
export var COUNTRY_TABLE = "Country";

// statstrade-superadmin.a07.s00.global-region/COUNTRY-FIELDS [10] 
export var COUNTRY_FIELDS = [
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
];

// statstrade-superadmin.a07.s00.global-region/A07GlobalRegion [15] 
export function A07GlobalRegion({context}){
  let {rows} = global_table.useTableRows(COUNTRY_TABLE,COUNTRY_FIELDS,context);
  return (
    <global_table.TableList
      title="Country"
      subtitle="id · code · title · iso · iso_numeric · iso_tld · iso_phone · capital · flag · region · subregion · timezones · detail · op_created · op_updated · time_created · time_updated"
      rows={rows}/>);
}

// statstrade-superadmin.a07.s00.global-region/MODULE [28] 
export var MODULE = {
  "COUNTRY_TABLE":COUNTRY_TABLE,
  "COUNTRY_FIELDS":COUNTRY_FIELDS,
  "A07GlobalRegion":A07GlobalRegion,
  "MODULE":MODULE
};