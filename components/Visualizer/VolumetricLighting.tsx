"use client"

import { useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"

export function VolumetricLighting() {
  const meshRef = useRef<THREE.Mesh>(null)
  const { selectedCharacter, beatIntensity, intensity } = useSpotifyStore()
  const character = CHARACTERS[selectedCharacter]
  const isMobile = typeof window !== "undefined" && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  // Only render on desktop for performance
  if (isMobile) return null

  useFrame((state) => {
    if (!meshRef.current) return

    const beat = beatIntensity ?? 0
    const energy = intensity ?? 0

    // Animate god rays
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.1
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1

    // Scale with beat
    const scale = 1 + beat * 0.3 + energy * 0.2
    meshRef.current.scale.setScalar(scale)

    // Update material opacity
    const material = meshRef.current.material as THREE.MeshBasicMaterial
    material.opacity = 0.15 + beat * 0.1 + energy * 0.05
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -2]}>
      <coneGeometry args={[3, 8, 32, 1, true]} />
      <meshBasicMaterial
        color={character.colors.glow}
        transparent
        opacity={0.15}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

