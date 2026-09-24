import * as T from 'tamagui'

import * as landing_common from '@statstrade/feature/landing/landing-common.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

// statstrade-web.feature.landing.landing-ideas/landingIdeasSteps [12] 
export var landingIdeasSteps = [
  {
  "title":"Product Launch",
  "description":"Generate excitement and gather market insights before your product hits the market. Let customers predict features, pricing, or success metrics.",
  "results":"+240% pre-launch engagement",
  "industry":"Tech",
  "example":"How many colors will the new smartphone have?"
},
  {
  "title":"Trade Shows",
  "description":"Turn booth visitors into active participants. Create markets around event announcements, product demos, or industry trends.",
  "results":"3x booth traffic increase",
  "industry":"Events",
  "example":"Which new feature will win best in show?"
},
  {
  "title":"Brand Campaigns",
  "description":"Make your marketing campaigns interactive and memorable. Customers trade on campaign outcomes, creating viral engagement.",
  "results":"+180% social media reach",
  "industry":"Retail",
  "example":"Which limited edition flavor will launch next?"
},
  {
  "title":"Loyalty Programs",
  "description":"Reward engaged customers with tokens they can trade. Build a community around your brand with gamified experiences.",
  "results":"92% retention improvement",
  "industry":"Hospitality",
  "example":"Which drink will sell better over the long weekend?"
}
];

// statstrade-web.feature.landing.landing-ideas/LandingIdeasCard [34] 
export function LandingIdeasCard({data}){
  return (
    <T.View position="relative">
      <T.Card
        cursor="pointer"
        borderColor="$color1"
        backgroundColor="$color1"
        paddingVertical={32}
        paddingHorizontal={15}
        height="100%"
        gap="$3">
        <T.YStack gap="$4" alignItems="start">
          <T.XStack width="100%" alignItems="center">
            <T.H4>{data.title}</T.H4>
            <ui.Pad/>
            <T.XStack width="150px">
              <ui.ButtonNormal
                size="$1"
                tooltip={data.description}
                padding="$2"
                borderRadius="$3"
                color="$color1"
                backgroundColor="$color11">{data.industry}
              </ui.ButtonNormal>
            </T.XStack>
          </T.XStack>
          <T.Text fontSize="$3" borderRadius="$4">{data.example}</T.Text>
        </T.YStack>
      </T.Card>
    </T.View>);
}

// statstrade-web.feature.landing.landing-ideas/LandingIdeas [73] 
export function LandingIdeas(){
  return (
    <landing_common.LandingFrame maxWidth="800px">
      <landing_common.LandingHeaderRow
        align="right"
        title1="Next Generation"
        title2="Social Marketing"
        paragraph="From product launches to trade shows, prediction markets deliver measurable results across every promotional channel."/>
      <T.View
        display="grid"
        gap={10}
        gridTemplateColumns="repeat(2, minmax(0, 1fr))"
        $md={{"gridTemplateColumns":"repeat(1, minmax(0, 1fr))"}}>
        {landingIdeasSteps.map(function (data,i){
          return (
            <LandingIdeasCard data={data} key={i}/>);
        })}
      </T.View>
    </landing_common.LandingFrame>);
}