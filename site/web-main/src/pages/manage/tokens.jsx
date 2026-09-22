import * as screen from '@statstrade/feature/manage/tokens.jsx'

import * as layout_manage from '@statstrade/component/layout/layout-manage.jsx'

// statstrade-web.page.manage.tokens/Page [10] 
export function Page(props){
  return (
    <layout_manage.LayoutManage userType="manager"><screen.TokensScreen/></layout_manage.LayoutManage>);
}

export default Page