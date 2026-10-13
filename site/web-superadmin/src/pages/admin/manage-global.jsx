'use client'

import * as global_page from '@statstrade/web-superadmin/a03/s03-global.jsx'

import * as layout_base from '@statstrade/component/layout/layout-base.jsx'

// statstrade-superadmin.pages.admin.manage-global/Page [19] 
function Page(){
  return (
    <layout_base.LayoutBase showDevtool={true}><global_page.A03S03GlobalPage/></layout_base.LayoutBase>);
}

export default Page