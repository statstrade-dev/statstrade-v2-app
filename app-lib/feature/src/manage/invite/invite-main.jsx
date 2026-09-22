import {Check,Copy,Link,Mail,MoreVertical,Plus,Users} from '@tamagui/lucide-icons'

import * as T from 'tamagui'

import React from 'react'

import * as common from '@statstrade/feature/manage/invite/invite-common'

import * as context_manage from '@statstrade/component/layout/manage/context-manage'

import * as ui_manage from '@statstrade/component/ui-manage'

import * as kd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

// statstrade-web.feature.manage.invites.invites-main/InviteCard [17] 
export function InviteCard({item}){
  return (
    <T.Card
      bordered={true}
      borderRadius="$4"
      padding="$4"
      backgroundColor="$color2"
      marginBottom="$3"
      hoverStyle={{"borderColor":"$color8"}}
      animation="quick">
      <T.XStack justifyContent="space-between" alignItems="center">
        <T.XStack gap="$4" alignItems="center">
          <T.Avatar circular={true} size="$3">
            <T.AvatarFallback
              backgroundColor="$purple4"
              alignItems="center"
              justifyContent="center"><Mail size={16} color="$purple11"/>
            </T.AvatarFallback>
          </T.Avatar>
          <T.YStack>
            <T.XStack gap="$2" alignItems="center">
              <T.Text fontSize="$3" color="$color12" fontWeight="600">{item.code}</T.Text>
              <T.Text
                fontSize={11}
                color="$color10"
                textTransform="uppercase"
                backgroundColor="$color4"
                paddingHorizontal={4}
                borderRadius={4}>{item.channel}
              </T.Text>
            </T.XStack>
            <T.Text fontSize={11} color="$color11">
              {str(
                "Created ",
                item.time_created && new Date(item.time_created).toLocaleDateString()
              )}
            </T.Text>
          </T.YStack>
        </T.XStack>
        <T.XStack gap="$2">
          <T.Button size="$2" icon={Copy} chromeless={true}>{"Copy Code"}</T.Button>
          <T.Button size="$2" icon={MoreVertical} chromeless={true}/>
        </T.XStack>
      </T.XStack>
      <T.XStack
        marginTop="$3"
        gap="$4"
        borderTopWidth={1}
        borderColor="$borderColor"
        paddingTop="$3">
        <T.Text fontSize={11} color="$color11">{str("Clicks: ",item.clicks || 0)}</T.Text>
        <T.Text fontSize={11} color="$color11">{str("Signups: ",item.signups || 0)}</T.Text>
      </T.XStack>
    </T.Card>);
}

// statstrade-web.feature.manage.invites.invites-main/InvitesList [51] 
export function InvitesList(){
  let ctx = React.useContext(common.InviteContext);
  let {api,controls} = ctx;
  let {orgId,setView} = controls;
  let invites = kd.get_in(api,["queries","list_invites","data"]) || [];
  context_manage.useTopBar((
    <ui_manage.ManagerScreenHeader
      title="Invites"
      onAction={function (){
          setView("create");
        }}>
      <ui_manage.FilterSelect
        placeholder="All Invites"
        options={[]}
        size="$3"
        createLabel="Create Invite"
        onCreate={function (){
            setView("create");
          }}/>
    </ui_manage.ManagerScreenHeader>),[orgId]);
  return (
    <T.YStack padding="$6" backgroundColor="$color1" flex={1} height="100%">
      <T.XStack gap="$4" marginBottom="$6" flexWrap="wrap">
        <ui_manage.StatCard
          label="Total Invites"
          value={invites.length}
          icon={Link}
          color="$blue10"/>
        <ui_manage.StatCard label="Total Signups" value="0" icon={Users} color="$green10"/>
      </T.XStack>
      <T.YStack gap="$4">
        {(invites.length > 0) ? invites.map(function (item){
          return (
            <InviteCard key={item.id} item={item}/>);
        }) : (
          <T.View height={200} alignItems="center" justifyContent="center"><T.Text color="$color11">{"No invites found"}</T.Text></T.View>)}
      </T.YStack>
    </T.YStack>);
}
