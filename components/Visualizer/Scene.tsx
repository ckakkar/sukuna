"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { Effects } from "./Effects"
import { CursedCore } from "./CursedCore"

export function Scene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: false }}
      camera={{ position: [0, 0, 5], fov: 50 }}
    >
      {/* Dark fog with slight purple tint */}
      <fog attach="fog" args={["#0a0a0f", 8, 45]} />
      
      {/* Lighting - Cursed Energy themed */}
      <ambientLight intensity={0.15} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#9333ea" />
      <pointLight position={[-10, -10, -10]} intensity={0.6} color="#8a0093" />
      <pointLight position={[0, 10, 0]} intensity={0.8} color="#a78bfa" />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.9}
        color="#9333ea"
        castShadow
      />

      {/* Controls */}
      <OrbitControls
        makeDefault
        autoRotate={false}
        enableDamping
        dampingFactor={0.05}
        minDistance={3}
        maxDistance={10}
      />

      {/* The reactive core */}
      <CursedCore />

      {/* Post-processing effects */}
      <Effects />
    </Canvas>
  )
}