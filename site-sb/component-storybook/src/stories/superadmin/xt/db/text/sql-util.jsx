import * as xtd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as xts from '@statstrade/edge/lib/xt/lang/common-string.jsx'

// xt.db.text.sql-util/OPERATORS [9] 
export var OPERATORS = {
  "neq":"!=",
  "gt":">",
  "gte":">=",
  "lt":"<",
  "lte":"<=",
  "eq":"=",
  "is_not_null":"IS NOT NULL",
  "is_null":"IS NULL"
};

// xt.db.text.sql-util/INFIX [19] 
export var INFIX = {"||":true,"+":true,"-":true,"*":true,"/":true};

// xt.db.text.sql-util/PG [26] 
export var PG = {
  "map":"jsonb",
  "long":"bigint",
  "enum":"text",
  "image":"jsonb",
  "array":"jsonb"
};

// xt.db.text.sql-util/SQLITE [33] 
export var SQLITE = {
  "enum":"text",
  "long":"integer",
  "citext":"text",
  "jsonb":"text",
  "inet":"text",
  "array":"text",
  "image":"text",
  "uuid":"text",
  "map":"text"
};

// xt.db.text.sql-util/sqlite-json-values [44] 
export function sqlite_json_values(v){
  return "(SELECT value from json_each(" + v + "))";
}

// xt.db.text.sql-util/sqlite-json-keys [50] 
export function sqlite_json_keys(v){
  return "(SELECT key from json_each(" + v + "))";
}

// xt.db.text.sql-util/SQLITE_FN [60] 
export var SQLITE_FN = {
  "jsonb_build_object":{"type":"alias","name":"json_object"},
  "jsonb_build_array":{"type":"alias","name":"json_array"},
  "jsonb_array_elements_text":{"type":"macro","fn":sqlite_json_values},
  "jsonb_array_elements":{"type":"macro","fn":sqlite_json_values},
  "jsonb_object_keys":{"type":"macro","fn":sqlite_json_keys},
  "\"core/util\".as_array":{
    "type":"macro",
    "fn":function (x){
      return x;
    }
  }
};

// xt.db.text.sql-util/encode-bool [68] 
export function encode_bool(b){
  if(b == true){
    return "TRUE";
  }
  else if(b == false){
    return "FALSE";
  }
  else{
    throw "Not Valid";
  }
}

// xt.db.text.sql-util/encode-number [76] 
export function encode_number(v){
  return "'" + (Number.isInteger(v) ? v.toFixed(0) : String(v)) + "'";
}

// xt.db.text.sql-util/encode-operator [86] 
export function encode_operator(op,opts){
  if(null != OPERATORS[op]){
    return OPERATORS[op];
  }
  else if(((null != opts) && ("object" == (typeof opts)) && !Array.isArray(opts)) && ((null != opts["operators"]) && ("object" == (typeof opts["operators"])) && !Array.isArray(opts["operators"])) && (null != opts["operators"][op])){
    return xtd.get_in(opts,["operators",op]);
  }
  else{
    return op;
  }
}

// xt.db.text.sql-util/encode-json [101] 
export function encode_json(v){
  return "'" + JSON.stringify(v).replace(new RegExp("'","g"),"''") + "'";
}

// xt.db.text.sql-util/encode-value [109] 
export function encode_value(v){
  if(null == v){
    return "NULL";
  }
  else if("string" == (typeof v)){
    return "'" + v.replace(new RegExp("'","g"),"''") + "'";
  }
  else if("boolean" == (typeof v)){
    return encode_bool(v);
  }
  else if(Array.isArray(v) || ((null != v) && ("object" == (typeof v)) && !Array.isArray(v))){
    return encode_json(v);
  }
  else if("number" == (typeof v)){
    return encode_number(v);
  }
  else{
    return "'" + String(v) + "'";
  }
}

// xt.db.text.sql-util/encode-sql-arg [132] 
export function encode_sql_arg(v,column_fn,opts,loop_fn){
  let {name} = v;
  return encode_value(name);
}

// xt.db.text.sql-util/encode-sql-column [139] 
export function encode_sql_column(v,column_fn,opts,loop_fn){
  let {name} = v;
  return column_fn(name);
}

// xt.db.text.sql-util/encode-sql-tuple [146] 
export function encode_sql_tuple(v,column_fn,opts,loop_fn){
  let {args} = v;
  let arg_fn = function (arg){
    return loop_fn(arg,column_fn,opts,loop_fn);
  };
  let arg_arr = Array.isArray(args) ? args : [];
  let fargs = arg_arr.map(arg_fn);
  return fargs.join(", ");
}

// xt.db.text.sql-util/encode-sql-table [157] 
export function encode_sql_table(v,column_fn,opts,loop_fn){
  let {name,schema} = v;
  if(opts["strict"]){
    return column_fn(schema) + "." + column_fn(name);
  }
  else{
    return column_fn(name);
  }
}

// xt.db.text.sql-util/encode-sql-cast [168] 
export function encode_sql_cast(v,column_fn,opts,loop_fn){
  let [out,cast] = v["args"];
  if(opts["strict"]){
    return loop_fn(out,column_fn,opts,loop_fn) + "::" + encode_sql_table(cast,column_fn,opts,loop_fn);
  }
  else{
    return loop_fn(out,column_fn,opts,loop_fn);
  }
}

