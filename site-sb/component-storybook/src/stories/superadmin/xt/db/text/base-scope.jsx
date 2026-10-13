import * as xtt from '@statstrade/edge/lib/xt/lang/common-tree.jsx'

import * as xtd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as xts from '@statstrade/edge/lib/xt/lang/common-string.jsx'

// xt.db.text.base-scope/Scopes [20] 
export var Scopes = {
  "*/min":{"-/id":true,"-/key":true},
  "*/info":{"-/info":true,"-/id":true,"-/key":true},
  "*/data":{"-/info":true,"-/id":true,"-/data":true,"-/key":true},
  "*/default":{
    "-/info":true,
    "-/id":true,
    "-/ref":true,
    "-/data":true,
    "-/key":true
  },
  "*/detail":{
    "-/detail":true,
    "-/info":true,
    "-/id":true,
    "-/data":true,
    "-/key":true
  },
  "*/standard":{
    "-/detail":true,
    "-/info":true,
    "-/id":true,
    "-/ref":true,
    "-/data":true,
    "-/key":true
  },
  "*/all":{
    "-/detail":true,
    "-/info":true,
    "-/id":true,
    "-/ref":true,
    "-/data":true,
    "-/system":true,
    "-/key":true
  },
  "*/everything":{
    "-/detail":true,
    "-/info":true,
    "-/hidden":true,
    "-/id":true,
    "-/ref":true,
    "-/data":true,
    "-/system":true,
    "-/key":true
  }
};

// xt.db.text.base-scope/merge-queries [66] 
export function merge_queries(q_0,q_1){
  let arr_0 = xtd.arrayify(q_0).filter(xtd.not_emptyp);
  let arr_1 = xtd.arrayify(q_1).filter(xtd.not_emptyp);
  if(xtd.arr_emptyp(arr_0)){
    return arr_1;
  }
  if(xtd.arr_emptyp(arr_1)){
    return arr_0;
  }
  let out = [];
  for(let e_0 of arr_0){
    for(let e_1 of arr_1){
      out.push(xtd.obj_assign_nested(xtt.tree_walk(e_0,function (x){
        return x;
      },function (x){
        return x;
      }),xtt.tree_walk(e_1,function (x){
        return x;
      },function (x){
        return x;
      })));
    };
  };
  return out;
}

// xt.db.text.base-scope/filter-scope [84] 
export function filter_scope(ks){
  let mscopes = ks.filter(function (s){
    return "-" == xts.sym_ns(s);
  });
  let ascopes = ks.filter(function (s){
    return "*" == xts.sym_ns(s);
  });
  return ascopes.map(function (s){
    return Scopes[s];
  }).reduce(function (obj,other){
    return Object.assign(obj,other);
  },xtd.arr_lookup(mscopes));
}

// xt.db.text.base-scope/filter-plain-key [97] 
export function filter_plain_key(s){
  if(null == xts.sym_ns(s)){
    return ((s.length >= 3) && s.endsWith("_id")) ? s.substring(0,s.length - 3) : s;
  }
}

// xt.db.text.base-scope/filter-plain [107] 
export function filter_plain(ks){
  return xtd.arr_lookup(xtd.arr_keep(ks,filter_plain_key));
}

// xt.db.text.base-scope/get-data-columns [114] 
export function get_data_columns(schema,table_key,ks){
  let str_ks = ks.filter(function (value){
    return "string" == (typeof value);
  });
  let scopes = filter_scope(str_ks);
  let plains = filter_plain(str_ks);
  let cols = schema[table_key];
  if(null == cols){
    throw "ERR - Table not in Schema - " + table_key;
  }
  let scoped = Object.values(cols).filter(function (e){
    return ((null != e["scope"]) && (true == scopes["-/" + e["scope"]])) || (null != plains[e["ident"]]);
  });
  return xtd.arr_sort(scoped,function (e){
    return e["order"];
  },function (a,b){
    return a < b;
  });
}

// xt.db.text.base-scope/get-link-standard [137] 
export function get_link_standard(link){
  let ltag = link[0];
  let llen = link.length;
  if(1 == llen){
    return [ltag,[{},["*/data"]]];
  }
  let lmap = link.filter(function (value){
    return (null != value) && ("object" == (typeof value)) && !Array.isArray(value);
  });
  let larr = link.filter(function (value){
    return Array.isArray(value);
  });
  if(0 == larr.length){
    larr = [["*/data"]];
  }
  if(0 == lmap.length){
    lmap = [{}];
  }
  let lout = [];
  xtd.arr_assign(lout,lmap);
  xtd.arr_assign(lout,larr);
  return [ltag,lout];
}

