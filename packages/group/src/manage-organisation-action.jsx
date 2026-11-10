import * as hf from '@statstrade/edge/lib/js/lib/react-hook-form.jsx'

import * as rq from '@statstrade/edge/lib/js/lib/react-query.jsx'

import * as api_public from '@statstrade/edge/remote/api-public.jsx'

import * as qm_organisation from '@statstrade/edge/remote/query-manage-organisation.jsx'

import * as page_api from '@statstrade/edge/substrate/page-api.jsx'

// statsui.group.manage-organisation-action/organisationApi [25] 
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
      "refresh":["organisations_list","user_list_member_organisations"]
    },
    "organisation_update":{
      "fn":api_public.organisation_update,
      "refresh":["organisations_list","user_list_member_organisations"]
    },
    "organisation_invite_email_create":{"fn":api_public.organisation_invite_email_create}
  }
};

// statsui.group.manage-organisation-action/schemaOrganisationName [47] 
export var schemaOrganisationName = hf.Z.string().min(1,hf.t("ID is required.")).min(3,hf.t("ID must be at least 3 characters.")).regex(/^[a-z0-9_]+$/,hf.t(
  "ID can only contain lowercase letters, numbers, and underscores."
));

// statsui.group.manage-organisation-action/schemaOrganisationCreate [54] 
export var schemaOrganisationCreate = hf.Z.object({
  "title":hf.Z.string().min(1,hf.t("Title is required.")),
  "name":schemaOrganisationName,
  "description":hf.Z.string().optional()
});

// statsui.group.manage-organisation-action/schemaOrganisationUpdate [61] 
export var schemaOrganisationUpdate = hf.Z.object({
  "title":hf.Z.string().min(1,hf.t("Title is required.")),
  "description":hf.Z.string().optional()
});

// statsui.group.manage-organisation-action/formStateOrganisation [68] 
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

// statsui.group.manage-organisation-action/useManageOrganisationContext [79] 
export function useManageOrganisationContext({userId}){
  let api = page_api.usePageApi("shell",organisationApi);
  let forms = {
    "organisation_create":hf.useFormState(formStateOrganisation["organisation_create"]),
    "organisation_update":hf.useFormState(formStateOrganisation["organisation_update"])
  };
  return {api,forms};
}

// statsui.group.manage-organisation-action/organisationAccessApi [95] 
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

// statsui.group.manage-organisation-action/schemaOrganisationAddMember [109] 
export var schemaOrganisationAddMember = hf.Z.object({
  "handle":hf.Z.string().min(1,hf.t("Handle is required.")).pipe(hf.Z.refine(function (handle){
    return api_public.check_handle_exists({handle});
  },hf.t("User handle not found."))),
  "level":hf.Z.string().min(1,hf.t("Level is required.")),
  "scope":hf.Z.string().optional()
});

// statsui.group.manage-organisation-action/formStateOrganisationAccess [124] 
export var formStateOrganisationAccess = {
  "organisation_member_add":{
    "defaultValues":{"handle":"","level":"member","scope":""},
    "schema":schemaOrganisationAddMember
  }
};

// statsui.group.manage-organisation-action/useManageOrganisationAccessContext [131] 
export function useManageOrganisationAccessContext(){
  let api = rq.useApi(organisationAccessApi);
  let forms = formStateOrganisationAccess;
  return {api,forms};
}

// statsui.group.manage-organisation-action/organisationTokenApi [144] 
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

// statsui.group.manage-organisation-action/schemaTokenCreate [170] 
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

// statsui.group.manage-organisation-action/schemaTokenUpdate [185] 
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

// statsui.group.manage-organisation-action/formStateOrganisationToken [200] 
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

// statsui.group.manage-organisation-action/useManageOrganisationTokenContext [229] 
export function useManageOrganisationTokenContext({name}){
  let api = rq.useApi(
    organisationTokenApi,
    {"list_organisation_tokens":{"name":name}}
  );
  let forms = hf.useFormStateMap(formStateOrganisationToken);
  return {api,forms};
}

// statsui.group.manage-organisation-action/organisationCommodityApi [243] 
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

// statsui.group.manage-organisation-action/schemaCommodityCreate [256] 
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

// statsui.group.manage-organisation-action/schemaCommodityUpdate [268] 
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

// statsui.group.manage-organisation-action/formStateOrganisationCommodity [280] 
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

// statsui.group.manage-organisation-action/useManageOrganisationCommodityContext [303] 
export function useManageOrganisationCommodityContext({name}){
  let api = rq.useApi(
    organisationCommodityApi,
    {"list_organisation_commodities":{"name":name}}
  );
  let forms = hf.useFormStateMap(formStateOrganisationCommodity);
  return {api,forms};
}

// statsui.group.manage-organisation-action/managerBillingApi [317] 
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

// statsui.group.manage-organisation-action/schemaBilling [327] 
export var schemaBilling = hf.Z.object({
  "card_name":hf.Z.string().min(1,hf.t("Cardholder Name is required")),
  "card_number":hf.Z.string().min(16,hf.t("Invalid Card Number")),
  "expiry":hf.Z.string().min(1,hf.t("Expiry is required")),
  "cvc":hf.Z.string().min(3,hf.t("CVC is required"))
});

// statsui.group.manage-organisation-action/formStateBilling [335] 
export var formStateBilling = {
  "billing_new":{
    "defaultValues":{"card_name":"","card_number":"","expiry":"","cvc":""},
    "schema":schemaBilling
  }
};

// statsui.group.manage-organisation-action/useManageBillingContext [340] 
export function useManageBillingContext(){
  let api = page_api.usePageApi("billing",managerBillingApi);
  let forms = hf.useFormStateMap(formStateBilling);
  return {api,forms};
}

// statsui.group.manage-organisation-action/manageInviteApi [352] 
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

// statsui.group.manage-organisation-action/schemaInviteCreate [364] 
export var schemaInviteCreate = hf.Z.object({
  "channel":hf.Z.string().min(1,"Channel is required"),
  "campaign":hf.Z.string().optional(),
  "emails":hf.Z.string().optional()
});

// statsui.group.manage-organisation-action/formStateInvite [371] 
export var formStateInvite = {
  "invite_create":{
    "defaultValues":{"channel":"generic","campaign":"","emails":""},
    "schema":schemaInviteCreate
  }
};

// statsui.group.manage-organisation-action/useManageInviteContext [376] 
export function useManageInviteContext(){
  let api = page_api.usePageApi("invites",manageInviteApi);
  let forms = hf.useFormStateMap(formStateInvite);
  return {api,forms};
}

// statsui.group.manage-organisation-action/managerSettingsApi [388] 
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

// statsui.group.manage-organisation-action/settingsSchema [398] 
export var settingsSchema = hf.Z.object({
  "orgName":hf.Z.string().min(1,"Name is required"),
  "email":hf.Z.string().min(1,"Email is required"),
  "website":hf.Z.string().optional()
});

// statsui.group.manage-organisation-action/formStateSettings [405] 
export var formStateSettings = {
  "settings_profile":{
    "defaultValues":{"orgName":"","email":"","website":""},
    "schema":settingsSchema
  }
};

// statsui.group.manage-organisation-action/useSettingsContext [410] 
export function useSettingsContext(){
  let api = page_api.usePageApi("settings",managerSettingsApi);
  let forms = hf.useFormStateMap(formStateSettings);
  return {api,forms};
}