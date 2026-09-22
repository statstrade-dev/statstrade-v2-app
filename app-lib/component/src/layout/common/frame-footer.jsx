import {Github,Instagram,Linkedin} from '@tamagui/lucide-icons'

import * as T from 'tamagui'

import React from 'react'

import * as ui_router from '@statstrade/component/ui-router.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

// statsui.basic.layout.common.frame-footer/MenuLink [14] 
export function MenuLink({children,href,exact,...props}){
  let path = ui_router.usePathname();
  let active = exact ? (href == path) : ((path != "/") && href.startsWith(path));
  return (
    <ui.ButtonLink
      color="$color12"
      disabled={active}
      fontSize="14px"
      href={!active ? href : null}
      padding={0}
      size="$3"
      {...props}>{children}
    </ui.ButtonLink>);
}

// statsui.basic.layout.common.frame-footer/FooterIcons [35] 
export function FooterIcons({links,...props}){
  return (
    <T.XStack gap="$4" {...props}>
      {(links || []).map(function ({name,icon,href,...props}){
        return (
          <MenuLink
            href={href}
            key={name}
            rel="noopener noreferror"
            target="_blank"
            {...props}>{React.createElement(icon,{"color":"$color12"})}
          </MenuLink>);
      })}
    </T.XStack>);
}

// statsui.basic.layout.common.frame-footer/FooterGroup [51] 
export function FooterGroup({title,links,...props}){
  return (
    <T.YStack flex={1} gap="$2" {...props}>
      {title ? (
        <T.Text color="$color" fontWeight="600" marginVertical="$2">{title}</T.Text>) : null}
      {links.map(function ({key,title,icon,href,...props}){
        return (
          <MenuLink href={href} key={key} {...props}>{title}</MenuLink>);
      })}
    </T.YStack>);
}

// statsui.basic.layout.common.frame-footer/FrameFooterSocial [73] 
export function FrameFooterSocial({...props}){
  return (
    <FooterIcons
      links={[
          {
                "href":"https://www.github.com/statstrade",
                "icon":Github,
                "name":"Github"
              },
          {
                "href":"https://www.linkedin.com/company/statstrade-io",
                "icon":Linkedin,
                "name":"Linkedin"
              },
          {
                "href":"https://www.instagram.com/statstrade.io",
                "icon":Instagram,
                "name":"Instagram"
              }
        ]}
      {...props}/>);
}

// statsui.basic.layout.common.frame-footer/FrameFooterLegal [90] 
export function FrameFooterLegal({...props}){
  return (
    <FooterGroup
      links={[
          {"href":"/about/terms","key":"terms","title":ui.t("Terms")},
          {
                "href":"/about/privacy",
                "key":"privacy",
                "title":ui.t("Privacy")
              },
          {
                "href":"/about/cookies",
                "key":"cookies",
                "title":ui.t("Cookies")
              }
        ]}
      {...props}/>);
}

// statsui.basic.layout.common.frame-footer/FrameFooterBottom [107] 
export function FrameFooterBottom({...props}){
  return React.createElement(T.YStack,{
    "alignItems":"center",
    "flex":1,
    "gap":"$2",
    "minHeight":40,
    "paddingTop":"1em",
    "zIndex":10,
    ...props
  },(
    <FrameFooterLegal
      gap="$4"
      $sm={{"justifyContent":"left","alignItems":"left"}}
      alignItems="right"
      flexDirection="row"/>),(
    <T.View flex={1} display="flex" $sm={{"display":"none"}}/>),(
    <T.Text alignItems="left" fontSize="14px" maxWidth="400px">Copyright © 2025 Statstrade</T.Text>));
}

// statsui.basic.layout.common.frame-footer/FrameFooter [137] 
export function FrameFooter({hideSocial,hideSite,hideLegal,...props}){
  let {sm} = T.useMedia();
  return (
    <T.YStack
      paddingHorizontal="30px"
      paddingBottom="$3"
      paddingTop="$5"
      backgroundColor="$color1">
      {!hideSite ? (
        <T.YStack
          flex={1}
          minHeight={80}
          gap="$2"
          flexDirection="row"
          $sm={{"flexDirection":"column"}}>
          <FooterGroup
            links={[
                {"key":"home","title":"Home","href":"/","exact":true},
                {"key":"features","title":"Features","href":"/about/features"},
                {"key":"pricing","title":"Pricing","href":"/about/pricing"}
              ]}/>
          <FooterGroup links={[{"key":"blog","title":"Blog","href":"/blog"}]}/>
          {!hideSocial ? (
            <FrameFooterSocial $sm={{"marginTop":"$5"}} marginTop={0} marginBottom="$2"/>) : null}
        </T.YStack>) : null}
      {!hideLegal ? (
        <FrameFooterBottom/>) : null}
    </T.YStack>);
}