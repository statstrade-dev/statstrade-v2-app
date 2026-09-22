import {BarChart} from '@tamagui/lucide-icons'

import * as T from 'tamagui'

import React from 'react'

import * as context_manage from '@statstrade/component/layout/manage/context-manage.jsx'

// statstrade-web.feature.manage.analytics/AnalyticsScreen [13] 
export function AnalyticsScreen(){
  let context = React.useContext(context_manage.LayoutManageContext);
  let {api} = context;
  return (
    <T.YStack padding="$5" flex={1}>
      <T.XStack alignItems="center" gap="$3" marginBottom="$6">
        <T.View backgroundColor="$purple3" padding="$2" borderRadius="$3"><BarChart size={20} color="$purple10"/></T.View>
        <T.H2 fontSize="$8" color="$color12">Analytics</T.H2>
      </T.XStack>
      <T.Text color="$color11">View your analytics here.</T.Text>
    </T.YStack>);
}