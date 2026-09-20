import {Check,Circle,Info,TrendingUp} from '@tamagui/lucide-icons'

import {Elements,PaymentElement,useElements,useStripe} from '@stripe/react-stripe-js'

import {loadStripe} from '@stripe/stripe-js'

import * as T from 'tamagui'

import React from 'react'

import * as ui_section from '@statstrade/component/ui-section'

import * as ui from '@statstrade/component/ui-common'

// sznui.lib.component.manage.organisation-manage-billing/stripePromise [16] 
export var stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) : console.error("Stripe Publishable Key is missing.");
null;;

// sznui.lib.component.manage.organisation-manage-billing/PaymentForm [23] 
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
        <T.H4>{"Payment Details"}</T.H4>
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
          <ui.ButtonNormal chromeless={true} onPress={onCancel} disabled={isLoading}>{"Cancel"}</ui.ButtonNormal>
        </T.XStack>
      </T.YStack>
    </form>);
}

// sznui.lib.component.manage.organisation-manage-billing/PaymentSuccessView [73] 
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
          <T.Text color="$color10" fontSize="$3">{"Receipt Number"}</T.Text>
          <T.Text fontWeight="600" fontSize="$3" color="$color12">{receipt.id || "-"}</T.Text>
        </T.XStack>
        <T.XStack justifyContent="space-between" alignItems="center">
          <T.Text color="$color10" fontSize="$3">{"Amount Paid"}</T.Text>
          <T.Text fontWeight="600" fontSize="$3" color="$color12">{"$" + (amount / 100).toFixed(2)}</T.Text>
        </T.XStack>
        <T.XStack justifyContent="space-between" alignItems="center">
          <T.Text color="$color10" fontSize="$3">{"Date Paid"}</T.Text>
          <T.Text fontWeight="600" fontSize="$3" color="$color12">{datePaid}</T.Text>
        </T.XStack>
        <T.XStack justifyContent="space-between" alignItems="center">
          <T.Text color="$color10" fontSize="$3">{"Payment Method"}</T.Text>
          <T.Text fontWeight="600" fontSize="$3" color="$color12">
            {"Card (" + (receipt.currency || "usd").toUpperCase() + ")"}
          </T.Text>
        </T.XStack>
      </T.YStack>
      <ui.ButtonNormal
        width="100%"
        size="$5"
        onPress={onContinue}
        backgroundColor="$purple9"
        hoverStyle={{"backgroundColor":"$purple10"}}
        color="white">{"Continue"}
      </ui.ButtonNormal>
    </T.YStack>);
}

// sznui.lib.component.manage.organisation-manage-billing/PaymentErrorView [110] 
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
        <T.H4 textAlign="center" color="$red10">{"Payment Failed"}</T.H4>
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
        color="$color12">{"Back"}
      </ui.ButtonNormal>
    </T.YStack>);
}

// sznui.lib.component.manage.organisation-manage-billing/PlanActiveView [128] 
export function PlanActiveView({onContinue,plan}){
  return (
    <T.YStack
      alignSelf="center"
      maxWidth={480}
      borderRadius="$6"
      borderColor="$purple8"
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
        <Check size={64} color="$purple10"/>
        <T.Paragraph textAlign="center" color="$color11">
          {"Your organisation is already subscribed to the Pro plan."}
        </T.Paragraph>
      </T.YStack>
      <ui.ButtonNormal
        width="100%"
        size="$5"
        onPress={onContinue}
        backgroundColor="$purple9"
        hoverStyle={{"backgroundColor":"$purple10"}}
        color="white">{"Continue"}
      </ui.ButtonNormal>
    </T.YStack>);
}

// sznui.lib.component.manage.organisation-manage-billing/billingPlans [144] 
export var billingPlans = [
  {
  "id":"starter",
  "title":"Free",
  "price":"$0",
  "period":"/mo",
  "description":"For individuals and hobbyists",
  "icon":Circle,
  "features":[
    "1 active campaign",
    "Up to 100 participants",
    "Community support"
  ]
},
  {
  "id":"professional",
  "title":"Pro",
  "price":"$20",
  "period":"/mo",
  "description":"For growing marketing teams",
  "icon":TrendingUp,
  "featured":true,
  "features":[
    "5 active campaigns",
    "Unlimited participants",
    "20 markets per campaign",
    "Full branding & white-label",
    "Advanced analytics",
    "Priority support"
  ]
}
];

