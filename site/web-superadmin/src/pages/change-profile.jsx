'use client'

import * as T from 'tamagui'

import * as layout_super from '@statstrade/component/layout/layout-super.jsx'

import * as profile from '@statstrade/component/element/element-change-profile.jsx'

// statstrade-superadmin.pages.change-profile/Page [15] 
function Page(){
  return (
    <layout_super.LayoutSuper>
      <T.YStack
        width="100%"
        maxWidth={840}
        marginHorizontal="auto"
        padding="$5"
        gap="$5"
        $sm={{"padding":"$3"}}>
        <T.Anchor href="/" fontSize="$3" color="$color10">← Back to dashboard</T.Anchor>
        <T.YStack gap="$2">
          <T.Text fontSize="$2" letterSpacing={2} color="$color10">ACCOUNT SETTINGS</T.Text>
          <T.H2 fontWeight="600">Change Profile</T.H2>
          <T.Text color="$color10">Manage your personal details and sign-in email.</T.Text>
        </T.YStack>
        <profile.ProfileEditor/>
      </T.YStack>
    </layout_super.LayoutSuper>);
}

export default Page