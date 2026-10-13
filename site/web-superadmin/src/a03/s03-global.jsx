import React from 'react'

import * as T from 'tamagui'

import * as global_token from '@statstrade/web-superadmin/a03/s03/global-token.jsx'

import * as global_sitevar from '@statstrade/web-superadmin/a03/s03/global-sitevar.jsx'

import * as sb from '@statstrade/edge/remote/util-supabase.jsx'

import * as global_region from '@statstrade/web-superadmin/a03/s03/global-region.jsx'

import * as global_currency from '@statstrade/web-superadmin/a03/s03/global-currency.jsx'

import * as substrate from '@statstrade/web-superadmin/lib/substrate-worker.jsx'

import * as workspace from '@statstrade/web-superadmin/adminweb/workspace.jsx'

// statstrade-superadmin.a03.s03-global/A03S03GlobalSectionSpecs [28] 
export var A03S03GlobalSectionSpecs = [
  {"key":"sitevar","number":1,"label":"Global"},
  {"key":"currency","number":2,"label":"Commodity"},
  {"key":"region","number":3,"label":"Country"},
  {"key":"token","number":4,"label":"Token"}
];

// statstrade-superadmin.a03.s03-global/A03S03GlobalMainContent [30] 
export function A03S03GlobalMainContent(props){
  let {account_id,actions,debug,design,mini,route,token} = props;
  let [subSection,setSubSection] = React.useState("currency");
  let provider_state = substrate.useSubstrateContext();
  let resource = provider_state["resource"];
  let runtime_context = {
    "node":resource["client"],
    "runtime":{"config":resource["config"],"schema":{},"lookup":{},"opts":{}},
    "primary-id":resource["config"]["primary"]["id"],
    "space-id":substrate.pageSpaceId(resource["scope-id"],"a03/s03/global")
  };
  let component = {
    "sitevar":global_sitevar.A03S03GlobalSiteVar,
    "currency":global_currency.A03S03GlobalCurrency,
    "region":global_region.A03S03GlobalRegion,
    "token":global_token.A03S03GlobalToken
  }[subSection];
  let sections = A03S03GlobalSectionSpecs;
  return (
    <T.YStack flex={1} gap="$3" padding="$3">
      <T.XStack
        gap="$2"
        flexWrap="wrap"
        role="group"
        ariaLabel="Global data tables">
        {sections.map(function (section){
          return (
            <T.Button
              key={section["key"]}
              size="$2"
              chromeless={true}
              ariaPressed={section["key"] == subSection}
              backgroundColor={(section["key"] == subSection) ? "$color3" : "transparent"}
              onPress={function (){
                  setSubSection(section["key"]);
                }}>
              <T.XStack alignItems="center" gap="$2">
                <T.Text fontFamily="monospace" fontSize="$2" color="$color10">{workspace.getTabNumber("global",null,section["number"])}</T.Text>
                <T.Text>{section["label"]}</T.Text>
              </T.XStack>
            </T.Button>);
        })}
      </T.XStack>
      {component ? React.createElement(component,{
        "design":design,
        "actions":actions,
        "route":route,
        "mini":mini,
        "debug":debug,
        "context":runtime_context,
        "actor_id":account_id
      }) : null}
    </T.YStack>);
}

// statstrade-superadmin.a03.s03-global/A03S03GlobalMain [87] 
export function A03S03GlobalMain(props){
  let {account_id} = props;
  return (
    <workspace.AdminwebShell section="global">
      <workspace.SuperadminGate><A03S03GlobalMainContent account_id={account_id}/></workspace.SuperadminGate>
    </workspace.AdminwebShell>);
}

// statstrade-superadmin.a03.s03-global/A03S03GlobalPage [97] 
export function A03S03GlobalPage(){
  let [session] = sb.useListenSession();
  let current_session = session || {};
  let user = current_session["user"] || {};
  let actor_id = user["id"];
  let token = current_session["access_token"];
  return token ? (
    <A03S03GlobalMain token={token} account_id={actor_id}/>) : (
    <T.YStack gap="$3" padding="$4">
      <T.Text fontSize="$5" fontWeight="600">Sign in to manage Global tables.</T.Text>
      <T.Anchor href="/auth/sign-in">Sign in</T.Anchor>
    </T.YStack>);
}