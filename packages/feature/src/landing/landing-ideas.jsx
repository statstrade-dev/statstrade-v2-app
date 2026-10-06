import * as T from 'tamagui'

import * as landing_common from '@statstrade/feature/landing/landing-common.jsx'

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
    <T.View position="relative" height="100%">
      <T.Card
        borderRadius="$5"
        borderColor="$color4"
        paddingHorizontal="$4"
        hoverStyle={{"borderColor":"$color6","y":-2}}
        borderWidth={1}
        paddingVertical="$5"
        gap="$4"
        backgroundColor="$color1"
        height="100%">
        <T.YStack gap="$3" alignItems="start">
          <T.XStack width="100%" alignItems="center" gap="$3">
            <T.H4 fontWeight="600" color="$color12">{data.title}</T.H4>
            <T.View flex={1}/>
            <T.View
              backgroundColor="$color3"
              borderRadius="$3"
              paddingHorizontal="$3"
              paddingVertical="$2">
              <T.Text fontSize="$2" fontWeight="600" color="$color10">{data.industry}</T.Text>
            </T.View>
          </T.XStack>
          <T.Text fontSize="$3" lineHeight={22} color="$color10">{data.description}</T.Text>
          <T.View
            backgroundColor="$color2"
            borderLeftWidth={3}
            borderLeftColor="$accent8"
            borderRadius="$3"
            paddingHorizontal="$3"
            paddingVertical="$2">
            <T.Text fontSize="$3" color="$color12">{data.example}</T.Text>
          </T.View>
        </T.YStack>
      </T.Card>
    </T.View>);
}

// statstrade-web.feature.landing.landing-ideas/LandingIdeas [92] 
export function LandingIdeas(){
  return (
    <landing_common.LandingFrame maxWidth="1120px">
      <landing_common.LandingHeaderRow
        align="right"
        title1="Next Generation"
        title2="Social Marketing"
        paragraph="From product launches to trade shows, prediction markets deliver measurable results across every promotional channel."/>
      <T.View
        display="grid"
        gap={16}
        gridTemplateColumns="repeat(2, minmax(0, 1fr))"
        $md={{"gridTemplateColumns":"repeat(2, minmax(0, 1fr))"}}
        $sm={{"gridTemplateColumns":"repeat(1, minmax(0, 1fr))"}}>
        {landingIdeasSteps.map(function (data,i){
          return (
            <LandingIdeasCard data={data} key={i}/>);
        })}
      </T.View>
    </landing_common.LandingFrame>);
}