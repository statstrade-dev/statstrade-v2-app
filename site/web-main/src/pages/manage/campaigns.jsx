import * as screen from '@statstrade/feature/manage/campaigns.jsx'

import * as layout_manage from '@statstrade/component/layout/layout-manage.jsx'

// statstrade-web.page.manage.campaigns/Page [10] 
export function Page(props){
  return (
    <layout_manage.LayoutManage userType="manager"><screen.CampaignsScreen/></layout_manage.LayoutManage>);
}

export default Page