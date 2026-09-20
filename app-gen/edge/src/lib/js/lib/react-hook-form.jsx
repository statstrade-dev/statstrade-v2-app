import {Controller,useForm} from 'react-hook-form'

import {z} from 'zod'

import {zodResolver} from '@hookform/resolvers/zod'

import React from 'react'

import * as k from '@statstrade/edge/lib/xt/lang/base-lib'

// js.lib.react-hook-form/useFormBase [13] 
export var useFormBase = useForm;

// js.lib.react-hook-form/FormController [15] 
export var FormController = Controller;

// js.lib.react-hook-form/ZodResolver [17] 
export var ZodResolver = zodResolver;

// js.lib.react-hook-form/Z [19] 
export var Z = z;

// js.lib.react-hook-form/t [21] 
export var t = function (x){
  return x;
};

// js.lib.react-hook-form/useFormState [26] 
export function useFormState({defaultValues,schema,...props}){
  let rprops = k.obj_assign(schema ? {"resolver":ZodResolver(schema)} : {},props);
  return useFormBase({
    "defaultValues":defaultValues,
    "mode":"onChange",
    "reValidateMode":"onChange",
    ...rprops
  });
}

// js.lib.react-hook-form/useFormStateMap [41] 
export function useFormStateMap(m){
  return k.obj_map(m,useFormState);
}

// js.lib.react-hook-form/useControls [46] 
export function useControls(keys = []){
  let arr = React.useMemo(function (){
    return keys.map(function (x){
      return ("string" == (typeof x)) ? [x,null] : x;
    });
  },[keys]);
  let mgetters = React.useMemo(function (){
    return arr.reduce(function (out,[x,init]){
      out[x] = (("function" == (typeof init)) ? init() : init);
      return out;
    },{});
  },[arr]);
  let [state,setState] = React.useState(mgetters);
  let msetters = React.useMemo(function (){
    return arr.reduce(function (out,[x,init]){
      out["set" + k.capitalize(x)] = (function (val){
        setState(function (prev){
          return Object.assign({},prev,{[x]:val});
        });
      });
      return out;
    },{});
  },[arr]);
  return Object.assign({},msetters,state);
}

// js.lib.react-hook-form/mergeContexts [87] 
export function mergeContexts(...contexts){
  return contexts.reduce(function (acc,ctx){
    let next = {
      "api":Object.assign({},acc.api,ctx.api,{
            "mutations":Object.assign({},acc.api && acc.api.mutations,ctx.api && ctx.api.mutations),
            "queries":Object.assign({},acc.api && acc.api.queries,ctx.api && ctx.api.queries)
          }),
      "forms":Object.assign({},acc.forms,ctx.forms),
      "controls":Object.assign({},acc.controls,ctx.controls)
    };
    return Object.assign({},acc,ctx,next);
  },{});
}