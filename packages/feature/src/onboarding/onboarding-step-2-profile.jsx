import React from 'react'

import * as kd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as common from '@statstrade/feature/onboarding/onboarding-common.jsx'

import * as ui_section from '@statstrade/component/ui-section.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

import * as element_profile from '@statstrade/component/element/element-profile.jsx'

// statstrade-web.feature.onboarding.onboarding-step-2-profile/onboardingProfilePayload [27] 
export function onboardingProfilePayload(values,userType){
  return {
    "handle":values.handle,
    "first_name":values.first_name,
    "last_name":values.last_name,
    "bio":values.bio,
    "country_code":values.country_code,
    "location":values.location,
    "picture":values.picture,
    "type":userType
  };
}

// statstrade-web.feature.onboarding.onboarding-step-2-profile/saveOnboardingProfile [39] 
export async function saveOnboardingProfile(api,values,userType,setStep){
  let result = await api.mutations.user_set_public.mutateAsync(onboardingProfilePayload(values,userType));
  if(result.error){
    throw result.error;
  }
  await api.queries.user_get_profile.refetch();
  setStep(3);
  return result;
}

// statstrade-web.feature.onboarding.onboarding-step-2-profile/OnboardingProfileForm [53] 
export function OnboardingProfileForm(){
  let context = React.useContext(common.IndexOnboardingContext);
  let {api,controls,forms,user} = context;
  let isBusy = api.mutations.user_set_public.isPending;
  let userQuery = api.queries.user_get_profile;
  React.useEffect(function (){
    let data = userQuery.data && userQuery.data.data;
    let profile = data && (data.length > 0) && data[0];
    let userMeta = !profile && user && user.user_metadata;
    let defaults = element_profile.calc_profile_defaults(profile,user,userMeta);
    if(kd.not_emptyp(defaults)){
      forms.set_profile.reset(defaults,{"keepDefaultValues":true});
    }
    if(userMeta && userMeta.avatar_url){
      controls.setProfileImage({"uri":userMeta.avatar_url});
    }
    if(profile || userMeta){
      forms.set_profile.trigger();
    }
  },[userQuery.data,user]);
  let handle_submit = async function (finalValues){
    try{
      await saveOnboardingProfile(api,finalValues,controls.userType,controls.setStep);
    }
    catch(e){
      console.error("Error saving profile",e);
      alert("Error saving profile");
    }
  };
  return (
    <element_profile.ProfileForm
      labels={{
          "submit":ui.t("Next"),
          "skip":ui.t("Skip"),
          "title":ui.t("Create a Profile"),
          "paragraph":ui.t("Fill in some details to get started")
        }}
      profileImage={controls.profileImage}
      api={api}
      onSubmit={handle_submit}
      setProfileImage={controls.setProfileImage}
      form={forms.set_profile}
      isBusy={isBusy}
      onSkip={function (){
          controls.setStep(3);
        }}
      user={user}
      userType={controls.userType}/>);
}

// statstrade-web.feature.onboarding.onboarding-step-2-profile/OnboardingStep2ProfileScreen [113] 
export function OnboardingStep2ProfileScreen(){
  let context = React.useContext(common.IndexOnboardingContext);
  let {controls} = context;
  return (
    <ui_section.MinFrameCenter>
      <ui_section.MinHeader
        title="Create a Profile"
        paragraph="Fill in some details to get started"/>
      <OnboardingProfileForm/>
    </ui_section.MinFrameCenter>);
}