import 
  {Activity,ArrowUpRight,Box,Check,Circle,Clock,Info,Play,TrendingUp,Users}
 from '@tamagui/lucide-icons'

import * as T from 'tamagui'

// statstrade-web.feature.manage.campaigns.campaigns-preview/CampaignPromotionView [12] 
export function CampaignPromotionView({description,mode,title}){
  let isSmall = mode == "small";
  return (
    <T.YStack
      width={isSmall ? "100%" : 800}
      maxWidth="100%"
      backgroundColor="#000"
      borderRadius="$4"
      overflow="hidden"
      position="relative"
      borderWidth={1}
      borderColor="$color5">
      <T.View
        height={isSmall ? 160 : 300}
        backgroundColor="$color3"
        position="relative">
        <T.View
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          backgroundColor="rgba(0,0,0,0.3)"/>
        <T.YStack
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          padding="$4"
          gap="$2">
          <T.XStack gap="$2" flexWrap="wrap">
            <T.View
              backgroundColor="$purple9"
              paddingHorizontal="$2"
              paddingVertical={2}
              borderRadius="$2">
              <T.Text color="white" fontSize={10} fontWeight="700">LIVE EVENT</T.Text>
            </T.View>
            <T.View
              backgroundColor="rgba(0,0,0,0.6)"
              paddingHorizontal="$2"
              paddingVertical={2}
              borderRadius="$2">
              <T.Text color="white" fontSize={10} fontWeight="600">ENDS IN 24H</T.Text>
            </T.View>
          </T.XStack>
          <T.H2
            color="white"
            fontSize={isSmall ? 24 : 42}
            fontWeight="800"
            textShadowColor="rgba(0,0,0,0.5)"
            textShadowOffset={{"width":0,"height":2}}
            textShadowRadius={4}
            lineHeight={isSmall ? 28 : 48}>{title || "Campaign Title"}
          </T.H2>
          {!isSmall ? (
            <T.Paragraph color="$color12" fontSize="$5" opacity={0.9} numberOfLines={2}>
              {description || "Join the campaign and predict outcomes to earn rewards."}
            </T.Paragraph>) : null}
        </T.YStack>
      </T.View>
      {isSmall ? (
        <T.YStack padding="$4" gap="$4" backgroundColor="$color2">
          <T.Text color="$color11" fontSize="$3" numberOfLines={3}>{description || "Short description..."}</T.Text>
          <T.Button theme="blue" size="$3" icon={Play}>Join Campaign</T.Button>
        </T.YStack>) : (
        <T.XStack
          padding="$6"
          backgroundColor="$color1"
          gap="$6"
          flexWrap="wrap">
          <T.YStack flex={1} minWidth={300} gap="$4">
            <T.H4 color="$color12">About this Campaign</T.H4>
            <T.Text color="$color11" fontSize="$4">{description}</T.Text>
            <T.XStack gap="$4" marginTop="$2">
              <T.Button theme="blue" size="$4" icon={Play} width={160}>Join Now</T.Button>
              <T.Button size="$4" chromeless={true} icon={Info}>Learn More</T.Button>
            </T.XStack>
          </T.YStack>
          <T.YStack width={240} gap="$4">
            <T.Card padding="$4" backgroundColor="$color2" borderRadius="$4">
              <T.YStack gap="$3">
                <T.XStack justifyContent="space-between">
                  <T.Text color="$color11">Prize Pool</T.Text>
                  <T.Text color="$green9" fontWeight="700">$50,000</T.Text>
                </T.XStack>
                <T.XStack justifyContent="space-between">
                  <T.Text color="$color11">Participants</T.Text>
                  <T.Text color="$color12" fontWeight="600">1,240</T.Text>
                </T.XStack>
                <T.XStack justifyContent="space-between">
                  <T.Text color="$color11">Entry Fee</T.Text>
                  <T.Text color="$color12" fontWeight="600">Free</T.Text>
                </T.XStack>
              </T.YStack>
            </T.Card>
          </T.YStack>
        </T.XStack>)}
    </T.YStack>);
}

// statstrade-web.feature.manage.campaigns.campaigns-preview/CampaignPreview [95] 
export function CampaignPreview({description,mode,title}){
  return (
    <CampaignPromotionView title={title} description={description} mode={mode}/>);
}