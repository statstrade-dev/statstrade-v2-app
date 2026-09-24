import {ArrowLeft} from '@tamagui/lucide-icons'

import React from 'react'

import * as T from 'tamagui'

import * as common from '@statstrade/feature/manage/campaigns/campaigns-common.jsx'

// statstrade-web.feature.manage.campaigns.campaigns-detail/CampaignDetail [13] 
export function CampaignDetail({onBack}){
  let ctx = React.useContext(common.CampaignsContext);
  let {selectedId,setView,view} = ctx.controls;
  return (
    <T.YStack padding="$6" backgroundColor="$color1" flex={1} gap="$4">
      <T.Button onPress={onBack} icon={ArrowLeft} chromeless={true}>Back to Campaigns</T.Button>
      <T.H2>Campaign Detail</T.H2>
      <T.Text>{str("Viewing Campaign ID: ",selectedId)}</T.Text>
    </T.YStack>);
}