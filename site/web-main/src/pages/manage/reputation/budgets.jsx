import dynamic from 'next/dynamic'

// statstrade-web.page.manage.reputation.budgets/Workspace [5] 
export var Workspace = dynamic(function (){
  return import("@statstrade/feature/manage/page-workspace.jsx").then(function (module){
    return module.ManagementPage;
  });
},{"ssr":false});

// statstrade-web.page.manage.reputation.budgets/Page [6] 
export function Page(){
  return (
    <Workspace pageKey="reputation-budgets"/>);
}

// statstrade-web.page.manage.reputation.budgets/page-model-key [7] 
Page["pageModelKey"] = "/manage/reputation/budgets";

export default Page