// sznui.lib.component.manage.organisation-manage-billing/BillingCard [161] 
export function BillingCard({plan,selected,onSelect,onProceed,isBusy}){
  let IconComponent = plan.icon;
  let [expanded,setExpanded] = React.useState(false);
  let isFeatured = plan.featured;
  let accentColor = isFeatured ? "$purple10" : "$color10";
  let buttonColor = "$purple10";
  return (
    <T.YStack
      onPress={function (){
          onSelect(plan.id);
        }}
      maxWidth={400}
      borderRadius="$4"
      borderColor={(selected == plan.id) ? "$purple10" : "$borderColor"}
      shadowRadius={isFeatured ? 8 : 0}
      width="100%"
      shadowOpacity={isFeatured ? 0.1 : 0}
      cursor="pointer"
      hoverStyle={{
          "borderColor":(selected == plan.id) ? "$purple11" : "$color8"
        }}
      borderWidth={(selected == plan.id) ? 2 : 1}
      shadowColor={isFeatured ? "$shadow6" : "transparent"}
      padding="$4"
      position="relative"
      backgroundColor="$color1"
      shadowOffset={isFeatured ? {"width":0} : {"width":0}}>
      <T.YStack marginBottom="$3" width="100%">
        <T.XStack alignItems="center" marginBottom="$2" gap="$3">
          <IconComponent height={24} width={24} color="$color12"/>
          <T.H4 fontSize="$5" flex={1} color="$color12">{plan.title}</T.H4>
        </T.XStack>
        <T.Text fontSize="$3" color="$color11" lineHeight="$1">{plan.description}</T.Text>
      </T.YStack>
      <T.XStack marginBottom="$4" alignItems="baseline" gap="$2">
        <T.Text fontSize={32} fontWeight="bold">{plan.price}</T.Text>
        <T.Text fontSize="$3" color="$color11">{plan.period}</T.Text>
        <T.Tooltip placement="top">
          <T.Tooltip.Trigger>
            <T.XStack
              cursor="pointer"
              padding="$2"
              opacity={0.5}
              hoverStyle={{"opacity":1}}><Info size={14} color="$color11"/>
            </T.XStack>
          </T.Tooltip.Trigger>
          <T.Tooltip.Content
            backgroundColor="$color2"
            padding="$4"
            borderRadius="$4"
            borderWidth={1}
            borderColor="$borderColor"
            enterStyle={{"opacity":0,"scale":0.9}}
            exitStyle={{"opacity":0,"scale":0.9}}
            animation="quick">
            <T.Tooltip.Arrow borderBottomColor="$color2"/>
            <T.YStack gap="$2" maxWidth={250}>
              {plan.features.map(function (feature,i){
                return (
                  <T.XStack key={i} gap="$2" alignItems="flex-start">
                    <Check size={16} color="$green8" flexShrink={0}/>
                    <T.Text fontSize="$2" color="$color12">{feature}</T.Text>
                  </T.XStack>);
              })}
            </T.YStack>
          </T.Tooltip.Content>
        </T.Tooltip>
      </T.XStack>
      <T.YStack
        borderTopWidth={1}
        borderColor="$borderColor"
        paddingTop="$3"
        gap="$2"
        flex={1}>{null}
      </T.YStack>
      <ui.ButtonNormal
        color={(selected == plan.id) ? "white" : "$color11"}
        onPress={function (){
            if(selected == plan.id){
              onProceed(plan.id);
            }
            else{
              onSelect(plan.id);
            }
          }}
        disabled={isBusy}
        borderColor={(selected == plan.id) ? "$purple10" : "$borderColor"}
        width="100%"
        marginTop="auto"
        icon={(isBusy && (selected == plan.id)) ? (function (){
            return (
              <T.Spinner/>);
          }) : null}
        hoverStyle={{
            "backgroundColor":(selected == plan.id) ? "$purple11" : "$color2",
            "borderColor":(selected == plan.id) ? "$purple11" : "$color8"
          }}
        borderWidth={1}
        size="$4"
        theme={(selected == plan.id) ? "active" : "alt1"}
        backgroundColor={(selected == plan.id) ? "$purple10" : "transparent"}>{"Select Plan"}
      </ui.ButtonNormal>
    </T.YStack>);
}

