import * as T from 'tamagui'

import * as landing_common from '@statstrade/feature/landing/landing-common.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

// statstrade-web.feature.landing.landing-hero/IndexLandingHeroText [16] 
export function IndexLandingHeroText(){
  return (
    <landing_common.LandingHeader
      title1={ui.t("Turn Every Opinion")}
      title2={ui.t("Into Engagement")}
      paragraph={ui.t(
          "Statstrade lets your brand run live predictions that boost interaction, loyalty, and insights - all in one gamified experience."
        )}>
      <T.View
        gap="$3"
        width="100%"
        alignItems="flex-start"
        flexDirection="row"
        paddingHorizontal={0}
        $sm={{"alignItems":"center","flexDirection":"column","width":"100%"}}>
        <landing_common.LandingButton
          href="/new-account"
          backgroundColor="$accent8"
          color="$white1">{ui.t("New Account")}
        </landing_common.LandingButton>
        <landing_common.LandingButton
          href="/sign-in"
          color="$color12"
          backgroundColor="$color1"
          borderWidth={1}
          borderColor="$color5">{ui.t("Sign In")}
        </landing_common.LandingButton>
      </T.View>
    </landing_common.LandingHeader>);
}

// statstrade-web.feature.landing.landing-hero/IndexLandingHeroImage [47] 
export function IndexLandingHeroImage({imageFull,imageMobile}){
  return (
    <T.View
      maxWidth={650}
      borderRadius="$6"
      overflow="hidden"
      width="100%"
      flex={1}
      paddingVertical="$3"
      zIndex={0}
      display="block"
      $sm={{
          "width":"100%",
          "paddingHorizontal":"$2",
          "maxWidth":"500px",
          "height":"auto",
          "backgroundColor":"transparent",
          "overflow":"visible"
        }}
      backgroundColor="$color2"
      height={480}>
      <ui.Image
        origHeight={1311}
        origWidth={2048}
        containerProps={{
            "marginLeft":"12px",
            "borderRadius":"$5",
            "overflow":"hidden",
            "borderColor":"$color4",
            "width":"100%",
            "flex":1,
            "marginTop":"12px",
            "borderWidth":1,
            "display":"block",
            "$sm":{"display":"none"}
          }}
        source={{"uri":imageFull}}/>
      <T.YStack justifyContent="center" width="100%" alignItems="center">
        <ui.Image
          origHeight={1042}
          origWidth={800}
          containerProps={{
              "width":"100%",
              "maxWidth":"300px",
              "marginTop":"$4",
              "overflow":"hidden",
              "borderRadius":"$5",
              "display":"none",
              "$sm":{"display":"block"}
            }}
          source={{"uri":imageMobile}}/>
      </T.YStack>
    </T.View>);
}

// statstrade-web.feature.landing.landing-hero/IndexLandingHero [100] 
export function IndexLandingHero({imageFull,imageMobile}){
  return (
    <T.YStack flex={1} backgroundColor="$color1">
      <T.View
        alignSelf="center"
        maxWidth={1280}
        paddingBottom={64}
        paddingTop={48}
        width="100%"
        paddingHorizontal="$4"
        flex={1}
        flexDirection="row"
        justifyContent="space-between"
        gap="$8"
        $sm={{
            "paddingTop":44,
            "paddingBottom":48,
            "paddingHorizontal":"$3",
            "flexDirection":"column",
            "alignItems":"center",
            "justifyContent":"center"
          }}
        backgroundColor="$color1"
        alignItems="center">
        <IndexLandingHeroText/>
        <IndexLandingHeroImage imageFull={imageFull} imageMobile={imageMobile}/>
      </T.View>
    </T.YStack>);
}