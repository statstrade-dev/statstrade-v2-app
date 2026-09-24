import * as layout_auth from '@statstrade/component/layout/layout-auth.jsx'

import * as feature from '@statstrade/feature/about/terms.jsx'

// statstrade-web.page.about.terms/Page [16] 
export function Page(){
  return (
    <layout_auth.LayoutAuth><feature.TermsScreen/></layout_auth.LayoutAuth>);
}

export default Page