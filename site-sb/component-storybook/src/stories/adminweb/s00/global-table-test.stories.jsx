import React from 'react'

import * as T from 'tamagui'

// statstrade-adminweb.a07-super.s00.global-table-test/Metadata [12] 
const Metadata = {title:"Admin/Global/Table",tags:["autodoc"]};

// statstrade-adminweb.a07-super.s00.global-table-test/Test_ExtTableRows [28] 
export function Test_ExtTableRows(){
  let [empty,setEmpty] = React.useState(false);
  let rows = [
    {"id":"AU","title":"Australia","code":"AU"},
    {"id":"JP","title":"Japan","code":"JP"}
  ];
  return (
    <T.YStack gap="$3" padding="$4" width={640}>
      <T.XStack alignItems="center" justifyContent="space-between">
        <T.Text fontSize="$5" fontWeight="700">Table rows</T.Text>
        <T.Button
          size="$2"
          chromeless={true}
          onPress={function (){
              setEmpty(!empty);
            }}>{empty ? "Show records" : "Show empty state"}
        </T.Button>
      </T.XStack>
      {empty ? (
        <T.Text color="$color10" padding="$3">No records found.</T.Text>) : rows.map(function (row){
        return (
          <T.YStack
            key={row["id"]}
            gap="$1"
            padding="$3"
            borderBottomWidth={1}
            borderColor="$color4">
            <T.Text fontWeight="600">{row["title"]}</T.Text>
            <T.Text fontFamily="monospace">{JSON.stringify(row)}</T.Text>
          </T.YStack>);
      })}
    </T.YStack>);
}

export default Metadata