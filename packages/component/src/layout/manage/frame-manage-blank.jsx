import React from 'react'

import * as T from 'tamagui'

import * as ui_manage from '@statstrade/component/ui-manage.jsx'

import * as context_manager from '@statstrade/component/layout/manage/context-manage.jsx'

// statsui.basic.layout.manage.frame-manage-blank/FrameManageBlank [13] 
export function FrameManageBlank(){
  let {controls} = React.useContext(context_manager.LayoutManageContext);
  return (
    <T.YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      padding="$6">
      <ui_manage.ScreenHeader
        title="Welcome to Statstrade"
        description="You don't have any organizations yet. Create one to get started."
        controls={(
            <ui_manage.CreateButton
              label="Create Organisation"
              onPress={function (){
                  controls.setShowCreateOrg(true);
                }}/>)}/>
    </T.YStack>);
}