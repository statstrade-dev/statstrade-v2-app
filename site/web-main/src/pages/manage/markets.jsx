import * as screen from '@statstrade/feature/manage/topics.jsx'

import * as layout_manage from '@statstrade/component/layout/layout-manage.jsx'

// statstrade-web.page.manage.markets/Page [14] 
export function Page(props){
  return (
    <layout_manage.LayoutManage userType="manager"><screen.MarketsScreen/></layout_manage.LayoutManage>);
}

export default Page