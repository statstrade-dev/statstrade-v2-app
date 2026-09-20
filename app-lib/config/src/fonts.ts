import { createInterFont } from '@tamagui/font-inter'

export const headingFont = createInterFont({
  size: {
    6: 16,
  },
  transform: {
    // 6: 'uppercase',
    7: 'none',
  },
  weight: {
    6: '100',
    7: '100',
    8: '100',
    9: '100',
  },
  color: {
    6: '$colorFocus',
    7: '$color',
    8: '$color',
    9: '$color',
  },
  letterSpacing: {
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    12: 0,
    14: 0,
    15: 0,
  },
  face: {
    700: { normal: 'InterBold' },
  },
})

export const bodyFont = createInterFont(
  {
    face: {
      700: { normal: 'InterBold' },
    },
  },
  {
    sizeSize: (size) => Math.round(size * 1.1),
    sizeLineHeight: (size) => Math.round(size * 1.1 + (size > 20 ? 10 : 10)),
  }
)
