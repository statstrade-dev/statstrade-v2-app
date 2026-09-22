import {Building,Globe,User} from '@tamagui/lucide-icons'

import * as T from 'tamagui'

import React from 'react'

import * as common from '@statstrade/feature/manage/settings/settings-common.jsx'

import * as ui_form from '@statstrade/component/ui-form.jsx'

// statstrade-web.feature.manage.settings.settings-general/SettingsGeneral [15] 
export function SettingsGeneral(){
  let ctx = React.useContext(common.SettingsContext);
  let {forms} = ctx;
  let form = forms.settings_profile;
  let {control} = form;
  return (
    <T.YStack gap="$8">
      <T.YStack gap="$4">
        <T.H4 fontSize="$5" color="$color12" fontWeight="600">General Information</T.H4>
        <T.Card
          padding="$5"
          backgroundColor="$color2"
          gap="$4"
          borderWidth={0}>
          <ui_form.FormInput
            control={control}
            field="orgName"
            title="Organization Name"
            icon={Building}/>
          <ui_form.FormInput
            control={control}
            field="email"
            title="Contact Email"
            icon={User}/>
          <ui_form.FormInput control={control} field="website" title="Website" icon={Globe}/>
          <T.XStack justifyContent="flex-end" marginTop="$2"><T.Button theme="blue" size="$3">Save Changes</T.Button></T.XStack>
        </T.Card>
      </T.YStack>
      <T.YStack gap="$4">
        <T.H4 fontSize="$5" color="$red10" fontWeight="600">Danger Zone</T.H4>
        <T.Card padding="$5" backgroundColor="$red2" borderWidth={0}>
          <T.XStack justifyContent="space-between" alignItems="center">
            <T.YStack flex={1} paddingRight="$4">
              <T.Text fontSize="$3" color="$red11" fontWeight="600">Delete Organization</T.Text>
              <T.Text fontSize={11} color="$red11">This action cannot be undone. All data will be lost.</T.Text>
            </T.YStack>
            <T.Button theme="red" size="$3">Delete</T.Button>
          </T.XStack>
        </T.Card>
      </T.YStack>
    </T.YStack>);
}