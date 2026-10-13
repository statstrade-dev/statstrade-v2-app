// xt.db.text.base-check/is-uuid? [7] 
export function is_uuidp(s){
  if(!("string" == (typeof s))){
    return false;
  }
  if(!(36 == s.length)){
    return false;
  }
  let parts = s.split("-");
  return (5 == parts.length) && (8 == parts[0].length) && (4 == parts[1].length) && (4 == parts[2].length) && (4 == parts[3].length) && (12 == parts[4].length);
}

// xt.db.text.base-check/check-arg-type [26] 
export function check_arg_type(arg_type,arg){
  if(arg_type == "any"){
    return true;
  }
  else if((arg_type == "citext") || (arg_type == "inet") || (arg_type == "text")){
    return "string" == (typeof arg);
  }
  else if(arg_type == "uuid"){
    return is_uuidp(arg);
  }
  else if(arg_type == "boolean"){
    return "boolean" == (typeof arg);
  }
  else if((arg_type == "integer") || (arg_type == "int") || (arg_type == "long") || (arg_type == "bigint") || (arg_type == "float")){
    return "number" == (typeof arg);
  }
  else if(arg_type == "numeric"){
    return ("number" == (typeof arg)) || ("string" == (typeof arg));
  }
  else if(arg_type == "jsonb"){
    return ((null != arg) && ("object" == (typeof arg)) && !Array.isArray(arg)) || Array.isArray(arg);
  }
  else{
    return false;
  }
}

// xt.db.text.base-check/check-args-type [62] 
export function check_args_type(args,targs){
  let i = 0;
  for(let spec of targs){
    let arg = args[i];
    if(!check_arg_type(spec["type"],arg)){
      return [
        false,
        {
              "status":"error",
              "tag":"net/arg-typecheck-failed",
              "data":{"input":arg,"spec":spec}
            }
      ];
    }
    i = (i + 1);
  };
  return [true,null];
}

// xt.db.text.base-check/check-args-length [81] 
export function check_args_length(args,targs){
  if(args.length != targs.length){
    return [
      false,
      {
          "status":"error",
          "tag":"net/args-not-same-length",
          "data":{"expected":targs.length,"actual":args.length,"input":args}
        }
    ];
  }
  return [true,null];
}