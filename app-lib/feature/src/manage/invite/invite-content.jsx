import React from 'react'

import * as common from '@statstrade/feature/manage/invite/invite-common'

import * as main from '@statstrade/feature/manage/invite/invite-main'

import * as create from '@statstrade/feature/manage/invite/invite-create'

// statstrade-web.feature.manage.invites.invites-content/InviteContent [12] 
export function InviteContent(){
  let ctx = React.useContext(common.InviteContext);
  let view = ctx.controls.view;
  if(view == "create"){
    return (
      <create.InviteCreate/>);
  }
  else{
    return (
      <main.InvitesList/>);
  }
}
