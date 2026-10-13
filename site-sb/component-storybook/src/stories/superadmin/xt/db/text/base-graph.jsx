import * as xtd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as scope from '@statstrade/edge/lib/xt/db/text/base-scope.jsx'

// xt.db.text.base-graph/tree-params? [9] 
export function tree_paramsp(params){
  return ((null != params) && ("object" == (typeof params)) && !Array.isArray(params)) && !Array.isArray(params) && ((null != params["where"]) || (null != params["data"]) || (null != params["links"]) || (null != params["custom"]));
}

// xt.db.text.base-graph/tree? [21] 
export function treep(query){
  return Array.isArray(query) && (query.length >= 2) && tree_paramsp(xtd.second(query));
}

// xt.db.text.base-graph/normalise-tree-params [30] 
export function normalise_tree_params(params){
  let out = Object.assign({},params || {});
  if(null == out["where"]){
    out["where"] = [];
  }
  if(null == out["data"]){
    out["data"] = [];
  }
  if(null == out["links"]){
    out["links"] = [];
  }
  if(null == out["custom"]){
    out["custom"] = [];
  }
  return out;
}

// xt.db.text.base-graph/normalise-tree [45] 
export function normalise_tree(query){
  if(!treep(query)){
    return query;
  }
  else{
    return [query[0],normalise_tree_params(xtd.second(query))];
  }
}

// xt.db.text.base-graph/base-query-inputs [54] 
export function base_query_inputs(query){
  let table_name = query[0];
  let cnt = query.length;
  if(cnt == 1){
    return [table_name,{},null];
  }
  else if(cnt == 3){
    return [table_name,query[1],xtd.nth(query,2)];
  }
  else if(Array.isArray(query[1])){
    return [table_name,{},query[1]];
  }
  else{
    return [table_name,query[1],null];
  }
}

// xt.db.text.base-graph/select-tree [72] 
export function select_tree(schema,query,opts){
  opts = (opts || {});
  if(treep(query)){
    return normalise_tree(query);
  }
  else{
    let input = scope.get_link_standard(query);
    let table_name = input[0];
    let linked = xtd.second(input);
    let return_params = linked[linked.length + -1];
    let where_params = linked.filter(function (x){
      return ((null != x) && ("object" == (typeof x)) && !Array.isArray(x)) && xtd.not_emptyp(x);
    });
    return scope.get_tree(schema,table_name,where_params,return_params,opts);
  }
}