import dynamic from 'next/dynamic'

// statstrade-web.page.questions._topic_id_/Workspace [5] 
export var Workspace = dynamic(function (){
  return import("@statstrade/feature/reputation/question.jsx").then(function (module){
    return module.QuestionPage;
  });
},{"ssr":false});

// statstrade-web.page.questions._topic_id_/Page [7] 
export function Page(){
  return (
    <Workspace/>);
}

// statstrade-web.page.questions._topic_id_/page-model-key [8] 
Page["pageModelKey"] = "/questions/[topic_id]";

export default Page