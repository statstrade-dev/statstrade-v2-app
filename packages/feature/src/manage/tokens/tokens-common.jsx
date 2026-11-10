import React from 'react'

import * as hf from '@statstrade/edge/lib/js/lib/react-hook-form.jsx'

import * as ui_controls from '@statstrade/edge/ui-controls.jsx'

import * as action_organisation from '@statstrade/group/manage-organisation-action.jsx'

import * as global_store from '@statstrade/edge/global-store.jsx'

// statstrade-web.feature.manage.tokens.tokens-common/TokensContext [17] 
export var TokensContext = React.createContext();

// statstrade-web.feature.manage.tokens.tokens-common/useTokensContext [20] 
export function useTokensContext(){
  let [org] = global_store.useStore(["context","organisation"]);
  let orgId = org && org.id;
  let controls = ui_controls.useControls([["view","list"],["selectedId",null],["orgId",orgId]]);
  let tokenCtx = action_organisation.useManageOrganisationTokenContext({"name":orgId});
  return hf.mergeContexts({"controls":controls},tokenCtx);
}