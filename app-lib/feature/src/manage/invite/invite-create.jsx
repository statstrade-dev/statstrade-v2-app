import {ArrowLeft,Check,ChevronDown,ChevronUp} from '@tamagui/lucide-icons'

import * as T from 'tamagui'

import React from 'react'

import * as common from '@statstrade/feature/manage/invite/invite-common'

import * as context_manage from '@statstrade/component/layout/manage/context-manage'

import * as hf from '@statstrade/edge/lib/js/lib/react-hook-form'

import * as k from '@statstrade/edge/lib/xt/lang/base-lib'

import * as ui_form from '@statstrade/component/ui-form'

// sznui.lib.feature.manage.invites.invites-create/FormSelect [16] 
export function FormSelect({control,field,items,label}){
  return (
    <hf.FormController
      name={field}
      control={control}
      render={function ({field}){
          return (
            <T.YStack gap="$2" marginBottom="$4">
              <T.Text fontSize="$3" fontWeight="600" marginLeft={4}>{label}</T.Text>
              <T.Select value={field.value} onValueChange={field.onChange}>
                <T.Select.Trigger iconAfter={ChevronDown}><T.Select.Value placeholder="Select..."/></T.Select.Trigger>
                <T.Adapt when="sm" platform="touch">
                  <T.Sheet modal={true} dismissOnSnapToBottom={true}>
                    <T.Sheet.Frame padding="$4"><T.Adapt.Contents/></T.Sheet.Frame>
                  </T.Sheet>
                </T.Adapt>
                <T.Select.Content zIndex={200000}>
                  <T.Select.ScrollUpButton><ChevronUp size={20}/></T.Select.ScrollUpButton>
                  <T.Select.Viewport>
                    {items.map(function (item,i){
                      return (
                        <T.Select.Item index={i} key={item.value} value={item.value}>
                          <T.Select.ItemText>{item.label}</T.Select.ItemText>
                          <T.Select.ItemIndicator marginLeft="auto"><Check size={16}/></T.Select.ItemIndicator>
                        </T.Select.Item>);
                    })}
                  </T.Select.Viewport>
                  <T.Select.ScrollDownButton><ChevronDown size={20}/></T.Select.ScrollDownButton>
                </T.Select.Content>
              </T.Select>
            </T.YStack>);
        }}/>);
}

// sznui.lib.feature.manage.invites.invites-create/InviteCreate [53] 
export function InviteCreate(){
  let ctx = React.useContext(common.InviteContext);
  let {api,controls,forms} = ctx;
  let {orgId,setView} = controls;
  let form = forms.invite_create;
  let {control,handleSubmit,setValue,watch} = form;
  let channel = watch("channel");
  let createInvite = k.get_in(api,["mutations","create_invite"]);
  console.log(api);
  let onSubmit = function (data){
    createInvite.mutateAsync({
      "org_id":orgId,
      "campaign_id":data.campaign || null,
      "channel":data.channel,
      "detail":{}
    });
    setView("list");
  };
  context_manage.useTopBar((
    <T.XStack alignItems="center" gap="$4">
      <T.Button
        chromeless={true}
        size="$3"
        circular={true}
        icon={ArrowLeft}
        onPress={function (){
            setView("list");
          }}/>
      <T.Text fontSize="$5" fontWeight="600" color="$color12">{"Create New Invite"}</T.Text>
    </T.XStack>),[]);
  return (
    <T.XStack flex={1} gap="$6" padding="$6" backgroundColor="$color1">
      <T.YStack flex={1} gap="$6" maxWidth={600}>
        <T.Card
          bordered={true}
          padding="$5"
          gap="$5"
          backgroundColor="$color2">
          <T.H4 color="$color12" fontSize="$4" fontWeight="600">{"Invite Details"}</T.H4>
          <FormSelect
            control={control}
            field="channel"
            label="Channel"
            items={[
                {"label":"Generic Link","value":"generic"},
                {"label":"Email","value":"email"}
              ]}/>
          {(channel == "email") ? (
            <ui_form.FormInput
              control={control}
              field="emails"
              title="Email Addresses"
              placeholder="alice@example.com, bob@example.com"
              component={T.TextArea}
              numberOfLines={3}/>) : null}
          <T.Button theme="blue" size="$4" onPress={handleSubmit(onSubmit)}>{"Create Invite"}</T.Button>
          <T.Button
            chromeless={true}
            color="$color11"
            onPress={function (){
                setView("list");
              }}>{"Cancel"}
          </T.Button>
        </T.Card>
      </T.YStack>
    </T.XStack>);
}
