import * as T from 'tamagui'

import * as layout_super from '@statstrade/component/layout/layout-super.jsx'

import * as logo from '@statstrade/component/logo/logo-statstrade.jsx'

// statsui.basic.layout.layout-admin/AdminNavButton [11] 
export function AdminNavButton({item,active,onSelect}){
  return (
    <T.Button
      onPress={function (){
          onSelect(item.key);
        }}
      pressStyle={{"backgroundColor":"$color4"}}
      key={item.key}
      borderRadius="$2"
      paddingHorizontal="$3"
      hoverStyle={{"backgroundColor":"$color3"}}
      chromeless={true}
      justifyContent="flex-start"
      backgroundColor={active ? "$color3" : "transparent"}
      height={36}>
      <T.Text
        fontSize="$3"
        fontWeight={active ? "600" : "400"}
        color="$color12">{item.label}
      </T.Text>
    </T.Button>);
}

// statsui.basic.layout.layout-admin/AdminSidebar [34] 
export function AdminSidebar({items,active,onSelect}){
  return (
    <T.YStack
      width={220}
      minWidth={220}
      padding="$3"
      gap="$2"
      borderRightWidth={1}
      borderRightColor="$color4"
      backgroundColor="$background">
      <T.XStack
        alignItems="center"
        gap="$2"
        paddingHorizontal="$2"
        paddingVertical="$3">
        <logo.LogoStatstrade size={28}/>
        <T.Text fontSize="$4" fontWeight="700">STATSTRADE</T.Text>
      </T.XStack>
      <T.YStack gap="$1">
        {items.map(function (item){
          return (
            <AdminNavButton item={item} active={active == item.key} onSelect={onSelect}/>);
        })}
      </T.YStack>
    </T.YStack>);
}

// statsui.basic.layout.layout-admin/AdminHeader [65] 
export function AdminHeader({title}){
  return (
    <T.XStack
      height={56}
      paddingHorizontal="$5"
      alignItems="center"
      borderBottomWidth={1}
      borderBottomColor="$color4"
      backgroundColor="$background"><T.H4 fontWeight="600">{title || "Admin"}</T.H4>
    </T.XStack>);
}

// statsui.basic.layout.layout-admin/AdminLayoutFrame [80] 
export function AdminLayoutFrame({children,navigation,active,onNavigate,title}){
  return (
    <layout_super.LayoutSuper>
      <T.XStack flex={1} minHeight="100%" backgroundColor="$background">
        <AdminSidebar
          items={navigation || []}
          active={active}
          onSelect={onNavigate}/>
        <T.YStack flex={1} minWidth={0}>
          <AdminHeader title={title}/>
          <T.YStack flex={1} padding="$5" gap="$4" overflow="auto">{children}</T.YStack>
        </T.YStack>
      </T.XStack>
    </layout_super.LayoutSuper>);
}

// statsui.basic.layout.layout-admin/LayoutAdmin [106] 
export function LayoutAdmin({children,navigation,active,onNavigate,title}){
  return (
    <AdminLayoutFrame
      children={children}
      onNavigate={onNavigate}
      navigation={navigation}
      title={title}
      active={active}/>);
}