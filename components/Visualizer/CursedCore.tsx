"use client"

import { useRef, useMemo, useEffect, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import type { Mesh, Points } from "three"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"

const damp = (current: number, target: number, smoothing: number, delta: number) => {
  const t = 1 - Math.exp(-smoothing * delta)
  return current + (target - current) * t
}

// Detect device capability for performance scaling
function useDeviceQuality() {
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('medium')
  
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    const isTablet = /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768
    const pixelRatio = window.devicePixelRatio || 1
    
    // Check GPU capability via WebGL context
    const canvas = document.createElement('canvas')
    const glContext = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    let isLowEndGPU = false
    
    if (glContext && 'getExtension' in glContext) {
      try {
        const webglContext = glContext as WebGLRenderingContext
        const debugInfo = webglContext.getExtension('WEBGL_debug_renderer_info')
        if (debugInfo) {
          const renderer = webglContext.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || ''
          isLowEndGPU = /mali|adreno|powervr|imgtec/i.test(renderer) && !/pro|xt|plus/i.test(renderer)
        }
      } catch (e) {
        // Fallback if extension is not available
        isLowEndGPU = false
      }
    }
    
    if (isMobile && (isLowEndGPU || pixelRatio > 2)) {
      setQuality('low')
    } else if (isMobile || isTablet) {
      setQuality('medium')
    } else {
      setQuality('high')
    }
  }, [])
  
  return quality
}

