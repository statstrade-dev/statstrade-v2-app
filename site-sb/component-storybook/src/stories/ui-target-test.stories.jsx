import * as T from 'tamagui'

import React from 'react'

import * as ui_target from '@statstrade/component/ui-target.jsx'

import * as ext_box from '@statstrade/edge/lib/js/react/ext-box.jsx'

// statsui.basic.ui-target-test/Metadata [13] 
export var Metadata = {[title]:"Components/ui-target",[tags]:["autodoc"]};

// statsui.basic.ui-target-test/Test_TargetScrollView [20] 
export function Test_TargetScrollView(){
  let [box] = React.useState(function (){
    ext_box.createBox({"targets":{},"scroll":null});
  });
  return (
    <T.YStack height={400} borderWidth={1} borderColor="$borderColor">
      <T.XStack
        padding="$2"
        gap="$2"
        borderBottomWidth={1}
        borderColor="$borderColor">
        <ui_target.TargetNavBar
          box={box}
          id="nav"
          pathScroll={["scroll"]}
          pathTargets={["targets"]}/>
        <ui_target.TargetDropdown box={box} pathScroll={["scroll"]} pathTargets={["targets"]}/>
      </T.XStack>
      <ui_target.TargetScrollView box={box} path={["scroll"]} pathTargets={["targets"]}>
        <T.YStack padding="$4" gap="$8">
          <ui_target.TargetAnchor box={box} tag="section1" title="Section 1" path={["targets"]}/>
          <T.H3>Section 1 Content</T.H3>
          <T.Text>Lorem ipsum dolor sit amet...</T.Text>
          <ui_target.TargetAnchor box={box} tag="section2" title="Section 2" path={["targets"]}/>
          <T.H3>Section 2 Content</T.H3>
          <T.Text>Consectetur adipiscing elit...</T.Text>
          <ui_target.TargetAnchor box={box} tag="section3" title="Section 3" path={["targets"]}/>
          <T.H3>Section 3 Content</T.H3>
          <T.Text>Sed do eiusmod tempor incididunt...</T.Text>
          <T.View height={300}/>
        </T.YStack>
      </ui_target.TargetScrollView>
    </T.YStack>);
}

export default Metadata