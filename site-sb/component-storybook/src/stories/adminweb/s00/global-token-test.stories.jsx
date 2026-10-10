import * as T from 'tamagui'

// statstrade-adminweb.a07-super.s00.global-token-test/Metadata [12] 
const Metadata = {title:"Admin/Global/Token",tags:["autodoc"]};

// statstrade-adminweb.a07-super.s00.global-token-test/Test_TokenRecords [33] 
export function Test_TokenRecords(){
  return (
    <T.YStack gap="$3" padding="$4" width={640}>
      <T.Text fontSize="$5" fontWeight="700">Token</T.Text>
      <T.Text color="$color10">Token name, code, symbol, decimal, and issuer</T.Text>
      <T.XStack
        gap="$3"
        padding="$3"
        backgroundColor="$color2"
        borderRadius="$3">
        <T.Text fontWeight="600">Statstrade Token</T.Text>
        <T.Text fontFamily="monospace">STAT</T.Text>
        <T.Text>Native</T.Text>
        <T.Text color="$color10">18 decimals · Statstrade</T.Text>
      </T.XStack>
      <T.XStack
        gap="$3"
        padding="$3"
        borderBottomWidth={1}
        borderColor="$color4">
        <T.Text fontWeight="600">Ethereum</T.Text>
        <T.Text fontFamily="monospace">ETH</T.Text>
        <T.Text>Wrapped</T.Text>
        <T.Text color="$color10">18 decimals · Ethereum</T.Text>
      </T.XStack>
    </T.YStack>);
}

export default Metadata