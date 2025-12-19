"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Stars } from "@react-three/drei"
import type { PointLight } from "three"
import * as THREE from "three"
import { Effects } from "./Effects"
import { CursedCore } from "./CursedCore"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"
import { getVisibleTextColor } from "@/lib/utils/colorUtils"

function BeatReactiveLights() {
  const light1Ref = useRef<PointLight>(null)
  const light2Ref = useRef<PointLight>(null)
  const light3Ref = useRef<PointLight>(null)
  
  useFrame(() => {
    const { beatIntensity, selectedCharacter } = useSpotifyStore.getState()
    const character = CHARACTERS[selectedCharacter]
    const beat = beatIntensity ?? 0

    if (light1Ref.current) {
      light1Ref.current.intensity = 1.2 + beat * 3
      light1Ref.current.distance = 20 + beat * 10
    }
    
    if (light2Ref.current) {
      light2Ref.current.intensity = 0.6 + beat * 2
    }
    
    if (light3Ref.current) {
      light3Ref.current.intensity = 0.8 + beat * 2.5
    }
  })

  const selectedCharacter = useSpotifyStore((state) => state.selectedCharacter)
  const character = CHARACTERS[selectedCharacter]
  const primaryLightColor = getVisibleTextColor(character.colors.primary, character.colors.glow, character.colors.secondary)

  return (
    <>
      <pointLight
        ref={light1Ref}
        position={[10, 10, 10]}
        intensity={1.2}
        color={primaryLightColor}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight
        ref={light2Ref}
        position={[-10, -10, -10]}
        intensity={0.6}
        color={character.colors.secondary || character.colors.glow}
      />
      <pointLight
        ref={light3Ref}
        position={[0, 10, 0]}
        intensity={0.8}
        color={character.colors.accent || character.colors.glow}
      />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.9}
        color={primaryLightColor}
        castShadow
      />
    </>
  )
}

function CursedEnergyField() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (!meshRef.current) return
    const { beatIntensity, intensity } = useSpotifyStore.getState()
    
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.1
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    
    const scale = 8 + (intensity ?? 0) * 2 + (beatIntensity ?? 0) * 1
    meshRef.current.scale.setScalar(scale)
    
    const material = meshRef.current.material as THREE.MeshBasicMaterial
    material.opacity = 0.05 + (beatIntensity ?? 0) * 0.1
  })

  const selectedCharacter = useSpotifyStore((state) => state.selectedCharacter)
  const character = CHARACTERS[selectedCharacter]

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial
        color={character.colors.glow}
        transparent
        opacity={0.05}
        wireframe
      />
    </mesh>
  )
}

export function Scene() {
  const selectedCharacter = useSpotifyStore((state) => state.selectedCharacter)
  const character = CHARACTERS[selectedCharacter]

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ 
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      }}
      camera={{ position: [0, 0, 5], fov: 50 }}
    >
      <color attach="background" args={["#0a0a0f"]} />
      <fog attach="fog" args={["#0a0a0f", 5, 50]} />
      
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <BeatReactiveLights />

      {/* Environment */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* Camera controls */}
      <OrbitControls
        makeDefault
        autoRotate={false}
        enableDamping
        dampingFactor={0.05}
        minDistance={3}
        maxDistance={15}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
      />

      {/* Main visualizations */}
      <CursedCore />
      <CursedEnergyField />

      {/* Post-processing */}
      <Effects />
    </Canvas>
  )
}