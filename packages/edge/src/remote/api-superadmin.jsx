import * as sb from '@statstrade/edge/remote/util-supabase.jsx'

// statsui.edge.remote.api-superadmin/super-bootstrap-platform-root [8] 
export function super_bootstrap_platform_root({user_id,reason,metadata},options = {}){
  return sb.callRemote(
    "super_bootstrap_platform_root",
    {"user_id":user_id,"reason":reason,"metadata":metadata},
    options
  );
}

// statsui.edge.remote.api-superadmin/super-compute-configuration-publish [15] 
export function super_compute_configuration_publish({actor_id,expected_revision,value,reason},options = {}){
  return sb.callRemote("super_compute_configuration_publish",{
    "actor_id":actor_id,
    "expected_revision":expected_revision,
    "value":value,
    "reason":reason
  },options);
}

// statsui.edge.remote.api-superadmin/super-global-section-reset [22] 
export function super_global_section_reset({actor_id,key,expected_revision,reason},options = {}){
  return sb.callRemote("super_global_section_reset",{
    "actor_id":actor_id,
    "key":key,
    "expected_revision":expected_revision,
    "reason":reason
  },options);
}

// statsui.edge.remote.api-superadmin/super-global-section-update [29] 
export function super_global_section_update({actor_id,key,expected_revision,value,reason},options = {}){
  return sb.callRemote("super_global_section_update",{
    "actor_id":actor_id,
    "key":key,
    "expected_revision":expected_revision,
    "value":value,
    "reason":reason
  },options);
}

// statsui.edge.remote.api-superadmin/super-operations-command [36] 
export function super_operations_command({actor_id,resource,target_id,action,payload},options = {}){
  return sb.callRemote("super_operations_command",{
    "actor_id":actor_id,
    "resource":resource,
    "target_id":target_id,
    "action":action,
    "payload":payload
  },options);
}

// statsui.edge.remote.api-superadmin/super-operations-snapshot [43] 
export function super_operations_snapshot({actor_id},options = {}){
  return sb.callRemote("super_operations_snapshot",{"actor_id":actor_id},options);
}

// statsui.edge.remote.api-superadmin/super-org-purge [50] 
export function super_org_purge({user_id,org_id},options = {}){
  return sb.callRemote("super_org_purge",{"user_id":user_id,"org_id":org_id},options);
}

// statsui.edge.remote.api-superadmin/super-org-update [57] 
export function super_org_update({
  user_id,
  org_id,
  name,
  title,
  description,
  color,
  icon,
  picture,
  background,
  detail,
  tags,
  is_academic,
  is_nonprofit,
  is_archived
},options = {}){
  return sb.callRemote("super_org_update",{
    "user_id":user_id,
    "org_id":org_id,
    "m":{
        name,
        title,
        description,
        color,
        icon,
        picture,
        background,
        detail,
        tags,
        is_academic,
        is_nonprofit,
        is_archived
      }
  },options);
}

// statsui.edge.remote.api-superadmin/super-purge-erc20-option [64] 
export function super_purge_erc20_option({admin_id,token_id,playable_id},options = {}){
  return sb.callRemote("super_purge_erc20_option",{
    "admin_id":admin_id,
    "token_id":token_id,
    "playable_id":playable_id
  },options);
}

// statsui.edge.remote.api-superadmin/super-revoke-platform-grant [71] 
export function super_revoke_platform_grant({actor_id,user_id,reason},options = {}){
  return sb.callRemote(
    "super_revoke_platform_grant",
    {"actor_id":actor_id,"user_id":user_id,"reason":reason},
    options
  );
}

// statsui.edge.remote.api-superadmin/super-set-erc20-option [78] 
export function super_set_erc20_option({
  admin_id,
  token_id,
  playable_id,
  contract_address,
  chain_id,
  decimals,
  total_supply,
  is_burnable,
  is_mintable,
  is_soulbound,
  is_enabled,
  standard
},options = {}){
  return sb.callRemote("super_set_erc20_option",{
    "admin_id":admin_id,
    "token_id":token_id,
    "playable_id":playable_id,
    "contract_address":contract_address,
    "m":{
        contract_address,
        chain_id,
        decimals,
        total_supply,
        is_burnable,
        is_mintable,
        is_soulbound,
        is_enabled,
        standard
      }
  },options);
}

// statsui.edge.remote.api-superadmin/super-set-platform-grant [85] 
export function super_set_platform_grant({actor_id,user_id,level,scopes,expires_at,reason,metadata},options = {}){
  return sb.callRemote("super_set_platform_grant",{
    "actor_id":actor_id,
    "user_id":user_id,
    "level":level,
    "scopes":scopes,
    "expires_at":expires_at,
    "reason":reason,
    "metadata":metadata
  },options);
}

// statsui.edge.remote.api-superadmin/super-user-set-super [92] 
export function super_user_set_super({user_id,target_id,value},options = {}){
  return sb.callRemote(
    "super_user_set_super",
    {"user_id":user_id,"target_id":target_id,"value":value},
    options
  );
}

// statsui.edge.remote.api-superadmin/super-user-update [99] 
export function super_user_update({
  user_id,
  target_id,
  type,
  handle,
  color,
  is_active,
  is_official,
  is_onboarded,
  is_super,
  first_name,
  last_name,
  country_code,
  location,
  bio,
  picture,
  detail
},options = {}){
  return sb.callRemote("super_user_update",{
    "user_id":user_id,
    "target_id":target_id,
    "m":{
        type,
        handle,
        color,
        is_active,
        is_official,
        is_onboarded,
        is_super,
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