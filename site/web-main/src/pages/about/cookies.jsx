import * as layout_auth from '@statstrade/component/layout/layout-auth.jsx'

import * as feature from '@statstrade/feature/about/cookies.jsx'

// statstrade-web.page.about.cookies/Page [16] 
export function Page(){
  return (
    <layout_auth.LayoutAuth><feature.CookiesScreen/></layout_auth.LayoutAuth>);
}

export default Page