"use client"

import { useMemo } from "react"
import { EffectComposer, Bloom, ChromaticAberration, Noise } from "@react-three/postprocessing"
import { Vector2 } from "three"
import { useSpotifyStore } from "@/store/useSpotifyStore"

export function Effects() {
  const trackData = useSpotifyStore((state) => state.trackData)
  const energy = trackData?.energy ?? 0
  
  const offset = useMemo(() => new Vector2(energy * 0.015, energy * 0.015), [energy])

  return (
    <EffectComposer enableNormalPass={false}>
      <Bloom
        intensity={3.0}
        luminanceThreshold={0.5}
        luminanceSmoothing={0.9}
        height={300}
      />
      <ChromaticAberration
        offset={offset}
        radialModulation={false}
        modulationOffset={0.15}
      />
      <Noise opacity={0.03} />
    </EffectComposer>
  )
}

