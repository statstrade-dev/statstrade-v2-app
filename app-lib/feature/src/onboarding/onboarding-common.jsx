import React from 'react'

import * as T from 'tamagui'

import * as kd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as hook_form from '@statstrade/edge/lib/js/lib/react-hook-form.jsx'

import * as group_user from '@statstrade/group/common-user-action.jsx'

import * as group_org from '@statstrade/group/manage-organisation-action.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

import * as api_sb from '@statstrade/edge/remote/api-general.jsx'

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

// statstrade-web.feature.onboarding.onboarding-common/IndexOnboardingHeader [57] 
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

// statstrade-web.feature.onboarding.onboarding-common/useIndexOnboardingContext [91] 
export function useIndexOnboardingContext(){
  let controls = hook_form.useControls([
    ["step",1],
    ["currentStage",0],
    "currentError",
    "userType",
    "user",
    ["existingOrg",null],
    ["sessionId",null],
    ["invitees",[]],
    ["profileImage",null],
    ["orgTags",new Set()],
    ["orgImage",null],
    ["interestTags",new Set()],
    ["billingPlan","professional"]
  ]);
  React.useEffect(function (){
    let fetchUser = async function fetch_user(){
      try{
        let session = await api_sb.get_session();
        let data = session.data;
        let error = session.error;
        if(data && data.session){
          controls.setUser(data.session.user);
        }
        else{
          console.warn("No session found in onboarding");
        }
      }
      catch(e){
        console.error("Error fetching session",e);
      }
    };
    fetchUser();
  },[]);
  React.useEffect(function (){
    let params = new URLSearchParams(window.location.search);
    let stepParam = params.get("step");
    let sessionParam = params.get("session_id");
    if(stepParam){
      controls.setStep(parseInt(stepParam));
    }
    if(sessionParam){
      controls.setSessionId(sessionParam);
    }
  },[]);
  let userCtx = group_user.useUserActionContext();
  let orgCtx = group_org.useManageOrganisationContext({"userId":kd.get_in(controls.user,["id"])});
  let tokenCtx = group_org.useManageOrganisationTokenContext({});
  let invitationsForm = hook_form.useFormState({
    "defaultValues":{"email":""},
    "schema":hook_form.Z.object({"email":hook_form.Z.string().email()})
  });
  let context = hook_form.mergeContexts({
    "controls":controls,
    "forms":{
        "invitations":invitationsForm,
        "set_profile":userCtx.forms.user_profile,
        "organisation_create":orgCtx.forms.organisation_create,
        "organisation_update":orgCtx.forms.organisation_update,
        "token_creation":tokenCtx.forms.organisation_token_create
      },
    "user":controls.user
  },userCtx,orgCtx,tokenCtx);
  return context;
}