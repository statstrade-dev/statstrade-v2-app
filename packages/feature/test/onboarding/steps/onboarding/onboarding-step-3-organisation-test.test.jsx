import {TamaguiProvider,Theme,createTamagui} from 'tamagui'

import {defaultConfig} from '@tamagui/config/v4'

import {renderToStaticMarkup} from 'react-dom/server'

import * as vitest from 'vitest'

import React from 'react'

import * as element_organisation from '@statstrade/component/element/element-organisation.jsx'

import * as organisation from '@statstrade/feature/onboarding/onboarding-step-3-organisation.jsx'

import * as common from '@statstrade/feature/onboarding/onboarding-common.jsx'

// statstrade-web.feature.onboarding.onboarding-step-3-organisation-test/test-onboarding-organisation-form [17] 
vitest.afterEach(function (){
  vitest.vi.restoreAllMocks();
});
vitest.it("shows the creation path with the shared onboarding context",function (){
  let appConfig = createTamagui(defaultConfig);
  let OrganisationFormSymbol = element_organisation.OrganisationForm;
  let formSpy = vitest.vi.spyOn(element_organisation,"OrganisationForm");
  formSpy.mockImplementation(function (_){
    return React.createElement("div",{},"Organisation form");
  });
  let controls = {
    "orgTags":new Set(),
    "orgImage":null,
    "existingOrg":null,
    "setOrgTags":function (_){
        null;
      },
    "setOrgImage":function (_){
        null;
      },
    "setExistingOrg":function (_){
        null;
      },
    "setExistingOrgId":function (_){
        null;
      },
    "setStep":function (_){
        null;
      }
  };
  let api = {
    "mutations":{
        "organisation_create":{"isPending":false},
        "organisation_update":{"isPending":false}
      },
    "queries":{
        "user_list_member_organisations":{
            "output":[],
            "setInput":function (_){
                null;
              }
          },
        "check_organisation_exists":{
            "queryRaw":function (_){
                null;
              }
          }
      }
  };
  let create_form = {
    "watch":function (_){
        "maker";
      },
    "getValues":function (){
        {};
      },
    "reset":function (_){
        null;
      },
    "control":{}
  };
  let context = {
    "controls":controls,
    "api":api,
    "forms":{"organisation_create":create_form},
    "user":{"id":"user-7"}
  };
  let screen = React.createElement(
    common.IndexOnboardingContext.Provider,
    {"value":context},
    React.createElement(organisation.OnboardingOrganisationForm,{})
  );
  let tree = React.createElement(
    TamaguiProvider,
    {"config":appConfig,"defaultTheme":"light"},
    React.createElement(Theme,{"name":"light"},screen)
  );
  let markup = renderToStaticMarkup(tree);
  vitest.expect(markup).toContain("Create an Organisation");
  vitest.expect(markup).toContain("Organisation form");
  vitest.expect(formSpy).toHaveBeenCalled();
});

