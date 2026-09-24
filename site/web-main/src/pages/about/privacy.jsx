import * as layout_auth from '@statstrade/component/layout/layout-auth.jsx'

import * as feature from '@statstrade/feature/about/privacy.jsx'

// statstrade-web.page.about.privacy/Page [16] 
export function Page(){
  return (
    <layout_auth.LayoutAuth><feature.PrivacyScreen/></layout_auth.LayoutAuth>);
}

export default Page