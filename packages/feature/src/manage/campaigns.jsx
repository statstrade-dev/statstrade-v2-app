import React from 'react'

import * as create from '@statstrade/feature/manage/campaigns/campaigns-create.jsx'

import * as detail from '@statstrade/feature/manage/campaigns/campaigns-detail.jsx'

import * as common from '@statstrade/feature/manage/campaigns/campaigns-common.jsx'

import * as main from '@statstrade/feature/manage/campaigns/campaigns-main.jsx'

// statstrade-web.feature.manage.campaigns/CampaignsContent [21] 
export function CampaignsContent(){
  let ctx = React.useContext(common.CampaignsContext);
  let view = ctx.controls.view;
  let setView = ctx.controls.setView;
  if(view == "create"){
    return (
      <create.CampaignForm
        onCancel={function (){
            setView("list");
          }}
        onFinish={function (data){
            console.log("Created",data);
            setView("list");
          }}/>);
  }
  else{
    if(view == "detail"){
      return (
        <detail.CampaignDetail
          onBack={function (){
              setView("list");
            }}/>);
    }
    else{
      return (
        <main.CampaignsList/>);
    }
  }
}

// statstrade-web.feature.manage.campaigns/CampaignsScreen [42] 
export function CampaignsScreen(){
  let context = common.useCampaignsContext();
  return (
    <common.CampaignsContext.Provider value={context}><CampaignsContent/></common.CampaignsContext.Provider>);
}