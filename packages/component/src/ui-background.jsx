import * as T from 'tamagui'

import * as ExpoLinearGradient from 'expo-linear-gradient'

// statsui.basic.ui-background/BackgroundLinearGradient [8] 
export function BackgroundLinearGradient({style,meta,themeColors,themeColorsDark,containerProps,...props}){
  let current = T.useThemeName();
  let theme = T.useTheme();
  let colors = ((current == "dark") ? themeColorsDark : null) || themeColors;
  let colorVals = colors.map(function (c){
    return theme[c] ? theme[c].val : null;
  });
  return (
    <ExpoLinearGradient.LinearGradient
      colors={colorVals}
      key={current}
      style={{
          "bottom":0,
          "left":0,
          "overflow":"hidden",
          "position":"absolute",
          "right":0,
          "top":0,
          ...style
        }}
      {...props}/>);
}