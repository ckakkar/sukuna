// @ts-nocheck
"use client"

import { forwardRef, useEffect, useMemo, useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { ChromaticAberration, EffectComposer, Noise, Vignette } from "@react-three/postprocessing"
import { BlendFunction, Effect } from "postprocessing"
import { Vector2, Vector3, Uniform } from "three"
import { useSpotifyStore } from "@/store/useSpotifyStore"

// Cast to any to avoid "Type 'undefined' is not assignable to type 'Element'" errors
const NoiseAny = Noise as unknown as React.FC<any>
const VignetteAny = Vignette as unknown as React.FC<any>

// -----------------------------------------------------------------------------
// SHADER: IMPACT FRAME (Inversion + Flash)
// -----------------------------------------------------------------------------
const IMPACT_FRAGMENT_SHADER = /* glsl */ `
  uniform float uInvertStrength;
  uniform float uFlashStrength;
  uniform vec3 uFlashColor;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec3 color = inputColor.rgb;

    // Invert colors based on strength
    if (uInvertStrength > 0.0) {
      vec3 inverted = vec3(1.0) - color;
      color = mix(color, inverted, uInvertStrength);
    }

    // Flash overlay
    if (uFlashStrength > 0.0) {
      color = mix(color, uFlashColor, uFlashStrength);
    }
    
    // High contrast for dramatic effect
    color = pow(color, vec3(1.0 + uInvertStrength * 0.5));

    outputColor = vec4(color, inputColor.a);
  }
`;

// -----------------------------------------------------------------------------
// SHADER: MANGA HALFTONE + INK
// -----------------------------------------------------------------------------
const MANGA_FRAGMENT_SHADER = /* glsl */ `
  uniform float uDotScale;
  uniform float uInkStrength;
  uniform vec2 uResolution;

  float luma(vec3 color) {
    return dot(color, vec3(0.299, 0.587, 0.114));
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec3 color = inputColor.rgb;
    float luminosity = luma(color);

    // Halftone Pattern
    vec2 pixel = uv * uResolution;
    vec2 grid = fract(pixel / uDotScale) - 0.5;
    float dist = length(grid);
    float radius = (1.0 - luminosity) * 0.7; // Darker areas = larger dots
    
    float pattern = smoothstep(radius, radius + 0.1, dist);
    
    // Mix pattern based on luminosity (lighter areas get less pattern)
    vec3 mangaColor = mix(vec3(0.0), vec3(1.0), pattern);
    
    // Blend with original color but desaturated/posterized
    vec3 posterized = floor(color * 4.0) / 4.0;
    vec3 finalColor = mix(posterized, mangaColor, 0.15); // Subtle blend
    
    outputColor = vec4(finalColor, inputColor.a);
  }
`;

// -----------------------------------------------------------------------------
// EFFECT IMPLEMENTATIONS
// -----------------------------------------------------------------------------

class ImpactFrameEffectImpl extends Effect {
  constructor() {
    super("ImpactFrameEffect", IMPACT_FRAGMENT_SHADER, {
      uniforms: new Map<string, Uniform>([
        ["uInvertStrength", new Uniform(0)],
        ["uFlashStrength", new Uniform(0)],
        ["uFlashColor", new Uniform(new Vector3(1, 1, 1))],
      ]),
    })
  }
  get invertUniform() { return this.uniforms.get("uInvertStrength") as Uniform<number> }
  get flashUniform() { return this.uniforms.get("uFlashStrength") as Uniform<number> }
}

class MangaEffectImpl extends Effect {
  constructor() {
    super("MangaEffect", MANGA_FRAGMENT_SHADER, {
      uniforms: new Map<string, Uniform>([
        ["uDotScale", new Uniform(6.0)],
        ["uInkStrength", new Uniform(0.5)],
        ["uResolution", new Uniform(new Vector2(window.innerWidth, window.innerHeight))],
      ]),
    })
  }
}

// -----------------------------------------------------------------------------
// WRAPPERS
// -----------------------------------------------------------------------------

const ImpactFrame = forwardRef<ImpactFrameEffectImpl>((_, ref) => {
  const effect = useMemo(() => new ImpactFrameEffectImpl(), [])
  return <primitive ref={ref} object={effect} dispose={null} />
})
ImpactFrame.displayName = "ImpactFrame"

const MangaEffect = forwardRef<MangaEffectImpl>((_, ref) => {
  const effect = useMemo(() => new MangaEffectImpl(), [])
  // Update resolution on resize
  useEffect(() => {
    const handleResize = () => {
      effect.uniforms.get("uResolution")!.value.set(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [effect])
  return <primitive ref={ref} object={effect} dispose={null} />
})
MangaEffect.displayName = "MangaEffect"


// -----------------------------------------------------------------------------
// MAIN COMPONENT
// -----------------------------------------------------------------------------

export function MangaPostProcess() {
  const {
    intensity,
    impactFrameId,
    beatIntensity
  } = useSpotifyStore()

  const [isMobile, setIsMobile] = useState(false)
  const impactTimerRef = useRef(0)
  const flashTimerRef = useRef(0)
  const lastImpactIdRef = useRef(impactFrameId)
  const impactEffectRef = useRef<ImpactFrameEffectImpl | null>(null)

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
  }, [])

  // Trigger impact frame on new impact events
  useEffect(() => {
    if (impactFrameId === 0 || impactFrameId === lastImpactIdRef.current) return
    lastImpactIdRef.current = impactFrameId

    // Trigger intense visual flash
    impactTimerRef.current = 0.2 // Invert duration
    flashTimerRef.current = 0.15 // Flash duration
  }, [impactFrameId])

  useFrame((state, delta) => {
    const beat = beatIntensity ?? 0
    const energy = intensity ?? 0



    // 2. Impact Frame Animation
    // -----------------------------------------
    if (impactTimerRef.current > 0) {
      impactTimerRef.current = Math.max(impactTimerRef.current - delta, 0)
    }
    if (flashTimerRef.current > 0) {
      flashTimerRef.current = Math.max(flashTimerRef.current - delta, 0)
    }

    if (impactEffectRef.current) {
      // Invert colors: 1.0 when active, instantly 0 when timer ends (hard cut)
      impactEffectRef.current.invertUniform.value = impactTimerRef.current > 0 ? 1.0 : 0.0

      // Flash varies smoothly
      const flashProgress = flashTimerRef.current / 0.15
      impactEffectRef.current.flashUniform.value = flashTimerRef.current > 0 ? flashProgress : 0.0
    }
  })

  return (
    <EffectComposer disableNormalPass>
      {/* 1. Manga Halftone & Ink - The Core Aesthetic */}
      {!isMobile ? <MangaEffect /> : <></>}



      {/* 3. Noise - Paper Texture */}
      <NoiseAny
        premultiply
        opacity={isMobile ? 0.05 : 0.08}
        blendFunction={BlendFunction.OVERLAY}
      />

      {/* 4. Vignette - Dramatic Focus */}
      <VignetteAny
        offset={0.2}
        darkness={0.6}
        eskil={false}
      />

      {/* 5. Impact Frame - The "Drop" */}
      <ImpactFrame ref={impactEffectRef} />
    </EffectComposer>
  )
}