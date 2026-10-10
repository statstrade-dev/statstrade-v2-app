import React from 'react'

import * as ui from '@statstrade/component/ui-common.jsx'

// statsui.basic.ui-datepicker/DatePicker [10] 
export function DatePicker({type = "date",date,onChange,button,...props}){
  let datePickerRef = React.useRef();
  let [currentDate,setCurrentDate] = React.useState(date);
  React.useEffect(function (){
    setCurrentDate(date);
  },[date]);
  return (
    <React.Fragment>
      {React.cloneElement(button || (
        <ui.ButtonNormal>Select Date</ui.ButtonNormal>),{
        "onPress":function (){
          datePickerRef.current.showPicker();
        }
      })}
      <RNDatePicker.DatePicker
        type={type}
        ref={datePickerRef}
        value={currentDate}
        onChange={function (date){
            setCurrentDate(date);
            onChange(date);
          }}
        {...props}/>
    </React.Fragment>);
}