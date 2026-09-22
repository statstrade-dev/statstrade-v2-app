import * as common from '@statstrade/feature/manage/topics/topics-common.jsx'

import * as main from '@statstrade/feature/manage/topics/topics-main.jsx'

import * as create from '@statstrade/feature/manage/topics/topics-create.jsx'

// statstrade-web.feature.manage.topics/MarketsScreen [15] 
export function MarketsScreen(){
  let ctx = common.useTopicsContext();
  let {controls} = ctx;
  let {setView,view} = controls;
  let isCreating = view == "create";
  return (
    <common.TopicsContext.Provider value={ctx}>
      {isCreating ? (
        <create.TopicForm
          onCancel={function (){
              setView("list");
            }}
          onFinish={function (data){
              console.log("Finish create",data);
              setView("list");
            }}/>) : (
        <main.MarketsList/>)}
    </common.TopicsContext.Provider>);
}

// statstrade-web.feature.manage.topics/Page [33] 
export function Page(){
  return (
    <MarketsScreen/>);
}