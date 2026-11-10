import * as newsroom from '@statstrade/feature/newsroom/public-page.jsx'

// statstrade-web.page.newsroom._publication_id_/Page [6] 
export function Page(){
  return (
    <newsroom.NewsroomPage detail={true}/>);
}

// statstrade-web.page.newsroom._publication_id_/page-model-key [8] 
Page["pageModelKey"] = "/newsroom/[publication_id]";

export default Page