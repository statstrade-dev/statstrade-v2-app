import * as T from 'tamagui'

// statstrade-adminweb.a07-super.s00.global-currency-test/Metadata [12] 
const Metadata = {title:"Admin/Global/Commodity",tags:["autodoc"]};

// statstrade-adminweb.a07-super.s00.global-currency-test/Test_CommodityRecords [33] 
export function Test_CommodityRecords(){
  return (
    <T.YStack gap="$3" padding="$4" width={640}>
      <T.Text fontSize="$5" fontWeight="700">Commodity</T.Text>
      <T.Text color="$color10">Current Statstrade-v2 Commodity rows</T.Text>
      <T.XStack
        gap="$3"
        padding="$3"
        backgroundColor="$color2"
        borderRadius="$3">
        <T.Text fontWeight="600">United States Dollar</T.Text>
        <T.Text fontFamily="monospace">USD</T.Text>
        <T.Text>$</T.Text>
        <T.Text color="$color10">fiat · issuer: Federal Reserve</T.Text>
      </T.XStack>
      <T.XStack
        gap="$3"
        padding="$3"
        borderBottomWidth={1}
        borderColor="$color4">
        <T.Text fontWeight="600">Euro</T.Text>
        <T.Text fontFamily="monospace">EUR</T.Text>
        <T.Text>€</T.Text>
        <T.Text color="$color10">fiat · issuer: European Central Bank</T.Text>
      </T.XStack>
    </T.YStack>);
}

export default Metadata