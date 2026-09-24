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
      borderTopWidth={start ? 0 : 1}
      borderTopColor="$color5"
      backgroundColor="$color1"
      paddingVertical={128}
      marginLeft={50}
      marginRight={50}
      $sm={{"paddingVertical":80,"marginLeft":10,"marginRight":10}}
      {...props}>{children}
    </T.YStack>);
}

// statstrade-web.feature.landing.landing-common/LandingButton [47] 
export function LandingButton({href,color = "$color11",backgroundColor = "$color2",...props}){
  return (
    <ui.Link href={href} style={{"textDecoration":"none"}}>
      <T.Button
        elevation={10}
        color={color}
        pressStyle={{"scale":0.98,"color":color,"backgroundColor":backgroundColor}}
        width="300px"
        hoverStyle={{"scale":1.02,"color":color,"backgroundColor":backgroundColor}}
        borderWidth={0}
        size="$5"
        fontWeight="100"
        $sm={{"marginHorizontal":0,"width":"195px"}}
        fontSize="$5"
        backgroundColor={backgroundColor}
        {...props}/>
    </ui.Link>);
}

// statstrade-web.feature.landing.landing-common/LandingHeader [78] 
export function LandingHeader({title1,title2,paragraph,children,align = "left"}){
  return (
    <T.YStack
      width="450px"
      alignItems={(align == "left") ? "start" : "end"}
      justifyContent={align}
      gap="$5"
      paddingBottom="30px"
      $sm={{
          "gap":"$3",
          "width":"400px",
          "alignItems":"center",
          "justifyContent":"center",
          "marginLeft":0,
          "marginRight":0,
          "paddingBottom":0
        }}>
      <T.YStack gap="$2">
        {title1 ? (
          <T.H2
            color="$accent3"
            fontWeight="100"
            fontSize="$10"
            letterSpacing={0}
            textAlign={align}
            marginBottom="$2"
            $sm={{"textAlign":"center","fontSize":"38px","marginBottom":0}}>{title1}
          </T.H2>) : null}
        {title2 ? (
          <T.H2
            color="$color11"
            fontWeight="100"
            fontSize="$10"
            letterSpacing={0}
            textAlign={align}
            marginBottom="$2"
            $sm={{"textAlign":"center","fontSize":"38px","marginBottom":0}}>{title2}
          </T.H2>) : null}
      </T.YStack>
      <T.YStack gap="$6">
        <T.Text
          fontSize="$5"
          color="$color11"
          textAlign={align}
          maxWidth="450px"
          padding={2}
          $sm={{"textAlign":"center","padding":"$4"}}>{paragraph}
        </T.Text>
        {children}
      </T.YStack>
    </T.YStack>);
}

// statstrade-web.feature.landing.landing-common/LandingHeaderRow [141] 
export function LandingHeaderRow({title1,title2,paragraph,children,align = "left",...props}){
  return (
    <T.YStack
      alignItems={(align == "left") ? "start" : "end"}
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