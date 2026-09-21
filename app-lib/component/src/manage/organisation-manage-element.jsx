import 
  {Activity,BookOpen,Building2,ChevronDown,Cpu,DollarSign,FlaskConical,Gamepad2,ImageUp,Music,Palette,Pencil,Plane,Utensils}
 from '@tamagui/lucide-icons'

import * as T from 'tamagui'

import * as ui_form from '@statstrade/component/ui-form'

import * as ui from '@statstrade/component/ui-common'

import * as ui_image from '@statstrade/component/ui-image'

// statsui.basic.manage.organisation-manage-element/organisationCategories [16] 
export var organisationCategories = [
  {"id":"tech","label":"Technology","icon":Cpu},
  {"id":"finance","label":"Finance","icon":DollarSign},
  {"id":"art","label":"Art","icon":Palette},
  {"id":"music","label":"Music","icon":Music},
  {"id":"gaming","label":"Gaming","icon":Gamepad2},
  {"id":"education","label":"Education","icon":BookOpen},
  {"id":"health","label":"Health","icon":Activity},
  {"id":"science","label":"Science","icon":FlaskConical},
  {"id":"travel","label":"Travel","icon":Plane},
  {"id":"food","label":"Food","icon":Utensils}
];

// statsui.basic.manage.organisation-manage-element/OrganisationItem [28] 
export function OrganisationItem({org,existingOrg,onEdit,onSelect,onDelete}){
  let isSelected = existingOrg && (existingOrg.id == org.id);
  return (
    <T.XStack
      alignItems="center"
      justifyContent="center"
      position="relative">
      {isSelected ? (
        <ui.Tooltip content="Edit Organisation" placement="left">
          <T.Button
            animation="quick"
            color="white"
            onPress={function (e){
                e.stopPropagation();
                onEdit(org);
              }}
            pressStyle={{"backgroundColor":"$purple11","scale":0.9}}
            icon={Pencil}
            hoverStyle={{"backgroundColor":"$purple12","scale":1.1}}
            size="$5"
            position="absolute"
            backgroundColor="$purple10"
            left="-60px"/>
        </ui.Tooltip>) : null}
      <T.XStack
        animation="bouncy"
        onPress={function (){
            onSelect(org);
          }}
        pressStyle={{"scale":0.98}}
        borderRadius="$4"
        scale={isSelected ? 1.02 : 1}
        borderColor={isSelected ? "$purple10" : "$borderColor"}
        flex={1}
        hoverStyle={{
            "borderColor":isSelected ? "$purple11" : "$color8",
            "cursor":"pointer"
          }}
        borderWidth={2}
        justifyContent="center"
        padding="$3"
        position="relative"
        backgroundColor="$color2"
        minHeight={60}
        alignItems="center">
        <T.Avatar circular={true} size="$2" left="$3" position="absolute">
          <T.AvatarImage src={org.picture_url}/>
          <T.AvatarFallback backgroundColor={ui.getColor(org.name)}/>
        </T.Avatar>
        <T.YStack alignItems="center" justifyContent="center">
          <T.XStack alignItems="center" gap="$2">
            <T.Text fontWeight="600" fontSize="$4" textAlign="center">{org.name}</T.Text>
            {((org.tier == "pro") || (org.tier == "standard") || (org.tier == "enterprise") || (org.tier == "partner")) ? (
              <T.View
                backgroundColor="$purple9"
                paddingHorizontal="$1.5"
                paddingVertical="$0.5"
                borderRadius="$1">
                <T.Text color="white" fontSize={9} fontWeight="bold">{"PRO"}</T.Text>
              </T.View>) : null}
          </T.XStack>
          <T.XStack
            gap="$1"
            marginTop="$1"
            flexWrap="wrap"
            justifyContent="center"
            maxWidth={200}>
            {(org.tags || []).map(function (tagId){
              let cat = organisationCategories.find(function (c){
                c.id == tagId;
              });
              if(cat){
                (
                  <T.View
                    key={tagId}
                    backgroundColor="$color4"
                    borderRadius="$2"
                    paddingHorizontal="$1.5"
                    paddingVertical="$0.5"><T.Text fontSize={10} color="$color11">{cat.label}</T.Text>
                  </T.View>);
              }
            })}
          </T.XStack>
        </T.YStack>
      </T.XStack>
    </T.XStack>);
}

