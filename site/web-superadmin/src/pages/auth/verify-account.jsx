'use client'

import * as ui_section from '@statstrade/component/ui-section.jsx'

import * as layout_auth from '@statstrade/component/layout/layout-auth.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

import * as layoutbase from '@statstrade/component/layout/layout-base.jsx'

// statstrade-superadmin.pages.auth.verify-account/Page [14] 
function Page(){
  return (
    <layoutbase.LayoutBase showDevtool={true}>
      <layout_auth.LayoutAuth hideHeader={true}>
        <ui_section.MinFrameCenter>
          <ui_section.MinHeader
            title={ui.t("Verify Email")}
            paragraph={ui.t("Use the link in your email to verify your account.")}/>
          <ui.ButtonLink href="/auth/sign-in">{ui.t("Back to Sign In")}</ui.ButtonLink>
        </ui_section.MinFrameCenter>
      </layout_auth.LayoutAuth>
    </layoutbase.LayoutBase>);
}

export default Page