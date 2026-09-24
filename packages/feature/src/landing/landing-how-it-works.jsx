import * as T from 'tamagui'

import * as landing_common from '@statstrade/feature/landing/landing-common.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

// statstrade-web.feature.landing.landing-how-it-works/landingHowItWorksSteps [12] 
export var landingHowItWorksSteps = [
  {
  "number":"01",
  "title":"Build Your Markets",
  "description":"Set up engaging prediction markets around your products, launches, or events. Customize rewards and incentives."
},
  {
  "number":"02",
  "title":"Activate Your Audience",
  "description":"Distribute through your channels. Email, social media, trade shows, or embed directly on your website."
},
  {
  "number":"03",
  "title":"Track & Optimize",
  "description":"Monitor engagement metrics, gather customer insights, and measure ROI with comprehensive analytics.",
  "last":true
}
];

// statstrade-web.feature.landing.landing-how-it-works/LandingHowItWorksCard [27] 
export function LandingHowItWorksCard({data}){
  return (
    <T.View position="relative">
      <T.Card
        backgroundColor="$color1"
        borderWidth={1}
        borderColor="$color1"
        paddingVertical={32}
        paddingHorizontal={15}
        height="100%"
        gap="$3"
        $md={{"padding":15,"borderWidth":0}}>
        <T.XStack
          $md={{"flexDirection":"column","alignItems":"start"}}
          gap="$4"
          alignItems="center">
          <T.H1 color="$color3">{data.number}</T.H1>
          <T.H4>{data.title}</T.H4>
        </T.XStack>
        <T.Text color="$color11" fontSize="$3">{data.description}</T.Text>
      </T.Card>
    </T.View>);
}

// statstrade-web.feature.landing.landing-how-it-works/LandingHowItWorks [59] 
export function LandingHowItWorks(){
  return (
    <landing_common.LandingFrame maxWidth="800px">
      <landing_common.LandingHeaderRow
        align="left"
        title1={ui.t("From Concept")}
        title2={ui.t("To Scale")}
        paragraph={ui.t(
            "Create engaging promotional campaigns that drive real business results. Launch your first promotional market in three simple steps."
          )}><ui.Pad/>
      </landing_common.LandingHeaderRow>
      <T.View
        display="grid"
        gap={10}
        gridTemplateColumns="repeat(3, minmax(0, 1fr))"
        $md={{"gridTemplateColumns":"repeat(1, minmax(0, 1fr))"}}>
        {landingHowItWorksSteps.map(function (data,i){
          return (
            <LandingHowItWorksCard data={data} key={i}/>);
        })}
      </T.View>
    </landing_common.LandingFrame>);
}