import React from 'react'

import * as hf from '@statstrade/edge/lib/js/lib/react-hook-form.jsx'

import * as action_topic from '@statstrade/group/manage-topic-action.jsx'

import * as global_store from '@statstrade/edge/global-store.jsx'

// statstrade-web.feature.manage.topics.topics-common/TopicsContext [15] 
export var TopicsContext = React.createContext();

// statstrade-web.feature.manage.topics.topics-common/useTopicsContext [18] 
export function useTopicsContext(){
  let [campaign] = global_store.useStore(["context","campaign"]);
  let campaignId = campaign && campaign.id;
  let controls = hf.useControls(
    [["view","list"],["selectedId",null],["campaignId",campaignId]]
  );
  let topicCtx = action_topic.useManageTopicContext({campaignId});
  return hf.mergeContexts({"controls":controls},topicCtx);
}