import 
  {ArrowRight,BarChart3,Building2,ChartNoAxesCombined,CheckCircle2,Coins,Rocket,Share2,Sparkles,Tag,Target,TrendingUp,Trophy,Users,Zap}
 from '@tamagui/lucide-icons'

import React from 'react'

import * as T from 'tamagui'

import * as common from '@statstrade/feature/onboarding/onboarding-common.jsx'

import * as ui_section from '@statstrade/component/ui-section.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

import * as ks from '@statstrade/edge/lib/xt/lang/common-string.jsx'

// statstrade-web.feature.onboarding.onboarding-step-1-type/indexOnboardingUsers [24] 
export var indexOnboardingUsers = {
  "participant":{
    "icon":TrendingUp,
    "type":"participant",
    "title":"I want to play",
    "color":"blue",
    "description":"Earn tokens, predict and and engage with exciting campaigns",
    "footer":"For traders, enthusiasts, and community members",
    "features":[
      {"icon":TrendingUp,"text":"Trade on markets"},
      {"icon":Coins,"text":"Earn branded tokens"},
      {"icon":Trophy,"text":"Compete on leaderboards"},
      {"icon":BarChart3,"text":"Track your portfolio"}
    ]
  },
  "creator":{
    "icon":Rocket,
    "type":"creator",
    "title":"I want to build",
    "color":"gray",
    "inverse":true,
    "description":"Launch campaigns, build communities, drive engagement",
    "footer":"For marketers, brand managers, and campaign organizers",
    "features":[
      {"icon":Rocket,"text":"Launch marketing campaigns"},
      {"icon":Users,"text":"Build engaged communities"},
      {"icon":Share2,"text":"Manage team collaboration"},
      {
      "icon":ChartNoAxesCombined,
      "text":"Access advanced analytics"
    }
    ]
  }
};

// statstrade-web.feature.onboarding.onboarding-step-1-type/OnboardingUserCardDetails [49] 
export function OnboardingUserCardDetails({data,setUserType,userType}){
  let isSelected = userType == data.type;
  return (
    <React.Fragment>
      <T.Text color="$color12" fontWeight="300">{data.description}</T.Text>
      <T.YStack marginTop="$2" gap="$4" flex={1}>
        {data.features.map(function (feature,index){
          let Icon = feature.icon;
          return (
            <T.XStack key={index} alignItems="center" gap={12}>
              <T.Circle
                size="$2"
                backgroundColor={data.inverse ? "$color3" : ("$" + data.color + "9")}
                alignItems="center"
                justifyContent="center"
                flexShrink={0}><Icon size={16} color="$color1"/>
              </T.Circle>
              <T.Text color="$color12" fontWeight="300">{feature.text}</T.Text>
            </T.XStack>);
        })}
      </T.YStack>
    </React.Fragment>);
}

// statstrade-web.feature.onboarding.onboarding-step-1-type/OnboardingUserCard [86] 
export function OnboardingUserCard({data,setUserType,userType}){
  let isSelected = userType == data.type;
  return (
    <ui.Tooltip content={data.footer} hide={isSelected}>
      <T.Card
        animation="200ms"
        onPress={function (){
            setUserType((data.type == userType) ? null : data.type);
          }}
        borderColor={isSelected ? "$color8" : "$color4"}
        shadowRadius={isSelected ? 10 : 0}
        aspectRatio={1}
        minWidth={0}
        cursor="pointer"
        flex={1}
        hoverStyle={{
            "borderWidth":2,
            "borderColor":isSelected ? (data.inverse ? "$color1" : ("$" + data.color + "10")) : "$color5",
            "backgroundColor":isSelected ? (data.inverse ? "$color1" : ("$" + data.color + "9")) : "$color0"
          }}
        shadowColor={isSelected ? "$shadow6" : null}
        justifyContent="center"
        padding="$4"
        themeInverse={(isSelected && data.inverse) ? true : false}
        gap="$5"
        animateOnly={["shadowColor","shadowRadius"]}
        backgroundColor={isSelected ? (data.inverse ? "$color1" : ("$" + data.color + "10")) : "transparent"}
        alignItems="center">
        <data.icon
          marginTop="20px"
          size={45}
          color={isSelected ? "$color12" : "$color11"}/>
        <T.H3
          letterSpacing={0.5}
          color={isSelected ? "$color12" : "$color12"}>{data.title}
        </T.H3>
      </T.Card>
    </ui.Tooltip>);
}

// statstrade-web.feature.onboarding.onboarding-step-1-type/OnboardingStep1TypeScreen [149] 
export function OnboardingStep1TypeScreen(){
  let context = React.useContext(common.IndexOnboardingContext);
  let {controls} = context;
  let themeColor = indexOnboardingUsers[controls.userType || "participant"].color;
  return (
    <ui_section.MinFrameCenter maxWidth={600}>
      <ui_section.MinHeader
        title="What is your type?"
        paragraph="Get started with the platform tailored to your needs"/>
      <T.YStack gap="$8" width="100%" minHeight="400px">
        <T.View
          display="grid"
          width="100%"
          gap="$3"
          gridTemplateColumns="repeat(2, minmax(0, 1fr))">
          <OnboardingUserCard
            data={indexOnboardingUsers.participant}
            userType={controls.userType}
            setUserType={controls.setUserType}/>
          <OnboardingUserCard
            data={indexOnboardingUsers.creator}
            userType={controls.userType}
            setUserType={controls.setUserType}/>
        </T.View>
        <T.AnimatePresence>
          {controls.userType ? (
            <ui.ButtonInverse
              animation="quick"
              color={(controls.userType == "creator") ? "#000" : ("$" + themeColor + "10")}
              onPress={function (){
                  console.log({controls});
                  controls.setStep(2);
                }}
              key="button"
              width="100%"
              hoverStyle={{"backgroundColor":"$" + themeColor + "9"}}
              size="$5"
              enterStyle={{"opacity":0,"scale":0.9,"y":10}}
              fontWeight="400"
              exitStyle={{"opacity":0,"scale":0.9,"y":10}}
              fontSize="$5">{"Continue as " + ks.capitalize(controls.userType)}
            </ui.ButtonInverse>) : null}
          {controls.userType ? (
            <T.YStack
              key="details"
              gap="$5"
              height="420px"
              width="100%"
              animation="quick"
              enterStyle={{"opacity":0,"y":10}}
              exitStyle={{"opacity":0,"y":-10}}>
              <OnboardingUserCardDetails
                data={indexOnboardingUsers[controls.userType]}
                userType={controls.userType}
                setUserType={controls.setUserType}/>
            </T.YStack>) : null}
        </T.AnimatePresence>
      </T.YStack>
    </ui_section.MinFrameCenter>);
}