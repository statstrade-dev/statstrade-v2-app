import * as hf from '@statstrade/edge/lib/js/lib/react-hook-form'

import * as rq from '@statstrade/edge/lib/js/lib/react-query'

import * as api_route from '@statstrade/edge/remote/api-internal'

import * as api_general from '@statstrade/edge/remote/api-general'

import * as api_public from '@statstrade/edge/remote/api-public'

// sznui.lib.edge.remote.group.common-user-action/userApi [18] 
export var userApi = {
  "queries":{
    "get_user":{"fn":api_general.get_user},
    "get_session":{"fn":api_general.get_session},
    "user_get_profile":{"fn":api_public.user_get_profile},
    "check_handle_exists":{"fn":api_public.check_handle_exists},
    "user_list_member_organisations":{
      "fn":api_public.user_list_member_organisations,
      "enabled":true
    }
  },
  "mutations":{
    "user_set_public":{"fn":api_public.user_set_public,"refresh":["get_user"]},
    "stripe_checkout":{"fn":api_route.stripe_checkout},
    "stripe_status":{
      "fn":api_route.stripe_status,
      "refresh":["user_list_owner_organisations"]
    },
    "upload_image":{"fn":api_general.upload_and_get_public_url}
  }
};

// sznui.lib.edge.remote.group.common-user-action/schemaUserProfile [51] 
export var schemaUserProfile = hf.Z.object({
  "handle":hf.Z.string().min(3,hf.t("Handle must be at least 3 characters.")).pipe(hf.Z.refine(function (handle){
    return api_public.check_handle_exists({handle});
  },hf.t("Handle already exists."))),
  "first_name":hf.Z.string().min(1,hf.t("First name is required.")),
  "last_name":hf.Z.string().optional(),
  "bio":hf.Z.string().optional(),
  "country":hf.Z.string().optional(),
  "location":hf.Z.object({"city":hf.Z.string().optional()})
});

// sznui.lib.edge.remote.group.common-user-action/formStateUser [69] 
export var formStateUser = {
  "user_profile":{
    "defaultValues":{
      "handle":"",
      "first_name":"",
      "last_name":"",
      "bio":"",
      "country":"",
      "location":{"city":""}
    },
    "schema":schemaUserProfile
  }
};

// sznui.lib.edge.remote.group.common-user-action/useUserActionContext [79] 
export function useUserActionContext(){
  let api = rq.useApi(userApi);
  let forms = hf.useFormStateMap(formStateUser);
  return {api,forms};
}