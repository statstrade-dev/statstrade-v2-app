import React from 'react'

import * as kd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as group_user from '@statstrade/group/common-user-action.jsx'

import * as element_profile from '@statstrade/component/element/element-profile.jsx'

// statstrade-web.feature.dashboard.dashboard-profile/DashboardProfile [18] 
export function DashboardProfile(){
  let userCtx = group_user.useUserActionContext();
  let {api,forms} = userCtx;
  React.useEffect(function (){
    let data = api.queries.user_get_profile.data && api.queries.user_get_profile.data.data;
    let profile = data && (data.length > 0) && data[0];
    let userMeta = !profile && user && user.user_metadata;
    let defaults = element_profile.calc_profile_defaults(profile,user,userMeta);
    if(kd.not_emptyp(defaults)){
      forms.user_profile.reset(defaults,{"keepDefaultValues":true});
    }
  },[api.queries.user_get_profile.data,user]);
  function onSubmit(data){
    return api.mutations.user_set_public.mutateAsync(data);
  }
  return (
    <element_profile.ProfileForm
      form={forms.user_profile}
      user={api.queries.user_get_profile.data}
      profileImage={null}
      setProfileImage={function (){
          
        }}
      api={api}
      isBusy={api.mutations.user_set_public.isPending || api.queries.user_get_profile.isPending}
      onSubmit={onSubmit}
      labels={{
          "submit":"Update Profile",
          "title":"Edit Profile",
          "paragraph":"Update your personal details."
        }}/>);
}