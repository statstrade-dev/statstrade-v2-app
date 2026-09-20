import * as hf from '@statstrade/edge/lib/js/lib/react-hook-form'

import * as rq from '@statstrade/edge/lib/js/lib/react-query'

import * as api_general from '@statstrade/edge/remote/api-general'

import * as api_public from '@statstrade/edge/remote/api-public'

// sznui.lib.edge.remote.group.common-auth-action/schemaEmail [12] 
export var schemaEmail = hf.Z.string().min(1,hf.t("Email is required.")).email(hf.t("Email should be valid.")).transform(function (s){
  return s.toLowerCase();
});

// sznui.lib.edge.remote.group.common-auth-action/schemaPassword [19] 
export var schemaPassword = hf.Z.string().min(1,hf.t("Password is required.")).min(4,{
  "error":function (issue){
    return hf.t("Password requires ",8 - issue.input.length," or more.");
  }
});

// sznui.lib.edge.remote.group.common-auth-action/schemaSignUp [31] 
export var schemaSignUp = hf.Z.object({
  "email":schemaEmail.pipe(hf.Z.refine(function (email){
    if(email == ""){
      return true;
    }
    return api_public.check_email_exists({email});
  },hf.t("Email already exists."))),
  "password":schemaPassword,
  "agree_terms":hf.Z.literal(true)
});

// sznui.lib.edge.remote.group.common-auth-action/schemaSignIn [46] 
export var schemaSignIn = hf.Z.object({"email":schemaEmail,"password":schemaPassword});

// sznui.lib.edge.remote.group.common-auth-action/schemaForgotPassword [52] 
export var schemaForgotPassword = hf.Z.object({"email":schemaEmail});

// sznui.lib.edge.remote.group.common-auth-action/useForgotPasswordContext [62] 
export function useForgotPasswordContext(){
  let api = rq.useApi({
    "mutations":{"password_reset":{"fn":api_general.password_reset}}
  });
  let forms = {
    "password_reset":hf.useFormState(
        {"defaultValues":{"email":""},"schema":schemaForgotPassword}
      )
  };
  return {api,forms};
}

// sznui.lib.edge.remote.group.common-auth-action/useSignInContext [74] 
export function useSignInContext(){
  let api = rq.useApi({
    "mutations":{
        "sign_in":{"fn":api_general.sign_in},
        "sign_in_oauth":{"fn":api_general.sign_in_oauth}
      }
  });
  let forms = {
    "sign_in":hf.useFormState({
        "defaultValues":{"email":"","password":""},
        "reValidateMode":"onSubmit",
        "schema":schemaSignIn
      })
  };
  return {api,forms};
}

// sznui.lib.edge.remote.group.common-auth-action/useSignUpContext [88] 
export function useSignUpContext(){
  let api = rq.useApi({
    "mutations":{
        "sign_up":{"fn":api_general.sign_up},
        "sign_in_oauth":{"fn":api_general.sign_in_oauth}
      }
  });
  let forms = {
    "sign_up":hf.useFormState({
        "defaultValues":{"email":"","password":"","agree_terms":false},
        "schema":schemaSignUp
      })
  };
  return {api,forms};
}