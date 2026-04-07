import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

function SpiderWeb() {
  const ref = useRef();
  const particlesCount = 2000;
  
  // Generate spider web pattern
  const positions = new Float32Array(particlesCount * 3);
  
  for (let i = 0; i < particlesCount; i++) {
    const i3 = i * 3;
    const radius = Math.random() * 10;
    const angle = Math.random() * Math.PI * 2;
    const height = (Math.random() - 0.5) * 20;
    
    positions[i3] = Math.cos(angle) * radius;
    positions[i3 + 1] = height;
    positions[i3 + 2] = Math.sin(angle) * radius;
  }

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#E31837"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

export default function SpiderWebBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <SpiderWeb />
      </Canvas>
    </div>
  );
}
