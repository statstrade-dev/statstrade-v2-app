import {TamaguiProvider,Theme,createTamagui} from 'tamagui'

import {defaultConfig} from '@tamagui/config/v4'

import {renderToStaticMarkup} from 'react-dom/server'

import * as vitest from 'vitest'

import React from 'react'

import * as invitations from '@statstrade/feature/onboarding/onboarding-step-7-invitations.jsx'

import * as common from '@statstrade/feature/onboarding/onboarding-common.jsx'

// statstrade-web.feature.onboarding.onboarding-step-7-invitations-test/test-onboarding-invitations-without-organisation [16] 
vitest.it("shows the organisation requirement and a continue action",function (){
  let appConfig = createTamagui(defaultConfig);
  let context = {
    "controls":{
        "existingOrg":null,
        "invitees":[],
        "setStep":function (_){
            null;
          }
      },
    "api":{
        "mutations":{"organisation_invite_email_create":{"isPending":false}}
      },
    "forms":{}
  };
  let screen = React.createElement(
    common.IndexOnboardingContext.Provider,
    {"value":context},
    React.createElement(invitations.OnboardingStep7InvitationsScreen,{})
  );
  let tree = React.createElement(
    TamaguiProvider,
    {"config":appConfig,"defaultTheme":"light"},
    React.createElement(Theme,{"name":"light"},screen)
  );
  let markup = renderToStaticMarkup(tree);
  vitest.expect(markup).toContain("Create or select an organisation");
  vitest.expect(markup).toContain("Continue");
});