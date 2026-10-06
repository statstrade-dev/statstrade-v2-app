'use client'

import * as T from 'tamagui'

import * as worker from '@statstrade/web-superadmin/worker.jsx'

import * as layout_base from '@statstrade/component/layout/layout-base.jsx'

// statstrade-superadmin.pages.index/Page [18] 
function Page(){
  let {readyState,resource} = worker.useSharedWorkerNode({});
  return (
    <layout_base.LayoutBase showDevWebsocket={true} showDevtool={true}><T.View><T.Text>{readyState}</T.Text></T.View></layout_base.LayoutBase>);
}

export default Page