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
  const scaleCurrent = useRef(1)
  const colorCurrent = useRef({ r: 138 / 255, g: 0, b: 0 })

  useFrame((_state, delta: number) => {
    if (!meshRef.current || !materialRef.current) return

    // Read track data from store (this is efficient - just reading a reference)
    const trackData = useSpotifyStore.getState().trackData
    
    if (trackData) {
      const { energy, bpm } = trackData

      // Calculate target scale based on energy
      const scaleTarget = 1 + energy * 1.5

      // Interpolate color based on energy (deep crimson to neon red/orange)
      const lowColor = { r: 138 / 255, g: 0, b: 0 } // #8a0000
      const highColor = { r: 255 / 255, g: 60 / 255, b: 0 } // #ff3c00

      const colorTarget = {
        r: lowColor.r + (highColor.r - lowColor.r) * energy,
        g: lowColor.g + (highColor.g - lowColor.g) * energy,
        b: lowColor.b + (highColor.b - lowColor.b) * energy,
      }

      // Damp scale smoothly (lambda ~15 for smooth interpolation)
      scaleCurrent.current = damp(scaleCurrent.current, scaleTarget, 15, delta)
      meshRef.current.scale.setScalar(scaleCurrent.current)

      // Damp color smoothly
      colorCurrent.current.r = damp(colorCurrent.current.r, colorTarget.r, 15, delta)
      colorCurrent.current.g = damp(colorCurrent.current.g, colorTarget.g, 15, delta)
      colorCurrent.current.b = damp(colorCurrent.current.b, colorTarget.b, 15, delta)

      // Rotate based on BPM
      meshRef.current.rotation.y += delta * (bpm / 120)
    } else {
      // Default state when no track
      scaleCurrent.current = damp(scaleCurrent.current, 1, 15, delta)
      meshRef.current.scale.setScalar(scaleCurrent.current)
      colorCurrent.current.r = damp(colorCurrent.current.r, 138 / 255, 15, delta)
      colorCurrent.current.g = damp(colorCurrent.current.g, 0, 15, delta)
      colorCurrent.current.b = damp(colorCurrent.current.b, 0, 15, delta)
    }

    materialRef.current.color.setRGB(
      colorCurrent.current.r,
      colorCurrent.current.g,
      colorCurrent.current.b
    )
  })

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <torusKnotGeometry args={[1, 0.3, 256, 32]} />
      <meshPhysicalMaterial
        ref={materialRef}
        metalness={0.9}
        roughness={0.1}
        emissive="#8a0000"
        emissiveIntensity={0.5}
      />
    </mesh>
  )
}

