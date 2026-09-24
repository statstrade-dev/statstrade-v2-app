import * as T from 'tamagui'

import React from 'react'

import * as hf from '@statstrade/edge/lib/js/lib/react-hook-form.jsx'

import * as rq from '@statstrade/edge/lib/js/lib/react-query.jsx'

import * as ui_router from '@statstrade/component/ui-router.jsx'

import * as ui_section from '@statstrade/component/ui-section.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

import * as ui_form from '@statstrade/component/ui-form.jsx'

import * as gu from '@statstrade/edge/global-ui.jsx'

// statstrade-web.feature.landing.landing-contact-us/submitContactUs [19] 
export function submitContactUs(data){
  return fetch(
    process.env.NEXT_PUBLIC_CONTACT_US_URL,
    {"method":"POST","body":JSON.stringify(data)}
  );
}

// statstrade-web.feature.landing.landing-contact-us/contactUsDefaults [28] 
export var contactUsDefaults = {
  "defaultValues":{"name":"","email":"","message":""},
  "onSubmit":submitContactUs
};

// statstrade-web.feature.landing.landing-contact-us/schemaContactUs [35] 
export var schemaContactUs = hf.Z.object({
  "name":hf.Z.string().min(1,"Name is required.").min(2,"Name at least 2 characters."),
  "email":hf.Z.string().min(1,"Email is required.").email("Email should be valid."),
  "message":hf.Z.string().min(20,{
    "error":function (issue){
      return (20 - issue.input.length) + " more characters to go";
    }
  })
});

// statstrade-web.feature.landing.landing-contact-us/ContactUsContext [58] 
export var ContactUsContext = React.createContext({});

// statstrade-web.feature.landing.landing-contact-us/ContactUsForm [61] 
export function ContactUsForm(props){
  let context = props.context || React.useContext(ContactUsContext);
  let {api,controls,forms} = context;
  let isBusy = api.mutations.contact_us.isPending;
  return (
    <T.Form
      onSubmit={forms.contact_us.handleSubmit(function (){
          api.mutations.contact_us.mutateAsync(forms.contact_us.getValues()).then(function (res){
            controls.setSubmitted("success");
          }).catch(function (e){
            controls.setSubmitted("failed");
          });
        })}
      space="$4">
      <ui_form.FormInput
        field="name"
        control={forms.contact_us.control}
        title="Name"
        placeholder="Your name"
        disabled={isBusy}/>
      <ui_form.FormInput
        field="email"
        control={forms.contact_us.control}
        title="Email"
        placeholder="Your email"
        disabled={isBusy}/>
      <ui_form.FormInput
        component={T.TextArea}
        field="message"
        control={forms.contact_us.control}
        minHeight="150px"
        title="Message"
        placeholder="What is on your mind?"
        disabled={isBusy}/>
      <T.YStack space="$2">
        <T.FormTrigger asChild={true}>
          <ui.ButtonOutlined
            icon={isBusy ? (function (){
                return (
                  <T.Spinner/>);
              }) : null}
            disabled={isBusy || !forms.contact_us.formState.isValid}>{isBusy ? "" : "Submit"}
          </ui.ButtonOutlined>
        </T.FormTrigger>
      </T.YStack>
    </T.Form>);
}

// statstrade-web.feature.landing.landing-contact-us/ContactUsStatus [111] 
export function ContactUsStatus(){
  let router = ui_router.useRouter();
  let context = React.useContext(ContactUsContext);
  let {controls} = context;
  return (
    <T.YStack
      space="$4"
      flex={1}
      width="100%"
      alignItems="center"
      justifyContent="center">
      <T.Text>
        {(controls.submitted == "success") ? "Your message has been submitted." : "Your message has failed to submit."}
      </T.Text>
      <T.XStack gap="$10" justifyContent="center" alignItems="center">
        <T.Button
          onPress={function (e){
              controls.setSubmitted(false);
            }}
          textDecoration="none">Send Another
        </T.Button>
        <ui.ButtonOutlined
          onPress={function (e){
              try{
                router.back();
              }
              catch(e){
                router.push("/");
              }
            }}>Go Back
        </ui.ButtonOutlined>
      </T.XStack>
    </T.YStack>);
}

// statstrade-web.feature.landing.landing-contact-us/useContactUsContext [146] 
export function useContactUsContext({
  schema = schemaContactUs,
  defaultValues = contactUsDefaults.defaultValues,
  onSubmit = contactUsDefaults.onSubmit
}){
  let api = rq.useApi({"mutations":{"contact_us":{"fn":onSubmit}}});
  let controls = hf.useControls(["submitted","success","error","busy"]);
  let forms = {
    "contact_us":hf.useFormState({"schema":schema,"defaultValues":defaultValues})
  };
  return {"controls":controls,"forms":forms,"api":api};
}

// statstrade-web.feature.landing.landing-contact-us/ContactUsScreen [163] 
export function ContactUsScreen(props){
  let context = useContactUsContext(props);
  gu.usePathContext(["contact_us"],context);
  return (
    <ContactUsContext.Provider value={context}>
      <ui_section.FullScreenCentered maxWidth="600px">
        <T.YStack gap="$5">
          <T.YStack
            space="$3"
            marginBottom="$3"
            paddingBottom="$7"
            borderBottomColor="$borderColor"
            borderBottomWidth={1}>
            <T.H2>Contact Us</T.H2>
            <T.Text>Please get in contact for questions and feedback:</T.Text>
          </T.YStack>
          <T.YStack height="450px">
            {context.controls.submitted ? (
              <ContactUsStatus/>) : (
              <ContactUsForm/>)}
          </T.YStack>
        </T.YStack>
      </ui_section.FullScreenCentered>
    </ContactUsContext.Provider>);
}