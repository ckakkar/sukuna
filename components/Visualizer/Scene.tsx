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
      {/* Dark fog */}
      <fog attach="fog" args={["#050505", 10, 50]} />
      
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ff3c00" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8a0000" />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.8}
        color="#ff3c00"
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

