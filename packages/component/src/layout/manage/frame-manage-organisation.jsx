import React from 'react'

import * as T from 'tamagui'

import * as global from '@statstrade/edge/global-store.jsx'

import * as context_manage from '@statstrade/component/layout/manage/context-manage.jsx'

// statsui.basic.layout.manage.frame-manage-organisation/DashboardOrgSetup [7] 
export function DashboardOrgSetup({onClose,onSuccess}){
  let context = React.useContext(context_manage.LayoutManageContext);
  let [_brand,setBrand] = global.useStore(["context","organisation"]);
  let [busy,setBusy] = React.useState(false);
  let [error,setError] = React.useState(null);
  function submit(event){
    event.preventDefault();
    let form = new FormData(event.currentTarget);
    setBusy(true);
    setError(null);
    context.api.mutations.organisation_create.mutateAsync({
      "m":{
            "name":String(form.get("name") || "").trim().toLowerCase(),
            "title":String(form.get("title") || "").trim(),
            "description":String(form.get("description") || "").trim()
          }
    }).then(function (result){
      let brand = (result.data && result.data.o_org) || result.data;
      if(brand && brand.id){
        setBrand(brand);
      }
      if(onSuccess){
        onSuccess(brand);
      }
      onClose();
    }).catch(function (e){
      setError(e.message);
    }).finally(function (){
      setBusy(false);
    });
  }
  return (
    <T.YStack padding="$6" gap="$4" maxWidth={680}>
      <T.H2>Create organisation</T.H2>
      <T.Paragraph>
        Create your brand workspace. Manage payment methods and subscriptions from Billing.
      </T.Paragraph>
      <form onSubmit={submit}>
        <div style={{"display":"grid","gap":16}}>
          <label htmlFor="brand-name">Organisation ID</label>
          <input
            id="brand-name"
            name="name"
            required={true}
            minLength={3}
            maxLength={30}
            pattern="[a-z0-9_]+"/>
          <label htmlFor="brand-title">Title</label>
          <input id="brand-title" name="title" required={true}/>
          <label htmlFor="brand-description">Description</label>
          <textarea id="brand-description" name="description"/>
          {error ? (
            <p role="alert">{error}</p>) : null}
          <button type="submit" disabled={busy}>{busy ? "Creating…" : "Create organisation"}</button>
          <button type="button" disabled={busy} onClick={onClose}>Cancel</button>
        </div>
      </form>
    </T.YStack>);
}