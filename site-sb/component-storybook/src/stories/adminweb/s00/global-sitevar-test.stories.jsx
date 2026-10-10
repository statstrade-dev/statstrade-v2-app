import React from 'react'

import * as T from 'tamagui'

// statstrade-adminweb.a07-super.s00.global-sitevar-test/Metadata [13] 
const Metadata = {title:"Admin/Global/Configuration",tags:["autodoc"]};

// statstrade-adminweb.a07-super.s00.global-sitevar-test/Test_GlobalSectionEditor [77] 
export function Test_GlobalSectionEditor(){
  let [value,setValue] = React.useState("{\"enabled\":true,\"mode\":\"live\"}");
  let [reason,setReason] = React.useState("Routine configuration update");
  return (
    <T.YStack gap="$3" padding="$4" width={640}>
      <T.Text fontSize="$5" fontWeight="700">Global configuration</T.Text>
      <T.XStack gap="$2" alignItems="center">
        <T.Text fontWeight="600">Compute</T.Text>
        <T.Text fontFamily="monospace" color="$color10">revision 3 · registered</T.Text>
      </T.XStack>
      <T.TextArea
        value={value}
        onChangeText={setValue}
        minHeight={180}
        fontFamily="monospace"/>
      <T.Input
        value={reason}
        onChangeText={setReason}
        placeholder="Reason for this change"/>
      <T.XStack gap="$2" flexWrap="wrap">
        <T.Button>Save</T.Button>
        <T.Button chromeless={true}>Reset</T.Button>
        <T.Button backgroundColor="$color3">Publish compute</T.Button>
      </T.XStack>
    </T.YStack>);
}

export default Metadata