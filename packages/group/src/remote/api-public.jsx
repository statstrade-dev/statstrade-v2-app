import * as sb from '@statstrade/edge/remote/util-supabase.jsx'

// statsui.edge.remote.api-public/check-email-exists [8] 
export function check_email_exists({email},options = {}){
  return sb.callRemote("check_email_exists",{"email":email},options);
}

// statsui.edge.remote.api-public/check-handle-exists [15] 
export function check_handle_exists({handle},options = {}){
  return sb.callRemote("check_handle_exists",{"handle":handle},options);
}

// statsui.edge.remote.api-public/check-is-super [22] 
export function check_is_super(_,options = {}){
  return sb.callRemote("check_is_super",{},options);
}

// statsui.edge.remote.api-public/check-organisation-exists [29] 
export function check_organisation_exists({name},options = {}){
  return sb.callRemote("check_organisation_exists",{"name":name},options);
}

// statsui.edge.remote.api-public/get-email-by-handle [36] 
export function get_email_by_handle({handle},options = {}){
  return sb.callRemote("get_email_by_handle",{"handle":handle},options);
}

// statsui.edge.remote.api-public/get-organisation-id [43] 
export function get_organisation_id({name},options = {}){
  return sb.callRemote("get_organisation_id",{"name":name},options);
}

// statsui.edge.remote.api-public/get-site-globals [50] 
export function get_site_globals(_,options = {}){
  return sb.callRemote("get_site_globals",{},options);
}

// statsui.edge.remote.api-public/user-follow [57] 
export function user_follow({following_id},options = {}){
  return sb.callRemote("user_follow",{"following_id":following_id},options);
}

// statsui.edge.remote.api-public/user-get-profile [64] 
export function user_get_profile(_,options = {}){
  return sb.callRemote("user_get_profile",{},options);
}

// statsui.edge.remote.api-public/user-list-member-campaigns [71] 
export function user_list_member_campaigns(_,options = {}){
  return sb.callRemote("user_list_member_campaigns",{},options);
}

// statsui.edge.remote.api-public/user-list-member-organisations [78] 
export function user_list_member_organisations(_,options = {}){
  return sb.callRemote("user_list_member_organisations",{},options);
}

// statsui.edge.remote.api-public/user-list-starred-campaigns [85] 
export function user_list_starred_campaigns(_,options = {}){
  return sb.callRemote("user_list_starred_campaigns",{},options);
}

// statsui.edge.remote.api-public/user-list-starred-organisations [92] 
export function user_list_starred_organisations(_,options = {}){
  return sb.callRemote("user_list_starred_organisations",{},options);
}

// statsui.edge.remote.api-public/user-list-starred-topics [99] 
export function user_list_starred_topics(_,options = {}){
  return sb.callRemote("user_list_starred_topics",{},options);
}

// statsui.edge.remote.api-public/user-set-handle [106] 
export function user_set_handle({handle},options = {}){
  return sb.callRemote("user_set_handle",{"handle":handle},options);
}

// statsui.edge.remote.api-public/user-set-public [113] 
export function user_set_public({
  type,
  color,
  is_active,
  is_onboarded,
  first_name,
  last_name,
  country_code,
  location,
  bio,
  picture,
  detail
},options = {}){
  return sb.callRemote("user_set_public",{
    "m":{
        type,
        color,
        is_active,
        is_onboarded,
        first_name,
        last_name,
        country_code,
        location,
        bio,
        picture,
        detail
      }
  },options);
}

// statsui.edge.remote.api-public/user-set-secret [120] 
export function user_set_secret({gender,gender_text,pronouns,dob,language},options = {}){
  return sb.callRemote(
    "user_set_secret",
    {"m":{gender,gender_text,pronouns,dob,language}},
    options
  );
}

// statsui.edge.remote.api-public/user-star-campaign [127] 
export function user_star_campaign({campaign_id},options = {}){
  return sb.callRemote("user_star_campaign",{"campaign_id":campaign_id},options);
}

// statsui.edge.remote.api-public/user-star-organisation [134] 
export function user_star_organisation({organisation_id},options = {}){
  return sb.callRemote(
    "user_star_organisation",
    {"organisation_id":organisation_id},
    options
  );
}

// statsui.edge.remote.api-public/user-star-topic [141] 
export function user_star_topic({topic_id},options = {}){
  return sb.callRemote("user_star_topic",{"topic_id":topic_id},options);
}

