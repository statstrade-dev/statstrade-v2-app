import {SignInScreen} from '@statstrade/feature/auth/sign-in'

import {useListenSession} from '@statstrade/edge/remote/util-supabase'

import React from 'react'

import * as layout_auth from '@statstrade/component/layout/layout-auth.jsx'

import * as layout_base from '@statstrade/component/layout/layout-base.jsx'

// statsui.basic.layout.layout-super/LayoutSuperSignIn [12] 
export function LayoutSuperSignIn(){
  return (
    <layout_auth.LayoutAuth hideHeader={true}><SignInScreen pathPrefix="/auth"/></layout_auth.LayoutAuth>);
}

// statsui.basic.layout.layout-super/LayoutSuper [22] 
export function LayoutSuper({children}){
  let [session] = useListenSession();
  return React.createElement(
    layout_base.LayoutBase,
    {"showDevtool":true},
    session ? React.createElement(layout_auth.LayoutAuth,{session},children) : React.createElement(LayoutSuperSignIn,{})
  );
}