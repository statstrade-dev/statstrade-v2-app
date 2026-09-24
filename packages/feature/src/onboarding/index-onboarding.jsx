import {ChevronLeft} from '@tamagui/lucide-icons'

import * as T from 'tamagui'

import * as kd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as onboarding_step_7_invitations from '@statstrade/feature/onboarding/onboarding-step-7-invitations.jsx'

import * as onboarding_step_3_organisation from '@statstrade/feature/onboarding/onboarding-step-3-organisation.jsx'

import * as common from '@statstrade/feature/onboarding/onboarding-common.jsx'

import * as onboarding_step_2 from '@statstrade/feature/onboarding/onboarding-step-2-profile.jsx'

import * as onboarding_step_1 from '@statstrade/feature/onboarding/onboarding-step-1-type.jsx'

import * as onboarding_step_3_interests from '@statstrade/feature/onboarding/onboarding-step-3-interests.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

import * as onboarding_step_4_billing from '@statstrade/feature/onboarding/onboarding-step-4-billing.jsx'

import * as onboarding_step_8_complete from '@statstrade/feature/onboarding/onboarding-step-8-complete.jsx'

// statstrade-web.feature.onboarding.index-onboarding/IndexOnboardingProgress [29] 
export function IndexOnboardingProgress({maxStep,setStep,step,title,userType}){
  let percentage = Math.round((step / maxStep) * 100);
  let themeColor = userType ? ((userType == "creator") ? "#000" : "$blue10") : "$color0";
  return (
    <T.YStack
      width="100%"
      paddingVertical="$5"
      paddingHorizontal="30px"
      justifyContent="center"
      gap="$5">
      <T.XStack alignItems="flex-start" justifyContent="space-between">
        <T.XStack gap="$2" alignItems="center">
          <T.Text tag="h2" fontSize="$6" lineHeight="$7" fontWeight="600">{title}</T.Text>
        </T.XStack>
        {userType ? (
          <T.YStack alignItems="center" gap="$1" position="relative">
            <T.XStack>
              {(step > 1) ? (
                <T.Button
                  size="$2"
                  paddingHorizontal="$3"
                  marginHorizontal="$2"
                  borderRadius="$3"
                  chromeless={true}
                  icon={ChevronLeft}
                  onPress={function (){
                      setStep(step - 1);
                    }}/>) : null}
              <ui.Badge
                backgroundColor={themeColor}
                color="white"
                width="100px"
                alignItems="center"
                justifyContent="center"
                paddingHorizontal="$3"
                paddingVertical="$1.5">
                <T.Text color="white" fontSize="$5" fontWeight="700">{percentage + "%"}</T.Text>
              </ui.Badge>
            </T.XStack>
            <T.Text
              color="$color10"
              bottom="-20px"
              width="100px"
              fontWeight="300"
              textAlign="center"
              zIndex={20}
              right={0}
              position="absolute"
              fontSize="$1">{"Step " + step + " of " + maxStep}
            </T.Text>
          </T.YStack>) : null}
      </T.XStack>
      <T.XStack gap="$3" alignItems="center" position="relative" zIndex={1}>
        <T.Progress
          value={percentage}
          height={8}
          flex={1}
          backgroundColor="$color3">
          <T.ProgressIndicator animation="bouncy" backgroundColor={themeColor}/>
        </T.Progress>
      </T.XStack>
    </T.YStack>);
}

// statstrade-web.feature.onboarding.index-onboarding/IndexOnboardingScreen [116] 
export function IndexOnboardingScreen(){
  let context = common.useIndexOnboardingContext();
  let {controls} = context;
  let stages = kd.get_in(
    common.indexOnboardingStages,
    [controls.userType || "participant"]
  );
  let maxStep = 1 + stages.length;
  let currentStage = kd.get_in(stages,[controls.step - 2]);
  return (
    <common.IndexOnboardingContext.Provider value={context}>
      <IndexOnboardingProgress
        step={controls.step}
        setStep={controls.setStep}
        userType={controls.userType}
        title={(currentStage && currentStage.title) || "Welcome"}
        maxStep={maxStep}/>
      {(controls.userType == "creator") ? [
        (
        <onboarding_step_1.OnboardingStep1TypeScreen key={1}/>),
        (
        <onboarding_step_2.OnboardingStep2ProfileScreen key={2}/>),
        (
        <onboarding_step_3_organisation.OnboardingStep3OrganisationScreen key={3}/>),
        (
        <onboarding_step_4_billing.OnboardingStep4BillingScreen key={4}/>),
        (
        <onboarding_step_7_invitations.OnboardingStep7InvitationsScreen key={5}/>),
        (
        <onboarding_step_8_complete.OnboardingStep8CompleteScreen key={6}/>)
      ][controls.step - 1] : [
        (
        <onboarding_step_1.OnboardingStep1TypeScreen key={1}/>),
        (
        <onboarding_step_2.OnboardingStep2ProfileScreen key={2}/>),
        (
        <onboarding_step_3_interests.OnboardingStep3InterestsScreen key={3}/>),
        (
        <onboarding_step_8_complete.OnboardingStep8CompleteScreen key={4}/>)
      ][controls.step - 1]}
    </common.IndexOnboardingContext.Provider>);
}