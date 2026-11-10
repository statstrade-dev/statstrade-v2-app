import * as directory from '@statstrade/feature/freediving/directory.jsx'

// statstrade-web.page.freediving.manage/Page [5] 
export function Page(){
  return (
    <directory.Screen mode="dive-manage"/>);
}

// statstrade-web.page.freediving.manage/page-model-key [6] 
Page["pageModelKey"] = "/freediving/manage";

export default Page