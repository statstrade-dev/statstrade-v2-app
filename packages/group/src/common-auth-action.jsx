import * as hf from '@statstrade/edge/lib/js/lib/react-hook-form.jsx'

import * as page_api from '@statstrade/edge/substrate/page-api.jsx'

import * as api_general from '@statstrade/edge/remote/api-general.jsx'

import * as ks from '@statstrade/edge/lib/xt/lang/common-string.jsx'

// statsui.group.common-auth-action/schemaEmail [17] 
export var schemaEmail = hf.Z.string().min(1,hf.t("Email is required.")).email(hf.t("Email should be valid.")).transform(ks.to_lowercase);

// statsui.group.common-auth-action/schemaPassword [24] 
export var schemaPassword = hf.Z.string().min(1,hf.t("Password is required.")).min(4,{
  "error":function (issue){
    return hf.t("Password requires ",8 - issue.input.length," or more.");
  }
});

// statsui.group.common-auth-action/schemaSignUp [36] 
export var schemaSignUp = hf.Z.object({
  "email":schemaEmail,
  "password":schemaPassword,
  "agree_terms":hf.Z.literal(true)
});

// statsui.group.common-auth-action/schemaSignIn [44] 
export var schemaSignIn = hf.Z.object({"email":schemaEmail,"password":schemaPassword});

// statsui.group.common-auth-action/schemaForgotPassword [50] 
export var schemaForgotPassword = hf.Z.object({"email":schemaEmail});

// statsui.group.common-auth-action/useForgotPasswordContext [60] 
export function useForgotPasswordContext(){
  let api = page_api.useAuthApi({
    "mutations":{"password_reset":{"fn":api_general.password_reset}}
  });
  let forms = {
    "password_reset":hf.useFormState(
        {"defaultValues":{"email":""},"schema":schemaForgotPassword}
      )
  };
  return {api,forms};
}

// statsui.group.common-auth-action/useSignInContext [73] 
export function useSignInContext(){
  let api = page_api.useAuthApi({
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

// statsui.group.common-auth-action/useSignUpContext [89] 
export function useSignUpContext(){
  let api = page_api.useAuthApi({
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