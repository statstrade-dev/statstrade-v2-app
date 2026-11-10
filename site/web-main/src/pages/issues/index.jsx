import * as civic from '@statstrade/feature/civic/pages.jsx'

// statstrade-web.page.issues.index/Page [5] 
export function Page(){
  return (
    <civic.Browse mode="issues"/>);
}

// statstrade-web.page.issues.index/page-model-key [6] 
Page["pageModelKey"] = "/issues";

export default Page