// xt.db.text.sql-util/encode-sql-keyword [179] 
export function encode_sql_keyword(v,column_fn,opts,loop_fn){
  let {args,name} = v;
  let arg_fn = function (arg){
    return loop_fn(arg,column_fn,opts,loop_fn);
  };
  let arg_arr = Array.isArray(args) ? args : [];
  let fargs = arg_arr.map(arg_fn);
  if(xtd.arr_emptyp(fargs)){
    return String(name);
  }
  else{
    return name + " " + fargs.join(" ");
  }
}

// xt.db.text.sql-util/encode-sql-fn [192] 
export function encode_sql_fn(v,column_fn,opts,loop_fn){
  let {args,name} = v;
  let arg_fn = function (arg){
    return loop_fn(arg,column_fn,opts,loop_fn);
  };
  let fargs = args.map(arg_fn);
  if(null != INFIX[name]){
    return "(" + fargs.join(" " + name + " ") + ")";
  }
  else{
    let lu = opts["values"]["replace"];
    let fspec = lu[name];
    if(null == fspec){
      return name + "(" + fargs.join(", ") + ")";
    }
    else if("alias" == fspec["type"]){
      return fspec["name"] + "(" + fargs.join(", ") + ")";
    }
    else if("macro" == fspec["type"]){
      return fspec["fn"].apply(null,fargs);
    }
    else{
      throw "Invalid Spec Type - " + fspec["type"];
    }
  }
}

// xt.db.text.sql-util/encode-sql-select [220] 
export function encode_sql_select(v,column_fn,opts,loop_fn){
  let {args} = v;
  let {querystr_fn} = opts;
  let arg_fn = function (arg){
    if(((null != arg) && ("object" == (typeof arg)) && !Array.isArray(arg)) && !(null != arg["::"])){
      return querystr_fn(arg,"",opts);
    }
    else{
      return loop_fn(arg,column_fn,opts,loop_fn);
    }
  };
  let fargs = args.map(arg_fn);
  return "(SELECT " + fargs.join(" ") + ")";
}

// xt.db.text.sql-util/ENCODE_SQL [236] 
export var ENCODE_SQL = {
  "sql/arg":encode_sql_arg,
  "sql/keyword":encode_sql_keyword,
  "sql/defenum":encode_sql_table,
  "sql/deftype":encode_sql_table,
  "sql/fn":encode_sql_fn,
  "sql/column":encode_sql_column,
  "sql/cast":encode_sql_cast,
  "sql/tuple":encode_sql_tuple,
  "sql/select":encode_sql_select
};

// xt.db.text.sql-util/encode-sql [247] 
export function encode_sql(v,column_fn,opts,loop_fn){
  let tcls = v["::"];
  let arg_fn = function (arg){
    return loop_fn(arg,column_fn,opts,loop_fn);
  };
  let f = ENCODE_SQL[tcls];
  if(null == f){
    throw "Unsupported Type - " + tcls;
  }
  return f(v,column_fn,opts,loop_fn);
}

// xt.db.text.sql-util/encode-loop-fn [259] 
export function encode_loop_fn(v,column_fn,opts,loop_fn){
  if(((null != v) && ("object" == (typeof v)) && !Array.isArray(v)) && (null != v["::"])){
    return encode_sql(v,column_fn,opts,loop_fn);
  }
  else if("string" == (typeof v)){
    return v;
  }
  else{
    return encode_value(v);
  }
}

// xt.db.text.sql-util/encode-query-value [273] 
export function encode_query_value(v,column_fn,opts){
  if(((null != v) && ("object" == (typeof v)) && !Array.isArray(v)) && (null != v["::"])){
    return encode_loop_fn(v,column_fn,opts,encode_loop_fn);
  }
  else if(Array.isArray(v)){
    if((1 == v.length) && Array.isArray(v[0]) && v[0].every(function (value){
      return "string" == (typeof value);
    })){
      return "(" + v[0].map(encode_value).join(", ") + ")";
    }
    else if((1 == v.length) && ("string" == (typeof v[0]))){
      return v[0];
    }
    else{
      let map_fn = function (item){
        return encode_query_value(item,column_fn,opts);
      };
      return v.map(map_fn).join(" ");
    }
  }
  else if((v == "and") || (v == "or")){
    return v;
  }
  else{
    return encode_value(v);
  }
}

// xt.db.text.sql-util/encode-query-segment [309] 
export function encode_query_segment(key,v,column_fn,opts){
  let col = column_fn(key);
  if(Array.isArray(v)){
    let map_fn = function (item){
      return encode_query_value(item,column_fn,opts);
    };
    let tail_values = v.slice(1,v.length);
    let encoded = tail_values.map(map_fn);
    return col + " " + encode_operator(v[0],opts) + " " + encoded.join(" ");
  }
  else{
    return col + " = " + encode_query_value(v,column_fn,opts);
  }
}

