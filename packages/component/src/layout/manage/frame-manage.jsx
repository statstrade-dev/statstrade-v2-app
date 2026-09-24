import 
  {BarChart,Bell,Check,ChevronDown,ChevronLeft,ChevronRight,Clock,CreditCard,House,LayoutList,MoreHorizontal,Package,Plus,Rocket,Settings,Sun,Terminal,Users,Wallet}
 from '@tamagui/lucide-icons'

import * as T from 'tamagui'

import React from 'react'

import * as kd from '@xtalk/lang/common-data.js'

import * as ui_router from '@statstrade/component/ui-router.jsx'

import * as frame_profile from '@statstrade/component/layout/common/frame-profile.jsx'

import * as site_manage from '@statstrade/component/layout/manage/frame-manage-site.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

import * as frame_manage_organisation from '@statstrade/component/layout/manage/frame-manage-organisation.jsx'

import * as frame_manage_blank from '@statstrade/component/layout/manage/frame-manage-blank.jsx'

import * as global_store from '@statstrade/edge/global-store.jsx'

import * as context_manage from '@statstrade/component/layout/manage/context-manage.jsx'

import * as logo_statstrade from '@statstrade/component/logo/logo-statstrade.jsx'

// statsui.basic.layout.manage.frame-manage/SidebarTooltipWrapper [26] 
export function SidebarTooltipWrapper({children,collapsed,label}){
  if(collapsed){
    return (
      <T.Tooltip placement="right" delay={0} restMs={0}>
        <T.Tooltip.Trigger asChild={true}>{children}</T.Tooltip.Trigger>
        <T.Tooltip.Content
          enterStyle={{"x":-10,"opacity":0}}
          exitStyle={{"x":-10,"opacity":0}}
          x={0}
          scale={1}
          opacity={1}
          animation="quick">
          <T.Tooltip.Arrow/>
          <T.Paragraph size="$2" lineHeight="$1">{label}</T.Paragraph>
        </T.Tooltip.Content>
      </T.Tooltip>);
  }
  else{
    return children;
  }
}

// statsui.basic.layout.manage.frame-manage/ManagerSidebarItem [42] 
export function ManagerSidebarItem({item,isActive,onSelect,level}){
  let [expanded,setExpanded] = React.useState(false);
  let hasChildren = item.children && (item.children.length > 0);
  let paddingLeft = level ? (24 + (level * 16)) : 12;
  return (
    <T.YStack marginBottom={2}>
      <T.Button
        onPress={function (){
            if(hasChildren){
              setExpanded(!expanded);
            }
            else{
              onSelect(item);
            }
          }}
        pressStyle={{"backgroundColor":"$color4"}}
        borderRadius="$2"
        paddingRight={12}
        paddingLeft={paddingLeft}
        hoverStyle={{"backgroundColor":"$color3"}}
        chromeless={true}
        justifyContent="flex-start"
        backgroundColor={(isActive && !hasChildren) ? "$color3" : "transparent"}
        height={32}>
        <T.XStack alignItems="center" gap="$3" flex={1}>
          {item.icon ? (
            <item.icon size={16} color="$color11"/>) : null}
          <T.Text
            fontSize="$3"
            color="$color12"
            fontWeight={isActive ? "600" : "400"}>{item.label}
          </T.Text>
          {hasChildren ? (
            <T.View marginLeft="auto">
              {expanded ? (
                <ChevronDown size={14} color="$color10"/>) : (
                <ChevronRight size={14} color="$color10"/>)}
            </T.View>) : null}
        </T.XStack>
      </T.Button>
      {(hasChildren && expanded) ? (
        <T.YStack marginTop={2}>
          {item.children.map(function (child){
            return (
              <ManagerSidebarItem
                key={child.id}
                item={child}
                level={(level || 0) + 1}
                isActive={isActive == child.id}
                onSelect={onSelect}/>);
          })}
        </T.YStack>) : null}
    </T.YStack>);
}

// statsui.basic.layout.manage.frame-manage/ManagerSidebarSection [93] 
export function ManagerSidebarSection({title,items,activeView,onViewChange}){
  return (
    <T.YStack marginBottom="$6">
      {title ? (
        <T.Text
          fontSize={12}
          color="$color10"
          fontWeight="600"
          marginBottom="$2"
          paddingLeft={12}>{title}
        </T.Text>) : null}
      {items.map(function (item){
        return (
          <ManagerSidebarItem
            key={item.id}
            item={item}
            isActive={activeView == item.id}
            onSelect={function (i){
                onViewChange(i.id);
              }}/>);
      })}
    </T.YStack>);
}