// statsui.edge.remote.api-public/user-topic-burn-stake [148] 
export function user_topic_burn_stake({topic_id,name,amount},options = {}){
  return sb.callRemote(
    "user_topic_burn_stake",
    {"amount":amount,"name":name,"topic_id":topic_id},
    options
  );
}

// statsui.edge.remote.api-public/user-topic-buy-limit [155] 
export function user_topic_buy_limit({topic_id,name,amount,price},options = {}){
  return sb.callRemote(
    "user_topic_buy_limit",
    {"amount":amount,"name":name,"price":price,"topic_id":topic_id},
    options
  );
}

// statsui.edge.remote.api-public/user-topic-cancel-limit [162] 
export function user_topic_cancel_limit({order_id},options = {}){
  return sb.callRemote("user_topic_cancel_limit",{"order_id":order_id},options);
}

// statsui.edge.remote.api-public/user-topic-mint-stake [169] 
export function user_topic_mint_stake({topic_id,name,amount},options = {}){
  return sb.callRemote(
    "user_topic_mint_stake",
    {"amount":amount,"name":name,"topic_id":topic_id},
    options
  );
}

// statsui.edge.remote.api-public/user-topic-sell-limit [176] 
export function user_topic_sell_limit({topic_id,name,amount,price},options = {}){
  return sb.callRemote(
    "user_topic_sell_limit",
    {"amount":amount,"name":name,"price":price,"topic_id":topic_id},
    options
  );
}

// statsui.edge.remote.api-public/user-unfollow [183] 
export function user_unfollow({following_id},options = {}){
  return sb.callRemote("user_unfollow",{"following_id":following_id},options);
}

// statsui.edge.remote.api-public/user-unstar-campaign [190] 
export function user_unstar_campaign({campaign_id},options = {}){
  return sb.callRemote("user_unstar_campaign",{"campaign_id":campaign_id},options);
}

// statsui.edge.remote.api-public/user-unstar-organisation [197] 
export function user_unstar_organisation({organisation_id},options = {}){
  return sb.callRemote(
    "user_unstar_organisation",
    {"organisation_id":organisation_id},
    options
  );
}

// statsui.edge.remote.api-public/user-unstar-topic [204] 
export function user_unstar_topic({topic_id},options = {}){
  return sb.callRemote("user_unstar_topic",{"topic_id":topic_id},options);
}

// statsui.edge.remote.api-public/campaign-archive [211] 
export function campaign_archive({campaign_id},options = {}){
  return sb.callRemote("campaign_archive",{"campaign_id":campaign_id},options);
}

// statsui.edge.remote.api-public/campaign-chat-channel-create [218] 
export function campaign_chat_channel_create({campaign_id,name},options = {}){
  return sb.callRemote(
    "campaign_chat_channel_create",
    {"campaign_id":campaign_id,"m":{},"name":name},
    options
  );
}

// statsui.edge.remote.api-public/campaign-chat-channel-update [225] 
export function campaign_chat_channel_update({campaign_id,name},options = {}){
  return sb.callRemote(
    "campaign_chat_channel_update",
    {"campaign_id":campaign_id,"m":{},"name":name},
    options
  );
}

// statsui.edge.remote.api-public/campaign-create [232] 
export function campaign_create({
  organisation_id,
  code,
  icon,
  picture,
  title,
  description,
  detail,
  tags,
  time_start,
  time_end,
  status,
  domain_custom,
  domain_status
},options = {}){
  return sb.callRemote("campaign_create",{
    "m":{
        code,
        icon,
        picture,
        title,
        description,
        detail,
        tags,
        time_start,
        time_end,
        status,
        domain_custom,
        domain_status
      },
    "organisation_id":organisation_id
  },options);
}

// statsui.edge.remote.api-public/campaign-feed-apikey-create [239] 
export function campaign_feed_apikey_create({campaign_id,feed_name},options = {}){
  return sb.callRemote(
    "campaign_feed_apikey_create",
    {"campaign_id":campaign_id,"feed_name":feed_name},
    options
  );
}

// statsui.edge.remote.api-public/campaign-feed-apikey-list [246] 
export function campaign_feed_apikey_list({campaign_id,feed_name},options = {}){
  return sb.callRemote(
    "campaign_feed_apikey_list",
    {"campaign_id":campaign_id,"feed_name":feed_name},
    options
  );
}

