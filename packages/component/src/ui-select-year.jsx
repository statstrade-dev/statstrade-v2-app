import {ChevronDown,Users} from '@tamagui/lucide-icons'

import * as T from 'tamagui'

// statsui.basic.ui-select-year/YearSelect [18] 
export function YearSelect({onChange,value}){
  let currentYear = new Date().getFullYear();
  let years = [];
  let i = currentYear;
  while(i >= 1900){
    years.push(i);
    i = (i - 1);
  }
  return (
    <T.View
      borderWidth={1}
      borderColor="$borderColor"
      borderRadius="$4"
      height="$5"
      justifyContent="center"
      paddingHorizontal="$3"
      backgroundColor="$background">
      <select
        value={(value && value.getFullYear()) || ""}
        onChange={function (e){
            let y = parseInt(e.target.value);
            if(y){
              onChange(new Date(y,0,1));
            }
            else{
              onChange(null);
            }
          }}
        style={{
            "color":"var(--color)",
            "WebkitAppearance":"none",
            "width":"100%",
            "outline":"none",
            "zIndex":10,
            "appearance":"none",
            "position":"relative",
            "MozAppearance":"none",
            "fontSize":"14px",
            "border":"none",
            "backgroundColor":"transparent",
            "height":"100%"
          }}>
        <option value="">Select Year</option>
        {years.map(function (y){
          return (
            <option key={y} value={y}>{y}</option>);
        })}
      </select>
      <T.View position="absolute" right={10} pointerEvents="none" zIndex={0}><ChevronDown size={16} color="$color10"/></T.View>
    </T.View>);
}