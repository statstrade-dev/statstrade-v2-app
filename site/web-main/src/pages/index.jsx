import * as civic from '@statstrade/feature/civic/pages.jsx'

// statstrade-web.page.index/Page [5] 
export function Page(){
  return (
    <civic.Browse mode="today"/>);
}

// statstrade-web.page.index/page-model-key [6] 
Page["pageModelKey"] = "/";

export default Page