import * as SupabaseClient from '@supabase/supabase-js'

import * as kd from '@statstrade/edge/lib/xt/lang/common-data'

import * as api_admin from '@statstrade/edge/remote/api-superadmin'

import * as api_debug from '@statstrade/edge/remote/api-debug'

// Keep the privileged client request-scoped so `next build` does not need
// production-only server credentials while collecting route metadata.
export function getSupabase(){
  let url = process.env.NEXT_SERVER_SUPABASE_URL;
  let key = process.env.NEXT_SERVER_SUPABASE_KEY;
  if(!url || !key){
    throw new Error(
      "NEXT_SERVER_SUPABASE_URL and NEXT_SERVER_SUPABASE_KEY are required for the debug API"
    );
  }
  return SupabaseClient.createClient(url,key);
}

// sznui.package.nextjs.app.api.debug.create-testuser.route/POST [18] 
export async function POST(request){
  let Supabase = getSupabase();
  let input = await request.json();
  let {email,handle,is_super,is_verified,onboarding,password} = input;
  let {data,error} = await Supabase.auth.admin.createUser({
    "email":email,
    "password":password,
    "email_confirm":is_verified != false
  });
  if(is_verified == false){
    return Response.json({data,error});
  }
  let uid = kd.get_in(data,["user","id"]);
  if(error){
    uid = kd.get_in(
      await api_debug.debug_get_id_by_email({email},{"sbClient":Supabase}),
      ["data"]
    );
  }
  if(is_verified != false){
    await api_debug.debug_verify_user_email({email},{"sbClient":Supabase});
  }
  if(onboarding || (is_verified == false)){
    let res = await api_debug.debug_get_user_by_email({email},{"sbClient":Supabase});
    console.log(res);
    return Response.json(res);
  }
  await api_debug.debug_set_user_data(
    {"uid":uid,"data":{"is_onboarded":true}},
    {"sbClient":Supabase}
  );
  if(is_super){
    console.log(
      await api_admin.admin_set_super({"uid":uid,"value":true},{"sbClient":Supabase})
    );
  }
  if(handle){
    console.log(
      await api_admin.admin_set_handle({"uid":uid,"handle":handle},{"sbClient":Supabase})
    );
  }
  let res = await api_debug.debug_get_user_by_email({email},{"sbClient":Supabase});
  return Response.json(res);
}

// sznui.package.nextjs.app.api.debug.create-testuser.route/GET [73] 
export async function GET(){
  let Supabase = getSupabase();
  let {data,error} = await Supabase.schema("szn_type").from("User").select().eq("is_super",true);
  return Response.json({data,error});
}

// sznui.package.nextjs.app.api.debug.create-testuser.route/DELETE [87] 
export async function DELETE(request){
  let Supabase = getSupabase();
  let {searchParams} = new URL(request.url);
  let id = searchParams.get("id");
  let res = await Supabase.auth.admin.deleteUser(id,false);
  return Response.json(res);
}
