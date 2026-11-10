import * as newsroom from '@statstrade/feature/newsroom/public-page.jsx'

// statstrade-web.page.newsroom.index/Page [6] 
export function Page(){
  return (
    <newsroom.NewsroomPage/>);
}

// statstrade-web.page.newsroom.index/page-model-key [8] 
Page["pageModelKey"] = "/newsroom";

export default Page