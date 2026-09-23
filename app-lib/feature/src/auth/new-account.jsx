import {Github} from '@tamagui/lucide-icons'

import * as T from 'tamagui'

import React from 'react'

import * as kd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as hf from '@statstrade/edge/lib/js/lib/react-hook-form.jsx'

import * as ui_router from '@statstrade/component/ui-router.jsx'

import * as r from '@statstrade/edge/lib/js/react.jsx'

import * as sb from '@statstrade/edge/remote/util-supabase.jsx'

import * as ui_section from '@statstrade/component/ui-section.jsx'

import * as common_auth from '@statstrade/group/common-auth-action.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

import * as gs from '@statstrade/edge/global-store.jsx'

import * as ui_form from '@statstrade/component/ui-form.jsx'

import * as gu from '@statstrade/edge/global-ui.jsx'

import * as logo_google from '@statstrade/component/logo/logo-google.jsx'

// statstrade-web.feature.auth.new-account/NewAccountContext [28] 
export var NewAccountContext = React.createContext({});

// statstrade-web.feature.auth.new-account/NewAccountForm [32] 
export function NewAccountForm(){
  let context = React.useContext(NewAccountContext);
  let {api,controls,forms} = context;
  let toast = ui.useToastController();
  let isBusy = api.mutations.sign_up.isPending || api.mutations.sign_in_oauth.isPending;
  return (
    <T.Form
      onSubmit={forms.sign_up.handleSubmit(function (){
          api.mutations.sign_up.mutateAsync(forms.sign_up.getValues()).then(function ({data,error}){
            if(error){
              controls.setCurrentError(error);
              forms.sign_up.reset();
              toast.show(
                ui.t("Create Account Failed"),
                {"message":ui.t("Please try again.")}
              );
            }
            else{
              gs.setStore(["flags","new-account"],true);
              controls.setCurrentStage("verify");
            }
          });
        })}>
      <T.YStack marginTop="$3" gap="$6">
        <ui_form.FormInput
          autoFocus={true}
          title={ui.t("Email")}
          field="email"
          control={forms.sign_up.control}
          placeholder={ui.t("Enter your email")}
          disabled={isBusy}/>
        <ui_form.FormInput
          title={ui.t("Password")}
          field="password"
          control={forms.sign_up.control}
          placeholder={ui.t("Enter your Password")}
          disabled={isBusy}
          secureTextEntry={true}
          autoComplete="password"
          textContentType="password"/>
        <ui_form.FormCheckbox
          title={ui.t("I agree to the terms and conditions")}
          field="agree-terms"
          control={forms.sign_up.control}
          disabled={isBusy}/>
        <T.XStack flexDirection="row-reverse" gap="$4">
          <T.FormTrigger asChild={true} borderWidth={0}>
            <ui.ButtonInverse
              flex={4}
              size="$5"
              icon={isBusy ? (function (){
                  return (
                    <T.Spinner/>);
                }) : null}
              disabled={isBusy || !forms.sign_up.formState.isValid}>{isBusy ? "" : ui.t("Sign Up")}
            </ui.ButtonInverse>
          </T.FormTrigger>
        </T.XStack>
      </T.YStack>
    </T.Form>);
}

// statstrade-web.feature.auth.new-account/NewAccountScreenRegister [98] 
export function NewAccountScreenRegister(){
  let context = React.useContext(NewAccountContext);
  let {api,controls,pathPrefix} = context;
  let authPath = pathPrefix ? (pathPrefix + "/") : "/";
  let isBusy = api.mutations.sign_up.isPending || api.mutations.sign_in_oauth.isPending;
  return (
    <React.Fragment>
      <ui_section.MinHeader
        title={ui.t("Create your Statstrade Account")}
        paragraph={ui.t("Start building in minutes")}/>
      <T.XStack gap="$4" flexWrap="wrap">
        <ui.ButtonInverse
          flex={1}
          tooltip="Continue with Google"
          icon={logo_google.LogoGoogle}
          disabled={isBusy}
          onPress={function (){
              api.mutations.sign_in_oauth.mutateAsync({
                "provider":"google",
                "options":{
                      "redirectTo":process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
                    }
              });
            }}/>
        <ui.ButtonInverse
          flex={1}
          tooltip="Continue with Github"
          icon={Github}
          disabled={isBusy}
          onPress={function (){
              api.mutations.sign_in_oauth.mutateAsync({
                "provider":"github",
                "options":{
                      "redirectTo":process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
                    }
              });
            }}/>
      </T.XStack>
      <ui.HorizontalText
        text={ui.t("OR")}
        marginVertical="$4"
        marginBottom="$2"
        borderColor="$color1"/>
      <T.YStack flex={1} gap="$3">
        <ui_form.FormError error={controls.currentError}/>
        <NewAccountForm/>
      </T.YStack>
      <ui.Horizontal marginVertical="$2" borderColor="$color1"/>
      <T.YStack alignItems="center">
        <ui.ButtonLink href={authPath + "sign-in"}>{ui.t("Already have an account?")}</ui.ButtonLink>
      </T.YStack>
    </React.Fragment>);
}

