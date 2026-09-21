import * as SupabaseClient from '@supabase/supabase-js'

import * as k from '@statstrade/edge/lib/xt/lang/base-lib'

import * as api_admin from '@statstrade/edge/remote/api-superadmin'

import * as api_debug from '@statstrade/edge/remote/api-debug'

// sznui.package.nextjs.app.api.debug.create-testuser.route/Supabase [13] 
export var Supabase = SupabaseClient.createClient(
  process.env.NEXT_SERVER_SUPABASE_URL,
  process.env.NEXT_SERVER_SUPABASE_KEY
);

// sznui.package.nextjs.app.api.debug.create-testuser.route/POST [18] 
export async function POST(request){
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
  let uid = k.get_in(data,["user","id"]);
  if(error){
    uid = k.get_in(
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
  let {data,error} = await Supabase.schema("szn_type").from("User").select().eq("is_super",true);
  return Response.json({data,error});
}

// sznui.package.nextjs.app.api.debug.create-testuser.route/DELETE [87] 
export async function DELETE(request){
  let {searchParams} = new URL(request.url);
  let id = searchParams.get("id");
  let res = await Supabase.auth.admin.deleteUser(id,false);
  return Response.json(res);
}