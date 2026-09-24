import * as feature from '@statstrade/feature/about/pricing.jsx'

import * as layout_guest from '@statstrade/component/layout/layout-guest.jsx'

// statstrade-web.page.about.pricing/Page [16] 
export function Page(){
  return (
    <layout_guest.LayoutGuest><feature.PricingScreen/></layout_guest.LayoutGuest>);
}

export default Page