// statsui.edge.remote.api-public/campaign-feed-apikey-revoke [253] 
export function campaign_feed_apikey_revoke({campaign_id,feed_name,key_lookup},options = {}){
  return sb.callRemote("campaign_feed_apikey_revoke",{
    "campaign_id":campaign_id,
    "feed_name":feed_name,
    "key_lookup":key_lookup
  },options);
}

// statsui.edge.remote.api-public/campaign-feed-create [260] 
export function campaign_feed_create({
  campaign_id,
  name,
  aggregate,
  template_process,
  template_aggregate,
  template_display,
  detail
},options = {}){
  return sb.callRemote("campaign_feed_create",{
    "campaign_id":campaign_id,
    "m":{
        name,
        aggregate,
        template_process,
        template_aggregate,
        template_display,
        detail
      },
    "name":name
  },options);
}

// statsui.edge.remote.api-public/campaign-feed-item-create [267] 
export function campaign_feed_item_create({campaign_id,name},options = {}){
  return sb.callRemote(
    "campaign_feed_item_create",
    {"campaign_id":campaign_id,"m":{},"name":name},
    options
  );
}

// statsui.edge.remote.api-public/campaign-feed-item-delete [274] 
export function campaign_feed_item_delete({campaign_id,item_id},options = {}){
  return sb.callRemote(
    "campaign_feed_item_delete",
    {"campaign_id":campaign_id,"item_id":item_id},
    options
  );
}

// statsui.edge.remote.api-public/campaign-feed-update [281] 
export function campaign_feed_update({
  campaign_id,
  name,
  aggregate,
  template_process,
  template_aggregate,
  template_display,
  detail
},options = {}){
  return sb.callRemote("campaign_feed_update",{
    "campaign_id":campaign_id,
    "m":{
        name,
        aggregate,
        template_process,
        template_aggregate,
        template_display,
        detail
      },
    "name":name
  },options);
}

// statsui.edge.remote.api-public/campaign-participant-accept-request [288] 
export function campaign_participant_accept_request({campaign_id,from_id,log_entry},options = {}){
  return sb.callRemote("campaign_participant_accept_request",{
    "campaign_id":campaign_id,
    "from_id":from_id,
    "log_entry":log_entry
  },options);
}

// statsui.edge.remote.api-public/campaign-participant-reject-request [295] 
export function campaign_participant_reject_request({campaign_id,from_id,log_entry},options = {}){
  return sb.callRemote("campaign_participant_reject_request",{
    "campaign_id":campaign_id,
    "from_id":from_id,
    "log_entry":log_entry
  },options);
}

// statsui.edge.remote.api-public/campaign-participant-remove [302] 
export function campaign_participant_remove({campaign_id,participant_id},options = {}){
  return sb.callRemote(
    "campaign_participant_remove",
    {"campaign_id":campaign_id,"participant_id":participant_id},
    options
  );
}

// statsui.edge.remote.api-public/campaign-task-add-bounty-item [309] 
export function campaign_task_add_bounty_item({campaign_id,task_id},options = {}){
  return sb.callRemote(
    "campaign_task_add_bounty_item",
    {"campaign_id":campaign_id,"m":{},"task_id":task_id},
    options
  );
}

// statsui.edge.remote.api-public/campaign-task-create [316] 
export function campaign_task_create({campaign_id},options = {}){
  return sb.callRemote(
    "campaign_task_create",
    {"campaign_id":campaign_id,"m":{}},
    options
  );
}

// statsui.edge.remote.api-public/campaign-task-remove-bounty-item [323] 
export function campaign_task_remove_bounty_item({campaign_id,task_id,item_id},options = {}){
  return sb.callRemote(
    "campaign_task_remove_bounty_item",
    {"campaign_id":campaign_id,"item_id":item_id,"task_id":task_id},
    options
  );
}

// statsui.edge.remote.api-public/campaign-task-set-active [330] 
export function campaign_task_set_active({campaign_id,task_id},options = {}){
  return sb.callRemote(
    "campaign_task_set_active",
    {"campaign_id":campaign_id,"task_id":task_id},
    options
  );
}

