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
        gap="$4"
        flex={1}
        width="100%"
        alignItems="left"
        flexDirection="row"
        paddingHorizontal="0px"
        $sm={{"alignItems":"center","flexDirection":"column"}}>
        <landing_common.LandingButton href="/new-account" backgroundColor="$color" color="$color1">{ui.t("New Account")}</landing_common.LandingButton>
        <landing_common.LandingButton href="/sign-in" color="$color12" backgroundColor="$accent1">{ui.t("Sign In")}</landing_common.LandingButton>
      </T.View>
    </landing_common.LandingHeader>);
}

// statstrade-web.feature.landing.landing-hero/IndexLandingHeroImage [46] 
export function IndexLandingHeroImage({imageFull,imageMobile}){
  return (
    <T.View
      display="block"
      opacity={0.9}
      width={1000}
      height={800}
      zIndex={-10}
      paddingVertical="$4"
      $sm={{
          "width":"100%",
          "paddingHorizontal":"$2",
          "maxWidth":"450px",
          "height":"auto",
          "opacity":1
        }}>
      <ui.Image
        origHeight={1311}
        origWidth={2048}
        containerProps={{
            "flex":1,
            "width":"100%",
            "marginLeft":"10px",
            "marginTop":"20px",
            "overflow":"hidden",
            "borderRadius":"10px",
            "display":"block",
            "$sm":{"display":"none"}
          }}
        source={{"uri":imageFull}}/>
      <T.YStack justifyContent="center" width="100%" alignItems="center">
        <ui.Image
          origHeight={1042}
          origWidth={800}
          containerProps={{
              "width":"300px",
              "marginTop":"30px",
              "overflow":"hidden",
              "borderRadius":"10px",
              "display":"none",
              "$sm":{"display":"block"}
            }}
          source={{"uri":imageMobile}}/>
      </T.YStack>
    </T.View>);
}

// statstrade-web.feature.landing.landing-hero/IndexLandingHero [91] 
export function IndexLandingHero({imageFull,imageMobile}){
  return (
    <T.YStack flex={1}>
      <T.View
        paddingBottom="60px"
        paddingTop="40px"
        width="100%"
        flex={1}
        flexDirection="row"
        justifyContent="start"
        $sm={{
            "paddingTop":"60px",
            "marginHorizontal":0,
            "flexDirection":"column",
            "alignItems":"center",
            "justifyContent":"center"
          }}
        marginHorizontal={50}
        backgroundColor="$backgroundColor"
        alignItems="center">
        <IndexLandingHeroText/>
        <IndexLandingHeroImage imageFull={imageFull} imageMobile={imageMobile}/>
      </T.View>
    </T.YStack>);
}