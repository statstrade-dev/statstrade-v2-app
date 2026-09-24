// xt.lang.common-lib/type-native [16] 
export function type_native(obj){
  if(obj == null){
    return null;
  }
  let t = typeof obj;
  if(t == "object"){
    if(Array.isArray(obj)){
      return "array";
    }
    else{
      let tn = obj["constructor"]["name"];
      if(tn == "Object"){
        return "object";
      }
      else{
        return tn;
      }
    }
  }
  else{
    return t;
  }
}

// xt.lang.common-lib/type-class [24] 
export function type_class(x){
  let ntype = null;
  if(x == null){
    return null;
  }
  let t = typeof x;
  if(t == "object"){
    if(Array.isArray(x)){
      ntype = "array";
    }
    else{
      let tn = x["constructor"]["name"];
      if(tn == "Object"){
        ntype = "object";
      }
      else{
        ntype = tn;
      }
    }
  }
  else{
    ntype = t;
  }
  if((null != x) && ("object" == (typeof x)) && !Array.isArray(x)){
    return (null == x["::"]) ? "object" : x["::"];
  }
  else{
    return ntype;
  }
}

// xt.lang.common-lib/to-string [35] 
export function to_string(x){
  return String(x);
}

// xt.lang.common-lib/to-number [42] 
export function to_number(x){
  return Number(x);
}

// xt.lang.common-lib/nil? [54] 
export function nilp(x){
  return null == x;
}

// xt.lang.common-lib/not-nil? [61] 
export function not_nilp(x){
  return null != x;
}

// xt.lang.common-lib/is-boolean? [68] 
export function is_booleanp(x){
  return "boolean" == (typeof x);
}

// xt.lang.common-lib/is-integer? [76] 
export function is_integerp(x){
  return Number.isInteger(x);
}

// xt.lang.common-lib/is-number? [84] 
export function is_numberp(x){
  return "number" == (typeof x);
}

// xt.lang.common-lib/is-string? [92] 
export function is_stringp(x){
  return "string" == (typeof x);
}

// xt.lang.common-lib/is-function? [100] 
export function is_functionp(x){
  return "function" == (typeof x);
}

// xt.lang.common-lib/is-array? [108] 
export function is_arrayp(x){
  return Array.isArray(x);
}

// xt.lang.common-lib/is-object? [116] 
export function is_objectp(x){
  return (null != x) && ("object" == (typeof x)) && !Array.isArray(x);
}

// xt.lang.common-lib/noop [128] 
export function noop(){
  return null;
}

// xt.lang.common-lib/identity [135] 
export function identity(x){
  return x;
}

// xt.lang.common-lib/T [142] 
export function T(x){
  return true;
}

// xt.lang.common-lib/F [149] 
export function F(x){
  return false;
}

// xt.lang.common-lib/add [160] 
export function add(a,b){
  return a + b;
}

// xt.lang.common-lib/sub [167] 
export function sub(a,b){
  return a - b;
}

// xt.lang.common-lib/mul [174] 
export function mul(a,b){
  return a * b;
}

// xt.lang.common-lib/div [181] 
export function div(a,b){
  return a / b;
}

// xt.lang.common-lib/gt [188] 
export function gt(a,b){
  return a > b;
}

// xt.lang.common-lib/lt [195] 
export function lt(a,b){
  return a < b;
}

// xt.lang.common-lib/gte [202] 
export function gte(a,b){
  return a >= b;
}

// xt.lang.common-lib/lte [209] 
export function lte(a,b){
  return a <= b;
}

// xt.lang.common-lib/eq [216] 
export function eq(a,b){
  return a == b;
}

// xt.lang.common-lib/neq [223] 
export function neq(a,b){
  return a != b;
}

// xt.lang.common-lib/neg [230] 
export function neg(x){
  return -x;
}

// xt.lang.common-lib/inc [237] 
export function inc(x){
  return x + 1;
}

// xt.lang.common-lib/dec [244] 
export function dec(x){
  return x - 1;
}

// xt.lang.common-lib/zero? [251] 
export function zerop(x){
  return x == 0;
}

// xt.lang.common-lib/pos? [258] 
export function posp(x){
  return x > 0;
}

// xt.lang.common-lib/neg? [265] 
export function negp(x){
  return x < 0;
}

// xt.lang.common-lib/even? [272] 
export function evenp(x){
  return 0 == (x % 2);
}

// xt.lang.common-lib/odd? [279] 
export function oddp(x){
  return !(0 == (x % 2));
}

// xt.lang.common-lib/wrap-callback [293] 
export function wrap_callback(callbacks,key){
  if(null == callbacks){
    callbacks = {};
  }
  let result_fn = function (result){
    let f = callbacks[key];
    if(null != f){
      return f.apply(null,[result]);
    }
    else{
      return result;
    }
  };
  return result_fn;
}

// xt.lang.common-lib/return-encode [311] 
export function return_encode(out,id,key){
  let type_fn = function (obj){
    if(obj == null){
      return null;
    }
    let t = typeof obj;
    if(t == "object"){
      if(Array.isArray(obj)){
        return "array";
      }
      else{
        let tn = obj["constructor"]["name"];
        if(tn == "Object"){
          return "object";
        }
        else{
          return tn;
        }
      }
    }
    else{
      return t;
    }
  };
  let ts = type_fn(out);
  if("function" == ts){
    return JSON.stringify({
      "id":id,
      "key":key,
      "type":"raw",
      "return":"function",
      "value":out.toString()
    });
  }
  else if("object" != ts){
    return JSON.stringify({"id":id,"key":key,"type":"data","return":ts,"value":out});
  }
  else if(null == out){
    return JSON.stringify(
      {"id":id,"key":key,"type":"data","return":"nil","value":out}
    );
  }
  else{
    try{
      return JSON.stringify({"id":id,"key":key,"type":"data","return":ts,"value":out});
    }
    catch(e){
      return JSON.stringify({
        "id":id,
        "key":key,
        "type":"raw",
        "return":ts,
        "value":out.toString()
      });
    }
  }
}

// xt.lang.common-lib/return-wrap [318] 
export function return_wrap(f){
  try{
    let out = f();
    return return_encode(out);
  }
  catch(e){
    let err = ("string" == (typeof e)) ? e : {"message":e["message"],"stack":e["stack"]};
    return JSON.stringify({"type":"error","value":err})
  }
}

// xt.lang.common-lib/return-eval [325] 
export function return_eval(s){
  return return_wrap(function (){
    return eval(s);
  });
}