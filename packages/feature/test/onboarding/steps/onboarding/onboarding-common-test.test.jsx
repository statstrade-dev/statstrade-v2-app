import {TamaguiProvider,Theme,createTamagui} from 'tamagui'

import {defaultConfig} from '@tamagui/config/v4'

import {renderToStaticMarkup} from 'react-dom/server'

import * as vitest from 'vitest'

import React from 'react'

import * as hook_form from '@statstrade/edge/lib/js/lib/react-hook-form.jsx'

import * as group_user from '@statstrade/group/common-user-action.jsx'

import * as client_auth from '@statstrade/edge/remote/util-supabase.jsx'

import * as onboarding from '@statstrade/feature/onboarding/onboarding-common.jsx'

import * as group_org from '@statstrade/group/manage-organisation-action.jsx'

// statstrade-web.feature.onboarding.onboarding-common-test/test-onboarding-common-header [19] 
vitest.it("uses the active controls from its context",function (){
  let appConfig = createTamagui(defaultConfig);
  let controls = {
    "step":2,
    "setStep":function (_){
        null;
      }
  };
  let screen = React.createElement(
    onboarding.IndexOnboardingContext.Provider,
    {"value":{"controls":controls}},
    React.createElement(onboarding.IndexOnboardingHeader,{})
  );
  let tree = React.createElement(
    TamaguiProvider,
    {"config":appConfig,"defaultTheme":"light"},
    React.createElement(Theme,{"name":"light"},screen)
  );
  let markup = renderToStaticMarkup(tree);
  vitest.expect(markup).toContain("Your Profile");
  vitest.expect(markup).toContain("Step 1 of 4");
});

// statstrade-web.feature.onboarding.onboarding-common-test/test-sync-onboarding-entry-user [37] 
vitest.it("sets an authenticated user once and ignores a missing session",function (){
  let calls = 0;
  let received = null;
  let setUser = function (user){
    calls = (calls + 1);
    received = user;
  };
  let user = {"id":"user-7","email":"member@example.com"};
  let result = onboarding.syncOnboardingSessionUser({"user":user},setUser);
  vitest.expect(result).toEqual(user);
  vitest.expect(received).toEqual(user);
  vitest.expect(calls).toBe(1);
  vitest.expect(onboarding.syncOnboardingSessionUser(null,setUser)).toBe(null);
  vitest.expect(calls).toBe(1);
});

// statstrade-web.feature.onboarding.onboarding-common-test/test-use-index-onboarding-context [62] 
vitest.afterEach(function (){
  vitest.vi.restoreAllMocks();
});
vitest.it("keeps user and organisation APIs and form maps in the onboarding value",function (){
  let listenSessionHook = client_auth.useListenSession;
  let useUserContextHook = group_user.useUserActionContext;
  let useOrganisationContextHook = group_org.useManageOrganisationContext;
  let useFormStateHook = hook_form.useFormState;
  let sessionSpy = vitest.vi.spyOn(client_auth,"useListenSession");
  sessionSpy.mockReturnValue([
    null,
    function (_){
      null;
    },
    false
  ]);
  let formSpy = vitest.vi.spyOn(hook_form,"useFormState");
  formSpy.mockReturnValue({"email":"invite-form"});
  let user_context = {
    "api":{
        "client":"worker",
        "queries":{
            "user_get_profile":{
                "data":null,
                "output":[],
                "refetch":function (){
                    null;
                  }
              },
            "user_list_member_organisations":{"data":null,"output":[]}
          },
        "mutations":{"user_set_public":{}}
      },
    "forms":{"user_profile":{"id":"profile-form"}}
  };
  let organisation_context = {
    "api":{
        "queries":{"check_organisation_exists":{}},
        "mutations":{"organisation_create":{}}
      },
    "forms":{
        "organisation_create":{"id":"organisation-form"},
        "organisation_update":{"id":"organisation-update-form"}
      }
  };
  let userSpy = vitest.vi.spyOn(group_user,"useUserActionContext");
  let organisationSpy = vitest.vi.spyOn(group_org,"useManageOrganisationContext");
  userSpy.mockReturnValue(user_context);
  organisationSpy.mockReturnValue(organisation_context);
  let captured = null;
  let Probe = function (){
    captured = onboarding.useIndexOnboardingContext();
    return null;
  };
  renderToStaticMarkup(React.createElement(Probe,{}));
  vitest.expect(captured.api.client).toBe("worker");
  vitest.expect(captured.api.queries.user_get_profile).toBe(user_context.api.queries.user_get_profile);
  vitest.expect(captured.api.queries.check_organisation_exists).toBe(organisation_context.api.queries.check_organisation_exists);
  vitest.expect(captured.forms.set_profile).toBe(user_context.forms.user_profile);
  vitest.expect(captured.forms.organisation_create).toBe(organisation_context.forms.organisation_create);
  vitest.expect(captured.forms.invitations.email).toBe("invite-form");
});

