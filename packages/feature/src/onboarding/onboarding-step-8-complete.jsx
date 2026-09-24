import {ArrowRight,CheckCircle2} from '@tamagui/lucide-icons'

import * as T from 'tamagui'

import React from 'react'

import * as common from '@statstrade/feature/onboarding/onboarding-common.jsx'

import * as ui_section from '@statstrade/component/ui-section.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

// statstrade-web.feature.onboarding.onboarding-step-8-complete/OnboardingStep8CompleteScreen [16] 
export function OnboardingStep8CompleteScreen(){
  let context = React.useContext(common.IndexOnboardingContext);
  let {api,controls} = context;
  let themeColor = (controls.userType == "creator") ? "#000" : "$blue10";
  return (
    <ui_section.MinFrameCenter>
      <T.YStack
        alignItems="center"
        justifyContent="center"
        gap="$6"
        paddingVertical="$10"
        width="100%"
        flex={1}
        alignSelf="center"
        maxWidth={500}>
        <T.YStack
          alignItems="center"
          gap="$6"
          animation="bouncy"
          enterStyle={{"opacity":0,"scale":0.8,"y":10}}>
          <CheckCircle2
            size={100}
            color={themeColor}
            animation="bouncy"
            enterStyle={{"opacity":0,"scale":0.5}}/>
          <T.YStack
            gap="$3"
            alignItems="center"
            maxWidth={400}
            animation="lazy"
            enterStyle={{"opacity":0,"y":10,"scale":0.95}}>
            <T.H2
              textAlign="center"
              size="$9"
              fontWeight="800"
              letterSpacing={-0.5}>Completed
            </T.H2>
            <T.Paragraph color="$color11" textAlign="center" size="$5" lineHeight="$8">
              Your organisation has been created and you're ready to start engaging with your community.
            </T.Paragraph>
          </T.YStack>
        </T.YStack>
        {api.mutations.user_set_public.isPending ? (
          <T.YStack
            gap="$4"
            alignItems="center"
            marginTop="$8"
            animation="lazy"
            enterStyle={{"opacity":0}}>
            <T.Spinner size="large" color={themeColor}/>
            <T.Text color="$color11" fontSize="$6" fontWeight="500">We are preparing your desktop...</T.Text>
          </T.YStack>) : (
          <ui.ButtonInverse
            animation="lazy"
            color={themeColor}
            onPress={async function (){
                try{
                  await api.mutations.user_set_public.mutateAsync({"is_onboarded":true});
                }
                catch(e){
                  console.error("Failed to set onboarded status",e);
                }
              }}
            maxWidth={350}
            width="100%"
            marginTop="$8"
            size="$5"
            enterStyle={{"opacity":0,"y":20}}
            iconAfter={ArrowRight}
            fontSize="$5">Complete
          </ui.ButtonInverse>)}
      </T.YStack>
    </ui_section.MinFrameCenter>);
}