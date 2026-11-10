import dynamic from 'next/dynamic'

// statstrade-web.page.manage.billing/Workspace [5] 
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

// statstrade-web.page.manage.billing/Page [9] 
export function Page(){
  return (
    <Workspace pageKey="billing"/>);
}

// statstrade-web.page.manage.billing/page-model-key [10] 
Page["pageModelKey"] = "/manage/billing";

export default Page