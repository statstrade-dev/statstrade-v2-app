import * as T from 'tamagui'

// statstrade-adminweb.a07-super.s00.global-region-test/Metadata [12] 
const Metadata = {title:"Admin/Global/Country",tags:["autodoc"]};

// statstrade-adminweb.a07-super.s00.global-region-test/Test_CountryRecords [35] 
export function Test_CountryRecords(){
  return (
    <T.YStack gap="$3" padding="$4" width={640}>
      <T.Text fontSize="$5" fontWeight="700">Country</T.Text>
      <T.Text color="$color10">Current Country rows with ISO and region details</T.Text>
      <T.XStack
        gap="$3"
        padding="$3"
        backgroundColor="$color2"
        borderRadius="$3">
        <T.Text fontSize="$5">🇦🇺</T.Text>
        <T.Text fontWeight="600">Australia</T.Text>
        <T.Text fontFamily="monospace">AU · AUS · +61</T.Text>
        <T.Text color="$color10">Canberra · Oceania</T.Text>
      </T.XStack>
      <T.XStack
        gap="$3"
        padding="$3"
        borderBottomWidth={1}
        borderColor="$color4">
        <T.Text fontSize="$5">🇯🇵</T.Text>
        <T.Text fontWeight="600">Japan</T.Text>
        <T.Text fontFamily="monospace">JP · JPN · +81</T.Text>
        <T.Text color="$color10">Tokyo · Asia</T.Text>
      </T.XStack>
    </T.YStack>);
}

export default Metadata