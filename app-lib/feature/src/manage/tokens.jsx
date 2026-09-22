import * as main from '@statstrade/feature/manage/tokens/tokens-main.jsx'

import * as common from '@statstrade/feature/manage/tokens/tokens-common.jsx'

import * as create from '@statstrade/feature/manage/tokens/tokens-create.jsx'

// statstrade-web.feature.manage.tokens/TokensScreen [15] 
export function TokensScreen(){
  let ctx = common.useTokensContext();
  let {controls} = ctx;
  let {setView,view} = controls;
  let isCreating = view == "create";
  return (
    <common.TokensContext.Provider value={ctx}>
      {isCreating ? (
        <create.TokenForm
          onCancel={function (){
              setView("list");
            }}
          onFinish={function (data){
              console.log("Finish create",data);
              setView("list");
            }}/>) : (
        <main.TokensList/>)}
    </common.TokensContext.Provider>);
}

// statstrade-web.feature.manage.tokens/Page [33] 
export function Page(){
  return (
    <TokensScreen/>);
}