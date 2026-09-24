import 
  {Activity,Coins,Crown,MoreVertical,Plus,TrendingUp,UserPlus,Users,Zap}
 from '@tamagui/lucide-icons'

import * as T from 'tamagui'

import React from 'react'

import * as ui_manage from '@statstrade/component/ui-manage.jsx'

import * as kd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as global_store from '@statstrade/edge/global-store.jsx'

import * as common from '@statstrade/feature/manage/tokens/tokens-common.jsx'

import * as context_manage from '@statstrade/component/layout/manage/context-manage.jsx'

// statstrade-web.feature.manage.tokens.tokens-main/StatColumn [22] 
export function StatColumn({label,subColor,subValue,value}){
  return (
    <T.YStack>
      <T.Text fontSize={11} color="$color11" marginBottom={4}>{label}</T.Text>
      <T.Text fontSize={24} fontWeight="600" color="$color12">{value}</T.Text>
      {subValue ? (
        <T.Text fontSize={11} color={subColor || "$color11"} marginTop={4}>{subValue}</T.Text>) : null}
    </T.YStack>);
}

// statstrade-web.feature.manage.tokens.tokens-main/FeaturedToken [32] 
export function FeaturedToken({data}){
  return (
    <T.Card
      bordered={true}
      padding="$5"
      backgroundColor="$color2"
      marginBottom="$6">
      <T.XStack
        justifyContent="space-between"
        alignItems="flex-start"
        marginBottom="$6">
        <T.XStack gap="$4" alignItems="center">
          <T.View
            width={48}
            height={48}
            borderRadius="$3"
            backgroundColor="$green9"
            alignItems="center"
            justifyContent="center"><Coins size={24} color="white"/>
          </T.View>
          <T.YStack>
            <T.XStack gap="$2" alignItems="center">
              <T.H3 fontSize="$5" fontWeight="700" color="$color12">{data.name}</T.H3>
              <T.View
                borderWidth={1}
                borderColor="$green9"
                paddingHorizontal={4}
                paddingVertical={1}
                borderRadius={3}>
                <T.Text fontSize={10} color="$green9" fontWeight="700">{data.ticker}</T.Text>
              </T.View>
            </T.XStack>
            <T.Text fontSize="$3" color="$color11">Primary loyalty token for your community</T.Text>
          </T.YStack>
        </T.XStack>
        <T.Button
          size="$3"
          chromeless={true}
          icon={MoreVertical}
          color="$color10"/>
      </T.XStack>
      <T.XStack gap="$8" flexWrap="wrap" marginBottom="$6">
        <StatColumn label="Total Supply" value={data.totalSupply}/>
        <StatColumn
          label="Distributed"
          value={data.distributed}
          subValue={data.distributedLabel}
          subColor="$green9"/>
        <StatColumn
          label="Token Holders"
          value={data.holders}
          subValue={data.holdersLabel}
          subColor="$green9"/>
        <StatColumn
          label="Avg Balance"
          value={data.avgBalance}
          subValue={data.avgBalanceLabel}/>
      </T.XStack>
      <T.YStack height={160} justifyContent="flex-end">
        <T.Text fontSize={11} color="$color10" marginBottom="$2">Distribution Over Time</T.Text>
        <T.View
          height={1}
          backgroundColor="$color5"
          width="100%"
          position="absolute"
          bottom={20}/>
        <T.View
          height={1}
          backgroundColor="$color5"
          width="100%"
          position="absolute"
          bottom={60}/>
        <T.View
          height={1}
          backgroundColor="$color5"
          width="100%"
          position="absolute"
          bottom={100}/>
        <T.View
          height={1}
          backgroundColor="$color5"
          width="100%"
          position="absolute"
          bottom={140}/>
        <T.View
          height={30}
          width="100%"
          borderTopWidth={2}
          borderColor="$green9"
          style={{"transform":[{"rotate":"-1deg"}],"marginTop":100}}/>
      </T.YStack>
    </T.Card>);
}

