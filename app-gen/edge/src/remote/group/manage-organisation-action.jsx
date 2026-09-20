import * as hf from '@statstrade/edge/lib/js/lib/react-hook-form'

import * as rq from '@statstrade/edge/lib/js/lib/react-query'

import * as api_public from '@statstrade/edge/remote/api-public'

import * as qm_organisation from '@statstrade/edge/remote/query-manage-organisation'

// sznui.lib.edge.remote.group.manage-organisation-action/organisationApi [20] 
export var organisationApi = {
  "queries":{
    "organisations_list":{
      "fn":api_public.user_list_member_organisations,
      "enabled":true,
      "default":[]
    },
    "check_organisation_exists":{"fn":api_public.check_organisation_exists}
  },
  "mutations":{
    "organisation_create":{
      "fn":api_public.organisation_create,
      "refresh":["organisations_list"]
    },
    "organisation_update":{
      "fn":api_public.organisation_update,
      "refresh":["organisations_list"]
    }
  }
};

// sznui.lib.edge.remote.group.manage-organisation-action/schemaOrganisationName [39] 
export var schemaOrganisationName = hf.Z.string().min(1,hf.t("ID is required.")).min(3,hf.t("ID must be at least 3 characters.")).regex(/^[a-z0-9_]+$/,hf.t(
  "ID can only contain lowercase letters, numbers, and underscores."
));

// sznui.lib.edge.remote.group.manage-organisation-action/schemaOrganisationCreate [46] 
export var schemaOrganisationCreate = hf.Z.object({
  "title":hf.Z.string().min(1,hf.t("Title is required.")),
  "name":schemaOrganisationName.pipe(hf.Z.refine(function (name){
    return api_public.check_organisation_exists({name});
  },hf.t("Organisation ID already exists."))),
  "description":hf.Z.string().optional()
});

// sznui.lib.edge.remote.group.manage-organisation-action/schemaOrganisationUpdate [59] 
export var schemaOrganisationUpdate = hf.Z.object({
  "title":hf.Z.string().min(1,hf.t("Title is required.")),
  "description":hf.Z.string().optional()
});

// sznui.lib.edge.remote.group.manage-organisation-action/formStateOrganisation [66] 
export var formStateOrganisation = {
  "organisation_create":{
    "defaultValues":{"name":"","title":"","description":""},
    "schema":schemaOrganisationCreate
  },
  "organisation_update":{
    "defaultValues":{"title":"","description":""},
    "schema":schemaOrganisationUpdate
  }
};

// sznui.lib.edge.remote.group.manage-organisation-action/useManageOrganisationContext [77] 
export function useManageOrganisationContext({userId}){
  let api = rq.useApi(organisationApi);
  let forms = hf.useFormStateMap(formStateOrganisation);
  return {api,forms};
}

// sznui.lib.edge.remote.group.manage-organisation-action/organisationAccessApi [92] 
export var organisationAccessApi = {
  "queries":{
    "organisation_member_list":{
      "fn":qm_organisation.organisation_member_list,
      "enabled":true,
      "default":[]
    }
  },
  "mutations":{
    "organisation_member_add":{
      "fn":api_public.organisation_member_add,
      "refresh":["organisation_member_list"]
    },
    "organisation_member_remove":{
      "fn":api_public.organisation_member_remove,
      "refresh":["organisation_member_list"]
    }
  }
};

// sznui.lib.edge.remote.group.manage-organisation-action/schemaOrganisationAddMember [106] 
export var schemaOrganisationAddMember = hf.Z.object({
  "handle":hf.Z.string().min(1,hf.t("Handle is required.")).pipe(hf.Z.refine(function (handle){
    return api_public.check_handle_exists({handle});
  },hf.t("User handle not found."))),
  "level":hf.Z.string().min(1,hf.t("Level is required.")),
  "scope":hf.Z.string().optional()
});

// sznui.lib.edge.remote.group.manage-organisation-action/formStateOrganisationAccess [121] 
export var formStateOrganisationAccess = {
  "organisation_member_add":{
    "defaultValues":{"handle":"","level":"member","scope":""},
    "schema":schemaOrganisationAddMember
  }
};

