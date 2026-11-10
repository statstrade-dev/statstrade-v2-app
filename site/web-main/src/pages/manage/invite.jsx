import dynamic from 'next/dynamic'

// statstrade-web.page.manage.invite/Workspace [5] 
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

// statstrade-web.page.manage.invite/Page [9] 
export function Page(){
  return (
    <Workspace pageKey="invites"/>);
}

// statstrade-web.page.manage.invite/page-model-key [10] 
Page["pageModelKey"] = "/manage/invite";

export default Page