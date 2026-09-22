import {Controller,useForm} from 'react-hook-form'

import {z} from 'zod'

import {zodResolver} from '@hookform/resolvers/zod'

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

// js.lib.react-hook-form/useFormState [25] 
export function useFormState(props){
  let defaultValues = props["defaultValues"];
  let schema = props["schema"];
  let rprops = Object.assign({},schema ? {"resolver":ZodResolver(schema)} : {},props);
  return useFormBase({
    "defaultValues":defaultValues,
    "mode":"onChange",
    "reValidateMode":"onChange",
    ...rprops
  });
}

// js.lib.react-hook-form/useFormStateMap [40] 
export function useFormStateMap(m){
  return m;
}

// js.lib.react-hook-form/useControls [44] 
export function useControls(props){
  return props;
}

// js.lib.react-hook-form/mergeContexts [48] 
export function mergeContexts(...contexts){
  return Object.assign({},...contexts);
}