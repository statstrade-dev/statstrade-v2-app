import * as main from '@statstrade/feature/manage/dashboard/dashboard-main.jsx'

import * as common from '@statstrade/feature/manage/dashboard/dashboard-common.jsx'

// statstrade-web.feature.manage.dashboard/DashboardScreen [14] 
export function DashboardScreen(){
  let ctx = common.useDashboardContext();
  return (
    <common.DashboardContext.Provider value={ctx}><main.DashboardMain/></common.DashboardContext.Provider>);
}

// statstrade-web.feature.manage.dashboard/Page [22] 
export function Page(){
  return (
    <DashboardScreen/>);
}