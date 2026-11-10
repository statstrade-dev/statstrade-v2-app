import React from 'react'

import * as hf from '@statstrade/edge/lib/js/lib/react-hook-form.jsx'

import * as ui_controls from '@statstrade/edge/ui-controls.jsx'

import * as action_organisation from '@statstrade/group/manage-organisation-action.jsx'

// statstrade-web.feature.manage.billing.billing-common/BillingContext [16] 
export var BillingContext = React.createContext();

// statstrade-web.feature.manage.billing.billing-common/useBillingContext [19] 
export function useBillingContext(){
  let controls = ui_controls.useControls([["view","list"],["selectedId",null]]);
  let billingCtx = action_organisation.useManageBillingContext();
  return hf.mergeContexts({"controls":controls},billingCtx);
}