// statstrade-web.feature.onboarding.onboarding-step-3-organisation-test/test-onboarding-organisation-screen [51] 
vitest.afterEach(function (){
  vitest.vi.restoreAllMocks();
});
vitest.it("renders the organisation frame around its form",function (){
  let appConfig = createTamagui(defaultConfig);
  let OrganisationFormSymbol = element_organisation.OrganisationForm;
  let formSpy = vitest.vi.spyOn(element_organisation,"OrganisationForm");
  formSpy.mockImplementation(function (_){
    return React.createElement("div",{},"Organisation step form");
  });
  let controls = {
    "orgTags":new Set(),
    "orgImage":null,
    "existingOrg":null,
    "setOrgTags":function (_){
        null;
      },
    "setOrgImage":function (_){
        null;
      },
    "setExistingOrg":function (_){
        null;
      },
    "setExistingOrgId":function (_){
        null;
      },
    "setStep":function (_){
        null;
      }
  };
  let api = {
    "mutations":{
        "organisation_create":{"isPending":false},
        "organisation_update":{"isPending":false}
      },
    "queries":{
        "user_list_member_organisations":{
            "output":[],
            "setInput":function (_){
                null;
              }
          },
        "check_organisation_exists":{
            "queryRaw":function (_){
                null;
              }
          }
      }
  };
  let create_form = {
    "watch":function (_){
        "maker";
      },
    "getValues":function (){
        {};
      },
    "reset":function (_){
        null;
      },
    "control":{}
  };
  let context = {
    "controls":controls,
    "api":api,
    "forms":{"organisation_create":create_form},
    "user":{"id":"user-7"}
  };
  let screen = React.createElement(
    common.IndexOnboardingContext.Provider,
    {"value":context},
    React.createElement(organisation.OnboardingStep3OrganisationScreen,{})
  );
  let tree = React.createElement(
    TamaguiProvider,
    {"config":appConfig,"defaultTheme":"light"},
    React.createElement(Theme,{"name":"light"},screen)
  );
  let markup = renderToStaticMarkup(tree);
  vitest.expect(markup).toContain("Organisation step form");
  vitest.expect(formSpy).toHaveBeenCalled();
});

// statstrade-web.feature.onboarding.onboarding-step-3-organisation-test/test-save-onboarding-organisation [84] 
vitest.it("creates with tags, reloads the result, and selects its persisted row",async function (){
  let calls = [];
  let steps = [];
  let selected = null;
  let selectedId = null;
  let row = {"id":"org-a","name":"maker","title":"Maker","tags":["tech"]};
  let api = {
    "mutations":{
        "organisation_create":{
            "mutateAsync":async function (payload){
                calls.push(payload);
                return {"data":"org-a","error":null};
              }
          }
      },
    "queries":{
        "user_list_member_organisations":{
            "output":[],
            "refetch":async function (){
                return {"data":{"data":[row],"error":null}};
              }
          }
      }
  };
  let controls = {
    "existingOrg":null,
    "orgImage":null,
    "orgTags":new Set(["tech"]),
    "setExistingOrg":function (value){
        selected = value;
      },
    "setExistingOrgId":function (value){
        selectedId = value;
      },
    "setStep":function (step){
        steps.push(step);
      }
  };
  await organisation.saveOnboardingOrganisation(api,{"id":"user-7"},controls,{"name":"maker","title":"Maker"});
  vitest.expect(calls).toEqual([{"name":"maker","title":"Maker","tags":["tech"]}]);
  vitest.expect(selected).toEqual(row);
  vitest.expect(selectedId).toBe("org-a");
  vitest.expect(steps).toEqual([4]);
});
vitest.it("uses organisation-id for updates and leaves the step unchanged on failure",async function (){
  let calls = [];
  let steps = [];
  let refreshes = 0;
  let failure = new Error("update rejected");
  let api = {
    "mutations":{
        "organisation_update":{
            "mutateAsync":async function (payload){
                calls.push(payload);
                return {"data":null,"error":failure};
              }
          }
      },
    "queries":{
        "user_list_member_organisations":{
            "output":[],
            "refetch":async function (){
                refreshes = (refreshes + 1);
              }
          }
      }
  };
  let controls = {
    "existingOrg":{"id":"org-b","name":"maker"},
    "orgImage":null,
    "orgTags":new Set(),
    "setExistingOrg":function (_){
        null;
      },
    "setExistingOrgId":function (_){
        null;
      },
    "setStep":function (step){
        steps.push(step);
      }
  };
  let caught = null;
  try{
    await organisation.saveOnboardingOrganisation(
      api,
      {"id":"user-7"},
      controls,
      {"name":"maker","title":"Updated"}
    );
  }
  catch(e){
    caught = e;
  }
  vitest.expect(calls).toEqual([
    {
      "name":"maker",
      "title":"Updated",
      "tags":[],
      "organisation_id":"org-b"
    }
  ]);
  vitest.expect(caught).toBe(failure);
  vitest.expect(refreshes).toBe(0);
  vitest.expect(steps).toEqual([]);
});