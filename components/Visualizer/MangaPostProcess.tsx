"use client"

import { forwardRef, useEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { ChromaticAberration, DotScreen, Noise, Vignette } from "@react-three/postprocessing"
import { BlendFunction, Effect } from "postprocessing"
import { Vector2, Vector3, Uniform } from "three"
import { useSpotifyStore } from "@/store/useSpotifyStore"

// Impact frame shader for dramatic beat hits
const IMPACT_FRAGMENT_SHADER = /* glsl */ `
  uniform float uInvertStrength;
  uniform float uFlashStrength;
  uniform vec3 uFlashColor;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec3 color = inputColor.rgb;

    // Color inversion on strong beats
    if (uInvertStrength > 0.0) {
      vec3 inverted = vec3(1.0) - color;
      color = mix(color, inverted, uInvertStrength);
    }

    // Flash overlay
    if (uFlashStrength > 0.0) {
      color = mix(color, uFlashColor, uFlashStrength);
    }

    // Slightly boost contrast on beats
    color = pow(color, vec3(1.0 + uInvertStrength * 0.3));

    outputColor = vec4(color, inputColor.a);
  }
`;

// Slash effect shader for cleave technique
const SLASH_FRAGMENT_SHADER = /* glsl */ `
  uniform float uSlashIntensity;
  uniform float uSlashAngle;
  uniform float uTime;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec3 color = inputColor.rgb;

    if (uSlashIntensity > 0.0) {
      // Create diagonal slash lines
      vec2 rotated = vec2(
        uv.x * cos(uSlashAngle) - uv.y * sin(uSlashAngle),
        uv.x * sin(uSlashAngle) + uv.y * cos(uSlashAngle)
      );

      // Multiple parallel slash lines
      float slash = 0.0;
      for (float i = 0.0; i < 3.0; i++) {
        float offset = (i - 1.0) * 0.05;
        float line = smoothstep(0.002, 0.0, abs(rotated.y - offset - sin(uTime * 10.0) * 0.01));
        slash += line;
      }

      // Add displacement along slash
      vec2 slashDisplace = vec2(
        sin(uSlashAngle) * slash * uSlashIntensity * 0.02,
        cos(uSlashAngle) * slash * uSlashIntensity * 0.02
      );

      // Sample displaced color
      vec2 displacedUV = uv + slashDisplace;
      color = mix(color, vec3(1.0), slash * uSlashIntensity);
    }

    outputColor = vec4(color, inputColor.a);
  }
`;

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

  get invertUniform() {
    return this.uniforms.get("uInvertStrength") as Uniform<number>
  }

  get flashUniform() {
    return this.uniforms.get("uFlashStrength") as Uniform<number>
  }

  get flashColorUniform() {
    return this.uniforms.get("uFlashColor") as Uniform<Vector3>
  }
}

class SlashEffectImpl extends Effect {
  constructor() {
    super("SlashEffect", SLASH_FRAGMENT_SHADER, {
      uniforms: new Map<string, Uniform>([
        ["uSlashIntensity", new Uniform(0)],
        ["uSlashAngle", new Uniform(0)],
        ["uTime", new Uniform(0)],
      ]),
    })
  }

  get intensityUniform() {
    return this.uniforms.get("uSlashIntensity") as Uniform<number>
  }

  get angleUniform() {
    return this.uniforms.get("uSlashAngle") as Uniform<number>
  }

  get timeUniform() {
    return this.uniforms.get("uTime") as Uniform<number>
  }
}

const ImpactFrame = forwardRef<ImpactFrameEffectImpl>((_, ref) => {
  const effect = useMemo(() => new ImpactFrameEffectImpl(), [])
  return <primitive ref={ref} object={effect} dispose={null} />
})

ImpactFrame.displayName = "ImpactFrame"

const SlashEffect = forwardRef<SlashEffectImpl>((_, ref) => {
  const effect = useMemo(() => new SlashEffectImpl(), [])
  return <primitive ref={ref} object={effect} dispose={null} />
})

SlashEffect.displayName = "SlashEffect"

