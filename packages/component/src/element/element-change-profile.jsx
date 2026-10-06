import * as T from 'tamagui'

import React from 'react'

import * as sb from '@statstrade/edge/remote/util-supabase.jsx'

// statsui.basic.element.element-change-profile/profileValues [9] 
export function profileValues(user,profile){
  let metadata = profile ? {} : (user.user_metadata || {});
  profile = (profile || {});
  return {
    "first_name":profile.first_name || metadata.first_name || "",
    "last_name":profile.last_name || metadata.last_name || "",
    "handle":profile.handle || metadata.handle || "",
    "avatar":(profile.picture && profile.picture.uri) || metadata.avatar_url || ""
  };
}

// statsui.basic.element.element-change-profile/validateProfile [18] 
export function validateProfile(values){
  let first_name = values.first_name.trim();
  let last_name = values.last_name.trim();
  let handle = values.handle.trim().toLowerCase();
  let avatar = values.avatar.trim();
  if(!first_name || (first_name.length > 100) || (last_name.length > 100)){
    throw new Error(
      "Enter your first name. Names must be 100 characters or fewer."
    );
  }
  if(!/^[a-z0-9_]{3,32}$/.test(handle)){
    throw new Error(
      "Use 3–32 letters, numbers, or underscores for your handle."
    );
  }
  if(avatar){
    let url = new URL(avatar);
    if((url.protocol != "https:") && (url.protocol != "http:")){
      throw new Error("Use an HTTP or HTTPS image URL for your avatar.");
    }
  }
  return {avatar,first_name,handle,last_name};
}

// statsui.basic.element.element-change-profile/loadProfile [34] 
export async function loadProfile(client,user){
  let response = await client.schema("stats_type").from("User").select("id,handle,first_name,last_name,picture").eq("id",user.id).maybeSingle();
  if(response.error){
    throw response.error;
  }
  return profileValues(user,response.data);
}

// statsui.basic.element.element-change-profile/saveProfile [43] 
export async function saveProfile(client,original,input){
  let values = validateProfile(input);
  let handleChanged = values.handle != original.handle;
  if(handleChanged){
    let availability = await sb.callRemote(
      "check_handle_exists",
      {"handle":values.handle},
      {"sbClient":client}
    );
    if(availability.error){
      throw availability.error;
    }
    if(availability.data){
      throw new Error("That handle is already taken. Try another one.");
    }
  }
  let response = await sb.callRemote("user_set_public",{
    "m":{
        "first_name":values.first_name,
        "last_name":values.last_name,
        "picture":values.avatar ? {"uri":values.avatar} : {}
      }
  },{"sbClient":client});
  if(response.error){
    throw response.error;
  }
  if(handleChanged){
    let handleResponse = await sb.callRemote(
      "user_set_handle",
      {"handle":values.handle},
      {"sbClient":client}
    );
    if(handleResponse.error){
      throw new Error(
        "Your name and avatar were saved, but the handle could not be changed: " + (handleResponse.error.message || "Please try again.")
      );
    }
  }
  return values;
}

// statsui.basic.element.element-change-profile/changeEmail [65] 
export async function changeEmail(client,email){
  let response = await client.auth.updateUser({"email":email.trim()});
  if(response.error){
    throw response.error;
  }
  return response.data.user;
}

// statsui.basic.element.element-change-profile/ProfileField [71] 
export function ProfileField({autoComplete,disabled,hint,id,label,maxLength,onChange,type,value}){
  return (
    <T.YStack gap="$2" flex={1} minWidth={180}>
      <T.Label htmlFor={id} fontSize="$3" fontWeight="600">{label}</T.Label>
      <T.Input
        onChangeText={onChange}
        disabled={disabled}
        borderColor="$color6"
        autoComplete={autoComplete}
        value={value}
        type={type || "text"}
        id={id}
        maxLength={maxLength}
        backgroundColor="$background"
        height={44}/>
      {hint ? (
        <T.Text fontSize="$2" color="$color10">{hint}</T.Text>) : null}
    </T.YStack>);
}

