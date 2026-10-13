import * as xtd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as xtsb from '@statstrade/edge/lib/xt/lang/common-sort-by.jsx'

import * as base_graph from '@statstrade/edge/lib/xt/db/text/base-graph.jsx'

import * as base_tree from '@statstrade/edge/lib/xt/db/text/base-tree.jsx'

// xt.db.system.memory-graph/check-in-clause [11] 
export function check_in_clause(x,expr){
  return expr[0].some(function (e){
    return e == x;
  });
}

// xt.db.system.memory-graph/like-char-at [18] 
export function like_char_at(s,i){
  if((i < 0) || (i >= s.length)){
    return "";
  }
  return s.substring(i,i + 1);
}

// xt.db.system.memory-graph/check-like-clause [29] 
export function check_like_clause(x,expr){
  if(!("string" == (typeof x)) || !("string" == (typeof expr))){
    return false;
  }
  let slen = x.length;
  let plen = expr.length;
  let sidx = 0;
  let pidx = 0;
  let star_pidx = -1;
  let star_sidx = -1;
  while(sidx < slen){
    let sch = like_char_at(x,sidx);
    let pch = (pidx < plen) ? like_char_at(expr,pidx) : null;
    if(("\\" == pch) && ((pidx + 1) < plen) && (sch == like_char_at(expr,pidx + 1))){
      sidx = (sidx + 1);
      pidx = (pidx + 2);
    }
    else if(("\\" == pch) && (sch == "\\") && ((pidx + 1) == plen)){
      sidx = (sidx + 1);
      pidx = (pidx + 1);
    }
    else if("%" == pch){
      star_pidx = pidx;
      star_sidx = sidx;
      pidx = (pidx + 1);
    }
    else if(("_" == pch) || (sch == pch)){
      sidx = (sidx + 1);
      pidx = (pidx + 1);
    }
    else if(star_pidx < 0){
      return false;
    }
    else{
      star_sidx = (star_sidx + 1);
      sidx = star_sidx;
      pidx = (star_pidx + 1);
    }
  }
  while(pidx < plen){
    if("%" == like_char_at(expr,pidx)){
      pidx = (pidx + 1);
    }
    else{
      return false;
    }
  }
  return true;
}

// xt.db.system.memory-graph/LINK_LOOKUP [82] 
export var LINK_LOOKUP = {"forward":"ref_links","reverse":"rev_links"};

// xt.db.system.memory-graph/check-ilike-clause [86] 
export function check_ilike_clause(x,expr){
  if(!("string" == (typeof x)) || !("string" == (typeof expr))){
    return false;
  }
  return check_like_clause(x.toLowerCase(),expr.toLowerCase());
}

// xt.db.system.memory-graph/PULL_CHECK [98] 
export var PULL_CHECK = {
  "not_in":function (x,expr){
    return !check_in_clause(x,expr);
  },
  "lt":function (x,y){
    return x < y;
  },
  "neq":function (x,expr){
    return x != expr;
  },
  "eq":function (x,y){
    return x == y;
  },
  "is":function (x,expr){
    return x == expr;
  },
  "like":check_like_clause,
  "gt":function (x,y){
    return x > y;
  },
  "gte":function (x,y){
    return x >= y;
  },
  "is_not_null":function (value){
    return null != value;
  },
  "is_null":function (value){
    return null == value;
  },
  "between":function (x,start_expr,_and,end_expr){
    return (x >= start_expr) && ((_and == "and") ? (x <= end_expr) : (x <= _and));
  },
  "not_like":function (x,expr){
    return !check_like_clause(x,expr);
  },
  "lte":function (x,y){
    return x <= y;
  },
  "ilike":check_ilike_clause,
  "in":check_in_clause
};

