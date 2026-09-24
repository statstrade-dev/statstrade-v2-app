import * as T from 'tamagui'

import React from 'react'

import * as ui_section from '@statstrade/component/ui-section'

import * as hf from '@statstrade/edge/lib/js/lib/react-hook-form'

import * as gu from '@statstrade/edge/global-ui'

import * as ui_form from '@statstrade/component/ui-form'

import * as ui from '@statstrade/component/ui-common'

import * as ui_router from '@statstrade/component/ui-router'

// statstrade-web.feature.contact-us/contactPageSubmit [18] 
export function contactPageSubmit({form,setSubmitted}){
  return fetch(
    process.env.NEXT_PUBLIC_CONTACT_US_URL,
    {"method":"POST","body":JSON.stringify(form.getValues())}
  ).then(function (e){
    setSubmitted("success");
  }).catch(function (e){
    console.log(e);
    setSubmitted("failed");
  });
}

// statstrade-web.feature.contact-us/contactUsDefaults [34] 
export var contactUsDefaults = {
  "defaultValues":{"name":"","email":"","message":""},
  "onSubmit":contactPageSubmit
};

// statstrade-web.feature.contact-us/schemaContactUs [41] 
export var schemaContactUs = hf.Z.object({
  "name":hf.Z.string().min(1,"Name is required.").min(2,"Name at least 2 characters."),
  "email":hf.Z.string().min(1,"Email is required.").email("Email should be valid."),
  "message":hf.Z.string().min(20,{
    "error":function (issue){
      return (20 - issue.input.length) + " more characters to go";
    }
  })
});

// statstrade-web.feature.contact-us/ContactUsContext [64] 
export var ContactUsContext = React.createContext({});

// statstrade-web.feature.contact-us/ContactUsForm [67] 
export function ContactUsForm(props){
  let context = props.context || React.useContext(ContactUsContext);
  let {controls,form,onSubmit} = context;
  console.log(context);
  return (
    <T.Form
      onSubmit={form.handleSubmit(function (){
          controls.setBusy(true);
          new Promise(function (resolve,reject){
            try{
              resolve(            (function (){
                            return onSubmit(context);
                          })());
            }
            catch(e){
              reject(e);
            }
          }).finally(function (){
            controls.setBusy(false);
          });
        })}
      space="$4">
      <ui_form.FormInput
        field="name"
        control={form.control}
        title="Name"
        placeholder="Your name"
        disabled={controls.busy}/>
      <ui_form.FormInput
        field="email"
        control={form.control}
        title="Email"
        placeholder="Your email"
        disabled={controls.busy}/>
      <ui_form.FormInput
        component={T.TextArea}
        field="message"
        control={form.control}
        minHeight="150px"
        title="Message"
        placeholder="What is on your mind?"
        disabled={controls.busy}/>
      <T.YStack space="$2">
        <T.FormTrigger asChild={true}>
          <ui.ButtonOutlined
            icon={controls.busy ? (function (){
                return (
                  <T.Spinner/>);
              }) : null}
            disabled={controls.busy || !form.formState.isValid}>{controls.busy ? "Submitting" : "Submit"}
          </ui.ButtonOutlined>
        </T.FormTrigger>
      </T.YStack>
    </T.Form>);
}

// statstrade-web.feature.contact-us/ContactUsStatus [118] 
export function ContactUsStatus(){
  let router = ui_router.useRouter();
  let {submitted,setSubmitted} = React.useContext(ContactUsContext);
  return (
    <T.YStack
      space="$4"
      flex={1}
      width="100%"
      alignItems="center"
      justifyContent="center">
      <T.Text>
        {(submitted == "success") ? "Your message has been submitted." : "Your message has failed to submit."}
      </T.Text>
      <T.XStack gap="$10" justifyContent="center" alignItems="center">
        <T.Button
          onPress={function (e){
              setSubmitted(false);
            }}
          textDecoration="none">{"Send Another"}
        </T.Button>
        <ui.ButtonOutlined
          onPress={function (e){
              try{
                router.back();
              }
              catch(e){
                router.push("/");
              }
            }}>{"Go Back"}
        </ui.ButtonOutlined>
      </T.XStack>
    </T.YStack>);
}

// statstrade-web.feature.contact-us/useContactUsContext [152] 
export function useContactUsContext({
  schema = schemaContactUs,
  defaultValues = contactUsDefaults.defaultValues,
  onSubmit = contactUsDefaults.onSubmit
}){
  let controls = hf.useControls(["submitted","success","error","busy"]);
  let form = hf.useFormState({"schema":schema,"defaultValues":defaultValues});
  return {controls,form,onSubmit};
}

// statstrade-web.feature.contact-us/ContactUsScreen [168] 
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
            <T.H2>{"Contact Us"}</T.H2>
            <T.Text>{"Please get in contact for questions and feedback:"}</T.Text>
          </T.YStack>
          <T.YStack height="450px">
            {context.submitted ? (
              <ContactUsStatus/>) : (
              <ContactUsForm/>)}
          </T.YStack>
        </T.YStack>
      </ui_section.FullScreenCentered>
    </ContactUsContext.Provider>);
}