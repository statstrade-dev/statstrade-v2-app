import React from 'react'

import * as kd from '@xtalk/lang/common-data.js'

import * as hf from '@statstrade/edge/lib/js/lib/react-hook-form.jsx'

import * as sb from '@statstrade/edge/remote/util-supabase.jsx'

import * as action_manager from '@statstrade/group/manage-organisation-action.jsx'

// statsui.basic.layout.manage.context-manage/LayoutManageContext [17] 
export var LayoutManageContext = React.createContext();

// statsui.basic.layout.manage.context-manage/useLayoutManageContext [20] 
export function useLayoutManageContext(){
  let [session] = sb.useListenSession();
  let controls = hf.useControls([
    ["showMainMenu",false],
    ["showProfileMenu",false],
    ["showOrgSelector",false],
    ["showSearchMenu",false],
    ["showCreateOrg",false],
    ["theme","light"],
    ["topBar",null],
    ["setupStep",1],
    ["setupOrgData",null],
    ["setupIsBusy",false],
    ["setupOrgTags",new Set()],
    ["setupOrgImage",null],
    ["setupBillingPlan","starter"],
    ["setupClientSecret",null],
    ["setupPaymentMessage",null],
    ["setupPaymentSuccess",null],
    ["setupPaymentError",null]
  ]);
  let handle = kd.get_in(session,["user","user_metadata","handle"]);
  let email = kd.get_in(session,["user","email"]);
  controls.handle = handle;
  controls.email = email;
  controls.toggleTheme = (function (){
    controls.setTheme((controls.theme == "light") ? "dark" : "light");
  });
  let userId = kd.get_in(session,["user","id"]);
  let orgContext = action_manager.useManageOrganisationContext({"userId":userId});
  return Object.assign({controls,session},orgContext);
}

// statsui.basic.layout.manage.context-manage/useTopBar [67] 
export function useTopBar(content,deps){
  let ctx = React.useContext(LayoutManageContext);
  React.useEffect(function (){
    ctx.controls.setTopBar(content);
    return function (){
      ctx.controls.setTopBar(null);
    };
  },deps || []);
}