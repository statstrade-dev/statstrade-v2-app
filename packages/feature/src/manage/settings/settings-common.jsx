import React from 'react'

import * as hf from '@statstrade/edge/lib/js/lib/react-hook-form.jsx'

import * as action_organisation from '@statstrade/group/manage-organisation-action.jsx'

// statstrade-web.feature.manage.settings.settings-common/SettingsContext [15] 
export var SettingsContext = React.createContext();

// statstrade-web.feature.manage.settings.settings-common/useSettingsContext [18] 
export function useSettingsContext(){
  let controls = hf.useControls([["view","main"]]);
  let settingsCtx = action_organisation.useSettingsContext();
  return hf.mergeContexts({"controls":controls},settingsCtx);
}