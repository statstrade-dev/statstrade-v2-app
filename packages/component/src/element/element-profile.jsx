import {Users} from '@tamagui/lucide-icons'

import * as T from 'tamagui'

import React from 'react'

import * as kd from '@xtalk/lang/common-data.js'

import * as ui_image from '@statstrade/component/ui-image.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

import * as ui_form from '@statstrade/component/ui-form.jsx'

import * as api_common from '@statstrade/edge/remote/api-general.jsx'

import * as ui_select_country from '@statstrade/component/ui-select-country.jsx'

// statsui.basic.element.element-profile/calc-profile-defaults [21] 
export function calc_profile_defaults(profile,user,userMeta){
  let values = {};
  if(profile){
    values = {
      "handle":profile.handle || "",
      "first_name":profile.first_name || "",
      "last_name":profile.last_name || "",
      "bio":profile.bio || "",
      "country":profile.country_code || "",
      "location":{"city":kd.get_in(profile,["location","city"]) || ""}
    };
  }
  else{
    if(userMeta){
      let candidate_handle = userMeta.preferred_username || userMeta.user_name || (userMeta.full_name && userMeta.full_name.replace(/ /,"").toLowerCase()) || (userMeta.first_name && userMeta.first_name.toLowerCase()) || (user && user.email && kd.first(user.email.split("@")));
      values = {
        "first_name":userMeta.first_name || userMeta.full_name || "",
        "last_name":userMeta.last_name || "",
        "handle":candidate_handle || ""
      };
    }
  }
  return values;
}

