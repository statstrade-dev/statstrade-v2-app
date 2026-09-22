import {Check,Mail,Plus,Users,X} from '@tamagui/lucide-icons'

import * as T from 'tamagui'

import React from 'react'

import * as kd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as rq from '@statstrade/edge/lib/js/lib/react-query.jsx'

import * as common from '@statstrade/feature/manage/settings/settings-common.jsx'

import * as action_organisation from '@statstrade/group/manage-organisation-action.jsx'

import * as context_manage from '@statstrade/component/layout/manage/context-manage.jsx'

// statstrade-web.feature.manage.settings.settings-team/TeamMemberRow [22] 
export function TeamMemberRow({email,name,role}){
  return (
    <T.XStack
      padding="$4"
      backgroundColor="$color2"
      borderRadius="$3"
      marginBottom="$2"
      justifyContent="space-between"
      alignItems="center">
      <T.XStack gap="$4" alignItems="center">
        <T.Avatar circular={true} size="$3">
          <T.AvatarFallback
            backgroundColor="$blue4"
            alignItems="center"
            justifyContent="center">
            <T.Text color="$blue11" fontSize={12} fontWeight="600">{name.substring(0,2)}</T.Text>
          </T.AvatarFallback>
        </T.Avatar>
        <T.YStack>
          <T.Text fontSize="$3" color="$color12" fontWeight="600">{name}</T.Text>
          <T.Text fontSize={11} color="$color11">{email}</T.Text>
        </T.YStack>
      </T.XStack>
      <T.Text fontSize={12} color="$color10" textTransform="capitalize">{role}</T.Text>
    </T.XStack>);
}

// statstrade-web.feature.manage.settings.settings-team/InviteRow [36] 
export function InviteRow({channel,code,status,time_created}){
  return (
    <T.XStack
      padding="$4"
      backgroundColor="$color2"
      borderRadius="$3"
      marginBottom="$2"
      justifyContent="space-between"
      alignItems="center">
      <T.XStack gap="$4" alignItems="center">
        <T.Avatar circular={true} size="$3">
          <T.AvatarFallback
            backgroundColor="$purple4"
            alignItems="center"
            justifyContent="center">
            <T.Text color="$purple11" fontSize={12} fontWeight="600">INV</T.Text>
          </T.AvatarFallback>
        </T.Avatar>
        <T.YStack>
          <T.Text fontSize="$3" color="$color12" fontWeight="600">{code}</T.Text>
          <T.Text fontSize={11} color="$color11">{str(channel," • ",status)}</T.Text>
        </T.YStack>
      </T.XStack>
      <T.Text fontSize={12} color="$color10">{time_created}</T.Text>
    </T.XStack>);
}

// statstrade-web.feature.manage.settings.settings-team/SettingsTeam [50] 
export function SettingsTeam(){
  let ctx = React.useContext(common.SettingsContext);
  let layoutCtx = React.useContext(context_manage.LayoutManageContext);
  let org = kd.get_in(
    layoutCtx,
    ["api","queries","user_list_owner_organisations","output",0]
  );
  let orgId = org && org.id;
  let api = rq.useApi(action_organisation.manageInviteApi,{"orgId":orgId});
  let invites = kd.get_in(api.queries.organisation_invite_list,["data"]) || [];
  let members = [
    {
      "id":1,
      "name":"Alice Smith",
      "email":"alice@example.com",
      "role":"admin"
    },
    {
      "id":2,
      "name":"Bob Jones",
      "email":"bob@example.com",
      "role":"editor"
    }
  ];
  let handleCreateInvite = function (){
    let mutation = kd.get_in(api,["mutations","organisation_invite_email_create"]);
    mutation.mutate({
      "organisation_id":orgId,
      "emails":"test@test.com",
      "channel":"email"
    });
  };
  return (
    <T.YStack gap="$4">
      <T.XStack justifyContent="space-between" alignItems="center">
        <T.H4 fontSize="$5" color="$color12" fontWeight="600">Team Members</T.H4>
        <T.Button
          size="$3"
          theme="blue"
          icon={Plus}
          onPress={handleCreateInvite}>Invite Member
        </T.Button>
      </T.XStack>
      {members.map(function (item){
        return (
          <TeamMemberRow key={item.id} {...item}/>);
      })}
      {(invites.length > 0) ? (
        <T.YStack gap="$2" marginTop="$4">
          <T.H5 fontSize="$4" color="$color11" fontWeight="600">Pending Invites</T.H5>
          {invites.map(function (item){
            return (
              <InviteRow key={item.id} {...item}/>);
          })}
        </T.YStack>) : null}
    </T.YStack>);
}