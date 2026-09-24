import {Replace,Upload,User,X} from '@tamagui/lucide-icons'

import * as ImagePicker from 'expo-image-picker'

import React from 'react'

import * as T from 'tamagui'

import * as ui from '@statstrade/component/ui-common.jsx'

// statsui.basic.ui-image/ImageUpload [11] 
export function ImageUpload({
  toast,
  image,
  remoteImage,
  icon = User,
  onImageSelected = (function (){
  
}),
  ...props
}){
  let [localImage,setLocalImage] = React.useState();
  let displayImage = image || localImage;
  let width = props.width || 150;
  let height = props.height || 150;
  let borderRadius = props.borderRadius || 1000;
  let aspect = props.aspect || [1,1];
  let pickImage = async function (){
    let {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if(status != "granted"){
      if(toast){
        toast.show(ui.t("Camera permissions required."),{
          "message":ui.t("We need camera roll permissions for upload to work.")
        });
      }
      else{
        alert("We need camera roll permissions for upload to work");
      }
    }
    let result = await ImagePicker.launchImageLibraryAsync({"allowsEditing":true,"aspect":aspect,"quality":1});
    if(!result.canceled){
      let selected = result.assets[0];
      setLocalImage(selected);
      onImageSelected(selected);
    }
  };
  let clearImage = function (){
    setLocalImage(null);
    onImageSelected(null);
  };
  let tintColor = props.tint || "$color2";
  return (
    <T.YStack
      width={width}
      height={height}
      alignSelf="center"
      alignItems="center"
      justifyContent="center">
      {displayImage ? (
        <T.YStack
          flex={1}
          width="100%"
          height="100%"
          position="relative"
          justifyContent="center"
          alignItems="center">
          <T.YStack
            borderRadius={borderRadius}
            overflow="hidden"
            width="100%"
            flex={1}
            justifyContent="center"
            position="relative"
            backgroundColor="$color4"
            height="100%"
            alignItems="center">
            <T.Image
              source={{"uri":displayImage.uri}}
              src={displayImage.uri}
              width="100%"
              height="100%"
              resizeMode="cover"
              style={{"objectFit":"cover"}}/>
          </T.YStack>
          <T.Button
            color="white"
            onPress={clearImage}
            bottom={0}
            icon={X}
            size="$3"
            right={0}
            position="absolute"
            circular={true}
            backgroundColor="$red10"/>
        </T.YStack>) : (
        <T.YStack
          animation="quick"
          onPress={pickImage}
          pressStyle={{"scale":0.98,"backgroundColor":tintColor}}
          borderRadius={borderRadius}
          borderColor={props.color || "$color8"}
          shadowRadius={10}
          width={width}
          shadowOpacity={0.1}
          cursor="pointer"
          hoverStyle={{
              "scale":1.05,
              "borderColor":props.color || "$color7",
              "backgroundColor":tintColor
            }}
          borderWidth={1}
          shadowColor={props.color || "$shadow6"}
          justifyContent="center"
          backgroundColor="$color1"
          height={height}
          alignItems="center">
          {React.createElement(icon,{"size":"$5","color":props.color || "$color8"})}
        </T.YStack>)}
    </T.YStack>);
}