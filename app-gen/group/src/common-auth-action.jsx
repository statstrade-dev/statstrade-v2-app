import * as hf from '@statstrade/edge/lib/js/lib/react-hook-form.jsx'

import * as rq from '@statstrade/edge/lib/js/lib/react-query.jsx'

import * as api_public from '@statstrade/edge/remote/api-public.jsx'

import * as api_general from '@statstrade/edge/remote/api-general.jsx'

import * as ks from '@statstrade/edge/lib/xt/lang/common-string.jsx'

// statsui.group.common-auth-action/schemaEmail [16] 
export var schemaEmail = hf.Z.string().min(1,hf.t("Email is required.")).email(hf.t("Email should be valid.")).transform(ks.to_lowercase);

// statsui.group.common-auth-action/schemaPassword [23] 
export var schemaPassword = hf.Z.string().min(1,hf.t("Password is required.")).min(4,{
  "error":function (issue){
    return hf.t("Password requires ",8 - issue.input.length," or more.");
  }
});

// statsui.group.common-auth-action/schemaSignUp [35] 
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

// statsui.group.common-auth-action/schemaSignIn [50] 
export var schemaSignIn = hf.Z.object({"email":schemaEmail,"password":schemaPassword});

// statsui.group.common-auth-action/schemaForgotPassword [56] 
export var schemaForgotPassword = hf.Z.object({"email":schemaEmail});

// statsui.group.common-auth-action/useForgotPasswordContext [66] 
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

// statsui.group.common-auth-action/useSignInContext [78] 
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

// statsui.group.common-auth-action/useSignUpContext [92] 
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