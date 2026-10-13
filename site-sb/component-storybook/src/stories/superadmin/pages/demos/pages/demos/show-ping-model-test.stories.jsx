import * as T from 'tamagui'

// statstrade-superadmin.pages.demos.show-ping-model-test/Metadata [11] 
const Metadata = {title:"Demos/Supabase RPC Ping Model",tags:["autodoc"]};

// statstrade-superadmin.pages.demos.show-ping-model-test/Test_MovedPingModel [35] 
export function Test_MovedPingModel(){
  return (
    <T.YStack gap="$3" padding="$4" width={560}>
      <T.Text fontSize="$5" fontWeight="600">This page model demo has moved.</T.Text>
      <T.Anchor href="/demos/show-ping">Open RPC ping demo</T.Anchor>
    </T.YStack>);
}

export default Metadata