import React from 'react'

import * as T from 'tamagui'

import * as hero from '@statstrade/feature/landing/landing-hero.jsx'

import * as features from '@statstrade/feature/landing/landing-features.jsx'

import * as common from '@statstrade/feature/landing/landing-common.jsx'

import * as follow_up from '@statstrade/feature/landing/landing-follow-up.jsx'

import * as how_it_works from '@statstrade/feature/landing/landing-how-it-works.jsx'

import * as ideas from '@statstrade/feature/landing/landing-ideas.jsx'

// statstrade-web.feature.landing.index-landing/indexLandingImages [38] 
export var indexLandingImages = {
  "heroFull":"https://r2.statstrade.io/assets/images/NVbnNKsz3XYwzBnNhpDYkg2IU.avif",
  "heroMobile":"https://r2.statstrade.io/assets/images/bIHMEVEP3gMbkantdRGbxXRnrVw_1000.jpeg",
  "heroBg":"https://r2.statstrade.io/assets/images/fX6pRt1YYGICBIDixiOAXJOg_jcax0t_2000.jpeg",
  "feature1":"https://r2.statstrade.io/assets/images/JyOj6J4gYHgwYhXeeSibmtstKtg.mp4",
  "feature2":"https://r2.statstrade.io/assets/images/aINmIB49c1OXITpNwg5y9c8jUc.mp4",
  "feature3":"https://r2.statstrade.io/assets/images/axZljfLcgCkaXubuQUGHL8evs.mp4"
};

// statstrade-web.feature.landing.index-landing/indexLandingSections [46] 
export var indexLandingSections = [
  {
  "number":"01",
  "tag":"top",
  "title":"Top",
  "menu-title":"01 / Top"
},
  {
  "number":"02",
  "tag":"features",
  "title":"Features",
  "menu-title":"02 / Features"
},
  {
  "number":"03",
  "tag":"how-it-works",
  "title":"How it Works",
  "menu-title":"03 / How it Works"
},
  {
  "number":"04",
  "tag":"ideas",
  "title":"Use Cases",
  "menu-title":"04 / Use Cases"
},
  {
  "number":"05",
  "tag":"contact",
  "title":"Contact Us",
  "menu-title":"05 / Contact Us"
}
];

// statstrade-web.feature.landing.index-landing/IndexLandingScreen [48] 
export function IndexLandingScreen(){
  let sections = indexLandingSections;
  let section_top = sections[0];
  let section_features = sections[1];
  let section_how_it_works = sections[2];
  let section_ideas = sections[3];
  let section_contact = sections[4];
  return (
    <T.YStack flex={1}>
      <React.Fragment>
        <common.TargetLink
          tag={section_top["tag"]}
          number={section_top["number"]}
          title={section_top["title"]}
          menuTitle={section_top["menu-title"]}/>
        <hero.IndexLandingHero
          imageFull={indexLandingImages.heroFull}
          imageMobile={indexLandingImages.heroMobile}/>
      </React.Fragment>
      <React.Fragment>
        <common.TargetLink
          tag={section_features["tag"]}
          number={section_features["number"]}
          title={section_features["title"]}
          menuTitle={section_features["menu-title"]}/>
        <features.LandingFeatures/>
      </React.Fragment>
      <React.Fragment>
        <common.TargetLink
          tag={section_how_it_works["tag"]}
          number={section_how_it_works["number"]}
          title={section_how_it_works["title"]}
          menuTitle={section_how_it_works["menu-title"]}/>
        <how_it_works.LandingHowItWorks/>
      </React.Fragment>
      <React.Fragment>
        <common.TargetLink
          tag={section_ideas["tag"]}
          number={section_ideas["number"]}
          title={section_ideas["title"]}
          menuTitle={section_ideas["menu-title"]}/>
        <ideas.LandingIdeas/>
      </React.Fragment>
      <React.Fragment>
        <common.TargetLink
          tag={section_contact["tag"]}
          number={section_contact["number"]}
          title={section_contact["title"]}
          menuTitle={section_contact["menu-title"]}/>
        <follow_up.LandingFollowUp/>
      </React.Fragment>
    </T.YStack>);
}