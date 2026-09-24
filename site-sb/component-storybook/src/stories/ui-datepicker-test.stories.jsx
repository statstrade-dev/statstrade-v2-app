import {Calendar} from '@tamagui/lucide-icons'

import React from 'react'

import * as T from 'tamagui'

import * as ui_datepicker from '@statstrade/component/ui-datepicker.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

// statsui.basic.ui-datepicker-test/Metadata [14] 
export var Metadata = {"title":"Components/ui-datepicker","tags":["autodoc"]};

// statsui.basic.ui-datepicker-test/Test_DatePicker [21] 
export function Test_DatePicker(){
  let [date,setDate] = React.useState(new Date());
  return (
    <T.YStack gap="$4" padding="$4" alignItems="flex-start">
      <T.H5>Default Button</T.H5>
      <ui_datepicker.DatePicker date={date} onChange={setDate}/>
      <T.H5>Custom Button</T.H5>
      <ui_datepicker.DatePicker
        date={date}
        onChange={setDate}
        button={(
            <ui.ButtonContrast icon={Calendar}>{"Selected: " + date.toLocaleDateString()}</ui.ButtonContrast>)}/>
      <T.H5>With Mode 'time'</T.H5>
      <ui_datepicker.DatePicker
        date={date}
        onChange={setDate}
        type="time"
        button={(
            <ui.ButtonOutlined>{"Selected: " + date.toLocaleTimeString()}</ui.ButtonOutlined>)}/>
      <T.SizableText>Current Value: {date.toString()}</T.SizableText>
    </T.YStack>);
}

export default Metadata