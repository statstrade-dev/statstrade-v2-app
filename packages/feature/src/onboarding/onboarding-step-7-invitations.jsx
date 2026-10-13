import {Users} from '@tamagui/lucide-icons'

import React from 'react'

import * as T from 'tamagui'

import * as common from '@statstrade/feature/onboarding/onboarding-common.jsx'

import * as ui_section from '@statstrade/component/ui-section.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

import * as element_invitation from '@statstrade/component/element/element-invitation.jsx'

// statstrade-web.feature.onboarding.onboarding-step-7-invitations/OnboardingStep7InvitationsScreen [15] 
export function OnboardingStep7InvitationsScreen(){
  let context = React.useContext(common.IndexOnboardingContext);
  let {api,controls,forms} = context;
  let [showPreview,setShowPreview] = React.useState(false);
  let [feedback,setFeedback] = React.useState(null);
  let isBusy = api.mutations.organisation_invite_email_create.isPending;
  let organisation_id = controls.existingOrg && (controls.existingOrg.id != "new") && controls.existingOrg.id;
  let handle_add = function (values,inputRef){
    let email = values.email.toLowerCase();
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
  let handle_send = async function (){
    setFeedback(null);
    if(!organisation_id){
      setFeedback(
        "Select or create an organisation before sending invitations."
      );
    }
    else{
      try{
        let result = await common.sendOnboardingInvitations(
          api.mutations.organisation_invite_email_create,
          organisation_id,
          controls.invitees
        );
        controls.setInvitees(result.failed.map(function (failure){
          return failure.email;
        }));
        if(result.failed.length > 0){
          setFeedback(
            "Could not send " + result.failed.length + " invitation(s). The failed addresses are ready to retry."
          );
        }
        else{
          controls.setStep(6);
        }
      }
      catch(e){
        console.error("Failed to send invitations",e);
        setFeedback(
          e.message || "Failed to send invitations. Please try again."
        );
      }
    }
  };
  return (
    <ui_section.MinFrameCenter maxWidth={500}>
      {!organisation_id ? (
        <T.YStack alignItems="center" gap="$5" width="100%">
          <ui_section.MinHeader
            title="Invite Team"
            paragraph="Create or select an organisation before inviting team members."/>
          <ui.ButtonInverse
            size="$5"
            fontSize="$5"
            width="100%"
            onPress={function (){
                controls.setStep(6);
              }}>Continue
          </ui.ButtonInverse>
        </T.YStack>) : (!showPreview ? (
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
            {feedback ? (
              <T.Paragraph color="$red10" textAlign="center">{feedback}</T.Paragraph>) : null}
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
            paragraph="Invitation emails use the standard Statstrade message."/>
          <T.YStack gap="$4" width="100%" marginTop="$4">
            <T.Paragraph
              padding="$4"
              borderWidth={1}
              borderColor="$borderColor"
              borderRadius="$4"
              backgroundColor="$background">
              Hey! I'd like to invite you to join my organisation on Statstrade.
            </T.Paragraph>
            <element_invitation.InvitationList invitees={controls.invitees} onRemove={handle_remove}/>
            {feedback ? (
              <T.Paragraph color="$red10" textAlign="center">{feedback}</T.Paragraph>) : null}
            <T.XStack
              gap="$4"
              width="100%"
              flexDirection="row-reverse"
              marginTop="$4">
              <ui.ButtonInverse
                flex={4}
                size="$5"
                fontSize="$5"
                onPress={handle_send}
                disabled={isBusy || _eq(controls.invitees.length,0)}
                icon={isBusy ? (function (){
                    return (
                      <T.Spinner/>);
                  }) : null}
                color="$color12">{isBusy ? ui.t("Sending...") : ui.t("Send Invites")}
              </ui.ButtonInverse>
              <ui.ButtonNormal
                flex={4}
                size="$5"
                fontSize="$5"
                disabled={isBusy}
                onPress={function (){
                    setShowPreview(false);
                  }}
                color="$color11"
                backgroundColor="$color1">{ui.t("Back")}
              </ui.ButtonNormal>
            </T.XStack>
          </T.YStack>
        </React.Fragment>))}
    </ui_section.MinFrameCenter>);
}