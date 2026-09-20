import React, { createContext, useContext, useMemo } from 'react'

// Basic types to mirror react-native-safe-area-context
export type EdgeInsets = { top: number; left: number; right: number; bottom: number }
export type Frame = { x: number; y: number; width: number; height: number }

const zeroInsets: EdgeInsets = { top: 0, left: 0, right: 0, bottom: 0 }
const getWindowSize = (): { width: number; height: number } => {
  if (typeof window === 'undefined') return { width: 0, height: 0 }
  return { width: window.innerWidth, height: window.innerHeight }
}

export const SafeAreaInsetsContext = createContext<EdgeInsets>(zeroInsets)
const FrameContext = createContext<Frame>(() => {
  const { width, height } = getWindowSize()
  return { x: 0, y: 0, width, height }
})() as unknown as Frame

export const SafeAreaProvider: React.FC<{
  children: React.ReactNode
  initialMetrics?: { insets: EdgeInsets; frame: Frame }
}> = ({ children, initialMetrics }) => {
  const { width, height } = getWindowSize()
  const insets = initialMetrics?.insets ?? zeroInsets
  const frame = initialMetrics?.frame ?? { x: 0, y: 0, width, height }

  const insetsValue = useMemo(
    () => insets,
    [insets.top, insets.left, insets.right, insets.bottom]
  )
  const frameValue = useMemo(
    () => frame,
    [frame.x, frame.y, frame.width, frame.height]
  )

  return (
    <SafeAreaInsetsContext.Provider value={insetsValue}>
      <FrameContext.Provider value={frameValue}>{children}</FrameContext.Provider>
    </SafeAreaInsetsContext.Provider>
  )
}

export const SafeAreaView: React.FC<any> = ({ children, style }) => (
  <div style={style}>{children}</div>
)

export const useSafeAreaInsets = () => useContext(SafeAreaInsetsContext)
export const useSafeAreaFrame = () => useContext(FrameContext)

export const initialWindowMetrics: { insets: EdgeInsets; frame: Frame } = (() => {
  const { width, height } = getWindowSize()
  return {
    insets: zeroInsets,
    frame: { x: 0, y: 0, width, height },
  }
})()

export default {}