// statsui.edge.remote.api-public/campaign-task-set-completed [337] 
export function campaign_task_set_completed({campaign_id,task_id},options = {}){
  return sb.callRemote(
    "campaign_task_set_completed",
    {"campaign_id":campaign_id,"task_id":task_id},
    options
  );
}

// statsui.edge.remote.api-public/campaign-unarchive [344] 
export function campaign_unarchive({campaign_id},options = {}){
  return sb.callRemote("campaign_unarchive",{"campaign_id":campaign_id},options);
}

// statsui.edge.remote.api-public/campaign-update [351] 
export function campaign_update({
  campaign_id,
  code,
  icon,
  picture,
  title,
  description,
  detail,
  tags,
  time_start,
  time_end,
  status,
  domain_custom,
  domain_status
},options = {}){
  return sb.callRemote("campaign_update",{
    "campaign_id":campaign_id,
    "m":{
        code,
        icon,
        picture,
        title,
        description,
        detail,
        tags,
        time_start,
        time_end,
        status,
        domain_custom,
        domain_status
      }
  },options);
}

// statsui.edge.remote.api-public/organisation-apikey-create [358] 
export function organisation_apikey_create({organisation_id},options = {}){
  return sb.callRemote(
    "organisation_apikey_create",
    {"organisation_id":organisation_id},
    options
  );
}

// statsui.edge.remote.api-public/organisation-apikey-list [365] 
export function organisation_apikey_list({organisation_id},options = {}){
  return sb.callRemote(
    "organisation_apikey_list",
    {"organisation_id":organisation_id},
    options
  );
}

// statsui.edge.remote.api-public/organisation-apikey-revoke [372] 
export function organisation_apikey_revoke({organisation_id,key_lookup},options = {}){
  return sb.callRemote(
    "organisation_apikey_revoke",
    {"key_lookup":key_lookup,"organisation_id":organisation_id},
    options
  );
}

// statsui.edge.remote.api-public/organisation-archive [379] 
export function organisation_archive({organisation_id},options = {}){
  return sb.callRemote(
    "organisation_archive",
    {"organisation_id":organisation_id},
    options
  );
}

// statsui.edge.remote.api-public/organisation-chat-channel-create [386] 
export function organisation_chat_channel_create({organisation_id,name,description,is_public,detail},options = {}){
  return sb.callRemote("organisation_chat_channel_create",{
    "m":{name,description,is_public,detail},
    "organisation_id":organisation_id
  },options);
}

// statsui.edge.remote.api-public/organisation-chat-channel-update [393] 
export function organisation_chat_channel_update({organisation_id,name,description,is_public,detail},options = {}){
  return sb.callRemote("organisation_chat_channel_update",{
    "m":{name,description,is_public,detail},
    "organisation_id":organisation_id
  },options);
}

// statsui.edge.remote.api-public/organisation-commodity-create [400] 
export function organisation_commodity_create({organisation_id,name,code,type,color,title,icon,picture,detail},options = {}){
  return sb.callRemote("organisation_commodity_create",{
    "m":{name,code,type,color,title,icon,picture,detail},
    "organisation_id":organisation_id
  },options);
}

// statsui.edge.remote.api-public/organisation-commodity-update [407] 
export function organisation_commodity_update({
  organisation_id,
  name,
  code,
  type,
  color,
  title,
  icon,
  picture,
  detail,
  log_entry
},options = {}){
  return sb.callRemote("organisation_commodity_update",{
    "log_entry":log_entry,
    "m":{name,code,type,color,title,icon,picture,detail},
    "organisation_id":organisation_id
  },options);
}

// statsui.edge.remote.api-public/organisation-create [414] 
export function organisation_create({name,title,description,color,picture,background,detail,tags},options = {}){
  return sb.callRemote("organisation_create",{
    "m":{name,title,description,color,picture,background,detail,tags}
  },options);
}

// statsui.edge.remote.api-public/organisation-invite-email-create [421] 
export function organisation_invite_email_create({organisation_id,email},options = {}){
  return sb.callRemote(
    "organisation_invite_email_create",
    {"email":email,"organisation_id":organisation_id},
    options
  );
}

// statsui.edge.remote.api-public/organisation-invite-email-revoke [428] 
export function organisation_invite_email_revoke({organisation_id,email},options = {}){
  return sb.callRemote(
    "organisation_invite_email_revoke",
    {"email":email,"organisation_id":organisation_id},
    options
  );
}

