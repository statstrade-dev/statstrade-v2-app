import * as T from 'tamagui'

import * as TToast from '@tamagui/toast'

import React from 'react'

import * as ui from '@statstrade/component/ui-common'

// sznui.lib.component.ui-common-test/Metadata [12] 
export var Metadata = {[title]:"Components/ui-common",[tags]:["autodoc"]};

// sznui.lib.component.ui-common-test/Test_Badge [18] 
export function Test_Badge(){
  return (
    <T.YStack gap="$4">
      <ui.Badge>{"Default Badge"}</ui.Badge>
      <ui.Badge color="$red10" backgroundColor="$red2">{"Red Badge"}</ui.Badge>
    </T.YStack>);
}

// sznui.lib.component.ui-common-test/Test_Image [52] 
export function Test_Image(){
  return (
    <T.View width={300} height={200}>
      <ui.Image
        source={{"uri":"https://placehold.co/600x400"}}
        origWidth={600}
        origHeight={400}/>
    </T.View>);
}

// sznui.lib.component.ui-common-test/Test_Video [67] 
export function Test_Video(){
  return (
    <T.View width={300} height={200}>
      <ui.Video
        source={{"uri":"https://www.w3schools.com/html/mov_bbb.mp4"}}
        origWidth={320}
        origHeight={176}/>
    </T.View>);
}

// sznui.lib.component.ui-common-test/Test_Tooltip [82] 
export function Test_Tooltip(){
  return (
    <T.YStack gap="$10" padding="$10">
      <ui.Tooltip content="This is a tooltip"><ui.ButtonNormal>{"Hover me"}</ui.ButtonNormal></ui.Tooltip>
    </T.YStack>);
}

// sznui.lib.component.ui-common-test/Test_Pad [99] 
export function Test_Pad(){
  return (
    <T.XStack height={50} backgroundColor="$gray5">
      <T.Text>{"Left"}</T.Text>
      <ui.Pad/>
      <T.Text>{"Right"}</T.Text>
    </T.XStack>);
}

// sznui.lib.component.ui-common-test/Test_Horizontal [113] 
export function Test_Horizontal(){
  return (
    <T.YStack gap="$4" width={200}>
      <T.Text>{"Above"}</T.Text>
      <ui.Horizontal/>
      <T.Text>{"Below"}</T.Text>
    </T.YStack>);
}

// sznui.lib.component.ui-common-test/Test_HorizontalText [127] 
export function Test_HorizontalText(){
  return (
    <T.YStack gap="$4" width={300}>
      <T.Text>{"Above"}</T.Text>
      <ui.HorizontalText text="OR"/>
      <T.Text>{"Below"}</T.Text>
    </T.YStack>);
}

// sznui.lib.component.ui-common-test/Test_ButtonNormal [142] 
export function Test_ButtonNormal(){
  return (
    <T.YStack gap="$4">
      <ui.ButtonNormal>{"Normal Button"}</ui.ButtonNormal>
      <ui.ButtonNormal color="$blue10" backgroundColor="$blue2">{"Colored Button"}</ui.ButtonNormal>
    </T.YStack>);
}

// sznui.lib.component.ui-common-test/Test_ButtonContrast [158] 
export function Test_ButtonContrast(){
  return (
    <T.YStack gap="$4"><ui.ButtonContrast>{"Contrast Button"}</ui.ButtonContrast></T.YStack>);
}

// sznui.lib.component.ui-common-test/Test_ButtonOutlined [171] 
export function Test_ButtonOutlined(){
  return (
    <T.YStack gap="$4"><ui.ButtonOutlined>{"Outlined Button"}</ui.ButtonOutlined></T.YStack>);
}

// sznui.lib.component.ui-common-test/Test_ButtonInverse [184] 
export function Test_ButtonInverse(){
  return (
    <T.YStack gap="$4" backgroundColor="$black" padding="$4"><ui.ButtonInverse>{"Inverse Button"}</ui.ButtonInverse></T.YStack>);
}

// sznui.lib.component.ui-common-test/Test_ButtonLink [197] 
export function Test_ButtonLink(){
  return (
    <T.YStack gap="$4">
      <ui.ButtonLink href="#">{"Link Button"}</ui.ButtonLink>
      <ui.ButtonLink disabled={true}>{"Disabled Link"}</ui.ButtonLink>
    </T.YStack>);
}

