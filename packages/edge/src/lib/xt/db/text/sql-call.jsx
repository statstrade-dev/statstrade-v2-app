import * as check from '@statstrade/edge/lib/xt/db/text/base-check.jsx'

import * as ut from '@statstrade/edge/lib/xt/db/text/sql-util.jsx'

import * as conn_sql from '@statstrade/edge/lib/xt/net/conn-sql.jsx'

// xt.db.text.sql-call/decode-return [12] 
export function decode_return(outstr,alt){
  let out = JSON.parse(outstr);
  let {data,status} = out;
  if("error" == status){
    throw "ERR - API: " + outstr;
  }
  return data;
}

// xt.db.text.sql-call/call-format-input [22] 
export function call_format_input(spec,args){
  let targs = spec["input"];
  let out = [];
  for(let i = 0; i < args.length; ++i){
    let arg = args[i];
    let input = targs[i];
    let dbarg = null;
    if(input["type"] == "jsonb"){
      if("string" == (typeof arg)){
        dbarg = arg;
      }
      else{
        dbarg = ut.encode_json(arg);
      }
    }
    else{
      dbarg = ut.encode_value(arg);
    }
    out.push(dbarg);
  };
  return out;
}

// xt.db.text.sql-call/call-format-query [42] 
export function call_format_query(spec,args){
  let {id,schema} = spec;
  let dbname = "\"" + schema + "\"." + id.replace(new RegExp("-","g"),"_") + "";
  let dbargs = call_format_input(spec,args).join(", ");
  return "SELECT " + dbname + "(" + dbargs + ");";
}

// xt.db.text.sql-call/call-raw [51] 
export function call_raw(client,spec,args){
  let targs = spec["input"];
  let l_ok_value = check.check_args_length(args,targs);
  let [l_ok,l_err] = l_ok_value;
  if(!l_ok){
    throw "ERR: - " + JSON.stringify(l_err);
  }
  let t_ok_value = check.check_args_type(args,targs);
  let [t_ok,t_err] = t_ok_value;
  if(!t_ok){
    throw "ERR: - " + JSON.stringify(t_err);
  }
  let q = call_format_query(spec,args);
  let success_fn = function (val){
    if("jsonb" == spec["return"]){
      if((null == val) || (val == "")){
        return null;
      }
      else{
        return ("string" == (typeof val)) ? JSON.parse(val) : val;
      }
    }
    else{
      return val;
    }
  };
  let error_fn = function (err){
    throw "ERR: - " + JSON.stringify(err);
  };
  return conn_sql.query_async(client,q).then(success_fn).catch(error_fn);
}

// xt.db.text.sql-call/call-api [84] 
export function call_api(client,spec,args){
  let targs = spec["input"];
  let l_ok_value = check.check_args_length(args,targs);
  let [l_ok,l_err] = l_ok_value;
  if(!l_ok){
    return JSON.stringify({"status":"error","data":l_err});
  }
  let t_ok_value = check.check_args_type(args,targs);
  let [t_ok,t_err] = t_ok_value;
  if(!t_ok){
    return JSON.stringify({"status":"error","data":t_err});
  }
  let q = call_format_query(spec,args);
  let success_fn = function (val){
    return "{\"status\": \"ok\", \"data\":" + (("jsonb" == spec["return"]) ? (("string" == (typeof val)) ? val : JSON.stringify(val)) : JSON.stringify(val)) + "}";
  };
  let error_fn = function (err){
    if(err["status"]){
      return JSON.stringify(err);
    }
    else{
      return JSON.stringify({"status":"error","data":err});
    }
  };
  return conn_sql.query_async(client,q).then(success_fn).catch(error_fn);
}