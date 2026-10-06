import {Code,Coins,Shield,TrendingUp,Users,Zap} from '@tamagui/lucide-icons'

import * as T from 'tamagui'

import * as landing_common from '@statstrade/feature/landing/landing-common.jsx'

// statstrade-web.feature.landing.landing-features/landingFeaturesSteps [12] 
export var landingFeaturesSteps = [
  {
  "icon":Coins,
  "title":"Branded Tokens",
  "description":"Launch custom branded tokens for promotions, loyalty programs, and product launches with your company branding."
},
  {
  "icon":TrendingUp,
  "title":"Live Predictions",
  "description":"Create engaging markets around your products, events, or campaigns to drive customer participation."
},
  {
  "icon":Users,
  "title":"Customer Engagement",
  "description":"Boost participation rates by 10x with interactive trading experiences that keep customers coming back."
},
  {
  "icon":Code,
  "title":"Marketing Integration",
  "description":"Seamlessly integrate with your CRM, email marketing, and analytics tools via our comprehensive API."
}
];

// statstrade-web.feature.landing.landing-features/LandingFeaturesCard [26] 
export function LandingFeaturesCard({data}){
  return (
    <T.View position="relative" height="100%">
      <T.Card
        borderRadius="$5"
        borderColor="$color4"
        paddingHorizontal="$4"
        hoverStyle={{"borderColor":"$color6","y":-2}}
        borderWidth={1}
        paddingVertical="$5"
        gap="$3"
        backgroundColor="$color1"
        height="100%">
        <T.YStack gap="$3" alignItems="start">
          <T.View
            width={44}
            height={44}
            borderRadius="$4"
            backgroundColor="$color3"
            alignItems="center"
            justifyContent="center"><data.icon height={20} width={20} color="$accent8"/>
          </T.View>
          <T.Text fontSize="$4" fontWeight="600" color="$color12">{data.title}</T.Text>
          <T.Text fontSize="$3" lineHeight={22} color="$color10">{data.description}</T.Text>
        </T.YStack>
      </T.Card>
    </T.View>);
}

// statstrade-web.feature.landing.landing-features/LandingFeatures [70] 
export function LandingFeatures({align}){
  return (
    <landing_common.LandingFrame maxWidth="1120px">
      <landing_common.LandingHeaderRow
        align="right"
        title1="Your Platform"
        title2="For Campaigns"
        paragraph="Powerful tools designed for marketing teams to create engaging promotional campaigns that drive real business results."/>
      <T.View
        display="grid"
        gap={16}
        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
        $md={{"gridTemplateColumns":"repeat(2, minmax(0, 1fr))"}}
        $sm={{"gridTemplateColumns":"repeat(1, minmax(0, 1fr))"}}>
        {landingFeaturesSteps.map(function (data,i){
          return (
            <LandingFeaturesCard data={data} key={i}/>);
        })}
      </T.View>
    </landing_common.LandingFrame>);
}