import * as layout_manage from '@statstrade/component/layout/layout-manage.jsx'

import * as screen from '@statstrade/feature/manage/settings.jsx'

// statstrade-web.page.manage.settings/Page [10] 
export function Page(props){
  return (
    <layout_manage.LayoutManage userType="manager"><screen.SettingsScreen/></layout_manage.LayoutManage>);
}

export default Page