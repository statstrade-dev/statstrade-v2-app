import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Avatar } from './Avatar';

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas>
        {/* Lights for MToon shader visibility */}
        <ambientLight intensity={1.0} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />

        {/* Controls */}
        <OrbitControls target={[0, 1, 0]} />

        {/* Scene Content */}
        <Suspense fallback={null}>
          <group position={[0, 0, 0]}>
             {/* Replace these URLs with valid paths to your VRM and FBX files */}
            <Avatar
              modelUrl="/path/to/model.vrm"
              animationUrl="/path/to/animation.fbx"
            />
          </group>
        </Suspense>

        {/* Grid Helper for reference */}
        <gridHelper args={[10, 10]} />
      </Canvas>
    </div>
  );
}
