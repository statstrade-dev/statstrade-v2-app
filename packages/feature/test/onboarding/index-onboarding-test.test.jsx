import {TamaguiProvider,Theme,createTamagui} from 'tamagui'

import {defaultConfig} from '@tamagui/config/v4'

import {renderToStaticMarkup} from 'react-dom/server'

import * as vitest from 'vitest'

import React from 'react'

import * as creator_step from '@statstrade/feature/onboarding/onboarding-step-3-organisation.jsx'

import * as common from '@statstrade/feature/onboarding/onboarding-common.jsx'

import * as participant_step from '@statstrade/feature/onboarding/onboarding-step-3-interests.jsx'

import * as onboarding from '@statstrade/feature/onboarding/index-onboarding.jsx'

// statstrade-web.feature.onboarding.index-onboarding-test/test-index-onboarding-progress [18] 
vitest.it("computes creator and participant progress from their stage counts",function (){
  let appConfig = createTamagui(defaultConfig);
  let creatorProgress = React.createElement(onboarding.IndexOnboardingProgress,{
    "step":3,
    "maxStep":6,
    "title":"Choose a Plan",
    "userType":"creator",
    "setStep":function (_){
        null;
      }
  });
  let creatorTree = React.createElement(
    TamaguiProvider,
    {"config":appConfig,"defaultTheme":"light"},
    React.createElement(Theme,{"name":"light"},creatorProgress)
  );
  let creatorMarkup = renderToStaticMarkup(creatorTree);
  vitest.expect(creatorMarkup).toContain("Choose a Plan");
  vitest.expect(creatorMarkup).toContain("50%");
  vitest.expect(creatorMarkup).toContain("Step 3 of 6");
  let participantProgress = React.createElement(onboarding.IndexOnboardingProgress,{
    "step":3,
    "maxStep":4,
    "title":"Your Interests",
    "userType":"participant",
    "setStep":function (_){
        null;
      }
  });
  let participantTree = React.createElement(
    TamaguiProvider,
    {"config":appConfig,"defaultTheme":"light"},
    React.createElement(Theme,{"name":"light"},participantProgress)
  );
  let participantMarkup = renderToStaticMarkup(participantTree);
  vitest.expect(participantMarkup).toContain("Your Interests");
  vitest.expect(participantMarkup).toContain("75%");
  vitest.expect(participantMarkup).toContain("Step 3 of 4");
});

// statstrade-web.feature.onboarding.index-onboarding-test/test-index-onboarding-screen [47] 
vitest.afterEach(function (){
  vitest.vi.restoreAllMocks();
});
vitest.it("selects the creator organisation screen and stage label",function (){
  let controls = {
    "userType":"creator",
    "step":3,
    "setStep":function (_){
        null;
      }
  };
  let context = {"controls":controls};
  let useIndexOnboardingContext = common.useIndexOnboardingContext;
  let hook = vitest.vi.spyOn(common,"useIndexOnboardingContext");
  hook.mockReturnValue(context);
  let screen = onboarding.IndexOnboardingScreen();
  let children = screen["props"]["children"];
  let progress = children[0];
  let selected = children[1];
  vitest.expect(selected["type"]).toBe(creator_step.OnboardingStep3OrganisationScreen);
  vitest.expect(progress["props"]["title"]).toBe("Create an Organisation");
  vitest.expect(progress["props"]["maxStep"]).toBe(6);
});
vitest.it("selects the participant interests screen and stage label",function (){
  let controls = {
    "userType":"participant",
    "step":3,
    "setStep":function (_){
        null;
      }
  };
  let context = {"controls":controls};
  let useIndexOnboardingContext = common.useIndexOnboardingContext;
  let hook = vitest.vi.spyOn(common,"useIndexOnboardingContext");
  hook.mockReturnValue(context);
  let screen = onboarding.IndexOnboardingScreen();
  let children = screen["props"]["children"];
  let progress = children[0];
  let selected = children[1];
  vitest.expect(selected["type"]).toBe(participant_step.OnboardingStep3InterestsScreen);
  vitest.expect(progress["props"]["title"]).toBe("Your Interests");
  vitest.expect(progress["props"]["maxStep"]).toBe(4);
});