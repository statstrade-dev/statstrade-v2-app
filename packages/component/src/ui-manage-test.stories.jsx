import React from 'react'

import * as T from 'tamagui'

import * as ui_manage from '@statstrade/component/ui-manage'

// statsui.basic.ui-manage-test/Metadata [15] 
export var Metadata = {[title]:"Components/ui-manage",[tags]:["autodoc"]};

// statsui.basic.ui-manage-test/Test_ManagerScreenHeader [21] 
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

// statsui.basic.ui-manage-test/Test_ScreenHeader [37] 
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

// statsui.basic.ui-manage-test/Test_SearchBar [51] 
export function Test_SearchBar(){
  let [val,setVal] = React.useState("");
  return (
    <ui_manage.SearchBar value={val} onChangeText={setVal} placeholder="Search..."/>);
}

// statsui.basic.ui-manage-test/Test_FilterSelect [65] 
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

// statsui.basic.ui-manage-test/Test_CreateButton [82] 
export function Test_CreateButton(){
  return (
    <ui_manage.CreateButton
      label="Create New Item"
      onPress={function (){
          alert("Create Clicked");
        }}/>);
}

// statsui.basic.ui-manage-test/Test_StatCard [94] 
export function Test_StatCard(){
  return (
    <T.XStack gap="$4">
      <ui_manage.StatCard label="Total Users" value="1,234" color="$blue10"/>
      <ui_manage.StatCard label="Active" value="89%" color="$green10"/>
    </T.XStack>);
}

export default Metadata