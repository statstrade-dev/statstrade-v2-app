import React from 'react'

import * as T from 'tamagui'

// statstrade-adminweb.a07-super.s00-global-test/Metadata [13] 
const Metadata = {title:"Admin/Global",tags:["autodoc"]};

// statstrade-adminweb.a07-super.s00-global-test/Test_GlobalAdminNavigation [49] 
export function Test_GlobalAdminNavigation(){
  let [active,setActive] = React.useState("Global");
  let sections = ["Global","Commodity","Country","Token"];
  return (
    <T.YStack gap="$3" padding="$4" width={640}>
      <T.Text fontSize="$6" fontWeight="700">Global administration</T.Text>
      <T.XStack gap="$2" flexWrap="wrap">
        {sections.map(function (label){
          return (
            <T.Button
              key={label}
              chromeless={true}
              backgroundColor={(active == label) ? "$color3" : "transparent"}
              onPress={function (){
                  setActive(label);
                }}>{label}
            </T.Button>);
        })}
      </T.XStack>
      <T.YStack
        gap="$2"
        padding="$3"
        backgroundColor="$color2"
        borderRadius="$3">
        <T.Text fontWeight="600">{active}</T.Text>
        <T.Text fontFamily="monospace">
          {(active == "Global") ? "compute · revision 3 · registered" : ((active == "Commodity") ? "Commodity · USD · EUR" : ((active == "Country") ? "Country · Australia · Japan" : "Token · STAT · ETH"))}
        </T.Text>
        <T.Text color="$color10">Global changes require an actor, revision, and reason.</T.Text>
      </T.YStack>
    </T.YStack>);
}

export default Metadata