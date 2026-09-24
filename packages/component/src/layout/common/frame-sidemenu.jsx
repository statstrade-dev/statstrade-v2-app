import {Link2,X} from '@tamagui/lucide-icons'

import React from 'react'

import * as T from 'tamagui'

import * as ui from '@statstrade/component/ui-common.jsx'

import * as logo from '@statstrade/component/logo/logo-statstrade.jsx'

// statsui.basic.layout.common.frame-sidemenu/FrameSideMenuTop [14] 
export function FrameSideMenuTop({color,setShowMenu,...props}){
  return (
    <T.XStack
      alignItems="center"
      paddingHorizontal="20px"
      paddingTop="10px"
      paddingVertical="10px"
      {...props}>
      <logo.LogoStatstrade height={40} width={40} color={color}/>
      <ui.Pad/>
      <ui.ButtonOutlined
        borderWidth={0}
        height="45px"
        width="45px"
        padding="5px"
        color={color}
        size="$7"
        icon={X}
        onPress={function (){
            setShowMenu(false);
          }}/>
    </T.XStack>);
}

// statsui.basic.layout.common.frame-sidemenu/FrameSideMenuOverlay [42] 
export function FrameSideMenuOverlay({setShowMenu,...props}){
  return (
    <T.View
      backgroundColor="$color1"
      height="100%"
      onPress={function (){
          setShowMenu(false);
        }}
      opacity={0.1}
      position="absolute"
      width="100%"
      zIndex={100000}
      {...props}/>);
}

// statsui.basic.layout.common.frame-sidemenu/FrameSideMenu [58] 
export function FrameSideMenu({
  color,
  backgroundColor,
  showMenu,
  setShowMenu,
  children,
  bottom,
  overlayProps,
  topProps,
  ...props
}){
  return (
    <React.Fragment>
      <T.AnimatePresence>
        {showMenu ? (
          <T.View
            animation="200ms"
            key="frame-sidemenu"
            borderRadius="10px"
            shadowRadius={4}
            width="300px"
            shadowOpacity={0.1}
            paddingLeft="30px"
            paddingVertical="10px"
            shadowColor="$shadow6"
            enterStyle={{"x":-350}}
            themeInverse={true}
            exitStyle={{"x":-350}}
            zIndex={100001}
            position="absolute"
            backgroundColor="$color1"
            shadowOffset={{"width":3}}
            height="100%"
            left="-30px">
            <FrameSideMenuTop
              color={color}
              backgroundColor={backgroundColor}
              setShowMenu={setShowMenu}
              {...topProps}/>
            <T.ScrollView><T.YStack>{children}</T.YStack></T.ScrollView>
            {bottom}
          </T.View>) : null}
      </T.AnimatePresence>
      {showMenu ? (
        <FrameSideMenuOverlay
          color={color}
          backgroundColor={backgroundColor}
          setShowMenu={setShowMenu}
          {...overlayProps}/>) : null}
    </React.Fragment>);
}