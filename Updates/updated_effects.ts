"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { EffectComposer, Bloom, ChromaticAberration, Noise } from "@react-three/postprocessing"
import { Vector2 } from "three"
import { useSpotifyStore } from "@/store/useSpotifyStore"

export function Effects() {
  const trackData = useSpotifyStore((state) => state.trackData)
  const offsetRef = useRef(new Vector2(0, 0))
  
  // Update offset in animation frame instead of effect
  useFrame(() => {
    const energy = trackData?.energy || 0
    offsetRef.current.set(energy * 0.015, energy * 0.015)
  })

  return (
    <EffectComposer enableNormalPass={false}>
      <Bloom
        intensity={3.0}
        luminanceThreshold={0.5}
        luminanceSmoothing={0.9}
        height={300}
      />
      <ChromaticAberration
        offset={offsetRef.current}
        radialModulation={false}
        modulationOffset={0.15}
      />
      <Noise opacity={0.03} />
    </EffectComposer>
  )
}
