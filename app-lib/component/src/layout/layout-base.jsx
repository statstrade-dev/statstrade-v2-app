import {useServerInsertedHTML} from 'next/navigation'

import {config} from '@statstrade/config'

import {NextThemeProvider,useRootTheme} from '@tamagui/next-theme'

import React from 'react'

import * as T from 'tamagui'

import * as TToast from '@tamagui/toast'

import * as ReactNative from 'react-native'

import * as ReactQuery from '@tanstack/react-query'

import * as frame_toast from '@statstrade/component/layout/common/frame-toast.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

import * as devtool from '@statstrade/component/layout/common/frame-devtool.jsx'

// statsui.basic.layout.layout-base/LayoutBaseOuter [21] 
export function LayoutBaseOuter({children}){
  useServerInsertedHTML(function (){
    let rnwStyle = ReactNative.StyleSheet.getSheet();
    return (
      <React.Fragment>
        <link rel="stylesheet" href="/tamagui.css"/>
        <style
          dangerouslySetInnerHTML={{"id":rnwStyle.id,"__html":rnwStyle.textContent}}/>
        <style dangerouslySetInnerHTML={{"__html":config.getNewCSS()}}/>
        <style
          dangerouslySetInnerHTML={{
              "__html":config.getCSS({
                  "exclude":(process.env.NODE_ENV == "production") ? "design-system" : null
                })
            }}/>
        <style
          dangerouslySetInnerHTML={{
              "__html":"document.documentElement.classList.add('t_unmounted')"
            }}/>
      </React.Fragment>);
  });
  return (
    <NextThemeProvider
      skipNextHead={true}
      defaultTheme="light"
      storageKey="theme"
      themes={["light","dark"]}>{children}
    </NextThemeProvider>);
}

// statsui.basic.layout.layout-base/useThemeStored [57] 
export function useThemeStored(){
  let [current,setCurrent] = useRootTheme();
  let [mounted,setMounted] = React.useState(false);
  React.useEffect(function (){
    setCurrent(localStorage.getItem("theme") || "light");
    setMounted(true);
  },[]);
  React.useEffect(function (){
    if(mounted){
      new Promise(function (resolve,reject){
        setTimeout(function (){
          try{
            resolve(            (function (){
                          localStorage.setItem("theme",current);
                        })());
          }
          catch(e){
            reject(e);
          }
        },100);
      });
    }
  },[current]);
  return {current,setCurrent};
}

// statsui.basic.layout.layout-base/LayoutBaseInner [77] 
export function LayoutBaseInner({Component,children}){
  let themeCtx = useThemeStored();
  let queryClient = React.useRef(
    new ReactQuery.QueryClient({"defaultOptions":{"queries":{"retry":0}}})
  );
  return (
    <ReactQuery.QueryClientProvider client={queryClient.current}>
      <T.TamaguiProvider
        disableRootThemeClass={false}
        defaultTheme={themeCtx.current}
        config={config}>
        <ui.ThemeGlobalContext.Provider value={themeCtx}><T.Theme name={themeCtx.current}>{children}</T.Theme></ui.ThemeGlobalContext.Provider>
      </T.TamaguiProvider>
    </ReactQuery.QueryClientProvider>);
}

// statsui.basic.layout.layout-base/LayoutBase [100] 
export function LayoutBase({children,showDevtool}){
  let [mounted,setMounted] = React.useState(false);
  React.useEffect(function (){
    if(!mounted){
      setMounted(true);
    }
  },[]);
  return mounted ? (
    <LayoutBaseOuter>
      <LayoutBaseInner>
        <TToast.ToastProvider>
          <devtool.FrameDevtoolProvider>
            {(process.env.NEXT_PUBLIC_DEV || showDevtool) ? (
              <devtool.FrameDevtoolPanel/>) : null}
            <TToast.ToastViewport left={10} top={10} zIndex={100000000}/>
            <frame_toast.FrameToast/>
            {children}
          </devtool.FrameDevtoolProvider>
        </TToast.ToastProvider>
      </LayoutBaseInner>
    </LayoutBaseOuter>) : null;
}