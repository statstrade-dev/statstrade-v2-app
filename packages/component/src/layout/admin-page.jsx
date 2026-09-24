import React from 'react'

import * as T from 'tamagui'

import * as page_proxy from '@xtalk/substrate/page-proxy.js'

import * as admin_layout from '@statstrade/component/layout/layout-admin.jsx'

import * as ext_page from '@statstrade/edge/lib/js/react/ext-page.js'

import * as routes from '@statstrade/component/layout/admin-routes.jsx'

// statsui.basic.layout.admin-page/PingPanel [15] 
export function PingPanel({client}){
  let output = ext_page.listenModel(client,"room/superadmin",["system","ping"],"output",{});
  let [busy,setBusy] = React.useState(false);
  let [error,setError] = React.useState(null);
  let onPing = async function (){
    if(!busy){
      setBusy(true);
      setError(null);
      try{
        await page_proxy.model_proxy_call(client,"room/superadmin","system","ping",[],true,{});
      }
      catch(e){
        setError("The substrate call failed.");
      }
      finally{
        setBusy(false);
      }
    }
  };
  let output_text = ((typeof output) == "string") ? output : JSON.stringify(output);
  return (
    <T.YStack
      gap="$3"
      padding="$4"
      borderWidth={1}
      borderColor="$color4"
      borderRadius="$3"
      backgroundColor="$background">
      <T.XStack alignItems="center" justifyContent="space-between">
        <T.YStack gap="$1">
          <T.Text fontWeight="600">Substrate health</T.Text>
          <T.Text color="$color10" fontSize="$2">Reactive output from room/superadmin/system/ping</T.Text>
        </T.YStack>
        <T.Button size="$3" disabled={busy} onPress={onPing}>{busy ? "Pinging..." : "Ping"}</T.Button>
      </T.XStack>
      <T.Text
        fontFamily="monospace"
        color="$color11"
        padding="$2"
        backgroundColor="$color2">{output_text || "ready"}
      </T.Text>
      {error ? (
        <T.Text color="$red10">{error}</T.Text>) : null}
    </T.YStack>);
}

// statsui.basic.layout.admin-page/SectionTabs [81] 
export function SectionTabs({group,active,onSelect}){
  let sections = routes.sectionsFor(group);
  return (
    <T.XStack gap="$2" flexWrap="wrap">
      {sections.map(function (item){
        return (
          <T.Button
            key={item.key}
            size="$2"
            chromeless={true}
            backgroundColor={(active == item.key) ? "$color3" : "transparent"}
            onPress={function (){
                onSelect(item.key);
              }}>{item.title}
          </T.Button>);
      })}
    </T.XStack>);
}

// statsui.basic.layout.admin-page/AdminSection [102] 
export function AdminSection({client,group,section,resource,onSection}){
  let metadata = routes.getSection(group,section);
  return (
    <T.YStack gap="$4" flex={1}>
      <SectionTabs group={group} active={metadata.key} onSelect={onSection}/>
      <T.YStack gap="$2">
        <T.H2>{metadata.title}</T.H2>
        <T.Text color="$color10">{metadata.description}</T.Text>
      </T.YStack>
      {(metadata.key == "home/dashboard") ? (
        <PingPanel client={resource["client"]}/>) : (
        <T.YStack
          padding="$5"
          borderWidth={1}
          borderColor="$color4"
          borderRadius="$3"
          backgroundColor="$background">
          <T.Text fontWeight="600">Section ready</T.Text>
          <T.Text color="$color10">
            The modular page shell is active. Add the domain body for this section here.
          </T.Text>
        </T.YStack>)}
    </T.YStack>);
}

// statsui.basic.layout.admin-page/AdminApp [132] 
export function AdminApp({resource}){
  let [group,setGroup] = React.useState(routes.F01_HOME);
  let [section,setSection] = React.useState("dashboard");
  let metadata = routes.getSection(group,section);
  let onNavigate = function (next_group){
    setGroup(next_group);
    setSection(routes.defaultSection(next_group));
  };
  let onSection = function (route){
    setSection(routes.sectionKey(route));
  };
  return (
    <admin_layout.LayoutAdmin
      navigation={routes.NAVIGATION}
      active={group}
      onNavigate={onNavigate}
      title={metadata.title}>
      <AdminSection
        client={resource["client"]}
        group={group}
        section={section}
        resource={resource}
        onSection={onSection}/>
    </admin_layout.LayoutAdmin>);
}