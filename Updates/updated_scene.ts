"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { Effects } from "./Effects"
import { CursedCore } from "./CursedCore"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"

export function Scene() {
  const selectedCharacter = useSpotifyStore((state) => state.selectedCharacter)
  const character = CHARACTERS[selectedCharacter]

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: false }}
      camera={{ position: [0, 0, 5], fov: 50 }}
    >
      <fog attach="fog" args={["#0a0a0f", 8, 45]} />
      
      <ambientLight intensity={0.15} />
      <pointLight
        position={[10, 10, 10]}
        intensity={1.2}
        color={character.colors.primary}
      />
      <pointLight
        position={[-10, -10, -10]}
        intensity={0.6}
        color={character.colors.secondary}
      />
      <pointLight
        position={[0, 10, 0]}
        intensity={0.8}
        color={character.colors.accent}
      />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.9}
        color={character.colors.primary}
        castShadow
      />

      <OrbitControls
        makeDefault
        autoRotate={false}
        enableDamping
        dampingFactor={0.05}
        minDistance={3}
        maxDistance={10}
      />

      <CursedCore />

      <Effects />
    </Canvas>
  )
}
