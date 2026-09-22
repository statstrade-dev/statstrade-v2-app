import {Activity,ArrowUpRight,Box,Clock,Info,TrendingUp,Users} from '@tamagui/lucide-icons'

import * as T from 'tamagui'

// statsui.basic.topic-preview/CountdownBox [13] 
export function CountdownBox({label,value}){
  return (
    <T.YStack
      backgroundColor="$color2"
      paddingVertical="$2"
      paddingHorizontal="$3"
      borderRadius="$2"
      alignItems="center"
      minWidth={70}>
      <T.Text fontSize={24} fontWeight="700" color="$color12">{value}</T.Text>
      <T.Text fontSize={10} color="$color10">{label}</T.Text>
    </T.YStack>);
}

// statsui.basic.topic-preview/TopicOption [20] 
export function TopicOption({amount,apy,isLeader,label,percent,type}){
  let isYes = type == "YES";
  let color = isYes ? "$green9" : "$red9";
  let bgColor = isYes ? "rgba(52, 211, 153, 0.1)" : "rgba(248, 113, 113, 0.1)";
  return (
    <T.YStack
      flex={1}
      backgroundColor={bgColor}
      borderWidth={1}
      borderColor={isYes ? "$green5" : "$red5"}
      borderRadius="$3"
      padding="$3"
      position="relative"
      overflow="hidden">
      <T.XStack justifyContent="space-between" marginBottom="$2">
        <T.Text fontSize={16} fontWeight="800" color={color}>{type}</T.Text>
        <T.View
          backgroundColor={isYes ? "$green4" : "$red4"}
          paddingHorizontal={6}
          paddingVertical={2}
          borderRadius={4}>
          <T.Text
            fontSize={9}
            color={isYes ? "$green11" : "$red11"}
            fontWeight="600">{label}
          </T.Text>
        </T.View>
      </T.XStack>
      <T.XStack alignItems="flex-end" gap="$2" marginBottom={4}>
        <T.Text fontSize={24} fontWeight="700" color="white">{percent + "%"}</T.Text>
        <T.Text fontSize={11} color="$color11" marginBottom={4}>APY</T.Text>
      </T.XStack>
      <T.XStack justifyContent="space-between" alignItems="center">
        <T.Text fontSize={11} color="$color11">{amount}</T.Text>
        <T.Text
          fontSize={10}
          color={isYes ? "$green10" : "$red10"}
          fontWeight="600">{isLeader ? "Leader" : "Challenger"}
        </T.Text>
      </T.XStack>
    </T.YStack>);
}

