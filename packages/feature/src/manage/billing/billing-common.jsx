import React from 'react'

import * as hf from '@statstrade/edge/lib/js/lib/react-hook-form.jsx'

import * as action_organisation from '@statstrade/group/manage-organisation-action.jsx'

// statstrade-web.feature.manage.billing.billing-common/BillingContext [15] 
export var BillingContext = React.createContext();

// statstrade-web.feature.manage.billing.billing-common/useBillingContext [18] 
export function useBillingContext(){
  let controls = hf.useControls([["view","list"],["selectedId",null]]);
  let billingCtx = action_organisation.useManageBillingContext();
  return hf.mergeContexts({"controls":controls},billingCtx);
}