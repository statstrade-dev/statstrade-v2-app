import * as sb from '@statstrade/edge/remote/util-supabase.jsx'

// statsui.edge.remote.query-manage-topic/topics-list-by-campaign [8] 
export function topics_list_by_campaign({campaignId}){
  return sb.queryTable("Topic",{
    "select":"*",
    "filters":[{"column":"campaign_id","value":campaignId}]
  });
}

// statsui.edge.remote.query-manage-topic/get-topic-detail [15] 
export function get_topic_detail({topicId}){
  return sb.queryTable("Topic",{
    "select":"*, campaign:Campaign(*, owner:Organisation(*)), prospects:Prospect(*)",
    "filters":[{"column":"id","value":topicId}],
    "single":true
  });
}