import { createAnimations } from '@tamagui/animations-react-native'

export const animations = createAnimations({
  '100ms': {
    type: 'timing',
    duration: 100,
    delay: 0,
  },
  '200ms': {
    type: 'timing',
    duration: 200,
    delay: 0,
  },
  bouncy: {
    damping: 9,
    mass: 0.9,
    stiffness: 150,
    delay: 0,
  },
  lazy: {
    damping: 18,
    stiffness: 50,
    delay: 0,
  },
  medium: {
    damping: 15,
    stiffness: 120,
    mass: 1,
    delay: 0,
  },
  slow: {
    damping: 15,
    stiffness: 40,
    delay: 0,
  },
  quick: {
    damping: 20,
    mass: 1.2,
    stiffness: 250,
    delay: 0,
  },
  tooltip: {
    damping: 10,
    mass: 0.9,
    stiffness: 100,
    delay: 0,
  },
})