// statstrade-web.feature.onboarding.onboarding-common-test/test-sync-onboarding-identity [104] 
vitest.it("selects the requested member organisation, then preserves an active choice",function (){
  let selectedType = null;
  let selectedOrg = null;
  let selectedOrgId = null;
  let controls = {
    "userType":null,
    "existingOrg":null,
    "setUserType":function (value){
        selectedType = value;
      },
    "setExistingOrg":function (value){
        selectedOrg = value;
      },
    "setExistingOrgId":function (value){
        selectedOrgId = value;
      }
  };
  let profile = {"type":"creator","handle":"maker"};
  let orgs = [{"id":"org-a","name":"A"},{"id":"org-b","name":"B"}];
  vitest.expect(
    onboarding.syncOnboardingIdentity([profile],orgs,"org-b",controls)
  ).toEqual(profile);
  vitest.expect(selectedType).toBe("creator");
  vitest.expect(selectedOrg).toEqual(orgs[1]);
  vitest.expect(selectedOrgId).toBe("org-b");
  controls["userType"] = "participant";
  controls["existingOrg"] = orgs[0];
  onboarding.syncOnboardingIdentity({"type":"creator"},orgs,"org-b",controls);
  vitest.expect(selectedType).toBe("creator");
  vitest.expect(selectedOrg).toEqual(orgs[1]);
});

// statstrade-web.feature.onboarding.onboarding-common-test/test-merge-onboarding-contexts [133] 
vitest.it("merges nested query, mutation, and form maps without mutating inputs",function (){
  let controls = {"step":2};
  let client = {"id":"worker-client"};
  let profile_form = {"id":"profile-form"};
  let organisation_form = {"id":"organisation-form"};
  let invitation_form = {"id":"invitation-form"};
  let user_context = {
    "api":{
        "client":client,
        "queries":{"get-user":"user-query"},
        "mutations":{"user-set-public":"user-mutation"}
      },
    "forms":{"user_profile":profile_form}
  };
  let organisation_context = {
    "api":{
        "queries":{"check-organisation-exists":"org-query"},
        "mutations":{"organisation-create":"org-mutation"}
      },
    "forms":{
        "organisation_create":organisation_form,
        "organisation_update":"update-form"
      }
  };
  let merged = onboarding.mergeOnboardingContexts(controls,invitation_form,user_context,organisation_context);
  vitest.expect(merged.api.client).toBe(client);
  vitest.expect(merged.api.queries).toEqual({
    "get-user":"user-query",
    "check-organisation-exists":"org-query"
  });
  vitest.expect(merged.api.mutations).toEqual({
    "user-set-public":"user-mutation",
    "organisation-create":"org-mutation"
  });
  vitest.expect(merged.forms.invitations).toBe(invitation_form);
  vitest.expect(merged.forms.set_profile).toBe(profile_form);
  vitest.expect(merged.forms.organisation_create).toBe(organisation_form);
  vitest.expect(user_context.api.queries).toEqual({"get-user":"user-query"});
  vitest.expect(organisation_context.api.mutations).toEqual({"organisation-create":"org-mutation"});
});

// statstrade-web.feature.onboarding.onboarding-common-test/test-send-onboarding-invitations [168] 
vitest.it("uses the worker mutation payload and separates success from returned and thrown errors",async function (){
  let calls = [];
  let mutation = {
    "mutateAsync":async function (payload){
        calls.push(payload);
        if(payload.email == "returned@example.com"){
          return {"data":null,"error":{"message":"rejected"}};
        }
        else{
          if(payload.email == "thrown@example.com"){
            throw new Error("offline");
          }
          else{
            return {"data":true,"error":null};
          }
        }
      }
  };
  let result = await onboarding.sendOnboardingInvitations(
    mutation,
    "org-7",
    ["ok@example.com","returned@example.com","thrown@example.com"]
  );
  vitest.expect(calls).toEqual([
    {"organisation_id":"org-7","email":"ok@example.com"},
    {"organisation_id":"org-7","email":"returned@example.com"},
    {"organisation_id":"org-7","email":"thrown@example.com"}
  ]);
  vitest.expect(result.sent).toEqual(["ok@example.com"]);
  vitest.expect(result.failed[0].email).toBe("returned@example.com");
  vitest.expect(result.failed[0].error.message).toBe("rejected");
  vitest.expect(result.failed[1].email).toBe("thrown@example.com");
  vitest.expect(result.failed[1].error.message).toBe("offline");
  let missingOrg = null;
  try{
    await onboarding.sendOnboardingInvitations(mutation,null,["x@example.com"]);
  }
  catch(e){
    missingOrg = e;
  }
  vitest.expect(missingOrg.message).toBe("Organisation is required to send invitations");
});