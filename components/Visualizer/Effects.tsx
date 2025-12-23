"use client"

import { useEffect, useState } from "react"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { MangaPostProcess } from "./MangaPostProcess"

export function Effects() {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
  }, [])

  return (
    <EffectComposer enableNormalPass={false}>
      <Bloom
        intensity={isMobile ? 1.5 : 2.5}
        luminanceThreshold={isMobile ? 0.7 : 0.5}
        luminanceSmoothing={isMobile ? 0.7 : 0.9}
        height={isMobile ? 200 : 300}
      />
      <MangaPostProcess />
    </EffectComposer>
  )
}
