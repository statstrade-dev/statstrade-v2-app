'use client'

import * as layout_auth from '@statstrade/component/layout/layout-auth.jsx'

import * as feature from '@statstrade/feature/auth/new-account.jsx'

import * as layoutbase from '@statstrade/component/layout/layout-base.jsx'

// statstrade-superadmin.pages.auth.new-account/Page [17] 
function Page(){
  return (
    <layoutbase.LayoutBase showDevtool={true}>
      <layout_auth.LayoutAuth hideHeader={true}><feature.NewAccountScreen pathPrefix="/auth"/></layout_auth.LayoutAuth>
    </layoutbase.LayoutBase>);
}

export default Page