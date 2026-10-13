'use client'

import * as T from 'tamagui'

import * as workspace from '@statstrade/web-superadmin/adminweb/workspace.jsx'

import * as layout_base from '@statstrade/component/layout/layout-base.jsx'

// statstrade-superadmin.pages.adminweb.index/Page [14] 
function Page(){
  return (
    <layout_base.LayoutBase showDevtool={true}>
      <workspace.AdminwebShell section="index">
        <T.YStack flex={1} gap="$3" padding="$4">
          <T.Text fontSize="$6" fontWeight="700">Adminweb v2</T.Text>
          <T.Text color="$color10">Choose a section to browse current statstrade-v2 records.</T.Text>
          <T.YStack gap="$2">
            {workspace.ADMINWEB_SECTION_SPECS.map(function (entry){
              return (
                <T.Anchor key={entry["section"]} href={entry["href"]}>
                  <T.XStack alignItems="center" gap="$3">
                    <T.Text fontFamily="monospace" fontSize="$2" color="$color10">{entry["number"]}</T.Text>
                    <T.Text>{entry["index-label"] || entry["label"]}</T.Text>
                  </T.XStack>
                </T.Anchor>);
            })}
          </T.YStack>
        </T.YStack>
      </workspace.AdminwebShell>
    </layout_base.LayoutBase>);
}

export default Page