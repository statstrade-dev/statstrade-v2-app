import {loadStripe} from '@stripe/stripe-js'

import {Elements,PaymentElement,useElements,useStripe} from '@stripe/react-stripe-js'

import 
  {Building2,Check,ChevronDown,Circle,Info,Rocket,TrendingUp,Zap}
 from '@tamagui/lucide-icons'

import React from 'react'

import * as T from 'tamagui'

import * as element_billing from '@statstrade/component/element/element-billing.jsx'

import * as common from '@statstrade/feature/onboarding/onboarding-common.jsx'

import * as ui_section from '@statstrade/component/ui-section.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

// statstrade-web.feature.onboarding.onboarding-step-4-billing/stripePromise [19] 
export var stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) : console.error(
  "Stripe Publishable Key is missing. Check NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
);
null;;

// statstrade-web.feature.onboarding.onboarding-step-4-billing/PaymentForm [26] 
export function PaymentForm({onCancel,onSuccess}){
  let stripe = useStripe();
  let elements = useElements();
  let [message,setMessage] = React.useState(null);
  let [isLoading,setIsLoading] = React.useState(false);
  let handleSubmit = async function (e){
    e.preventDefault();
    if(!stripe || !elements){
      return;
    }
    setIsLoading(true);
    let result = await stripe.confirmPayment({
      "elements":elements,
      "redirect":"if_required",
      "confirmParams":{
            "return_url":(process.env.NEXT_PUBLIC_SITE_URL || window.location.origin) + "/?step=5"
          }
    });
    if(result.error){
      setMessage(result.error.message);
    }
    else{
      onSuccess(result.paymentIntent);
    }
    setIsLoading(false);
  };
  return (
    <form onSubmit={handleSubmit}>
      <T.YStack
        gap="$4"
        marginBottom="$4"
        padding="$4"
        backgroundColor="$background"
        borderRadius="$4"
        borderWidth={1}
        borderColor="$borderColor">
        <T.H4>Payment Details</T.H4>
        <PaymentElement options={{"layout":"tabs"}}/>
      </T.YStack>
      <T.YStack gap="$4" marginTop="$4">
        {message ? (
          <T.Text color="$red10">{message}</T.Text>) : null}
        <T.XStack gap="$4">
          <ui.ButtonNormal
            disabled={isLoading || !stripe || !elements}
            onPress={handleSubmit}>{isLoading ? "Processing..." : "Pay now"}
          </ui.ButtonNormal>
          <ui.ButtonNormal chromeless={true} onPress={onCancel} disabled={isLoading}>Cancel</ui.ButtonNormal>
        </T.XStack>
      </T.YStack>
    </form>);
}

// statstrade-web.feature.onboarding.onboarding-step-4-billing/PaymentSuccessView [76] 
export function PaymentSuccessView({data,onContinue,org}){
  let receipt = data.receipt || {};
  let amount = receipt.amount || 0;
  let datePaid = receipt.period_start ? new Date(receipt.period_start).toLocaleDateString("en-US",{"year":"numeric","month":"short","day":"numeric"}) : new Date().toLocaleDateString("en-US",{"year":"numeric","month":"short","day":"numeric"});
  return (
    <T.YStack
      alignSelf="center"
      maxWidth={480}
      borderRadius="$6"
      borderColor="$borderColor"
      shadowRadius={20}
      width="100%"
      shadowOpacity={0.1}
      borderWidth={1}
      shadowColor="$shadow4"
      justifyContent="center"
      padding="$8"
      gap="$5"
      backgroundColor="$background"
      alignItems="center">
      <T.YStack width="100%" gap="$3">
        <T.XStack justifyContent="space-between" alignItems="center">
          <T.Text color="$color10" fontSize="$3">Receipt Number</T.Text>
          <T.Text fontWeight="600" fontSize="$3" color="$color12">{receipt.id || "-"}</T.Text>
        </T.XStack>
        <T.XStack justifyContent="space-between" alignItems="center">
          <T.Text color="$color10" fontSize="$3">Amount Paid</T.Text>
          <T.Text fontWeight="600" fontSize="$3" color="$color12">{"$" + (amount / 100).toFixed(2)}</T.Text>
        </T.XStack>
        <T.XStack justifyContent="space-between" alignItems="center">
          <T.Text color="$color10" fontSize="$3">Date Paid</T.Text>
          <T.Text fontWeight="600" fontSize="$3" color="$color12">{datePaid}</T.Text>
        </T.XStack>
        <T.XStack justifyContent="space-between" alignItems="center">
          <T.Text color="$color10" fontSize="$3">Payment Method</T.Text>
          <T.Text fontWeight="600" fontSize="$3" color="$color12">
            {"Card (" + (receipt.currency || "usd").toUpperCase() + ")"}
          </T.Text>
        </T.XStack>
      </T.YStack>
      <ui.ButtonNormal
        width="100%"
        size="$5"
        onPress={onContinue}
        backgroundColor="$color12"
        hoverStyle={{"backgroundColor":"$color11"}}
        color="$color1">Continue
      </ui.ButtonNormal>
    </T.YStack>);
}