// xt.db.system.memory-graph/custom-params [122] 
export function custom_params(custom){
  let out = {
    "count":false,
    "order_by":null,
    "order_sort":null,
    "limit":null,
    "offset":null
  };
  for(let entry of custom || []){
    if(entry["::"] == "sql/count"){
      out["count"] = true;
    }
    else if(entry["::"] == "sql/keyword"){
      let {name} = entry;
      if(name == "ORDER BY"){
        let tuple = (entry["args"] || [])[0];
        out["order_by"] = (tuple["args"] || []).map(function (arg){
          return arg["name"];
        });
      }
      else if((name == "ASC") || (name == "DESC")){
        out["order_sort"] = name.toLowerCase();
      }
      else if(name == "LIMIT"){
        out["limit"] = (entry["args"] || [])[0]["name"];
      }
      else if(name == "OFFSET"){
        out["offset"] = (entry["args"] || [])[0]["name"];
      }
    }
  };
  return out;
}

// xt.db.system.memory-graph/check-clause-value [160] 
export function check_clause_value(record,key,clause){
  if(key.endsWith("_id")){
    let base_key = key.substring(0,key.length - 3);
    return clause ==     (Object.keys(xtd.get_in(record,["ref_links",base_key]) || {}))[0];
  }
  else{
    return clause == xtd.get_in(record,["data",key]);
  }
}

// xt.db.system.memory-graph/check-clause-function [174] 
export function check_clause_function(record,link_type,key,pred,exprs){
  if(null == pred){
    return false;
  }
  else if(null == link_type){
    return pred(xtd.get_in(record,["data",key]),...exprs);
  }
  else if(link_type == "forward"){
    if(pred == PULL_CHECK["is_null"]){
      return pred(xtd.get_in(record,["ref_links",key]));
    }
    else{
      return Object.keys(xtd.get_in(record,["ref_links",key]) || {}).some(function (v){
        return pred(v,...exprs);
      });
    }
  }
  else if(link_type == "reverse"){
    return Object.keys(xtd.get_in(record,["rev_links",key]) || {}).some(function (v){
      return pred(v,...exprs);
    });
  }
}

// xt.db.system.memory-graph/where-clause [199] 
export function where_clause(rows,schema,table_name,record,where_fn,key,clause){
  let link_type = xtd.get_in(schema,[table_name,key,"ref","type"]);
  if(Array.isArray(clause)){
    let tag = clause[0];
    let exprs = [...clause];
    exprs.shift();
    return check_clause_function(record,link_type,key,PULL_CHECK[tag],exprs);
  }
  else if("function" == (typeof clause)){
    return check_clause_function(record,link_type,key,clause,[]);
  }
  else if((null != clause) && ("object" == (typeof clause)) && !Array.isArray(clause)){
    let ref = xtd.get_in(schema,[table_name,key,"ref"]);
    let link_table = ref["ns"];
    let link_map_key = LINK_LOOKUP[ref["type"]];
    let ids = Object.keys(xtd.get_in(record,[link_map_key,key]) || {});
    let entries = Object.values(xtd.obj_pick(rows[link_table] || {},ids));
    let found = entries.filter(function (entry){
      return where_fn(rows,schema,link_table,clause,entry["record"]);
    });
    return 0 < found.length
  }
  else{
    return check_clause_value(record,key,clause);
  }
}

// xt.db.system.memory-graph/where [245] 
export function where(rows,schema,table_name,where,record){
  let clause_fn = function (pair){
    let [k,clause] = pair;
    return where_clause(rows,schema,table_name,record,where,k,clause);
  };
  if("function" == (typeof where)){
    return where(record,table_name);
  }
  else if(xtd.is_emptyp(where)){
    return true;
  }
  else if(Array.isArray(where)){
    return where.some(function (or_clause){
      return where(rows,schema,table_name,or_clause,record);
    });
  }
  else{
    return Object.entries(xtd.obj_filter(where,function (value){
      return null != value;
    })).every(clause_fn);
  }
}

// xt.db.system.memory-graph/data-field [269] 
export function data_field(record,key){
  if(key.endsWith("_id")){
    let base_key = key.substring(0,key.length - 3);
    return     (Object.keys(xtd.get_in(record,["ref_links",base_key]) || {}))[0];
  }
  else{
    return xtd.get_in(record,["data",key]);
  }
}

