import * as directory from '@statstrade/feature/freediving/directory.jsx'

// statstrade-web.page.freediving.index/Page [5] 
export function Page(){
  return (
    <directory.Screen mode="dive-browse"/>);
}

// statstrade-web.page.freediving.index/page-model-key [6] 
Page["pageModelKey"] = "/freediving";

export default Page