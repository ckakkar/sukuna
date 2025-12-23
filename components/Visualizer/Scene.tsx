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
  
  // Detect device capability
  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  
  useFrame(() => {
    const { beatIntensity, selectedCharacter } = useSpotifyStore.getState()
    const character = CHARACTERS[selectedCharacter]
    const beat = beatIntensity ?? 0
    const multiplier = isMobile ? 0.6 : 1 // Reduced intensity on mobile

    if (light1Ref.current) {
      light1Ref.current.intensity = 1.2 + beat * 2 * multiplier
      light1Ref.current.distance = 18 + beat * 6 * multiplier
    }
    
    if (light2Ref.current) {
      light2Ref.current.intensity = 0.6 + beat * 1.2 * multiplier
    }
    
    if (light3Ref.current) {
      light3Ref.current.intensity = 0.8 + beat * 1.5 * multiplier
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
        castShadow={!isMobile}
        shadow-mapSize-width={isMobile ? 512 : 1024}
        shadow-mapSize-height={isMobile ? 512 : 1024}
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
        castShadow={!isMobile}
      />
    </>
  )
}

function CursedEnergyField() {
  const meshRef = useRef<THREE.Mesh>(null)
  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  const lastUpdateRef = useRef(0)
  
  useFrame((state) => {
    if (!meshRef.current) return
    
    // Throttle updates on mobile for better performance
    if (isMobile && state.clock.elapsedTime - lastUpdateRef.current < 0.05) return
    lastUpdateRef.current = state.clock.elapsedTime
    
    const { beatIntensity, intensity } = useSpotifyStore.getState()
    
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.08
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.15
    
    const scale = 7 + (intensity ?? 0) * 1.5 + (beatIntensity ?? 0) * 0.8
    meshRef.current.scale.setScalar(scale)
    
    const material = meshRef.current.material as THREE.MeshBasicMaterial
    material.opacity = 0.04 + (beatIntensity ?? 0) * 0.08
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
  
  // Detect device for performance optimization
  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  const isTablet = typeof window !== 'undefined' && /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768
  const devicePixelRatio = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2) : 1

  return (
    <Canvas
      shadows={!isMobile}
      dpr={[1, devicePixelRatio]}
      gl={{ 
        antialias: !isMobile,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
      }}
      camera={{ position: [0, 0, 5], fov: 50 }}
      performance={{ min: 0.8 }}
    >
      <color attach="background" args={["#0a0a0f"]} />
      <fog attach="fog" args={["#0a0a0f", 5, 50]} />
      
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <BeatReactiveLights />

      {/* Environment - Reduced stars on mobile */}
      <Stars
        radius={100}
        depth={50}
        count={isMobile ? 1500 : isTablet ? 2500 : 4000}
        factor={isMobile ? 3 : 4}
        saturation={0}
        fade
        speed={0.4}
      />

      {/* Camera controls */}
      <OrbitControls
        makeDefault
        autoRotate={false}
        enableDamping
        dampingFactor={0.05}
        minDistance={2}
        maxDistance={20}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
        enablePan={false}
        enableZoom={true}
        zoomSpeed={0.8}
        touches={{
          ONE: 2, // Rotate
          TWO: 1, // Zoom on mobile (pinch)
        }}
      />

      {/* Main visualizations */}
      <CursedCore />
      <CursedEnergyField />

      {/* Post-processing */}
      <Effects />
    </Canvas>
  )
}