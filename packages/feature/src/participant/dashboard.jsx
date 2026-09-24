import {ArrowRight,Award,Clock,Star,TrendingUp,Wallet,Zap} from '@tamagui/lucide-icons'

import * as T from 'tamagui'

// statstrade-web.feature.participant.dashboard/StatCard [12] 
export function StatCard({color,icon,label,value}){
  let Icon = icon || Star;
  return (
    <T.Card
      animation="bouncy"
      pressStyle={{"scale":0.9}}
      borderRadius="$4"
      scale={0.9}
      bordered={true}
      minWidth={150}
      flex={1}
      hoverStyle={{"scale":1.0}}
      padding="$4"
      backgroundColor="$color2"
      height={110}>
      <T.XStack justifyContent="space-between" alignItems="flex-start">
        <T.YStack>
          <T.Text fontSize="$2" color="$color11" fontWeight="500">{label}</T.Text>
          <T.Text fontSize="$6" color="$color12" fontWeight="800" marginTop="$1">{value}</T.Text>
        </T.YStack>
        <T.View
          backgroundColor={color}
          width={40}
          height={40}
          justifyContent="center"
          alignItems="center"
          borderRadius="$3"
          opacity={0.2}><Icon size={20} color={color} opacity={1}/>
        </T.View>
      </T.XStack>
    </T.Card>);
}

// statstrade-web.feature.participant.dashboard/SectionHeader [45] 
export function SectionHeader({action,title}){
  return (
    <T.XStack
      justifyContent="space-between"
      alignItems="center"
      marginBottom="$4"
      marginTop="$6">
      <T.H3 fontSize="$5" color="$color12">{title}</T.H3>
      {action ? (
        <T.Button
          chromeless={true}
          color="$blue10"
          fontSize="$3"
          iconAfter={ArrowRight}
          onPress={action}>View All
        </T.Button>) : null}
    </T.XStack>);
}

// statstrade-web.feature.participant.dashboard/FeaturedCard [66] 
export function FeaturedCard({badge,image,subtitle,title}){
  return (
    <T.Card
      elevate={true}
      bordered={true}
      width={280}
      height={180}
      overflow="hidden"
      borderRadius="$4"
      backgroundColor="$color3">
      <T.Image
        source={{"uri":image}}
        width="100%"
        height="100%"
        style={{"position":"absolute","opacity":0.6}}/>
      <T.View
        flex={1}
        justifyContent="flex-end"
        padding="$3"
        style={{
            "background":"linear-gradient(to top, rgba(0,0,0,0.8), transparent)"
          }}>
        {badge ? (
          <T.View
            position="absolute"
            top="$3"
            right="$3"
            backgroundColor="$yellow10"
            paddingHorizontal="$2"
            paddingVertical="$1"
            borderRadius="$2">
            <T.Text fontSize="$1" color="black" fontWeight="bold">{badge}</T.Text>
          </T.View>) : null}
        <T.Text fontSize="$4" fontWeight="bold" color="white">{title}</T.Text>
        <T.Text fontSize="$2" color="$gray8">{subtitle}</T.Text>
      </T.View>
    </T.Card>);
}

// statstrade-web.feature.participant.dashboard/ActivityItem [98] 
export function ActivityItem({color,icon,points,time,title}){
  let Icon = icon || Clock;
  return (
    <T.XStack
      paddingVertical="$3"
      borderBottomWidth={1}
      borderColor="$borderColor"
      alignItems="center"
      gap="$3">
      <T.View backgroundColor="$color4" padding="$2" borderRadius="$3"><Icon size={16} color={color || "$color11"}/></T.View>
      <T.YStack flex={1}>
        <T.Text fontSize="$3" color="$color12">{title}</T.Text>
        <T.Text fontSize="$2" color="$color11">{time}</T.Text>
      </T.YStack>
      <T.Text fontSize="$3" color="$green10" fontWeight="bold">{points}</T.Text>
    </T.XStack>);
}

// statstrade-web.feature.participant.dashboard/ParticipantDashboard [121] 
export function ParticipantDashboard(){
  return (
    <T.ScrollView
      contentContainerStyle={{"padding":"$5","paddingBottom":"$10"}}>
      <T.YStack marginBottom="$6">
        <T.H2 fontSize="$8" color="$color12">Good Morning, Alex!</T.H2>
        <T.Text fontSize="$4" color="$color11">Here's what's happening in your network today.</T.Text>
      </T.YStack>
      <T.XStack gap="$4" flexWrap="wrap">
        <StatCard
          label="My Tokens"
          value="5 Wallets"
          icon={Wallet}
          color="$blue10"/>
        <StatCard label="Rank" value="#42" icon={Award} color="$yellow10"/>
        <StatCard label="Active Tasks" value="5" icon={Zap} color="$purple10"/>
        <StatCard
          label="Market Value"
          value="+15%"
          icon={TrendingUp}
          color="$green10"/>
      </T.XStack>
      <SectionHeader
        title="Trending Markets"
        action={function (){
            console.log("View Markets");
          }}/>
      <T.ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{"gap":"$4"}}>
        <FeaturedCard
          title="Tech Startups 2025"
          subtitle="Prediction Market"
          image="https://picsum.photos/300/200?random=1"
          badge="HOT"/>
        <FeaturedCard
          title="Global Climate Summit"
          subtitle="Outcome Trading"
          image="https://picsum.photos/300/200?random=2"/>
        <FeaturedCard
          title="Esports Championship"
          subtitle="Tournament Pool"
          image="https://picsum.photos/300/200?random=3"
          badge="NEW"/>
      </T.ScrollView>
      <SectionHeader title="Recent Activity"/>
      <T.YStack
        backgroundColor="$color2"
        borderRadius="$4"
        paddingHorizontal="$4">
        <ActivityItem
          title="Completed 'Daily Login'"
          time="2 hours ago"
          points="+50 pts"
          icon={Star}
          color="$yellow10"/>
        <ActivityItem
          title="Prediction Correct: AAPL"
          time="5 hours ago"
          points="+200 pts"
          icon={TrendingUp}
          color="$green10"/>
        <ActivityItem
          title="New Badge Earned"
          time="1 day ago"
          points="Sharpshooter"
          icon={Award}
          color="$purple10"/>
      </T.YStack>
    </T.ScrollView>);
}