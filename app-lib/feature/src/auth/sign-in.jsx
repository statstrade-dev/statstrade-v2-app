import {Github} from '@tamagui/lucide-icons'

import * as T from 'tamagui'

import React from 'react'

import * as kd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as hf from '@statstrade/edge/lib/js/lib/react-hook-form.jsx'

import * as ui_router from '@statstrade/component/ui-router.jsx'

import * as ui_section from '@statstrade/component/ui-section.jsx'

import * as common_auth from '@statstrade/group/common-auth-action.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

import * as gs from '@statstrade/edge/global-store.jsx'

import * as ui_form from '@statstrade/component/ui-form.jsx'

import * as gu from '@statstrade/edge/global-ui.jsx'

import * as logo_google from '@statstrade/component/logo/logo-google.jsx'

// statstrade-web.feature.auth.sign-in/SignInContext [28] 
export var SignInContext = React.createContext({});

// statstrade-web.feature.auth.sign-in/SignInForm [31] 
export function SignInForm(){
  let context = React.useContext(SignInContext);
  let {api,controls,forms} = context;
  let toast = ui.useToastController();
  let isBusy = api.mutations.sign_in.isPending || api.mutations.sign_in_oauth.isPending;
  return (
    <T.Form
      onSubmit={forms.sign_in.handleSubmit(function (){
          api.mutations.sign_in.mutateAsync(forms.sign_in.getValues()).then(function ({data,error}){
            if(error){
              controls.setCurrentError(error);
              forms.sign_in.reset();
              toast.show(ui.t("Login Failed"),{"message":ui.t("Please try again.")});
            }
            else{
              gs.setStore(["flags","sign-in"],true);
              controls.setCurrentStage("success");
            }
          });
        })}>
      <T.YStack marginTop="$3" gap="$6">
        <ui_form.FormInput
          autoFocus={true}
          title="Email"
          field="email"
          control={forms.sign_in.control}
          placeholder="Enter your email"
          disabled={isBusy}/>
        <ui_form.FormInput
          title="Password"
          field="password"
          control={forms.sign_in.control}
          placeholder="Enter your password"
          disabled={isBusy}
          secureTextEntry={true}
          autoComplete="password"
          textContentType="password"/>
        <T.XStack flexDirection="row-reverse" gap="$4">
          <T.FormTrigger asChild={true} borderWidth={0}>
            <ui.ButtonInverse
              flex={4}
              size="$5"
              icon={isBusy ? (function (){
                  return (
                    <T.Spinner/>);
                }) : null}
              disabled={isBusy || !forms.sign_in.formState.isValid}>{isBusy ? "" : ui.t("Sign In")}
            </ui.ButtonInverse>
          </T.FormTrigger>
          <ui.ButtonOutlined
            flex={1}
            size="$5"
            borderWidth={0}
            onPress={function (){
                controls.setCurrentError(null);
                forms.sign_in.reset();
              }}>{ui.t("Clear")}
          </ui.ButtonOutlined>
        </T.XStack>
      </T.YStack>
    </T.Form>);
}

// statstrade-web.feature.auth.sign-in/SignInScreenLogin [101] 
export function SignInScreenLogin(){
  let context = React.useContext(SignInContext);
  let {api,controls,forms} = context;
  let isBusy = api.mutations.sign_in.isPending || api.mutations.sign_in_oauth.isPending;
  return (
    <React.Fragment>
      <ui_section.MinHeader
        title={ui.t("Sign in to Statstrade")}
        paragraph={ui.t("Welcome. Please enter your details.")}/>
      <T.XStack gap="$4" flexWrap="wrap">
        <ui.ButtonOutlined
          flex={1}
          tooltip="Google Sign In"
          icon={logo_google.LogoGoogle}
          disabled={isBusy}
          onPress={function (){
              api.mutations.sign_in_oauth.mutateAsync({"provider":"google"});
            }}/>
        <ui.ButtonOutlined
          flex={1}
          tooltip="Github Sign In"
          icon={Github}
          disabled={isBusy}
          onPress={function (){
              api.mutations.sign_in_oauth.mutateAsync({"provider":"github"});
            }}/>
      </T.XStack>
      <ui.HorizontalText
        text={ui.t("OR")}
        marginVertical="$4"
        marginBottom="$2"
        borderColor="$color1"/>
      <T.YStack flex={1} gap="$3">
        <ui_form.FormError error={controls.currentError}/>
        <SignInForm/>
        <ui.Horizontal marginVertical="$2" borderColor="$color1"/>
        <T.XStack gap="$3">
          <ui.ButtonLink href="/forgot-password">{ui.t("Forgot Password")}</ui.ButtonLink>
          <T.View flex={1}/>
          <ui.ButtonLink href="/new-account">{ui.t("New Account")}</ui.ButtonLink>
        </T.XStack>
      </T.YStack>
    </React.Fragment>);
}

// statstrade-web.feature.auth.sign-in/SignInScreenSuccess [162] 
export function SignInScreenSuccess(){
  let router = ui_router.useRouter();
  let context = React.useContext(SignInContext);
  let {controls,forms} = context;
  React.useEffect(function (){
    new Promise(function (resolve){
      setTimeout(resolve,500);
    }).then(function (){
      if(kd.not_emptyp(controls.currentRedirect)){
        router.replace(controls.currentRedirect);
      }
    });
  },[]);
  return (
    <React.Fragment>
      <ui_section.MinHeader
        title={ui.t("Sign in Success")}
        paragraph={ui.t("Redirecting to Dashboard.")}/>
      <ui_section.SectionMinInfo
        logo={(
            <T.View><T.Spinner size="large" color="$accent9"/></T.View>)}
        left={(
            <ui.ButtonLink href="/">{ui.t("Go Home")}</ui.ButtonLink>)}
        right={(
            <ui.ButtonLink href="/account">{ui.t("Go to Account")}</ui.ButtonLink>)}/>
    </React.Fragment>);
}

// statstrade-web.feature.auth.sign-in/SignInScreenMain [194] 
export function SignInScreenMain(){
  let context = React.useContext(SignInContext);
  let {controls} = context;
  let Component = (null == ({"success":SignInScreenSuccess})[[controls.currentStage]]) ? SignInScreenLogin : ({"success":SignInScreenSuccess})[[controls.currentStage]];
  return (
    <ui_section.MinFrameCenter><Component/></ui_section.MinFrameCenter>);
}

// statstrade-web.feature.auth.sign-in/SignInScreen [207] 
export function SignInScreen(props){
  let ctx = common_auth.useSignInContext(props);
  let controls = hf.useControls([
    ["currentStage","initial"],
    "currentError",
    [
      "currentRedirect",
      process.env.NEXT_PUBLIC_SIGN_IN_REDIRECT || "/"
    ],
    ["isVerified",false]
  ]);
  let context = props.context || Object.assign(ctx,{"controls":controls});
  gu.usePathContext(["sign_in"],context);
  return (
    <SignInContext.Provider value={context}><SignInScreenMain/></SignInContext.Provider>);
}