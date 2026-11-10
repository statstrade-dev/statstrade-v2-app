import * as directory from '@statstrade/feature/freediving/directory.jsx'

// statstrade-web.page.freediving._slug_/Page [5] 
export function Page(){
  return (
    <directory.Screen mode="dive-detail"/>);
}

// statstrade-web.page.freediving._slug_/page-model-key [6] 
Page["pageModelKey"] = "/freediving/[slug]";

export default Page