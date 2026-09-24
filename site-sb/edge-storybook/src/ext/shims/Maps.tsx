import React from 'react'

export default function MapView(props: any) {
  return (
    <div style={{
      background: '#e0f7ff',
      color: '#333',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px dashed #3aa',
      width: 300,
      height: 200,
      fontFamily: 'monospace',
      fontSize: 12,
      ...props.style,
    }}>
      MapView stub
    </div>
  )
}
