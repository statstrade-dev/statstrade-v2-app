import dynamic from 'next/dynamic'

// statstrade-web.page.manage.settings/Workspace [5] 
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

// statstrade-web.page.manage.settings/Page [9] 
export function Page(){
  return (
    <Workspace pageKey="settings"/>);
}

// statstrade-web.page.manage.settings/page-model-key [10] 
Page["pageModelKey"] = "/manage/settings";

export default Page