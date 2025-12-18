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
  const emissiveRef = useRef({ r: 90 / 255, g: 0, b: 120 / 255 })
  const scaleCurrent = useRef(1)
  const colorCurrent = useRef({ r: 90 / 255, g: 0, b: 120 / 255 })

  useFrame((_state, delta: number) => {
    if (!meshRef.current || !materialRef.current) return

    const { trackData, selectedCharacter } = useSpotifyStore.getState()
    const character = CHARACTERS[selectedCharacter]
    
    if (trackData) {
      const { energy, bpm } = trackData

      const scaleTarget = 1 + energy * 1.8

      const colorTarget = energy > 0.5
        ? {
            r: character.energy.mid.r + (character.energy.high.r - character.energy.mid.r) * ((energy - 0.5) * 2),
            g: character.energy.mid.g + (character.energy.high.g - character.energy.mid.g) * ((energy - 0.5) * 2),
            b: character.energy.mid.b + (character.energy.high.b - character.energy.mid.b) * ((energy - 0.5) * 2),
          }
        : {
            r: character.energy.low.r + (character.energy.mid.r - character.energy.low.r) * (energy * 2),
            g: character.energy.low.g + (character.energy.mid.g - character.energy.low.g) * (energy * 2),
            b: character.energy.low.b + (character.energy.mid.b - character.energy.low.b) * (energy * 2),
          }

      scaleCurrent.current = damp(scaleCurrent.current, scaleTarget, 15, delta)
      meshRef.current.scale.setScalar(scaleCurrent.current)

      colorCurrent.current.r = damp(colorCurrent.current.r, colorTarget.r, 15, delta)
      colorCurrent.current.g = damp(colorCurrent.current.g, colorTarget.g, 15, delta)
      colorCurrent.current.b = damp(colorCurrent.current.b, colorTarget.b, 15, delta)

      emissiveRef.current.r = damp(emissiveRef.current.r, colorTarget.r * 1.2, 15, delta)
      emissiveRef.current.g = damp(emissiveRef.current.g, colorTarget.g * 1.2, 15, delta)
      emissiveRef.current.b = damp(emissiveRef.current.b, colorTarget.b * 1.2, 15, delta)

      meshRef.current.rotation.y += delta * (bpm / 120)
      meshRef.current.rotation.x += delta * (bpm / 240) * 0.3
    } else {
      scaleCurrent.current = damp(scaleCurrent.current, 1, 15, delta)
      meshRef.current.scale.setScalar(scaleCurrent.current)
      
      colorCurrent.current.r = damp(colorCurrent.current.r, character.energy.low.r, 15, delta)
      colorCurrent.current.g = damp(colorCurrent.current.g, character.energy.low.g, 15, delta)
      colorCurrent.current.b = damp(colorCurrent.current.b, character.energy.low.b, 15, delta)
      
      emissiveRef.current.r = damp(emissiveRef.current.r, character.energy.low.r, 15, delta)
      emissiveRef.current.g = damp(emissiveRef.current.g, character.energy.low.g, 15, delta)
      emissiveRef.current.b = damp(emissiveRef.current.b, character.energy.low.b, 15, delta)
      
      meshRef.current.rotation.y += delta * 0.1
    }

    materialRef.current.color.setRGB(
      colorCurrent.current.r,
      colorCurrent.current.g,
      colorCurrent.current.b
    )
    
    materialRef.current.emissive.setRGB(
      Math.min(emissiveRef.current.r, 1),
      Math.min(emissiveRef.current.g, 1),
      Math.min(emissiveRef.current.b, 1)
    )
    materialRef.current.emissiveIntensity = trackData ? 0.8 + trackData.energy * 0.7 : 0.5
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
