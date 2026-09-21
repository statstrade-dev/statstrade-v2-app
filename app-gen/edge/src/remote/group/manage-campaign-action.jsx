import * as hf from '@statstrade/edge/lib/js/lib/react-hook-form'

import * as rq from '@statstrade/edge/lib/js/lib/react-query'

import * as qm_campaign from '@statstrade/edge/remote/query-manage-campaign'

import * as api_public from '@statstrade/edge/remote/api-public'

// statsui.edge.remote.group.manage-campaign-action/campaignApi [18] 
export var campaignApi = {
  "queries":{
    "list_campaigns":{"fn":qm_campaign.list_campaigns,"enabled":true,"default":[]},
    "get_stats":{
      "fn":function (){
        return {
          "totalCampaigns":0,
          "activeCampaigns":0,
          "totalParticipants":0,
          "totalBudget":0
        };
      },
      "enabled":true,
      "default":{
        "totalCampaigns":0,
        "activeCampaigns":0,
        "totalParticipants":0,
        "totalBudget":0
      }
    }
  },
  "mutations":{
    "campaign_create":{"fn":api_public.campaign_create,"refresh":["list_campaigns"]},
    "campaign_update":{"fn":api_public.campaign_update,"refresh":["list_campaigns"]},
    "campaign_archive":{
      "fn":api_public.campaign_archive,
      "refresh":["list_campaigns"]
    },
    "campaign_unarchive":{
      "fn":api_public.campaign_unarchive,
      "refresh":["list_campaigns"]
    }
  }
};

// statsui.edge.remote.group.manage-campaign-action/schemaCampaignCreate [55] 
export var schemaCampaignCreate = hf.Z.object({
  "description":hf.Z.string().min(1,hf.t("Description is required")),
  "tags":hf.Z.any().optional(),
  "name":hf.Z.string().optional(),
  "endX":hf.Z.string().min(1,hf.t("End Date is required")),
  "cover":hf.Z.string().optional(),
  "icon":hf.Z.string().optional(),
  "title":hf.Z.string().min(1,hf.t("Title is required.")),
  "objectives":hf.Z.any().optional(),
  "code":hf.Z.string().optional(),
  "startX":hf.Z.string().min(1,hf.t("Start Date is required")),
  "budget":hf.Z.string().min(1,hf.t("Budget is required")),
  "banner":hf.Z.string().optional(),
  "organisation_id":hf.Z.string().min(1,hf.t("Organisation ID is required.")),
  "detail":hf.Z.any().optional()
});

// statsui.edge.remote.group.manage-campaign-action/schemaCampaignUpdate [73] 
export var schemaCampaignUpdate = hf.Z.object({
  "campaign_id":hf.Z.string().min(1,hf.t("Campaign ID is required.")),
  "title":hf.Z.string().optional(),
  "description":hf.Z.string().optional()
});

// statsui.edge.remote.group.manage-campaign-action/formStateCampaign [81] 
export var formStateCampaign = {
  "campaign_create":{
    "defaultValues":{
      "description":"",
      "name":"",
      "endX":"",
      "cover":"",
      "icon":"",
      "title":"",
      "code":"",
      "startX":"",
      "budget":"",
      "banner":"",
      "organisation_id":""
    },
    "schema":schemaCampaignCreate
  },
  "campaign_update":{
    "defaultValues":{"campaign_id":"","title":""},
    "schema":schemaCampaignUpdate
  }
};

// statsui.edge.remote.group.manage-campaign-action/useManageCampaignContext [100] 
export function useManageCampaignContext(){
  let api = rq.useApi(campaignApi);
  let forms = hf.useFormStateMap(formStateCampaign);
  return {api,forms};
}

// statsui.edge.remote.group.manage-campaign-action/campaignAccessApi [113] 
export var campaignAccessApi = {
  "queries":{
    "list_campaign_members":{
      "fn":qm_campaign.list_campaign_members,
      "enabled":true,
      "default":[]
    }
  },
  "mutations":{
    "campaign_participant_accept_request":{
      "fn":api_public.campaign_participant_accept_request,
      "refresh":["list_campaign_members"]
    },
    "campaign_participant_remove":{
      "fn":api_public.campaign_participant_remove,
      "refresh":["list_campaign_members"]
    }
  }
};

// statsui.edge.remote.group.manage-campaign-action/schemaCampaignRemoveParticipant [129] 
export var schemaCampaignRemoveParticipant = hf.Z.object({
  "participant_id":hf.Z.string().min(1,hf.t("Participant ID is required."))
});

// statsui.edge.remote.group.manage-campaign-action/formStateCampaignAccess [134] 
export var formStateCampaignAccess = {
  "campaign_participant_remove":{
    "defaultValues":{"participant_id":""},
    "schema":schemaCampaignRemoveParticipant
  }
};

// statsui.edge.remote.group.manage-campaign-action/useManageCampaignAccessContext [139] 
export function useManageCampaignAccessContext(){
  let api = rq.useApi(campaignAccessApi);
  let forms = hf.useFormStateMap(formStateCampaignAccess);
  return {api,forms};
}