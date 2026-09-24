import * as common from '@statstrade/feature/manage/invites/invites-common.jsx'

import * as content from '@statstrade/feature/manage/invites/invites-content.jsx'

// statstrade-web.feature.manage.invites/InviteScreen [11] 
export function InviteScreen(){
  let context = common.useInviteContext();
  return (
    <common.InviteContext.Provider value={context}><content.InviteContent/></common.InviteContext.Provider>);
}