// statstrade-web.feature.onboarding.onboarding-step-4-billing/PaymentErrorView [113] 
export function PaymentErrorView({error,onBack}){
  return (
    <T.YStack
      alignSelf="center"
      maxWidth={480}
      borderRadius="$6"
      borderColor="$red8"
      shadowRadius={20}
      width="100%"
      shadowOpacity={0.1}
      borderWidth={1}
      shadowColor="$shadow4"
      justifyContent="center"
      padding="$8"
      gap="$5"
      backgroundColor="$background"
      alignItems="center">
      <T.YStack alignItems="center" gap="$3">
        <Circle size={64} color="$red10"/>
        <T.H4 textAlign="center" color="$red10">Payment Failed</T.H4>
        <T.Paragraph textAlign="center" color="$color11">
          {(error && error.message) || "We couldn't process your payment. Please keep your existing plan or try again with a different payment method."}
        </T.Paragraph>
      </T.YStack>
      <ui.ButtonNormal
        width="100%"
        size="$5"
        onPress={onBack}
        backgroundColor="$color2"
        hoverStyle={{"backgroundColor":"$color3"}}
        color="$color12">Back
      </ui.ButtonNormal>
    </T.YStack>);
}

// statstrade-web.feature.onboarding.onboarding-step-4-billing/PlanActiveView [131] 
export function PlanActiveView({onContinue,plan}){
  return (
    <T.YStack
      alignSelf="center"
      maxWidth={480}
      borderRadius="$6"
      borderColor="$borderColor"
      shadowRadius={20}
      width="100%"
      shadowOpacity={0.1}
      borderWidth={1}
      shadowColor="$shadow4"
      justifyContent="center"
      padding="$8"
      gap="$5"
      backgroundColor="$background"
      alignItems="center">
      <T.YStack alignItems="center" gap="$3">
        <Check size={64} color="$color12"/>
        <T.Paragraph textAlign="center" color="$color11">Your organisation is already subscribed to the Pro plan.</T.Paragraph>
      </T.YStack>
      <ui.ButtonNormal
        width="100%"
        size="$5"
        onPress={onContinue}
        backgroundColor="$color12"
        hoverStyle={{"backgroundColor":"$color11"}}
        color="$color1">Continue
      </ui.ButtonNormal>
    </T.YStack>);
}

