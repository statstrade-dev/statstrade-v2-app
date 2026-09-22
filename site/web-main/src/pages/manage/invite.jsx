import * as screen from '@statstrade/feature/manage/invites.jsx'

import * as layout_manage from '@statstrade/component/layout/layout-manage.jsx'

// statstrade-web.page.manage.invite/Page [10] 
export function Page(props){
  return (
    <layout_manage.LayoutManage userType="manager"><screen.InviteScreen/></layout_manage.LayoutManage>);
}

export default Page