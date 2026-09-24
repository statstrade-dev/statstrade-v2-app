import {Key,Trash} from '@tamagui/lucide-icons'

import * as T from 'tamagui'

import React from 'react'

import * as common from '@statstrade/feature/manage/settings/settings-common.jsx'

// statstrade-web.feature.manage.settings.settings-api/ApiKeyRow [13] 
export function ApiKeyRow({item,onDelete}){
  return (
    <T.XStack
      padding="$4"
      backgroundColor="$color2"
      borderRadius="$3"
      marginBottom="$2"
      justifyContent="space-between"
      alignItems="center">
      <T.XStack gap="$4" alignItems="center">
        <T.View
          width={40}
          height={40}
          borderRadius="$2"
          backgroundColor="$purple4"
          alignItems="center"
          justifyContent="center"><Key size={20} color="$purple11"/>
        </T.View>
        <T.YStack>
          <T.Text fontSize="$3" color="$color12" fontWeight="600">{item.name}</T.Text>
          <T.Text fontSize={11} color="$color11">{"Created " + item.date}</T.Text>
        </T.YStack>
      </T.XStack>
      <T.Button
        size="$3"
        chromeless={true}
        icon={Trash}
        color="$red10"
        onPress={onDelete}/>
    </T.XStack>);
}

// statstrade-web.feature.manage.settings.settings-api/SettingsApi [26] 
export function SettingsApi(){
  let ctx = React.useContext(common.SettingsContext);
  let apiKeys = [
    {"id":1,"name":"Production Key","date":"Oct 10, 2025"},
    {"id":2,"name":"Dev Key","date":"Sep 22, 2025"}
  ];
  return (
    <T.YStack gap="$4">
      <T.XStack justifyContent="space-between" alignItems="center">
        <T.H4 fontSize="$5" color="$color12" fontWeight="600">API Keys</T.H4>
        <T.Button size="$3" variant="outlined">Generate New Key</T.Button>
      </T.XStack>
      {apiKeys.map(function (item){
        (
          <ApiKeyRow
            key={item.id}
            item={item}
            onDelete={function (){
                console.log("delete");
              }}/>);
      })}
    </T.YStack>);
}