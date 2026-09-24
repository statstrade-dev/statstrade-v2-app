import Head from 'next/head'

import React from 'react'

import * as T from 'tamagui'

// statsui.basic.layout.common.frame-base/NextHead [10] 
export var NextHead = Head;

// statsui.basic.layout.common.frame-base/SinglePage [12] 
export function SinglePage({
  component,
  header,
  body,
  footer,
  metadata = {},
  backgroundProps = {},
  viewProps = {},
  ...props
}){
  let {title,...more} = metadata;
  return (
    <React.Fragment>
      <NextHead><title>{title}</title><meta {...more}/></NextHead>
      {header}
      <T.YStack flex={1} {...viewProps}>
        {body}
        {component ? (
          <React.Suspense fallback="loading">{React.createElement(component,props)}</React.Suspense>) : null}
      </T.YStack>
      {footer}
    </React.Fragment>);
}