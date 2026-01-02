"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"
import { EnergyFlowShader } from "./shaders/EnergyFlowShader"
import { BarrierShader } from "./shaders/BarrierShader"
import { VoidShader } from "./shaders/VoidShader"
import { SlashShader } from "./shaders/SlashShader"
import { GlitchShader } from "./shaders/GlitchShader"

export function ShaderMaterials() {
  const { selectedCharacter, domainState, beatIntensity, intensity, currentTechnique } = useSpotifyStore()
  const character = CHARACTERS[selectedCharacter]
  const isActive = domainState === "active" || domainState === "expanding"
  const isMobile = typeof window !== "undefined" && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  
  // Create shader materials (hooks must be called unconditionally)
  const energyFlowMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        ...EnergyFlowShader,
        uniforms: {
          ...EnergyFlowShader.uniforms,
          color: { value: new THREE.Color(character.colors.glow) },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
      }),
    [character.colors.glow]
  )

  const barrierMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        ...BarrierShader,
        uniforms: {
          ...BarrierShader.uniforms,
          color: { value: new THREE.Color(character.colors.glow) },
        },
        transparent: true,
        side: THREE.DoubleSide,
      }),
    [character.colors.glow]
  )

  const voidMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        ...VoidShader,
        uniforms: {
          ...VoidShader.uniforms,
          color: { value: new THREE.Color(character.colors.glow) },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
      }),
    [character.colors.glow]
  )

  const slashMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        ...SlashShader,
        uniforms: {
          ...SlashShader.uniforms,
          color: { value: new THREE.Color(character.colors.glow) },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
      }),
    [character.colors.glow]
  )

  useFrame((state) => {
    // Early return if mobile - but hook is still called
    if (isMobile) return
    const beat = beatIntensity ?? 0
    const energy = intensity ?? 0

    // Update shader uniforms
    if (energyFlowMaterial) {
      energyFlowMaterial.uniforms.time.value = state.clock.elapsedTime
      energyFlowMaterial.uniforms.intensity.value = 0.5 + energy * 0.5 + beat * 0.3
    }

    if (barrierMaterial && isActive) {
      barrierMaterial.uniforms.time.value = state.clock.elapsedTime
      barrierMaterial.uniforms.distortion.value = 0.1 + beat * 0.1
    }

    if (voidMaterial && character.id === "gojo" && isActive) {
      voidMaterial.uniforms.time.value = state.clock.elapsedTime * 0.5 // Slow motion
    }

    if (slashMaterial && currentTechnique === "cleave") {
      slashMaterial.uniforms.time.value = state.clock.elapsedTime
      slashMaterial.uniforms.intensity.value = beat
      slashMaterial.uniforms.angle.value = state.clock.elapsedTime * 2
    }
  })

  // Don't render on mobile for performance
  if (isMobile) return null

  return (
    <group>
      {/* Energy Flow Shader - Applied to core */}
      {isActive && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[2, 32, 32]} />
          <primitive object={energyFlowMaterial} attach="material" />
        </mesh>
      )}

      {/* Barrier Shader - Hexagonal grid */}
      {isActive && (
        <mesh position={[0, 0, -3]}>
          <planeGeometry args={[20, 20]} />
          <primitive object={barrierMaterial} attach="material" />
        </mesh>
      )}

      {/* Void Shader - Gojo's infinite void */}
      {character.id === "gojo" && isActive && (
        <mesh>
          <sphereGeometry args={[50, 64, 64]} />
          <primitive object={voidMaterial} attach="material" />
        </mesh>
      )}

      {/* Slash Shader - Sukuna's cleave */}
      {currentTechnique === "cleave" && (
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[10, 10]} />
          <primitive object={slashMaterial} attach="material" />
        </mesh>
      )}
    </group>
  )
}

