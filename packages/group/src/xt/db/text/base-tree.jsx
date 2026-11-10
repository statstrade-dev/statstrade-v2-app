import * as xtt from '@statstrade/edge/lib/xt/lang/common-tree.jsx'

import * as xtd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as base_scope from '@statstrade/edge/lib/xt/db/text/base-scope.jsx'

import * as check from '@statstrade/edge/lib/xt/db/text/base-check.jsx'

import * as sql_util from '@statstrade/edge/lib/xt/db/text/sql-util.jsx'

import * as sql_graph from '@statstrade/edge/lib/xt/db/text/sql-graph.jsx'

// xt.db.text.base-tree/tree-control-array [13] 
export function tree_control_array(control){
  if(xtd.is_emptyp(control)){
    return [];
  }
  let out = [];
  let {limit,offset,order_by,order_sort} = control;
  if(Array.isArray(order_by)){
    out.push(sql_util.ORDER_BY(order_by));
  }
  if(null != order_sort){
    out.push(sql_util.ORDER_SORT(order_sort));
  }
  if("number" == (typeof limit)){
    out.push(sql_util.LIMIT(limit));
  }
  if("number" == (typeof offset)){
    out.push(sql_util.OFFSET(offset));
  }
  return out;
}

// xt.db.text.base-tree/tree-base [35] 
export function tree_base(schema,table_name,sel_query,clause,returning,opts){
  let tarr = base_scope.merge_queries(sel_query,clause);
  let tree = xtd.arr_assign([table_name],tarr);
  if(xtd.not_emptyp(returning)){
    tree.push(returning);
  }
  return sql_graph.select_tree(schema,tree,opts);
}

// xt.db.text.base-tree/tree-count [45] 
export function tree_count(schema,entry,clause,opts){
  let {control,view} = entry;
  let {query,table} = view;
  return tree_base(
    schema,
    table,
    query,
    clause,
    xtd.arr_assign([{"::":"sql/count"}],tree_control_array(control)),
    opts
  );
}

// xt.db.text.base-tree/tree-select [55] 
export function tree_select(schema,entry,clause,opts){
  let {control,view} = entry;
  let {query,table} = view;
  return tree_base(
    schema,
    table,
    query,
    clause,
    xtd.arr_assign(["id"],tree_control_array(control)),
    opts
  );
}

// xt.db.text.base-tree/tree-return [65] 
export function tree_return(schema,entry,sel_query,clause,opts){
  let {view} = entry;
  let {query,table} = view;
  return tree_base(schema,table,sel_query,clause,query,opts);
}

// xt.db.text.base-tree/tree-combined [73] 
export function tree_combined(schema,sel_entry,ret_entry,ret_omit,clause,opts){
  let {control} = sel_entry;
  let sel_table = sel_entry["view"]["table"];
  let ret_table = ret_entry["view"]["table"];
  let sel_query = sel_entry["view"]["query"];
  let ret_query = ret_entry["view"]["query"];
  if(null == sel_query){
    sel_query = {};
  }
  if(null == ret_query){
    ret_query = {};
  }
  let ret_clause = xtd.not_emptyp(ret_omit) ? [{"id":{"not_in":[ret_omit]}}] : [];
  let combined_clause = base_scope.merge_queries(clause,ret_clause);
  return tree_base(
    schema,
    sel_table,
    sel_query,
    combined_clause,
    xtd.arr_assign(ret_query.slice(),tree_control_array(control)),
    opts
  );
}

// xt.db.text.base-tree/tree-fill-input [96] 
export function tree_fill_input(tree,args,input_spec,drop_first){
  let arg_map = {};
  if(drop_first){
    input_spec.shift();
  }
  if(0 == input_spec.length){
    return tree;
  }
  for(let i = 0; i < input_spec.length; ++i){
    let e = input_spec[i];
    arg_map["{{" + e["symbol"] + "}}"] = args[i];
  };
  let out = xtt.tree_walk(tree,function (x){
    return x;
  },function (x){
    if(("string" == (typeof x)) && (null != arg_map[x])){
      return arg_map[x];
    }
    return x;
  });
  return out;
}

// xt.db.text.base-tree/plan-select [123] 
export function plan_select(schema,entry,args,opts){
  let {input} = entry;
  let itree = tree_select(schema,entry,{},opts);
  let qtree = tree_fill_input(itree,args,input.slice(),false);
  return qtree;
}

