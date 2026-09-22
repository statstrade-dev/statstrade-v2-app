import * as layout_manage from '@statstrade/component/layout/layout-manage.jsx'

import * as screen from '@statstrade/feature/manage/billing.jsx'

// statstrade-web.page.manage.billing/Page [10] 
export function Page(props){
  return (
    <layout_manage.LayoutManage userType="manager"><screen.BillingScreen/></layout_manage.LayoutManage>);
}

export default Page