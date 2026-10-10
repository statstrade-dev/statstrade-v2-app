'use client'

import * as T from 'tamagui'

import * as substrate from '@statstrade/web-superadmin/lib/substrate-worker.jsx'

import * as layout_base from '@statstrade/component/layout/layout-base.jsx'

// statstrade-superadmin.pages.index/Page [20] 
function Page(){
  let {readyState} = substrate.useSubstrateNode({});
  return (
    <layout_base.LayoutBase showDevWebsocket={true} showDevtool={true}><T.View><T.Text>{readyState}</T.Text></T.View></layout_base.LayoutBase>);
}

export default Page