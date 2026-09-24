import {Code,Coins,Shield,TrendingUp,Users,Zap} from '@tamagui/lucide-icons'

import * as T from 'tamagui'

import * as landing_common from '@statstrade/feature/landing/landing-common.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

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
    <T.View position="relative">
      <T.Card
        cursor="pointer"
        backgroundColor="$color1"
        borderWidth={1}
        borderColor="$color1"
        paddingVertical={32}
        paddingHorizontal={15}
        height="100%"
        gap="$3">
        <ui.Tooltip
          contentProps={{
              "backgroundColor":"$accent4",
              "padding":"30px",
              "transform":[{"translateY":-140}],
              "enterStyle":{"opacity":0,"x":0,"y":-100,"scale":0.3},
              "exitStyle":{"opacity":0,"x":0,"y":-100,"scale":0.3}
            }}
          noArrow={true}
          placement="bottom"
          content={(
              <T.View height="120px" width="200px"><T.Text>{data.description}</T.Text></T.View>)}>
          <T.YStack
            $md={{
                "flexDirection":"column",
                "alignItems":"center",
                "justifyContent":"center"
              }}
            gap="$4"
            alignItems="start">
            <data.icon height={20} width={20} color="$primary"/>
            <T.Text fontSize="$4" $sm={{"fontSize":"$2"}}>{data.title}</T.Text>
          </T.YStack>
        </ui.Tooltip>
      </T.Card>
    </T.View>);
}

// statstrade-web.feature.landing.landing-features/LandingFeatures [72] 
export function LandingFeatures({align}){
  return (
    <landing_common.LandingFrame maxWidth="800px">
      <landing_common.LandingHeaderRow
        align="right"
        title1="Your Platform"
        title2="For Campaigns"
        paragraph="Powerful tools designed for marketing teams to create engaging promotional campaigns that drive real business results."/>
      <T.View
        display="grid"
        gap={10}
        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
        $sm={{"gridTemplateColumns":"repeat(2, minmax(0, 1fr))"}}>
        {landingFeaturesSteps.map(function (data,i){
          return (
            <LandingFeaturesCard data={data} key={i}/>);
        })}
      </T.View>
    </landing_common.LandingFrame>);
}