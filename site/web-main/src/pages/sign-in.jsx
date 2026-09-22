import * as layout_auth from '@statstrade/component/layout/layout-auth.jsx'

import * as feature from '@statstrade/feature/auth/sign-in.jsx'

// statstrade-web.page.sign-in/Page [12] 
export function Page(){
  return (
    <layout_auth.LayoutAuth><feature.SignInScreen/></layout_auth.LayoutAuth>);
}

export default Page