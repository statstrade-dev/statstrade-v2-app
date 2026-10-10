import React from 'react'

import * as T from 'tamagui'

import * as substrate from '@statstrade/web-superadmin/lib/substrate-bare.jsx'

import * as global_region from '@statstrade/web-superadmin/a07/s00/global-region.jsx'

import * as global_token from '@statstrade/web-superadmin/a07/s00/global-token.jsx'

import * as global_sitevar from '@statstrade/web-superadmin/a07/s00/global-sitevar.jsx'

import * as global_currency from '@statstrade/web-superadmin/a07/s00/global-currency.jsx'

// statstrade-superadmin.a07.s00-global/A07GlobalMainContent [21] 
export function A07GlobalMainContent(props){
  let {account_id,actions,debug,design,mini,route,token} = props;
  let [subSection,setSubSection] = React.useState("currency");
  let provider_state = substrate.useSubstrateContext();
  let resource = provider_state["resource"];
  let runtime_context = {
    "node":resource["client"],
    "runtime":{"config":resource["config"],"schema":{},"lookup":{},"opts":{}}
  };
  let component = {
    "sitevar":global_sitevar.A07GlobalSiteVar,
    "currency":global_currency.A07GlobalCurrency,
    "region":global_region.A07GlobalRegion,
    "token":global_token.A07GlobalToken
  }[subSection];
  let sections = [
    {"key":"sitevar","label":"Global"},
    {"key":"currency","label":"Commodity"},
    {"key":"region","label":"Country"},
    {"key":"token","label":"Token"}
  ];
  return (
    <T.YStack flex={1} gap="$3" padding="$3">
      <T.XStack gap="$2" flexWrap="wrap">
        {sections.map(function (section){
          return (
            <T.Button
              key={section["key"]}
              size="$2"
              chromeless={true}
              backgroundColor={(section["key"] == subSection) ? "$color3" : "transparent"}
              onPress={function (){
                  setSubSection(section["key"]);
                }}>{section["label"]}
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

// statstrade-superadmin.a07.s00-global/A07GlobalMain [70] 
export function A07GlobalMain(props){
  let {token} = props;
  let config = React.useMemo(function (){
    return substrate.createConfig(token);
  },[token]);
  return (
    <substrate.SubstrateProvider
      options={{"client_id":"statstrade-superadmin-global","config":config}}><A07GlobalMainContent>{props}</A07GlobalMainContent>
    </substrate.SubstrateProvider>);
}

// statstrade-superadmin.a07.s00-global/MODULE [84] 
export var MODULE = {
  "A07GlobalMainContent":A07GlobalMainContent,
  "A07GlobalMain":A07GlobalMain,
  "MODULE":MODULE
};