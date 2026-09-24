// xt.lang.common-math/mod-pos [137] 
export function mod_pos(val,modulo){
  let out = val % modulo;
  return (out < 0) ? (out + modulo) : out;
}

// xt.lang.common-math/mod-offset [150] 
export function mod_offset(pval,nval,modulo){
  let offset = (nval - pval) % modulo;
  if(Math.abs(offset) > (modulo / 2)){
    if(offset > 0){
      return offset - modulo;
    }
    else{
      return offset + modulo;
    }
  }
  else{
    return offset;
  }
}

// xt.lang.common-math/gcd [167] 
export function gcd(a,b){
  return (0 == b) ? a : gcd(b,a % b);
}

// xt.lang.common-math/lcm [178] 
export function lcm(a,b){
  return (a * b) / gcd(a,b);
}

// xt.lang.common-math/mix [188] 
export function mix(x0,x1,v){
  return x0 + ((x1 - x0) * v);
}

// xt.lang.common-math/sign [198] 
export function sign(x){
  if(x == 0){
    return 0;
  }
  else if(x < 0){
    return -1;
  }
  else{
    return 1;
  }
}

// xt.lang.common-math/round [209] 
export function round(x){
  return Math.floor(x + 0.5);
}

// xt.lang.common-math/clamp [218] 
export function clamp(min,max,v){
  if(v < min){
    return min;
  }
  else if(max < v){
    return max;
  }
  else{
    return v;
  }
}