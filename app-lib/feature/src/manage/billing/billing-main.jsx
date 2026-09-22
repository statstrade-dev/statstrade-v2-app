import {Check,CreditCard,Download,FileText,Plus} from '@tamagui/lucide-icons'

import * as T from 'tamagui'

import React from 'react'

import * as ui_manage from '@statstrade/component/ui-manage.jsx'

import * as context_manage from '@statstrade/component/layout/manage/context-manage.jsx'

import * as common from '@statstrade/feature/manage/billing/billing-common.jsx'

// statstrade-web.feature.manage.billing.billing-main/InvoiceRow [16] 
export function InvoiceRow({item}){
  return (
    <T.XStack
      padding="$4"
      backgroundColor="$color2"
      borderRadius="$3"
      marginBottom="$2"
      justifyContent="space-between"
      alignItems="center">
      <T.XStack gap="$4" alignItems="center">
        <T.View
          width={40}
          height={40}
          borderRadius="$2"
          backgroundColor="$color4"
          alignItems="center"
          justifyContent="center"><FileText size={20} color="$color11"/>
        </T.View>
        <T.YStack>
          <T.Text fontSize="$3" color="$color12" fontWeight="600">{item.description}</T.Text>
          <T.Text fontSize={11} color="$color11">{item.date}</T.Text>
        </T.YStack>
      </T.XStack>
      <T.XStack gap="$4" alignItems="center">
        <T.Text fontSize="$3" color="$color12" fontWeight="600">{item.amount}</T.Text>
        <T.Button size="$2" chromeless={true} icon={Download} color="$color10"/>
      </T.XStack>
    </T.XStack>);
}

// statstrade-web.feature.manage.billing.billing-main/PaymentMethodCard [31] 
export function PaymentMethodCard({item}){
  return (
    <T.XStack
      padding="$4"
      backgroundColor="$color2"
      borderRadius="$3"
      marginBottom="$2"
      justifyContent="space-between"
      alignItems="center"
      borderWidth={1}
      borderColor={item.isDefault ? "$green9" : "transparent"}>
      <T.XStack gap="$4" alignItems="center">
        <T.View
          width={40}
          height={40}
          borderRadius="$2"
          backgroundColor="$blue9"
          alignItems="center"
          justifyContent="center"><CreditCard size={20} color="white"/>
        </T.View>
        <T.YStack>
          <T.XStack gap="$2" alignItems="center">
            <T.Text fontSize="$3" color="$color12" fontWeight="600">{item.last4}</T.Text>
            {item.isDefault ? (
              <T.View
                paddingHorizontal={6}
                paddingVertical={2}
                backgroundColor="$green4"
                borderRadius={4}>
                <T.Text fontSize={10} color="$green10" fontWeight="700">DEFAULT</T.Text>
              </T.View>) : null}
          </T.XStack>
          <T.Text fontSize={11} color="$color11">{"Expires " + item.expiry}</T.Text>
        </T.YStack>
      </T.XStack>
      <T.Button size="$3" chromeless={true} color="$color11">Edit</T.Button>
    </T.XStack>);
}

// statstrade-web.feature.manage.billing.billing-main/BillingList [49] 
export function BillingList(){
  let context = React.useContext(common.BillingContext);
  let {api,controls} = context;
  let {setView} = controls;
  context_manage.useTopBar((
    <ui_manage.ManagerScreenHeader title="Billing & Invoices"/>),[]);
  let invoices = [
    {
      "id":1,
      "description":"Pro Plan - Oct 2025",
      "date":"Oct 1, 2025",
      "amount":"$29.00"
    },
    {
      "id":2,
      "description":"Pro Plan - Sep 2025",
      "date":"Sep 1, 2025",
      "amount":"$29.00"
    },
    {
      "id":3,
      "description":"Pro Plan - Aug 2025",
      "date":"Aug 1, 2025",
      "amount":"$29.00"
    }
  ];
  let cards = [
    {"id":1,"last4":"**** 4242","expiry":"12/28","isDefault":true}
  ];
  return (
    <T.ScrollView
      contentContainerStyle={{
          "padding":"$6",
          "paddingBottom":"$10",
          "maxWidth":800,
          "marginHorizontal":"auto",
          "width":"100%"
        }}>
      <T.YStack gap="$8">
        <T.YStack gap="$4">
          <T.H4 fontSize="$5" color="$color12" fontWeight="600">Current Plan</T.H4>
          <T.Card
            padding="$5"
            bordered={true}
            backgroundColor="$blue2"
            borderColor="$blue6">
            <T.XStack justifyContent="space-between" alignItems="center">
              <T.YStack gap="$2">
                <T.H3 fontSize="$6" color="$blue11" fontWeight="800">Pro Plan</T.H3>
                <T.Text fontSize="$3" color="$blue11">You are on the Pro tier. Next billing date: Nov 1, 2025.</T.Text>
              </T.YStack>
              <T.Button theme="blue" size="$3">Manage Plan</T.Button>
            </T.XStack>
          </T.Card>
        </T.YStack>
        <T.YStack gap="$4">
          <T.XStack justifyContent="space-between" alignItems="center">
            <T.H4 fontSize="$5" color="$color12" fontWeight="600">Payment Methods</T.H4>
            <T.Button
              size="$3"
              chromeless={true}
              icon={Plus}
              color="$blue10"
              onPress={function (){
                  setView("create");
                }}>Add Method
            </T.Button>
          </T.XStack>
          {cards.map(function (item){
            (
              <PaymentMethodCard key={item.id} item={item}/>);
          })}
        </T.YStack>
        <T.YStack gap="$4">
          <T.H4 fontSize="$5" color="$color12" fontWeight="600">Invoice History</T.H4>
          {invoices.map(function (item){
            (
              <InvoiceRow key={item.id} item={item}/>);
          })}
        </T.YStack>
      </T.YStack>
    </T.ScrollView>);
}