// sznui.lib.edge.remote.group.manage-organisation-action/useManageOrganisationAccessContext [128] 
export function useManageOrganisationAccessContext(){
  let api = rq.useApi(organisationAccessApi);
  let forms = formStateOrganisationAccess;
  return {api,forms};
}

// sznui.lib.edge.remote.group.manage-organisation-action/organisationTokenApi [141] 
export var organisationTokenApi = {
  "queries":{
    "organisation_token_list":{
      "fn":qm_organisation.organisation_token_list,
      "enabled":true,
      "default":[]
    },
    "get_token_stats":{
      "fn":function (){
        return {
          "highlighted":{
              "distributedLabel":"45%",
              "distributed":"450,000",
              "name":"Greenways",
              "holdersLabel":"+12%",
              "ticker":"GNW",
              "avgBalanceLabel":"GNW",
              "holders":"1,234",
              "avgBalance":"365",
              "totalSupply":"1,000,000"
            },
          "economics":{
              "earned":[
                  {"label":"Staking Rewards","value":"125,000"},
                  {"label":"Activity Rewards","value":"50,000"}
                ],
              "spent":[
                  {"label":"Market Creation","value":"45,000"},
                  {"label":"Fees","value":"5,000"}
                ],
              "engagement":[
                  {"label":"Active Stakers","value":"850"},
                  {"label":"New Wallets","value":"+45"}
                ]
            }
        };
      },
      "enabled":true,
      "default":{
        "highlighted":{
          "distributedLabel":"45%",
          "distributed":"450,000",
          "name":"Greenways",
          "holdersLabel":"+12%",
          "ticker":"GNW",
          "avgBalanceLabel":"GNW",
          "holders":"1,234",
          "avgBalance":"365",
          "totalSupply":"1,000,000"
        },
        "economics":{
          "earned":[
            {"label":"Staking Rewards","value":"125,000"},
            {"label":"Activity Rewards","value":"50,000"}
          ],
          "spent":[
            {"label":"Market Creation","value":"45,000"},
            {"label":"Fees","value":"5,000"}
          ],
          "engagement":[
            {"label":"Active Stakers","value":"850"},
            {"label":"New Wallets","value":"+45"}
          ]
        }
      }
    }
  },
  "mutations":{
    "organisation_token_create":{
      "fn":api_public.organisation_token_create,
      "refresh":["organisation-token-list"]
    },
    "organisation_token_update":{
      "fn":api_public.organisation_token_update,
      "refresh":["organisation-token-list"]
    }
  }
};

// sznui.lib.edge.remote.group.manage-organisation-action/schemaTokenCreate [167] 
export var schemaTokenCreate = hf.Z.object({
  "color":hf.Z.string().optional(),
  "symbol":hf.Z.string().optional(),
  "name":hf.Z.string().min(1,hf.t("Name is required.")),
  "type":hf.Z.string().min(1,hf.t("Type is required.")),
  "icon":hf.Z.any().optional(),
  "title":hf.Z.string().optional(),
  "native":hf.Z.string().optional(),
  "decimal":hf.Z.number().optional(),
  "picture":hf.Z.any().optional(),
  "code":hf.Z.string().min(1,hf.t("Code is required.")),
  "detail":hf.Z.any().optional()
});

// sznui.lib.edge.remote.group.manage-organisation-action/schemaTokenUpdate [182] 
export var schemaTokenUpdate = hf.Z.object({
  "color":hf.Z.string().optional(),
  "symbol":hf.Z.string().optional(),
  "name":hf.Z.string().optional(),
  "type":hf.Z.string().optional(),
  "icon":hf.Z.any().optional(),
  "title":hf.Z.string().optional(),
  "native":hf.Z.string().optional(),
  "decimal":hf.Z.number().optional(),
  "picture":hf.Z.any().optional(),
  "code":hf.Z.string().optional(),
  "detail":hf.Z.any().optional()
});

