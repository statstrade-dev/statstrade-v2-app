import * as T from 'tamagui'

import React from 'react'

import * as hook_form from '@statstrade/edge/lib/js/lib/react-hook-form'

import * as ui_form from '@statstrade/component/ui-form'

// sznui.lib.component.ui-form-test/Metadata [16] 
export var Metadata = {[title]:"Components/ui-form",[tags]:["autodoc"]};

// sznui.lib.component.ui-form-test/Test_FormInput [22] 
export function Test_FormInput(){
  let {control,handleSubmit} = hook_form.useFormBase({"defaultValues":{"test_input":""}});
  return (
    <T.YStack gap="$4" width={300}>
      <ui_form.FormInput
        control={control}
        field="test_input"
        title="Test Input"
        placeholder="Enter text here..."/>
      <ui_form.FormInput
        control={control}
        field="test_input_hidden_title"
        title="Hidden Title Input"
        hideTitle={true}
        placeholder="No Title Input"/>
    </T.YStack>);
}

// sznui.lib.component.ui-form-test/Test_FormInputTitle [46] 
export function Test_FormInputTitle(){
  return (
    <T.YStack gap="$4" height={100} justifyContent="center">
      <T.View
        position="relative"
        height={50}
        borderWidth={1}
        borderColor="$color8">
        <ui_form.FormInputTitle>{"Static Title"}</ui_form.FormInputTitle>
      </T.View>
    </T.YStack>);
}

// sznui.lib.component.ui-form-test/Test_FormInputPlaceholder [60] 
export function Test_FormInputPlaceholder(){
  let [displaced,setDisplaced] = React.useState(false);
  return (
    <T.YStack gap="$4" height={150} justifyContent="center">
      <T.Button
        onPress={function (){
            setDisplaced(!displaced);
          }}>{"Toggle Placeholder"}
      </T.Button>
      <T.View
        position="relative"
        height={60}
        borderWidth={1}
        borderColor="$color8"
        width={300}>
        <ui_form.FormInputPlaceholder displaced={displaced} inputLayout={{"height":60}}>{"Animated Placeholder"}</ui_form.FormInputPlaceholder>
      </T.View>
    </T.YStack>);
}

// sznui.lib.component.ui-form-test/Test_FormError [81] 
export function Test_FormError(){
  return (
    <T.YStack gap="$4">
      <ui_form.FormError error={{"message":"This is a form error message."}}/>
    </T.YStack>);
}

// sznui.lib.component.ui-form-test/Test_FormTagSelect [94] 
export function Test_FormTagSelect(){
  let [selected,setSelected] = React.useState({});
  let toggle = function (id){
    if(selected.has(id)){
      let new_set = new Set(selected);
      new_set.delete(id);
      setSelected(new_set);
    }
    else{
      let new_set = new Set(selected);
      new_set.add(id);
      setSelected(new_set);
    }
  };
  return (
    <ui_form.FormTagSelect
      title="Select Tags"
      selected={selected}
      onToggle={toggle}
      options={[
          {"id":"tag1","label":"Tag 1"},
          {"id":"tag2","label":"Tag 2"},
          {"id":"tag3","label":"Tag 3"}
        ]}/>);
}

// sznui.lib.component.ui-form-test/Test_FormInputErrorCheck [119] 
export function Test_FormInputErrorCheck(){
  return (
    <T.YStack gap="$4">
      <T.Text>{"Error State:"}</T.Text>
      <T.View position="relative" height={40} width={40} borderWidth={1}>
        <ui_form.FormInputErrorCheck
          error={{"message":"Error"}}
          fieldState={{"isTouched":true,"invalid":true}}
          focused={false}/>
      </T.View>
      <T.Text>{"Success State:"}</T.Text>
      <T.View position="relative" height={40} width={40} borderWidth={1}>
        <ui_form.FormInputErrorCheck
          error={{}}
          fieldState={{"isDirty":true,"invalid":false}}
          focused={false}/>
      </T.View>
    </T.YStack>);
}

// sznui.lib.component.ui-form-test/Test_FormInputErrorTag [142] 
export function Test_FormInputErrorTag(){
  return (
    <T.YStack gap="$4" height={100}>
      <T.View position="relative" height={60} width={300} borderWidth={1}>
        <ui_form.FormInputErrorTag error={{"message":"Field required"}} focused={true}/>
      </T.View>
    </T.YStack>);
}

// sznui.lib.component.ui-form-test/Test_FormInputRender [157] 
export function Test_FormInputRender(){
  let {control} = hook_form.useFormBase();
  return (
    <hook_form.FormController
      control={control}
      name="render_test"
      render={function ({field,fieldState,formState}){
          return (
            <ui_form.FormInputRender
              input={{"field":field,"fieldState":fieldState,"formState":formState}}
              placeholder="Render Input"
              title="Render Test"/>);
        }}/>);
}

export default Metadata