// statsui.basic.manage.organisation-manage-element/OrganisationList [93] 
export function OrganisationList({orgs,existingOrg,onSelect,onEdit,onProceed,onSkip,onCreateNew}){
  let isNewSelected = existingOrg && (existingOrg.id == "new");
  return (
    <T.YStack gap="$4" width="100%" maxWidth={450} alignSelf="center">
      {orgs.map(function (org){
        return (
          <OrganisationItem
            key={org.id}
            org={org}
            existingOrg={existingOrg}
            onEdit={onEdit}
            onSelect={onSelect}/>);
      })}
      <T.XStack
        animation="quick"
        onPress={onCreateNew}
        pressStyle={{"scale":0.98}}
        borderRadius="$4"
        scale={isNewSelected ? 1.02 : 1}
        borderColor={isNewSelected ? "$purple10" : "$borderColor"}
        hoverStyle={{
            "borderColor":isNewSelected ? "$purple10" : "$color8",
            "cursor":"pointer"
          }}
        borderWidth={2}
        justifyContent="center"
        padding="$3"
        backgroundColor={isNewSelected ? "$purple3" : "$color2"}
        minHeight={60}
        height={60}
        alignItems="center">
        <T.XStack gap="$3" alignItems="center">
          <T.Text
            fontWeight="600"
            fontSize="$4"
            color={isNewSelected ? "$purple11" : "$color8"}>{ui.t("Create New Organisation")}
          </T.Text>
        </T.XStack>
      </T.XStack>
      <T.XStack gap="$4" flexDirection="row-reverse" marginTop="$6">
        <ui.ButtonInverse
          flex={4}
          size="$5"
          fontSize="$5"
          color="$purple10"
          disabled={!existingOrg}
          onPress={onProceed}>{ui.t("Next")}
        </ui.ButtonInverse>
        <ui.ButtonNormal
          flex={4}
          size="$5"
          fontSize="$5"
          onPress={onSkip}
          color="$color11"
          backgroundColor="$color1">{ui.t("Skip")}
        </ui.ButtonNormal>
      </T.XStack>
    </T.YStack>);
}

// statsui.basic.manage.organisation-manage-element/OrganisationForm [154] 
export function OrganisationForm({
  form,
  onSubmit,
  onImageSelected,
  isBusy,
  tags,
  toggleTag,
  existingOrg,
  onCancel,
  showBack
}){
  return (
    <T.Form
      onSubmit={form.handleSubmit(onSubmit)}
      width="100%"
      maxWidth={600}
      alignSelf="center"
      flex={1}
      justifyContent="center">
      <T.YStack marginTop="$3" gap="$6" marginHorizontal="$2">
        <ui_image.ImageUpload onImageSelected={onImageSelected} icon={ImageUp}/>
        <ui_form.FormInput
          title={ui.t("Organisation Title")}
          field="title"
          control={form.control}
          autoFocus={true}
          placeholder={ui.t("Enter the organisation title")}
          disabled={isBusy}/>
        <ui_form.FormInput
          title={ui.t("Organisation Id")}
          field="name"
          control={form.control}
          placeholder={ui.t("Enter the unique organisation ID")}
          disabled={isBusy}/>
        <ui_form.FormInput
          title={ui.t("Description")}
          field="description"
          control={form.control}
          placeholder={ui.t("Tell us about your organisation")}
          component={T.TextArea}
          numberOfLines={4}
          disabled={isBusy}/>
        <ui_form.FormTagSelect
          title={ui.t("Tags")}
          options={organisationCategories}
          selected={tags}
          onToggle={toggleTag}/>
        <T.XStack flexDirection="row-reverse" gap="$4" marginTop="$6">
          <T.FormTrigger asChild={true} borderWidth={0}>
            {(existingOrg && (existingOrg.id != "new")) ? (
              <ui.ButtonInverse
                flex={2}
                size="$5"
                fontSize="$5"
                color="$purple10"
                icon={isBusy ? (function (){
                    return (
                      <T.Spinner/>);
                  }) : null}
                disabled={isBusy || !form.formState.isValid}>{isBusy ? "" : ui.t("Next")}
              </ui.ButtonInverse>) : (
              <ui.ButtonInverse
                flex={2}
                size="$5"
                fontSize="$5"
                color="$purple10"
                icon={isBusy ? (function (){
                    return (
                      <T.Spinner/>);
                  }) : null}
                disabled={isBusy || !form.formState.isValid}>{isBusy ? "" : ui.t("Create")}
              </ui.ButtonInverse>)}
          </T.FormTrigger>
          {(showBack || onCancel) ? (
            <ui.ButtonNormal
              flex={1}
              size="$5"
              fontSize="$5"
              onPress={onCancel}
              color="$color11"
              backgroundColor="$color1">{ui.t("Back")}
            </ui.ButtonNormal>) : null}
        </T.XStack>
      </T.YStack>
    </T.Form>);
}