// statsui.basic.element.element-profile/ProfileForm [43] 
export function ProfileForm({api,form,isBusy,labels,onSkip,onSubmit,profileImage,setProfileImage,user,userType}){
  let [isUploading,setIsUploading] = React.useState(false);
  let handleValue = form.watch("handle");
  let [currentHandle,setCurrentHandle] = React.useState(null);
  ui.useRemoteCheck({
    "form":form,
    "field":"handle",
    "value":handleValue,
    "check_fn":function (v){
        api.queries.check_handle_exists.queryRaw({"handle":v}).then(function (res){
          return res.data;
        });
      },
    "message":"Username is taken",
    "current_value":currentHandle
  });
  React.useEffect(function (){
    let fetchLocation = async function (){
      try{
        let response = await fetch("https://ipapi.co/json/");
        let data = await response.json();
        if(data.country_code){
          form.setValue("country",data.country_code);
        }
        if(data.city){
          form.setValue("location.city",data.city);
        }
      }
      catch(e){
        console.warn("Failed to fetch location",e);
      }
    };
    let init = async function (){
      let currentValues = form.getValues();
      if(!currentValues.country){
        await fetchLocation();
      }
    };
    init();
  },[user]);
  let handle_image_select = async function (image){
    setProfileImage(image);
    if(image){
      setIsUploading(true);
      try{
        let userId = user && user.id;
        if(!userId){
          throw new Error("User not found");
        }
        let filePath = userId + "/" + Date.now() + ".jpg";
        let data = await api_common.upload_image({"image":image,"file_path":filePath,"bucket":"images"});
        setProfileImage({"uri":data});
      }
      catch(e){
        console.error("Auto upload failed",e);
        alert("Failed to upload image");
      }
      finally{
        setIsUploading(false);
      }
    }
  };
  let handle_submit_internal = async function (){
    setIsUploading(true);
    let formValues = form.getValues();
    let finalValues = kd.obj_assign(formValues,{"type":userType});
    try{
      if(profileImage){
        let uri = profileImage && profileImage.uri;
        let isRemote = uri && uri.startsWith("http") && !uri.startsWith("blob:");
        let userId = user && user.id;
        if(isRemote){
          finalValues = kd.obj_assign(finalValues,{"picture":{"uri":uri}});
        }
        if(!userId){
          throw new Error("User not found");
        }
        let filePath = userId + "/" + Date.now() + ".jpg";
        let data = isRemote ? uri : await api_common.upload_image(
          {"image":profileImage,"file_path":filePath,"bucket":"images"}
        );
        finalValues = kd.obj_assign(finalValues,{"picture":{"uri":data}})
      }
      await onSubmit(finalValues);
      setIsUploading(false);
    }
    catch(e){
      console.error(e);
      setIsUploading(false);
    }
  };
  return (
    <T.Form
      onSubmit={form.handleSubmit(handle_submit_internal)}
      width="100%"
      maxWidth={600}>
      <T.YStack marginTop="$3" gap="$6" marginHorizontal="$2">
        <T.YStack alignItems="center" marginBottom="$4">
          <ui_image.ImageUpload
            onImageSelected={handle_image_select}
            image={profileImage}
            color={(userType == "participant") ? "$blue10" : "$color12"}
            icon={Users}/>
        </T.YStack>
        <ui_form.FormInput
          autoFocus={true}
          title={ui.t("Username")}
          field="handle"
          control={form.control}
          placeholder={ui.t("Enter your handle")}
          disabled={isBusy || isUploading}/>
        <T.YStack gap="$4" $sm={{"flexDirection":"row"}}>
          <T.View flex={1}>
            <ui_form.FormInput
              title={ui.t("First name")}
              field="first_name"
              control={form.control}
              placeholder={ui.t("Enter your first name")}
              disabled={isBusy || isUploading}/>
          </T.View>
          <T.View flex={1}>
            <ui_form.FormInput
              title={ui.t("Last name")}
              field="last_name"
              control={form.control}
              placeholder={ui.t("Enter your last name")}
              disabled={isBusy || isUploading}/>
          </T.View>
        </T.YStack>
        <ui_form.FormInput
          title={ui.t("Bio")}
          field="bio"
          control={form.control}
          placeholder={ui.t("Tell us about yourself")}
          component={T.TextArea}
          numberOfLines={4}
          disabled={isBusy || isUploading}/>
        <T.YStack gap="$4" $sm={{"flexDirection":"row"}}>
          <T.View flex={1}>
            <ui_form.FormInput
              title={ui.t("Country")}
              field="country_code"
              hideCheck={true}
              control={form.control}
              renderComponent={function ({onChange,value}){
                  return (
                    <ui_select_country.SelectCountry value={value} onChange={onChange}/>);
                }}
              disabled={isBusy || isUploading}/>
          </T.View>
          <T.View flex={1}>
            <ui_form.FormInput
              title={ui.t("City")}
              field="location.city"
              control={form.control}
              placeholder={ui.t("Enter your city")}
              disabled={isBusy || isUploading}/>
          </T.View>
        </T.YStack>
        <T.XStack flexDirection="row-reverse" gap="$4" marginTop="$6">
          <T.FormTrigger asChild={true} borderWidth={0}>
            {(userType == "creator") ? (
              <ui.ButtonInverse
                flex={4}
                size="$5"
                fontSize="$5"
                color="$color12"
                icon={(isBusy || isUploading) ? (function (){
                    return (
                      <T.Spinner/>);
                  }) : null}
                disabled={isBusy || isUploading || !form.formState.isValid}>
                {(isBusy || isUploading) ? "" : ((labels && labels.submit) || ui.t("Save"))}
              </ui.ButtonInverse>) : (
              <ui.ButtonInverse
                flex={4}
                size="$5"
                fontSize="$5"
                color="$blue10"
                icon={(isBusy || isUploading) ? (function (){
                    return (
                      <T.Spinner/>);
                  }) : null}
                disabled={isBusy || isUploading || !form.formState.isValid}>
                {(isBusy || isUploading) ? "" : ((labels && labels.submit) || ui.t("Save"))}
              </ui.ButtonInverse>)}
          </T.FormTrigger>
          {onSkip ? (
            <ui.ButtonNormal
              flex={4}
              size="$5"
              fontSize="$5"
              onPress={function (e){
                  e.preventDefault();
                  onSkip();
                }}
              color="$color11"
              backgroundColor="$color1">{(labels && labels.skip) || ui.t("Skip")}
            </ui.ButtonNormal>) : null}
        </T.XStack>
      </T.YStack>
    </T.Form>);
}