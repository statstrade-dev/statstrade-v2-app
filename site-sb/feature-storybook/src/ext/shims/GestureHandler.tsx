import React from 'react'

export const PanGestureHandler: React.FC<any> = ({ children }) => <>{children}</>
export const TapGestureHandler: React.FC<any> = ({ children }) => <>{children}</>
export const LongPressGestureHandler: React.FC<any> = ({ children }) => <>{children}</>
export const GestureDetector: React.FC<any> = ({ children }) => <>{children}</>
export const FlingGestureHandler: React.FC<any> = ({ children }) => <>{children}</>
export const State = { BEGAN: 0, ACTIVE: 1, END: 2 }
export const Directions = { RIGHT: 1, LEFT: 2, UP: 4, DOWN: 8 }
export default {}
