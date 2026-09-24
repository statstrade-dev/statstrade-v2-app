import React from 'react'

import * as T from 'tamagui'

import * as kd from '@xtalk/lang/common-data.js'

import * as ui_target from '@statstrade/component/ui-target.jsx'

// statsui.basic.layout.common.frame-topmenu/FrameTopMenuTargetLinks [19] 
export function FrameTopMenuTargetLinks({
  id,
  box,
  href,
  pathScroll,
  pathTargets,
  linkProps,
  onCleanup,
  color = "$color12",
  backgroundColor = "$color1",
  ...props
}){
  let [position,setPosition] = React.useState(0);
  let meta = id ? {"nav.id":id} : null;
  let {current,ordered,positions,scrollY} = ui_target.useTargets({box,meta,pathScroll,pathTargets});
  let targetRefs = React.useRef({});
  React.useEffect(function (){
    for(let [name,layout] of Object.entries(targetRefs.current)){
      if(name == current){
        let {width,x} = layout;
        setPosition(x + (width / 2));
      }
    };
  },[current]);
  let renderTarget = React.useCallback(function ([name,{title}]){
    return (
      <T.Button
        color={color}
        onPress={function (e){
            ui_target.targetScrollTo(box,pathScroll,[...pathTargets,name],2);
            if(onCleanup){
              onCleanup();
            }
          }}
        pressStyle={{"backgroundColor":backgroundColor,"color":color,"scale":0.98}}
        key={name}
        paddingTop="$2"
        paddingHorizontal="$3"
        hoverStyle={{"backgroundColor":backgroundColor,"color":color,"scale":1.02}}
        borderWidth={0}
        size="$3"
        justifyContent="left"
        fontWeight="400"
        onLayout={function ({nativeEvent}){
            targetRefs.current[name] = nativeEvent.layout;
          }}
        backgroundColor="transparent"
        alignItems="center"
        {...linkProps}>{title}
      </T.Button>);
  },[current,box,href,linkProps,pathScroll,pathTargets]);
  return !kd.is_emptyp(ordered) ? (
    <React.Fragment>{ordered.map(renderTarget)}</React.Fragment>) : null;
}

// statsui.basic.layout.common.frame-topmenu/FrameTopMenuOverlay [96] 
export function FrameTopMenuOverlay({setShowMenu,...props}){
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

// statsui.basic.layout.common.frame-topmenu/FrameTopMenu [112] 
export function FrameTopMenu({showMenu,setShowMenu,children,overlayProps,...props}){
  return (
    <React.Fragment>
      <T.AnimatePresence>
        {showMenu ? (
          <T.View
            animation="200ms"
            key="frame-sidemenu"
            borderRadius="10px"
            top={-40}
            shadowRadius={4}
            width="100%"
            shadowOpacity={0.1}
            paddingVertical="30px"
            shadowColor="$shadow6"
            enterStyle={{"opacity":0,"y":-100}}
            opacity={1}
            themeInverse={true}
            exitStyle={{"opacity":0,"y":-100}}
            zIndex={100001}
            position="absolute"
            backgroundColor="$color1"
            shadowOffset={{"width":3}}
            {...props}>
            <T.YStack marginTop="40px" alignItems="center">{children}</T.YStack>
          </T.View>) : null}
      </T.AnimatePresence>
      {showMenu ? (
        <FrameTopMenuOverlay setShowMenu={setShowMenu} {...overlayProps}/>) : null}
    </React.Fragment>);
}