// statsui.edge.remote.api-public/organisation-invite-external-create [435] 
export function organisation_invite_external_create({organisation_id,secret},options = {}){
  return sb.callRemote(
    "organisation_invite_external_create",
    {"organisation_id":organisation_id,"secret":secret},
    options
  );
}

// statsui.edge.remote.api-public/organisation-invite-external-revoke [442] 
export function organisation_invite_external_revoke({organisation_id,invite_id},options = {}){
  return sb.callRemote(
    "organisation_invite_external_revoke",
    {"invite_id":invite_id,"organisation_id":organisation_id},
    options
  );
}

// statsui.edge.remote.api-public/organisation-invite-internal-create [449] 
export function organisation_invite_internal_create({organisation_id,to_id},options = {}){
  return sb.callRemote(
    "organisation_invite_internal_create",
    {"organisation_id":organisation_id,"to_id":to_id},
    options
  );
}

// statsui.edge.remote.api-public/organisation-invite-internal-revoke [456] 
export function organisation_invite_internal_revoke({organisation_id,to_id},options = {}){
  return sb.callRemote(
    "organisation_invite_internal_revoke",
    {"organisation_id":organisation_id,"to_id":to_id},
    options
  );
}

// statsui.edge.remote.api-public/organisation-member-add [463] 
export function organisation_member_add({organisation_id,member_id,level,scope},options = {}){
  return sb.callRemote("organisation_member_add",{
    "level":level,
    "member_id":member_id,
    "organisation_id":organisation_id,
    "scope":scope
  },options);
}

// statsui.edge.remote.api-public/organisation-member-remove [470] 
export function organisation_member_remove({organisation_id,member_id},options = {}){
  return sb.callRemote(
    "organisation_member_remove",
    {"member_id":member_id,"organisation_id":organisation_id},
    options
  );
}

// statsui.edge.remote.api-public/organisation-participant-accept-request [477] 
export function organisation_participant_accept_request({organisation_id,from_id,log_entry},options = {}){
  return sb.callRemote("organisation_participant_accept_request",{
    "from_id":from_id,
    "log_entry":log_entry,
    "organisation_id":organisation_id
  },options);
}

// statsui.edge.remote.api-public/organisation-participant-reject-request [484] 
export function organisation_participant_reject_request({organisation_id,from_id,log_entry},options = {}){
  return sb.callRemote("organisation_participant_reject_request",{
    "from_id":from_id,
    "log_entry":log_entry,
    "organisation_id":organisation_id
  },options);
}

// statsui.edge.remote.api-public/organisation-social-handle-create [491] 
export function organisation_social_handle_create({organisation_id,type,handle,auth},options = {}){
  return sb.callRemote(
    "organisation_social_handle_create",
    {"m":{type,handle,auth},"organisation_id":organisation_id},
    options
  );
}

// statsui.edge.remote.api-public/organisation-social-handle-delete [498] 
export function organisation_social_handle_delete({organisation_id,handle_id},options = {}){
  return sb.callRemote(
    "organisation_social_handle_delete",
    {"handle_id":handle_id,"organisation_id":organisation_id},
    options
  );
}

// statsui.edge.remote.api-public/organisation-token-create [505] 
export function organisation_token_create({
  organisation_id,
  name,
  code,
  type,
  color,
  title,
  icon,
  picture,
  symbol,
  native,
  decimal,
  detail
},options = {}){
  return sb.callRemote("organisation_token_create",{
    "m":{name,code,type,color,title,icon,picture,symbol,native,decimal,detail},
    "organisation_id":organisation_id
  },options);
}

// statsui.edge.remote.api-public/organisation-token-update [512] 
export function organisation_token_update({
  organisation_id,
  name,
  code,
  type,
  color,
  title,
  icon,
  picture,
  symbol,
  native,
  decimal,
  detail,
  log_entry
},options = {}){
  return sb.callRemote("organisation_token_update",{
    "log_entry":log_entry,
    "m":{name,code,type,color,title,icon,picture,symbol,native,decimal,detail},
    "organisation_id":organisation_id
  },options);
}

// statsui.edge.remote.api-public/organisation-unarchive [519] 
export function organisation_unarchive({organisation_id},options = {}){
  return sb.callRemote(
    "organisation_unarchive",
    {"organisation_id":organisation_id},
    options
  );
}

