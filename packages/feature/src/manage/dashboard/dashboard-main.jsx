import {CheckSquare,LayoutDashboard,Settings,TrendingUp,Users} from '@tamagui/lucide-icons'

import * as T from 'tamagui'

import React from 'react'

import * as ui_manage from '@statstrade/component/ui-manage.jsx'

import * as common from '@statstrade/feature/manage/dashboard/dashboard-common.jsx'

import * as context_manage from '@statstrade/component/layout/manage/context-manage.jsx'

// statstrade-web.feature.manage.dashboard.dashboard-main/SetupItem [16] 
export function SetupItem({description,isComplete,label,onPress}){
  return (
    <T.Button
      bordered={true}
      padding="$4"
      borderRadius="$4"
      backgroundColor={isComplete ? "$color3" : "$color1"}
      borderColor={isComplete ? "transparent" : "$borderColor"}
      onPress={onPress}
      height="auto"
      justifyContent="flex-start">
      <T.XStack gap="$4" alignItems="center" flex={1}>
        <T.View
          width={24}
          height={24}
          borderRadius="$full"
          borderWidth={2}
          borderColor={isComplete ? "$green9" : "$color8"}
          backgroundColor={isComplete ? "$green9" : "transparent"}
          alignItems="center"
          justifyContent="center">
          {isComplete ? (
            <CheckSquare size={14} color="white"/>) : null}
        </T.View>
        <T.YStack flex={1}>
          <T.Text
            fontSize="$4"
            fontWeight="600"
            color={isComplete ? "$color11" : "$color12"}
            textDecorationLine={isComplete ? "line-through" : "none"}>{label}
          </T.Text>
          <T.Text fontSize="$3" color="$color11">{description}</T.Text>
        </T.YStack>
      </T.XStack>
    </T.Button>);
}

// statstrade-web.feature.manage.dashboard.dashboard-main/DashboardMain [44] 
export function DashboardMain(){
  let ctx = React.useContext(common.DashboardContext);
  let {api} = ctx;
  let {controls} = React.useContext(context_manage.LayoutManageContext);
  let orgsQuery = api.queries.user_list_owner_organisations;
  let orgs = (orgsQuery.data && orgsQuery.data.data) || [];
  let isLoading = orgsQuery.isLoading;
  React.useEffect(function (){
    if(!orgsQuery.data){
      orgsQuery.setInput({});
    }
  },[]);
  React.useEffect(function (){
    if(!isLoading && (orgs.length > 0)){
      controls.setTopBar((
        <T.XStack
          alignItems="center"
          justifyContent="space-between"
          width="100%">
          <T.Text fontSize="$5" fontWeight="600" color="$color12">Home</T.Text>
        </T.XStack>));
    }
    else{
      controls.setTopBar(null);
    }
    return function (){
      controls.setTopBar(null);
    };
  },[isLoading,orgs.length],[isLoading,orgs.length]);
  if(isLoading){
    return (
      <T.Spinner size="large" color="$color11" marginTop="$10"/>);
  }
  return (
    <T.ScrollView
      contentContainerStyle={{
          "padding":"$5",
          "paddingBottom":"$10",
          "maxWidth":1000,
          "marginHorizontal":"auto",
          "width":"100%"
        }}>
      <T.YStack marginBottom="$6" marginTop="$2">
        <T.H1
          fontSize="$9"
          color="$color12"
          fontWeight="800"
          letterSpacing="$0">Home
        </T.H1>
        <T.Text fontSize="$5" color="$color11" marginTop="$2">Manage your organization, campaigns, and community.</T.Text>
      </T.YStack>
      <T.XStack gap="$4" flexWrap="wrap" marginBottom="$6">
        <ui_manage.StatCard label="Total Users" value="1,234" icon={Users} color="$blue10"/>
        <ui_manage.StatCard
          label="Active Campaigns"
          value="3"
          icon={TrendingUp}
          color="$green10"/>
        <ui_manage.StatCard
          label="Pending Tasks"
          value="12"
          icon={CheckSquare}
          color="$yellow10"/>
        <ui_manage.StatCard
          label="Settings"
          value="Config"
          icon={Settings}
          color="$purple10"/>
      </T.XStack>
      <T.YStack gap="$4">
        <T.H3 fontSize="$5" color="$color12" marginBottom="$2">Setup Guide</T.H3>
        <SetupItem
          label="Complete Profile"
          description="Add your logo, description, and contact details."
          isComplete={true}
          onPress={function (){
              console.log("Profile");
            }}/>
        <SetupItem
          label="Create First Campaign"
          description="Launch a campaign to engage your community."
          isComplete={false}
          onPress={function (){
              console.log("Campaign");
            }}/>
        <SetupItem
          label="Invite Team Members"
          description="Add collaborators to help manage your organization."
          isComplete={false}
          onPress={function (){
              console.log("Invite");
            }}/>
      </T.YStack>
    </T.ScrollView>);
}