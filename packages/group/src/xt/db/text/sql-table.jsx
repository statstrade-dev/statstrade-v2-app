import * as xtd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as base_schema from '@statstrade/edge/lib/xt/db/text/base-schema.jsx'

import * as raw from '@statstrade/edge/lib/xt/db/text/sql-raw.jsx'

import * as f from '@statstrade/edge/lib/xt/db/text/base-flatten.jsx'

// xt.db.text.sql-table/table-update-single [11] 
export function table_update_single(schema,table_name,id,m,opts){
  let cols = base_schema.table_columns(schema,table_name);
  return raw.raw_update(table_name,{"id":id},xtd.obj_pick(m,cols),opts);
}

// xt.db.text.sql-table/table-insert-single [21] 
export function table_insert_single(schema,table_name,m,opts){
  let cols = base_schema.table_columns(schema,table_name);
  let ks = cols.filter(function (col){
    return null != m[col];
  });
  return raw.raw_insert(table_name,ks,[m],opts);
}

// xt.db.text.sql-table/table-delete-single [33] 
export function table_delete_single(schema,table_name,id,opts){
  let cols = base_schema.table_columns(schema,table_name);
  return raw.raw_delete(table_name,{"id":id},opts);
}

// xt.db.text.sql-table/table-upsert-single [42] 
export function table_upsert_single(schema,table_name,m,opts){
  let cols = base_schema.table_columns(schema,table_name);
  let ks = cols.filter(function (col){
    return null != m[col];
  });
  return raw.raw_upsert(table_name,"id",ks,[m],opts);
}

// xt.db.text.sql-table/table-filter-id [55] 
export function table_filter_id(entry){
  return !((0 == Object.keys(entry["ref_links"]).length) && (1 == Object.keys(entry["data"]).length));
}

// xt.db.text.sql-table/table-get-data [62] 
export function table_get_data(entry){
  let out = Object.assign({},entry["data"]);
  for(let [link,m] of Object.entries(entry["ref_links"])){
    out[link + "_id"] = xtd.obj_first_key(m);
  };
  return out;
}

// xt.db.text.sql-table/table-emit-insert [71] 
export var table_emit_insert = raw.raw_insert;

// xt.db.text.sql-table/table-emit-upsert [74] 
export var table_emit_upsert = function (table_name,cols,out,opts){
  return raw.raw_upsert(table_name,"id",cols,out,opts);
};

// xt.db.text.sql-table/table-emit-flat [83] 
export function table_emit_flat(emit_fn,schema,lookup,flat,opts){
  let ordered = xtd.arr_keep(base_schema.table_order(lookup),function (col){
    return (null != flat[col]) ? [col,flat[col]] : null;
  });
  let column_fn = (null == opts["column_fn"]) ? (function (x){
    return x;
  }) : opts["column_fn"];
  let emit_pair_fn = function (pair){
    let [table_name,data] = pair;
    let cols = base_schema.table_columns(schema,table_name);
    let defaults = base_schema.table_defaults(schema,table_name);
    let out = xtd.arr_keepf(Object.values(data),table_filter_id,table_get_data);
    let sout = out.map(function (v){
      return Object.assign(Object.assign({},defaults),v);
    });
    let schema_update_value = lookup[table_name];
    let {schema_update} = schema_update_value;
    let {update_key} = opts;
    let sopts = null;
    if(schema_update && (null != update_key)){
      sopts = Object.assign({
        "upsert_clause":"\"excluded\"." + column_fn(update_key) + " < " + column_fn(update_key)
      },opts);
    }
    else{
      sopts = Object.assign({},opts);
    }
    if(0 < sout.length){
      return emit_fn(table_name,cols,sout,sopts);
    }
  };
  return xtd.arr_keep(ordered,emit_pair_fn);
}

// xt.db.text.sql-table/table-insert [120] 
export function table_insert(schema,lookup,table_name,data,opts){
  let flat = f.flatten(schema,table_name,data,{});
  return table_emit_flat(table_emit_insert,schema,lookup,flat,opts);
}

// xt.db.text.sql-table/table-upsert [127] 
export function table_upsert(schema,lookup,table_name,data,opts){
  let flat = f.flatten(schema,table_name,data,{});
  return table_emit_flat(table_emit_upsert,schema,lookup,flat,opts);
}

// xt.db.text.sql-table/prepare-add-input [139] 
export function prepare_add_input(data,schema,lookup,opts){
  let flat = f.flatten_bulk(schema,data);
  let statements = table_emit_flat(table_emit_upsert,schema,lookup,flat,opts);
  return statements.join("\n\n");
}

// xt.db.text.sql-table/prepare-remove-input [152] 
export function prepare_remove_input(data,schema,lookup,opts){
  let ordered = f.flatten_bulk_ids(schema,lookup,data);
  let statements = xtd.arr_mapcat(ordered,function (entry){
    let [table_name,ids] = entry;
    return ids.map(function (id){
      return raw.raw_delete(table_name,{"id":id},opts);
    });
  });
  return statements.join("\n\n");
}