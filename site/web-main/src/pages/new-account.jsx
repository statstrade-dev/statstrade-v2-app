import * as layout_auth from '@statstrade/component/layout/layout-auth.jsx'

import * as feature from '@statstrade/feature/auth/new-account.jsx'

// statstrade-web.page.new-account/Page [12] 
export function Page(){
  return (
    <layout_auth.LayoutAuth><feature.NewAccountScreen/></layout_auth.LayoutAuth>);
}

export default Page