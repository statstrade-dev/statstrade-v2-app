import React from 'react'

import * as hf from '@statstrade/edge/lib/js/lib/react-hook-form.jsx'

import * as ui_controls from '@statstrade/edge/ui-controls.jsx'

import * as action_organisation from '@statstrade/group/manage-organisation-action.jsx'

import * as global_store from '@statstrade/edge/global-store.jsx'

// statstrade-web.feature.manage.invites.invites-common/InviteContext [17] 
export var InviteContext = React.createContext();

// statstrade-web.feature.manage.invites.invites-common/useInviteContext [20] 
export function useInviteContext(){
  let [org] = global_store.useStore(["context","organisation"]);
  let orgId = org && org.id;
  let controls = ui_controls.useControls([["view","list"],["selectedId",null],["orgId",orgId]]);
  let inviteCtx = action_organisation.useManageInviteContext();
  return hf.mergeContexts({"controls":controls},inviteCtx);
}