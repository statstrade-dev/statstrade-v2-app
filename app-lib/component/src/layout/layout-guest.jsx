import {schemaSignIn} from '@statstrade/edge/remote/group/common-auth-action'

import {Github,Menu} from '@tamagui/lucide-icons'

import * as T from 'tamagui'

import React from 'react'

import * as hf from '@statstrade/edge/lib/js/lib/react-hook-form.jsx'

import * as rq from '@statstrade/edge/lib/js/lib/react-query.jsx'

import * as topmenu from '@statstrade/component/layout/common/frame-topmenu.jsx'

import * as ui_router from '@statstrade/component/ui-router.jsx'

import * as lf from '@statstrade/component/layout/common/frame-footer.jsx'

import * as ui_target from '@statstrade/component/ui-target.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

import * as gs from '@statstrade/edge/global-store.jsx'

import * as ui_form from '@statstrade/component/ui-form.jsx'

import * as api_general from '@statstrade/edge/remote/api-general.jsx'

import * as sidemenu from '@statstrade/component/layout/common/frame-sidemenu.jsx'

import * as gu from '@statstrade/edge/global-ui.jsx'

import * as logo from '@statstrade/component/logo/logo-statstrade.jsx'

import * as logo_google from '@statstrade/component/logo/logo-google.jsx'

// statsui.basic.layout.layout-guest/LayoutGuestContext [34] 
export var LayoutGuestContext = React.createContext();

// statsui.basic.layout.layout-guest/LayoutGuestLink [37] 
export function LayoutGuestLink({link,text,size = 40}){
  return (
    <T.Anchor
      href={link}
      style={{"textDecoration":"none"}}
      hoverStyle={{"textDecoration":"underline"}}>
      <ui.ButtonContrast
        color="$color12"
        backgroundColor="$color1"
        borderWidth={0}
        size={size}
        fontWeight="400">{text}
      </ui.ButtonContrast>
    </T.Anchor>);
}

// statsui.basic.layout.layout-guest/LayoutGuestLogo [57] 
export function LayoutGuestLogo(){
  let {controls} = React.useContext(LayoutGuestContext);
  return (
    <ui.ButtonNormal
      backgroundColor="transparent"
      paddingHorizontal="5px"
      onPress={function (){
          controls.setShowTopMenu(true);
        }}>
      <T.XStack alignItems="center"><logo.LogoStatstrade width={35} color="$color12"/></T.XStack>
    </ui.ButtonNormal>);
}

// statsui.basic.layout.layout-guest/LayoutGuestHeaderLoginForm [75] 
export function LayoutGuestHeaderLoginForm(){
  let context = React.useContext(LayoutGuestContext);
  let router = ui_router.useRouter();
  let {api,controls,forms} = context;
  let isBusy = api.mutations.sign_in.isPending || api.mutations.sign_in_oauth.isPending;
  return (
    <T.Form
      onSubmit={forms.sign_in.handleSubmit(function (){
          api.mutations.sign_in.mutateAsync(forms.sign_in.getValues()).then(function ({data,error}){
            if(error){
              controls.setCurrentError(error);
              forms.sign_in.reset();
            }
            else{
              gs.setStore(["flags","sign-in"],true);
            }
          });
        })}>
      <T.YStack paddingVertical="$3" paddingHorizontal="$5">
        {controls.currentError ? (
          <T.YStack marginTop="20px" height="40px"><ui_form.FormError error={controls.currentError}/></T.YStack>) : null}
        <ui_form.FormInput
          autoFocus={true}
          hideTitle={true}
          field="email"
          hoverStyle={{"backgroundColor":"$color1"}}
          control={forms.sign_in.control}
          placeholder="Enter your email"
          disabled={isBusy}/>
        <ui_form.FormInput
          placeholder="Enter your password"
          disabled={isBusy}
          autoComplete="password"
          field="password"
          textContentType="password"
          hoverStyle={{"backgroundColor":"$color1"}}
          hideTitle={true}
          control={forms.sign_in.control}
          secureTextEntry={true}/>
        <T.View height="5px"/>
        <T.FormTrigger asChild={true} borderWidth={0}>
          <ui.ButtonNormal
            flex={4}
            backgroundColor="$accent8"
            color="$color12"
            icon={isBusy ? (function (){
                return (
                  <T.Spinner/>);
              }) : null}
            disabled={isBusy || !forms.sign_in.formState.isValid}>{isBusy ? "" : ui.t("Sign In")}
          </ui.ButtonNormal>
        </T.FormTrigger>
        <T.YStack gap="$3">
          <T.View/>
          <T.XStack gap="$2" flexWrap="wrap">
            <ui.ButtonOutlined
              flex={1}
              icon={isBusy ? T.Spinner : logo_google.LogoGoogle}
              disabled={isBusy}
              onPress={function (){
                  api.mutations.sign_in_oauth.mutateAsync({"provider":"google"});
                }}/>
            <ui.ButtonOutlined
              flex={1}
              icon={isBusy ? T.Spinner : Github}
              disabled={isBusy}
              onPress={function (){
                  api.mutations.sign_in_oauth.mutateAsync({"provider":"github"});
                }}/>
          </T.XStack>
          <T.Anchor href="/new-account">
            <ui.ButtonOutlined
              width="100%"
              onPress={function (){
                  controls.setShowLogin(false);
                  router.push("/new-account");
                }}>Create New Account
            </ui.ButtonOutlined>
          </T.Anchor>
        </T.YStack>
      </T.YStack>
    </T.Form>);
}