// statsui.basic.element.element-change-profile/Notice [81] 
export function Notice({error,message}){
  return (error || message) ? (
    <T.Text
      role={error ? "alert" : "status"}
      ariaLive="polite"
      fontSize="$3"
      color={error ? "$red10" : "$green10"}
      padding="$3"
      borderRadius="$2"
      backgroundColor="$color2">{error || message}
    </T.Text>) : null;
}

// statsui.basic.element.element-change-profile/ProfileEditor [91] 
export function ProfileEditor(){
  let client = sb.getClient();
  let [session] = sb.useListenSession(client);
  let user = session && session.user;
  let [original,setOriginal] = React.useState(null);
  let [values,setValues] = React.useState({"first_name":"","last_name":"","handle":"","avatar":""});
  let [loading,setLoading] = React.useState(true);
  let [busy,setBusy] = React.useState(false);
  let [error,setError] = React.useState(null);
  let [message,setMessage] = React.useState(null);
  let [avatarFailed,setAvatarFailed] = React.useState(false);
  let [email,setEmail] = React.useState("");
  let [emailBusy,setEmailBusy] = React.useState(false);
  let [emailError,setEmailError] = React.useState(null);
  let [emailMessage,setEmailMessage] = React.useState(null);
  let [reload,setReload] = React.useState(0);
  let userId = user && user.id;
  React.useEffect(function (){
    if(userId){
      let cancelled = false;
      setLoading(true);
      setOriginal(null);
      setError(null);
      loadProfile(client,user).then(function (profile){
        if(!cancelled){
          setOriginal(profile);
          setValues(profile);
        }
      }).catch(function (e){
        if(!cancelled){
          setError(e.message || "Could not load your profile.");
        }
      }).finally(function (){
        if(!cancelled){
          setLoading(false);
        }
      });
      return function (){
        cancelled = true;
      };
    }
  },[userId,reload]);
  React.useEffect(function (){
    setEmail((user && user.email) || "");
  },[user && user.email]);
  React.useEffect(function (){
    setAvatarFailed(false);
  },[values.avatar]);
  let updateField = function (key,value){
    setValues(function (previous){
      return Object.assign({},previous,{[[key]]:value});
    });
    setMessage(null);
  };
  let dirty = original && (JSON.stringify(values) != JSON.stringify(original));
  let locked = loading || busy || emailBusy;
  let onSave = async function (event){
    event.preventDefault();
    if(locked || !original){
      return;
    }
    setBusy(true);
    setError(null);
    setMessage(null);
    try{
      let saved = await saveProfile(client,original,values);
      setOriginal(saved);
      setValues(saved);
      setMessage("Your profile has been updated.");
    }
    catch(e){
      setError(e.message || "Could not save your profile.");
    }
    finally{
      setBusy(false);
    }
  };
  let onEmail = async function (event){
    event.preventDefault();
    if(locked){
      return;
    }
    setEmailBusy(true);
    setEmailError(null);
    setEmailMessage(null);
    try{
      let updated = await changeEmail(client,email);
      setEmailMessage(
        (updated.email == email.trim()) ? "Your email address has been updated." : "Check your inbox to confirm your new email address."
      );
    }
    catch(e){
      setEmailError(e.message || "Could not change your email address.");
    }
    finally{
      setEmailBusy(false);
    }
  };
  let avatarSrc = /^https?:///.test(values.avatar) ? values.avatar : "";
  return (
    <T.YStack gap="$5" width="100%" maxWidth={760}>
      <form onSubmit={onSave}>
        <T.YStack
          gap="$5"
          padding="$5"
          borderWidth={1}
          borderColor="$color5"
          borderRadius="$4"
          backgroundColor="$background">
          <T.YStack gap="$1">
            <T.H3 fontSize="$5" fontWeight="600">Personal information</T.H3>
            <T.Text fontSize="$3" color="$color10">Choose how you appear across Statstrade.</T.Text>
          </T.YStack>
          <T.XStack gap="$4" alignItems="center">
            <T.View
              width={80}
              height={80}
              borderRadius={40}
              backgroundColor="$color3"
              alignItems="center"
              justifyContent="center"
              overflow="hidden">
              {(avatarSrc && !avatarFailed) ? (
                <img
                  src={avatarSrc}
                  alt="Avatar preview"
                  width={80}
                  height={80}
                  style={{"objectFit":"cover"}}
                  onError={function (){
                      setAvatarFailed(true);
                    }}/>) : (
                <T.Text fontSize="$7" fontWeight="600" color="$color10">
                  {(values.first_name || values.handle || "S").slice(0,1).toUpperCase()}
                </T.Text>)}
            </T.View>
            <T.YStack gap="$1">
              <T.Text fontWeight="600">Profile photo</T.Text>
              <T.Text fontSize="$2" color="$color10">Use an image URL, or keep your initials.</T.Text>
              {values.avatar ? (
                <T.Button
                  type="button"
                  size="$2"
                  chromeless={true}
                  alignSelf="flex-start"
                  disabled={locked}
                  onPress={function (){
                      updateField("avatar","");
                    }}>Remove photo
                </T.Button>) : null}
            </T.YStack>
          </T.XStack>
          <ProfileField
            id="profile-avatar"
            label="Avatar image URL"
            type="url"
            value={values.avatar}
            disabled={locked}
            autoComplete="off"
            onChange={function (value){
                updateField("avatar",value);
              }}
            hint="Paste a public HTTP or HTTPS image URL."/>
          <T.XStack gap="$4" flexWrap="wrap">
            <ProfileField
              id="profile-first-name"
              label="First name"
              value={values.first_name}
              disabled={locked}
              maxLength={100}
              autoComplete="given-name"
              onChange={function (value){
                  updateField("first_name",value);
                }}/>
            <ProfileField
              id="profile-last-name"
              label="Last name"
              value={values.last_name}
              disabled={locked}
              maxLength={100}
              autoComplete="family-name"
              onChange={function (value){
                  updateField("last_name",value);
                }}/>
          </T.XStack>
          <ProfileField
            id="profile-handle"
            label="Handle"
            value={values.handle}
            disabled={locked}
            maxLength={32}
            autoComplete="username"
            onChange={function (value){
                updateField("handle",value);
              }}
            hint="3–32 letters, numbers, or underscores. Your handle is public."/>
          <Notice message={message} error={error}/>
          {loading ? (
            <T.Text role="status" color="$color10">Loading your profile…</T.Text>) : null}
          {(!loading && !original) ? (
            <T.Button
              type="button"
              onPress={function (){
                  setReload(reload + 1);
                }}>Try again
            </T.Button>) : null}
          <T.XStack
            gap="$3"
            justifyContent="flex-end"
            paddingTop="$3"
            borderTopWidth={1}
            borderTopColor="$color4">
            <T.Button
              type="button"
              chromeless={true}
              disabled={locked || !dirty}
              onPress={function (){
                  setValues(original);
                  setError(null);
                  setMessage(null);
                }}>Cancel
            </T.Button>
            <T.Button type="submit" disabled={locked || !dirty} theme="active">{busy ? "Saving…" : "Save changes"}</T.Button>
          </T.XStack>
        </T.YStack>
      </form>
      <form onSubmit={onEmail}>
        <T.YStack
          gap="$4"
          padding="$5"
          borderWidth={1}
          borderColor="$color5"
          borderRadius="$4"
          backgroundColor="$background">
          <T.YStack gap="$1">
            <T.H3 fontSize="$5" fontWeight="600">Email address</T.H3>
            <T.Text fontSize="$3" color="$color10">This is the email you use to sign in.</T.Text>
          </T.YStack>
          <ProfileField
            id="profile-email"
            label="Email"
            type="email"
            value={email}
            disabled={locked}
            autoComplete="email"
            onChange={function (value){
                setEmail(value);
                setEmailError(null);
                setEmailMessage(null);
              }}/>
          <T.Text fontSize="$2" color="$color10">
            You may need to confirm the change by email before your new address takes effect.
          </T.Text>
          <Notice error={emailError} message={emailMessage}/>
          <T.Button
            type="submit"
            alignSelf="flex-end"
            disabled={locked || !email.trim() || (email.trim() == (user && user.email))}>{emailBusy ? "Updating…" : "Update email"}
          </T.Button>
        </T.YStack>
      </form>
    </T.YStack>);
}