import {Elements,PaymentElement,useElements,useStripe} from '@stripe/react-stripe-js'

import {Check,Circle,Info,TrendingUp} from '@tamagui/lucide-icons'

import * as T from 'tamagui'

import React from 'react'

import * as ui from '@statstrade/component/ui-common.jsx'

// statsui.basic.element.element-billing/PaymentForm [13] 
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
    let result = null;
    try{
      result = await stripe.confirmPayment({
        "elements":elements,
        "redirect":"if_required",
        "confirmParams":{
                "return_url":(process.env.NEXT_PUBLIC_SITE_URL || window.location.origin) + "/?step=5"
              }
      });
    }
    catch(e){
      console.error("Stripe confirmPayment error",e);
      result = {"error":{"message":"Payment failed due to network error."}};
    }
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

// statsui.basic.element.element-billing/PaymentSuccessView [68] 
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
        backgroundColor="#000"
        hoverStyle={{"backgroundColor":"#333"}}
        color="white">Continue
      </ui.ButtonNormal>
    </T.YStack>);
}

// statsui.basic.element.element-billing/PaymentErrorView [106] 
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

// statsui.basic.element.element-billing/PlanActiveView [125] 
export function PlanActiveView({onContinue,plan}){
  return (
    <T.YStack
      alignSelf="center"
      maxWidth={480}
      borderRadius="$6"
      borderColor="#000"
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
        <Check size={64} color="#000"/>
        <T.Paragraph textAlign="center" color="$color11">Your organisation is already subscribed to the Pro plan.</T.Paragraph>
      </T.YStack>
      <ui.ButtonNormal
        width="100%"
        size="$5"
        onPress={onContinue}
        backgroundColor="#000"
        hoverStyle={{"backgroundColor":"#333"}}
        color="white">Continue
      </ui.ButtonNormal>
    </T.YStack>);
}

// statsui.basic.element.element-billing/billingPlans [142] 
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

// statsui.basic.element.element-billing/BillingCard [159] 
export function BillingCard({plan,selected,onSelect,onProceed,isBusy}){
  let IconComponent = plan.icon;
  let [expanded,setExpanded] = React.useState(false);
  let isFeatured = plan.featured;
  let accentColor = isFeatured ? "#000" : "$color10";
  return (
    <T.YStack
      onPress={function (){
          onSelect(plan.id);
        }}
      maxWidth={400}
      borderRadius="$4"
      borderColor={(selected == plan.id) ? "#000" : "$borderColor"}
      shadowRadius={isFeatured ? 8 : 0}
      width="100%"
      shadowOpacity={isFeatured ? 0.1 : 0}
      cursor="pointer"
      hoverStyle={{"borderColor":(selected == plan.id) ? "#000" : "$color8"}}
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
        borderColor={(selected == plan.id) ? "#000" : "$borderColor"}
        width="100%"
        marginTop="auto"
        icon={(isBusy && (selected == plan.id)) ? (function (){
            return (
              <T.Spinner/>);
          }) : null}
        hoverStyle={{
            "backgroundColor":(selected == plan.id) ? "#333" : "$color2",
            "borderColor":(selected == plan.id) ? "#333" : "$color8"
          }}
        borderWidth={1}
        size="$4"
        theme={(selected == plan.id) ? "active" : "alt1"}
        backgroundColor={(selected == plan.id) ? "#000" : "transparent"}>Select Plan
      </ui.ButtonNormal>
    </T.YStack>);
}

// statsui.basic.element.element-billing/PlanSelection [241] 
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