// xt.db.text.base-scope/get-query-tables [159] 
export function get_query_tables(schema,table_key,query,acc){
  acc = (((null != acc) && ("object" == (typeof acc)) && !Array.isArray(acc)) ? acc : {});
  let table = schema[table_key];
  if(table){
    acc[table_key] = true;
    for(let [k,v] of Object.entries(query)){
      let e = table[k];
      if("ref" == e["type"]){
        let link_key = e["ref"]["ns"];
        if((null != v) && ("object" == (typeof v)) && !Array.isArray(v)){
          get_query_tables(schema,link_key,v,acc);
        }
        else{
          acc[link_key] = true;
        }
      }
    };
  }
  return acc;
}

// xt.db.text.base-scope/get-link-columns [178] 
export function get_link_columns(schema,table_key,ks){
  let link_arr = ks.filter(function (value){
    return Array.isArray(value);
  });
  let linked = xtd.obj_from_pairs(link_arr.map(get_link_standard));
  let cols = schema[table_key];
  return xtd.arr_keepf(Object.values(cols),function (col){
    return null != linked[col["ident"]];
  },function (col){
    return [col,linked[col["ident"]]];
  });
}

// xt.db.text.base-scope/get-linked-tables-loop [191] 
export function get_linked_tables_loop(schema,table_key,returning,acc){
  let linked = get_link_columns(schema,table_key,Array.isArray(returning) ? returning : []);
  acc[table_key] = true;
  for(let arr of linked){
    let attr = arr[0];
    let link_query = xtd.second(arr);
    let link_returning = xtd.second(link_query);
    get_linked_tables_loop(schema,attr["ref"]["ns"],link_returning,acc);
  };
  return acc;
}

// xt.db.text.base-scope/get-linked-tables [210] 
export function get_linked_tables(schema,table_key,returning){
  return get_linked_tables_loop(schema,table_key,returning,{});
}

// xt.db.text.base-scope/as-where-input [216] 
export function as_where_input(input){
  if(xtd.is_emptyp(input)){
    return [];
  }
  else if(Array.isArray(input)){
    return input;
  }
  else{
    return [input];
  }
}

// xt.db.text.base-scope/get-tree [229] 
export function get_tree(schema,table_name,where,returning,opts){
  let table_fn = (null == opts["table_fn"]) ? (function (x){
    return x;
  }) : opts["table_fn"];
  let column_fn = (null == opts["column_fn"]) ? (function (x){
    return x;
  }) : opts["column_fn"];
  where = as_where_input(where);
  returning = (Array.isArray(returning) ? returning : ["*/data"]);
  let where_pred = function (e){
    return ((null != e) && ("object" == (typeof e)) && !Array.isArray(e)) && (null == e["::"]);
  };
  let custom_pred = function (e){
    return ((null != e) && ("object" == (typeof e)) && !Array.isArray(e)) && ("string" == (typeof e["::"]));
  };
  let custom = returning.filter(custom_pred);
  let data = get_data_columns(schema,table_name,returning);
  let links = get_link_columns(schema,table_name,returning);
  let get_child_tree = function (link){
    let attr = link[0];
    let link_query = xtd.second(link);
    let link_where_query = link_query.filter(where_pred);
    let link_returning = link_query[link_query.length + -1];
    let link_where_returning = link_returning.filter(where_pred);
    let link_where = merge_queries(link_where_query,link_where_returning);
    let link_table = attr["ref"]["ns"];
    let link_type = attr["ref"]["type"];
    let link_extra = {};
    if("reverse" == link_type){
      link_extra[attr["ref"]["rkey"]] = ["eq",[table_fn(table_name) + "." + column_fn("id")]];
    }
    else{
      link_extra["id"] = [
        "eq",
        [
              table_fn(table_name) + "." + column_fn(attr["ref"]["key"] + "_id")
            ]
      ];
    }
    return [
      attr["ident"],
      link_type,
      get_tree(
          schema,
          link_table,
          merge_queries(link_where,link_extra),
          link_returning,
          opts
        )
    ];
  };
  return [
    table_name,
    {
      "where":where,
      "data":data.map(function (e){
          return ("ref" == e["type"]) ? (e["ident"] + "_id") : e["ident"];
        }),
      "links":links.map(get_child_tree),
      "custom":custom
    }
  ];
}