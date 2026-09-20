import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui, createTokens } from 'tamagui'
import { bodyFont, headingFont } from './fonts'
import { animations } from './animations'

// import { themes } from './themes/theme-generated'
import { themes } from './themes/theme'
import { color } from './themes/token-colors'
import { radius } from './themes/token-radius'
import { size } from './themes/token-size'
import { space } from './themes/token-space'
import { zIndex } from './themes/token-z-index'

const breakpoints = {
  "2xl": 1536,
  xl: 1280,
  lg: 1024,
  md: 768,
  sm: 640,
  xs: 460,
  "2xs": 340
}

const media = {
  "2xs": { maxWidth: breakpoints["2xs"] },
  xs: { maxWidth: breakpoints.xs },
  sm: { maxWidth: breakpoints.sm },
  md: { maxWidth: breakpoints.md },
  lg: { maxWidth: breakpoints.lg },
  xl: { maxWidth: breakpoints.xl },
  "2xl": { maxWidth: breakpoints["2xl"] },

  gtXs: { minWidth: breakpoints.xs + 1 },
  gtSm: { minWidth: breakpoints.sm + 1 },
  gtMd: { minWidth: breakpoints.md + 1 },
  gtLg: { minWidth: breakpoints.lg + 1 },
  gtXl: { minWidth: breakpoints.xl + 1 },
  gt2Xl: { minWidth: breakpoints["2xl"] + 1 },
}


export const config = createTamagui({
  ...defaultConfig,
  media,
  themes,
  animations,
  fonts: {
    body: bodyFont,
    heading: headingFont,
  },
  tokens: createTokens({
    color,
    radius,
    zIndex,
    space,
    size,
  }),
  settings:{
    ...defaultConfig.settings,
    onlyAllowShorthands: false
  }
})
