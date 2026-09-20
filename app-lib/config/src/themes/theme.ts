import { createThemes, defaultComponentThemes } from '@tamagui/theme-builder'
import * as Colors from '@tamagui/colors'

const darkPalette = ['hsla(240, 20%, 1%, 1)','hsla(240, 20%, 7%, 1)','hsla(240, 20%, 14%, 1)','hsla(240, 20%, 20%, 1)','hsla(240, 20%, 26%, 1)','hsla(240, 20%, 32%, 1)','hsla(240, 20%, 39%, 1)','hsla(240, 20%, 45%, 1)','hsla(239, 20%, 59%, 1)','hsla(238, 20%, 72%, 1)','hsla(236, 20%, 86%, 1)','hsla(235, 20%, 99%, 1)']
const lightPalette = ['hsla(240, 20%, 100%, 1)','hsla(240, 20%, 97%, 1)','hsla(240, 20%, 93%, 1)','hsla(240, 20%, 90%, 1)','hsla(240, 20%, 87%, 1)','hsla(240, 20%, 84%, 1)','hsla(240, 20%, 80%, 1)','hsla(240, 20%, 77%, 1)','hsla(239, 20%, 58%, 1)','hsla(238, 20%, 39%, 1)','hsla(236, 20%, 20%, 1)','hsla(235, 20%, 1%, 1)']

const lightShadows = {
  shadow1: 'rgba(0,0,0,0.04)',
  shadow2: 'rgba(0,0,0,0.08)',
  shadow3: 'rgba(0,0,0,0.16)',
  shadow4: 'rgba(0,0,0,0.24)',
  shadow5: 'rgba(0,0,0,0.32)',
  shadow6: 'rgba(0,0,0,0.4)',
}

const darkShadows = {
  shadow1: 'rgba(0,0,0,0.2)',
  shadow2: 'rgba(0,0,0,0.3)',
  shadow3: 'rgba(0,0,0,0.4)',
  shadow4: 'rgba(0,0,0,0.5)',
  shadow5: 'rgba(0,0,0,0.6)',
  shadow6: 'rgba(0,0,0,0.7)',
}

// we're adding some example sub-themes for you to show how they are done, "success" "warning", "error":

const builtThemes = createThemes({
  componentThemes: defaultComponentThemes,

  base: {
    palette: {
      dark: darkPalette,
      light: lightPalette,
    },

    extra: {
      light: {
        ...Colors.green,
        ...Colors.red,
        ...Colors.yellow,
        ...lightShadows,
        shadowColor: lightShadows.shadow1,
      },
      dark: {
        ...Colors.greenDark,
        ...Colors.redDark,
        ...Colors.yellowDark,
        ...darkShadows,
        shadowColor: darkShadows.shadow1,
      },
    },
  },

  accent: {
    palette: {
      dark: ['hsla(346, 92%, 38%, 1)','hsla(346, 90%, 43%, 1)','hsla(346, 88%, 49%, 1)','hsla(346, 87%, 54%, 1)','hsla(346, 85%, 59%, 1)','hsla(346, 83%, 65%, 1)','hsla(346, 82%, 70%, 1)','hsla(346, 84%, 56%, 1)','hsla(346, 86%, 42%, 1)','hsla(346, 88%, 28%, 1)','hsla(346, 90%, 14%, 1)','hsla(346, 92%, 0%, 1)'],
      light: ['hsla(346, 92%, 48%, 1)','hsla(346, 92%, 44%, 1)','hsla(346, 92%, 40%, 1)','hsla(346, 92%, 36%, 1)','hsla(346, 92%, 31%, 1)','hsla(346, 92%, 27%, 1)','hsla(346, 92%, 23%, 1)','hsla(346, 92%, 38%, 1)','hsla(346, 92%, 54%, 1)','hsla(346, 92%, 69%, 1)','hsla(346, 92%, 85%, 1)','hsla(346, 92%, 100%, 1)'],
    },
  },

  childrenThemes: {
    warning: {
      palette: {
        dark: Object.values(Colors.yellowDark),
        light: Object.values(Colors.yellow),
      },
    },

    error: {
      palette: {
        dark: Object.values(Colors.redDark),
        light: Object.values(Colors.red),
      },
    },

    success: {
      palette: {
        dark: Object.values(Colors.greenDark),
        light: Object.values(Colors.green),
      },
    },
  },

  // optionally add more, can pass palette or template

  // grandChildrenThemes: {
  //   alt1: {
  //     template: 'alt1',
  //   },
  //   alt2: {
  //     template: 'alt2',
  //   },
  //   surface1: {
  //     template: 'surface1',
  //   },
  //   surface2: {
  //     template: 'surface2',
  //   },
  //   surface3: {
  //     template: 'surface3',
  //   },
  // },
})

export type Themes = typeof builtThemes

// the process.env conditional here is optional but saves web client-side bundle
// size by leaving out themes JS. tamagui automatically hydrates themes from CSS
// back into JS for you, and the bundler plugins set TAMAGUI_ENVIRONMENT. so
// long as you are using the Vite, Next, Webpack plugins this should just work,
// but if not you can just export builtThemes directly as themes:
export const themes: Themes =
  process.env.TAMAGUI_ENVIRONMENT === 'client' &&
  process.env.NODE_ENV === 'production'
    ? ({} as any)
    : (builtThemes as any)
