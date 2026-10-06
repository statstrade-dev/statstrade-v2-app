import React from 'react'

import * as T from 'tamagui'

import * as auth from '@statstrade/edge/remote/util-supabase.jsx'

import * as profile_store from '@statstrade/component/db/profile-store.jsx'

// statstrade-web.feature.profile.profile-editor/profile-values [12] 
export function profile_values(profile){
  let publicProfile = profile.public || {};
  let secretProfile = profile.secret || {};
  return {
    "handle":publicProfile.handle || "",
    "dob":secretProfile.dob || "",
    "bio":publicProfile.bio || "",
    "city":publicProfile.city || "",
    "gender":secretProfile.gender || "",
    "country_code":publicProfile.country_code || "",
    "gender_text":secretProfile.gender_text || "",
    "pronouns":secretProfile.pronouns || "",
    "last_name":publicProfile.last_name || "",
    "first_name":publicProfile.first_name || "",
    "language":secretProfile.language || "EN"
  };
}

// statstrade-web.feature.profile.profile-editor/public-profile-payload [29] 
export function public_profile_payload(values){
  let handle = (values.handle || "").trim().toLowerCase();
  let firstName = (values.first_name || "").trim();
  let lastName = (values.last_name || "").trim();
  let countryCode = (values.country_code || "").trim().toUpperCase();
  let city = (values.city || "").trim();
  let bio = (values.bio || "").trim();
  if(!/^[a-z0-9_]{3,30}$/.test(handle)){
    throw new Error(
      "Use 3–30 letters, numbers, or underscores for your handle."
    );
  }
  if(countryCode.length > 3){
    throw new Error("Country codes must be three characters or fewer.");
  }
  return {
    "handle":handle,
    "first_name":firstName ? firstName : null,
    "last_name":lastName ? lastName : null,
    "country_code":countryCode ? countryCode : null,
    "city":city,
    "bio":bio ? bio : null
  };
}

// statstrade-web.feature.profile.profile-editor/secret-profile-payload [49] 
export function secret_profile_payload(values){
  let gender = (values.gender || "").trim();
  let genderText = (values.gender_text || "").trim();
  let pronouns = (values.pronouns || "").trim();
  let dob = (values.dob || "").trim();
  let language = (values.language || "").trim().toUpperCase();
  if(!language || (language.length > 10)){
    throw new Error("Enter a language code of 10 characters or fewer.");
  }
  if(gender && !((gender == "male") || (gender == "female") || (gender == "other"))){
    throw new Error("Gender must be male, female, or other.");
  }
  return {
    "gender":gender ? gender : null,
    "gender_text":genderText ? genderText : null,
    "pronouns":pronouns ? pronouns : null,
    "dob":dob ? dob : null,
    "language":language
  };
}

// statstrade-web.feature.profile.profile-editor/ProfileField [67] 
export function ProfileField({hint,id,label,maxLength,onChange,type,value}){
  return (
    <T.YStack gap="$2" flex={1} minWidth={180}>
      <T.Label htmlFor={id} fontSize="$3" fontWeight="600">{label}</T.Label>
      <T.Input
        id={id}
        value={value || ""}
        onChangeText={onChange}
        type={type || "text"}
        maxLength={maxLength}
        height={44}
        backgroundColor="$background"
        borderColor="$color6"/>
      {hint ? (
        <T.Text fontSize="$2" color="$color10">{hint}</T.Text>) : null}
    </T.YStack>);
}

