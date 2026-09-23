'use client'

import * as layout_auth from '@statstrade/component/layout/layout-auth.jsx'

import * as feature from '@statstrade/feature/auth/sign-in.jsx'

import * as layoutbase from '@statstrade/component/layout/layout-base.jsx'

// statstrade-superadmin.pages.auth.sign-in/Page [13] 
function Page(){
  return (
    <layoutbase.LayoutBase showDevtool={true}>
      <layout_auth.LayoutAuth hideHeader={true}><feature.SignInScreen pathPrefix="/auth"/></layout_auth.LayoutAuth>
    </layoutbase.LayoutBase>);
}

export default Page