// statstrade-web.feature.manage.tokens.tokens-main/TokenCard [67] 
export function TokenCard({item}){
  let Icon = (item.icon == "Crown") ? Crown : ((item.icon == "Zap") ? Zap : Coins);
  return (
    <T.Card
      bordered={true}
      padding="$5"
      backgroundColor="$color2"
      flex={1}
      minWidth={300}>
      <T.XStack justifyContent="space-between" marginBottom="$5">
        <T.View
          width={40}
          height={40}
          borderRadius="$3"
          backgroundColor={item.color}
          alignItems="center"
          justifyContent="center"><Icon size={20} color="white"/>
        </T.View>
        <T.View
          borderWidth={1}
          borderColor="$green9"
          paddingHorizontal={6}
          paddingVertical={2}
          borderRadius={4}>
          <T.Text
            fontSize={11}
            fontWeight="600"
            color="$green9"
            textTransform="uppercase">active
          </T.Text>
        </T.View>
      </T.XStack>
      <T.XStack gap="$2" alignItems="center" marginBottom="$1">
        <T.H4 fontSize="$4" fontWeight="700" color="$color12">{item.name}</T.H4>
        <T.Text fontSize={11} color="$color11" fontWeight="600">{item.ticker}</T.Text>
      </T.XStack>
      <T.YStack marginTop="auto">
        <T.XStack justifyContent="space-between" marginBottom={4}>
          <T.Text fontSize={11} color="$color11">Distributed</T.Text>
          <T.Text fontSize={11} color="$color12" fontWeight="600">{item.distributedPercent + "%"}</T.Text>
        </T.XStack>
        <T.Progress
          value={item.distributedPercent}
          height={4}
          backgroundColor="$color5"
          marginBottom="$4"><T.Progress.Indicator backgroundColor={item.color}/>
        </T.Progress>
        <T.XStack justifyContent="space-between">
          <T.YStack>
            <T.Text fontSize={11} color="$color11">Holders</T.Text>
            <T.Text fontSize="$3" fontWeight="600" color="$color12">{item.holders}</T.Text>
          </T.YStack>
          <T.YStack alignItems="flex-end">
            <T.Text fontSize={11} color="$color11">Supply</T.Text>
            <T.Text fontSize="$3" fontWeight="600" color="$color12">{item.supply}</T.Text>
          </T.YStack>
        </T.XStack>
      </T.YStack>
    </T.Card>);
}

// statstrade-web.feature.manage.tokens.tokens-main/EconomicsColumn [97] 
export function EconomicsColumn({icon,list,title}){
  let Icon = icon || Activity;
  return (
    <T.YStack flex={1} minWidth={200} gap="$4">
      <T.XStack gap="$2" alignItems="center">
        <T.View padding={6} backgroundColor="$color4" borderRadius="$2"><Icon size={14} color="$color11"/></T.View>
        <T.Text fontSize="$3" color="$color11" fontWeight="600">{title}</T.Text>
      </T.XStack>
      <T.YStack gap="$2">
        {list.map(function (item){
          return (
            <T.XStack key={item.label} justifyContent="space-between">
              <T.Text fontSize={11} color="$color11">{item.label}</T.Text>
              <T.Text fontSize={11} color="$color12" fontWeight="600">{item.value}</T.Text>
            </T.XStack>);
        })}
      </T.YStack>
    </T.YStack>);
}

// statstrade-web.feature.manage.tokens.tokens-main/TokensList [114] 
export function TokensList(){
  let ctx = React.useContext(common.TokensContext);
  let {api,controls} = ctx;
  let {setSelectedId,setView} = controls;
  let [org] = global_store.useStore(["context","organisation"]);
  let orgId = org && org.id;
  let tokens = kd.get_in(api.queries.organisation_token_list,["data"],{"orgId":orgId}) || [];
  let stats = api.queries.get_token_stats.data || null;
  context_manage.useTopBar((
    <ui_manage.ManagerScreenHeader
      title="Tokens"
      onAction={function (){
          setView("create");
        }}>
      <ui_manage.FilterSelect
        placeholder="Select Token"
        options={[]}
        size="$3"
        chromeless={true}
        createLabel="Create Token"
        onCreate={function (){
            setView("create");
          }}/>
    </ui_manage.ManagerScreenHeader>),[orgId]);
  return (
    <T.ScrollView
      contentContainerStyle={{"padding":"$6","backgroundColor":"$color1","flexGrow":1}}>
      {api.queries.get_token_stats.isLoading ? (
        <T.Spinner size="large" color="$color10" marginTop={50}/>) : (!stats ? (
        <T.View height={200} alignItems="center" justifyContent="center"><T.Text color="$color11">No tokens created yet</T.Text></T.View>) : (
        <T.YStack gap="$6">
          <FeaturedToken data={stats.highlighted}/>
          <T.YStack gap="$4">
            <T.Text fontSize={12} color="$color11" fontWeight="600">All Tokens</T.Text>
            <T.XStack gap="$4" flexWrap="wrap">
              {tokens.map(function (item){
                (
                  <TokenCard key={item.id} item={item}/>);
              })}
            </T.XStack>
          </T.YStack>
          <T.Card bordered={true} padding="$5" backgroundColor="$color2">
            <T.Text
              fontSize="$3"
              fontWeight="600"
              color="$color12"
              marginBottom="$4">Token Economics
            </T.Text>
            <T.XStack gap="$6" flexWrap="wrap">
              <EconomicsColumn
                title="Points Earned"
                icon={TrendingUp}
                list={stats.economics.earned}/>
              <T.View width={1} backgroundColor="$color4"/>
              <EconomicsColumn
                title="Points Spent"
                icon={Activity}
                list={stats.economics.spent}/>
              <T.View width={1} backgroundColor="$color4"/>
              <EconomicsColumn
                title="User Engagement"
                icon={UserPlus}
                list={stats.economics.engagement}/>
            </T.XStack>
          </T.Card>
        </T.YStack>))}
    </T.ScrollView>);
}