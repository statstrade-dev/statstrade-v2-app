import * as common from '@statstrade/feature/onboarding/onboarding-common.jsx'

import * as ui_section from '@statstrade/component/ui-section.jsx'

// statstrade-web.feature.onboarding.onboarding-step-6-task/OnboardingStep6TaskScreen [15] 
export function OnboardingStep6TaskScreen(){
  let context = common.useIndexOnboardingContext();
  return (
    <ui_section.MinFrameCenter>
      <ui_section.MinHeader
        title="Create a Task"
        paragraph="This is the first task that you'd be engaging your community with"/>
    </ui_section.MinFrameCenter>);
}