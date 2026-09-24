import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Avatar } from './Avatar';

export function AvatarCanvas({ modelUrl, animationUrl, style, children }) {
  return (
    <div style={{ width: '100%', height: '100%', ...style }}>
      <Canvas>
        <ambientLight intensity={1.0} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />

        <OrbitControls target={[0, 1, 0]} />

        <Suspense fallback={null}>
          <group position={[0, 0, 0]}>
            <Avatar
              modelUrl={modelUrl}
              animationUrl={animationUrl}
            />
          </group>
          {children}
        </Suspense>

        <gridHelper args={[10, 10]} />
      </Canvas>
    </div>
  );
}
