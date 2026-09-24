import * as T from 'tamagui'

import * as lf from '@statstrade/component/layout/common/frame-footer.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

import * as logo from '@statstrade/component/logo/logo-statstrade.jsx'

// statsui.basic.layout.layout-auth/LayoutAuthHeader [19] 
export function LayoutAuthHeader({session}){
  return (
    <T.XStack display="flex" flex={1} alignItems="center" paddingLeft="$3">
      <ui.Link href="/">
        <ui.ButtonNormal backgroundColor="transparent" paddingHorizontal="5px">
          <T.XStack alignItems="center"><logo.LogoStatstrade width={35} color="$color12"/></T.XStack>
        </ui.ButtonNormal>
      </ui.Link>
      <ui.Pad/>
      <ui.ThemeSwitch size="$7" color="$color12" backgroundColor="$color1"/>
    </T.XStack>);
}

// statsui.basic.layout.layout-auth/LayoutAuthFrame [45] 
export function LayoutAuthFrame({children,hideHeader,session}){
  let height = hideHeader ? 0 : 70;
  return (
    <T.YStack flexDirection="column" minHeight="100dvh" width="100%">
      {!hideHeader ? (
        <T.YStack
          position="absolute"
          height={height}
          top={0}
          zIndex={1000000}
          backgroundColor="$color1"
          width="100%"><LayoutAuthHeader session={session}/>
        </T.YStack>) : null}
      <T.YStack top={height}>
        {children}
        <T.YStack width="100%" marginTop="20px">
          <T.YStack
            $sm={{"marginHorizontal":"10px"}}
            marginHorizontal="30px"
            marginBottom="10px"><lf.FrameFooterBottom/>
          </T.YStack>
        </T.YStack>
      </T.YStack>
    </T.YStack>);
}

// statsui.basic.layout.layout-auth/LayoutAuth [80] 
export function LayoutAuth({children,hideHeader,session}){
  return (
    <LayoutAuthFrame session={session} hideHeader={hideHeader}>{children}</LayoutAuthFrame>);
}