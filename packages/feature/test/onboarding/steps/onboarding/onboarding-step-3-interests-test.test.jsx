import {TamaguiProvider,Theme,createTamagui} from 'tamagui'

import {defaultConfig} from '@tamagui/config/v4'

import {renderToStaticMarkup} from 'react-dom/server'

import * as vitest from 'vitest'

import React from 'react'

import * as common from '@statstrade/feature/onboarding/onboarding-common.jsx'

import * as interests from '@statstrade/feature/onboarding/onboarding-step-3-interests.jsx'

// statstrade-web.feature.onboarding.onboarding-step-3-interests-test/test-onboarding-interests-screen [16] 
vitest.it("shows the interest choices in the participant flow",function (){
  let appConfig = createTamagui(defaultConfig);
  let controls = {
    "interestTags":new Set(["tech"]),
    "setInterestTags":function (_){
        null;
      },
    "setStep":function (_){
        null;
      }
  };
  let api = {
    "mutations":{
        "user_set_public":{
            "isPending":false,
            "mutateAsync":async function (_){
                return {"data":true,"error":null};
              }
          }
      }
  };
  let step = React.createElement(
    common.IndexOnboardingContext.Provider,
    {"value":{"controls":controls,"api":api,"user":null}},
    React.createElement(interests.OnboardingStep3InterestsScreen,{})
  );
  let tree = React.createElement(
    TamaguiProvider,
    {"config":appConfig,"defaultTheme":"light"},
    React.createElement(Theme,{"name":"light"},step)
  );
  let markup = renderToStaticMarkup(tree);
  vitest.expect(markup).toContain("Your Interests");
  vitest.expect(markup).toContain("Technology");
  vitest.expect(markup).toContain("Continue");
});

// statstrade-web.feature.onboarding.onboarding-step-3-interests-test/test-save-onboarding-interests [40] 
vitest.it("sends exact categories then advances, and preserves the step on failure",async function (){
  let calls = [];
  let steps = [];
  let mutation = {
    "mutateAsync":async function (payload){
        calls.push(payload);
        return {"data":true,"error":null};
      }
  };
  await interests.saveOnboardingInterests(mutation,new Set(["tech","art"]),function (step){
    steps.push(step);
  });
  vitest.expect(calls).toEqual([{"detail":{"interests":["tech","art"]}}]);
  vitest.expect(steps).toEqual([4]);
  let failure = new Error("interests rejected");
  let failedMutation = {
    "mutateAsync":async function (_){
        return {"data":null,"error":failure};
      }
  };
  let caught = null;
  try{
    await interests.saveOnboardingInterests(failedMutation,new Set(["tech"]),function (step){
      steps.push(step);
    });
  }
  catch(e){
    caught = e;
  }
  vitest.expect(caught).toBe(failure);
  vitest.expect(steps).toEqual([4]);
});