import * as T from 'tamagui'

import React from 'react'

import * as kd from '@xtalk/lang/common-data.js'

import * as rq from '@statstrade/edge/lib/js/lib/react-query.jsx'

import * as layout_guest from '@statstrade/component/layout/layout-guest.jsx'

import * as action_user from '@statstrade/group/common-user-action.jsx'

import * as sb from '@statstrade/edge/remote/util-supabase.jsx'

import * as layout_auth from '@statstrade/component/layout/layout-auth.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

import * as layout_manage from '@statstrade/component/layout/layout-manage.jsx'

import * as logo from '@statstrade/component/logo/logo-statstrade.jsx'

// statsui.basic.layout.layout-full/check-expired [28] 
export function check_expired(account){
  return ((null == account[["expires_at"]]) ? 0 : account[["expires_at"]]) > (Date.now() / 1000);
}

// statsui.basic.layout.layout-full/LayoutFullSplash [36] 
export function LayoutFullSplash(){
  return (
    <T.YStack
      alignItems="center"
      justifyContent="center"
      position="absolute"
      top={0}
      bottom={0}
      left={0}
      right={0}>
      <T.View marginBottom="40px"><logo.LogoStatstrade size={120}/></T.View>
    </T.YStack>);
}

// statsui.basic.layout.layout-full/LayoutFullContext [53] 
export var LayoutFullContext = React.createContext(null);

// statsui.basic.layout.layout-full/LayoutFull [55] 
export function LayoutFull({screens,children}){
  let api = rq.useApi(action_user.userApi);
  let [session] = sb.useListenSession();
  let hasAuth = kd.not_emptyp(session);
  let currentUser = api.queries.get_user.output;
  let userProfile = api.queries.user_get_profile.output;
  let isOnboarded = kd.get_in(userProfile,["is_onboarded"]);
  let isBusy = (hasAuth && (api.queries.get_user.isPending || api.queries.user_get_profile.isPending));
  let {Landing,Onboarding,Manage,Splash = LayoutFullSplash} = screens || {};
  React.useEffect(function (){
    if(hasAuth){
      api.queries.get_user.refetch();
      api.queries.user_get_profile.refetch();
    }
  },[hasAuth]);
  return (
    <ui.ApiContext.Provider value={api}>
      <LayoutFullContext.Provider value={{"api":api}}>
        {isBusy ? (
          <Splash/>) : (screens ? (!hasAuth ? (
          <layout_guest.LayoutGuest><Landing/></layout_guest.LayoutGuest>) : (isOnboarded ? (
          <layout_manage.LayoutManage userType="participant"><Manage session={session} currentUser={currentUser}/></layout_manage.LayoutManage>) : (
          <layout_auth.LayoutAuth hideHeader={true}><Onboarding session={session}/></layout_auth.LayoutAuth>))) : (!hasAuth ? (
          <layout_guest.LayoutGuest>{children}</layout_guest.LayoutGuest>) : (
          <layout_manage.LayoutManage userType="participant">{children}</layout_manage.LayoutManage>)))}
      </LayoutFullContext.Provider>
    </ui.ApiContext.Provider>);
}