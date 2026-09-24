import * as screen from '@statstrade/feature/manage/dashboard.jsx'

import * as layout_manage from '@statstrade/component/layout/layout-manage.jsx'

// statstrade-web.page.manage.index/Page [14] 
export function Page(props){
  return (
    <layout_manage.LayoutManage userType="manager"><screen.DashboardScreen/></layout_manage.LayoutManage>);
}

export default Page