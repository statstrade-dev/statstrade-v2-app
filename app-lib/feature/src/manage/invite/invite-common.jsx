import React from 'react'

import * as hf from '@statstrade/edge/lib/js/lib/react-hook-form'

import * as action_organisation from '@statstrade/group/manage-organisation-action'

import * as global_store from '@statstrade/edge/global-store'

// sznui.lib.feature.manage.invites.invites-common/InviteContext [16] 
export var InviteContext = React.createContext();

// sznui.lib.feature.manage.invites.invites-common/useInviteContext [19] 
export function useInviteContext(){
  let [org] = global_store.useStore(["context","organisation"]);
  let orgId = org && org.id;
  let controls = hf.useControls([["view","list"],["selectedId",null],["orgId",orgId]]);
  let inviteCtx = action_organisation.useManageInviteContext();
  return hf.mergeContexts({"controls":controls},inviteCtx);
}
