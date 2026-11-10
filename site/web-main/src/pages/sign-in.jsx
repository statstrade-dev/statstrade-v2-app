import * as feature from '@statstrade/feature/auth/sign-in.jsx'

// statstrade-web.page.sign-in/Page [14] 
export function Page(){
  return (
    <feature.SignInScreen redirectTo="/activity"/>);
}

// statstrade-web.page.sign-in/page-model-key [19] 
Page["pageModelKey"] = "/sign-in";

export default Page