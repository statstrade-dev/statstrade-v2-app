import {ArrowLeft,BarChart3,ChevronDown,Plus} from '@tamagui/lucide-icons'

import React from 'react'

import * as T from 'tamagui'

// statsui.basic.ui-manage/ManagerScreenHeader [10] 
export function ManagerScreenHeader({actionIcon,children,onAction,rightContent,title}){
  let Icon = actionIcon || Plus;
  return (
    <T.XStack justifyContent="space-between" alignItems="center" flex={1}>
      <T.XStack alignItems="center" gap="$3">
        {onAction ? (
          <T.Button
            size="$3"
            circular={true}
            chromeless={true}
            icon={Icon}
            hoverStyle={{"backgroundColor":"$color3"}}
            onPress={onAction}/>) : null}
        <T.Text fontSize="$5" fontWeight="600" color="$color12">{title}</T.Text>
        {children ? (
          <React.Fragment>
            <T.View
              width={1}
              height={16}
              backgroundColor="$color6"
              marginHorizontal="$2"/>
            {children}
          </React.Fragment>) : null}
      </T.XStack>
      {rightContent ? rightContent : null}
    </T.XStack>);
}

// statsui.basic.ui-manage/ScreenHeader [34] 
export function ScreenHeader({children,controls,description,onBack,title}){
  return (
    <T.YStack marginBottom="$6">
      <T.XStack justifyContent="space-between" alignItems="center">
        <T.XStack gap="$4" alignItems="center">
          {onBack ? (
            <T.Button
              chromeless={true}
              padding={0}
              width={40}
              height={40}
              borderRadius="$full"
              hoverStyle={{"backgroundColor":"$color4"}}
              onPress={onBack}><ArrowLeft size={24} color="$color12"/>
            </T.Button>) : null}
          <T.H2
            fontSize="$8"
            fontWeight="800"
            letterSpacing="$0"
            color="$color12">{title}
          </T.H2>
          {controls}
        </T.XStack>
        {children}
      </T.XStack>
      {description ? (
        <T.Text fontSize="$4" color="$color11" marginTop="$2">{description}</T.Text>) : null}
    </T.YStack>);
}

// statsui.basic.ui-manage/SearchBar [58] 
export function SearchBar({placeholder,value,onChangeText,...props}){
  return (
    <T.Input
      placeholderTextColor="$color10"
      placeholder={placeholder}
      onChangeText={onChangeText}
      borderColor="$borderColor"
      value={value}
      flex={1}
      borderWidth={1}
      size="$4"
      backgroundColor="$color2"
      {...props}/>);
}

// statsui.basic.ui-manage/FilterSelect [74] 
export function FilterSelect({placeholder,value,onValueChange,options,...props}){
  return (
    <T.Select
      size="$4"
      value={value}
      onValueChange={onValueChange}
      {...props}>
      <T.Select.Trigger width={140} iconAfter={ChevronDown}><T.Select.Value placeholder={placeholder}/></T.Select.Trigger>
      <T.Select.Content zIndex={100000}>
        <T.Select.Viewport>
          {options.map(function (item,i){
            return (
              <T.Select.Item index={i} key={item.value} value={item.value}><T.Select.ItemText>{item.label}</T.Select.ItemText></T.Select.Item>);
          })}
        </T.Select.Viewport>
      </T.Select.Content>
    </T.Select>);
}

// statsui.basic.ui-manage/CreateButton [93] 
export function CreateButton({onPress,label,...props}){
  return (
    <T.Button
      theme="blue"
      size="$4"
      icon={Plus}
      fontWeight="600"
      animation="quick"
      pressStyle={{"scale":0.97}}
      onPress={onPress}
      {...props}>{label}
    </T.Button>);
}

// statsui.basic.ui-manage/StatCard [108] 
export function StatCard({color,icon,label,value}){
  let Icon = icon || BarChart3;
  return (
    <T.Card
      bordered={true}
      padding="$4"
      borderRadius="$4"
      backgroundColor="$color2"
      flex={1}
      minWidth={200}>
      <T.XStack justifyContent="space-between" alignItems="flex-start">
        <T.YStack>
          <T.Text fontSize="$2" color="$color11" fontWeight="500">{label}</T.Text>
          <T.Text fontSize={24} color="$color12" fontWeight="700" marginTop="$2">{value}</T.Text>
        </T.YStack>
        <T.View
          backgroundColor={color}
          padding="$2"
          borderRadius="$full"
          opacity={0.15}><Icon size={18} color={color} opacity={1}/>
        </T.View>
        {(label == "Active") ? (
          <T.View position="absolute" top={0} right={0} padding="$2">
            <T.View
              width={8}
              height={8}
              borderRadius={4}
              backgroundColor="$green10"/>
          </T.View>) : null}
      </T.XStack>
    </T.Card>);
}