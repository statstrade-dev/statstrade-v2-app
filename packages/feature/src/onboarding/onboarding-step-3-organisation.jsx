import React from 'react'

import * as element_organisation from '@statstrade/component/element/element-organisation.jsx'

import * as kd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as common from '@statstrade/feature/onboarding/onboarding-common.jsx'

import * as ui_section from '@statstrade/component/ui-section.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

import * as api_general from '@statstrade/edge/remote/api-general.jsx'

// statstrade-web.feature.onboarding.onboarding-step-3-organisation/saveOnboardingOrganisation [24] 
export async function saveOnboardingOrganisation(api,user,controls,form_values){
  let payload = kd.obj_assign(form_values,{"tags":Array.from(controls.orgTags)});
  if(controls.orgImage){
    let user_id = user && user.id;
    if(!user_id){
      throw new Error("User not found");
    }
    let upload = await api_general.upload_image({
      "image":controls.orgImage,
      "file_path":user_id + "/organisations/" + Date.now(),
      "bucket":"images"
    });
    if(upload.error){
      throw upload.error;
    }
    payload = kd.obj_assign(payload,{"picture":{"uri":upload.data}});
  }
  let existing = controls.existingOrg && (controls.existingOrg.id != "new");
  let result = existing ? await api.mutations.organisation_update.mutateAsync(
    kd.obj_assign(payload,{"organisation_id":controls.existingOrg.id})
  ) : await api.mutations.organisation_create.mutateAsync(payload);
  if(result.error){
    throw result.error;
  }
  let refreshed = await api.queries.user_list_member_organisations.refetch();
  let organisations = (refreshed.data && refreshed.data.data) || api.queries.user_list_member_organisations.output || [];
  let saved = organisations.find(function (organisation){
    return existing ? (organisation.id == controls.existingOrg.id) : ((result.data && result.data.id && (organisation.id == result.data.id)) || (organisation.name == form_values.name));
  });
  let selected = saved || (result.data && result.data.id && result.data) || (result.data && {"id":result.data,"name":form_values.name});
  if(!selected){
    throw new Error("Organisation was saved but could not be loaded");
  }
  controls.setExistingOrg(
    existing ? kd.obj_assign(controls.existingOrg,payload,selected) : selected
  );
  controls.setExistingOrgId(selected.id);
  controls.setStep(4);
  return result;
}

// statstrade-web.feature.onboarding.onboarding-step-3-organisation/OnboardingOrganisationForm [77] 
export function OnboardingOrganisationForm(){
  let context = React.useContext(common.IndexOnboardingContext);
  let {api,controls,forms,user} = context;
  let [showForm,setShowForm] = React.useState(false);
  let isBusy = api.mutations.organisation_create.isPending || api.mutations.organisation_update.isPending;
  let toggleTag = function (id){
    let next = new Set(controls.orgTags);
    if(next.has(id)){
      next.delete(id);
    }
    else{
      next.add(id);
    }
    controls.setOrgTags(next);
  };
  let nameValue = forms.organisation_create.watch("name");
  let orgsQuery = api.queries.user_list_member_organisations;
  let orgs = orgsQuery.output || [];
  ui.useRemoteCheck({
    "form":forms.organisation_create,
    "field":"name",
    "value":nameValue,
    "check_fn":function (v){
        return api.queries.check_organisation_exists.queryRaw({"name":v}).then(function (res){
          return res.data;
        });
      },
    "message":"Organisation name is taken",
    "current_value":controls.existingOrg && controls.existingOrg.name
  });
  React.useEffect(function (){
    orgsQuery.setInput({});
  },[]);
  React.useEffect(function (){
    let error = orgsQuery.error || (orgsQuery.data && orgsQuery.data.error);
    if(error){
      console.error("Error fetching organisations",error);
    }
    else{
      if(orgsQuery.output.length > 0){
        setShowForm(false);
      }
    }
  },[orgsQuery.output,orgsQuery.error,orgsQuery.data]);
  let handle_submit = async function (){
    try{
      await saveOnboardingOrganisation(api,user,controls,forms.organisation_create.getValues());
    }
    catch(e){
      console.error("Failed to save organisation",e);
      alert("Could not save your organisation. Please try again.");
    }
  };
  let handle_selection = function (org){
    controls.setExistingOrg(org);
    controls.setExistingOrgId(org.id);
  };
  let handle_edit = function (org){
    controls.setExistingOrg(org);
    controls.setExistingOrgId(org.id);
    forms.organisation_create.reset({
      "name":org.name,
      "title":org.title,
      "description":org.description
    });
    controls.setOrgTags(new Set(org.tags || []));
    controls.setOrgImage(org.picture_url ? {"uri":org.picture_url} : null);
    setShowForm(true);
  };
  let handle_proceed = function (){
    if(controls.existingOrg && (controls.existingOrg.id == "new")){
      setShowForm(true);
    }
    else{
      controls.setStep(4);
    }
  };
  let title = ((orgs.length > 0) && !showForm) ? "Select an Organisation" : ((controls.existingOrg && (controls.existingOrg.id != "new")) ? "Update Organisation" : "Create an Organisation");
  let paragraph = ((orgs.length > 0) && !showForm) ? "Your place for engaging the community" : "Fill in the details below";
  return (
    <React.Fragment>
      <ui_section.MinHeader title={title} paragraph={paragraph}/>
      {((orgs.length > 0) && !showForm) ? (
        <element_organisation.OrganisationList
          orgs={orgs}
          existingOrg={controls.existingOrg}
          onSelect={handle_selection}
          onEdit={handle_edit}
          onProceed={handle_proceed}
          onSkip={function (e){
              e.preventDefault();
              controls.setStep(5);
            }}
          onCreateNew={function (){
              controls.setExistingOrg({"id":"new","name":"New Organisation"});
              controls.setExistingOrgId(null);
              forms.organisation_create.reset({"name":"","title":"","description":""});
              controls.setOrgTags(new Set());
              controls.setOrgImage(null);
            }}/>) : (
        <element_organisation.OrganisationForm
          tags={controls.orgTags}
          existingOrg={controls.existingOrg}
          onCancel={function (e){
              e.preventDefault();
              if(orgs.length > 0){
                setShowForm(false);
                if(controls.existingOrg && (controls.existingOrg.id == "new")){
                  controls.setExistingOrg(null);
                }
              }
              else{
                controls.setStep(4);
              }
            }}
          onSubmit={handle_submit}
          showBack={orgs.length > 0}
          toggleTag={toggleTag}
          form={forms.organisation_create}
          isBusy={isBusy}
          onImageSelected={controls.setOrgImage}/>)}
    </React.Fragment>);
}

// statstrade-web.feature.onboarding.onboarding-step-3-organisation/OnboardingStep3OrganisationScreen [219] 
export function OnboardingStep3OrganisationScreen(){
  let context = React.useContext(common.IndexOnboardingContext);
  return (
    <ui_section.MinFrameCenter><OnboardingOrganisationForm/></ui_section.MinFrameCenter>);
}