// statsui.basic.layout.manage.frame-manage/ManagerTopBar [115] 
export function ManagerTopBar({collapsed}){
  let {api,controls} = React.useContext(context_manage.LayoutManageContext);
  let user = kd.get_in(api,["queries","get_user","output"]) || {};
  let userHandle = user.handle || controls.email || "Statstrade";
  let rawColor = ui.getColor(userHandle) || "$blue10";
  let themeColors = ui.useThemeColors([["bg",rawColor]]);
  let displayColor = themeColors.bg.string();
  let displayInitials = userHandle.substring(0,1).toUpperCase();
  return (
    <T.XStack
      height={64}
      backgroundColor="$color1"
      borderBottomWidth={1}
      borderColor="$borderColor"
      alignItems="center"
      paddingHorizontal="$4"
      justifyContent="space-between">
      <T.XStack alignItems="center" gap="$4">
        {controls.topBar ? controls.topBar : (
          <T.Text fontSize="$5" fontWeight="600" color="$color12">Dashboard</T.Text>)}
      </T.XStack>
      <T.XStack alignItems="center" gap="$2">
        <T.Button
          chromeless={true}
          onPress={controls.toggleTheme}
          paddingHorizontal="$2"><Sun size={22}/>
        </T.Button>
        <T.Button chromeless={true} paddingHorizontal="$2"><Bell size={22}/></T.Button>
        <T.Button
          chromeless={true}
          padding={0}
          marginHorizontal="$2"
          circular={true}
          onPress={function (){
              controls.setShowProfileMenu(!controls.showProfileMenu);
            }}>
          <T.Avatar
            circular={true}
            size="$3"
            borderWidth={1}
            borderColor="$color8">
            <T.AvatarImage src={user.picture_url}/>
            <T.AvatarFallback
              delayMs={0}
              backgroundColor={displayColor}
              alignItems="center"
              justifyContent="center">
              <T.Text fontSize={16} color="white" fontWeight="600">{displayInitials}</T.Text>
            </T.AvatarFallback>
          </T.Avatar>
        </T.Button>
      </T.XStack>
    </T.XStack>);
}

