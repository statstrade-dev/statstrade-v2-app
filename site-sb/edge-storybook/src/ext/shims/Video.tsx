import React from 'react'

export default function Video(props: any) {
  const { style, source } = props
  const src = typeof source === 'string' ? source : source?.uri
  return (
    <div style={{
      background: '#eee',
      color: '#333',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace',
      fontSize: 12,
      width: 320,
      height: 180,
      ...style
    }}>
      Video stub {src ? `(src: ${src})` : ''}
    </div>
  )
}