// statstrade-web.feature.profile.profile-editor/ProfileEditor [77] 
export function ProfileEditor(){
  let authClient = auth.getClient();
  let [session] = auth.useListenSession(authClient);
  let userId = session && session.user && session.user.id;
  let adapter = React.useMemo(function (){
    return profile_store.create_profile_adapter(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  },[]);
  let [values,setValues] = React.useState({});
  let [loading,setLoading] = React.useState(true);
  let [busy,setBusy] = React.useState(false);
  let [error,setError] = React.useState(null);
  let [message,setMessage] = React.useState(null);
  React.useEffect(function (){
    let cancelled = false;
    if(userId){
      setLoading(true);
      setError(null);
      profile_store.load_owner_profile(adapter,session,userId).then(function (profile){
        if(!cancelled){
          setValues(profile_values(profile));
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
    }
    if(!userId){
      setLoading(false);
    }
    return function (){
      cancelled = true;
    };
  },[userId,session]);
  let updateField = function (key,value){
    setValues(function (previous){
      return Object.assign({},previous,{[[key]]:value});
    });
    setError(null);
    setMessage(null);
  };
  let onSavePublic = async function (event){
    event.preventDefault();
    if(loading || busy || !session){
      return;
    }
    setBusy(true);
    setError(null);
    setMessage(null);
    try{
      let payload = public_profile_payload(values);
      await profile_store.save_public_profile(adapter,session,payload);
      setValues(function (previous){
        return Object.assign({},previous,payload);
      });
      setMessage("Your public profile has been updated.");
    }
    catch(e){
      setError(e.message || "Could not save your public profile.");
    }
    finally{
      setBusy(false);
    }
  };
  let onSaveSecret = async function (event){
    event.preventDefault();
    if(loading || busy || !session){
      return;
    }
    setBusy(true);
    setError(null);
    setMessage(null);
    try{
      let payload = secret_profile_payload(values);
      await profile_store.save_secret_profile(adapter,session,payload);
      setValues(function (previous){
        return Object.assign({},previous,payload);
      });
      setMessage("Your private profile has been updated.");
    }
    catch(e){
      setError(e.message || "Could not save your private profile.");
    }
    finally{
      setBusy(false);
    }
  };
  return (
    <T.YStack gap="$5" width="100%" maxWidth={760} alignSelf="center">
      <T.YStack gap="$2">
        <T.H2 fontSize="$7" fontWeight="700">Edit your profile</T.H2>
        <T.Text fontSize="$3" color="$color10">
          Update public information and private details in separate sections.
        </T.Text>
      </T.YStack>
      {!session ? (
        <T.YStack
          gap="$3"
          padding="$4"
          borderRadius="$3"
          backgroundColor="$color2">
          <T.Text fontSize="$3" color="$color10">Sign in to manage your profile.</T.Text>
          <T.Anchor href="/sign-in" alignSelf="flex-start"><T.Button theme="blue">Sign in</T.Button></T.Anchor>
        </T.YStack>) : null}
      {loading ? (
        <T.Text role="status" color="$color10">Loading your profile…</T.Text>) : null}
      {error ? (
        <T.Text role="alert" color="$red10">{error}</T.Text>) : null}
      {session ? (
        <form onSubmit={onSavePublic}>
          <T.YStack
            gap="$4"
            padding="$5"
            borderWidth={1}
            borderColor="$color5"
            borderRadius="$4">
            <T.H3 fontSize="$5" fontWeight="600">Public profile</T.H3>
            <ProfileField
              id="profile-handle"
              label="Handle"
              value={values.handle}
              maxLength={30}
              hint="3–30 lowercase letters, numbers, or underscores."
              onChange={function (value){
                  updateField("handle",value);
                }}/>
            <T.XStack gap="$4" flexWrap="wrap">
              <ProfileField
                id="profile-first-name"
                label="First name"
                value={values.first_name}
                maxLength={80}
                onChange={function (value){
                    updateField("first_name",value);
                  }}/>
              <ProfileField
                id="profile-last-name"
                label="Last name"
                value={values.last_name}
                maxLength={80}
                onChange={function (value){
                    updateField("last_name",value);
                  }}/>
            </T.XStack>
            <T.XStack gap="$4" flexWrap="wrap">
              <ProfileField
                id="profile-country"
                label="Country code"
                value={values.country_code}
                maxLength={3}
                onChange={function (value){
                    updateField("country_code",value);
                  }}/>
              <ProfileField
                id="profile-city"
                label="City"
                value={values.city}
                maxLength={80}
                onChange={function (value){
                    updateField("city",value);
                  }}/>
            </T.XStack>
            <ProfileField
              id="profile-bio"
              label="Bio"
              value={values.bio}
              maxLength={2000}
              onChange={function (value){
                  updateField("bio",value);
                }}/>
            <T.Button type="submit" disabled={loading || busy}>Save public profile</T.Button>
          </T.YStack>
        </form>) : null}
      {session ? (
        <form onSubmit={onSaveSecret}>
          <T.YStack
            gap="$4"
            padding="$5"
            borderWidth={1}
            borderColor="$color5"
            borderRadius="$4">
            <T.H3 fontSize="$5" fontWeight="600">Private profile</T.H3>
            <T.XStack gap="$4" flexWrap="wrap">
              <ProfileField
                id="profile-gender"
                label="Gender"
                value={values.gender}
                hint="Optional: male, female, or other."
                onChange={function (value){
                    updateField("gender",value);
                  }}/>
              <ProfileField
                id="profile-gender-text"
                label="Additional gender detail"
                value={values.gender_text}
                maxLength={60}
                onChange={function (value){
                    updateField("gender_text",value);
                  }}/>
              <ProfileField
                id="profile-pronouns"
                label="Pronouns"
                value={values.pronouns}
                maxLength={80}
                onChange={function (value){
                    updateField("pronouns",value);
                  }}/>
            </T.XStack>
            <T.XStack gap="$4" flexWrap="wrap">
              <ProfileField
                id="profile-dob"
                label="Date of birth"
                type="date"
                value={values.dob}
                onChange={function (value){
                    updateField("dob",value);
                  }}/>
              <ProfileField
                id="profile-language"
                label="Language code"
                value={values.language}
                maxLength={10}
                hint="Required, for example EN or FR."
                onChange={function (value){
                    updateField("language",value);
                  }}/>
            </T.XStack>
            <T.Button type="submit" disabled={loading || busy}>Save private profile</T.Button>
          </T.YStack>
        </form>) : null}
      {message ? (
        <T.Text role="status" color="$green10">{message}</T.Text>) : null}
    </T.YStack>);
}