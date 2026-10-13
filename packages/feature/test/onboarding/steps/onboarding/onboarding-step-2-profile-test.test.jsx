import {TamaguiProvider,Theme,createTamagui} from 'tamagui'

import {defaultConfig} from '@tamagui/config/v4'

import {renderToStaticMarkup} from 'react-dom/server'

import * as vitest from 'vitest'

import React from 'react'

import * as common from '@statstrade/feature/onboarding/onboarding-common.jsx'

import * as profile from '@statstrade/feature/onboarding/onboarding-step-2-profile.jsx'

import * as element_profile from '@statstrade/component/element/element-profile.jsx'

// statstrade-web.feature.onboarding.onboarding-step-2-profile-test/test-onboarding-profile-form [17] 
vitest.afterEach(function (){
  vitest.vi.restoreAllMocks();
});
vitest.it("passes the profile controls to the reusable profile form",function (){
  let appConfig = createTamagui(defaultConfig);
  let ProfileFormSymbol = element_profile.ProfileForm;
  let profileSpy = vitest.vi.spyOn(element_profile,"ProfileForm");
  profileSpy.mockImplementation(function (_){
    return React.createElement("div",{},"Shared profile form");
  });
  let context = {
    "controls":{
        "userType":"creator",
        "profileImage":null,
        "setProfileImage":function (_){
            null;
          },
        "setStep":function (_){
            null;
          }
      },
    "user":{"id":"user-7","user_metadata":{}},
    "api":{
        "mutations":{"user_set_public":{"isPending":false}},
        "queries":{
            "user_get_profile":{"data":null,"output":[]},
            "check_handle_exists":{
                "queryRaw":function (_){
                    null;
                  }
              }
          }
      },
    "forms":{
        "set_profile":{
            "reset":function (_){
                null;
              },
            "trigger":function (){
                null;
              }
          }
      }
  };
  let screen = React.createElement(
    common.IndexOnboardingContext.Provider,
    {"value":context},
    React.createElement(profile.OnboardingProfileForm,{})
  );
  let tree = React.createElement(
    TamaguiProvider,
    {"config":appConfig,"defaultTheme":"light"},
    React.createElement(Theme,{"name":"light"},screen)
  );
  let markup = renderToStaticMarkup(tree);
  vitest.expect(markup).toContain("Shared profile form");
  let profile_props = profileSpy.mock.calls[0][0];
  vitest.expect(profile_props.userType).toBe("creator");
  vitest.expect(profile_props.user.id).toBe("user-7");
});

// statstrade-web.feature.onboarding.onboarding-step-2-profile-test/test-onboarding-profile-screen [47] 
vitest.afterEach(function (){
  vitest.vi.restoreAllMocks();
});
vitest.it("shows the step heading and its profile body",function (){
  let appConfig = createTamagui(defaultConfig);
  let ProfileFormSymbol = element_profile.ProfileForm;
  let formSpy = vitest.vi.spyOn(element_profile,"ProfileForm");
  formSpy.mockImplementation(function (_){
    return React.createElement("div",{},"Shared profile form");
  });
  let form = {
    "reset":function (__unused0,__unused1){
        null;
      },
    "trigger":function (){
        null;
      },
    "watch":function (_){
        "maker";
      },
    "control":{},
    "formState":{"isValid":true},
    "handleSubmit":function (_){
        return function (){
          return null;
        };
      }
  };
  let context = {
    "controls":{
        "userType":"participant",
        "profileImage":null,
        "setProfileImage":function (_){
            null;
          },
        "setStep":function (_){
            null;
          }
      },
    "user":{"id":"user-7","user_metadata":{}},
    "api":{
        "mutations":{"user_set_public":{"isPending":false}},
        "queries":{
            "user_get_profile":{"data":null,"output":[]},
            "check_handle_exists":{
                "queryRaw":function (_){
                    null;
                  }
              }
          }
      },
    "forms":{"set_profile":form}
  };
  let screen = React.createElement(
    common.IndexOnboardingContext.Provider,
    {"value":context},
    React.createElement(profile.OnboardingStep2ProfileScreen,{})
  );
  let tree = React.createElement(
    TamaguiProvider,
    {"config":appConfig,"defaultTheme":"light"},
    React.createElement(Theme,{"name":"light"},screen)
  );
  let markup = renderToStaticMarkup(tree);
  vitest.expect(markup).toContain("Create a Profile");
  vitest.expect(markup).toContain("Shared profile form");
  vitest.expect(formSpy).toHaveBeenCalled();
});

// statstrade-web.feature.onboarding.onboarding-step-2-profile-test/test-onboarding-profile-payload [80] 
vitest.it("uses the worker RPC country-code and selected role fields",function (){
  vitest.expect(profile.onboardingProfilePayload({
    "handle":"maker",
    "first_name":"Ari",
    "last_name":"River",
    "bio":"About",
    "country_code":"AU",
    "location":{"city":"Melbourne"},
    "picture":{"uri":"https://img.test/a.png"}
  },"creator")).toEqual({
    "handle":"maker",
    "first_name":"Ari",
    "last_name":"River",
    "bio":"About",
    "country_code":"AU",
    "location":{"city":"Melbourne"},
    "picture":{"uri":"https://img.test/a.png"},
    "type":"creator"
  });
});

// statstrade-web.feature.onboarding.onboarding-step-2-profile-test/test-save-onboarding-profile [95] 
vitest.it("saves the mapped fields, waits for refresh, and does not advance after failure",async function (){
  let events = [];
  let api = {
    "mutations":{
        "user_set_public":{
            "mutateAsync":async function (payload){
                events.push(["save",payload]);
                return {"data":true,"error":null};
              }
          }
      },
    "queries":{
        "user_get_profile":{
            "refetch":async function (){
                events.push("refetch");
                return {"data":[],"error":null};
              }
          }
      }
  };
  let result = await profile.saveOnboardingProfile(api,{
    "handle":"maker",
    "first_name":"Ari",
    "last_name":"River",
    "bio":"About",
    "country_code":"AU",
    "location":{"city":"Melbourne"},
    "picture":{"uri":"https://img.test/ari.png"}
  },"creator",function (step){
    events.push(["step",step]);
  });
  vitest.expect(events).toEqual([
    [
      "save",
      {
        "handle":"maker",
        "first_name":"Ari",
        "last_name":"River",
        "bio":"About",
        "country_code":"AU",
        "location":{"city":"Melbourne"},
        "picture":{"uri":"https://img.test/ari.png"},
        "type":"creator"
      }
    ],
    "refetch",
    ["step",3]
  ]);
  vitest.expect(result).toEqual({"data":true,"error":null});
  let failure = new Error("profile rejected");
  let failed_api = {
    "mutations":{
        "user_set_public":{
            "mutateAsync":async function (_){
                return {"data":null,"error":failure};
              }
          }
      },
    "queries":{
        "user_get_profile":{
            "refetch":async function (){
                events.push("unexpected-refetch");
              }
          }
      }
  };
  let caught = null;
  try{
    await profile.saveOnboardingProfile(failed_api,{},"participant",function (step){
      events.push(["step",step]);
    });
  }
  catch(e){
    caught = e;
  }
  vitest.expect(caught).toBe(failure);
  vitest.expect(events.length).toBe(3);
  vitest.expect(events[2]).toEqual(["step",3]);
});