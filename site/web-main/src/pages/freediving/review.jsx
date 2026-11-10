import * as directory from '@statstrade/feature/freediving/directory.jsx'

// statstrade-web.page.freediving.review/Page [5] 
export function Page(){
  return (
    <directory.Screen mode="dive-review"/>);
}

// statstrade-web.page.freediving.review/page-model-key [6] 
Page["pageModelKey"] = "/freediving/review";

export default Page