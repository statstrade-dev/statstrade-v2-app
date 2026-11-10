import React from 'react'

import * as page_api from '@statstrade/edge/substrate/page-api.jsx'

// statstrade-web.feature.manage.dashboard.dashboard-common/DashboardContext [14] 
export var DashboardContext = React.createContext();

// statstrade-web.feature.manage.dashboard.dashboard-common/useDashboardContext [17] 
export function useDashboardContext(){
  let api = page_api.usePageApi("dashboard");
  let [view,setView] = React.useState("main");
  let controls = {setView,view};
  return {api,controls};
}