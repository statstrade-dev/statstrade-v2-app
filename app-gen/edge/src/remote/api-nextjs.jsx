import * as api_nextjs from '@statstrade/edge/remote/util-nextjs'

// statsui.edge.remote.api-nextjs/util-ping [8] 
export function util_ping(input,options = {}){
  return api_nextjs.callApi("api/util/ping","GET",input,options);
}

// statsui.edge.remote.api-nextjs/util-echo [15] 
export function util_echo(input,options = {}){
  return api_nextjs.callApi("api/util/echo","POST",input,options);
}

// statsui.edge.remote.api-nextjs/util-og [22] 
export function util_og({title,description},options = {}){
  return api_nextjs.callApi("api/util/og","GET",{title,description},options);
}

// statsui.edge.remote.api-nextjs/debug-testusers-create [29] 
export function debug_testusers_create({email,password,handle,is_super,is_verified,onboarding},options = {}){
  return api_nextjs.callApi(
    "api/debug/create-testuser",
    "POST",
    {email,password,handle,is_super,is_verified,onboarding},
    options
  );
}

// statsui.edge.remote.api-nextjs/debug-testusers-list [36] 
export function debug_testusers_list(_,options = {}){
  return api_nextjs.callApi("api/debug/create-testuser","GET",{},options);
}

// statsui.edge.remote.api-nextjs/debug-testusers-delete [43] 
export function debug_testusers_delete({id},options = {}){
  return api_nextjs.callApi("api/debug/create-testuser","DELETE",{id},options);
}