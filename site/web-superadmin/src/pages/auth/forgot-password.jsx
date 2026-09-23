'use client'

import * as feature from '@statstrade/feature/auth/forgot-password.jsx'

import * as layout_auth from '@statstrade/component/layout/layout-auth.jsx'

import * as layoutbase from '@statstrade/component/layout/layout-base.jsx'

// statstrade-superadmin.pages.auth.forgot-password/Page [13] 
function Page(){
  return (
    <layoutbase.LayoutBase showDevtool={true}>
      <layout_auth.LayoutAuth hideHeader={true}><feature.ForgotPasswordScreen pathPrefix="/auth"/></layout_auth.LayoutAuth>
    </layoutbase.LayoutBase>);
}

export default Page