import * as main from '@statstrade/feature/manage/settings/settings-main.jsx'

import * as common from '@statstrade/feature/manage/settings/settings-common.jsx'

// statstrade-web.feature.manage.settings/SettingsScreen [12] 
export function SettingsScreen(){
  let ctx = common.useSettingsContext();
  return (
    <common.SettingsContext.Provider value={ctx}><main.SettingsMain/></common.SettingsContext.Provider>);
}

// statstrade-web.feature.manage.settings/Page [20] 
export function Page(){
  return (
    <SettingsScreen/>);
}