// statsui.edge.remote.api-public/organisation-update [526] 
export function organisation_update({
  organisation_id,
  name,
  title,
  description,
  color,
  picture,
  background,
  detail,
  tags
},options = {}){
  return sb.callRemote("organisation_update",{
    "m":{name,title,description,color,picture,background,detail,tags},
    "organisation_id":organisation_id
  },options);
}

// statsui.edge.remote.api-public/topic-apikey-create [533] 
export function topic_apikey_create({topic_id},options = {}){
  return sb.callRemote("topic_apikey_create",{"topic_id":topic_id},options);
}

// statsui.edge.remote.api-public/topic-apikey-list [540] 
export function topic_apikey_list({topic_id},options = {}){
  return sb.callRemote("topic_apikey_list",{"topic_id":topic_id},options);
}

// statsui.edge.remote.api-public/topic-apikey-revoke [547] 
export function topic_apikey_revoke({topic_id,key_lookup},options = {}){
  return sb.callRemote(
    "topic_apikey_revoke",
    {"key_lookup":key_lookup,"topic_id":topic_id},
    options
  );
}

// statsui.edge.remote.api-public/topic-create [554] 
export function topic_create({
  campaign_id,
  picture,
  background,
  icon,
  title,
  format,
  location,
  description,
  rules,
  tags,
  time_announce,
  time_open,
  time_vesting_start,
  time_vesting_end,
  time_close,
  base_price,
  base_discount,
  vesting_type,
  vesting_coeff,
  tax_burn,
  tax_sell,
  oracle_type,
  oracle_config,
  detail
},options = {}){
  return sb.callRemote("topic_create",{
    "campaign_id":campaign_id,
    "m":{
        picture,
        background,
        icon,
        title,
        format,
        location,
        description,
        rules,
        tags,
        time_announce,
        time_open,
        time_vesting_start,
        time_vesting_end,
        time_close,
        base_price,
        base_discount,
        vesting_type,
        vesting_coeff,
        tax_burn,
        tax_sell,
        oracle_type,
        oracle_config,
        detail
      }
  },options);
}

// statsui.edge.remote.api-public/topic-deploy [561] 
export function topic_deploy({topic_id},options = {}){
  return sb.callRemote("topic_deploy",{"topic_id":topic_id},options);
}

// statsui.edge.remote.api-public/topic-resolve [568] 
export function topic_resolve({topic_id,winner_name},options = {}){
  return sb.callRemote(
    "topic_resolve",
    {"topic_id":topic_id,"winner_name":winner_name},
    options
  );
}

// statsui.edge.remote.api-public/topic-set-close [575] 
export function topic_set_close({topic_id},options = {}){
  return sb.callRemote("topic_set_close",{"topic_id":topic_id},options);
}

// statsui.edge.remote.api-public/topic-set-draft [582] 
export function topic_set_draft({
  topic_id,
  picture,
  background,
  icon,
  title,
  format,
  location,
  description,
  rules,
  tags,
  time_announce,
  time_open,
  time_vesting_start,
  time_vesting_end,
  time_close,
  base_price,
  base_discount,
  vesting_type,
  vesting_coeff,
  tax_burn,
  tax_sell,
  oracle_type,
  oracle_config,
  detail
},options = {}){
  return sb.callRemote("topic_set_draft",{
    "m":{
        picture,
        background,
        icon,
        title,
        format,
        location,
        description,
        rules,
        tags,
        time_announce,
        time_open,
        time_vesting_start,
        time_vesting_end,
        time_close,
        base_price,
        base_discount,
        vesting_type,
        vesting_coeff,
        tax_burn,
        tax_sell,
        oracle_type,
        oracle_config,
        detail
      },
    "topic_id":topic_id
  },options);
}

// statsui.edge.remote.api-public/topic-set-open [589] 
export function topic_set_open({topic_id},options = {}){
  return sb.callRemote("topic_set_open",{"topic_id":topic_id},options);
}

// statsui.edge.remote.api-public/topic-set-trading [596] 
export function topic_set_trading({topic_id},options = {}){
  return sb.callRemote("topic_set_trading",{"topic_id":topic_id},options);
}

// statsui.edge.remote.api-public/topic-set-vesting [603] 
export function topic_set_vesting({topic_id},options = {}){
  return sb.callRemote("topic_set_vesting",{"topic_id":topic_id},options);
}