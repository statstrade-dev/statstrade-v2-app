import {LayoutAuth} from '@statstrade/component/layout/layout-auth'

import {SignInScreen} from '@statstrade/feature/auth/sign-in'

import {useListenSession} from '@statstrade/edge/remote/util-supabase'

import {LayoutBase} from '@statstrade/component/layout/layout-base'

import React from 'react'

// statsui.basic.layout.layout-super/LayoutSuperSignIn [12] 
export function LayoutSuperSignIn(){
  return (
    <LayoutAuth hideHeader={true}><SignInScreen pathPrefix="/auth"/></LayoutAuth>);
}

// statsui.basic.layout.layout-super/LayoutSuper [22] 
export function LayoutSuper({children}){
  let [session] = useListenSession();
  return React.createElement(
    LayoutBase,
    {"showDevtool":true},
    session ? React.createElement(LayoutAuth,{session},children) : React.createElement(LayoutSuperSignIn,{})
  );
}