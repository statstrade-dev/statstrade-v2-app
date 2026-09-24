import * as layout_full from '@statstrade/component/layout/layout-full.jsx'

import * as index_landing from '@statstrade/feature/landing/index-landing.jsx'

import * as index_onboarding from '@statstrade/feature/onboarding/index-onboarding.jsx'

// statstrade-web.page.index/Page [17] 
export function Page(){
  return (
    <layout_full.LayoutFull
      landing={index_landing.IndexLandingScreen}
      onboarding={index_onboarding.IndexOnboardingScreen}><index_landing.IndexLandingScreen/>
    </layout_full.LayoutFull>);
}

export default Page