// xt.db.text.base-tree/plan-count [132] 
export function plan_count(schema,entry,args,opts){
  let {input} = entry;
  let itree = tree_count(schema,entry,{},opts);
  let qtree = tree_fill_input(itree,args,input.slice(),false);
  return qtree;
}

// xt.db.text.base-tree/plan-return [141] 
export function plan_return(schema,entry,id,args,opts){
  let {input} = entry;
  let itree = tree_return(schema,entry,{"id":id},{},opts);
  let qtree = tree_fill_input(itree,args,input.slice(),true);
  return qtree;
}

// xt.db.text.base-tree/plan-return-bulk [150] 
export function plan_return_bulk(schema,entry,ids,args,opts){
  let {input} = entry;
  let itree = tree_return(schema,entry,{"id":["in",[ids]]},{},opts);
  let qtree = tree_fill_input(itree,args,input.slice(),true);
  return qtree;
}

// xt.db.text.base-tree/return-input [163] 
export function return_input(entry){
  let input = entry["input"].slice();
  let identity = entry["view"]["identity"];
  let count = Array.isArray(identity) ? identity.length : 1;
  while((count > 0) && (input.length > 0)){
    input.shift();
    count = (count - 1);
  }
  return input;
}

// xt.db.text.base-tree/plan-combined [174] 
export function plan_combined(schema,sel_entry,sel_args,ret_entry,ret_args,ret_omit,opts,as_tree){
  let sel_input = sel_entry["input"];
  let ret_input = return_input(ret_entry);
  let itree = tree_combined(schema,sel_entry,ret_entry,ret_omit,[],opts);
  let qtree = tree_fill_input(
    itree,
    xtd.arr_assign(ret_args.slice(),sel_args),
    xtd.arr_assign(ret_input.slice(),sel_input),
    false
  );
  return qtree;
}

// xt.db.text.base-tree/plan-view-check [199] 
export function plan_view_check(entry,args,drop_first){
  let targs = entry["input"];
  if(drop_first){
    targs = return_input(entry);
  }
  let l_ok_value = check.check_args_length(args,targs);
  let [l_ok,l_err] = l_ok_value;
  if(!l_ok){
    return [l_ok,l_err];
  }
  let t_ok_value = check.check_args_type(args,targs);
  let [t_ok,t_err] = t_ok_value;
  if(!t_ok){
    return [t_ok,t_err];
  }
  return [true,null];
}

// xt.db.text.base-tree/plan-view [216] 
export function plan_view(schema,query_spec){
  let {return_args,return_bulk,return_count,return_entry,return_id,return_omit,select_args,select_entry,table} = query_spec;
  if((null != select_entry) && (null != return_entry)){
    let s_ok_value = plan_view_check(select_entry,select_args,false);
    let [s_ok,s_err] = s_ok_value;
    if(!s_ok){
      return [s_ok,s_err];
    }
    let r_ok_value = plan_view_check(return_entry,return_args,true);
    let [r_ok,r_err] = r_ok_value;
    if(!r_ok){
      return [r_ok,r_err];
    }
    return [
      true,
      plan_combined(
          schema,
          select_entry,
          select_args,
          return_entry,
          return_args,
          return_omit,
          {},
          false
        )
    ];
  }
  else if(null != select_entry){
    let s_ok_value = plan_view_check(select_entry,select_args,false);
    let [s_ok,s_err] = s_ok_value;
    if(!s_ok){
      return [s_ok,s_err];
    }
    return [
      true,
      return_count ? plan_count(schema,select_entry,select_args,{}) : plan_select(schema,select_entry,select_args,{})
    ];
  }
  else if(null != return_id){
    let rargs = [return_id,...return_args];
    let r_ok_value = plan_view_check(return_entry,rargs,false);
    let [r_ok,r_err] = r_ok_value;
    if(!r_ok){
      return [r_ok,r_err];
    }
    return [
      true,
      plan_return(schema,return_entry,return_id,return_args,{})
    ];
  }
  else if(null != return_bulk){
    let r_ok_value = plan_view_check(return_entry,return_args,true);
    let [r_ok,r_err] = r_ok_value;
    if(!r_ok){
      return [r_ok,r_err];
    }
    return [
      true,
      plan_return_bulk(schema,return_entry,return_bulk,return_args,{})
    ];
  }
  else{
    return [true,null];
  }
}