// statsui.basic.layout.layout-guest/LayoutGuestHeaderLogin [170] 
export function LayoutGuestHeaderLogin(){
  let {controls,forms} = React.useContext(LayoutGuestContext);
  return (
    <React.Fragment>
      <T.AnimatePresence>
        {controls.showLogin ? (
          <T.View
            animation="200ms"
            key="frame-login"
            borderRadius="10px"
            top={10}
            borderColor="$color1"
            shadowRadius={4}
            width="300px"
            shadowOpacity={0.1}
            borderWidth={1}
            shadowColor="$shadow6"
            enterStyle={{"opacity":0}}
            opacity={1}
            themeInverse={true}
            exitStyle={{"opacity":0}}
            zIndex={100001}
            right={10}
            position="absolute"
            backgroundColor="$color1"
            shadowOffset={{"width":3}}><T.YStack><LayoutGuestHeaderLoginForm/></T.YStack>
          </T.View>) : null}
      </T.AnimatePresence>
      {controls.showLogin ? (
        <T.View
          themeInverse={true}
          position="absolute"
          height="100%"
          width="100%"
          zIndex={100000}
          backgroundColor="$color1"
          opacity={0.5}
          onPress={function (){
              controls.setShowLogin(false);
              controls.setCurrentError(null);
              forms.sign_in.reset();
            }}/>) : null}
    </React.Fragment>);
}

// statsui.basic.layout.layout-guest/LayoutGuestHeaderMobile [219] 
export function LayoutGuestHeaderMobile(){
  let {controls} = React.useContext(LayoutGuestContext);
  return (
    <T.XStack
      $md={{"display":"flex"}}
      display="none"
      flex={1}
      zIndex={1000}
      alignItems="center"
      justifyContent="center"
      paddingHorizontal="$3">
      <T.View
        position="absolute"
        top={0}
        bottom={0}
        left={0}
        right={0}
        alignItems="center"
        justifyContent="center"><LayoutGuestLogo/>
      </T.View>
      <ui.ButtonNormal
        backgroundColor="transparent"
        padding="$2"
        onPress={function (){
            controls.setShowSideMenu(true);
          }}
        icon={(
            <Menu size={32} color="$color12"/>)}/>
      <ui.Pad/>
      <ui.ButtonNormal
        color="$color1"
        backgroundColor="$color12"
        size={35}
        padding={20}
        onPress={function (){
            controls.setShowLogin(true);
          }}>Sign In
      </ui.ButtonNormal>
    </T.XStack>);
}

// statsui.basic.layout.layout-guest/LayoutGuestHeaderLinks [258] 
export function LayoutGuestHeaderLinks({size}){
  return (
    <React.Fragment>
      <LayoutGuestLink link="/" text={ui.t("Home")} size={size}/>
      <LayoutGuestLink link="/about/features" text={ui.t("Features")} size={size}/>
      <LayoutGuestLink link="/about/pricing" text={ui.t("Pricing")} size={size}/>
    </React.Fragment>);
}