export function MangaPostProcess() {
  const { 
    intensity, 
    impactFrameId, 
    beatIntensity, 
    currentTechnique, 
    selectedCharacter 
  } = useSpotifyStore()

  const offsetRef = useRef(new Vector2(0, 0))
  const impactTimerRef = useRef(0)
  const flashTimerRef = useRef(0)
  const slashTimerRef = useRef(0)
  const lastImpactIdRef = useRef(impactFrameId)
  const lastBeatTimeRef = useRef(0)
  const impactEffectRef = useRef<ImpactFrameEffectImpl | null>(null)
  const slashEffectRef = useRef<SlashEffectImpl | null>(null)

  // Trigger impact frame on new impact events
  useEffect(() => {
    if (impactFrameId === 0 || impactFrameId === lastImpactIdRef.current) return

    lastImpactIdRef.current = impactFrameId
    impactTimerRef.current = 0.15 // Longer duration for more dramatic effect
    flashTimerRef.current = 0.1
  }, [impactFrameId])

  // Trigger slash effect on beats when using cleave technique
  useEffect(() => {
    if (currentTechnique === "cleave" && beatIntensity && beatIntensity > 0.6) {
      const now = performance.now()
      if (now - lastBeatTimeRef.current > 300) {
        slashTimerRef.current = 0.4
        lastBeatTimeRef.current = now
      }
    }
  }, [beatIntensity, currentTechnique])

  // Animate effects over time
  useFrame((state, delta) => {
    const beat = beatIntensity ?? 0
    const energy = intensity ?? 0

    // Dynamic chromatic aberration based on energy and beats
    const baseAberration = 0.001
    const energyAberration = energy * 0.016
    const beatAberration = beat * 0.032
    offsetRef.current.set(
      baseAberration + energyAberration + beatAberration,
      baseAberration + energyAberration + beatAberration
    )

    // Impact frame animation
    if (impactTimerRef.current > 0) {
      impactTimerRef.current = Math.max(impactTimerRef.current - delta, 0)
    }

    if (flashTimerRef.current > 0) {
      flashTimerRef.current = Math.max(flashTimerRef.current - delta, 0)
    }

    if (impactEffectRef.current) {
      // Invert colors briefly
      impactEffectRef.current.invertUniform.value = 
        impactTimerRef.current > 0 ? Math.min(impactTimerRef.current / 0.15, 1) : 0

      // White flash on very strong beats
      impactEffectRef.current.flashUniform.value = 
        flashTimerRef.current > 0 ? Math.min(flashTimerRef.current / 0.1, 1) * 0.5 : 0
    }

    // Slash effect animation
    if (slashTimerRef.current > 0) {
      slashTimerRef.current = Math.max(slashTimerRef.current - delta * 2, 0)
    }

    if (slashEffectRef.current) {
      slashEffectRef.current.intensityUniform.value = 
        slashTimerRef.current > 0 ? Math.min(slashTimerRef.current / 0.4, 1) : 0
      
      // Random slash angle for variety
      if (slashTimerRef.current === 0.4) {
        slashEffectRef.current.angleUniform.value = 
          (Math.random() * Math.PI / 4) + Math.PI / 4 // 45-90 degrees
      }
      
      slashEffectRef.current.timeUniform.value = state.clock.elapsedTime
    }
  })

  return (
    <>
      {/* Manga-style halftone shading */}
      <DotScreen
        blendFunction={BlendFunction.MULTIPLY}
        angle={Math.PI / 4}
        scale={1.2}
        opacity={0.4}
      />

      {/* Dynamic chromatic aberration */}
      <ChromaticAberration
        offset={offsetRef.current}
        radialModulation
        modulationOffset={0.15}
      />

      {/* Film grain */}
      <Noise 
        premultiply 
        opacity={0.05 + (intensity ?? 0) * 0.03} 
      />

      {/* Vignette effect for focus */}
      <Vignette
        offset={0.3}
        darkness={0.5 + (intensity ?? 0) * 0.3}
        eskil={false}
      />

      {/* Impact frame - dramatic color effects */}
      <ImpactFrame ref={impactEffectRef} />

      {/* Slash effect for cleave technique */}
      <SlashEffect ref={slashEffectRef} />
    </>
  )
}