// xt.db.system.memory-graph/project-record [282] 
export function project_record(rows,schema,tree,record,opts,pull_entries_fn){
  let params = xtd.second(tree);
  let data = params["data"] || [];
  let links = params["links"] || [];
  let out = {};
  for(let key of data){
    out[key] = data_field(record,key);
  };
  for(let link of links){
    let link_name = link[0];
    let link_type = xtd.second(link);
    let child_tree = xtd.nth(link,2);
    let link_map_key = LINK_LOOKUP[link_type];
    let ids = Object.keys(xtd.get_in(record,[link_map_key,link_name]) || {});
    let child_table = child_tree[0];
    let child_entries = Object.values(xtd.obj_pick(rows[child_table] || {},ids));
    let child_output = pull_entries_fn(rows,schema,child_tree,child_entries,opts);
    out[link_name] = ((Array.isArray(child_output) && (0 < child_output.length)) ? child_output : null);
  };
  return out;
}

// xt.db.system.memory-graph/apply-custom [311] 
export function apply_custom(out,custom){
  if(null != custom["order_by"]){
    out = xtsb.sort_by(out,custom["order_by"]);
  }
  if(custom["order_sort"] == "desc"){
    out = out.slice().reverse();
  }
  if((null != custom["offset"]) || (null != custom["limit"])){
    let sidx = custom["offset"] || 0;
    let total = out.length;
    let eidx = sidx + (custom["limit"] || (total - sidx));
    eidx = Math.min(eidx,total);
    out = out.slice(sidx,eidx);
  }
  return out;
}

// xt.db.system.memory-graph/pull-entries [330] 
export function pull_entries(rows,schema,tree,entries,opts){
  let table_name = tree[0];
  let params = xtd.second(tree);
  let where_clause = params["where"];
  let custom = custom_params(params["custom"]);
  let matched = (entries || []).filter(function (entry){
    return where(rows,schema,table_name,where_clause,entry["record"]);
  });
  if(custom["count"]){
    return matched.length;
  }
  let out = matched.map(function (entry){
    return project_record(rows,schema,tree,entry["record"],opts,pull_entries);
  });
  return apply_custom(out,custom);
}

// xt.db.system.memory-graph/pull [360] 
export function pull(rows,schema,tree,opts){
  tree = base_graph.select_tree(schema,tree,opts);
  let table_name = tree[0];
  let entries = Object.values(rows[table_name] || {});
  return pull_entries(rows,schema,tree,entries,opts);
}

// xt.db.system.memory-graph/view-select [375] 
export function view_select(rows,schema,entry,args,opts){
  let tree = base_tree.plan_select(schema,entry,args,opts);
  return pull(rows,schema,tree,opts);
}

// xt.db.system.memory-graph/view-count [382] 
export function view_count(rows,schema,entry,args,opts){
  let tree = base_tree.plan_count(schema,entry,args,opts);
  return pull(rows,schema,tree,opts);
}

// xt.db.system.memory-graph/view-return [389] 
export function view_return(rows,schema,entry,id,args,opts){
  let tree = base_tree.plan_return(schema,entry,id,args,opts);
  return pull(rows,schema,tree,opts);
}

// xt.db.system.memory-graph/view-return-bulk [396] 
export function view_return_bulk(rows,schema,entry,ids,args,opts){
  let tree = base_tree.plan_return_bulk(schema,entry,ids,args,opts);
  return pull(rows,schema,tree,opts);
}

// xt.db.system.memory-graph/view-combined [403] 
export function view_combined(rows,schema,sel_entry,sel_args,ret_entry,ret_args,ret_omit,opts){
  let tree = base_tree.plan_combined(schema,sel_entry,sel_args,ret_entry,ret_args,ret_omit,opts,false);
  return pull(rows,schema,tree,opts);
}