"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type { Mesh } from "three"
import { MeshPhysicalMaterial, MathUtils } from "three"
import { useSpotifyStore } from "@/store/useSpotifyStore"

// Simple damp function for smooth interpolation
function damp(current: number, target: number, lambda: number, delta: number): number {
  return MathUtils.lerp(current, target, 1 - Math.exp(-lambda * delta))
}

export function CursedCore() {
  const meshRef = useRef<Mesh>(null)
  const materialRef = useRef<MeshPhysicalMaterial>(null)
  const emissiveRef = useRef({ r: 138 / 255, g: 0, b: 147 / 255 })
  const scaleCurrent = useRef(1)
  const colorCurrent = useRef({ r: 138 / 255, g: 0, b: 147 / 255 }) // Dark red-purple cursed energy

  useFrame((_state, delta: number) => {
    if (!meshRef.current || !materialRef.current) return

    // Read track data from store (this is efficient - just reading a reference)
    const trackData = useSpotifyStore.getState().trackData
    
    if (trackData) {
      const { energy, bpm } = trackData

      // Calculate target scale based on energy
      const scaleTarget = 1 + energy * 1.8

      // Interpolate color based on energy (dark purple/red cursed energy to bright violet/pink)
      const lowColor = { r: 138 / 255, g: 0, b: 147 / 255 } // Dark cursed energy
      const midColor = { r: 147 / 255, g: 51 / 255, b: 234 / 255 } // Purple cursed energy
      const highColor = { r: 255 / 255, g: 100 / 255, b: 255 / 255 } // Bright pink/violet

      // Use energy to interpolate between low -> mid -> high
      const colorTarget = energy > 0.5
        ? {
            r: midColor.r + (highColor.r - midColor.r) * ((energy - 0.5) * 2),
            g: midColor.g + (highColor.g - midColor.g) * ((energy - 0.5) * 2),
            b: midColor.b + (highColor.b - midColor.b) * ((energy - 0.5) * 2),
          }
        : {
            r: lowColor.r + (midColor.r - lowColor.r) * (energy * 2),
            g: lowColor.g + (midColor.g - lowColor.g) * (energy * 2),
            b: lowColor.b + (midColor.b - lowColor.b) * (energy * 2),
          }

      // Damp scale smoothly (lambda ~15 for smooth interpolation)
      scaleCurrent.current = damp(scaleCurrent.current, scaleTarget, 15, delta)
      meshRef.current.scale.setScalar(scaleCurrent.current)

      // Damp color smoothly
      colorCurrent.current.r = damp(colorCurrent.current.r, colorTarget.r, 15, delta)
      colorCurrent.current.g = damp(colorCurrent.current.g, colorTarget.g, 15, delta)
      colorCurrent.current.b = damp(colorCurrent.current.b, colorTarget.b, 15, delta)

      // Emissive color matches main color but brighter
      emissiveRef.current.r = damp(emissiveRef.current.r, colorTarget.r * 1.2, 15, delta)
      emissiveRef.current.g = damp(emissiveRef.current.g, colorTarget.g * 1.2, 15, delta)
      emissiveRef.current.b = damp(emissiveRef.current.b, colorTarget.b * 1.2, 15, delta)

      // Rotate based on BPM with slight variation
      meshRef.current.rotation.y += delta * (bpm / 120)
      meshRef.current.rotation.x += delta * (bpm / 240) * 0.3
    } else {
      // Default state when no track - idle cursed energy
      scaleCurrent.current = damp(scaleCurrent.current, 1, 15, delta)
      meshRef.current.scale.setScalar(scaleCurrent.current)
      colorCurrent.current.r = damp(colorCurrent.current.r, 138 / 255, 15, delta)
      colorCurrent.current.g = damp(colorCurrent.current.g, 0, 15, delta)
      colorCurrent.current.b = damp(colorCurrent.current.b, 147 / 255, 15, delta)
      emissiveRef.current.r = damp(emissiveRef.current.r, 138 / 255, 15, delta)
      emissiveRef.current.g = damp(emissiveRef.current.g, 0, 15, delta)
      emissiveRef.current.b = damp(emissiveRef.current.b, 147 / 255, 15, delta)
      
      // Slow idle rotation
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
        emissive="#8a0093"
        emissiveIntensity={0.5}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </mesh>
  )
}

