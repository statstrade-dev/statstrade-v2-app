import * as xtsb from '@statstrade/edge/remote/util-supabase.jsx'

// statsui.edge.remote.api-general/get-session [7] 
export async function get_session(){
  return await xtsb.getSession();
}

// statsui.edge.remote.api-general/get-user [12] 
export async function get_user(){
  return await xtsb.getUser();
}

// statsui.edge.remote.api-general/sign-in [17] 
export async function sign_in(credentials){
  return await xtsb.signInWithPassword(xtsb.getClient(),credentials);
}

// statsui.edge.remote.api-general/sign-out [24] 
export async function sign_out(){
  return await xtsb.signOut(xtsb.getClient());
}

// statsui.edge.remote.api-general/sign-in-oauth [29] 
export async function sign_in_oauth(options){
  return await xtsb.signInWithOAuth(xtsb.getClient(),options);
}

// statsui.edge.remote.api-general/sign-up [34] 
export async function sign_up(credentials){
  return await xtsb.signUp(xtsb.getClient(),credentials);
}

// statsui.edge.remote.api-general/password-reset [39] 
export async function password_reset({email,redirect}){
  return await xtsb.resetPasswordForEmail(xtsb.getClient(),email,{"redirectTo":redirect});
}

// statsui.edge.remote.api-general/file-upload [47] 
export async function file_upload({file_raw,file_path,bucket,options = {}}){
  return await xtsb.fileUpload({file_raw,file_path,bucket,options});
}

// statsui.edge.remote.api-general/upload-and-get-public-url [53] 
export async function upload_and_get_public_url({file_raw,file_path,bucket,options = {}}){
  let result = await file_upload({file_raw,file_path,bucket,options});
  let error = result["error"];
  if(error){
    return {"data":null,"error":error};
  }
  let path = result["data"]["path"] || file_path;
  return {"data":xtsb.getPublicUrl(bucket,path),"error":null};
}

// statsui.edge.remote.api-general/upload-image [64] 
export async function upload_image({image,file_path,bucket,options = {}}){
  try{
    let image_url = image["uri"] || image["url"];
    let response = await fetch(image_url);
    let file_raw = await response.blob();
    let result = await file_upload({file_raw,file_path,bucket,options});
    let error = result["error"];
    if(error){
      return {"data":null,"error":error};
    }
    let path = result["data"]["path"] || file_path;
    return {"data":xtsb.getPublicUrl(bucket,path),"error":null};
  }
  catch(error){
    return {"data":null,"error":error};
  }
}

// statsui.edge.remote.api-general/list-countries [81] 
export async function list_countries(){
  return await xtsb.queryTable(
    "Country",
    {"select":"*","order":[{"column":"title"}]},
    {"schema":"szn_type"}
  );
}