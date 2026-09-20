import React from 'react'

export const Screen: React.FC<any> = ({ children, style }) => (
  <div style={style}>{children}</div>
)
export const ScreenStack: React.FC<any> = ({ children, style }) => (
  <div style={style}>{children}</div>
)
export const enableScreens = () => {}
export default {}
