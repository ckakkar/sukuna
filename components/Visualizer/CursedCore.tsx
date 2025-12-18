"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type { Mesh } from "three"
import { MeshPhysicalMaterial } from "three"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"
import { damp } from "maath/easing"

export function CursedCore() {
  const meshRef = useRef<Mesh>(null)
  const materialRef = useRef<MeshPhysicalMaterial>(null)

  useFrame((_state, delta: number) => {
    if (!meshRef.current || !materialRef.current) return

    const { trackData, selectedCharacter } = useSpotifyStore.getState()
    const character = CHARACTERS[selectedCharacter]

    // Current values from Three.js objects (avoids mutating React refs)
    const currentScale = meshRef.current.scale.x
    const currentColor = materialRef.current.color
    const currentEmissive = materialRef.current.emissive

    if (trackData) {
      const { energy, bpm } = trackData

      // Target scale based on track energy
      const scaleTarget = 1 + energy * 1.8
      const nextScale = damp(currentScale, scaleTarget, 15, delta)
      meshRef.current.scale.setScalar(nextScale)

      // Target color based on character theme + energy
      const colorTarget =
        energy > 0.5
          ? {
              r:
                character.energy.mid.r +
                (character.energy.high.r - character.energy.mid.r) * ((energy - 0.5) * 2),
              g:
                character.energy.mid.g +
                (character.energy.high.g - character.energy.mid.g) * ((energy - 0.5) * 2),
              b:
                character.energy.mid.b +
                (character.energy.high.b - character.energy.mid.b) * ((energy - 0.5) * 2),
            }
          : {
              r:
                character.energy.low.r +
                (character.energy.mid.r - character.energy.low.r) * (energy * 2),
              g:
                character.energy.low.g +
                (character.energy.mid.g - character.energy.low.g) * (energy * 2),
              b:
                character.energy.low.b +
                (character.energy.mid.b - character.energy.low.b) * (energy * 2),
            }

      // Smoothly damp color & emissive towards target
      const nextR = damp(currentColor.r, colorTarget.r, 15, delta)
      const nextG = damp(currentColor.g, colorTarget.g, 15, delta)
      const nextB = damp(currentColor.b, colorTarget.b, 15, delta)
      materialRef.current.color.setRGB(nextR, nextG, nextB)

      const targetEmissiveR = colorTarget.r * 1.2
      const targetEmissiveG = colorTarget.g * 1.2
      const targetEmissiveB = colorTarget.b * 1.2
      const nextEmissiveR = damp(currentEmissive.r, targetEmissiveR, 15, delta)
      const nextEmissiveG = damp(currentEmissive.g, targetEmissiveG, 15, delta)
      const nextEmissiveB = damp(currentEmissive.b, targetEmissiveB, 15, delta)
      materialRef.current.emissive.setRGB(
        Math.min(nextEmissiveR, 1),
        Math.min(nextEmissiveG, 1),
        Math.min(nextEmissiveB, 1)
      )

      meshRef.current.rotation.y += delta * (bpm / 120)
      meshRef.current.rotation.x += delta * (bpm / 240) * 0.3
      materialRef.current.emissiveIntensity = 0.8 + energy * 0.7
    } else {
      // Idle / no track: gently return to character's base energy color & default scale
      const idleScale = damp(currentScale, 1, 15, delta)
      meshRef.current.scale.setScalar(idleScale)

      const nextIdleR = damp(currentColor.r, character.energy.low.r, 15, delta)
      const nextIdleG = damp(currentColor.g, character.energy.low.g, 15, delta)
      const nextIdleB = damp(currentColor.b, character.energy.low.b, 15, delta)
      materialRef.current.color.setRGB(nextIdleR, nextIdleG, nextIdleB)

      const nextIdleEmissiveR = damp(currentEmissive.r, character.energy.low.r, 15, delta)
      const nextIdleEmissiveG = damp(currentEmissive.g, character.energy.low.g, 15, delta)
      const nextIdleEmissiveB = damp(currentEmissive.b, character.energy.low.b, 15, delta)
      materialRef.current.emissive.setRGB(
        Math.min(nextIdleEmissiveR, 1),
        Math.min(nextIdleEmissiveG, 1),
        Math.min(nextIdleEmissiveB, 1)
      )

      meshRef.current.rotation.y += delta * 0.1
      materialRef.current.emissiveIntensity = 0.5
    }
  })

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <torusKnotGeometry args={[1, 0.3, 256, 32]} />
      <meshPhysicalMaterial
        ref={materialRef}
        metalness={0.85}
        roughness={0.05}
        emissive="#5a0078"
        emissiveIntensity={0.5}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </mesh>
  )
}
