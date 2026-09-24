import {ArrowLeft,Check,CircleDashed,Coins,Image,Info,Upload} from '@tamagui/lucide-icons'

import * as T from 'tamagui'

import React from 'react'

import * as kd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as ui_image from '@statstrade/component/ui-image.jsx'

import * as ui_form from '@statstrade/component/ui-form.jsx'

import * as common from '@statstrade/feature/manage/tokens/tokens-common.jsx'

import * as api_general from '@statstrade/edge/remote/api-general.jsx'

import * as context_manage from '@statstrade/component/layout/manage/context-manage.jsx'

import * as ks from '@statstrade/edge/lib/xt/lang/common-string.jsx'

// statstrade-web.feature.manage.tokens.tokens-create/TokenPreview [23] 
export function TokenPreview({decimals,mode,name,supply,symbol}){
  let isDark = (mode == "dark") || !mode;
  let bg = isDark ? "black" : "white";
  let fg = isDark ? "white" : "$color12";
  let border = isDark ? "$color5" : "$borderColor";
  return (
    <T.Card
      bordered={true}
      padding="$5"
      backgroundColor={bg}
      borderColor={border}
      animation="quick">
      <T.XStack gap="$4" marginBottom="$6">
        <T.View
          width={48}
          height={48}
          borderRadius="$3"
          backgroundColor="$blue9"
          alignItems="center"
          justifyContent="center"><Coins size={24} color="white"/>
        </T.View>
        <T.YStack>
          <T.Text fontSize="$4" fontWeight="700" color={fg}>{name || "Token Name"}</T.Text>
          <T.Text
            fontSize={11}
            fontWeight="600"
            color="$color11"
            textTransform="uppercase">{symbol || "SYMBOL"}
          </T.Text>
        </T.YStack>
      </T.XStack>
      <T.XStack justifyContent="space-between" marginBottom="$4">
        <T.YStack>
          <T.Text fontSize={10} color="$color11" marginBottom={2}>Supply</T.Text>
          <T.Text fontSize="$3" fontWeight="600" color={fg}>{supply || "0"}</T.Text>
        </T.YStack>
        <T.YStack alignItems="flex-end">
          <T.Text fontSize={10} color="$color11" marginBottom={2}>Decimals</T.Text>
          <T.Text fontSize="$3" fontWeight="600" color={fg}>{decimals || "2"}</T.Text>
        </T.YStack>
      </T.XStack>
      <T.Text fontSize={10} color="$color11" marginBottom={4}>Features</T.Text>
      <T.XStack gap="$2">
        <T.View
          borderWidth={1}
          borderColor="$green9"
          borderRadius={4}
          paddingHorizontal={6}
          paddingVertical={2}
          backgroundColor="rgba(0,0,0,0.2)"><T.Text fontSize={10} color="$green9">Transferable</T.Text>
        </T.View>
        <T.View
          borderWidth={1}
          borderColor="$blue9"
          borderRadius={4}
          paddingHorizontal={6}
          paddingVertical={2}
          backgroundColor="rgba(0,0,0,0.2)"><T.Text fontSize={10} color="$blue9">Mintable</T.Text>
        </T.View>
      </T.XStack>
    </T.Card>);
}

