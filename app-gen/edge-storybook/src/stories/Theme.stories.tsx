import React from 'react'
import { Meta, StoryObj } from '@storybook/react-vite'
import { YStack, XStack, Text, View, ScrollView } from 'tamagui'
import { config } from '@statstrade/config'

const themes = config.themes

const meta: Meta = {
  title: 'Themes/Colors',
  component: View,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

type Story = StoryObj<typeof meta>

const ColorSwatch = ({ name, color }: { name: string; color: any }) => {
  const colorValue = typeof color === 'object' && color.val ? color.val : color
  const isLightColor = colorValue?.includes('100%') || colorValue?.includes('99%')
  
  return (
    <YStack 
      alignItems="center" 
      space="$2"
      padding="$2"
      width={100}
    >
      <View 
        width={40} 
        height={40} 
        backgroundColor={colorValue} 
        borderRadius="$4"
        borderWidth={1}
        borderColor="$borderColor"
        shadowColor="$color"
        shadowRadius="$1"
        shadowOffset={{ width: 0, height: 1 }}
      />
      <Text 
        fontSize="10px" 
        fontWeight="600"
        backgroundColor={isLightColor ? "rgba(0,0,0,0.1)" : 'transparent'}
        paddingHorizontal="$2"
        borderRadius="$2"
      >
        {name}
      </Text>
      <Text 
        fontSize="7px"
        opacity={0.8}
        backgroundColor={isLightColor ? "rgba(0,0,0,0.1)" : 'transparent'}
        paddingHorizontal="$2"
        borderRadius="$2"
      >
        {colorValue}
      </Text>
    </YStack>
  )
}

const ThemeDisplay = ({ themeName }: { themeName: string }) => {
  const theme = themes[themeName as keyof typeof themes]
  if (!theme) return <Text>Theme not found</Text>

  const colorEntries = Object.entries(theme);
  
  return (
    <YStack flex={1} padding="$4" backgroundColor="$background">
      <Text fontSize="$8" fontWeight="bold" marginBottom="$4">
        {themeName.charAt(0).toUpperCase() + themeName.slice(1)} Theme
      </Text>
      
      <ScrollView>
        <XStack flexWrap="wrap" gap="$2">
          {colorEntries.map(([key, value]) => (
            <ColorSwatch key={key} name={key} color={value} />
          ))}
        </XStack>
      </ScrollView>
    </YStack>
  )
}

// Create a story for each theme
const themeStories: Record<string, Story> = {}

// Interactive story to switch between themes
export const LightTheme: Story = {
  args: {
    themeName: 'light',
  },
  argTypes: {
    themeName: {
      control: { type: 'select' },
      options: Object.keys(themes),
    },
  },
  render: ({ themeName }) => <ThemeDisplay themeName={themeName} />,
}

// Interactive story to switch between themes
export const DarkTheme: Story = {
  args: {
    themeName: 'dark',
  },
  argTypes: {
    themeName: {
      control: { type: 'select' },
      options: Object.keys(themes),
    },
  },
  render: ({ themeName }) => <ThemeDisplay themeName={themeName} />,
}