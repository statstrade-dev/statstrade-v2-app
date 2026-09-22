import {Clock,DollarSign,MoreVertical,Play,Plus,TrendingUp,Users} from '@tamagui/lucide-icons'

import * as T from 'tamagui'

import React from 'react'

import * as ui_manage from '@statstrade/component/ui-manage.jsx'

import * as kd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as common from '@statstrade/feature/manage/topics/topics-common.jsx'

import * as global_store from '@statstrade/edge/global-store.jsx'

import * as context_manage from '@statstrade/component/layout/manage/context-manage.jsx'

// statstrade-web.feature.manage.topics.topics-main/MarketCard [22] 
export function MarketCard({item}){
  return (
    <T.Card
      bordered={true}
      borderRadius="$4"
      padding="$5"
      backgroundColor="$color2"
      marginBottom="$4"
      hoverStyle={{"borderColor":"$color8"}}
      animation="quick">
      <T.XStack
        justifyContent="space-between"
        alignItems="flex-start"
        marginBottom="$4">
        <T.YStack flex={1} gap="$2">
          <T.XStack alignItems="center" gap="$3">
            <T.H4 fontSize="$5" color="$color12" fontWeight="600">{item.question}</T.H4>
            {(item.status == "live") ? (
              <T.View
                borderRadius="$2"
                borderColor="$green9"
                paddingHorizontal="$2"
                flexDirection="row"
                borderWidth={1}
                paddingVertical={2}
                gap="$2"
                backgroundColor="transparent"
                alignItems="center">
                <Play size={10} color="$green9" fill="$green9"/>
                <T.Text
                  fontSize={11}
                  fontWeight="600"
                  color="$green9"
                  textTransform="uppercase">Live
                </T.Text>
              </T.View>) : null}
          </T.XStack>
          <T.Text fontSize="$3" color="$color11">{item.description}</T.Text>
        </T.YStack>
        <T.Button
          size="$3"
          chromeless={true}
          icon={MoreVertical}
          color="$color10"/>
      </T.XStack>
      <T.YStack gap="$4" marginBottom="$5">
        {item.outcomes.map(function (outcome){
          return (
            <T.YStack key={outcome.label} gap="$2">
              <T.XStack justifyContent="space-between" marginBottom={2}>
                <T.Text fontSize="$3" color="$color12" fontWeight="500">{outcome.label}</T.Text>
                <T.XStack gap="$4">
                  <T.Text fontSize="$3" color="$color11">{outcome.points.toLocaleString() + " pts"}</T.Text>
                  <T.Text
                    fontSize="$3"
                    color="$color12"
                    fontWeight="600"
                    width={40}
                    textAlign="right">{outcome.percentage + "%"}
                  </T.Text>
                </T.XStack>
              </T.XStack>
              <T.Progress
                value={outcome.percentage}
                height={6}
                backgroundColor="$color5">
                <T.Progress.Indicator backgroundColor={outcome.color} animation="quick"/>
              </T.Progress>
            </T.YStack>);
        })}
      </T.YStack>
      <T.XStack
        justifyContent="space-between"
        alignItems="center"
        borderTopWidth={1}
        borderColor="$borderColor"
        paddingTop="$4">
        <T.XStack gap="$4">
          <T.Text fontSize="$2" color="$color11">
            {"$ " + item.totalStaked.toLocaleString() + " total staked"}
          </T.Text>
          <T.Text fontSize="$2" color="$color11">{item.participantCount + " participants"}</T.Text>
          <T.XStack gap="$2" alignItems="center">
            <Clock size={12} color="$color11"/>
            <T.Text fontSize="$2" color="$color11">{"Ends " + item.endDate}</T.Text>
          </T.XStack>
        </T.XStack>
        <T.Button
          size="$3"
          variant="outlined"
          color="$color11"
          borderColor="$color6">View Details
        </T.Button>
      </T.XStack>
    </T.Card>);
}

// statstrade-web.feature.manage.topics.topics-main/MarketsList [81] 
export function MarketsList(){
  let ctx = React.useContext(common.TopicsContext);
  let {api,controls} = ctx;
  let {setSelectedId,setView} = controls;
  let [org] = global_store.useStore(["context","organisation"]);
  let orgId = org && org.id;
  let markets = kd.get_in(api.queries.prospect_market_list,["data"],{"orgId":orgId}) || [];
  let stats = api.queries.get_market_stats.data || {
    "activeMarkets":0,
    "totalVolume":"0",
    "totalParticipants":"0",
    "avgStake":0
  };
  context_manage.useTopBar((
    <ui_manage.ManagerScreenHeader
      title="Markets"
      onAction={function (){
          setView("create");
        }}>
      <ui_manage.FilterSelect
        placeholder="Select Market"
        options={[]}
        size="$3"
        createLabel="Create Market"
        onCreate={function (){
            setView("create");
          }}/>
    </ui_manage.ManagerScreenHeader>),[orgId]);
  return (
    <T.YStack padding="$6" backgroundColor="$color1" flex={1} height="100%">
      <T.XStack gap="$4" marginBottom="$6" flexWrap="wrap">
        <ui_manage.StatCard
          label="Active Markets"
          value={stats.activeMarkets}
          footer="+2 this week"
          icon={TrendingUp}
          color="$green10"/>
        <ui_manage.StatCard
          label="Total Volume"
          value={stats.totalVolume}
          subValue="points staked"
          icon={DollarSign}
          color="$blue10"/>
        <ui_manage.StatCard
          label="Participants"
          value={stats.totalParticipants}
          footer="+234 this week"
          icon={Users}
          color="$purple10"/>
        <ui_manage.StatCard
          label="Avg Stake"
          value={stats.avgStake}
          subValue="points per bet"
          icon={Clock}
          color="$pink10"/>
      </T.XStack>
      <T.YStack gap="$4">
        {markets.map(function (item){
          return (
            <MarketCard key={item.id} item={item}/>);
        })}
      </T.YStack>
    </T.YStack>);
}