// sznui.lib.edge.remote.group.manage-organisation-action/formStateOrganisationToken [197] 
export var formStateOrganisationToken = {
  "organisation_token_create":{
    "defaultValues":{
      "color":"#000000",
      "symbol":"",
      "name":"",
      "type":"brand",
      "icon":{},
      "title":"",
      "native":"",
      "decimal":2,
      "picture":{},
      "code":"",
      "detail":{}
    },
    "schema":schemaTokenCreate
  },
  "organisation_token_update":{
    "defaultValues":{
      "color":"#000000",
      "symbol":"",
      "name":"",
      "type":"brand",
      "icon":{},
      "title":"",
      "native":"",
      "decimal":2,
      "picture":{},
      "code":"",
      "detail":{}
    },
    "schema":schemaTokenUpdate
  }
};

// sznui.lib.edge.remote.group.manage-organisation-action/useManageOrganisationTokenContext [226] 
export function useManageOrganisationTokenContext({name}){
  let api = rq.useApi(
    organisationTokenApi,
    {"list_organisation_tokens":{"name":name}}
  );
  let forms = hf.useFormStateMap(formStateOrganisationToken);
  return {api,forms};
}

// sznui.lib.edge.remote.group.manage-organisation-action/organisationCommodityApi [240] 
export var organisationCommodityApi = {
  "queries":{
    "list_organisation_commodities":{
      "fn":qm_organisation.organisation_commodity_list,
      "enabled":true,
      "default":[]
    }
  },
  "mutations":{
    "organisation_commodity_create":{
      "fn":api_public.organisation_commodity_create,
      "refresh":["organisation-commodity-list"]
    },
    "organisation_commodity_update":{
      "fn":api_public.organisation_commodity_update,
      "refresh":["organisation-commodity-list"]
    }
  }
};

// sznui.lib.edge.remote.group.manage-organisation-action/schemaCommodityCreate [253] 
export var schemaCommodityCreate = hf.Z.object({
  "name":hf.Z.string().min(1,hf.t("Name is required.")),
  "code":hf.Z.string().min(1,hf.t("Code is required.")),
  "type":hf.Z.string().min(1,hf.t("Type is required.")),
  "color":hf.Z.string().optional(),
  "title":hf.Z.string().optional(),
  "icon":hf.Z.any().optional(),
  "picture":hf.Z.any().optional(),
  "detail":hf.Z.any().optional()
});

// sznui.lib.edge.remote.group.manage-organisation-action/schemaCommodityUpdate [265] 
export var schemaCommodityUpdate = hf.Z.object({
  "name":hf.Z.string().optional(),
  "code":hf.Z.string().optional(),
  "type":hf.Z.string().optional(),
  "color":hf.Z.string().optional(),
  "title":hf.Z.string().optional(),
  "icon":hf.Z.any().optional(),
  "picture":hf.Z.any().optional(),
  "detail":hf.Z.any().optional()
});

// sznui.lib.edge.remote.group.manage-organisation-action/formStateOrganisationCommodity [277] 
export var formStateOrganisationCommodity = {
  "organisation_commodity_create":{
    "defaultValues":{
      "name":"",
      "code":"",
      "type":"digital",
      "color":"#000000",
      "title":"",
      "icon":{},
      "picture":{},
      "detail":{}
    },
    "schema":schemaCommodityCreate
  },
  "organisation_commodity_update":{
    "defaultValues":{
      "name":"",
      "code":"",
      "type":"digital",
      "color":"#000000",
      "title":"",
      "icon":{},
      "picture":{},
      "detail":{}
    },
    "schema":schemaCommodityUpdate
  }
};

// sznui.lib.edge.remote.group.manage-organisation-action/useManageOrganisationCommodityContext [300] 
export function useManageOrganisationCommodityContext({name}){
  let api = rq.useApi(
    organisationCommodityApi,
    {"list_organisation_commodities":{"name":name}}
  );
  let forms = hf.useFormStateMap(formStateOrganisationCommodity);
  return {api,forms};
}

