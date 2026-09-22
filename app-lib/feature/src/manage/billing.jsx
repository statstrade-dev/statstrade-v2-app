import * as main from '@statstrade/feature/manage/billing/billing-main.jsx'

import * as create from '@statstrade/feature/manage/billing/billing-create.jsx'

import * as common from '@statstrade/feature/manage/billing/billing-common.jsx'

// statstrade-web.feature.manage.billing/BillingScreen [13] 
export function BillingScreen(){
  let ctx = common.useBillingContext();
  let {controls} = ctx;
  let {setView,view} = controls;
  let isCreating = view == "create";
  return (
    <common.BillingContext.Provider value={ctx}>
      {isCreating ? (
        <create.PaymentForm
          onCancel={function (){
              setView("list");
            }}
          onFinish={function (data){
              console.log("Finish create",data);
              setView("list");
            }}/>) : (
        <main.BillingList/>)}
    </common.BillingContext.Provider>);
}

// statstrade-web.feature.manage.billing/Page [31] 
export function Page(){
  return (
    <BillingScreen/>);
}