// statstrade-web.feature.manage.tokens.tokens-create/TokenForm [54] 
export function TokenForm({onCancel,onFinish}){
  let ctx = React.useContext(common.TokensContext);
  let {api,forms} = ctx;
  console.log(ctx);
  let form = forms.token_new;
  let {control,handleSubmit,watch} = form;
  let name = watch("name");
  let symbol = watch("symbol");
  let supply = watch("initialSupply");
  let decimals = watch("decimals");
  let themeName = T.useThemeName();
  let defaultMode = String(themeName).startsWith("dark") ? "dark" : "light";
  let [previewMode,setPreviewMode] = React.useState(defaultMode);
  let [iconImage,setIconImage] = React.useState(null);
  let handleIcon = React.useMemo(function (){
    return async function (image){
      setIconImage(image);
      if(image){
        try{
          let fileName = "tokens/" + Date.now() + "_" + Math.floor(Math.random() * 1000) + ".jpg";
          let {data,error} = await api_general.upload_image({"image":image,"file_path":fileName,"bucket":"images"});
          if(error){
            throw error;
          }
          setIconImage({"uri":data});
        }
        catch(e){
          console.error("Upload failed",e);
          alert("Failed to upload image");
        }
      }
    };
  },[]);
  return (
    <T.XStack flex={1} gap="$6" padding="$6" backgroundColor="$color1">
      <T.YStack flex={1} gap="$6" maxWidth={600}>
        {context_manage.useTopBar((
          <T.XStack alignItems="center" gap="$3">
            <T.Button
              chromeless={true}
              size="$3"
              circular={true}
              icon={ArrowLeft}
              onPress={onCancel}/>
            <T.Text
              fontSize="$5"
              fontWeight="600"
              color="$color12"
              onPress={onCancel}
              pressStyle={{"opacity":0.5}}
              cursor="pointer">Tokens
            </T.Text>
            <T.View
              width={1}
              height={16}
              backgroundColor="$color6"
              marginHorizontal="$2"/>
            <T.Text fontSize="$3" fontWeight="600" color="$color11">Create New Token</T.Text>
          </T.XStack>),[])}
        <T.Card padding="$5" gap="$5" backgroundColor="$color2">
          <T.H4 color="$color12" fontSize="$4" fontWeight="600">Basic Information</T.H4>
          <T.XStack gap="$4">
            <ui_form.FormInput
              control={control}
              field="name"
              title="Token Name *"
              placeholder="e.g., TechBrand Points"
              viewProps={{"flex":1}}/>
            <ui_form.FormInput
              control={control}
              field="symbol"
              title="Token Symbol *"
              placeholder="e.g., TBP"
              viewProps={{"flex":1}}/>
          </T.XStack>
          <ui_form.FormInput
            control={control}
            field="description"
            title="Description"
            component={T.TextArea}
            placeholder="Describe your token's purpose..."
            numberOfLines={3}/>
          <T.YStack gap="$3">
            <T.Text fontSize="$3" fontWeight="600" color="$color12" marginLeft={5}>Token Icon</T.Text>
            <T.XStack gap="$4" alignItems="center">
              <ui_image.ImageUpload
                width={80}
                height={80}
                borderRadius={20}
                image={iconImage}
                onImageSelected={handleIcon}
                icon={Image}
                color="$purple10"/>
              <T.YStack gap="$2" justifyContent="center">
                <T.Text fontSize="$3" fontWeight="600" color="$color12">Upload Image</T.Text>
                <T.Text fontSize={11} color="$color10">Recommended: 256x256px, PNG or SVG</T.Text>
              </T.YStack>
            </T.XStack>
          </T.YStack>
        </T.Card>
        <T.Card padding="$5" gap="$5" backgroundColor="$color2">
          <T.H4 color="$color12" fontSize="$4" fontWeight="600">Token Economics</T.H4>
          <T.XStack gap="$4">
            <ui_form.FormInput
              control={control}
              field="initialSupply"
              title="Initial Supply *"
              placeholder="100000"
              viewProps={{"flex":1}}/>
            <ui_form.FormInput
              control={control}
              field="maxSupply"
              title="Maximum Supply"
              placeholder="1000000 (optional)"
              viewProps={{"flex":1}}/>
          </T.XStack>
          <ui_form.FormInput
            control={control}
            field="decimals"
            title="Decimals"
            placeholder="2 (e.g., 10.25)"/>
        </T.Card>
        <T.Button
          theme="blue"
          size="$4"
          icon={CircleDashed}
          onPress={handleSubmit(function (data){
              let finalData = kd.obj_assign(data,{"icon":iconImage && iconImage.uri});
              if(onFinish){
                onFinish(finalData);
              }
            })}>Create Token
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
      <T.YStack width={320} gap="$4">
        <T.XStack
          justifyContent="space-between"
          alignItems="center"
          marginBottom="$2">
          <T.Text fontSize="$3" fontWeight="600" color="$color11">Preview</T.Text>
          <T.XStack alignItems="center" gap="$2">
            <T.Text fontSize={10} color="$color11">{ks.capitalize(previewMode)}</T.Text>
            <T.Switch
              size="$2"
              checked={previewMode == "dark"}
              onCheckedChange={function (c){
                  setPreviewMode(c ? "dark" : "light");
                }}>
              <T.Switch.Thumb animation="quick" backgroundColor="$color12"/>
            </T.Switch>
          </T.XStack>
        </T.XStack>
        <TokenPreview
          name={name}
          symbol={symbol}
          supply={supply}
          decimals={decimals}
          mode={previewMode}/>
        <T.Card
          bordered={true}
          padding="$4"
          backgroundColor="$blue2"
          borderColor="$blue6">
          <T.XStack gap="$3" marginBottom="$2">
            <Info size={18} color="$blue10"/>
            <T.Text fontSize="$3" fontWeight="600" color="$blue11">Token Creation Tips</T.Text>
          </T.XStack>
          <T.YStack gap="$2" marginLeft={26}>
            <T.Text fontSize={11} color="$blue11">• Choose a memorable name and symbol</T.Text>
            <T.Text fontSize={11} color="$blue11">• Set initial supply based on expected users</T.Text>
            <T.Text fontSize={11} color="$blue11">• Consider enabling transfers for flexibility</T.Text>
            <T.Text fontSize={11} color="$blue11">• Mintable tokens allow future growth</T.Text>
          </T.YStack>
        </T.Card>
      </T.YStack>
    </T.XStack>);
}