// statsui.basic.layout.manage.frame-manage/ManagerSidebar [166] 
export function ManagerSidebar({collapsed,hideNav,isEmpty,onToggleSidebar}){
  let {api,controls} = React.useContext(context_manage.LayoutManageContext);
  let [org,setOrg] = global_store.useStore(["context","organisation"]);
  let router = ui_router.useRouter();
  let pathname = ui_router.usePathname();
  let displayOrg = org || {
    "name":"Statstrade",
    "tier":"free",
    "initials":"S",
    "color":"$color3"
  };
  let initials = org ? (org.initials || org.name.substring(0,1)) : "S";
  let isPlaceholder = !org || (org.name == "Statstrade");
  let SidebarToggleIcon = collapsed ? ChevronRight : ChevronLeft;
  let q_orgs = api.queries.organisations_list;
  let orgs = q_orgs.output || [];
  let navGroups = isEmpty ? [] : site_manage.navGroups;
  return (
    <T.YStack
      width={collapsed ? 64 : 240}
      height="100%"
      backgroundColor="$color1"
      borderRightWidth={1}
      borderColor="$borderColor"
      paddingVertical="$4"
      paddingHorizontal={collapsed ? "$2" : "$2"}
      animation="quick">
      <T.Popover
        open={controls.showOrgSelector}
        onOpenChange={controls.setShowOrgSelector}
        placement="bottom-start"
        offset={4}>
        <T.Popover.Trigger asChild={true}>
          <T.Button
            height={56}
            justifyContent={collapsed ? "center" : "flex-start"}
            paddingHorizontal="$3"
            marginBottom="$6"
            backgroundColor="$color1"
            hoverStyle={{"backgroundColor":"$color3"}}
            pressStyle={{"backgroundColor":"$color2"}}
            onPress={function (){
                controls.setShowOrgSelector(!controls.showOrgSelector);
              }}>
            <T.XStack
              alignItems="center"
              gap="$3"
              width="100%"
              justifyContent={collapsed ? "center" : "flex-start"}>
              {isPlaceholder ? (
                <logo_statstrade.LogoStatstrade size={28} color="$color12"/>) : (
                <T.View
                  width={32}
                  height={32}
                  borderRadius="$2"
                  backgroundColor={displayOrg.color || "$color4"}
                  alignItems="center"
                  justifyContent="center">
                  <T.Text fontWeight="bold" color="$color11">{initials}</T.Text>
                </T.View>)}
              {!collapsed ? (
                <T.YStack gap={0} opacity={1} flex={1} alignItems="flex-start">
                  <T.Text fontSize="$3" fontWeight="600" color="$color12">{displayOrg.name}</T.Text>
                </T.YStack>) : null}
              {!collapsed ? (
                <ChevronDown size={16} color="$color10"/>) : null}
            </T.XStack>
          </T.Button>
        </T.Popover.Trigger>
        <T.Popover.Content
          elevation="$8"
          animation={["quick",{"opacity":{"overshootClamping":true}}]}
          borderRadius="$4"
          borderColor="$borderColor"
          shadowRadius={20}
          width={260}
          shadowOpacity={0.1}
          borderWidth={1}
          shadowColor="$shadowColor"
          enterStyle={{"y":-10,"opacity":0}}
          elevate={true}
          padding="$2"
          exitStyle={{"y":-10,"opacity":0}}
          shadowOffset={{"width":0,"height":4}}>
          <T.Popover.Arrow borderWidth={1} borderColor="$borderColor"/>
          <T.YStack>
            <T.Text
              fontSize={11}
              color="$color10"
              fontWeight="600"
              textTransform="uppercase"
              letterSpacing={1}
              marginBottom="$2"
              paddingHorizontal="$2"
              paddingTop="$2">Select Organisation
            </T.Text>
            {orgs.map(function (item){
              return (
                <T.Button
                  onPress={function (){
                      setOrg(item);
                      controls.setShowCreateOrg(false);
                      controls.setShowOrgSelector(false);
                    }}
                  key={item.id}
                  borderRadius="$3"
                  hoverStyle={{
                      "backgroundColor":(item.id == displayOrg.id) ? "$color3" : "$color2"
                    }}
                  chromeless={true}
                  justifyContent="flex-start"
                  marginBottom={2}
                  backgroundColor={(item.id == displayOrg.id) ? "$color3" : "transparent"}
                  height={48}>
                  <T.XStack gap="$3" alignItems="center" width="100%">
                    <T.View
                      width={28}
                      height={28}
                      borderRadius="$1"
                      backgroundColor={item.color || "$color4"}
                      alignItems="center"
                      justifyContent="center">
                      <T.Text fontSize={11} fontWeight="700" color="$color11">{item.initials || item.name.substring(0,1)}</T.Text>
                    </T.View>
                    <T.YStack flex={1} gap={0} alignItems="flex-start">
                      <T.Text color="$color12" fontWeight="600" fontSize="$3">{item.name}</T.Text>
                    </T.YStack>
                    {(item.id == displayOrg.id) ? (
                      <Check size={14} color="$color11"/>) : null}
                  </T.XStack>
                </T.Button>);
            })}
            <T.View height={1} backgroundColor="$borderColor" marginVertical="$2"/>
            <T.Button
              chromeless={true}
              justifyContent="flex-start"
              height={48}
              borderRadius="$3"
              onPress={function (){
                  controls.setShowCreateOrg(true);
                  controls.setShowOrgSelector(false);
                }}>
              <T.XStack gap="$3" alignItems="center">
                <T.View
                  width={28}
                  height={28}
                  borderRadius="$1"
                  borderWidth={1}
                  borderColor="$color8"
                  borderStyle="dashed"
                  alignItems="center"
                  justifyContent="center"><Plus size={14} color="$color11"/>
                </T.View>
                <T.Text color="$color12" fontSize="$3">Create New Organisation</T.Text>
              </T.XStack>
            </T.Button>
          </T.YStack>
        </T.Popover.Content>
      </T.Popover>
      {(!hideNav && (navGroups.length > 0)) ? (
        <T.ScrollView flex={1} showsVerticalScrollIndicator={false}>
          {navGroups.map(function (group,idx){
            return (
              <T.YStack key={idx} marginBottom="$6">
                {(group.title && !collapsed) ? (
                  <T.Text
                    fontSize={12}
                    color="$color10"
                    fontWeight="600"
                    marginBottom="$3"
                    paddingLeft={12}>{group.title}
                  </T.Text>) : null}
                <T.YStack gap="$1">
                  {group.items.map(function (item){
                    let isActive = (item.path == "/manage") ? (pathname == "/manage") : pathname.startsWith(item.path);
                    return (
                      <SidebarTooltipWrapper key={item.id} label={item.label} collapsed={collapsed}>
                        <T.Button
                          onPress={function (){
                              if(item.path){
                                router.push(item.path);
                              }
                            }}
                          borderRadius="$2"
                          paddingRight={collapsed ? 0 : 12}
                          paddingLeft={collapsed ? 0 : 12}
                          hoverStyle={{"backgroundColor":"$color3"}}
                          chromeless={true}
                          justifyContent={collapsed ? "center" : "flex-start"}
                          backgroundColor={isActive ? "$color3" : "transparent"}
                          height={40}>
                          <T.XStack
                            alignItems="center"
                            gap="$3"
                            flex={1}
                            justifyContent={collapsed ? "center" : "flex-start"}>
                            <item.icon size={18} color={isActive ? "$color12" : "$color11"}/>
                            {!collapsed ? (
                              <T.Text
                                fontSize="$3"
                                color="$color12"
                                fontWeight={isActive ? "600" : "400"}>{item.label}
                              </T.Text>) : null}
                          </T.XStack>
                        </T.Button>
                      </SidebarTooltipWrapper>);
                  })}
                </T.YStack>
              </T.YStack>);
          })}
        </T.ScrollView>) : null}
      <T.YStack
        marginTop="auto"
        paddingTop="$4"
        borderTopWidth={1}
        borderColor="$borderColor"
        alignItems={collapsed ? "center" : "flex-start"}>
        <T.Button
          chromeless={true}
          justifyContent="center"
          alignItems="center"
          size="$3"
          alignSelf={collapsed ? "center" : "flex-end"}
          marginRight={collapsed ? 0 : "$2"}
          onPress={onToggleSidebar}>
          <T.View
            hoverStyle={{"scale":1.1}}
            pressStyle={{"scale":0.95}}
            animation="quick"><SidebarToggleIcon size={20} color="$color11"/>
          </T.View>
        </T.Button>
      </T.YStack>
    </T.YStack>);
}

