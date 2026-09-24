import * as ReactNative from 'react-native'

import * as TToast from '@tamagui/toast'

import * as T from 'tamagui'

import React from 'react'

import * as gu from '@statstrade/edge/global-ui.jsx'

// statsui.basic.layout.common.frame-toast/FrameToast [15] 
export function FrameToast(){
  let toast = TToast.useToastController();
  let event = TToast.useToastState();
  let {width} = ReactNative.useWindowDimensions();
  React.useEffect(function (){
    gu.setUI(["toast"],toast);
    return function (){
      gu.setUI(["toast"],null);
    };
  });
  if(!event || event.isHandledNatively){
    return null;
  }
  return (
    <ReactNative.Pressable
      cursor="pointer"
      onPress={function (){
          toast.hide();
        }}>
      <T.AnimatePresence>
        <TToast.Toast
          transform={[{"translateY":-5}]}
          animation="200ms"
          key={event.id}
          borderRadius="20px"
          scale={1}
          borderColor="$color1"
          width="350px"
          cursor="pointer"
          flex={1}
          duration={event.duration || 5000}
          borderWidth={1}
          enterStyle={{"opacity":0,"transform":[{"translateY":-20}]}}
          opacity={1}
          padding="$4"
          themeInverse={true}
          exitStyle={{"opacity":0,"transform":[{"translateY":-20}]}}
          viewPortName={event.viewportName}
          backgroundColor="$color1">
          <T.YStack gap="$2">
            <T.XStack flex={1} width="100%" height="100%">
              <TToast.Toast.Title fontSize="$5">{event.title}</TToast.Toast.Title>
              <ReactNative.View style={{"flex":1}}/>
              <TToast.Toast.Description>{new Date().toLocaleTimeString()}</TToast.Toast.Description>
            </T.XStack>
            {event.message ? (
              <TToast.Toast.Description fontSize="$4">{event.message}</TToast.Toast.Description>) : null}
          </T.YStack>
        </TToast.Toast>
      </T.AnimatePresence>
    </ReactNative.Pressable>);
}