// sznui.lib.edge.remote.group.manage-organisation-action/managerBillingApi [314] 
export var managerBillingApi = {
  "queries":{
    "list_invoices":{
      "fn":function (){
        return [
          {"id":1,"description":"Pro Plan","date":"Oct 1","amount":"$29"}
        ];
      },
      "enabled":true
    }
  },
  "mutations":{
    "add_payment_method":{
      "fn":function (data){
        console.log("Simulate Add Payment Method",data);
        return {"success":true};
      }
    }
  }
};

// sznui.lib.edge.remote.group.manage-organisation-action/schemaBilling [324] 
export var schemaBilling = hf.Z.object({
  "card_name":hf.Z.string().min(1,hf.t("Cardholder Name is required")),
  "card_number":hf.Z.string().min(16,hf.t("Invalid Card Number")),
  "expiry":hf.Z.string().min(1,hf.t("Expiry is required")),
  "cvc":hf.Z.string().min(3,hf.t("CVC is required"))
});

// sznui.lib.edge.remote.group.manage-organisation-action/formStateBilling [332] 
export var formStateBilling = {
  "billing_new":{
    "defaultValues":{"card_name":"","card_number":"","expiry":"","cvc":""},
    "schema":schemaBilling
  }
};

// sznui.lib.edge.remote.group.manage-organisation-action/useManageBillingContext [337] 
export function useManageBillingContext(){
  let api = rq.useApi(managerBillingApi);
  let forms = hf.useFormStateMap(formStateBilling);
  return {api,forms};
}

// sznui.lib.edge.remote.group.manage-organisation-action/manageInviteApi [349] 
export var manageInviteApi = {
  "queries":{
    "organisation_invite_list":{
      "fn":qm_organisation.organisation_invite_list,
      "enabled":true,
      "default":[]
    }
  },
  "mutations":{
    "organisation_invite_email_create":{
      "fn":api_public.organisation_invite_email_create,
      "refresh":["organisation-invite-list"]
    }
  }
};

// sznui.lib.edge.remote.group.manage-organisation-action/schemaInviteCreate [361] 
export var schemaInviteCreate = hf.Z.object({
  "channel":hf.Z.string().min(1,"Channel is required"),
  "campaign":hf.Z.string().optional(),
  "emails":hf.Z.string().optional()
});

// sznui.lib.edge.remote.group.manage-organisation-action/formStateInvite [368] 
export var formStateInvite = {
  "invite_create":{
    "defaultValues":{"channel":"generic","campaign":"","emails":""},
    "schema":schemaInviteCreate
  }
};

// sznui.lib.edge.remote.group.manage-organisation-action/useManageInviteContext [373] 
export function useManageInviteContext(){
  let api = rq.useApi(manageInviteApi);
  let forms = hf.useFormStateMap(formStateInvite);
  return {api,forms};
}

// sznui.lib.edge.remote.group.manage-organisation-action/managerSettingsApi [385] 
export var managerSettingsApi = {
  "queries":{
    "get_settings":{
      "fn":function (){
        return {
          "orgName":"Acme Corp",
          "email":"contact@acme.com",
          "website":"https://acme.com"
        };
      },
      "enabled":true
    }
  },
  "mutations":{
    "update_settings":{
      "fn":function (data){
        console.log("Simulate Update Settings",data);
        return {"success":true};
      }
    }
  }
};

// sznui.lib.edge.remote.group.manage-organisation-action/settingsSchema [395] 
export var settingsSchema = hf.Z.object({
  "orgName":hf.Z.string().min(1,"Name is required"),
  "email":hf.Z.string().min(1,"Email is required"),
  "website":hf.Z.string().optional()
});

// sznui.lib.edge.remote.group.manage-organisation-action/formStateSettings [402] 
export var formStateSettings = {
  "settings_profile":{
    "defaultValues":{"orgName":"","email":"","website":""},
    "schema":settingsSchema
  }
};

// sznui.lib.edge.remote.group.manage-organisation-action/useSettingsContext [407] 
export function useSettingsContext(){
  let api = rq.useApi(managerSettingsApi);
  let forms = hf.useFormStateMap(formStateSettings);
  return {api,forms};
}