import * as layout_guest from '@statstrade/component/layout/layout-guest.jsx'

import * as feature from '@statstrade/feature/about/features.jsx'

// statstrade-web.page.about.features/Page [12] 
export function Page(){
  return (
    <layout_guest.LayoutGuest><feature.FeaturesScreen/></layout_guest.LayoutGuest>);
}

export default Page