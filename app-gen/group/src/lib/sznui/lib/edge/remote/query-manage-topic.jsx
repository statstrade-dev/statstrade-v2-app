import * as sb from '@statstrade/group/lib/sznui/lib/edge/remote/util-supabase'

// statsui.edge.remote.query-manage-topic/topics-list-by-campaign [8] 
export function topics_list_by_campaign({campaignId}){
  return sb.getClient().from("Topic").select("*").eq("campaign_id",campaignId);
}

// statsui.edge.remote.query-manage-topic/get-topic-detail [16] 
export function get_topic_detail({topicId}){
  return sb.getClient().from("Topic").select(
    "*, campaign:Campaign(*, owner:Organisation(*)), prospects:Prospect(*)"
  ).eq("id",topicId).single();
}