export function CursedCore() {
  const meshRef = useRef<Mesh>(null)
  const innerMeshRef = useRef<Mesh>(null)
  const particlesRef = useRef<Points>(null)
  const ringRef = useRef<Mesh>(null)
  const slashLinesRef = useRef<THREE.Group>(null)
  
  const { trackData, selectedCharacter, intensity, currentTechnique, beatIntensity } = useSpotifyStore()
  const character = CHARACTERS[selectedCharacter]
  const quality = useDeviceQuality()

  // Optimized particle count based on device quality
  const particles = useMemo(() => {
    const count = quality === 'high' ? 600 : quality === 'medium' ? 300 : 150
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const radius = 3 + Math.random() * 4
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi)
      
      colors[i3] = character.energy.high.r
      colors[i3 + 1] = character.energy.high.g
      colors[i3 + 2] = character.energy.high.b
    }
    
    return { positions, colors, count }
  }, [character, quality])

  // Create slash lines for cleave technique
  const slashLines = useMemo(() => {
    if (currentTechnique !== "cleave") return null
    
    const lines: THREE.Line[] = []
    for (let i = 0; i < 8; i++) {
      const points = []
      const angle = (i / 8) * Math.PI * 2
      const length = 5
      points.push(new THREE.Vector3(0, 0, 0))
      points.push(new THREE.Vector3(
        Math.cos(angle) * length,
        Math.sin(angle) * length,
        (Math.random() - 0.5) * 2
      ))
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const material = new THREE.LineBasicMaterial({
        color: new THREE.Color(character.colors.glow),
        transparent: true,
        opacity: 0,
        linewidth: 2
      })
      const line = new THREE.Line(geometry, material)
      lines.push(line)
    }
    return lines
  }, [currentTechnique, character])

  useFrame((state, delta) => {
    if (!meshRef.current || !innerMeshRef.current || !particlesRef.current) return

    const energy = trackData?.energy ?? 0
    const bpm = trackData?.bpm ?? 120
    const beat = beatIntensity ?? 0

    // Calculate tempo multiplier once for all tempo-synced animations
    const tempoMultiplier = bpm / 120 // Normalize to 120 BPM

    // Optimized main core animation with beat reaction
    const scaleTarget = 1 + energy * 0.8 + beat * 0.4
    const currentScale = meshRef.current.scale.x
    const nextScale = damp(currentScale, scaleTarget, 12, delta)
    meshRef.current.scale.setScalar(nextScale)

    // Tempo-synced inner core rotation
    const innerRotationSpeed = quality === 'high' 
      ? (bpm / 100) * tempoMultiplier 
      : (bpm / 150) * tempoMultiplier
    innerMeshRef.current.rotation.y -= delta * innerRotationSpeed
    innerMeshRef.current.rotation.x += delta * innerRotationSpeed * 0.5
    innerMeshRef.current.scale.setScalar(nextScale * 0.7)

    // Tempo-synced character-specific geometry
    const characterRotationMultiplier = quality === 'high' ? 1 : 0.7
    if (selectedCharacter === "sukuna") {
      meshRef.current.rotation.y += delta * (bpm / 140) * characterRotationMultiplier * tempoMultiplier
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4 * tempoMultiplier) * 0.2
    } else if (selectedCharacter === "gojo") {
      meshRef.current.rotation.y += delta * 0.25 * characterRotationMultiplier * tempoMultiplier
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8 * tempoMultiplier) * 0.15
    } else if (selectedCharacter === "yuji") {
      meshRef.current.rotation.x += delta * (bpm / 200) * characterRotationMultiplier * tempoMultiplier
      meshRef.current.rotation.z += delta * (bpm / 280) * characterRotationMultiplier * tempoMultiplier
    }

    // Optimized particles animation - only update every other frame on lower quality
    const particlePositions = particlesRef.current.geometry.attributes.position.array as Float32Array
    const updateStep = quality === 'low' ? 2 : 1
    const shouldUpdate = quality !== 'low' || Math.floor(state.clock.elapsedTime * 30) % 2 === 0
    
    if (shouldUpdate) {
      for (let i = 0; i < particles.count; i += updateStep) {
        const i3 = i * 3
        const time = state.clock.elapsedTime + i * 0.05
        
        // Tempo-synced spiral motion (using tempoMultiplier from outer scope)
        const baseRadius = 3.5
        const radius = baseRadius + Math.sin(time * 0.3 * tempoMultiplier) * 0.8 + beat * 1.5
        const theta = time * 0.2 * tempoMultiplier + i * 0.08
        const phi = Math.sin(time * 0.15 * tempoMultiplier) * Math.PI * 0.8
        
        particlePositions[i3] = radius * Math.sin(phi) * Math.cos(theta)
        particlePositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) + Math.sin(time * 0.5) * 0.3
        particlePositions[i3 + 2] = radius * Math.cos(phi)
        
        // Interpolate skipped particles for smoother appearance
        if (updateStep > 1 && i + updateStep < particles.count) {
          const nextI3 = (i + updateStep) * 3
          particlePositions[nextI3] = particlePositions[i3]
          particlePositions[nextI3 + 1] = particlePositions[i3 + 1]
          particlePositions[nextI3 + 2] = particlePositions[i3 + 2]
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }

    // Optimized ring pulse - reduced intensity for performance
    if (ringRef.current) {
      const ringScale = 1 + energy * 0.3 + beat * 0.8
      ringRef.current.scale.setScalar(damp(ringRef.current.scale.x, ringScale, 10, delta))
      ringRef.current.rotation.z += delta * 0.3
      
      const ringMaterial = ringRef.current.material as THREE.MeshStandardMaterial
      ringMaterial.emissiveIntensity = 0.4 + beat * 1.2
    }

    // Cleave technique slash animation
    if (slashLinesRef.current && currentTechnique === "cleave" && beat > 0.5) {
      slashLinesRef.current.children.forEach((line, i) => {
        const material = (line as THREE.Line).material as THREE.LineBasicMaterial
        material.opacity = Math.max(0, material.opacity - delta * 2)
        
        if (beat > 0.7 && Math.random() > 0.7) {
          material.opacity = 1
          line.rotation.z = Math.random() * Math.PI * 2
        }
      })
    }

    // Optimized dynamic material colors - only update when change is significant
    const material = meshRef.current.material as THREE.MeshPhysicalMaterial
    const colorIntensity = Math.max(energy, beat * 0.7)
    
    if (colorIntensity > 0.1 || quality === 'high') {
      const colorTarget = energy > 0.5
        ? {
            r: character.energy.mid.r + (character.energy.high.r - character.energy.mid.r) * ((energy - 0.5) * 2),
            g: character.energy.mid.g + (character.energy.high.g - character.energy.mid.g) * ((energy - 0.5) * 2),
            b: character.energy.mid.b + (character.energy.high.b - character.energy.mid.b) * ((energy - 0.5) * 2),
          }
        : {
            r: character.energy.low.r + (character.energy.mid.r - character.energy.low.r) * (energy * 2),
            g: character.energy.low.g + (character.energy.mid.g - character.energy.low.g) * (energy * 2),
            b: character.energy.low.b + (character.energy.mid.b - character.energy.low.b) * (energy * 2),
          }

      const currentColor = material.color
      const dampingFactor = quality === 'high' ? 12 : 8
      material.color.setRGB(
        damp(currentColor.r, colorTarget.r, dampingFactor, delta),
        damp(currentColor.g, colorTarget.g, dampingFactor, delta),
        damp(currentColor.b, colorTarget.b, dampingFactor, delta)
      )
      
      material.emissive.setRGB(
        Math.min(colorTarget.r * 1.3, 1),
        Math.min(colorTarget.g * 1.3, 1),
        Math.min(colorTarget.b * 1.3, 1)
      )
    }
    
    material.emissiveIntensity = 0.6 + energy * 0.3 + beat * 0.8
  })

  // Optimized geometry based on quality
  const torusKnotTubularSegments = quality === 'high' ? 128 : quality === 'medium' ? 64 : 48
  const torusKnotRadialSegments = quality === 'high' ? 16 : quality === 'medium' ? 12 : 8
  const octahedronDetail = quality === 'high' ? 2 : quality === 'medium' ? 1 : 0

  return (
    <group>
      {/* Main cursed energy core - simplified geometry for performance */}
      <mesh ref={meshRef} castShadow={quality !== 'low'} receiveShadow={quality !== 'low'}>
        <torusKnotGeometry args={[1, 0.3, torusKnotTubularSegments, torusKnotRadialSegments, 2, 3]} />
        <meshPhysicalMaterial
          metalness={0.85}
          roughness={0.1}
          emissive={character.colors.glow}
          emissiveIntensity={0.6}
          clearcoat={quality === 'high' ? 1 : 0.8}
          clearcoatRoughness={0.15}
          transmission={quality === 'high' ? 0.1 : 0}
        />
      </mesh>

      {/* Inner rotating core - simplified detail */}
      <mesh ref={innerMeshRef} castShadow={quality !== 'low'}>
        <octahedronGeometry args={[0.8, octahedronDetail]} />
        <meshPhysicalMaterial
          color={character.colors.accent}
          metalness={0.75}
          roughness={0.25}
          emissive={character.colors.secondary}
          emissiveIntensity={1.0}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Cursed energy particles */}
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
          size={0.05}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Energy ring - simplified geometry */}
      {quality !== 'low' && (
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2, 0.05, 12, quality === 'high' ? 64 : 32]} />
          <meshStandardMaterial
            color={character.colors.glow}
            emissive={character.colors.glow}
            emissiveIntensity={0.4}
            transparent
            opacity={0.5}
          />
        </mesh>
      )}

      {/* Cleave slash lines */}
      {slashLines && (
        <group ref={slashLinesRef}>
          {slashLines.map((line, i) => (
            <primitive key={i} object={line} />
          ))}
        </group>
      )}
    </group>
  )
}