'use client'

import * as T from 'tamagui'

import * as sb from '@statstrade/edge/remote/util-supabase.jsx'

import * as s00 from '@statstrade/web-superadmin/a03/s03-global.jsx'

import * as layout_base from '@statstrade/component/layout/layout-base.jsx'

// statstrade-superadmin.pages.a03.s03-index/S03Content [21] 
function S03Content(){
  let [session] = sb.useListenSession();
  let current_session = session || {};
  let user = current_session["user"] || {};
  let actor_id = user["id"];
  let token = current_session["access_token"];
  return token ? (
    <s00.A03S03GlobalMain token={token} account_id={actor_id}/>) : (
    <T.YStack gap="$3" padding="$4">
      <T.Text fontSize="$5" fontWeight="600">Sign in to manage Global tables.</T.Text>
      <T.Anchor href="/auth/sign-in">Sign in</T.Anchor>
    </T.YStack>);
}

// statstrade-superadmin.pages.a03.s03-index/Page [39] 
function Page(){
  return (
    <layout_base.LayoutBase showDevtool={true}><S03Content/></layout_base.LayoutBase>);
}

export default Page