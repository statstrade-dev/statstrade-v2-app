import * as T from 'tamagui'

import React from 'react'

import * as ele_org from '@statstrade/component/element/element-organisation.jsx'

import * as kd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as kl from '@statstrade/edge/lib/xt/lang/common-lib.jsx'

import * as common from '@statstrade/feature/onboarding/onboarding-common.jsx'

import * as ui_section from '@statstrade/component/ui-section.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

// statstrade-web.feature.onboarding.onboarding-step-3-interests/OnboardingStep3InterestsScreen [22] 
export function OnboardingStep3InterestsScreen(){
  let context = React.useContext(common.IndexOnboardingContext);
  let {api,controls,user} = context;
  let [isLoading,setIsLoading] = React.useState(false);
  React.useEffect(function (){
    let existingInterests = kd.get_in(user,["user_metadata","detail","interests"]);
    if(existingInterests && kl.is_arrayp(existingInterests)){
      controls.setInterestTags(new Set(existingInterests));
    }
  },[user]);
  let toggle = function (id){
    let next = new Set(controls.interestTags);
    if(next.has(id)){
      next.delete(id);
    }
    else{
      next.add(id);
    }
    controls.setInterestTags(next);
  };
  let handleContinue = async function (){
    setIsLoading(true);
    try{
      await api.mutations.user_set_public.mutateAsync({"detail":{"interests":Array.from(controls.interestTags)}});
      controls.setStep(4);
    }
    catch(e){
      console.error("Failed to save interests",e);
      setIsLoading(false);
    }
  };
  return (
    <ui_section.MinFrameCenter>
      <ui_section.MinHeader
        title="Your Interests"
        paragraph="Pick some categories that you are interested in"/>
      <T.YStack marginTop="$8" gap="$6">
        <T.View
          display="grid"
          gridTemplateColumns="1fr 1fr"
          gap="$3"
          width="100%"
          maxWidth={600}>
          {ele_org.organisationCategories.map(function (item){
            let {id,label,icon} = item;
            let isSelected = controls.interestTags.has(id);
            return (
              <T.Button
                animation="bouncy"
                color={isSelected ? "$blue11" : "$color11"}
                onPress={function (){
                    toggle(id);
                  }}
                pressStyle={{"scale":0.98}}
                key={id}
                borderRadius="$3"
                scale={isSelected ? 1.02 : 1}
                borderColor={isSelected ? "$blue10" : "$color3"}
                icon={icon}
                hoverStyle={{
                    "borderColor":isSelected ? "$blue10" : "$color4",
                    "backgroundColor":isSelected ? "$blue4" : "$color2"
                  }}
                borderWidth={2}
                size="$5"
                backgroundColor={isSelected ? "$blue3" : "$color1"}>{label}
              </T.Button>);
          })}
        </T.View>
        <ui.ButtonInverse
          size="$5"
          fontSize="$5"
          color="$blue10"
          marginTop="$6"
          disabled={isLoading}
          opacity={isLoading ? 0.5 : 1}
          onPress={handleContinue}
          width="100%">{isLoading ? "Saving..." : "Continue"}
        </ui.ButtonInverse>
      </T.YStack>
    </ui_section.MinFrameCenter>);
}