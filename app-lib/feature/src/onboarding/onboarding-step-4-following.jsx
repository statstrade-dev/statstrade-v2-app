import React from 'react'

import * as common from '@statstrade/feature/onboarding/onboarding-common.jsx'

import * as ui_section from '@statstrade/component/ui-section.jsx'

// statstrade-web.feature.onboarding.onboarding-step-4-following/OnboardingStep4FollowingScreen [16] 
export function OnboardingStep4FollowingScreen(){
  let context = React.useContext(common.IndexOnboardingContext);
  return (
    <ui_section.MinFrameCenter>
      <ui_section.MinHeader
        title="Follow Organisations"
        paragraph="Follow your favorite organisations"/>
    </ui_section.MinFrameCenter>);
}