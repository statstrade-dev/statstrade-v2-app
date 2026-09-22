import {ArrowLeft,CreditCard,Lock} from '@tamagui/lucide-icons'

import * as T from 'tamagui'

import React from 'react'

import * as ui_form from '@statstrade/component/ui-form.jsx'

import * as context_manage from '@statstrade/component/layout/manage/context-manage.jsx'

import * as common from '@statstrade/feature/manage/billing/billing-common.jsx'

// statstrade-web.feature.manage.billing.billing-create/PaymentForm [16] 
export function PaymentForm({onCancel,onFinish}){
  let ctx = React.useContext(common.BillingContext);
  let {api,forms} = ctx;
  let form = forms.billing_new;
  let {control,handleSubmit} = form;
  return (
    <T.XStack flex={1} gap="$6" padding="$6" backgroundColor="$color1">
      <T.YStack flex={1} gap="$6" maxWidth={600} marginHorizontal="auto">
        {context_manage.useTopBar((
          <T.XStack alignItems="center" gap="$4">
            <T.Button
              chromeless={true}
              size="$3"
              circular={true}
              icon={ArrowLeft}
              onPress={onCancel}/>
            <T.Text fontSize="$5" fontWeight="600" color="$color12">Add Payment Method</T.Text>
          </T.XStack>),[])}
        <T.Card
          bordered={true}
          padding="$5"
          gap="$5"
          backgroundColor="$color2">
          <T.XStack gap="$3" alignItems="center" marginBottom="$2">
            <CreditCard size={20} color="$color11"/>
            <T.H4 color="$color12" fontSize="$4" fontWeight="600">Card Details</T.H4>
          </T.XStack>
          <ui_form.FormInput
            control={control}
            field="cardName"
            title="Cardholder Name"
            placeholder="Name on card"/>
          <ui_form.FormInput
            control={control}
            field="cardNumber"
            title="Card Number"
            placeholder="0000 0000 0000 0000"/>
          <T.XStack gap="$4">
            <ui_form.FormInput
              control={control}
              field="expiry"
              title="Expiry"
              placeholder="MM/YY"
              viewProps={{"flex":1}}/>
            <ui_form.FormInput
              control={control}
              field="cvc"
              title="CVC"
              placeholder="123"
              viewProps={{"flex":1}}/>
          </T.XStack>
          <T.XStack
            gap="$2"
            alignItems="center"
            marginTop="$2"
            justifyContent="center">
            <Lock size={12} color="$green9"/>
            <T.Text fontSize={11} color="$green9">Your payments are processed securely by Stripe.</T.Text>
          </T.XStack>
          <T.YStack gap="$3" marginTop="$4">
            <T.Button
              theme="blue"
              size="$4"
              onPress={handleSubmit(function (data){
                  if(onFinish){
                    onFinish(data);
                  }
                })}>Add Card
            </T.Button>
            <T.Button
              chromeless={true}
              color="$color11"
              onPress={function (){
                  if(onCancel){
                    onCancel();
                  }
                }}>Cancel
            </T.Button>
          </T.YStack>
        </T.Card>
      </T.YStack>
    </T.XStack>);
}