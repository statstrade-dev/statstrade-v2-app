import * as screen from '@statstrade/feature/manage/analytics.jsx'

import * as layout_manage from '@statstrade/component/layout/layout-manage.jsx'

// statstrade-web.page.manage.analytics/Page [14] 
export function Page(props){
  return (
    <layout_manage.LayoutManage userType="manager"><screen.AnalyticsScreen/></layout_manage.LayoutManage>);
}

export default Page