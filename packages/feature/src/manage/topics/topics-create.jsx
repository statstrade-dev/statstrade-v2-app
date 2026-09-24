import 
  {ArrowLeft,Calendar,Check,Circle,CircleDashed,DollarSign,Info,Plus,Sparkles,X}
 from '@tamagui/lucide-icons'

import * as T from 'tamagui'

import React from 'react'

import * as topic_preview from '@statstrade/component/topic-preview.jsx'

import * as common from '@statstrade/feature/manage/topics/topics-common.jsx'

import * as ui_form from '@statstrade/component/ui-form.jsx'

import * as context_manage from '@statstrade/component/layout/manage/context-manage.jsx'

// statstrade-web.feature.manage.topics.topics-create/AIButton [16] 
export function AIButton({label,onPress}){
  return (
    <T.Button
      size="$2"
      chromeless={true}
      color="$purple10"
      onPress={onPress}
      icon={Sparkles}>{label || "AI Generate"}
    </T.Button>);
}

// statstrade-web.feature.manage.topics.topics-create/OutcomeItem [23] 
export function OutcomeItem({onDelete,text}){
  return (
    <T.XStack
      backgroundColor="$color2"
      padding="$3"
      borderRadius="$3"
      alignItems="center"
      justifyContent="space-between">
      <T.Text color="$color12" fontSize="$3">{text}</T.Text>
      <T.Button
        size="$2"
        chromeless={true}
        icon={X}
        color="$color10"
        onPress={onDelete}/>
    </T.XStack>);
}

// statstrade-web.feature.manage.topics.topics-create/TopicForm [30] 
export function TopicForm({onCancel,onFinish}){
  let context = React.useContext(common.TopicsContext);
  let {api,forms} = context;
  let [outcomes,setOutcomes] = React.useState([{"id":"1","text":"Yes"},{"id":"2","text":"No"}]);
  let [tags,setTags] = React.useState(["Tech","Product"]);
  let form = forms.topic_create;
  let {control,handleSubmit,setValue,watch} = form;
  let title = watch("title");
  let description = watch("description");
  let genDescription = function (){
    setValue(
      "description",
      "Will the new product launch reach > 10k users in the first week?"
    );
  };
  return (
    <T.XStack flex={1} gap="$6" padding="$6" backgroundColor="$color1">
      <T.YStack flex={1} gap="$6" maxWidth={800}>
        {context_manage.useTopBar((
          <T.XStack alignItems="center" gap="$4">
            <T.Button
              chromeless={true}
              size="$3"
              circular={true}
              icon={ArrowLeft}
              onPress={onCancel}/>
            <T.Text fontSize="$5" fontWeight="600" color="$color12">Create New Topic</T.Text>
          </T.XStack>),[])}
        <T.Card
          bordered={true}
          padding="$5"
          gap="$5"
          backgroundColor="$color2">
          <T.H4 color="$color12" fontSize="$4" fontWeight="600">Topic Details</T.H4>
          <ui_form.FormInput
            control={control}
            field="title"
            title="Title *"
            placeholder="e.g., Will we hit 10k users?"/>
          <T.YStack gap="$2" zIndex={10}>
            <T.XStack justifyContent="space-between" alignItems="center">
              <T.Text fontSize="$3" fontWeight="600" color="$color12" marginLeft={5}>Description *</T.Text>
              <AIButton onPress={genDescription}/>
            </T.XStack>
            <ui_form.FormInput
              control={control}
              field="description"
              component={T.TextArea}
              hideTitle={true}
              placeholder="Describe the resolution criteria..."
              numberOfLines={4}/>
          </T.YStack>
          <ui_form.FormInput
            control={control}
            field="endDate"
            title="End Date *"
            placeholder="dd/mm/yyyy"
            iconAfter={Calendar}/>
        </T.Card>
        <T.Card
          bordered={true}
          padding="$5"
          gap="$4"
          backgroundColor="$color2">
          <T.XStack justifyContent="space-between" alignItems="center">
            <T.H4 color="$color12" fontSize="$4" fontWeight="600">Outcomes</T.H4>
            <T.Button size="$2" theme="blue" icon={Plus}>Add Outcome</T.Button>
          </T.XStack>
          <T.YStack gap="$3">
            {outcomes.map(function (obj){
              (
                <OutcomeItem
                  key={obj.id}
                  text={obj.text}
                  onDelete={function (){
                      console.log("delete");
                    }}/>);
            })}
          </T.YStack>
        </T.Card>
      </T.YStack>
      <T.YStack width={320} gap="$4" marginTop={60}>
        <T.Text
          fontSize="$3"
          fontWeight="600"
          color="$color11"
          marginBottom="$2">Preview
        </T.Text>
        <topic_preview.TopicPreview title={title} description={description}/>
        <T.Button
          theme="blue"
          size="$4"
          icon={CircleDashed}
          onPress={handleSubmit(function (data){
              if(onFinish){
                onFinish(data);
              }
            })}>Create Topic
        </T.Button>
        <T.Button
          chromeless={true}
          color="$color11"
          onPress={function (){
              if(onCancel){
                onCancel();
              }
            }}>Cancel
        </T.Button>
      </T.YStack>
    </T.XStack>);
}