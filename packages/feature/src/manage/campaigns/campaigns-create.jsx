import 
  {ArrowLeft,Calendar,Check,Circle,CircleDashed,DollarSign,Image,Info,Plus,Sparkles,X}
 from '@tamagui/lucide-icons'

import * as T from 'tamagui'

import React from 'react'

import * as kd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as preview from '@statstrade/feature/manage/campaigns/campaigns-preview.jsx'

import * as ui_image from '@statstrade/component/ui-image.jsx'

import * as common from '@statstrade/feature/manage/campaigns/campaigns-common.jsx'

import * as ui_form from '@statstrade/component/ui-form.jsx'

import * as api_general from '@statstrade/edge/remote/api-general.jsx'

import * as context_manage from '@statstrade/component/layout/manage/context-manage.jsx'

// statstrade-web.feature.manage.campaigns.campaigns-create/AIButton [25] 
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

// statstrade-web.feature.manage.campaigns.campaigns-create/ObjectiveItem [32] 
export function ObjectiveItem({onDelete,text}){
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

// statstrade-web.feature.manage.campaigns.campaigns-create/TagItem [39] 
export function TagItem({onDelete,text}){
  return (
    <T.XStack
      backgroundColor="$color3"
      paddingHorizontal="$3"
      paddingVertical="$2"
      borderRadius="$full"
      alignItems="center"
      gap="$2">
      <T.Text color="$color11" fontSize="$3">{text}</T.Text>
      <T.Button
        size="$1"
        chromeless={true}
        icon={X}
        color="$color10"
        onPress={onDelete}/>
    </T.XStack>);
}

// statstrade-web.feature.manage.campaigns.campaigns-create/CampaignForm [46] 
export function CampaignForm({onCancel,onFinish}){
  let ctx = React.useContext(common.CampaignsContext);
  let {api,forms} = ctx;
  let [objectives,setObjectives] = React.useState([{"id":"1","text":"Objective 1"}]);
  let [tags,setTags] = React.useState(["tag-name"]);
  let [showPreview,setShowPreview] = React.useState(false);
  let form = forms.campaign_create;
  let {control,handleSubmit,setValue,watch} = form;
  let title = watch("title");
  let description = watch("description");
  let genDescription = function (){
    setValue(
      "description",
      "Targeting 20% growth in user acquisition through gamified prediction markets involving our upcoming Q4 product launch."
    );
  };
  let [iconImage,setIconImage] = React.useState(null);
  let [coverImage,setCoverImage] = React.useState(null);
  let [backgroundImage,setBackgroundImage] = React.useState(null);
  let createImageHandler = function (setter){
    return async function (image){
      setter(image);
      if(image){
        try{
          let fileName = "campaigns/" + Date.now() + "_" + Math.floor(Math.random() * 1000) + ".jpg";
          let {data,error} = await api_general.upload_image({"image":image,"file_path":fileName,"bucket":"images"});
          if(error){
            throw error;
          }
          setter({"uri":data});
        }
        catch(e){
          console.error("Upload failed",e);
          alert("Failed to upload image");
        }
      }
    };
  };
  let handleIcon = React.useMemo(function (){
    createImageHandler(setIconImage);
  },[]);
  let handleCover = React.useMemo(function (){
    createImageHandler(setCoverImage);
  },[]);
  let handleBackground = React.useMemo(function (){
    createImageHandler(setBackgroundImage);
  },[]);
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
            <T.Text fontSize="$5" fontWeight="600" color="$color12">Create New Campaign</T.Text>
          </T.XStack>),[])}
        <T.Card
          bordered={true}
          padding="$5"
          gap="$5"
          backgroundColor="$color2">
          <T.H4 color="$color12" fontSize="$4" fontWeight="600">Basic Information</T.H4>
          <ui_form.FormInput
            control={control}
            field="title"
            title="Campaign Title *"
            placeholder="e.g., Q4 Product Launch"
            onChangeText={function (t){
                setValue("title",t);
                setValue("name",t.toLowerCase().replace(/\s+/,"-"));
              }}/>
          <ui_form.FormInput
            control={control}
            field="name"
            title="Campaign Name (ID)"
            editable={false}
            placeholder="auto-generated-slug"
            backgroundColor="$color3"
            color="$color10"/>
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
              placeholder="Describe your campaign's goals and strategy..."
              numberOfLines={4}/>
          </T.YStack>
          <T.XStack gap="$4">
            <ui_form.FormInput
              viewProps={{"flex":1}}
              control={control}
              field="startX"
              title="Start Date *"
              placeholder="dd/mm/yyyy"
              iconAfter={Calendar}/>
            <ui_form.FormInput
              viewProps={{"flex":1}}
              control={control}
              field="endX"
              title="End Date *"
              placeholder="dd/mm/yyyy"
              iconAfter={Calendar}/>
          </T.XStack>
          <ui_form.FormInput
            control={control}
            field="budget"
            title="Total Budget"
            placeholder="50000"
            iconBefore={DollarSign}/>
        </T.Card>
        <T.Card
          bordered={true}
          padding="$5"
          gap="$5"
          backgroundColor="$color2">
          <T.H4 color="$color12" fontSize="$4" fontWeight="600">Branding & Images</T.H4>
          <T.XStack gap="$4" flexWrap="wrap">
            <T.YStack flex={1} gap="$2" minWidth={120}>
              <T.Text fontSize="$3" fontWeight="600" color="$color12" marginLeft={5}>Icon</T.Text>
              <ui_image.ImageUpload
                width={100}
                height={100}
                borderRadius={20}
                image={iconImage}
                onImageSelected={handleIcon}
                icon={Image}
                color="$purple10"/>
            </T.YStack>
            <T.YStack flex={1} gap="$2" minWidth={200}>
              <T.Text fontSize="$3" fontWeight="600" color="$color12" marginLeft={5}>Cover Image (2:1)</T.Text>
              <ui_image.ImageUpload
                width={200}
                height={100}
                borderRadius={10}
                aspect={[2,1]}
                image={coverImage}
                onImageSelected={handleCover}
                icon={Image}
                color="$purple10"/>
            </T.YStack>
            <T.YStack flex={1} gap="$2" minWidth={200}>
              <T.Text fontSize="$3" fontWeight="600" color="$color12" marginLeft={5}>Background (16:9)</T.Text>
              <ui_image.ImageUpload
                width={200}
                height={112}
                borderRadius={10}
                aspect={[16,9]}
                image={backgroundImage}
                onImageSelected={handleBackground}
                icon={Image}
                color="$purple10"/>
            </T.YStack>
          </T.XStack>
        </T.Card>
        <T.Card
          bordered={true}
          padding="$5"
          gap="$4"
          backgroundColor="$color2">
          <T.XStack justifyContent="space-between" alignItems="center">
            <T.H4 color="$color12" fontSize="$4" fontWeight="600">Campaign Objectives</T.H4>
            <T.XStack gap="$2">
              <AIButton label="AI Suggest"/>
              <T.Button
                size="$2"
                theme="blue"
                icon={Plus}
                onPress={function (){
                    setObjectives(function (prev){
                      return [...prev,{"id":Date.now(),"text":"New Objective"}];
                    });
                  }}>Add Objective
              </T.Button>
            </T.XStack>
          </T.XStack>
          <T.YStack gap="$3">
            {objectives.map(function (obj){
              (
                <ObjectiveItem
                  key={obj.id}
                  text={obj.text}
                  onDelete={function (){
                      setObjectives(function (prev){
                        return prev.filter(function (o){
                          f_eq_eq(o.id,obj.id);
                        });
                      });
                    }}/>);
            })}
          </T.YStack>
        </T.Card>
        <T.Card
          bordered={true}
          padding="$5"
          gap="$4"
          backgroundColor="$color2">
          <T.XStack justifyContent="space-between" alignItems="center">
            <T.H4 color="$color12" fontSize="$4" fontWeight="600">Tags</T.H4>
            <T.XStack gap="$2">
              <AIButton label="AI Suggest"/>
              <T.Button
                size="$2"
                theme="blue"
                icon={Plus}
                onPress={function (){
                    setTags(function (prev){
                      return [...prev,"New Tag"];
                    });
                  }}>Add Tag
              </T.Button>
            </T.XStack>
          </T.XStack>
          <T.Text fontSize="$3" color="$color10">Tags help organize and filter campaigns</T.Text>
          <T.XStack gap="$3" flexWrap="wrap">
            {tags.map(function (tag,i){
              (
                <TagItem
                  key={tag + i}
                  text={tag}
                  onDelete={function (){
                      setTags(function (prev){
                        return prev.filter(function (t){
                          f_eq_eq(t,tag);
                        });
                      });
                    }}/>);
            })}
          </T.XStack>
        </T.Card>
        <T.Button
          theme="blue"
          size="$4"
          icon={CircleDashed}
          onPress={handleSubmit(function (data){
              let finalData = kd.obj_assign(data,{
                "icon":iconImage && iconImage.uri,
                "cover":coverImage && coverImage.uri,
                "background":backgroundImage && backgroundImage.uri
              });
              if(onFinish){
                onFinish(finalData);
              }
            })}>Create Campaign
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
      <T.YStack width={320} gap="$4" marginTop={60}>
        <T.Text
          fontSize="$3"
          fontWeight="600"
          color="$color11"
          marginBottom="$2">Preview
        </T.Text>
        <T.View
          onPress={function (){
              setShowPreview(true);
            }}
          cursor="pointer">
          <preview.CampaignPreview title={title} description={description} mode="small"/>
        </T.View>
        <T.Dialog modal={true} open={showPreview} onOpenChange={setShowPreview}>
          <T.Dialog.Portal>
            <T.Dialog.Overlay
              key="overlay"
              animation="quick"
              opacity={0.5}
              enterStyle={{"opacity":0}}
              exitStyle={{"opacity":0}}/>
            <T.Dialog.Content
              bordered={true}
              elevate={true}
              key="content"
              animation="quick"
              width={900}
              maxWidth="90%"
              backgroundColor="transparent"
              padding={0}>
              <preview.CampaignPreview title={title} description={description} mode="full"/>
            </T.Dialog.Content>
          </T.Dialog.Portal>
        </T.Dialog>
        <T.Card
          bordered={true}
          padding="$4"
          backgroundColor="transparent"
          borderColor="$purple5"
          borderWidth={1}>
          <T.XStack gap="$3" marginBottom="$2">
            <Info size={16} color="$purple10"/>
            <T.Text color="$purple10" fontWeight="600" fontSize="$3">Campaign Best Practices</T.Text>
          </T.XStack>
          <T.YStack gap="$2" paddingLeft={20}>
            <T.Text color="$color11" fontSize={11}>• Set clear, measurable objectives</T.Text>
            <T.Text color="$color11" fontSize={11}>• Choose realistic date ranges</T.Text>
            <T.Text color="$color11" fontSize={11}>• Group related markets together</T.Text>
            <T.Text color="$color11" fontSize={11}>• Use descriptive tags for organization</T.Text>
          </T.YStack>
        </T.Card>
      </T.YStack>
    </T.XStack>);
}