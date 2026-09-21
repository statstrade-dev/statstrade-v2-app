import * as sb from '@statstrade/edge/remote/util-supabase'

// statsui.edge.remote.api-general/get-session [8] 
export function get_session(){
  return sb.getClient().auth.getSession();
}

// statsui.edge.remote.api-general/get-user [17] 
export async function get_user(){
  return sb.getClient().auth.getUser();
}

// statsui.edge.remote.api-general/sign-in [25] 
export function sign_in({email,password}){
  return sb.getClient().auth.signInWithPassword({email,password});
}

// statsui.edge.remote.api-general/sign-out [34] 
export function sign_out(){
  return sb.getClient().auth.signOut();
}

// statsui.edge.remote.api-general/sign-in-oauth [41] 
export function sign_in_oauth({options,provider}){
  return sb.getClient().auth.signInWithOAuth({options,provider});
}

// statsui.edge.remote.api-general/sign-up [52] 
export function sign_up({email,password}){
  return sb.getClient().auth.signUp({email,password});
}

// statsui.edge.remote.api-general/password-reset [61] 
export function password_reset({email,redirect}){
  return sb.getClient().auth.resetPasswordForEmail(email,{"redirecTo":redirect});
}

// statsui.edge.remote.api-general/file-upload [71] 
export function file_upload({file_raw,file_path,bucket,options = {}}){
  return sb.getClient().storage.from(bucket).upload(file_path,file_raw,Object.assign({"upsert":false},options));
}

// statsui.edge.remote.api-general/upload-and-get-public-url [84] 
export async function upload_and_get_public_url({file_raw,file_path,bucket}){
  let {data,error} = await file_upload({bucket,file_path,file_raw});
  if(error){
    console.error("Error uploading file:",error);
    return {"error":error};
  }
  let storage_bucket = sb.getClient().storage.from(bucket);
  let url_response = storage_bucket.getPublicUrl(data.path);
  return {"data":url_response.data.publicUrl};
}

// statsui.edge.remote.api-general/upload-image [100] 
export async function upload_image({image,file_path,bucket}){
  let file_raw = await fetch(image.uri || image.url).then(function (res){
    return res.blob();
  });
  let {data,error} = await file_upload({bucket,file_path,file_raw});
  if(error){
    return {"error":error};
  }
  let url = sb.getClient().storage.from(bucket).getPublicUrl(data.path);
  return {"data":url.data.publicUrl};
}

// statsui.edge.remote.api-general/list-countries [117] 
export function list_countries(){
  return sb.getClient().schema("szn_type").from("Country").select("*").order("name");
}