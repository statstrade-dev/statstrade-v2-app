import React from 'react'

import * as T from 'tamagui'

import * as logo from '@statstrade/component/logo/logo-statstrade'

import * as ui_section from '@statstrade/component/ui-section'

import * as null from '@statstrade/edge/lib/xt/lang/base-lib'

// statsui.basic.ui-section-test/Metadata [17] 
export var Metadata = {[title]:"Components/ui-section",[tags]:["autodoc"]};

// statsui.basic.ui-section-test/Test_FullScreenCentered [23] 
export function Test_FullScreenCentered(){
  return (
    <ui_section.FullScreenCentered
      leftAction={(
          <T.Button>{"Left"}</T.Button>)}
      rightAction={(
          <T.Button>{"Right"}</T.Button>)}><T.Text>{"Centered Content"}</T.Text>
    </ui_section.FullScreenCentered>);
}

// statsui.basic.ui-section-test/Test_FullScreenHeader [36] 
export function Test_FullScreenHeader(){
  return (
    <ui_section.FullScreenHeader title="Full Screen Header"/>);
}

// statsui.basic.ui-section-test/Test_MinHeader [47] 
export function Test_MinHeader(){
  return (
    <ui_section.MinHeader
      logo={(
          <logo.LogoStatstrade size={40}/>)}
      title="Minimal Header"
      paragraph="This is a minimal header description."/>);
}

// statsui.basic.ui-section-test/Test_MinFrameCenter [60] 
export function Test_MinFrameCenter(){
  return (
    <ui_section.MinFrameCenter backgroundColor="$color2"><T.Text>{"Centered Content in Frame"}</T.Text></ui_section.MinFrameCenter>);
}

// statsui.basic.ui-section-test/Test_SectionMinInfo [72] 
export function Test_SectionMinInfo(){
  return (
    <ui_section.SectionMinInfo
      title={(
          <T.H2>{"Info Title"}</T.H2>)}
      body={(
          <T.Text>{"Info Body Text"}</T.Text>)}
      logo={(
          <logo.LogoStatstrade size={50}/>)}
      left={(
          <T.Button>{"Action 1"}</T.Button>)}
      right={(
          <T.Button>{"Action 2"}</T.Button>)}><T.Text>{"Additional Children"}</T.Text>
    </ui_section.SectionMinInfo>);
}

// statsui.basic.ui-section-test/Test_SectionMinLogo [88] 
export function Test_SectionMinLogo(){
  return (
    <ui_section.SectionMinLogo
      logo={(
          <logo.LogoStatstrade size={60}/>)}
      title={(
          <T.H3>{"Logo Section Title"}</T.H3>)}/>);
}

// statsui.basic.ui-section-test/Test_sectionContent [100] 
export function Test_sectionContent(){
  return (
    <T.YStack gap="$4">
      <T.YStack>
        {(
          <T.Text>{"Component Content"}</T.Text>) ? (xt.lang.base_lib.fnp((
          <T.Text>{"Component Content"}</T.Text>)) ? React.createElement((
          <T.Text>{"Component Content"}</T.Text>),{}) : (
          <T.Text>{"Component Content"}</T.Text>)) : null}
      </T.YStack>
      <T.YStack>
        {(function (){
          return (
            <T.Text>{"Function Content"}</T.Text>);
        }) ? (xt.lang.base_lib.fnp(function (){
          return (
            <T.Text>{"Function Content"}</T.Text>);
        }) ? React.createElement(function (){
          return (
            <T.Text>{"Function Content"}</T.Text>);
        },{}) : (function (){
          return (
            <T.Text>{"Function Content"}</T.Text>);
        })) : null}
      </T.YStack>
    </T.YStack>);
}

export default Metadata