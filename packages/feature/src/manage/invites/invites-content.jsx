import React from 'react'

import * as common from '@statstrade/feature/manage/invites/invites-common.jsx'

import * as create from '@statstrade/feature/manage/invites/invites-create.jsx'

import * as main from '@statstrade/feature/manage/invites/invites-main.jsx'

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