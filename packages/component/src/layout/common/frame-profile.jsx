import {Clock,Coins,LogOut,Menu,RotateCcw,Trophy,User} from '@tamagui/lucide-icons'

import React from 'react'

import * as T from 'tamagui'

import * as kd from '@xtalk/lang/common-data.js'

import * as ui_router from '@statstrade/component/ui-router.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

// statsui.basic.layout.common.frame-profile/MenuIconLink [18] 
export function MenuIconLink({icon,link,text,...props}){
  let Icon = icon || User;
  return (
    <T.Anchor href={link} textDecorationLine="none">
      <T.Button
        borderRadius={0}
        width="100%"
        paddingHorizontal={0}
        flex={1}
        borderWidth={0}
        paddingVertical="$3"
        backgroundColor="transparent"
        height="32px"
        {...props}>
        <T.XStack gap="$4" flex={1} alignItems="center">
          <Icon size={18} color="$color11"/>
          <T.Text
            fontSize="13px"
            color="$color11"
            hoverStyle={{"textDecorationLine":"underline"}}
            userSelect="none">{text || "HELLO"}
          </T.Text>
          <ui.Pad/>
        </T.XStack>
      </T.Button>
    </T.Anchor>);
}

// statsui.basic.layout.common.frame-profile/LayoutUserProfile [51] 
export function LayoutUserProfile({controls}){
  let api = ui.useApiContext();
  let user = kd.get_in(api,["queries","get_user","output"]) || {};
  let pathname = ui_router.usePathname();
  let isManager = pathname ? pathname.startsWith("/manage") : false;
  let {first_name,last_name} = user;
  let displayName = controls.handle || controls.email || "No Handle";
  let displayInitials = (controls.handle || controls.email || "S").substring(0,2);
  let displayColor = ui.getColor(controls.handle || controls.email || "Statstrade");
  return (
    <React.Fragment>
      <T.AnimatePresence>
        {controls.showProfileMenu ? (
          <T.View
            elevation="$8"
            animation="200ms"
            key="profile-menu"
            borderRadius="$4"
            top={70}
            overflow="hidden"
            borderColor="$borderColor"
            shadowRadius={20}
            width="280px"
            shadowOpacity={0.1}
            borderWidth={1}
            shadowColor="$shadowColor"
            enterStyle={{"opacity":0,"y":10,"scale":0.95}}
            opacity={1}
            exitStyle={{"opacity":0,"y":10,"scale":0.95}}
            zIndex={100001}
            right={20}
            position="absolute"
            backgroundColor="$color2"
            shadowOffset={{"width":0,"height":10}}>
            <T.Anchor
              href={isManager ? "/settings/profile" : ("/u/" + controls.handle)}
              textDecorationLine="none">
              <T.Button
                pressStyle={{"backgroundColor":"$color4"}}
                borderRadius={0}
                width="100%"
                paddingHorizontal="$4"
                hoverStyle={{"backgroundColor":"$color3","cursor":"pointer"}}
                borderWidth={0}
                paddingVertical="$4"
                justifyContent="flex-start"
                backgroundColor="transparent"
                height="auto">
                <T.YStack gap={2} alignItems="flex-start">
                  <T.Text fontSize="$4" fontWeight="700" color="$color12">{displayName}</T.Text>
                  {(first_name || last_name) ? (
                    <T.Text fontSize="$3" color="$color11">{first_name + " " + last_name}</T.Text>) : null}
                </T.YStack>
              </T.Button>
            </T.Anchor>
            <ui.Horizontal marginVertical={0}/>
            <T.YStack paddingVertical="$2">
              {!isManager ? (
                <React.Fragment>
                  <MenuIconLink
                    icon={Trophy}
                    link={"/u/" + controls.handle + "/achievements"}
                    text="My Achievements"
                    height={44}
                    paddingHorizontal="$4"/>
                  <MenuIconLink
                    icon={Clock}
                    link={"/u/" + controls.handle + "/history"}
                    text="Point History"
                    height={44}
                    paddingHorizontal="$4"/>
                </React.Fragment>) : null}
              {!isManager ? (
                <React.Fragment>
                  <MenuIconLink
                    icon={Trophy}
                    link={"/u/" + controls.handle + "/achievements"}
                    text="My Achievements"
                    height={44}
                    paddingHorizontal="$4"/>
                  <MenuIconLink
                    icon={Clock}
                    link={"/u/" + controls.handle + "/history"}
                    text="Point History"
                    height={44}
                    paddingHorizontal="$4"/>
                </React.Fragment>) : null}
            </T.YStack>
            <T.YStack paddingVertical="$2">
              <MenuIconLink
                icon={RotateCcw}
                text={isManager ? "Switch to Participant" : "Switch to Brand Manager"}
                link={isManager ? "/" : "/manage"}
                color="$color12"
                height={44}
                paddingHorizontal="$4"/>
              <T.Button
                onPress={function (){
                    api.mutations.sign_out.mutate();
                  }}
                pressStyle={{"backgroundColor":"$color4"}}
                borderRadius={0}
                paddingHorizontal="$4"
                hoverStyle={{"backgroundColor":"$color3","cursor":"pointer"}}
                borderWidth={0}
                justifyContent="flex-start"
                backgroundColor="transparent"
                height={44}>
                <T.XStack gap="$4" alignItems="center">
                  <LogOut size={18} color="$color11"/>
                  <T.Text fontSize="13px" color="$color11">Sign Out</T.Text>
                </T.XStack>
              </T.Button>
            </T.YStack>
          </T.View>) : null}
      </T.AnimatePresence>
      {controls.showProfileMenu ? (
        <T.View
          onPress={function (){
              controls.setShowProfileMenu(false);
            }}
          top={0}
          width="100vw"
          cursor="default"
          zIndex={100000}
          position="absolute"
          backgroundColor="transparent"
          height="100vh"
          left={0}/>) : null}
    </React.Fragment>);
}