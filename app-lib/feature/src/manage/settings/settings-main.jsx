import React from 'react'

import * as T from 'tamagui'

import * as ui_manage from '@statstrade/component/ui-manage.jsx'

import * as settings_team from '@statstrade/feature/manage/settings/settings-team.jsx'

import * as common from '@statstrade/feature/manage/settings/settings-common.jsx'

import * as settings_general from '@statstrade/feature/manage/settings/settings-general.jsx'

import * as settings_api from '@statstrade/feature/manage/settings/settings-api.jsx'

import * as context_manage from '@statstrade/component/layout/manage/context-manage.jsx'

// statstrade-web.feature.manage.settings.settings-main/SettingsTab [17] 
export function SettingsTab({isActive,label,onPress}){
  return (
    <T.Button
      onPress={onPress}
      pressStyle={{"opacity":0.7,"backgroundColor":"transparent"}}
      borderRadius={0}
      borderColor={isActive ? "$color12" : "transparent"}
      paddingHorizontal="$4"
      hoverStyle={{
          "backgroundColor":"transparent",
          "borderColor":isActive ? "$color12" : "$color6"
        }}
      borderWidth={0}
      paddingVertical="$2"
      chromeless={true}
      borderBottomWidth={2}
      backgroundColor="transparent">
      <T.Text
        fontSize="$3"
        fontWeight={isActive ? "600" : "400"}
        color={isActive ? "$color12" : "$color11"}>{label}
      </T.Text>
    </T.Button>);
}

// statstrade-web.feature.manage.settings.settings-main/SettingsMain [40] 
export function SettingsMain(){
  let ctx = React.useContext(common.SettingsContext);
  let [activeTab,setActiveTab] = React.useState("general");
  context_manage.useTopBar((
    <ui_manage.ManagerScreenHeader title="Settings"/>),[]);
  return (
    <T.ScrollView
      flex={1}
      backgroundColor="$color1"
      contentContainerStyle={{
          "padding":"$6",
          "paddingBottom":"$10",
          "maxWidth":800,
          "width":"100%"
        }}>
      <T.YStack gap="$6">
        <T.XStack gap="$2">
          <SettingsTab
            label="General"
            isActive={activeTab == "general"}
            onPress={function (){
                setActiveTab("general");
              }}/>
          <SettingsTab
            label="Team"
            isActive={activeTab == "team"}
            onPress={function (){
                setActiveTab("team");
              }}/>
          <SettingsTab
            label="API"
            isActive={activeTab == "api"}
            onPress={function (){
                setActiveTab("api");
              }}/>
        </T.XStack>
        {(activeTab == "general") ? (
          <settings_general.SettingsGeneral/>) : ((activeTab == "team") ? (
          <settings_team.SettingsTeam/>) : (
          <settings_api.SettingsApi/>))}
      </T.YStack>
    </T.ScrollView>);
}