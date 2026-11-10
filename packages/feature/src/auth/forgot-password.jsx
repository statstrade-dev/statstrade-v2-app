import React from 'react'

import * as T from 'tamagui'

import * as kd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as ui_controls from '@statstrade/edge/ui-controls.jsx'

import * as r from '@statstrade/edge/lib/js/react.jsx'

import * as client_auth from '@statstrade/edge/remote/util-supabase.jsx'

import * as ui_section from '@statstrade/component/ui-section.jsx'

import * as common_auth from '@statstrade/group/common-auth-action.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

import * as gs from '@statstrade/edge/global-store.jsx'

import * as ui_form from '@statstrade/component/ui-form.jsx'

import * as gu from '@statstrade/edge/global-ui.jsx'

// statstrade-web.feature.auth.forgot-password/ForgotPasswordContext [27] 
export var ForgotPasswordContext = React.createContext({});

// statstrade-web.feature.auth.forgot-password/ForgotPasswordForm [30] 
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
            <span className="st-auth-primary" style={{"display":"contents"}}>
              <ui.ButtonInverse
                className="st-primary-button"
                flex={4}
                icon={isBusy ? (function (){
                    return (
                      <T.Spinner/>);
                  }) : null}
                disabled={isBusy || !forms.password_reset.formState.isValid}>{isBusy ? "" : ui.t("Send Request")}
              </ui.ButtonInverse>
            </span>
          </T.FormTrigger>
          <ui.ButtonOutlined
            className="st-secondary-button"
            flex={1}
            onPress={function (){
                forms.password_reset.reset();
              }}>{ui.t("Clear")}
          </ui.ButtonOutlined>
        </T.XStack>
      </T.YStack>
    </T.Form>);
}

// statstrade-web.feature.auth.forgot-password/ForgotPasswordScreenRequest [91] 
export function ForgotPasswordScreenRequest(){
  let context = React.useContext(ForgotPasswordContext);
  let {pathPrefix} = context;
  return (
    <React.Fragment>
      <ui_section.MinHeader
        paragraphProps={{"className":"st-auth-caption"}}
        title={ui.t("Password Reset")}
        paragraph={ui.t("Send a reset link to your email.")}/>
      <T.YStack flex={1} justifyContent="center"><ForgotPasswordForm/></T.YStack>
      <T.View paddingTop="$2" marginVertical="$3"/>
      <T.YStack alignItems="center">
        <span className="st-auth-link" style={{"display":"contents"}}>
          <ui.ButtonLink href={client_auth.authHref(pathPrefix,"sign-in")}>{ui.t("Back to Sign In")}</ui.ButtonLink>
        </span>
      </T.YStack>
    </React.Fragment>);
}

// statstrade-web.feature.auth.forgot-password/ForgotPasswordScreenSuccess [118] 
export function ForgotPasswordScreenSuccess(){
  let [current,setCurrent,{startCountdown,stopCountdown}] = r.useCountdown(30,null,{"interval":1000});
  let context = React.useContext(ForgotPasswordContext);
  let {api,controls,forms,pathPrefix} = context;
  let toast = ui.useToastController();
  let isBusy = api.mutations.password_reset.isPending;
  let email = kd.get_in(forms.password_reset.formState,["values","email"]) || kd.get_in(forms.password_reset.formState,["defaultValues","email"]);
  return (
    <React.Fragment>
      <ui_section.MinHeader
        paragraphProps={{"className":"st-auth-caption"}}
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
          <span className="st-auth-primary" style={{"display":"contents"}}>
            <ui.ButtonInverse
              className="st-primary-button"
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
            </ui.ButtonInverse>
          </span>)}
        <T.Text>{ui.t("Check your inbox for instructions")}</T.Text>
        <T.YStack alignItems="center">
          <span className="st-auth-link" style={{"display":"contents"}}>
            <ui.ButtonLink
              className="st-auth-link"
              href={client_auth.authHref(pathPrefix,"sign-in")}>{ui.t("Back to Sign In")}
            </ui.ButtonLink>
          </span>
        </T.YStack>
      </T.YStack>
    </React.Fragment>);
}

// statstrade-web.feature.auth.forgot-password/ForgotPasswordScreenMain [196] 
export function ForgotPasswordScreenMain(){
  let context = React.useContext(ForgotPasswordContext);
  let {controls} = context;
  let Component = (null == ({"success":ForgotPasswordScreenSuccess})[[controls.currentStage]]) ? ForgotPasswordScreenRequest : ({"success":ForgotPasswordScreenSuccess})[[controls.currentStage]];
  return (
    <section className="st-auth-panel"><Component/></section>);
}

// statstrade-web.feature.auth.forgot-password/ForgotPasswordScreen [210] 
export function ForgotPasswordScreen(props){
  let context = props.context || Object.assign(common_auth.useForgotPasswordContext(props),{
    "controls":ui_controls.useControls([["currentStage","initial"],"currentError"]),
    "pathPrefix":props.pathPrefix
  });
  gu.usePathContext(["forgot_password"],context);
  return (
    <ForgotPasswordContext.Provider value={context}><ForgotPasswordScreenMain/></ForgotPasswordContext.Provider>);
}