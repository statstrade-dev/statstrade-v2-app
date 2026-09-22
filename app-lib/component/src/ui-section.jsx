import * as T from 'tamagui'

import React from 'react'

import * as k from '@xtalk/lang/common-lib.js'

import * as ui from '@statstrade/component/ui-common.jsx'

import * as logo from '@statstrade/component/logo/logo-statstrade.jsx'

// statsui.basic.ui-section/SectionMinLogo [23] 
export function SectionMinLogo({logo,logoProps,title,titleProps}){
  return (
    <T.YStack
      space="$3"
      paddingBottom="$6"
      borderBottomColor="$color2"
      alignContent="center"
      alignItems="center">
      <T.YStack>
        {logo ? (k.is_functionp(logo) ? React.createElement(logo,logoProps) : logo) : null}
      </T.YStack>
      <T.YStack>
        {title ? (k.is_functionp(title) ? React.createElement(title,titleProps) : title) : null}
      </T.YStack>
    </T.YStack>);
}

// statsui.basic.ui-section/SectionMinInfo [39] 
export function SectionMinInfo({body,children,left,logo,right,title}){
  return (
    <T.View flex={1}>
      <T.YStack
        gap="$10"
        flex={1}
        justifyContent="center"
        alignItems="center"
        align="center">
        <T.YStack gap="$10" justifyContent="center" alignItems="center">
          {title ? (
            <T.YStack>
              {title ? (k.is_functionp(title) ? React.createElement(title,{}) : title) : null}
            </T.YStack>) : null}
          {body ? (
            <T.YStack>
              {body ? (k.is_functionp(body) ? React.createElement(body,{}) : body) : null}
            </T.YStack>) : null}
          {logo ? (
            <T.YStack>
              {logo ? (k.is_functionp(logo) ? React.createElement(logo,{}) : logo) : null}
            </T.YStack>) : null}
        </T.YStack>
        <T.XStack gap="$10" justifyContent="center" alignItems="center">
          {left ? (
            <T.YStack>
              {left ? (k.is_functionp(left) ? React.createElement(left,{}) : left) : null}
            </T.YStack>) : null}
          {right ? (
            <T.YStack>
              {right ? (k.is_functionp(right) ? React.createElement(right,{}) : right) : null}
            </T.YStack>) : null}
        </T.XStack>
        {children}
      </T.YStack>
    </T.View>);
}

// statsui.basic.ui-section/FullScreenCentered [72] 
export function FullScreenCentered({leftAction,rightAction,maxWidth,children,...props}){
  return (
    <T.YStack
      gap="$10"
      flex={1}
      width="100%"
      paddingHorizontal="$2"
      $xs={{"paddingHorizontal":"$6","paddingVertical":"$10"}}
      alignItems="center">
      <T.YStack
        maxWidth={maxWidth || "460px"}
        width="100%"
        paddingTop="$6"
        paddingBottom="$6"
        paddingHorizontal="$2"
        $xs={{
            "borderWidth":1,
            "borderColor":"$color1",
            "paddingHorizontal":"$6"
          }}>
        <T.View
          display="none"
          position="absolute"
          top={0}
          bottom={0}
          left={0}
          right={0}
          $xs={{"display":"block"}}/>
        <T.XStack flex={1} alignItems="center" justifyContent="center">{leftAction}<ui.Pad/>{rightAction}</T.XStack>
        <T.View height={20}/>
        {children}
      </T.YStack>
    </T.YStack>);
}

// statsui.basic.ui-section/FullScreenHeader [124] 
export function FullScreenHeader({title}){
  return (
    <SectionMinLogo
      logo={(
          <ui.Link href="/" cursor="pointer"><logo.LogoStatstrade size={60}/></ui.Link>)}
      title={(
          <T.H3 fontSize="$9">{title}</T.H3>)}/>);
}

// statsui.basic.ui-section/MinHeader [141] 
export function MinHeader({logo,title,titleProps,paragraph,paragraphProps,...props}){
  return (
    <T.YStack
      alignItems="center"
      flex={1}
      justifyContent="center"
      marginVertical="$5"
      {...props}>
      {logo}
      {title ? (
        <T.H2 letterSpacing="0" textAlign="center" {...titleProps}>{title}</T.H2>) : null}
      {paragraph ? (
        <T.Text
          color="$color10"
          fontSize="$5"
          padding="$4"
          textAlign="center"
          {...paragraphProps}>{paragraph}
        </T.Text>) : null}
    </T.YStack>);
}

// statsui.basic.ui-section/MinFrameCenter [159] 
export function MinFrameCenter({children,...props}){
  return (
    <T.YStack
      alignItems="center"
      justifyContent="center"
      flex={1}
      paddingTop="60px"
      paddingHorizontal="$6"
      $sm={{"paddingHorizontal":"$4"}}
      width="100%">
      <T.YStack
        flex={1}
        justifyContent="center"
        maxWidth={600}
        width="100%"
        {...props}>{children}
      </T.YStack>
    </T.YStack>);
}