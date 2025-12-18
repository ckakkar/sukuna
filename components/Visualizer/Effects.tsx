"use client"

import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { MangaPostProcess } from "./MangaPostProcess"

export function Effects() {
  return (
    <EffectComposer enableNormalPass={false}>
      <Bloom
        intensity={3.0}
        luminanceThreshold={0.5}
        luminanceSmoothing={0.9}
        height={300}
      />
      <MangaPostProcess />
    </EffectComposer>
  )
}