// statsui.basic.layout.manage.frame-manage/LayoutManage [361] 
export function LayoutManage({children}){
  let {api,controls} = React.useContext(context_manage.LayoutManageContext);
  let media = T.useMedia();
  let isSmall = !media.gtSm;
  let [collapsed,setCollapsed] = React.useState(isSmall);
  React.useEffect(function (){
    setCollapsed(isSmall);
  },[isSmall]);
  let q_orgs = api.queries.organisations_list;
  let orgs = q_orgs.output || [];
  let isEmpty = !q_orgs.isLoading && (orgs.length == 0);
  let router = ui_router.useRouter();
  let pathname = ui_router.usePathname();
  React.useEffect(function (){
    if(isEmpty && (pathname !== "/manage")){
      router.push("/manage");
    }
  },[isEmpty,pathname]);
  return (
    <T.XStack flex={1} height="100dvh">
      <ManagerSidebar
        onToggleSidebar={function (){
            setCollapsed(!collapsed);
          }}
        collapsed={collapsed}
        isEmpty={isEmpty}
        hideNav={controls.showCreateOrg}/>
      <T.YStack flex={1} overflow="hidden">
        {controls.showCreateOrg ? (
          <frame_manage_organisation.DashboardOrgSetup
            onClose={function (){
                controls.setShowCreateOrg(false);
              }}
            onSuccess={function (){
                
              }}/>) : (
          <T.YStack flex={1}>
            <ManagerTopBar collapsed={collapsed}/>
            {isEmpty ? (
              <frame_manage_blank.FrameManageBlank/>) : (
              <T.ScrollView flex={1} contentContainerStyle={{"flexGrow":1}}>{children}</T.ScrollView>)}
          </T.YStack>)}
      </T.YStack>
    </T.XStack>);
}

// statsui.basic.layout.manage.frame-manage/LayoutManageWrapper [413] 
export function LayoutManageWrapper({children,setUserType,userType}){
  let context = context_manage.useLayoutManageContext({"userType":userType,"setUserType":setUserType});
  return (
    <context_manage.LayoutManageContext.Provider value={context}>
      <T.Theme name={context.controls.theme}>
        <frame_profile.LayoutUserProfile controls={context.controls}/>
        <LayoutManage>{children}</LayoutManage>
      </T.Theme>
    </context_manage.LayoutManageContext.Provider>);
}