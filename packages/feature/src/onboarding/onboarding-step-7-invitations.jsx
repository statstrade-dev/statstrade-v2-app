import {Plus,Trash,Users} from '@tamagui/lucide-icons'

import React from 'react'

import * as T from 'tamagui'

import * as common from '@statstrade/feature/onboarding/onboarding-common.jsx'

import * as ui_section from '@statstrade/component/ui-section.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

import * as element_invitation from '@statstrade/component/element/element-invitation.jsx'

// statstrade-web.feature.onboarding.onboarding-step-7-invitations/OnboardingStep7InvitationsScreen [17] 
export function OnboardingStep7InvitationsScreen(){
  let context = React.useContext(common.IndexOnboardingContext);
  let {api,controls,forms} = context;
  let [showPreview,setShowPreview] = React.useState(false);
  let [message,setMessage] = React.useState(
    "Hey! I'd like to invite you to join my organisation on Statstrade."
  );
  let handle_add = function (values,inputRef){
    let email = values.email;
    if(email && !controls.invitees.includes(email)){
      controls.setInvitees([...(controls.invitees || []),email]);
      forms.invitations.reset();
      setTimeout(function (){
        new Promise(function (){
          inputRef.current.focus();
        });
      },100);
      null;
    }
    else{
      console.log("Invalid email or duplicate");
    }
  };
  let handle_remove = function (idx){
    controls.setInvitees(controls.invitees.filter(function (_,i){
      return i !== idx;
    }));
  };
  return (
    <ui_section.MinFrameCenter maxWidth={500}>
      {!showPreview ? (
        <React.Fragment>
          <ui_section.MinHeader
            logo={(
                <T.YStack
                  width={100}
                  height={100}
                  backgroundColor="$color2"
                  borderRadius="$full"
                  alignItems="center"
                  justifyContent="center"><Users size={40} color="$color10"/>
                </T.YStack>)}
            title="Invite Team"
            paragraph="Invite team members or community leaders to help manage your campaigns."/>
          <T.YStack alignItems="center" gap="$6" marginTop="$4" width="100%">
            <element_invitation.InvitationInput
              form={forms.invitations}
              control={forms.invitations.control}
              field="email"
              onAdd={handle_add}/>
            <element_invitation.InvitationList invitees={controls.invitees} onRemove={handle_remove}/>
          </T.YStack>
          <T.XStack
            gap="$4"
            width="100%"
            flexDirection="row-reverse"
            marginTop="$4">
            <ui.ButtonInverse
              flex={4}
              size="$5"
              fontSize="$5"
              onPress={function (){
                  if(controls.invitees.length > 0){
                    setShowPreview(true);
                  }
                  else{
                    controls.setStep(6);
                  }
                }}
              color="$color12">
              {(controls.invitees.length > 0) ? ui.t("Invite") : ui.t("Next")}
            </ui.ButtonInverse>
          </T.XStack>
        </React.Fragment>) : (
        <React.Fragment>
          <ui_section.MinHeader
            title="Preview Message"
            paragraph="Personalise the message sent to your invitees."/>
          <T.YStack gap="$4" width="100%" marginTop="$4">
            <T.TextArea
              borderRadius="$4"
              onChangeText={setMessage}
              focusStyle={{"borderColor":"$purple10"}}
              borderColor="$borderColor"
              value={message}
              size="$5"
              padding="$4"
              numberOfLines={6}
              backgroundColor="$background"/>
            <T.XStack
              gap="$4"
              width="100%"
              flexDirection="row-reverse"
              marginTop="$4">
              <ui.ButtonInverse
                flex={4}
                size="$5"
                fontSize="$5"
                onPress={function (){
                    let orgId = controls.existingOrg && controls.existingOrg.id;
                    if(orgId){
                      api.mutations.organisation_invite_via_email.mutateAsync({
                        "org_id":orgId,
                        "emails":controls.invitees,
                        "subject":"Invitation to join",
                        "template_id":"INVITE_ORG"
                      }).then(function (){
                        setInvitees([]);
                        controls.setStep(6);
                      });
                    }
                    else{
                      controls.setStep(6);
                    }
                  }}
                disabled={api.mutations.organisation_invite_via_email.isPending}
                icon={api.mutations.organisation_invite_via_email.isPending ? (function (){
                    return (
                      <T.Spinner/>);
                  }) : null}
                color="$color12">{ui.t("Send Invites")}
              </ui.ButtonInverse>
              <ui.ButtonNormal
                flex={4}
                size="$5"
                fontSize="$5"
                onPress={function (){
                    setShowPreview(false);
                  }}
                color="$color11"
                backgroundColor="$color1">{ui.t("Back")}
              </ui.ButtonNormal>
            </T.XStack>
          </T.YStack>
        </React.Fragment>)}
    </ui_section.MinFrameCenter>);
}