"use client"

import { useEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import {
  ChromaticAberration,
  DotScreen,
  Effect,
  Noise,
} from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"
import { Vector2, Uniform } from "three"
import { useSpotifyStore } from "@/store/useSpotifyStore"

/**
 * MangaPostProcess
 *
 * Post-processing pipeline for a JJK-style manga aesthetic:
 * - Halftone / dot-screen shading
 * - Audio-driven chromatic aberration
 * - Short-lived impact frame color inversion
 */
export function MangaPostProcess() {
  const intensity = useSpotifyStore((state) => state.intensity)
  const impactFrameId = useSpotifyStore((state) => state.impactFrameId)

  const offsetRef = useRef(new Vector2(0, 0))
  const impactTimerRef = useRef(0)
  const lastImpactIdRef = useRef(impactFrameId)

  const uniforms = useMemo(
    () => ({
      uInvertStrength: new Uniform(0),
    }),
    []
  )

  // Start a brief impact-frame window whenever the id increments
  useEffect(() => {
    if (impactFrameId === 0 || impactFrameId === lastImpactIdRef.current) return

    lastImpactIdRef.current = impactFrameId
    // ~2–3 frames at 60fps
    impactTimerRef.current = 0.08
  }, [impactFrameId])

  // Drive chromatic aberration + impact-frame inversion over time
  useFrame((_, delta) => {
    const base = 0.002
    const extra = intensity * 0.03
    offsetRef.current.set(base + extra, base + extra)

    if (impactTimerRef.current > 0) {
      impactTimerRef.current = Math.max(impactTimerRef.current - delta, 0)
    }

    uniforms.uInvertStrength.value = impactTimerRef.current > 0 ? 1 : 0
  })

  return (
    <>
      {/* Halftone / manga-style dots */}
      <DotScreen
        blendFunction={BlendFunction.MULTIPLY}
        angle={Math.PI / 4}
        scale={1.1}
        opacity={0.5}
      />

      {/* Aggressive chromatic aberration at high energy */}
      <ChromaticAberration
        offset={offsetRef.current}
        radialModulation
        modulationOffset={0.2}
      />

      {/* Subtle film grain */}
      <Noise premultiply opacity={0.035} />

      {/* Impact frame – invert colors briefly when Black Flash triggers */}
      <Effect
        blendFunction={BlendFunction.NORMAL}
        fragmentShader={`
          uniform float uInvertStrength;

          void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
            vec3 color = inputColor.rgb;

            if (uInvertStrength > 0.0) {
              vec3 inverted = vec3(1.0) - color;
              color = mix(color, inverted, uInvertStrength);
            }

            outputColor = vec4(color, inputColor.a);
          }
        `}
        uniforms={uniforms}
      />
    </>
  )
}
