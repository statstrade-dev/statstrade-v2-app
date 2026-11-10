import dynamic from 'next/dynamic'

// statstrade-web.page.reputation.design/Workspace [13] 
export var Workspace = dynamic(function (){
  return import("@statstrade/feature/reputation/screen.jsx").then(function (module){
    return module.ReputationPage;
  });
},{
  "ssr":false,
  "loading":function (){
    return (
      <p role="status">Loading reputation design…</p>);
  }
});

// statstrade-web.page.reputation.design/Page [18] 
export function Page(){
  return (
    <Workspace preview={true}/>);
}

// statstrade-web.page.reputation.design/preview-flag [21] 
Page["reputationPreview"] = true;

// statstrade-web.page.reputation.design/page-model-key [24] 
Page["pageModelKey"] = "/reputation/design";

export default Page