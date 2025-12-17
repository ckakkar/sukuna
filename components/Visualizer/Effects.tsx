"use client"

import { EffectComposer, Bloom, ChromaticAberration, Noise } from "@react-three/postprocessing"
import { useSpotifyStore } from "@/store/useSpotifyStore"

export function Effects() {
  const trackData = useSpotifyStore((state) => state.trackData)
  const energy = trackData?.energy ?? 0

  return (
    <EffectComposer disableNormalPass>
      <Bloom
        intensity={2.5}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.9}
        height={300}
      />
      <ChromaticAberration
        offset={[energy * 0.01, energy * 0.01]}
      />
      <Noise opacity={0.05} />
    </EffectComposer>
  )
}