// xt.db.text.sql-util/encode-query-single-string [326] 
export function encode_query_single_string(params,opts){
  let column_fn = (null == opts["column_fn"]) ? (function (x){
    return x;
  }) : opts["column_fn"];
  let sort_keys = (null == opts["sort_keys"]) ? true : opts["sort_keys"];
  let out = "";
  let query_pairs = Object.entries(params);
  if(sort_keys){
    query_pairs = xtd.arr_sort(query_pairs,function (arr){
      return arr[0];
    },function (x,y){
      return 0 > x.localeCompare(y);
    });
  }
  for(let e of query_pairs){
    let [key,v] = e;
    if(0 < out.length){
      out = (out + " AND ");
    }
    out = (out + encode_query_segment(key,v,column_fn,opts));
  };
  return out;
}

// xt.db.text.sql-util/encode-query-string [343] 
export function encode_query_string(params,prefix,opts){
  let out = xtd.arrayify(params).map(function (p){
    return encode_query_single_string(p,opts);
  }).filter(function (e){
    return (null != e) && (0 < e.length);
  });
  let joined = out.map(function (s){
    return "(" + s + ")";
  }).join(" OR ");
  if(0 == out.length){
    return "";
  }
  else if(1 == out.length){
    return xtd.not_emptyp(prefix) ? (prefix + " " + out[0]) : out[0];
  }
  else{
    return xtd.not_emptyp(prefix) ? (prefix + " " + joined) : joined;
  }
}

// xt.db.text.sql-util/LIMIT [366] 
export function LIMIT(val){
  return {
    "::":"sql/keyword",
    "name":"LIMIT",
    "args":[{"::":"sql/keyword","name":val}]
  };
}

// xt.db.text.sql-util/OFFSET [375] 
export function OFFSET(val){
  return {
    "::":"sql/keyword",
    "name":"OFFSET",
    "args":[{"::":"sql/keyword","name":val}]
  };
}

// xt.db.text.sql-util/ORDER-BY [384] 
export function ORDER_BY(columns){
  return {
    "::":"sql/keyword",
    "name":"ORDER BY",
    "args":[
        {
          "::":"sql/tuple",
          "args":columns.map(function (column){
              return {"::":"sql/column","name":column};
            })
        }
      ]
  };
}

// xt.db.text.sql-util/ORDER-SORT [396] 
export function ORDER_SORT(order){
  return {"::":"sql/keyword","name":xts.to_uppercase(order)};
}

// xt.db.text.sql-util/default-quote-fn [403] 
export function default_quote_fn(s){
  return "\"" + s + "\"";
}

// xt.db.text.sql-util/default-return-format-fn [409] 
export function default_return_format_fn(input,nest_fn,column_fn,opts){
  if((null != input) && ("object" == (typeof input)) && !Array.isArray(input)){
    if(null != input["::"]){
      return encode_sql(input,column_fn,opts,encode_loop_fn);
    }
    else{
      return input["expr"] + ((null != input["as"]) ? (" AS " + input["as"]) : "");
    }
  }
  else if(Array.isArray(input)){
    return nest_fn(input);
  }
  else if("string" == (typeof input)){
    return column_fn(input);
  }
  else{
    throw "Invalid input - " + String(input);
  }
}

// xt.db.text.sql-util/default-table-fn [430] 
export function default_table_fn(table,lookup){
  return "\"" + lookup[table]["schema"] + "\".\"" + table + "\"";
}

// xt.db.text.sql-util/postgres-wrapper-fn [438] 
export function postgres_wrapper_fn(s,indent){
  return "WITH j_ret AS (\n" + xts.pad_lines(s,2," ") + "\n) SELECT jsonb_agg(j_ret) FROM j_ret";
}

// xt.db.text.sql-util/postgres-opts [446] 
export function postgres_opts(lookup){
  return {
    "return_join_fn":function (arr){
        return arr.join(", ");
      },
    "strict":true,
    "wrapper_fn":postgres_wrapper_fn,
    "querystr_fn":encode_query_string,
    "types":PG,
    "values":{"cast":true,"replace":{}},
    "return_link_fn":function (s,link_name){
        return "(" + s + ") AS " + link_name;
      },
    "return_format_fn":default_return_format_fn,
    "coerce":{},
    "return_count_fn":function (){
        return "count" + "(*)";
      },
    "column_fn":default_quote_fn,
    "table_fn":function (table){
        return default_table_fn(table,lookup);
      }
  };
}

// xt.db.text.sql-util/sqlite-return-format-fn [468] 
export function sqlite_return_format_fn(input,nest_fn,column_fn,opts){
  if((null != input) && ("object" == (typeof input)) && !Array.isArray(input)){
    return "'" + input["as"] + "'" + ", " + input["expr"];
  }
  else if(Array.isArray(input)){
    return nest_fn(input);
  }
  else if("string" == (typeof input)){
    return "'" + input + "'" + ", " + column_fn(input);
  }
  else{
    throw "Invalid input - " + String(input);
  }
}

// xt.db.text.sql-util/sqlite-to-boolean [486] 
export function sqlite_to_boolean(v){
  if("number" == (typeof v)){
    return 1 == v;
  }
  return v;
}