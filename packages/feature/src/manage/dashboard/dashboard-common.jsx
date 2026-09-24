import React from 'react'

import * as rq from '@statstrade/edge/lib/js/lib/react-query.jsx'

import * as action_dashboard from '@statstrade/group/manage-dashboard-action.jsx'

// statstrade-web.feature.manage.dashboard.dashboard-common/DashboardContext [13] 
export var DashboardContext = React.createContext();

// statstrade-web.feature.manage.dashboard.dashboard-common/useDashboardContext [16] 
export function useDashboardContext(){
  let api = rq.useApi(action_dashboard.managerDashboardApi);
  let [view,setView] = React.useState("main");
  let controls = {setView,view};
  return {api,controls};
}