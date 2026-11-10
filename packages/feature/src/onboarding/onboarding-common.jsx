import React from 'react'

import * as T from 'tamagui'

import * as kd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as hook_form from '@statstrade/edge/lib/js/lib/react-hook-form.jsx'

import * as ui_controls from '@statstrade/edge/ui-controls.jsx'

import * as group_user from '@statstrade/group/common-user-action.jsx'

import * as client_auth from '@statstrade/edge/remote/util-supabase.jsx'

import * as group_org from '@statstrade/group/manage-organisation-action.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

// statstrade-web.feature.onboarding.onboarding-common/IndexOnboardingContext [26] 
export var IndexOnboardingContext = React.createContext();

// statstrade-web.feature.onboarding.onboarding-common/indexOnboardingStages [29] 
export var indexOnboardingStages = {
  "creator":[
    {
    "key":"profile",
    "title":"Create a Profile",
    "description":"Fill in some details to get started"
  },
    {
    "key":"organisation",
    "title":"Create an Organisation",
    "description":"Your place for engaging the community"
  },
    {
    "key":"billing",
    "title":"Choose a Plan",
    "description":"Pick a plan that's right for you"
  },
    {
    "key":"invitations",
    "title":"Invite participants",
    "description":"Invite some participants to your organisation"
  },
    {
    "key":"complete",
    "title":"All Done",
    "description":"You are ready to go"
  }
  ],
  "participant":[
    {
    "key":"profile",
    "title":"Create a Profile",
    "description":"Fill in some details to get started"
  },
    {
    "key":"interests",
    "title":"Your Interests",
    "description":"Pick some categories that you are interested in"
  },
    {
    "key":"complete",
    "title":"Completed",
    "description":"You are ready to go"
  }
  ]
};

// statstrade-web.feature.onboarding.onboarding-common/syncOnboardingSessionUser [57] 
export function syncOnboardingSessionUser(session,setUser){
  let user = session ? session["user"] : null;
  if(user){
    setUser(user);
  }
  return user;
}

// statstrade-web.feature.onboarding.onboarding-common/syncOnboardingIdentity [65] 
export function syncOnboardingIdentity(profileRows,organisations,preferred_organisation_id,controls){
  let profile = Array.isArray(profileRows) ? profileRows[0] : profileRows;
  if(profile && !controls.userType && profile.type){
    controls.setUserType(profile.type);
  }
  if(!controls.existingOrg && Array.isArray(organisations) && (organisations["length"] > 0)){
    let preferred = organisations.find(function (organisation){
      return organisation.id == preferred_organisation_id;
    });
    let selected = preferred || organisations[0];
    controls.setExistingOrg(selected);
    controls.setExistingOrgId(selected.id);
  }
  return profile;
}

// statstrade-web.feature.onboarding.onboarding-common/mergeOnboardingContexts [85] 
export function mergeOnboardingContexts(controls,invitationsForm,userContext,organisationContext){
  let userApi = userContext.api;
  let organisationApi = organisationContext.api;
  let queries = Object.assign({},userApi.queries,organisationApi.queries);
  let mutations = Object.assign({},userApi.mutations,organisationApi.mutations);
  let forms = Object.assign({},userContext.forms,organisationContext.forms,{
    "invitations":invitationsForm,
    "set_profile":userContext.forms.user_profile,
    "organisation_create":organisationContext.forms.organisation_create,
    "organisation_update":organisationContext.forms.organisation_update
  });
  return {
    "controls":controls,
    "user":controls.user,
    "api":{
        "client":userApi.client,
        "queries":queries,
        "mutations":mutations
      },
    "forms":forms
  };
}

// statstrade-web.feature.onboarding.onboarding-common/sendOnboardingInvitations [110] 
export async function sendOnboardingInvitations(mutation,organisation_id,emails){
  if(!organisation_id){
    throw new Error("Organisation is required to send invitations");
  }
  let outcomes = await Promise.all((emails || []).map(async function (email){
    try{
      let result = await mutation.mutateAsync({"organisation_id":organisation_id,"email":email});
      return {"email":email,"error":result && result.error};
    }
    catch(e){
      return {"email":email,"error":e};
    }
  }));
  let successful = outcomes.filter(function (outcome){
    return !outcome.error;
  });
  let failed = outcomes.filter(function (outcome){
    return outcome.error;
  });
  let sent = successful.map(function (outcome){
    return outcome.email;
  });
  return {"sent":sent,"failed":failed};
}

// statstrade-web.feature.onboarding.onboarding-common/IndexOnboardingHeader [143] 
export function IndexOnboardingHeader(){
  let ctx = React.useContext(IndexOnboardingContext);
  let controls = ctx.controls;
  return (
    <T.YStack height="120px" width="100%" justifyContent="center" gap="$2">
      <T.XStack alignItems="center">
        <T.YStack>
          <T.Paragraph fontSize={14}>Step 1 of 4</T.Paragraph>
          <T.Text tag="h2" fontSize={20} marginTop={4}>Your Profile</T.Text>
        </T.YStack>
      </T.XStack>
      <ui.Pad/>
      <ui.Badge>{"25%"}</ui.Badge>
      <T.Progress value={20} height={8}><T.ProgressIndicator animation="bouncy"/></T.Progress>
    </T.YStack>);
}

// statstrade-web.feature.onboarding.onboarding-common/useIndexOnboardingContext [177] 
export function useIndexOnboardingContext(){
  let controls = ui_controls.useControls([
    ["step",1],
    ["currentStage",0],
    "currentError",
    "userType",
    "user",
    ["existingOrg",null],
    ["existingOrgId",null],
    ["sessionId",null],
    ["invitees",[]],
    ["profileImage",null],
    ["orgTags",new Set()],
    ["orgImage",null],
    ["interestTags",new Set()],
    ["billingPlan","professional"]
  ]);
  let [session] = client_auth.useListenSession();
  React.useEffect(function (){
    let params = new URLSearchParams(window.location.search);
    let stepParam = params.get("step");
    let sessionParam = params.get("session_id");
    let organisationParam = params.get("org_id");
    if(stepParam){
      controls.setStep(parseInt(stepParam));
    }
    if(sessionParam){
      controls.setSessionId(sessionParam);
    }
    if(organisationParam){
      controls.setExistingOrgId(organisationParam);
    }
  },[]);
  let userCtx = group_user.useUserActionContext();
  let orgCtx = group_org.useManageOrganisationContext({"userId":kd.get_in(controls.user,["id"])});
  let invitationsForm = hook_form.useFormState({
    "defaultValues":{"email":""},
    "schema":hook_form.Z.object({"email":hook_form.Z.string().email()})
  });
  let context = mergeOnboardingContexts(controls,invitationsForm,userCtx,orgCtx);
  React.useEffect(function (){
    syncOnboardingSessionUser(session,controls.setUser);
    if(session){
      userCtx.api.queries.user_get_profile.refetch();
    }
  },[session]);
  React.useEffect(function (){
    syncOnboardingIdentity(
      userCtx.api.queries.user_get_profile.output,
      userCtx.api.queries.user_list_member_organisations.output,
      controls.existingOrgId,
      controls
    );
  },[
    userCtx.api.queries.user_get_profile.data,
    userCtx.api.queries.user_list_member_organisations.data
  ]);
  return context;
}