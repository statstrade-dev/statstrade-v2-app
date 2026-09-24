import * as T from 'tamagui'

import React from 'react'

import * as kd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as hf from '@statstrade/edge/lib/js/lib/react-hook-form.jsx'

import * as r from '@statstrade/edge/lib/js/react.jsx'

import * as ui_section from '@statstrade/component/ui-section.jsx'

import * as common_auth from '@statstrade/group/common-auth-action.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

import * as gs from '@statstrade/edge/global-store.jsx'

import * as ui_form from '@statstrade/component/ui-form.jsx'

import * as gu from '@statstrade/edge/global-ui.jsx'

// statstrade-web.feature.auth.forgot-password/ForgotPasswordContext [25] 
export var ForgotPasswordContext = React.createContext({});

// statstrade-web.feature.auth.forgot-password/ForgotPasswordForm [28] 
export function ForgotPasswordForm(){
  let context = React.useContext(ForgotPasswordContext);
  let {api,controls,forms} = context;
  let isBusy = api.mutations.password_reset.isPending;
  let toast = ui.useToastController();
  return (
    <T.Form
      onSubmit={forms.password_reset.handleSubmit(function (){
          api.mutations.password_reset.mutateAsync(forms.password_reset.getValues()).then(function ({data,error}){
            if(error){
              controls.setCurrentError(error);
              forms.password_reset.reset();
              toast.show(
                ui.t("Send Request Failed"),
                {"message":ui.t("Please try again.")}
              );
            }
            else{
              toast.show(
                ui.t("Password Reset"),
                {"message":ui.t("Request successfully sent.")}
              );
              gs.setStore(["flags","forgot-password"],true);
              controls.setCurrentStage("success");
            }
          });
        })}>
      <T.YStack gap="$4">
        <ui_form.FormInput
          title={ui.t("Email")}
          field="email"
          control={forms.password_reset.control}
          placeholder={ui.t("Enter your email")}
          disabled={isBusy}
          hideTitle={true}/>
        <T.XStack flexDirection="row-reverse" gap="$4">
          <T.FormTrigger asChild={true} borderWidth={0}>
            <ui.ButtonInverse
              flex={4}
              icon={isBusy ? (function (){
                  return (
                    <T.Spinner/>);
                }) : null}
              disabled={isBusy || !forms.password_reset.formState.isValid}>{isBusy ? "" : ui.t("Send Request")}
            </ui.ButtonInverse>
          </T.FormTrigger>
          <ui.ButtonOutlined
            flex={1}
            onPress={function (){
                forms.password_reset.reset();
              }}>{ui.t("Clear")}
          </ui.ButtonOutlined>
        </T.XStack>
      </T.YStack>
    </T.Form>);
}

// statstrade-web.feature.auth.forgot-password/ForgotPasswordScreenRequest [86] 
export function ForgotPasswordScreenRequest(){
  return (
    <React.Fragment>
      <ui_section.MinHeader
        title={ui.t("Password Reset")}
        paragraph={ui.t("Send a reset link to your email.")}/>
      <T.YStack flex={1} justifyContent="center"><ForgotPasswordForm/></T.YStack>
      <T.View paddingTop="$2" marginVertical="$3"/>
      <T.YStack alignItems="center">
        <ui.ButtonLink href="/sign-in">{ui.t("Back to Sign In")}</ui.ButtonLink>
      </T.YStack>
    </React.Fragment>);
}

// statstrade-web.feature.auth.forgot-password/ForgotPasswordScreenSuccess [109] 
export function ForgotPasswordScreenSuccess(){
  let [current,setCurrent,{startCountdown,stopCountdown}] = r.useCountdown(30,null,{"interval":1000});
  let context = React.useContext(ForgotPasswordContext);
  let {api,controls,forms} = context;
  let toast = ui.useToastController();
  let isBusy = api.mutations.password_reset.isPending;
  let email = kd.get_in(forms.password_reset.formState,["values","email"]) || kd.get_in(forms.password_reset.formState,["defaultValues","email"]);
  return (
    <React.Fragment>
      <ui_section.MinHeader
        title={ui.t("Reset Successful")}
        paragraph={ui.t("A link has been sent to your email at") + " " + email}/>
      <T.YStack
        flex={1}
        width="100%"
        justifyContent="center"
        alignItems="center"
        gap="$6">
        {(current > 0) ? (
          <T.H1>{current + ""}</T.H1>) : (
          <ui.ButtonInverse
            width={200}
            size="$6"
            disabled={(current != 0) || isBusy}
            icon={isBusy ? (function (){
                return (
                  <T.Spinner/>);
              }) : null}
            onPress={forms.password_reset.handleSubmit(function (){
                api.mutations.password_reset.mutateAsync(forms.password_reset.getValues()).then(function ({data,error}){
                  if(error){
                    controls.setCurrentError(error);
                    forms.password_reset.reset();
                    toast.show(
                      ui.t("Send Request Failed"),
                      {"message":ui.t("Please try again.")}
                    );
                  }
                  else{
                    toast.show(
                      ui.t("Password Reset"),
                      {"message":ui.t("Request successfully sent.")}
                    );
                    gs.setStore(["flags","forgot-password"],true);
                    setCurrent(30);
                  }
                });
              })}>Resend
          </ui.ButtonInverse>)}
        <T.Text>{ui.t("Check your inbox for instructions")}</T.Text>
        <T.YStack alignItems="center">
          <ui.ButtonLink href="/sign-in">{ui.t("Back to Sign In")}</ui.ButtonLink>
        </T.YStack>
      </T.YStack>
    </React.Fragment>);
}

// statstrade-web.feature.auth.forgot-password/ForgotPasswordScreenMain [181] 
export function ForgotPasswordScreenMain(){
  let context = React.useContext(ForgotPasswordContext);
  let {controls} = context;
  let Component = (null == ({"success":ForgotPasswordScreenSuccess})[[controls.currentStage]]) ? ForgotPasswordScreenRequest : ({"success":ForgotPasswordScreenSuccess})[[controls.currentStage]];
  return (
    <ui_section.MinFrameCenter><Component/></ui_section.MinFrameCenter>);
}

// statstrade-web.feature.auth.forgot-password/ForgotPasswordScreen [195] 
export function ForgotPasswordScreen(props){
  let context = props.context || Object.assign(common_auth.useForgotPasswordContext(props),{
    "controls":hf.useControls([["currentStage","initial"],"currentError"])
  });
  gu.usePathContext(["forgot_password"],context);
  return (
    <ForgotPasswordContext.Provider value={context}><ForgotPasswordScreenMain/></ForgotPasswordContext.Provider>);
}