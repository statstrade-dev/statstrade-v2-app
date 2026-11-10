import * as hf from '@statstrade/edge/lib/js/lib/react-hook-form.jsx'

import * as api_public from '@statstrade/edge/remote/api-public.jsx'

import * as qm_topic from '@statstrade/edge/remote/query-manage-topic.jsx'

import * as page_api from '@statstrade/edge/substrate/page-api.jsx'

// statsui.group.manage-topic-action/topicApi [23] 
export var topicApi = {
  "queries":{
    "topics_list":{
      "fn":qm_topic.topics_list_by_campaign,
      "enabled":true,
      "default":[]
    },
    "prospect_market_list":{
      "fn":function ({orgId}){
        return {"data":[]};
      },
      "enabled":true,
      "default":{"data":[]}
    },
    "get_market_stats":{
      "fn":function (){
        return {
          "activeMarkets":0,
          "totalVolume":"0",
          "totalParticipants":"0",
          "avgStake":0
        };
      },
      "enabled":true,
      "default":{
        "activeMarkets":0,
        "totalVolume":"0",
        "totalParticipants":"0",
        "avgStake":0
      }
    }
  },
  "mutations":{
    "topic_apikey_create":{
      "fn":api_public.topic_apikey_create,
      "refresh":["topics_list"]
    },
    "topic_create":{"fn":api_public.topic_create,"refresh":["topics_list"]},
    "topic_set_trading":{"fn":api_public.topic_set_trading,"refresh":["topics_list"]},
    "topic_set_draft":{"fn":api_public.topic_set_draft,"refresh":["topics_list"]},
    "topic_resolve":{"fn":api_public.topic_resolve,"refresh":["topics_list"]},
    "topic_deploy":{"fn":api_public.topic_deploy,"refresh":["topics_list"]},
    "topic_set_vesting":{"fn":api_public.topic_set_vesting,"refresh":["topics_list"]},
    "topic_set_close":{"fn":api_public.topic_set_close,"refresh":["topics_list"]},
    "topic_apikey_revoke":{
      "fn":api_public.topic_apikey_revoke,
      "refresh":["topics_list"]
    },
    "topic_set_open":{"fn":api_public.topic_set_open,"refresh":["topics_list"]}
  }
};

// statsui.group.manage-topic-action/schemaTopicCreate [91] 
export var schemaTopicCreate = hf.Z.object({
  "title":hf.Z.string().min(1,hf.t("Title is required.")),
  "description":hf.Z.string().optional(),
  "campaign_id":hf.Z.string().min(1,hf.t("Campaign ID is required.")),
  "detail":hf.Z.any().optional()
});

// statsui.group.manage-topic-action/schemaTopicUpdateDraft [99] 
export var schemaTopicUpdateDraft = hf.Z.object({
  "title":hf.Z.string().min(1,hf.t("Title is required.")),
  "description":hf.Z.string().optional(),
  "detail":hf.Z.any().optional()
});

// statsui.group.manage-topic-action/schemaTopicRevokeApikey [106] 
export var schemaTopicRevokeApikey = hf.Z.object({
  "key_lookup":hf.Z.string().min(1,hf.t("Key lookup is required."))
});

// statsui.group.manage-topic-action/formStateTopic [111] 
export var formStateTopic = {
  "topic_create":{
    "defaultValues":{"title":"","description":"","campaign_id":"","detail":{}},
    "schema":schemaTopicCreate
  },
  "topic_set_draft":{
    "defaultValues":{"title":"","description":"","detail":{}},
    "schema":schemaTopicUpdateDraft
  },
  "topic_apikey_revoke":{
    "defaultValues":{"key_lookup":""},
    "schema":schemaTopicRevokeApikey
  }
};

// statsui.group.manage-topic-action/useManageTopicContext [129] 
export function useManageTopicContext(){
  let api = page_api.usePageApi("markets",topicApi);
  let forms = hf.useFormStateMap(formStateTopic);
  return {api,forms};
}