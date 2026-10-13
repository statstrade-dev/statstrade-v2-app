import * as xtd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

// xt.lang.common-protocol/PROTOCOLS [10] 
globalThis["xt_lang_common_protocol$$PROTOCOLS"] = {};

// xt.lang.common-protocol/IMPLEMENTATIONS [12] 
globalThis["xt_lang_common_protocol$$IMPLEMENTATIONS"] = {};

// xt.lang.common-protocol/raw-method [19] 
export function raw_method(on,typename,method){
  return xtd.get_in(
    globalThis["xt_lang_common_protocol$$PROTOCOLS"],
    [on,"impls",typename,method]
  );
}

// xt.lang.common-protocol/protocol-exists [28] 
export function protocol_exists(typename){
  return null != globalThis["xt_lang_common_protocol$$IMPLEMENTATIONS"][typename];
}

// xt.lang.common-protocol/protocol-implements [33] 
export function protocol_implements(obj,protocol){
  let type = obj["::"];
  if(null == type){
    return false;
  }
  let entry = globalThis["xt_lang_common_protocol$$PROTOCOLS"][protocol];
  if(null == entry){
    return false;
  }
  let {impls} = entry;
  return null != impls[type];
}

// xt.lang.common-protocol/protocol-method [46] 
export function protocol_method(obj,on,method){
  let type = obj["::"];
  let override_map = obj["::/override"];
  if(!(null == override_map)){
    let override_fn = override_map[method];
    if(!(null == override_fn)){
      return override_fn;
    }
  }
  let local_impls = obj["::/protocol-impls"];
  let local_impl_map = local_impls && local_impls[on];
  let protocol = globalThis["xt_lang_common_protocol$$PROTOCOLS"][on];
  if((null == protocol) && (null == local_impl_map)){
    throw "Missing protocol entry " + on;
  }
  let protocol_impls = protocol && protocol["impls"];
  let protocol_impl_map = (protocol_impls && protocol_impls[type]) || local_impl_map;
  if(null == protocol_impl_map){
    throw "Missing protocol implementation " + on + " for " + type;
  }
  let method_fn = protocol_impl_map[method];
  if(null == method_fn){
    throw "Missing protocol method " + on + "/" + method + " for " + type;
  }
  return method_fn;
}

// xt.lang.common-protocol/protocol-has-method [79] 
export function protocol_has_method(obj,protocol,method){
  try{
    protocol_method(obj,protocol,method);
    return true;
  }
  catch(err){
    return false;
  }
}

// xt.lang.common-protocol/register-protocol-impl [89] 
export function register_protocol_impl(protocolname,typename,impl_map){
  let protocol = globalThis["xt_lang_common_protocol$$PROTOCOLS"][protocolname];
  if(null == protocol){
    throw "Missing protocol " + protocolname;
  }
  let {impls} = protocol;
  impls[typename] = impl_map;
  return impl_map;
}

// xt.lang.common-protocol/register-protocol [100] 
export function register_protocol(protocol){
  globalThis["xt_lang_common_protocol$$PROTOCOLS"][protocol["on"]] = protocol;
  return protocol;
}

// xt.lang.common-protocol/create-protocol-fn [109] 
export function create_protocol_fn(on,sig_map){
  let protocol = {"::":"type/protocol","on":on,"sigs":sig_map,"impls":{}};
  return register_protocol(protocol);
}