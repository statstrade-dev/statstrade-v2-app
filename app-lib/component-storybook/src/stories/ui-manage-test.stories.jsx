import React from 'react'

import * as T from 'tamagui'

import * as ui_manage from '@statstrade/component/ui-manage'

// sznui.lib.component.ui-manage-test/Metadata [12] 
export var Metadata = {[title]:"Components/ui-manage",[tags]:["autodoc"]};

// sznui.lib.component.ui-manage-test/Test_ManagerScreenHeader [18] 
export function Test_ManagerScreenHeader(){
  return (
    <T.YStack gap="$4">
      <ui_manage.ManagerScreenHeader title="Manager Header"/>
      <ui_manage.ManagerScreenHeader
        title="Header with Action"
        onAction={function (){
            alert("Action Clicked");
          }}/>
    </T.YStack>);
}

// sznui.lib.component.ui-manage-test/Test_ScreenHeader [34] 
export function Test_ScreenHeader(){
  return (
    <ui_manage.ScreenHeader
      title="Page Title"
      description="This is a description of the page."
      onBack={function (){
          alert("Go Back");
        }}
      controls={(
          <T.Button>{"Control Button"}</T.Button>)}/>);
}

// sznui.lib.component.ui-manage-test/Test_SearchBar [48] 
export function Test_SearchBar(){
  let [val,setVal] = React.useState("");
  return (
    <ui_manage.SearchBar value={val} onChangeText={setVal} placeholder="Search..."/>);
}

// sznui.lib.component.ui-manage-test/Test_FilterSelect [62] 
export function Test_FilterSelect(){
  let [val,setVal] = React.useState("all");
  return (
    <ui_manage.FilterSelect
      value={val}
      onValueChange={setVal}
      placeholder="Filter By"
      options={[
          {"value":"all","label":"All"},
          {"value":"active","label":"Active"},
          {"value":"inactive","label":"Inactive"}
        ]}/>);
}

// sznui.lib.component.ui-manage-test/Test_CreateButton [79] 
export function Test_CreateButton(){
  return (
    <ui_manage.CreateButton
      label="Create New Item"
      onPress={function (){
          alert("Create Clicked");
        }}/>);
}

// sznui.lib.component.ui-manage-test/Test_StatCard [91] 
export function Test_StatCard(){
  return (
    <T.XStack gap="$4">
      <ui_manage.StatCard label="Total Users" value="1,234" color="$blue10"/>
      <ui_manage.StatCard label="Active" value="89%" color="$green10"/>
    </T.XStack>);
}

export default Metadata