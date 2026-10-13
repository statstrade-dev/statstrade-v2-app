import {TamaguiProvider,Theme,createTamagui} from 'tamagui'

import {defaultConfig} from '@tamagui/config/v4'

import {Elements} from '@stripe/react-stripe-js'

import {renderToStaticMarkup} from 'react-dom/server'

import * as vitest from 'vitest'

import React from 'react'

import * as element_billing from '@statstrade/component/element/element-billing.jsx'

import * as common from '@statstrade/feature/onboarding/onboarding-common.jsx'

import * as billing from '@statstrade/feature/onboarding/onboarding-step-4-billing.jsx'

// statstrade-web.feature.onboarding.onboarding-step-4-billing-test/test-onboarding-payment-form [18] 
vitest.it("shows the secure payment details and a disabled pay action",function (){
  let appConfig = createTamagui(defaultConfig);
  let form = React.createElement(Elements,{"stripe":null,"options":{}},React.createElement(billing.PaymentForm,{
    "orgId":"org-7",
    "onSuccess":function (_){
        null;
      },
    "onCancel":function (){
        null;
      }
  }));
  let tree = React.createElement(
    TamaguiProvider,
    {"config":appConfig,"defaultTheme":"light"},
    React.createElement(Theme,{"name":"light"},form)
  );
  let markup = renderToStaticMarkup(tree);
  vitest.expect(markup).toContain("Payment Details");
  vitest.expect(markup).toContain("Pay now");
});

// statstrade-web.feature.onboarding.onboarding-step-4-billing-test/test-onboarding-payment-success [36] 
vitest.it("shows amount, receipt id, and payment method",function (){
  let appConfig = createTamagui(defaultConfig);
  let component = React.createElement(billing.PaymentSuccessView,{
    "data":{
        "receipt":{
            "id":"receipt-7",
            "amount":4250,
            "currency":"usd",
            "period_start":"2026-10-01T00:00:00Z"
          }
      },
    "org":{"id":"org-7"},
    "onContinue":function (){
        null;
      }
  });
  let tree = React.createElement(
    TamaguiProvider,
    {"config":appConfig,"defaultTheme":"light"},
    React.createElement(Theme,{"name":"light"},component)
  );
  let markup = renderToStaticMarkup(tree);
  vitest.expect(markup).toContain("receipt-7");
  vitest.expect(markup).toContain("$42.50");
  vitest.expect(markup).toContain("Card (USD)");
});

// statstrade-web.feature.onboarding.onboarding-step-4-billing-test/test-onboarding-payment-error [55] 
vitest.it("keeps the payment error and back action visible",function (){
  let appConfig = createTamagui(defaultConfig);
  let component = React.createElement(billing.PaymentErrorView,{
    "error":{"message":"Card declined"},
    "onBack":function (){
        null;
      }
  });
  let tree = React.createElement(
    TamaguiProvider,
    {"config":appConfig,"defaultTheme":"light"},
    React.createElement(Theme,{"name":"light"},component)
  );
  let markup = renderToStaticMarkup(tree);
  vitest.expect(markup).toContain("Payment Failed");
  vitest.expect(markup).toContain("Card declined");
  vitest.expect(markup).toContain("Back");
});

// statstrade-web.feature.onboarding.onboarding-step-4-billing-test/test-onboarding-plan-active [72] 
vitest.it("explains that the plan is active and provides continue",function (){
  let appConfig = createTamagui(defaultConfig);
  let component = React.createElement(billing.PlanActiveView,{
    "plan":"professional",
    "onContinue":function (){
        null;
      }
  });
  let tree = React.createElement(
    TamaguiProvider,
    {"config":appConfig,"defaultTheme":"light"},
    React.createElement(Theme,{"name":"light"},component)
  );
  let markup = renderToStaticMarkup(tree);
  vitest.expect(markup).toContain("already subscribed to the Pro plan");
  vitest.expect(markup).toContain("Continue");
});

// statstrade-web.feature.onboarding.onboarding-step-4-billing-test/test-onboarding-billing-screen [87] 
vitest.afterEach(function (){
  vitest.vi.restoreAllMocks();
});
vitest.it("passes the selected organisation into the billing selector",function (){
  let appConfig = createTamagui(defaultConfig);
  let PlanSelectionComponent = element_billing.PlanSelection;
  let selectorSpy = vitest.vi.spyOn(element_billing,"PlanSelection");
  selectorSpy.mockImplementation(function (_){
    return React.createElement("div",{},"Plan selection");
  });
  let context = {
    "controls":{
        "existingOrg":{"id":"org-7","name":"Maker","tier":"free"},
        "billingPlan":"professional",
        "setBillingPlan":function (_){
            null;
          },
        "setStep":function (_){
            null;
          }
      },
    "api":{
        "mutations":{
            "stripe_checkout":{
                "isPending":false,
                "mutateAsync":async function (_){
                    null;
                  }
              },
            "stripe_status":{
                "isPending":false,
                "mutateAsync":async function (_){
                    null;
                  }
              }
          },
        "queries":{"user_list_member_organisations":{"output":[],"data":null}}
      }
  };
  let screen = React.createElement(
    common.IndexOnboardingContext.Provider,
    {"value":context},
    React.createElement(billing.OnboardingStep4BillingScreen,{})
  );
  let tree = React.createElement(
    TamaguiProvider,
    {"config":appConfig,"defaultTheme":"light"},
    React.createElement(Theme,{"name":"light"},screen)
  );
  let markup = renderToStaticMarkup(tree);
  vitest.expect(markup).toContain("Choose a Plan");
  vitest.expect(markup).toContain("Plan selection");
  vitest.expect(selectorSpy).toHaveBeenCalled();
});

// statstrade-web.feature.onboarding.onboarding-step-4-billing-test/test-onboarding-billing-organisation [115] 
vitest.it("returns the selected id, first id, or nil for empty memberships",function (){
  let orgs = [{"id":"org-a"},{"id":"org-b"}];
  vitest.expect(
    billing.onboardingBillingOrganisationId({"id":"org-b"},orgs)
  ).toBe("org-b");
  vitest.expect(billing.onboardingBillingOrganisationId(null,orgs)).toBe("org-a");
  vitest.expect(billing.onboardingBillingOrganisationId(null,[])).toBe(null);
});

// statstrade-web.feature.onboarding.onboarding-step-4-billing-test/test-onboarding-stripe-return-url [128] 
vitest.it("trims the site base and URL-encodes the organisation id",function (){
  vitest.expect(
    billing.onboardingStripeReturnUrl("https://trade.example/","https://fallback.example","org / 7")
  ).toBe("https://trade.example/?step=5&org_id=org%20%2F%207");
  vitest.expect(
    billing.onboardingStripeReturnUrl(null,"https://fallback.example","org-7")
  ).toBe("https://fallback.example/?step=5&org_id=org-7");
});