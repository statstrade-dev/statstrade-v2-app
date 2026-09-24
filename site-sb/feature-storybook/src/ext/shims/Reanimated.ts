export const useSharedValue = <T,>(v: T) => ({ value: v }) as any
export const withTiming = <T,>(v: T) => v as any
export const withSpring = <T,>(v: T) => v as any
export const Easing = { linear: (t: number) => t }
export const runOnJS = (fn: any) => fn
export const runOnUI = (fn: any) => fn
export const useAnimatedStyle = (fn: any) => fn()
export const useDerivedValue = (fn: any) => ({ value: fn() }) as any
export const Animated = new Proxy({}, { get: () => (props: any) => props?.children ?? null }) as any
export default {
  useSharedValue,
  withTiming,
  withSpring,
  Easing,
  runOnJS,
  runOnUI,
  useAnimatedStyle,
  useDerivedValue,
  Animated,
}
