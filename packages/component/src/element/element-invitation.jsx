import {Plus,Trash} from '@tamagui/lucide-icons'

import React from 'react'

import * as T from 'tamagui'

import * as ui from '@statstrade/component/ui-common.jsx'

import * as ui_form from '@statstrade/component/ui-form.jsx'

// statsui.basic.element.element-invitation/InvitationList [14] 
export function InvitationList({invitees,onRemove}){
  return (
    <T.YStack
      width="100%"
      gap="$2"
      padding="$2"
      minHeight={(invitees.length > 0) ? 10 : 0}
      backgroundColor={(invitees.length > 0) ? "$background" : "transparent"}
      borderRadius="$4"
      borderWidth={(invitees.length > 0) ? 1 : 0}
      borderColor="$borderColor">
      <T.AnimatePresence>
        {invitees.map(function (invitee,index){
          return (
            <T.XStack
              animation="quick"
              key={invitee + "-" + index}
              borderRadius="$3"
              enterStyle={{"opacity":0,"scale":0.9,"y":-10}}
              justifyContent="space-between"
              padding="$3"
              exitStyle={{
                  "opacity":0,
                  "scale":0.9,
                  "y":-10,
                  "height":0,
                  "padding":0,
                  "marginBottom":0,
                  "overflow":"hidden"
                }}
              backgroundColor="$color2"
              alignItems="center">
              <T.Text color="$color11" fontSize="$4">{invitee}</T.Text>
              <ui.ButtonNormal
                size="$3"
                circular={true}
                icon={Trash}
                chromeless={true}
                hoverStyle={{"backgroundColor":"$color4"}}
                onPress={function (){
                    onRemove(index);
                  }}/>
            </T.XStack>);
        })}
      </T.AnimatePresence>
    </T.YStack>);
}

// statsui.basic.element.element-invitation/InvitationInput [53] 
export function InvitationInput({control,field,form,onAdd}){
  let inputRef = React.useRef();
  let handle_add_internal = function (){
    let handler = form.handleSubmit(function (values){
      onAdd(values,inputRef);
    });
    handler();
  };
  return (
    <T.XStack width="100%" gap="$2" alignItems="flex-end">
      <T.YStack flex={1}>
        <ui_form.FormInput
          viewProps={{"marginVertical":0}}
          placeholder="Enter email address"
          field={field}
          hideTitle={true}
          size="$6"
          onKeyPress={function (e){
              if(e.key === "Enter"){
                handle_add_internal();
              }
            }}
          control={control}
          inputRef={inputRef}
          fontSize="$5"/>
      </T.YStack>
      <ui.ButtonNormal size="$6" icon={Plus} onPress={handle_add_internal}/>
    </T.XStack>);
}