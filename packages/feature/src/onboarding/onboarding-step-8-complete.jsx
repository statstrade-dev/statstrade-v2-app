import {ArrowRight,CheckCircle2} from '@tamagui/lucide-icons'

import * as T from 'tamagui'

import React from 'react'

import * as common from '@statstrade/feature/onboarding/onboarding-common.jsx'

import * as ui_section from '@statstrade/component/ui-section.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

// statstrade-web.feature.onboarding.onboarding-step-8-complete/completeOnboarding [16] 
export async function completeOnboarding(api,user_type){
  let result = await api.mutations.user_set_public.mutateAsync({"type":user_type,"is_onboarded":true});
  if(result.error){
    throw result.error;
  }
  await Promise.all([
    api.queries.user_get_profile.refetch(),
    api.queries.get_user.refetch()
  ]);
  return result;
}

// statstrade-web.feature.onboarding.onboarding-step-8-complete/OnboardingStep8CompleteScreen [29] 
export function OnboardingStep8CompleteScreen(){
  let context = React.useContext(common.IndexOnboardingContext);
  let {api,controls} = context;
  let themeColor = (controls.userType == "creator") ? "#000" : "$blue10";
  let [completionError,setCompletionError] = React.useState(null);
  let isBusy = api.mutations.user_set_public.isPending;
  let handle_complete = async function (){
    setCompletionError(null);
    try{
      await completeOnboarding(api,controls.userType);
    }
    catch(e){
      console.error("Failed to complete onboarding",e);
      setCompletionError(
        e.message || "Could not complete onboarding. Please try again."
      );
    }
  };
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
              {(controls.userType == "creator") ? "Your organisation is ready and you can start engaging with your community." : "Your profile and interests are ready. You can start exploring the community."}
            </T.Paragraph>
          </T.YStack>
        </T.YStack>
        {completionError ? (
          <T.Paragraph color="$red10" textAlign="center" marginTop="$4">{completionError}</T.Paragraph>) : null}
        {isBusy ? (
          <T.YStack
            gap="$4"
            alignItems="center"
            marginTop="$8"
            animation="lazy"
            enterStyle={{"opacity":0}}>
            <T.Spinner size="large" color={themeColor}/>
            <T.Text color="$color11" fontSize="$6" fontWeight="500">We are preparing your account...</T.Text>
          </T.YStack>) : (
          <ui.ButtonInverse
            animation="lazy"
            color={themeColor}
            onPress={handle_complete}
            maxWidth={350}
            disabled={isBusy}
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