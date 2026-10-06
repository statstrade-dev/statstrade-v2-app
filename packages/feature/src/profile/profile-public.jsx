import React from 'react'

import * as T from 'tamagui'

import * as ui_router from '@statstrade/component/ui-router.jsx'

import * as profile_store from '@statstrade/component/db/profile-store.jsx'

// statstrade-web.feature.profile.profile-public/profile-handle-from-path [12] 
export function profile_handle_from_path(pathname){
  let parts = (pathname || "").split("/");
  let handle = parts[2] || "";
  if(!(parts[1] == "u") || !handle){
    return null;
  }
  try{
    return decodeURIComponent(handle);
  }
  catch(e){
    return handle;
  }
}

// statstrade-web.feature.profile.profile-public/profile-display-name [23] 
export function profile_display_name(profile){
  let firstName = (profile.first_name || "").trim();
  let lastName = (profile.last_name || "").trim();
  let hasFirst = !(firstName == "");
  let hasLast = !(lastName == "");
  let name = (hasFirst && hasLast && (firstName + " " + lastName)) || (hasFirst && firstName) || (hasLast && lastName);
  return name || (profile.handle && ("@" + profile.handle)) || "";
}

// statstrade-web.feature.profile.profile-public/profile-location [35] 
export function profile_location(profile){
  let city = (profile.city || "").trim();
  let country = (profile.country_code || "").trim();
  if(city && country){
    return city + ", " + country;
  }
  else if(city){
    return city;
  }
  else if(country){
    return country;
  }
  else{
    return "";
  }
}

// statstrade-web.feature.profile.profile-public/PublicProfile [45] 
export function PublicProfile(){
  let pathname = ui_router.usePathname();
  let handle = profile_handle_from_path(pathname);
  let adapter = React.useMemo(function (){
    return profile_store.create_profile_adapter(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  },[]);
  let [profile,setProfile] = React.useState(null);
  let [loading,setLoading] = React.useState(true);
  let [error,setError] = React.useState(null);
  React.useEffect(function (){
    let cancelled = false;
    if(handle){
      setLoading(true);
      setProfile(null);
      setError(null);
      profile_store.fetch_public_profile(adapter,handle).then(function (row){
        if(!cancelled){
          setProfile(row);
        }
      }).catch(function (e){
        if(!cancelled){
          setError(e.message || "Could not load this profile.");
        }
      }).finally(function (){
        if(!cancelled){
          setLoading(false);
        }
      });
    }
    if(!handle){
      setLoading(false);
    }
    return function (){
      cancelled = true;
    };
  },[handle,adapter]);
  return (
    <T.YStack
      gap="$4"
      width="100%"
      maxWidth={760}
      alignSelf="center"
      padding="$5">
      {loading ? (
        <T.Text role="status" color="$color10">Loading profile…</T.Text>) : (error ? (
        <T.Text role="alert" color="$red10">{error}</T.Text>) : (!profile ? (
        <T.Text role="status" color="$color10">Profile not found.</T.Text>) : (
        <T.YStack
          gap="$3"
          padding="$5"
          borderWidth={1}
          borderColor="$color5"
          borderRadius="$4">
          <T.H1 fontSize="$8" fontWeight="700">{profile_display_name(profile)}</T.H1>
          <T.Text fontSize="$3" color="$color10">{"@" + profile.handle}</T.Text>
          {profile_location(profile) ? (
            <T.Text fontSize="$3" color="$color10">{profile_location(profile)}</T.Text>) : null}
          {profile.bio ? (
            <T.Paragraph fontSize="$4" lineHeight="$6">{profile.bio}</T.Paragraph>) : null}
        </T.YStack>)))}
    </T.YStack>);
}