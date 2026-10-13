import * as xtd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as base_graph from '@statstrade/edge/lib/xt/db/text/base-graph.jsx'

// xt.db.text.pgrest-graph/tree-count? [9] 
export function tree_countp(custom){
  return (custom || []).some(function (entry){
    return entry["::"] == "sql/count";
  });
}

// xt.db.text.pgrest-graph/pgrest-resolve-value [19] 
export function pgrest_resolve_value(value){
  if(((null != value) && ("object" == (typeof value)) && !Array.isArray(value)) && (null != value["::"])){
    let tcls = value["::"];
    if(tcls == "sql/arg"){
      return value["name"];
    }
    else if(tcls == "sql/cast"){
      return pgrest_resolve_value((value["args"])[0]);
    }
    else if(tcls == "sql/defenum"){
      return value["name"];
    }
    else{
      return value;
    }
  }
  else{
    return value;
  }
}

// xt.db.text.pgrest-graph/value->query-text [42] 
export function value__gtquery_text(value){
  value = pgrest_resolve_value(value);
  if(null == value){
    return "null";
  }
  else if("string" == (typeof value)){
    return value;
  }
  else if("boolean" == (typeof value)){
    return value ? "true" : "false";
  }
  else if("number" == (typeof value)){
    return String(value);
  }
  else{
    return String(value);
  }
}

// xt.db.text.pgrest-graph/normalise-in-values [62] 
export function normalise_in_values(value){
  if(Array.isArray(value) && (1 == value.length) && Array.isArray(value[0])){
    return value[0];
  }
  else if(Array.isArray(value)){
    return value;
  }
  else{
    return [value];
  }
}

// xt.db.text.pgrest-graph/filter-operator? [77] 
export function filter_operatorp(op){
  return (op == "eq") || (op == "neq") || (op == "gt") || (op == "gte") || (op == "lt") || (op == "lte") || (op == "like") || (op == "ilike") || (op == "is") || (op == "in");
}

// xt.db.text.pgrest-graph/compile-filter-value [92] 
export function compile_filter_value(op,value){
  if(op == "in"){
    return op + ".(" + normalise_in_values(value).map(value__gtquery_text).join(",") + ")";
  }
  else{
    return op + "." + value__gtquery_text(value);
  }
}

// xt.db.text.pgrest-graph/compile-filter-fragment [109] 
export function compile_filter_fragment(filter){
  return filter["path"] + "." + compile_filter_value(filter["op"],filter["value"]);
}

// xt.db.text.pgrest-graph/compile-clause-into [118] 
export function compile_clause_into(prefix,clause,out){
  for(let key of xtd.arr_sort(Object.keys(clause || {}),function (value){
    return String(value);
  },function (x,y){
    return 0 > x.localeCompare(y);
  })){
    let value = clause[key];
    let path = xtd.not_emptyp(prefix) ? (prefix + "." + key) : key;
    if(((null != value) && ("object" == (typeof value)) && !Array.isArray(value)) && !Array.isArray(value) && (null == value["::"])){
      compile_clause_into(path,value,out);
    }
    else if(Array.isArray(value) && ("string" == (typeof value[0])) && filter_operatorp(value[0])){
      out.push({"path":path,"op":value[0],"value":value[1]});
    }
    else if(Array.isArray(value) && ("string" == (typeof value[0]))){
      throw "Unsupported filter operator - " + value[0];
    }
    else{
      out.push({"path":path,"op":"eq","value":value});
    }
  };
  return out;
}

// xt.db.text.pgrest-graph/compile-or-clause [151] 
export function compile_or_clause(clause){
  let fragments = compile_clause_into("",clause,[]).map(compile_filter_fragment);
  if(0 == fragments.length){
    return "";
  }
  else if(1 == fragments.length){
    return fragments[0];
  }
  else{
    return "and(" + fragments.join(",") + ")";
  }
}

// xt.db.text.pgrest-graph/forward-ref-column? [168] 
export function forward_ref_columnp(schema,table_name,key){
  let table = schema[table_name];
  let col = table && table[key];
  return ((null != col) && ("object" == (typeof col)) && !Array.isArray(col)) && ("ref" == col["type"]) && !("reverse" == col["ref"]["type"]);
}

// xt.db.text.pgrest-graph/flatten-forward-ref-clause [178] 
export function flatten_forward_ref_clause(schema,table_name,clause){
  let out = {};
  for(let [k,v] of Object.entries(clause)){
    if(forward_ref_columnp(schema,table_name,k) && ((null != v) && ("object" == (typeof v)) && !Array.isArray(v)) && (null != v["id"])){
      out[k + "_id"] = v["id"];
    }
    else if((null != v) && ("object" == (typeof v)) && !Array.isArray(v)){
      out[k] = flatten_forward_ref_clause(schema,table_name,v);
    }
    else{
      out[k] = v;
    }
  };
  return out;
}

