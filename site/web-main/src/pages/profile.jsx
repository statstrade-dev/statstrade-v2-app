import * as layout_full from '@statstrade/component/layout/layout-full.jsx'

import * as profile_editor from '@statstrade/feature/profile/profile-editor.jsx'

// statstrade-web.page.profile/Page [15] 
export function Page(){
  return (
    <layout_full.LayoutFull><profile_editor.ProfileEditor/></layout_full.LayoutFull>);
}

export default Page