// statstrade-web.feature.auth.new-account/NewAccountScreenVerify [157] 
export function NewAccountScreenVerify(){
  let router = ui_router.useRouter();
  let [current,setCurrent,{startCountdown,stopCountdown}] = r.useCountdown(30,null,{"interval":1000});
  let context = React.useContext(NewAccountContext);
  let {api,controls,forms,pathPrefix} = context;
  let authPath = pathPrefix ? (pathPrefix + "/") : "/";
  let isBusy = api.mutations.sign_up.isPending || api.mutations.sign_in_oauth.isPending;
  let toast = ui.useToastController();
  sb.useListeners({
    "onSignedIn":function (){
        if(!controls.isVerified){
          controls.setIsVerified(true);
        }
      }
  });
  React.useEffect(function (){
    if(controls.isVerified){
      gs.setStore(["flags","sign-in"],true);
      new Promise(function (resolve){
        setTimeout(resolve,[1000]);
      }).then(function (){
        if(kd.not_emptyp(controls.currentRedirect)){
          router.replace(controls.currentRedirect);
        }
      });
    }
  },[controls.isVerified]);
  return (
    <React.Fragment>
      <ui_section.MinHeader
        title={ui.t("Verify Email")}
        paragraph={ui.t(
            "Check your inbox for instructions to activate your account."
          )}/>
      <ui_section.SectionMinInfo
        logo={(current > 0) ? (
            <T.H1>{current + ""}</T.H1>) : (
            <ui.ButtonInverse
              width={200}
              size="$6"
              disabled={(current != 0) || isBusy}
              icon={isBusy ? (function (){
                  return (
                    <T.Spinner/>);
                }) : null}
              onPress={forms.sign_up.handleSubmit(function (){
                  api.mutations.sign_up.mutateAsync(forms.sign_up.getValues()).then(function ({data,error}){
                    if(data){
                      toast.show(ui.t("Verify Account"),{
                        "duration":2000,
                        "message":ui.t("Check your email at ") + forms.sign_up.getValues("email")
                      });
                      gs.setStore(["flags","new-account"],true);
                      setCurrent(30);
                      startCountdown();
                    }
                  });
                })}>Resend
            </ui.ButtonInverse>)}/>
      <T.YStack alignItems="center">
        <ui.ButtonLink href={authPath + "sign-in"}>{ui.t("Sign In")}</ui.ButtonLink>
      </T.YStack>
    </React.Fragment>);
}

// statstrade-web.feature.auth.new-account/NewAccountScreenMain [228] 
export function NewAccountScreenMain(){
  let context = React.useContext(NewAccountContext);
  let {controls} = context;
  let Component = (null == ({"verify":NewAccountScreenVerify})[[controls.currentStage]]) ? NewAccountScreenRegister : ({"verify":NewAccountScreenVerify})[[controls.currentStage]];
  return (
    <ui_section.MinFrameCenter><Component/></ui_section.MinFrameCenter>);
}

// statstrade-web.feature.auth.new-account/NewAccountScreen [242] 
export function NewAccountScreen(props){
  let ctx = common_auth.useSignUpContext(props);
  let controls = hf.useControls([
    ["currentStage","initial"],
    "currentError",
    [
      "currentRedirect",
      process.env.NEXT_PUBLIC_NEW_ACCOUNT_REDIRECT || "/"
    ],
    ["isVerified",false]
  ]);
  let context = props.context || Object.assign(ctx,{"controls":controls,"pathPrefix":props.pathPrefix});
  gu.usePathContext(["new_account"],context);
  gu.useSyncContext(context);
  return (
    <NewAccountContext.Provider value={context}><NewAccountScreenMain/></NewAccountContext.Provider>);
}