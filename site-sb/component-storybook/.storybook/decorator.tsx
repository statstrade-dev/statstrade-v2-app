import { TamaguiProvider, Theme, ThemeName, YStack, XStack } from 'tamagui'
import { config } from '@statstrade/config'
// @ts-ignore
import { ThemeGlobalContext } from '@statstrade/component/ui-common'
import { Decorator } from '@storybook/react-vite'

import React from 'react'

export const StorybookDecorator: Decorator = (Story, args: any) => {
  const {
    theme1,
    theme2,
    theme3,
    theme4,
    // inverseTheme
  } = args.globals
  const themeName = [theme2, theme3, theme4].filter((theme) => !!theme).join('_') || null

  //   return (
  //     <Story />
  //   )
  return (
    <ThemeGlobalContext.Provider value={{ current: theme1, setCurrent: () => { } }}>
      <TamaguiProvider config={config} defaultTheme={theme1}>
        <YStack backgroundColor="$background" padding="$4" flex={1}>
          <Theme forceClassName name={themeName as ThemeName}>
            <Story />
          </Theme>
        </YStack>
      </TamaguiProvider>
    </ThemeGlobalContext.Provider>
  )
}