// statsui.basic.layout.layout-guest/LayoutGuestHeaderDesktop [277] 
export function LayoutGuestHeaderDesktop(){
  let {controls} = React.useContext(LayoutGuestContext);
  return (
    <T.XStack
      $md={{"display":"none"}}
      display="flex"
      flex={1}
      alignItems="center"
      paddingHorizontal="$3"
      zIndex={1000}>
      <LayoutGuestLogo/>
      <T.View width="20px"/>
      <T.XStack gap="$2"><LayoutGuestHeaderLinks/></T.XStack>
      <ui.Pad/>
      <ui.ThemeSwitch size="$5" color="$color12" backgroundColor="$color1"/>
      <T.View width="10px"/>
      <ui.ButtonNormal
        color="$color1"
        backgroundColor="$color12"
        size={35}
        padding={20}
        onPress={function (){
            controls.setShowLogin(true);
          }}>Sign In
      </ui.ButtonNormal>
    </T.XStack>);
}

// statsui.basic.layout.layout-guest/LayoutGuestFrame [322] 
export function LayoutGuestFrame({children}){
  let height = 70;
  let {controls} = React.useContext(LayoutGuestContext);
  return (
    <T.YStack flexDirection="column" minHeight="100dvh" width="100%">
      <T.YStack position="absolute" height={height} top={0} width="100%"><LayoutGuestHeaderMobile/><LayoutGuestHeaderDesktop/></T.YStack>
      <LayoutGuestHeaderLogin/>
      <topmenu.FrameTopMenu
        showMenu={controls.showTopMenu}
        setShowMenu={controls.setShowTopMenu}>
        <ui.ThemeSwitch/>
        <T.View height="20px"/>
        <T.YStack gap="$3" alignItems="center">
          <topmenu.FrameTopMenuTargetLinks
            href="/"
            onCleanup={function (){
                controls.setShowTopMenu(false);
              }}
            box={globalThis["statsui_edge_global_ui$$GlobalUI"]}
            pathScroll={["scroll"]}
            pathTargets={["targets"]}/>
        </T.YStack>
      </topmenu.FrameTopMenu>
      <sidemenu.FrameSideMenu
        showMenu={controls.showSideMenu}
        setShowMenu={controls.setShowSideMenu}
        bottom={(
            <T.YStack marginHorizontal="20px">
              <lf.FrameFooterSocial/>
              <T.View height="10px"/>
              <lf.FrameFooterLegal gap="$3" flexDirection="row"/>
            </T.YStack>)}>
        <T.YStack marginTop="20px"><LayoutGuestHeaderLinks size="$5"/></T.YStack>
      </sidemenu.FrameSideMenu>
      <ui_target.TargetScrollView
        top={height}
        box={globalThis["statsui_edge_global_ui$$GlobalUI"]}
        path={["scroll"]}
        pathTargets={["targets"]}>
        <T.YStack flex={1} minHeight={0}>{children}</T.YStack>
        <lf.FrameFooter/>
      </ui_target.TargetScrollView>
    </T.YStack>);
}

// statsui.basic.layout.layout-guest/useLayoutGuestContext [384] 
export function useLayoutGuestContext(){
  let api = rq.useApi({
    "mutations":{
        "sign_in":{"fn":api_general.sign_in},
        "sign_in_oauth":{"fn":api_general.sign_in_oauth}
      }
  });
  let forms = {
    "sign_in":hf.useFormState({
        "defaultValues":{"email":"","password":""},
        "schema":schemaSignIn
      })
  };
  let controls = hf.useControls(["showSideMenu","showTopMenu","showLogin","currentError"]);
  return {api,controls,forms};
}

// statsui.basic.layout.layout-guest/LayoutGuest [402] 
export function LayoutGuest({children}){
  let context = useLayoutGuestContext();
  return (
    <LayoutGuestContext.Provider value={context}><LayoutGuestFrame>{children}</LayoutGuestFrame></LayoutGuestContext.Provider>);
}