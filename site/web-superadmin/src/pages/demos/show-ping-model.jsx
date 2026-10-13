'use client'

import * as T from 'tamagui'

import * as layout_base from '@statstrade/component/layout/layout-base.jsx'

// statstrade-superadmin.pages.demos.show-ping-model/Page [16] 
function Page(){
  return (
    <layout_base.LayoutBase showDevtool={true}>
      <T.YStack gap="$3" padding="$4">
        <T.Text fontSize="$5" fontWeight="600">This page model demo has moved.</T.Text>
        <T.Anchor href="/demos/show-ping">Open RPC ping demo</T.Anchor>
      </T.YStack>
    </layout_base.LayoutBase>);
}

export default Page