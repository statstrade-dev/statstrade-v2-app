import * as T from 'tamagui'

import React from 'react'

import * as page_proxy from '@xtalk/substrate/page-proxy.js'

import * as sb from '@statstrade/edge/remote/util-supabase.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

import * as admin_layout from '@statstrade/component/layout/layout-admin.jsx'

import * as ext_page from '@statstrade/edge/lib/js/react/ext-page.js'

import * as routes from '@statstrade/component/layout/admin-routes.jsx'

// statsui.basic.layout.admin-page/organisationHref [17] 
export function organisationHref(org){
  return "/organisation/" + (org.name || org.id);
}

// statsui.basic.layout.admin-page/userHref [24] 
export function userHref(user){
  return "/u/" + (user.handle || user.id);
}

// statsui.basic.layout.admin-page/loadAdminDirectory [31] 
export async function loadAdminDirectory(){
  let client = sb.getClient();
  let organisations_response = await client.schema("stats_type").from("Org").select("id,name,title,description,picture").order("name");
  if(organisations_response.error){
    throw organisations_response.error;
  }
  let users_response = await client.schema("stats_type").from("User").select("id,handle,first_name,last_name,picture,is_active,is_super").order("handle");
  if(users_response.error){
    throw users_response.error;
  }
  return {
    "organisations":organisations_response.data || [],
    "users":users_response.data || []
  };
}

// statsui.basic.layout.admin-page/DirectoryLink [56] 
export function DirectoryLink({href,title,detail}){
  return (
    <ui.Link
      href={href}
      display="flex"
      padding="$3"
      borderWidth={1}
      borderColor="$color4"
      borderRadius="$2"
      hoverStyle={{"backgroundColor":"$color2"}}>
      <T.YStack gap="$1">
        <T.Text fontWeight="600">{title}</T.Text>
        <T.Text fontSize="$2" color="$color10">{detail}</T.Text>
      </T.YStack>
    </ui.Link>);
}

// statsui.basic.layout.admin-page/OrganisationListSection [75] 
export function OrganisationListSection({organisations}){
  let rows = (organisations.length > 0) ? (organisations || []).map(function (org){
    return (
      <DirectoryLink
        key={org.id}
        href={organisationHref(org)}
        title={org.title || org.name || org.id}
        detail={org.name || org.id}/>);
  }) : (
    <T.Text color="$color10">No organisations found.</T.Text>);
  return (
    <T.YStack gap="$2"><T.H3 fontSize="$5">Organisations</T.H3>{rows}</T.YStack>);
}

// statsui.basic.layout.admin-page/UserListSection [97] 
export function UserListSection({users}){
  let rows = (users.length > 0) ? (users || []).map(function (user){
    return (
      <DirectoryLink
        key={user.id}
        href={userHref(user)}
        title={user.handle || user.id}
        detail={((user.first_name || "") + " " + (user.last_name || "")) || user.id}/>);
  }) : (
    <T.Text color="$color10">No users found.</T.Text>);
  return (
    <T.YStack gap="$2"><T.H3 fontSize="$5">Users</T.H3>{rows}</T.YStack>);
}

// statsui.basic.layout.admin-page/AdminOrganisationSection [122] 
export function AdminOrganisationSection(){
  let [directory,setDirectory] = React.useState(
    {"status":"loading","organisations":[],"users":[],"error":null}
  );
  React.useEffect(function (){
    let alive = true;
    let run = async function run(){
      try{
        let data = await loadAdminDirectory();
        if(alive){
          setDirectory({
            "status":"ready",
            "organisations":data.organisations,
            "users":data.users,
            "error":null
          });
        }
      }
      catch(e){
        if(alive){
          setDirectory({
            "status":"error",
            "organisations":[],
            "users":[],
            "error":"Unable to load the admin directory."
          });
        }
      }
    };
    run();
    return function (){
      alive = false;
    };
  },[]);
  let {error,organisations,status,users} = directory;
  let body = (status == "loading") ? (
    <T.Spinner size="small"/>) : (error ? (
    <T.Text color="$red10">{error}</T.Text>) : (
    <T.YStack gap="$5">
      <OrganisationListSection organisations={organisations}/>
      <UserListSection users={users}/>
    </T.YStack>));
  return (
    <T.ScrollView
      flex={1}
      contentContainerStyle={{"gap":20,"paddingBottom":"$5"}}>{body}
    </T.ScrollView>);
}

// statsui.basic.layout.admin-page/PingPanel [171] 
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

// statsui.basic.layout.admin-page/SectionTabs [237] 
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

// statsui.basic.layout.admin-page/AdminSection [258] 
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
        <PingPanel client={resource["client"]}/>) : ((metadata.key == "manage/organisation") ? (
        <AdminOrganisationSection/>) : (
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
        </T.YStack>))}
    </T.YStack>);
}

// statsui.basic.layout.admin-page/AdminApp [290] 
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