import 
  {BarChart3,Calendar,ChevronDown,DollarSign,Filter,Megaphone,MoreVertical,Plus,Search,Users}
 from '@tamagui/lucide-icons'

import * as T from 'tamagui'

import React from 'react'

import * as ui_manage from '@statstrade/component/ui-manage.jsx'

import * as kd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as common from '@statstrade/feature/manage/campaigns/campaigns-common.jsx'

import * as global_store from '@statstrade/edge/global-store.jsx'

import * as context_manage from '@statstrade/component/layout/manage/context-manage.jsx'

// statstrade-web.feature.manage.campaigns.campaigns-main/CampaignCard [21] 
export function CampaignCard({item,onPress}){
  return (
    <T.Card
      animation="quick"
      onPress={onPress}
      pressStyle={{"scale":0.995}}
      borderRadius="$4"
      bordered={true}
      hoverStyle={{"borderColor":"$color8"}}
      padding="$5"
      marginBottom="$4"
      backgroundColor="$color2">
      <T.XStack
        justifyContent="space-between"
        alignItems="flex-start"
        marginBottom="$2">
        <T.XStack gap="$2" alignItems="center">
          <T.H4 fontSize="$5" color="$color12" fontWeight="700">{item.title}</T.H4>
          <T.View
            backgroundColor={(item.status == "active") ? "$green3" : "$color4"}
            paddingHorizontal="$2"
            paddingVertical={2}
            borderRadius="$2"
            borderWidth={1}
            borderColor={(item.status == "active") ? "$green5" : "$color6"}>
            <T.Text
              fontSize={11}
              fontWeight="600"
              color={(item.status == "active") ? "$green11" : "$color11"}
              textTransform="capitalize">{item.status}
            </T.Text>
          </T.View>
        </T.XStack>
        <T.Button
          size="$2"
          chromeless={true}
          icon={MoreVertical}
          color="$color10"/>
      </T.XStack>
      <T.Paragraph
        color="$color11"
        fontSize="$3"
        marginBottom="$4"
        numberOfLines={2}>{item.description}
      </T.Paragraph>
      <T.XStack gap="$6" marginBottom="$4">
        <T.YStack>
          <T.Text fontSize={11} color="$color10">Markets</T.Text>
          <T.Text fontSize="$4" fontWeight="600" color="$color12">{item.marketCount}</T.Text>
        </T.YStack>
        <T.YStack>
          <T.Text fontSize={11} color="$color10">Participants</T.Text>
          <T.Text fontSize="$4" fontWeight="600" color="$color12">{(item.participantCount || 0).toLocaleString()}</T.Text>
        </T.YStack>
        <T.YStack>
          <T.Text fontSize={11} color="$color10">Budget</T.Text>
          <T.Text fontSize="$4" fontWeight="600" color="$color12">{"$" + (item.budget || 0).toLocaleString()}</T.Text>
        </T.YStack>
      </T.XStack>
      <T.XStack
        justifyContent="space-between"
        alignItems="center"
        marginTop="auto">
        <T.XStack gap="$2" alignItems="center">
          <Calendar size={14} color="$color10"/>
          <T.Text fontSize={12} color="$color10">{item.startDate + " - " + item.endDate}</T.Text>
        </T.XStack>
        <T.XStack gap="$2">
          {item.tags.map(function (tag){
            return (
              <T.View
                key={tag}
                backgroundColor="$color3"
                paddingHorizontal="$2"
                paddingVertical={4}
                borderRadius="$2"><T.Text fontSize={11} color="$color11">{tag}</T.Text>
              </T.View>);
          })}
        </T.XStack>
      </T.XStack>
    </T.Card>);
}

// statstrade-web.feature.manage.campaigns.campaigns-main/CampaignsList [78] 
export function CampaignsList(){
  let ctx = React.useContext(common.CampaignsContext);
  let {api,controls} = ctx;
  console.log("CampaignsList ctx",ctx);
  console.log("CampaignsList controls",controls);
  let {setSelectedId,setView} = controls;
  let [org] = global_store.useStore(["context","organisation"]);
  let orgId = org && org.id;
  let campaigns = kd.get_in(api.queries.list_campaigns,["data"],{"orgId":orgId}) || [];
  let stats = api.queries.get_stats.data || {
    "totalCampaigns":0,
    "activeCampaigns":0,
    "totalParticipants":0,
    "totalBudget":0
  };
  context_manage.useTopBar((
    <ui_manage.ManagerScreenHeader
      title="Campaigns"
      onAction={function (){
          setView("create");
        }}>
      <ui_manage.FilterSelect
        placeholder="Select Campaign"
        options={[]}
        size="$3"
        createLabel="Create Campaign"
        onCreate={function (){
            setView("create");
          }}/>
    </ui_manage.ManagerScreenHeader>),[orgId]);
  return (
    <T.YStack padding="$6" backgroundColor="$color1" flex={1} height="100%">
      <T.XStack gap="$4" marginBottom="$6" flexWrap="wrap">
        <ui_manage.StatCard
          label="Total Campaigns"
          value={stats.totalCampaigns || 0}
          icon={Megaphone}
          color="$blue10"/>
        <ui_manage.StatCard
          label="Active"
          value={stats.activeCampaigns || 0}
          icon={BarChart3}
          color="$green10"/>
        <ui_manage.StatCard
          label="Total Participants"
          value={(stats.totalParticipants || 0).toLocaleString()}
          icon={Users}
          color="$purple10"/>
        <ui_manage.StatCard
          label="Total Budget"
          value={"$" + (stats.totalBudget || 0).toLocaleString()}
          icon={DollarSign}
          color="$yellow10"/>
      </T.XStack>
      <T.XStack gap="$4" marginBottom="$4" alignItems="center">
        <ui_manage.SearchBar placeholder="Search campaigns..."/>
        <ui_manage.FilterSelect
          placeholder="All Status"
          options={[
              {"label":"Active","value":"active"},
              {"label":"Draft","value":"draft"},
              {"label":"Completed","value":"completed"}
            ]}/>
      </T.XStack>
      <T.YStack gap="$4">
        <T.XStack flexWrap="wrap" gap="$4">
          {campaigns.map(function (item){
            return (
              <T.View key={item.id} width="49%" minWidth={400} flexGrow={1}>
                <CampaignCard
                  item={item}
                  onPress={function (){
                      setSelectedId(item.id);
                      setView("detail");
                    }}/>
              </T.View>);
          })}
        </T.XStack>
        {api.queries.list_campaigns.isLoading ? (
          <T.View height={200} alignItems="center" justifyContent="center"><T.Spinner size="large" color="$color10"/></T.View>) : ((campaigns.length == 0) ? (
          <T.View height={200} alignItems="center" justifyContent="center"><T.Text color="$color11">No campaigns found</T.Text></T.View>) : null)}
      </T.YStack>
    </T.YStack>);
}