import * as xtd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as base_schema from '@statstrade/edge/lib/xt/db/text/base-schema.jsx'

// xt.db.text.sql-manage/table-create-column [9] 
export function table_create_column(schema,entry,opts){
  let {column_fn,strict,table_fn,types} = opts;
  let {ident} = entry;
  let itype = entry["type"];
  let iprimary = entry["primary"];
  let irequired = entry["required"];
  let stype = (null != types[itype]) ? types[itype] : itype;
  let default_fn = function (ident){
    return column_fn(ident) + " " + (("ref" == stype) ? "text" : stype) + ((true == iprimary) ? " PRIMARY KEY" : "") + (((true == irequired) && (true == strict)) ? " NOT NULL" : "");
  };
  if((stype == "ref") && (null != schema[entry["ref"]["ns"]])){
    let rtable = entry["ref"]["ns"];
    let rtype = xtd.get_in(schema,[rtable,"id","type"]);
    if(!("string" == (typeof rtype))){
      return default_fn(ident + "_id");
    }
    else{
      return column_fn(ident + "_id") + " " + ((null != types[rtype]) ? types[rtype] : rtype) + " REFERENCES " + table_fn(rtable);
    }
  }
  else{
    return default_fn(ident);
  }
}

// xt.db.text.sql-manage/table-create [49] 
export function table_create(schema,table_name,opts){
  let table_fn = (null == opts["table_fn"]) ? (function (x){
    return x;
  }) : opts["table_fn"];
  let columns = base_schema.table_entries(schema,table_name);
  return "CREATE TABLE IF NOT EXISTS " + table_fn(table_name) + " (\n  " + columns.map(function (e){
    return table_create_column(schema,e,opts);
  }).join(",\n  ") + "\n);";
}

// xt.db.text.sql-manage/table-create-all [63] 
export function table_create_all(schema,lookup,opts){
  let table_list = base_schema.table_order(lookup);
  return table_list.map(function (table_name){
    return table_create(schema,table_name,opts);
  });
}

// xt.db.text.sql-manage/table-drop [72] 
export function table_drop(schema,table_name,opts){
  let table_fn = (null == opts["table_fn"]) ? (function (x){
    return x;
  }) : opts["table_fn"];
  return "DROP TABLE IF EXISTS " + table_fn(table_name) + ";";
}

// xt.db.text.sql-manage/table-drop-all [79] 
export function table_drop_all(schema,lookup,opts){
  let ks = base_schema.table_order(lookup).slice().reverse();
  return ks.map(function (table_name){
    return table_drop(schema,table_name,opts);
  });
}