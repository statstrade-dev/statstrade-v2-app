import {loadStripe} from '@stripe/stripe-js'

import {Elements,PaymentElement,useElements,useStripe} from '@stripe/react-stripe-js'

import {X} from '@tamagui/lucide-icons'

import React from 'react'

import * as T from 'tamagui'

import * as element_organisation from '@statstrade/component/element/element-organisation.jsx'

import * as kd from '@xtalk/lang/common-data.js'

import * as element_billing from '@statstrade/component/element/element-billing.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

import * as context_manage from '@statstrade/component/layout/manage/context-manage.jsx'

// statsui.basic.layout.manage.frame-manage-organisation/stripePromise [25] 
export var stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) : console.error("Stripe Publishable Key is missing.");

// statsui.basic.layout.manage.frame-manage-organisation/uploadImage [30] 
export async function uploadImage({image,filePath,api,bucket}){
  let response = await fetch(image.uri);
  let blob = await response.blob();
  let {data,error} = await api.mutations.upload_image.mutateAsync({"file_raw":blob,"file_path":filePath,"bucket":bucket});
  if(error){
    throw error;
  }
  else{
    return data;
  }
}

// statsui.basic.layout.manage.frame-manage-organisation/DashboardOrgSetup [42] 
export function DashboardOrgSetup({onClose,onSuccess}){
  let ctx = React.useContext(context_manage.LayoutManageContext);
  let {api,controls,forms} = ctx;
  let user = kd.get_in(api,["queries","get_user","output"]) || {};
  let toggleTag = function (id){
    let next = new Set(controls.setupOrgTags);
    if(next.has(id)){
      next.delete(id);
    }
    else{
      next.add(id);
    }
    controls.setSetupOrgTags(next);
  };
  let nameValue = forms.organisation_create;
  ui.useRemoteCheck({
    "form":forms.organisation_create,
    "field":"name",
    "value":nameValue,
    "check_fn":function (v){
        return api.queries.check_organisation_exists.queryRaw({"name":v}).then(function (res){
          return res.data;
        });
      },
    "message":"Organisation name is taken"
  });
  let handle_create_submit = async function (){
    controls.setSetupIsBusy(true);
    let formValues = forms.organisation_create.getValues();
    let finalValues = kd.obj_assign(formValues,{"tags":Array.from(controls.setupOrgTags)});
    try{
      if(controls.setupOrgImage){
        let filePath = user.id + "/organisations/" + Date.now();
        let data = await uploadImage({
          "image":controls.setupOrgImage,
          "filePath":filePath,
          "api":api,
          "bucket":"images"
        });
        finalValues = kd.obj_assign(finalValues,{"picture_url":data})
      }
      api.mutations.organisation_create.mutateAsync(finalValues).then(function ({data,error}){
        controls.setSetupIsBusy(false);
        if(!error){
          console.log("Org Created",data);
          controls.setSetupOrgData(data);
          controls.setSetupStep(2);
        }
      });
    }
    catch(e){
      console.error("Error creating organisation",e);
      controls.setSetupIsBusy(false);
    }
  };
  let handle_billing_proceed = async function (planId){
    controls.setSetupPaymentMessage(null);
    if(planId == "professional"){
      try{
        let response = await api.mutations.stripe_checkout.mutateAsync({"orgId":controls.setupOrgData.id,"planId":planId});
        if(response.clientSecret){
          controls.setSetupClientSecret(response.clientSecret);
        }
        else{
          controls.setSetupPaymentMessage("Failed to initialize checkout.");
        }
      }
      catch(e){
        controls.setSetupPaymentMessage("An error occurred.");
      }
    }
    else{
      if(onSuccess){
        onSuccess();
      }
      onClose();
    }
  };
  let handle_payment_success = function (paymentIntent){
    api.mutations.stripe_status.mutateAsync(paymentIntent).then(function (res){
      controls.setSetupPaymentSuccess(res);
      controls.setSetupClientSecret(null);
      setTimeout(function (){
        new Promise(function (){
          if(onSuccess){
            onSuccess();
          }
          onClose();
        });
      },2000);
      null;
    });
  };
  let render_content = function (){
    if(controls.setupStep == 1){
      return (
        <element_organisation.OrganisationForm
          form={forms.organisation_create}
          onSubmit={handle_create_submit}
          onImageSelected={controls.setSetupOrgImage}
          isBusy={controls.setupIsBusy}
          tags={controls.setupOrgTags}
          toggleTag={toggleTag}
          onCancel={onClose}/>);
    }
    else if((controls.setupStep == 2) && controls.setupPaymentSuccess){
      return (
        <T.YStack gap="$4">
          <element_billing.PaymentSuccessView
            data={controls.setupPaymentSuccess}
            org={controls.setupOrgData}
            onContinue={function (){
                if(onSuccess){
                  onSuccess();
                }
                onClose();
              }}/>
        </T.YStack>);
    }
    else if((controls.setupStep == 2) && controls.setupClientSecret){
      return (
        <T.YStack gap="$4">
          <T.Text fontSize="$3" color="$color11">Select a billing plan for your organisation.</T.Text>
          <Elements
            stripe={stripePromise}
            options={{
                "clientSecret":controls.setupClientSecret,
                "appearance":{"theme":"stripe"}
              }}>
            <element_billing.PaymentForm
              onCancel={function (){
                  controls.setSetupClientSecret(null);
                }}
              onSuccess={handle_payment_success}/>
          </Elements>
        </T.YStack>);
    }
    else if(controls.setupStep == 2){
      return (
        <T.YStack gap="$4">
          <T.Text fontSize="$3" color="$color11">Select a billing plan for your organisation.</T.Text>
          <element_billing.PlanSelection
            plans={element_billing.billingPlans}
            selected={controls.setupBillingPlan}
            onSelect={controls.setSetupBillingPlan}
            onProceed={handle_billing_proceed}
            isBusy={controls.setupIsBusy}
            message={controls.setupPaymentMessage}/>
        </T.YStack>);
    }
    else{
      return null;
    }
  };
  let title = (controls.setupStep == 1) ? "Create Organisation" : ((controls.setupStep == 2) ? "Select Plan" : "");
  return (
    <T.YStack
      flex={1}
      padding="$6"
      $sm={{"padding":"$4"}}
      backgroundColor="$color1"
      animation="quick"
      enterStyle={{"opacity":0,"scale":0.98}}
      exitStyle={{"opacity":0,"scale":0.98}}>
      <T.XStack
        justifyContent="space-between"
        alignItems="center"
        marginBottom="$4">
        <T.Text
          tag="h3"
          fontSize="$8"
          fontWeight="700"
          color="$color12"
          letterSpacing={0.5}>{title}
        </T.Text>
        <T.Button
          size="$3"
          circular={true}
          chromeless={true}
          icon={X}
          onPress={onClose}/>
      </T.XStack>
      <T.ScrollView showsVerticalScrollIndicator={false}>{render_content()}</T.ScrollView>
    </T.YStack>);
}