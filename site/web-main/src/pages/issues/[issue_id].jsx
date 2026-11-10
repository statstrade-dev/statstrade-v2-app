import * as civic from '@statstrade/feature/civic/pages.jsx'

// statstrade-web.page.issues._issue_id_/Page [5] 
export function Page(){
  return (
    <civic.Issue/>);
}

// statstrade-web.page.issues._issue_id_/page-model-key [6] 
Page["pageModelKey"] = "/issues/[issue_id]";

export default Page