"use client"

import { useEffect, useState } from "react"

export function Scene() {
  const [mounted, setMounted] = useState(false)
  const [Canvas, setCanvas] = useState<any>(null)
  const [OrbitControls, setOrbitControls] = useState<any>(null)
  const [Effects, setEffects] = useState<any>(null)
  const [CursedCore, setCursedCore] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    // Only import on client
    if (typeof window !== "undefined") {
      Promise.all([
        import("@react-three/fiber").then((mod) => mod.Canvas),
        import("@react-three/drei").then((mod) => mod.OrbitControls),
        import("./Effects").then((mod) => mod.Effects),
        import("./CursedCore").then((mod) => mod.CursedCore),
      ]).then(([CanvasComponent, OrbitControlsComponent, EffectsComponent, CursedCoreComponent]) => {
        setCanvas(() => CanvasComponent)
        setOrbitControls(() => OrbitControlsComponent)
        setEffects(() => EffectsComponent)
        setCursedCore(() => CursedCoreComponent)
      })
    }
  }, [])

  // Prevent any rendering until client-side and components loaded
  if (!mounted || typeof window === "undefined" || !Canvas || !OrbitControls || !Effects || !CursedCore) {
    return null
  }

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