// statstrade-web.feature.onboarding.onboarding-step-4-billing/OnboardingStep4BillingScreen [147] 
export function OnboardingStep4BillingScreen(){
  let context = React.useContext(common.IndexOnboardingContext);
  let {api,controls} = context;
  let hasProPlan = controls.existingOrg && ((controls.existingOrg.tier == "pro") || (controls.existingOrg.tier == "standard") || (controls.existingOrg.tier == "enterprise"));
  let isBusy = api.mutations.stripe_checkout.isPending || api.mutations.stripe_status.isPending;
  let [clientSecret,setClientSecret] = React.useState(null);
  let [message,setMessage] = React.useState(null);
  let [orgId,setOrgId] = React.useState(controls.existingOrg && controls.existingOrg.id);
  let [successData,setSuccessData] = React.useState(null);
  let [paymentError,setPaymentError] = React.useState(null);
  let orgsQuery = api.queries.user_list_member_organisations;
  React.useEffect(function (){
    if(!orgId){
      let {data,error} = orgsQuery;
      if(error){
        console.error("Failed to fetch orgs",error);
      }
      else{
        let orgs = data;
        if(orgs && (orgs.length > 0)){
          setOrgId(orgs[0].id);
        }
      }
    }
    return function (){
      setClientSecret(null);
    };
  },[orgsQuery.data,orgsQuery.error]);
  let handleSelect = async function (planId){
    setMessage(null);
    if(planId == "professional"){
      try{
        if(!orgId){
          console.error("No organisation found");
          setMessage("Please select or create an organisation first.");
          return;
        }
        console.log("Initiating Stripe Checkout for Org:",orgId," Plan:",planId);
        let response = await api.mutations.stripe_checkout.mutateAsync({"orgId":orgId,"planId":planId});
        console.log("Stripe Checkout Response:",response);
        let data = response;
        if(data.clientSecret){
          console.log("Client Secret received, rendering PaymentElement...");
          setClientSecret(data.clientSecret);
        }
        else{
          console.error("No clientSecret returned",data);
          setMessage("Failed to initialize checkout. Please try again.");
        }
      }
      catch(e){
        console.error("Error creating subscription",e);
        setMessage("An error occurred. Please try again.");
      }
    }
    else{
      setTimeout(function (){
        controls.setStep(5);
      },500);
    }
  };
  return (
    <ui_section.MinFrameCenter maxWidth={600}>
      <ui_section.MinHeader
        logo={(controls.existingOrg && controls.existingOrg.name) ? (
            <T.Text
              textTransform="uppercase"
              fontSize="$1"
              fontWeight="600"
              letterSpacing={2}
              color="$color11">{controls.existingOrg.name}
            </T.Text>) : null}
        title={successData ? "Payment Successful" : (hasProPlan ? "Currently Subscribed" : (clientSecret ? "Complete Payment" : "Choose a Plan"))}
        paragraph={successData ? "Thank you for your purchase." : (hasProPlan ? null : (paymentError ? "Something went wrong." : (clientSecret ? "Securely enter your payment details below." : "Scalable pricing for every stage.")))}/>
      {successData ? (
        <element_billing.PaymentSuccessView
          data={successData}
          org={controls.existingOrg}
          onContinue={function (){
              controls.setStep(5);
            }}/>) : null}
      {hasProPlan ? (
        <element_billing.PlanActiveView
          plan="professional"
          onContinue={function (){
              controls.setStep(5);
            }}/>) : null}
      {paymentError ? (
        <element_billing.PaymentErrorView
          error={paymentError}
          onBack={function (){
              setPaymentError(null);
              setClientSecret(null);
            }}/>) : null}
      {clientSecret ? (
        <Elements
          stripe={stripePromise}
          options={{"clientSecret":clientSecret,"appearance":{"theme":"stripe"}}}>
          <element_billing.PaymentForm
            onCancel={function (){
                setClientSecret(null);
              }}
            onSuccess={function (paymentIntent){
                api.mutations.stripe_status.mutateAsync(paymentIntent).then(function (res){
                  setSuccessData(res);
                  setClientSecret(null);
                }).catch(function (e){
                  console.error("Failed to verify tier",e);
                  setPaymentError(e);
                  setClientSecret(null);
                });
              }}/>
        </Elements>) : (hasProPlan ? null : (
        <element_billing.PlanSelection
          plans={element_billing.billingPlans}
          selected={controls.billingPlan}
          onSelect={controls.setBillingPlan}
          onProceed={handleSelect}
          isBusy={isBusy}
          message={message}/>))}
    </ui_section.MinFrameCenter>);
}