// sznui.lib.component.manage.organisation-manage-billing/PlanSelection [243] 
export function PlanSelection({isBusy,message,onProceed,onSelect,plans,selected}){
  return (
    <T.YStack
      gap="$4"
      width="100%"
      alignItems="center"
      justifyContent="center"
      alignSelf="center"
      $sm={{
          "flexDirection":"row",
          "flexWrap":"wrap",
          "justifyContent":"center"
        }}>
      {plans.map(function (plan){
        return (
          <BillingCard
            key={plan.id}
            plan={plan}
            selected={selected}
            isBusy={isBusy}
            onSelect={onSelect}
            onProceed={onProceed}/>);
      })}
      {message ? (
        <T.Text color="$red10" textAlign="center" marginTop="$2">{message}</T.Text>) : null}
    </T.YStack>);
}

// sznui.lib.component.manage.organisation-manage-billing/BillingScreen [268] 
export function BillingScreen({api,onFinish,org}){
  let [billingPlan,setBillingPlan] = React.useState("starter");
  let existingOrg = org;
  let hasProPlan = existingOrg && ((existingOrg.tier == "pro") || (existingOrg.tier == "standard") || (existingOrg.tier == "enterprise"));
  let isBusy = api.mutations.stripe_checkout.isPending || api.mutations.stripe_status.isPending;
  let [clientSecret,setClientSecret] = React.useState(null);
  let [message,setMessage] = React.useState(null);
  let [orgId,setOrgId] = React.useState(existingOrg && existingOrg.id);
  let [successData,setSuccessData] = React.useState(null);
  let [paymentError,setPaymentError] = React.useState(null);
  let orgsQuery = api.queries.user_list_owner_organisations;
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
      if(onFinish){
        onFinish();
      }
    }
  };
  return (
    <ui_section.MinFrameCenter maxWidth={600}>
      <ui_section.MinHeader
        logo={(existingOrg && existingOrg.name) ? (
            <T.Text
              textTransform="uppercase"
              fontSize="$1"
              fontWeight="600"
              letterSpacing={2}
              color="$color11">{existingOrg.name}
            </T.Text>) : null}
        title={successData ? "Payment Successful" : (hasProPlan ? "Currently Subscribed" : (clientSecret ? "Complete Payment" : "Choose a Plan"))}
        paragraph={successData ? "Thank you for your purchase." : (hasProPlan ? null : (paymentError ? "Something went wrong." : (clientSecret ? "Securely enter your payment details below." : "Scalable pricing for every stage.")))}/>
      {successData ? (
        <PaymentSuccessView
          data={successData}
          org={existingOrg}
          onContinue={function (){
              if(onFinish){
                onFinish();
              }
            }}/>) : null}
      {hasProPlan ? (
        <PlanActiveView
          plan="professional"
          onContinue={function (){
              if(onFinish){
                onFinish();
              }
            }}/>) : null}
      {paymentError ? (
        <PaymentErrorView
          error={paymentError}
          onBack={function (){
              setPaymentError(null);
              setClientSecret(null);
            }}/>) : null}
      {clientSecret ? (
        <Elements
          stripe={stripePromise}
          options={{"clientSecret":clientSecret,"appearance":{"theme":"stripe"}}}>
          <PaymentForm
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
        <PlanSelection
          plans={billingPlans}
          selected={billingPlan}
          onSelect={setBillingPlan}
          onProceed={handleSelect}
          isBusy={isBusy}
          message={message}/>))}
    </ui_section.MinFrameCenter>);
}