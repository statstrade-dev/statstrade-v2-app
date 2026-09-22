import {Coins} from '@tamagui/lucide-icons'

import * as T from 'tamagui'

import React from 'react'

import * as kd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as ui_image from '@statstrade/component/ui-image.jsx'

import * as common from '@statstrade/feature/onboarding/onboarding-common.jsx'

import * as ui_section from '@statstrade/component/ui-section.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

import * as ui_form from '@statstrade/component/ui-form.jsx'

// statstrade-web.feature.onboarding.onboarding-step-5-token/OnboardingStep5TokenScreen [22] 
export function OnboardingStep5TokenScreen(){
  let context = common.useIndexOnboardingContext();
  let {api,controls,forms,user} = context;
  let [orgId,setOrgId] = React.useState();
  let [isBusy,setIsBusy] = React.useState(false);
  let [selectedImage,setSelectedImage] = React.useState(null);
  let orgsQuery = api.queries.user_list_member_organisations;
  React.useEffect(function (){
    orgsQuery.setInput({});
  },[]);
  React.useEffect(function (){
    let {data,error} = orgsQuery;
    if(error){
      console.error("Failed to fetch orgs",error);
    }
    else{
      let orgs = data;
      if(orgs && (orgs.length > 0)){
        setOrgId(orgs[0].id);
      }
    }
  },[orgsQuery.data,orgsQuery.error]);
  let handleSubmit = async function (data){
    setIsBusy(true);
    if(!orgId){
      console.error("No organisation found");
      setIsBusy(false);
      return;
    }
    let finalValues = data;
    try{
      if(selectedImage){
        let response = await fetch(selectedImage.uri);
        let blob = await response.blob();
        let userId = user && user.id;
        let filePath = userId + "/tokens/" + Date.now() + ".jpg";
        let {data,error} = await api.mutations.upload_image.mutateAsync({"file_raw":blob,"file_path":filePath,"bucket":"images"});
        if(error){
          console.error("Upload failed",error);
        }
        else{
          finalValues = kd.obj_assign({},finalValues,{"picture":data});
        }
      }
      let res = await api.mutations.organisation_token_create(
        kd.obj_assign({"org_id":orgId,"code":finalValues.symbol},finalValues)
      );
      if(res.error){
        console.error("Error creating token",res.error);
        controls.setCurrentError(res.error);
      }
      else{
        let supply = parseInt(finalValues.initial_supply);
        if(supply && (supply > 0)){
          let tokenData = res.data;
          await api.mutations.organisation_mint_to_self({
            "org_id":orgId,
            "amount":supply,
            "token_code":tokenData.code,
            "playable_id":tokenData.id
          });
        }
        controls.setStep(6);
      }
    }
    catch(e){
      console.log(e);
    }
    finally{
      setIsBusy(false);
    }
  };
  return (
    <ui_section.MinFrameCenter>
      <ui_section.MinHeader
        title="Create a Token"
        paragraph="This is the token for your organisation"/>
      <T.Form onSubmit={forms.token_creation.handleSubmit(handleSubmit)}>
        <T.YStack gap="$4" width="100%">
          <T.YStack alignItems="center" marginBottom="$2">
            <ui_image.ImageUpload onImageSelected={setSelectedImage} icon={Coins}/>
          </T.YStack>
          <ui_form.FormInput
            field="title"
            control={forms.token_creation.control}
            title="Token Name"
            disabled={isBusy}
            placeholder="e.g. My Community Token"/>
          <ui_form.FormInput
            field="symbol"
            control={forms.token_creation.control}
            title="Token Symbol"
            placeholder="e.g. MCT"
            disabled={isBusy}
            autoCapitalize="characters"/>
          <ui_form.FormInput
            field="description"
            control={forms.token_creation.control}
            title="Description"
            placeholder="Briefly describe your token utility"
            multiline={true}
            disabled={isBusy}
            numberOfLines={3}/>
          <ui_form.FormInput
            field="initial_supply"
            control={forms.token_creation.control}
            title="Initial Supply"
            placeholder="e.g. 1000000"
            type="number"
            disabled={isBusy}/>
          <T.YStack height="$4"/>
          <T.XStack justifyContent="flex-end" gap="$4">
            <T.FormTrigger asChild={true} borderWidth={0}>
              <ui.ButtonInverse
                icon={isBusy ? (function (){
                    return (
                      <T.Spinner/>);
                  }) : null}
                disabled={isBusy}>Create Token
              </ui.ButtonInverse>
            </T.FormTrigger>
          </T.XStack>
        </T.YStack>
      </T.Form>
    </ui_section.MinFrameCenter>);
}