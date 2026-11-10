import dynamic from 'next/dynamic'

// statstrade-web.page.manage.reputation/Workspace [12] 
export var Workspace = dynamic(function (){
  return import("@statstrade/feature/reputation/screen.jsx").then(function (module){
    return module.ReputationPage;
  });
},{
  "ssr":false,
  "loading":function (){
    return (
      <p role="status">Loading brand programme…</p>);
  }
});

// statstrade-web.page.manage.reputation/Page [17] 
export function Page(){
  return (
    <Workspace/>);
}

// statstrade-web.page.manage.reputation/page-model-key [20] 
Page["pageModelKey"] = "/manage/reputation";

export default Page