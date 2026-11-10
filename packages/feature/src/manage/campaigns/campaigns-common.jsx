import React from 'react'

import * as hf from '@statstrade/edge/lib/js/lib/react-hook-form.jsx'

import * as page_api from '@statstrade/edge/substrate/page-api.jsx'

import * as action_campaign from '@statstrade/group/manage-campaign-action.jsx'

// statstrade-web.feature.manage.campaigns.campaigns-common/CampaignsContext [16] 
export var CampaignsContext = React.createContext();

// statstrade-web.feature.manage.campaigns.campaigns-common/useCampaignsContext [19] 
export function useCampaignsContext(){
  let api = page_api.usePageApi("campaigns");
  let [view,setView] = React.useState("list");
  let [selectedId,setSelectedId] = React.useState(null);
  let forms = hf.useFormStateMap(action_campaign.formStateCampaign);
  let controls = {selectedId,setSelectedId,setView,view};
  return {api,controls,forms};
}