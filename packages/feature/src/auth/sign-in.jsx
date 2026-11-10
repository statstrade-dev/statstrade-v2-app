import React from 'react'

import * as T from 'tamagui'

import {Github} from '@tamagui/lucide-icons'

import * as kd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as ui_controls from '@statstrade/edge/ui-controls.jsx'

import * as ui_router from '@statstrade/component/ui-router.jsx'

import * as client_auth from '@statstrade/edge/remote/util-supabase.jsx'

import * as ui_section from '@statstrade/component/ui-section.jsx'

import * as common_auth from '@statstrade/group/common-auth-action.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

import * as gs from '@statstrade/edge/global-store.jsx'

import * as ui_form from '@statstrade/component/ui-form.jsx'

import * as gu from '@statstrade/edge/global-ui.jsx'

import * as logo_google from '@statstrade/component/logo/logo-google.jsx'

// statstrade-web.feature.auth.sign-in/SignInContext [30] 
export var SignInContext = React.createContext({});

// statstrade-web.feature.auth.sign-in/SignInForm [33] 
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
            <span className="st-auth-primary" style={{"display":"contents"}}>
              <ui.ButtonInverse
                className="st-primary-button"
                flex={4}
                size="$5"
                icon={isBusy ? (function (){
                    return (
                      <T.Spinner/>);
                  }) : null}
                disabled={isBusy || !forms.sign_in.formState.isValid}>{isBusy ? "" : ui.t("Sign In")}
              </ui.ButtonInverse>
            </span>
          </T.FormTrigger>
          <ui.ButtonOutlined
            className="st-secondary-button"
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

// statstrade-web.feature.auth.sign-in/SignInScreenLogin [106] 
export function SignInScreenLogin(){
  let context = React.useContext(SignInContext);
  let {api,controls,forms,pathPrefix} = context;
  let isBusy = api.mutations.sign_in.isPending || api.mutations.sign_in_oauth.isPending;
  return (
    <React.Fragment>
      <ui_section.MinHeader
        paragraphProps={{"className":"st-auth-caption"}}
        title={ui.t("Sign in to Statstrade")}
        paragraph={ui.t("Welcome. Please enter your details.")}/>
      <T.XStack gap="$4" flexWrap="wrap">
        <ui.ButtonOutlined
          flex={1}
          className="st-secondary-button"
          aria-label="Continue with Google"
          tooltip="Google Sign In"
          icon={logo_google.LogoGoogle}
          disabled={isBusy}
          onPress={function (){
              api.mutations.sign_in_oauth.mutateAsync({
                "provider":"google",
                "options":{
                      "redirectTo":client_auth.authRedirectTo(process.env.NEXT_PUBLIC_SITE_URL,window.location.origin)
                    }
              });
            }}>Continue with Google
        </ui.ButtonOutlined>
        <ui.ButtonOutlined
          flex={1}
          className="st-secondary-button"
          aria-label="Continue with GitHub"
          tooltip="Github Sign In"
          icon={Github}
          disabled={isBusy}
          onPress={function (){
              api.mutations.sign_in_oauth.mutateAsync({
                "provider":"github",
                "options":{
                      "redirectTo":client_auth.authRedirectTo(process.env.NEXT_PUBLIC_SITE_URL,window.location.origin)
                    }
              });
            }}>Continue with GitHub
        </ui.ButtonOutlined>
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
          <span className="st-auth-link" style={{"display":"contents"}}>
            <ui.ButtonLink
              className="st-auth-link"
              href={client_auth.authHref(pathPrefix,"forgot-password")}>{ui.t("Forgot Password")}
            </ui.ButtonLink>
          </span>
          <T.View flex={1}/>
          <span className="st-auth-link" style={{"display":"contents"}}>
            <ui.ButtonLink
              className="st-auth-link"
              href={client_auth.authHref(pathPrefix,"new-account")}>{ui.t("New Account")}
            </ui.ButtonLink>
          </span>
        </T.XStack>
      </T.YStack>
    </React.Fragment>);
}

// statstrade-web.feature.auth.sign-in/SignInScreenSuccess [183] 
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
        paragraphProps={{"className":"st-auth-caption"}}
        title={ui.t("Sign in Success")}
        paragraph={ui.t("Opening your account.")}/>
      <ui_section.SectionMinInfo
        logo={(
            <T.View><T.Spinner size="large" color="$accent9"/></T.View>)}
        left={(
            <span className="st-auth-link" style={{"display":"contents"}}><ui.ButtonLink href="/">{ui.t("Go Home")}</ui.ButtonLink></span>)}
        right={(
            <span className="st-auth-link" style={{"display":"contents"}}>
              <ui.ButtonLink href="/account">{ui.t("Go to Account")}</ui.ButtonLink>
            </span>)}/>
    </React.Fragment>);
}

// statstrade-web.feature.auth.sign-in/SignInScreenMain [218] 
export function SignInScreenMain(){
  let context = React.useContext(SignInContext);
  let {controls} = context;
  let Component = (null == ({"success":SignInScreenSuccess})[[controls.currentStage]]) ? SignInScreenLogin : ({"success":SignInScreenSuccess})[[controls.currentStage]];
  return (
    <section className="st-auth-panel"><Component/></section>);
}

// statstrade-web.feature.auth.sign-in/SignInScreen [231] 
export function SignInScreen(props){
  let ctx = common_auth.useSignInContext(props);
  let controls = ui_controls.useControls([
    ["currentStage","initial"],
    "currentError",
    [
      "currentRedirect",
      props.redirectTo || process.env.NEXT_PUBLIC_SIGN_IN_REDIRECT || "/"
    ],
    ["isVerified",false]
  ]);
  let context = props.context || Object.assign(ctx,{"controls":controls,"pathPrefix":props.pathPrefix});
  gu.usePathContext(["sign_in"],context);
  return (
    <SignInContext.Provider value={context}><SignInScreenMain/></SignInContext.Provider>);
}