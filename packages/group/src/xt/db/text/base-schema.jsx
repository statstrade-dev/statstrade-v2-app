import * as xtd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as str from '@statstrade/edge/lib/xt/lang/common-string.jsx'

// xt.db.text.base-schema/CACHED_SCHEMA [9] 
export var CACHED_SCHEMA = new Map();

// xt.db.text.base-schema/CACHED_LOOKUP [11] 
export var CACHED_LOOKUP = new Map();

// xt.db.text.base-schema/get-order [13] 
export var get_order = function (e){
  return e["order"];
};

// xt.db.text.base-schema/get-ident [16] 
export var get_ident = function (e){
  return e["ident"];
};

// xt.db.text.base-schema/get-ident-id [19] 
export function get_ident_id(e){
  return ("ref" == e["type"]) ? (e["ident"] + "_id") : e["ident"];
}

// xt.db.text.base-schema/primary-columns [27] 
export function primary_columns(schema,table_name){
  let table = schema[table_name];
  let entries = xtd.arr_sort(Object.values(table).filter(function (entry){
    return entry["primary"];
  }),get_order,function (x,y){
    return x < y;
  });
  return (entries.length > 0) ? entries.map(get_ident_id) : ["id"];
}

// xt.db.text.base-schema/record-key [38] 
export function record_key(schema,table_name,data){
  let values = primary_columns(schema,table_name).map(function (column){
    let value = data[column];
    if((null == value) && str.ends_withp(column,"_id")){
      let field = column.substring(0,column.length - 3);
      value = data[field];
      if((null != value) && ("object" == (typeof value)) && !Array.isArray(value)){
        value = value["id"];
      }
    }
    return value;
  });
  return (values.length == 1) ? values[0] : JSON.stringify(values);
}

// xt.db.text.base-schema/list-tables [55] 
export function list_tables(schema){
  return xtd.arr_sort(Object.keys(schema),function (x){
    return x;
  },function (x,y){
    return 0 > x.localeCompare(y);
  });
}

// xt.db.text.base-schema/get-cached-schema [63] 
export function get_cached_schema(schema){
  let cached = CACHED_SCHEMA.get(schema);
  if(null == cached){
    cached = {};
    CACHED_SCHEMA.set(schema,cached);
  }
  return cached;
}

// xt.db.text.base-schema/create-data-keys [73] 
export function create_data_keys(schema,table_name){
  let table_def = schema[table_name];
  return xtd.arr_sort(Object.values(table_def).filter(function (e){
    return ("number" == (typeof e["order"])) && (e["type"] != "ref");
  }),get_order,function (x,y){
    return x < y;
  }).map(get_ident);
}

// xt.db.text.base-schema/create-ref-keys [86] 
export function create_ref_keys(schema,table_name){
  let table_def = schema[table_name];
  return xtd.arr_sort(Object.values(table_def).filter(function (e){
    return ("number" == (typeof e["order"])) && (e["type"] == "ref");
  }),get_order,function (x,y){
    return x < y;
  }).map(get_ident);
}

// xt.db.text.base-schema/create-rev-keys [97] 
export function create_rev_keys(schema,table_name){
  let table_def = schema[table_name];
  return Object.values(table_def).filter(function (e){
    return !("number" == (typeof e["order"]));
  }).map(get_ident);
}

// xt.db.text.base-schema/create-table-entries [107] 
export function create_table_entries(schema,table_name){
  let table_def = schema[table_name];
  return xtd.arr_sort(Object.values(table_def).filter(function (e){
    return "number" == (typeof e["order"]);
  }),get_order,function (x,y){
    return x < y;
  });
}

// xt.db.text.base-schema/create-defaults [117] 
export function create_defaults(schema,table_name){
  let table_def = schema[table_name];
  return xtd.obj_keepf(table_def,function (m){
    return ((null != m["sql"]) && ("object" == (typeof m["sql"])) && !Array.isArray(m["sql"])) && (null != m["sql"]["default"]);
  },function (m){
    return m["sql"]["default"];
  });
}

// xt.db.text.base-schema/create-all-keys [129] 
export function create_all_keys(schema,table_name){
  let ref_ks = create_ref_keys(schema,table_name);
  let ref_id_ks = xtd.obj_from_pairs(ref_ks.map(function (k){
    return [k + "_id",k];
  }));
  return {
    "data":create_data_keys(schema,table_name),
    "ref":ref_ks,
    "ref_id":ref_id_ks,
    "rev":create_rev_keys(schema,table_name),
    "defaults":create_defaults(schema,table_name),
    "table":create_table_entries(schema,table_name)
  };
}

// xt.db.text.base-schema/get-all-keys [143] 
export function get_all_keys(schema,table_name){
  let cached = get_cached_schema(schema);
  let table_keys = cached[table_name];
  if(null == table_keys){
    table_keys = create_all_keys(schema,table_name);
    cached[table_name] = table_keys;
  }
  return table_keys;
}

// xt.db.text.base-schema/data-keys [154] 
export function data_keys(schema,table_name){
  return (get_all_keys(schema,table_name))["data"];
}

// xt.db.text.base-schema/ref-keys [160] 
export function ref_keys(schema,table_name){
  return (get_all_keys(schema,table_name))["ref"];
}

// xt.db.text.base-schema/ref-id-keys [166] 
export function ref_id_keys(schema,table_name){
  return (get_all_keys(schema,table_name))["ref_id"];
}

// xt.db.text.base-schema/rev-keys [172] 
export function rev_keys(schema,table_name){
  return (get_all_keys(schema,table_name))["rev"];
}

// xt.db.text.base-schema/table-defaults [178] 
export function table_defaults(schema,table_name){
  return (get_all_keys(schema,table_name))["defaults"];
}

// xt.db.text.base-schema/table-entries [184] 
export function table_entries(schema,table_name){
  return (get_all_keys(schema,table_name))["table"];
}

// xt.db.text.base-schema/table-columns [190] 
export function table_columns(schema,table_name){
  return table_entries(schema,table_name).map(get_ident_id);
}

// xt.db.text.base-schema/create-table-order [197] 
export function create_table_order(lookup){
  return xtd.arr_sort(Object.entries(lookup),function (pair){
    return pair[1]["position"];
  },function (x,y){
    return x < y;
  }).map(function (arr){
    return arr[0];
  });
}

// xt.db.text.base-schema/table-order [207] 
export function table_order(lookup){
  let cached = CACHED_LOOKUP.get(lookup);
  if(null == cached){
    cached = create_table_order(lookup);
    CACHED_LOOKUP.set(lookup,cached);
  }
  return cached;
}

// xt.db.text.base-schema/table-coerce [217] 
export function table_coerce(schema,table,data,ctypes){
  let out = {};
  let ref_fn = function (ntable,vdata){
    return table_coerce(schema,ntable,vdata,ctypes);
  };
  if(Array.isArray(data)){
    return data.map(function (vdata){
      return ref_fn(table,vdata);
    });
  }
  for(let [key,v] of Object.entries(data)){
    let rec = xtd.get_in(schema,[table,key]);
    if(null == rec){
      out[key] = v;
    }
    else if("ref" == rec["type"]){
      let ntable = rec["ref"]["ns"];
      out[key] = v.map(function (vdata){
        return ref_fn(ntable,vdata);
      });
    }
    else{
      let f = ctypes[rec["type"]];
      let val = (null == f) ? v : f(v);
      out[key] = val;
    }
  };
  return out;
}