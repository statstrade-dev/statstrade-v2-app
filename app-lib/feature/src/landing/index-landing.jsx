import React from 'react'

import * as T from 'tamagui'

import * as hero from '@statstrade/feature/landing/landing-hero.jsx'

import * as features from '@statstrade/feature/landing/landing-features.jsx'

import * as common from '@statstrade/feature/landing/landing-common.jsx'

import * as follow_up from '@statstrade/feature/landing/landing-follow-up.jsx'

import * as how_it_works from '@statstrade/feature/landing/landing-how-it-works.jsx'

import * as ideas from '@statstrade/feature/landing/landing-ideas.jsx'

// statstrade-web.feature.landing.index-landing/indexLandingImages [25] 
export var indexLandingImages = {
  "heroFull":"https://r2.statstrade.io/assets/images/NVbnNKsz3XYwzBnNhpDYkg2IU.avif",
  "heroMobile":"https://r2.statstrade.io/assets/images/bIHMEVEP3gMbkantdRGbxXRnrVw_1000.jpeg",
  "heroBg":"https://r2.statstrade.io/assets/images/fX6pRt1YYGICBIDixiOAXJOg_jcax0t_2000.jpeg",
  "feature1":"https://r2.statstrade.io/assets/images/JyOj6J4gYHgwYhXeeSibmtstKtg.mp4",
  "feature2":"https://r2.statstrade.io/assets/images/aINmIB49c1OXITpNwg5y9c8jUc.mp4",
  "feature3":"https://r2.statstrade.io/assets/images/axZljfLcgCkaXubuQUGHL8evs.mp4"
};

// statstrade-web.feature.landing.index-landing/IndexLandingScreen [33] 
export function IndexLandingScreen(){
  return (
    <T.YStack flex={1}>
      <React.Fragment>
        <common.TargetLink tag="top" title="Top"/>
        <hero.IndexLandingHero
          imageFull={indexLandingImages.heroFull}
          imageMobile={indexLandingImages.heroMobile}/>
      </React.Fragment>
      <React.Fragment>
        <common.TargetLink tag="features" title="Features"/>
        <features.LandingFeatures/>
      </React.Fragment>
      <React.Fragment>
        <common.TargetLink tag="how-it-works" title="How it Works"/>
        <how_it_works.LandingHowItWorks/>
      </React.Fragment>
      <React.Fragment>
        <common.TargetLink tag="ideas" title="Use Cases"/>
        <ideas.LandingIdeas/>
      </React.Fragment>
      <React.Fragment>
        <common.TargetLink tag="contact" title="Contact Us"/>
        <follow_up.LandingFollowUp/>
      </React.Fragment>
    </T.YStack>);
}