// statsui.basic.topic-preview/TopicPreview [50] 
export function TopicPreview({description,title}){
  return (
    <T.YStack
      width={380}
      backgroundColor="#121212"
      borderRadius="$6"
      overflow="hidden"
      borderWidth={1}
      borderColor="$color4">
      <T.View
        height={200}
        backgroundColor="#1A1A1A"
        position="relative"
        alignItems="center"
        justifyContent="center">
        <T.Image
          source={{
              "uri":"https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=500&q=80"
            }}
          width="100%"
          height="100%"
          style={{"opacity":0.8}}/>
        <T.XStack position="absolute" top={16} right={16} gap="$2">
          <T.Button
            circular={true}
            size="$3"
            backgroundColor="#121212"
            icon={ArrowUpRight}
            color="$green9"/>
          <T.View
            backgroundColor="rgba(16, 185, 129, 0.2)"
            paddingHorizontal={12}
            paddingVertical={6}
            borderRadius="$full"
            borderWidth={1}
            borderColor="$green9">
            <T.Text color="$green9" fontSize={11} fontWeight="700">POOLS OPEN</T.Text>
          </T.View>
        </T.XStack>
      </T.View>
      <T.YStack padding="$5" gap="$5">
        <T.YStack gap="$1">
          <T.H3 color="white" fontSize={20} fontWeight="700">{title || "X-2000 Launch Event"}</T.H3>
          <T.XStack gap="$2" alignItems="center">
            <T.Text color="$color11" fontSize={12}>Hype Level:</T.Text>
            <T.Text color="$orange10" fontSize={12} fontWeight="600">High Volatility</T.Text>
          </T.XStack>
        </T.YStack>
        <T.YStack
          backgroundColor="$color2"
          padding="$3.5"
          borderRadius="$3"
          borderWidth={1}
          borderColor="$color4">
          <T.Text color="$color10" fontSize={11} marginBottom={4}>The Alpha</T.Text>
          <T.Text color="white" fontSize={15} fontWeight="500">
            Will it sell out under 24h?
            <T.Text color="$green9" fontWeight="600"> under 18h 42m</T.Text>
          </T.Text>
        </T.YStack>
        <T.XStack gap="$3">
          <T.YStack
            flex={1}
            backgroundColor="$color2"
            padding="$3.5"
            borderRadius="$3">
            <T.XStack gap="$2" marginBottom="$2" alignItems="center">
              <Users size={12} color="$color11"/>
              <T.Text color="$color11" fontSize={11}>Stakers</T.Text>
            </T.XStack>
            <T.Text color="white" fontSize={20} fontWeight="600">2,847</T.Text>
          </T.YStack>
          <T.YStack
            flex={1}
            backgroundColor="$color2"
            padding="$3.5"
            borderRadius="$3">
            <T.XStack gap="$2" marginBottom="$2" alignItems="center">
              <Box size={12} color="$color11"/>
              <T.Text color="$color11" fontSize={11}>Pool Liquidity</T.Text>
            </T.XStack>
            <T.XStack alignItems="baseline" gap="$2">
              <T.Text color="white" fontSize={20} fontWeight="600">142.5K</T.Text>
              <T.Text color="$color10" fontSize={11}>$X2K</T.Text>
            </T.XStack>
          </T.YStack>
        </T.XStack>
        <T.YStack
          backgroundColor="$color2"
          padding="$4"
          borderRadius="$4"
          gap="$3">
          <T.XStack justifyContent="space-between" alignItems="center">
            <T.XStack gap="$2" alignItems="center">
              <Clock size={14} color="$color11"/>
              <T.Text color="$color11" fontSize={12}>Lock-up Period</T.Text>
            </T.XStack>
            <T.Text color="$green10" fontSize={11} fontWeight="600">Live</T.Text>
          </T.XStack>
          <T.XStack gap="$2" justifyContent="center" alignItems="center">
            <CountdownBox value="18" label="Hours"/>
            <T.Text color="$color11" marginBottom={15}>:</T.Text>
            <CountdownBox value="42" label="Minutes"/>
            <T.Text color="$color11" marginBottom={15}>:</T.Text>
            <CountdownBox value="10" label="Seconds"/>
          </T.XStack>
        </T.YStack>
        <T.YStack gap="$3">
          <T.XStack justifyContent="space-between" alignItems="flex-end">
            <T.Text color="white" fontSize={14} fontWeight="600">Choose Your Side</T.Text>
            <T.Text color="$color10" fontSize={11}>Pools compete for yield</T.Text>
          </T.XStack>
          <T.XStack justifyContent="space-between" marginBottom={2}>
            <T.Text color="$green9" fontSize={11} fontWeight="600">60% Bullish</T.Text>
            <T.Text color="$red9" fontSize={11} fontWeight="600">40% Bearish</T.Text>
          </T.XStack>
          <T.XStack height={6} borderRadius="$full" overflow="hidden" width="100%">
            <T.View flex={0.6} backgroundColor="$green9"/>
            <T.View flex={0.4} backgroundColor="$red9"/>
          </T.XStack>
          <T.XStack gap="$3" marginTop="$2">
            <TopicOption
              type="YES"
              percent="14.2"
              amount="85k $X2K"
              label="High Demand"
              isLeader={true}/>
            <TopicOption
              type="NO"
              percent="8.5"
              amount="57.5k $X2K"
              label="Inventory Risk"
              isLeader={false}/>
          </T.XStack>
        </T.YStack>
        <T.YStack
          backgroundColor="$color2"
          padding="$3"
          borderRadius="$3"
          gap="$2">
          <T.XStack gap="$2">
            <Activity size={14} color="$color11"/>
            <T.Text color="white" fontSize={12} fontWeight="600">Dynamic Yield:</T.Text>
            <T.Text color="$color11" fontSize={12} flex={1}>
              Winners farm fees from the losing pool. APY adjusts in real-time.
            </T.Text>
          </T.XStack>
        </T.YStack>
        <T.Text color="$color10" fontSize={10} textAlign="center">14-day lock-up. Early exit penalty applies.</T.Text>
      </T.YStack>
    </T.YStack>);
}