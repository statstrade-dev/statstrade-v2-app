import * as civic from '@statstrade/feature/civic/pages.jsx'

// statstrade-web.page.forecasts/Page [5] 
export function Page(){
  return (
    <civic.Browse mode="forecasts"/>);
}

// statstrade-web.page.forecasts/page-model-key [6] 
Page["pageModelKey"] = "/forecasts";

export default Page