// sznui.lib.component.ui-common-test/Test_ButtonSwitch [214] 
export function Test_ButtonSwitch(){
  let [checked,setChecked] = React.useState(false);
  return (
    <T.YStack gap="$4">
      <ui.ButtonSwitch
        checked={checked}
        setChecked={setChecked}
        color="$yellow10"
        backgroundColor="$gray5"
        iconOn={require("@tamagui/lucide-icons").Sun}
        iconOff={require("@tamagui/lucide-icons").Moon}/>
    </T.YStack>);
}

// sznui.lib.component.ui-common-test/Test_HomeAction [233] 
export function Test_HomeAction(){
  return (
    <ui.HomeAction href="/"/>);
}

// sznui.lib.component.ui-common-test/Test_ThemeSwitch [250] 
export function Test_ThemeSwitch(){
  return (
    <ui.ThemeSwitch/>);
}

// sznui.lib.component.ui-common-test/Test_Checkbox [260] 
export function Test_Checkbox(){
  let [checked,setChecked] = React.useState(false);
  return (
    <T.XStack gap="$4" alignItems="center">
      <ui.Checkbox checked={checked} onCheckedChange={setChecked}/>
      <T.Text>{"Check me"}</T.Text>
    </T.XStack>);
}

// sznui.lib.component.ui-common-test/Test_PopoverMenu [276] 
export function Test_PopoverMenu(){
  let [open,setOpen] = React.useState(false);
  return (
    <ui.PopoverMenu
      open={open}
      onOpenChange={setOpen}
      button={(
          <ui.ButtonNormal>{"Open Menu"}</ui.ButtonNormal>)}>
      <T.YStack padding="$2" gap="$2"><T.Text>{"Item 1"}</T.Text><T.Text>{"Item 2"}</T.Text></T.YStack>
    </ui.PopoverMenu>);
}

// sznui.lib.component.ui-common-test/Test_Dropdown [294] 
export function Test_Dropdown(){
  let [val,setVal] = React.useState("apple");
  return (
    <ui.Dropdown
      value={val}
      onValueChange={setVal}
      options={[
          {"name":"apple","title":"Apple"},
          {"name":"banana","title":"Banana"},
          {"name":"orange","title":"Orange"}
        ]}/>);
}

// sznui.lib.component.ui-common-test/Test_Toast [310] 
export function Test_Toast(){
  return (
    <TToast.ToastProvider>
      <T.YStack>
        <ui.Toast
          event={{
              "id":"toast-1",
              "duration":3000,
              "title":"Success",
              "message":"Operation completed successfully.",
              "isHandledNatively":false,
              "viewportName":"viewport"
            }}/>
        <TToast.ToastViewport name="viewport"/>
      </T.YStack>
    </TToast.ToastProvider>);
}

// sznui.lib.component.ui-common-test/Test_Dialog [330] 
export function Test_Dialog(){
  let [open,setOpen] = React.useState(false);
  return (
    <T.YStack>
      <ui.ButtonNormal
        onPress={function (){
            setOpen(true);
          }}>{"Open Dialog"}
      </ui.ButtonNormal>
      <ui.Dialog
        open={open}
        onOpenChange={setOpen}
        title="Dialog Title"
        description="This is the dialog description.">
        <T.Text>{"Dialog Content"}</T.Text>
        <ui.ButtonNormal
          onPress={function (){
              setOpen(false);
            }}
          marginTop="$4">{"Close"}
        </ui.ButtonNormal>
      </ui.Dialog>
    </T.YStack>);
}

// sznui.lib.component.ui-common-test/Test_DialogConfirm [354] 
export function Test_DialogConfirm(){
  let [open,setOpen] = React.useState(false);
  return (
    <T.YStack>
      <ui.ButtonNormal
        onPress={function (){
            setOpen(true);
          }}>{"Open Confirm Dialog"}
      </ui.ButtonNormal>
      <ui.DialogConfirm
        open={open}
        onOpenChange={setOpen}
        title="Confirm Action"
        description="Are you sure you want to proceed?"
        onConfirm={function (){
            alert("Confirmed");
            setOpen(false);
          }}
        onCancel={function (){
            setOpen(false);
          }}/>
    </T.YStack>);
}

export default Metadata