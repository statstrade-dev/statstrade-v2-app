import {TamaguiProvider,Theme,createTamagui} from 'tamagui'

import {defaultConfig} from '@tamagui/config/v4'

import {renderToStaticMarkup} from 'react-dom/server'

import * as vitest from 'vitest'

import React from 'react'

import * as common from '@statstrade/feature/onboarding/onboarding-common.jsx'

import * as complete from '@statstrade/feature/onboarding/onboarding-step-8-complete.jsx'

// statstrade-web.feature.onboarding.onboarding-step-8-complete-test/test-onboarding-completion-screen [16] 
vitest.it("renders creator and participant completion messages",function (){
  let appConfig = createTamagui(defaultConfig);
  let api = {"mutations":{"user_set_public":{"isPending":false}}};
  let renderRole = function (role){
    let context = {"controls":{"userType":role},"api":api};
    let screen = React.createElement(
      common.IndexOnboardingContext.Provider,
      {"value":context},
      React.createElement(complete.OnboardingStep8CompleteScreen,{})
    );
    let tree = React.createElement(
      TamaguiProvider,
      {"config":appConfig,"defaultTheme":"light"},
      React.createElement(Theme,{"name":"light"},screen)
    );
    return renderToStaticMarkup(tree);
  };
  vitest.expect(renderRole("creator")).toContain("Your organisation is ready");
  vitest.expect(renderRole("participant")).toContain("Your profile and interests are ready");
  vitest.expect(renderRole("participant")).toContain("Complete");
});

// statstrade-web.feature.onboarding.onboarding-step-8-complete-test/test-complete-onboarding [39] 
vitest.it("waits for the worker write then refreshes profile and user",async function (){
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
                events.push("profile");
              }
          },
        "get_user":{
            "refetch":async function (){
                events.push("user");
              }
          }
      }
  };
  let result = await complete.completeOnboarding(api,"creator");
  vitest.expect(events).toEqual([
    ["save",{"type":"creator","is_onboarded":true}],
    "profile",
    "user"
  ]);
  vitest.expect(result).toEqual({"data":true,"error":null});
  let failure = new Error("completion rejected");
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
                events.push("bad-profile");
              }
          },
        "get_user":{
            "refetch":async function (){
                events.push("bad-user");
              }
          }
      }
  };
  let caught = null;
  try{
    await complete.completeOnboarding(failed_api,"participant");
  }
  catch(e){
    caught = e;
  }
  vitest.expect(caught).toBe(failure);
  vitest.expect(events.length).toBe(3);
});