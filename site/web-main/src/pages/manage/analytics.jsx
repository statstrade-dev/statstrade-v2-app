import dynamic from 'next/dynamic'

// statstrade-web.page.manage.analytics/Workspace [5] 
export var Workspace = dynamic(function (){
  return import("@statstrade/feature/manage/page-workspace.jsx").then(function (module){
    return module.ManagementPage;
  });
},{
  "ssr":false,
  "loading":function (){
    return (
      <p role="status">Loading page…</p>);
  }
});

// statstrade-web.page.manage.analytics/Page [9] 
export function Page(){
  return (
    <Workspace pageKey="analytics"/>);
}

// statstrade-web.page.manage.analytics/page-model-key [10] 
Page["pageModelKey"] = "/manage/analytics";

export default Page