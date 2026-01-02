"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"

export function AudioReactiveParticles() {
  const particlesRef = useRef<THREE.Points>(null)
  const {
    trackData,
    frequencySpectrum,
    beatIntensity,
    selectedCharacter,
    intensity,
  } = useSpotifyStore()
  const character = CHARACTERS[selectedCharacter]
  const isMobile = typeof window !== "undefined" && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  // Optimized particle count
  const particleCount = isMobile ? 200 : 500

  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      // Random starting position
      positions[i3] = (Math.random() - 0.5) * 10
      positions[i3 + 1] = (Math.random() - 0.5) * 10
      positions[i3 + 2] = (Math.random() - 0.5) * 10

      // Character colors
      colors[i3] = character.energy.mid.r
      colors[i3 + 1] = character.energy.mid.g
      colors[i3 + 2] = character.energy.mid.b

      // Random velocity
      velocities[i3] = (Math.random() - 0.5) * 0.02
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02
    }

    return { positions, colors, velocities }
  }, [particleCount, character])

  useFrame((state) => {
    if (!particlesRef.current || !trackData) return

    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
    const colors = particlesRef.current.geometry.attributes.color.array as Float32Array
    const velocities = particles.velocities

    const beat = beatIntensity ?? 0
    const energy = intensity ?? 0
    const bass = frequencySpectrum?.bass ?? 0
    const mid = frequencySpectrum?.mid ?? 0
    const treble = frequencySpectrum?.treble ?? 0

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3

      // Audio-reactive movement
      const audioInfluence = energy * 0.5 + beat * 0.3
      const bassInfluence = bass * 0.3
      const midInfluence = mid * 0.2
      const trebleInfluence = treble * 0.1

      // Update velocity based on frequency spectrum
      velocities[i3] += Math.sin(state.clock.elapsedTime + i) * bassInfluence * 0.001
      velocities[i3 + 1] += Math.cos(state.clock.elapsedTime * 1.2 + i) * midInfluence * 0.001
      velocities[i3 + 2] += Math.sin(state.clock.elapsedTime * 0.8 + i) * trebleInfluence * 0.001

      // Apply velocity
      positions[i3] += velocities[i3] * (1 + audioInfluence)
      positions[i3 + 1] += velocities[i3 + 1] * (1 + audioInfluence)
      positions[i3 + 2] += velocities[i3 + 2] * (1 + audioInfluence)

      // Boundary check and wrap
      const boundary = 8
      if (Math.abs(positions[i3]) > boundary) {
        positions[i3] = (Math.random() - 0.5) * boundary * 2
        velocities[i3] = (Math.random() - 0.5) * 0.02
      }
      if (Math.abs(positions[i3 + 1]) > boundary) {
        positions[i3 + 1] = (Math.random() - 0.5) * boundary * 2
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.02
      }
      if (Math.abs(positions[i3 + 2]) > boundary) {
        positions[i3 + 2] = (Math.random() - 0.5) * boundary * 2
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.02
      }

      // Update colors based on frequency spectrum
      if (frequencySpectrum) {
        const colorIntensity = (bass + mid + treble) / 3
        colors[i3] = character.energy.low.r + (character.energy.high.r - character.energy.low.r) * colorIntensity
        colors[i3 + 1] = character.energy.low.g + (character.energy.high.g - character.energy.low.g) * colorIntensity
        colors[i3 + 2] = character.energy.low.b + (character.energy.high.b - character.energy.low.b) * colorIntensity
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true
    particlesRef.current.geometry.attributes.color.needsUpdate = true
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particles.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

