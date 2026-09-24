import * as api_general from '@statstrade/edge/remote/api-general'

import * as api_public from '@statstrade/edge/remote/api-public'

// statsui.edge.remote.group.manage-dashboard-action/managerDashboardApi [9] 
export var managerDashboardApi = {
  "queries":{
    "get_stats":{
      "fn":function (){
        return {"users":1234,"campaigns":3,"tasks":12,"config":"OK"};
      },
      "enabled":true
    },
    "user_list_owner_organisations":{
      "fn":api_public.user_list_member_organisations,
      "enabled":true
    },
    "check_organisation_exists":{"fn":api_public.check_organisation_exists}
  },
  "mutations":{
    "organisation_new":{
      "fn":api_public.organisation_create,
      "refresh":["user_list_owner_organisations"]
    },
    "upload_image":{"fn":api_general.upload_and_get_public_url}
  }
};