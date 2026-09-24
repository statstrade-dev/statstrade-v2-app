import * as sb from '@statstrade/edge/remote/util-supabase.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

import * as frame_manage from '@statstrade/component/layout/manage/frame-manage.jsx'

// statsui.basic.layout.layout-manage/LayoutManageFrame [17] 
export function LayoutManageFrame({children}){
  let [session] = sb.useListenSession();
  let api = ui.useApiContext();
  return (
    <frame_manage.LayoutManageWrapper>{children}</frame_manage.LayoutManageWrapper>);
}

// statsui.basic.layout.layout-manage/LayoutManage [27] 
export function LayoutManage({children}){
  return (
    <LayoutManageFrame>{children}</LayoutManageFrame>);
}