import * as T from 'tamagui'

import React from 'react'

import * as hf from '@statstrade/edge/lib/js/lib/react-hook-form.jsx'

import * as contact_us from '@statstrade/feature/landing/landing-contact-us.jsx'

// statstrade-web.feature.landing.landing-follow-up/LandingFollowUpContext [18] 
export var LandingFollowUpContext = React.createContext({"api":null,"controls":null,"forms":null,"toast":null});

// statstrade-web.feature.landing.landing-follow-up/LandingFollowUpApi [24] 
export function LandingFollowUpApi({onSuccess,onEmail}){
  let contactUs = contact_us.useContactUsContext({});
  return {
    "contact":{
        "fn":async function ({name,email,message}){
            let res = await contactUs.api.contact({"name":name,"email":email,"message":message});
            if(res){
              onSuccess();
            }
            return res;
          }
      },
    "newsletter":{
        "fn":async function (email){
            let res = await onEmail(email);
            if(res){
              onSuccess();
            }
            return res;
          }
      }
  };
}

// statstrade-web.feature.landing.landing-follow-up/LandingFollowUpProvider [44] 
export function LandingFollowUpProvider({onSuccess,onEmail,children}){
  let [toast,setToast] = React.useState(null);
  let controls = hf.useControls(["submitted","success","error","busy"]);
  let api = LandingFollowUpApi({"onSuccess":onSuccess,"onEmail":onEmail});
  let forms = {
    "contact":hf.useFormState({"defaultValues":contact_us.contactUsDefaults}),
    "newsletter":hf.useFormState({"defaultValues":{"email":""}})
  };
  return (
    <LandingFollowUpContext.Provider
      value={{
          "api":api,
          "controls":controls,
          "forms":forms,
          "toast":toast,
          "setToast":setToast
        }}>{children}
    </LandingFollowUpContext.Provider>);
}

// statstrade-web.feature.landing.landing-follow-up/LandingFollowUpSection [65] 
export function LandingFollowUpSection({title,description,className = "",...props}){
  return (
    <T.YStack gap="$4" className={className} {...props}>
      <T.H2 size="$8" textAlign="center">{title}</T.H2>
      <T.Paragraph size="$5" textAlign="center" color="$color11">{description}</T.Paragraph>
    </T.YStack>);
}

// statstrade-web.feature.landing.landing-follow-up/LandingFollowUpForm [79] 
export function LandingFollowUpForm(){
  let context = contact_us.useContactUsContext({});
  return (
    <T.YStack gap="$6" width="100%" maxWidth={500} alignSelf="center">
      <T.YStack gap="$8">
        <T.H2
          color="$color11"
          fontWeight="100"
          fontSize="$10"
          letterSpacing={0}
          marginBottom="$2"
          $sm={{"textAlign":"center","fontSize":"38px","marginBottom":0}}>Get in touch
        </T.H2>
        <contact_us.ContactUsContext.Provider value={context}><contact_us.ContactUsForm/></contact_us.ContactUsContext.Provider>
      </T.YStack>
      <T.Separator/>
    </T.YStack>);
}

// statstrade-web.feature.landing.landing-follow-up/LandingFollowUp [101] 
export function LandingFollowUp({onSuccess,onEmail,...props}){
  return (
    <LandingFollowUpProvider onSuccess={onSuccess} onEmail={onEmail}>
      <T.YStack padding="$8" gap="$12" {...props}><LandingFollowUpForm/></T.YStack>
    </LandingFollowUpProvider>);
}