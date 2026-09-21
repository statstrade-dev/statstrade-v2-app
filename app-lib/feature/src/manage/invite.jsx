import * as common from '@statstrade/feature/manage/invite/invite-common'

import * as content from '@statstrade/feature/manage/invite/invite-content'

// statstrade-web.feature.manage.invites/InviteScreen [11] 
export function InviteScreen(){
  let context = common.useInviteContext();
  return (
    <common.InviteContext.Provider value={context}><content.InviteContent/></common.InviteContext.Provider>);
}