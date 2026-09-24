import React from 'react'

import * as T from 'tamagui'

import * as ui_image from '@statstrade/component/ui-image'

// statsui.basic.ui-image-test/Metadata [15] 
export var Metadata = {[title]:"Components/ui-image",[tags]:["autodoc"]};

// statsui.basic.ui-image-test/Test_ImageUpload [21] 
export function Test_ImageUpload(){
  let [image,setImage] = React.useState(null);
  return (
    <T.YStack gap="$4" alignItems="center">
      <ui_image.ImageUpload
        image={image}
        onImageSelected={setImage}
        width={200}
        height={200}/>
      <T.Text>{"Click the placeholder to select an image."}</T.Text>
    </T.YStack>);
}

export default Metadata