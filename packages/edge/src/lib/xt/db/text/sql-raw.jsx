import * as ut from '@statstrade/edge/lib/xt/db/text/sql-util.jsx'

// xt.db.text.sql-raw/raw-delete [8] 
export function raw_delete(table_name,where_params,opts){
  let table_fn = (null == opts["table_fn"]) ? (function (x){
    return x;
  }) : opts["table_fn"];
  let where_str = (null == where_params) ? "" : ut.encode_query_string(where_params,"WHERE",opts);
  let out_arr = ["DELETE FROM " + table_fn(table_name)];
  if(0 < where_str.length){
    out_arr.push(where_str);
  }
  return out_arr.join(" ") + ";";
}

// xt.db.text.sql-raw/raw-insert-array [23] 
export function raw_insert_array(table_name,columns,values,opts){
  let table_fn = (null == opts["table_fn"]) ? (function (x){
    return x;
  }) : opts["table_fn"];
  let column_fn = (null == opts["column_fn"]) ? (function (x){
    return x;
  }) : opts["column_fn"];
  let out_arr = [
    "INSERT INTO " + table_fn(table_name),
    " (" + columns.map(column_fn).join(", ") + ")"
  ];
  let val_fn = function (data){
    let s_arr = columns.map(function (k){
      return ut.encode_value(data[k]);
    });
    return "(" + s_arr.join(",") + ")";
  };
  let val_arr = values.map(val_fn);
  let val_str = " VALUES\n " + val_arr.join(",\n ");
  out_arr.push(val_str);
  return out_arr;
}

// xt.db.text.sql-raw/raw-insert [44] 
export function raw_insert(table_name,columns,values,opts){
  let out_arr = raw_insert_array(table_name,columns,values,opts);
  return out_arr.join("\n") + ";";
}

// xt.db.text.sql-raw/raw-upsert [51] 
export function raw_upsert(table_name,id_column,columns,values,opts){
  let table_fn = (null == opts["table_fn"]) ? (function (x){
    return x;
  }) : opts["table_fn"];
  let column_fn = (null == opts["column_fn"]) ? (function (x){
    return x;
  }) : opts["column_fn"];
  let {upsert_clause} = opts;
  let id_columns = Array.isArray(id_column) ? id_column : [id_column];
  let id_lu = {};
  for(let column of id_columns){
    id_lu[column] = true;
  };
  let out_arr = raw_insert_array(table_name,columns,values,opts);
  let col_arr = columns.filter(function (col){
    return !id_lu[col];
  }).map(function (col){
    return column_fn(col) + "=coalesce(\"excluded\"." + column_fn(col) + "," + column_fn(col) + ")";
  });
  return out_arr.join("\n") + "\n" + ("ON CONFLICT (" + id_columns.map(column_fn).join(",") + ") ") + ((col_arr.length > 0) ? ("DO UPDATE SET\n" + col_arr.join(",\n")) : "DO NOTHING") + (((col_arr.length > 0) && ("string" == (typeof upsert_clause))) ? ("\nWHERE " + upsert_clause) : "") + ";";
}

// xt.db.text.sql-raw/raw-update [83] 
export function raw_update(table_name,where_params,data,opts){
  let table_fn = (null == opts["table_fn"]) ? (function (x){
    return x;
  }) : opts["table_fn"];
  let where_str = (null == where_params) ? "" : ut.encode_query_string(where_params,"WHERE",opts);
  let set_str = ut.encode_query_string(data,"SET",opts);
  let out_arr = ["UPDATE " + table_fn(table_name),set_str,where_str];
  return out_arr.join("\n ") + ";";
}

// xt.db.text.sql-raw/raw-select [101] 
export function raw_select(table_name,where_params,return_params,opts){
  let table_fn = (null == opts["table_fn"]) ? (function (x){
    return x;
  }) : opts["table_fn"];
  let column_fn = (null == opts["column_fn"]) ? (function (x){
    return x;
  }) : opts["column_fn"];
  let return_str = ("string" == (typeof return_params)) ? return_params : return_params.map(column_fn).join(", ");
  let where_str = (null == where_params) ? "" : ut.encode_query_string(where_params,"WHERE",opts);
  let out_arr = ["SELECT " + return_str," FROM " + table_fn(table_name)];
  if(0 < where_str.length){
    out_arr.push(where_str);
  }
  return out_arr.join("\n ") + ";";
}