// xt.db.text.pgrest-graph/flatten-forward-ref-filters [196] 
export function flatten_forward_ref_filters(schema,table_name,where){
  where = (Array.isArray(where) ? where : (((null != where) && ("object" == (typeof where)) && !Array.isArray(where)) ? [where] : []));
  return where.map(function (clause){
    return flatten_forward_ref_clause(schema,table_name,clause);
  });
}

// xt.db.text.pgrest-graph/compile-where-params [205] 
export function compile_where_params(where){
  where = (Array.isArray(where) ? where : (((null != where) && ("object" == (typeof where)) && !Array.isArray(where)) ? [where] : []));
  if(0 == where.length){
    return [];
  }
  if(1 == where.length){
    return compile_clause_into("",where[0],[]).map(function (filter){
      return filter["path"] + "=" + compile_filter_value(filter["op"],filter["value"]);
    });
  }
  let clauses = where.map(compile_or_clause).filter(xtd.not_emptyp);
  return ["or=(" + clauses.join(",") + ")"];
}

// xt.db.text.pgrest-graph/compile-tree-select-item [226] 
export function compile_tree_select_item(item,select_params_fn){
  if("string" == (typeof item)){
    return item;
  }
  else if(Array.isArray(item) && (item.length >= 3) && ("string" == (typeof item[0]))){
    return item[0] + ":" + (xtd.nth(item,2))[0] + "(" + select_params_fn(xtd.second(xtd.nth(item,2))) + ")";
  }
  else{
    return String(pgrest_resolve_value(item));
  }
}

// xt.db.text.pgrest-graph/compile-tree-select-params [246] 
export function compile_tree_select_params(params){
  let {custom,data,links} = params;
  if(tree_countp(custom)){
    return "count";
  }
  let out = [];
  xtd.arr_assign(out,(data || []).map(function (item){
    return pgrest_resolve_value(item);
  }));
  xtd.arr_assign(out,(links || []).map(function (item){
    return compile_tree_select_item(item,compile_tree_select_params);
  }));
  return (out.length > 0) ? out.join(",") : "*";
}

// xt.db.text.pgrest-graph/compile-control-params [265] 
export function compile_control_params(custom){
  let order_cols = null;
  let order_sort = null;
  let limit = null;
  let offset = null;
  for(let entry of custom || []){
    if(entry["::"] == "sql/keyword"){
      let {name} = entry;
      if(name == "ORDER BY"){
        let tuple = (entry["args"] || [])[0];
        order_cols = (tuple["args"] || []).map(function (arg){
          return arg["name"];
        });
      }
      else if((name == "ASC") || (name == "DESC")){
        order_sort = name.toLowerCase();
      }
      else if(name == "LIMIT"){
        limit = (entry["args"] || [])[0]["name"];
      }
      else if(name == "OFFSET"){
        offset = (entry["args"] || [])[0]["name"];
      }
    }
  };
  let out = [];
  if(Array.isArray(order_cols)){
    out.push("order=" + order_cols.map(function (col){
      return (null != order_sort) ? (col + "." + order_sort) : col;
    }).join(","));
  }
  if(null != limit){
    out.push("limit=" + value__gtquery_text(limit));
  }
  if(null != offset){
    out.push("offset=" + value__gtquery_text(offset));
  }
  return out;
}

// xt.db.text.pgrest-graph/compile-query-string [308] 
export function compile_query_string(params){
  return (params || []).join("&");
}

// xt.db.text.pgrest-graph/compile-url [314] 
export function compile_url(path,params){
  let query = compile_query_string(params);
  return xtd.not_emptyp(query) ? (path + "?" + query) : path;
}

// xt.db.text.pgrest-graph/select-return [323] 
export function select_return(schema,tree,indent,opts){
  tree = base_graph.select_tree(schema,tree,opts);
  let table_name = tree[0];
  let params = xtd.second(tree);
  let where = flatten_forward_ref_filters(schema,table_name,params["where"] || []);
  params["where"] = where;
  let custom = params["custom"] || [];
  let select = compile_tree_select_params(params);
  let request_params = ["select=" + select];
  request_params = request_params.concat(compile_where_params(where));
  request_params = request_params.concat(compile_control_params(custom));
  let path = "/rest/v1/" + table_name;
  let query = compile_query_string(request_params);
  let url = compile_url(path,request_params);
  return {
    "table":table_name,
    "url":url,
    "params":request_params,
    "method":"GET",
    "query":query,
    "path":path,
    "filters":where,
    "select":select,
    "type":"query",
    "headers":{}
  };
}

// xt.db.text.pgrest-graph/select-tree [353] 
export function select_tree(schema,query,opts){
  return base_graph.select_tree(schema,query,opts);
}

// xt.db.text.pgrest-graph/select [359] 
export function select(schema,query,opts){
  return select_return(schema,query,0,opts);
}