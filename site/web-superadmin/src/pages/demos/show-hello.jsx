'use client'

import * as T from 'tamagui'

import * as layout_base from '@statstrade/component/layout/layout-base.jsx'

// statstrade-superadmin.pages.demos.show-hello/Page [23] 
function Page(){
  return (
    <layout_base.LayoutBase showDevtool={true} showDevWebsocket={true}><T.Text>Hello World</T.Text></layout_base.LayoutBase>);
}

export default Page