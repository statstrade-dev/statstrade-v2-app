import * as T from 'tamagui'

import * as ui_target from '@statstrade/component/ui-target.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

import * as gu from '@statstrade/edge/global-ui.jsx'

// statstrade-web.feature.landing.landing-common/TargetLink [15] 
export function TargetLink({tag,title}){
  return (
    <ui_target.TargetAnchor
      box={globalThis["statsui_edge_global_ui$$GlobalUI"]}
      tag={tag}
      title={ui.t(title)}
      path={["targets"]}/>);
}

// statstrade-web.feature.landing.landing-common/LandingFrame [27] 
export function LandingFrame({start,children,...props}){
  return (
    <T.YStack
      alignSelf="center"
      maxWidth={1200}
      borderTopWidth={start ? 0 : 1}
      width="100%"
      paddingHorizontal="$4"
      paddingVertical={96}
      borderTopColor="$color4"
      $sm={{"paddingVertical":64,"paddingHorizontal":"$3"}}
      backgroundColor="$color2"
      {...props}>{children}
    </T.YStack>);
}

// statstrade-web.feature.landing.landing-common/LandingButton [48] 
export function LandingButton({href,color = "$color11",backgroundColor = "$color2",...props}){
  return (
    <ui.Link href={href} style={{"textDecoration":"none"}}>
      <T.Button
        animation="quick"
        color={color}
        pressStyle={{"scale":0.98,"color":color,"backgroundColor":backgroundColor}}
        borderRadius="$4"
        minWidth="180px"
        hoverStyle={{"scale":1.01,"color":color,"backgroundColor":backgroundColor}}
        borderWidth={0}
        size="$5"
        fontWeight="600"
        $sm={{"marginHorizontal":0,"width":"100%"}}
        fontSize="$4"
        backgroundColor={backgroundColor}
        {...props}/>
    </ui.Link>);
}

// statstrade-web.feature.landing.landing-common/LandingHeader [80] 
export function LandingHeader({title1,title2,paragraph,children,align = "left"}){
  let crossAxis = (align == "left") ? "flex-start" : "flex-end";
  return (
    <T.YStack
      width="100%"
      maxWidth="540px"
      alignItems={crossAxis}
      gap="$4"
      paddingBottom="$4"
      $sm={{
          "gap":"$3",
          "width":"100%",
          "alignItems":"center",
          "justifyContent":"center",
          "paddingBottom":0
        }}>
      <T.YStack gap="$2">
        {title1 ? (
          <T.H2
            color="$accent8"
            fontWeight="700"
            fontSize="$10"
            letterSpacing={0}
            textAlign={align}
            lineHeight={58}
            $sm={{"textAlign":"center","fontSize":"38px","lineHeight":42}}>{title1}
          </T.H2>) : null}
        {title2 ? (
          <T.H2
            color="$color12"
            fontWeight="700"
            fontSize="$10"
            letterSpacing={0}
            textAlign={align}
            lineHeight={58}
            $sm={{"textAlign":"center","fontSize":"38px","lineHeight":42}}>{title2}
          </T.H2>) : null}
      </T.YStack>
      <T.YStack gap="$5">
        <T.Text
          fontSize="$4"
          color="$color10"
          textAlign={align}
          maxWidth="480px"
          lineHeight={29}
          $sm={{"textAlign":"center","paddingHorizontal":"$2"}}>{paragraph}
        </T.Text>
        {children}
      </T.YStack>
    </T.YStack>);
}

// statstrade-web.feature.landing.landing-common/LandingHeaderRow [140] 
export function LandingHeaderRow({title1,title2,paragraph,children,align = "left",...props}){
  let crossAxis = (align == "left") ? "flex-start" : "flex-end";
  return (
    <T.YStack
      alignItems={crossAxis}
      $sm={{"alignItems":"center"}}
      {...props}>
      <LandingHeader
        align={align}
        title1={title1}
        title2={title2}
        paragraph={paragraph}>
        {children || (
          <ui.Pad/>)}
      </LandingHeader>
    </T.YStack>);
}