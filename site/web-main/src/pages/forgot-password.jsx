import * as feature from '@statstrade/feature/auth/forgot-password.jsx'

import * as layout_auth from '@statstrade/component/layout/layout-auth.jsx'

// statstrade-web.page.forgot-password/Page [12] 
export function Page(){
  return (
    <layout_auth.LayoutAuth><feature.ForgotPasswordScreen/></layout_auth.LayoutAuth>);
}

export default Page