'use client'

import * as T from 'tamagui'

import * as substrate from '@statstrade/web-superadmin/lib/substrate-worker.jsx'

// statstrade-superadmin.pages.index/PageContent [18] 
function PageContent(){
  let state = substrate.useSubstrateContext();
  let readyState = state["readyState"];
  return (
    <T.YStack gap="$3" padding="$4">
      <T.Text>{readyState}</T.Text>
      <T.Anchor href="/adminweb" fontWeight="600">Open Adminweb v2</T.Anchor>
    </T.YStack>);
}

// statstrade-superadmin.pages.index/Page [30] 
function Page(){
  return (
    <PageContent/>);
}

export default Page