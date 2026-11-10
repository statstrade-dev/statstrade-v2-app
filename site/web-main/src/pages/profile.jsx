import * as profile_editor from '@statstrade/feature/profile/profile-editor.jsx'

// statstrade-web.page.profile/Page [12] 
export function Page(){
  return (
    <profile_editor.ProfileEditor/>);
}

// statstrade-web.page.profile/page-model-key [17] 
Page["pageModelKey"] = "/profile";

export default Page