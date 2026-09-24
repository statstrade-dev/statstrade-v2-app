import * as T from 'tamagui'

import * as ui_background from '@statstrade/component/ui-background.jsx'

// statsui.basic.ui-background-test/Metadata [12] 
export var Metadata = {[title]:"Components/ui-background",[tags]:["autodoc"]};

// statsui.basic.ui-background-test/Test_BackgroundLinearGradient [19] 
export function Test_BackgroundLinearGradient(){
  return (
    <T.YStack
      width={300}
      height={200}
      overflow="hidden"
      borderRadius="$4"
      position="relative">
      <ui_background.BackgroundLinearGradient
        themeColors={["$blue10","$purple10"]}
        themeColorsDark={["$blue2","$purple2"]}
        start={{"x":0,"y":0}}
        end={{"x":1,"y":1}}/>
      <T.YStack flex={1} alignItems="center" justifyContent="center"><T.H4 color="white">Gradient Background</T.H4></T.YStack>
    </T.YStack>);
}

export default Metadata