"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import type { Mesh, Points } from "three"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"

const damp = (current: number, target: number, smoothing: number, delta: number) => {
  const t = 1 - Math.exp(-smoothing * delta)
  return current + (target - current) * t
}

export function CursedCore() {
  const meshRef = useRef<Mesh>(null)
  const innerMeshRef = useRef<Mesh>(null)
  const particlesRef = useRef<Points>(null)
  const ringRef = useRef<Mesh>(null)
  const slashLinesRef = useRef<THREE.Group>(null)
  
  const { trackData, selectedCharacter, intensity, currentTechnique, beatIntensity } = useSpotifyStore()
  const character = CHARACTERS[selectedCharacter]

  // Create cursed energy particles
  const particles = useMemo(() => {
    const count = 2000
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
  }, [character])

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

    // Main core animation with beat reaction
    const scaleTarget = 1 + energy * 1.2 + beat * 0.65
    const currentScale = meshRef.current.scale.x
    const nextScale = damp(currentScale, scaleTarget, 20, delta)
    meshRef.current.scale.setScalar(nextScale)

    // Inner core counter-rotation
    innerMeshRef.current.rotation.y -= delta * (bpm / 100)
    innerMeshRef.current.rotation.x += delta * (bpm / 200)
    innerMeshRef.current.scale.setScalar(nextScale * 0.7)

    // Character-specific geometry
    if (selectedCharacter === "sukuna") {
      meshRef.current.rotation.y += delta * (bpm / 120) * 1.5
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
    } else if (selectedCharacter === "gojo") {
      meshRef.current.rotation.y += delta * 0.3
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2
    } else if (selectedCharacter === "yuji") {
      meshRef.current.rotation.x += delta * (bpm / 180)
      meshRef.current.rotation.z += delta * (bpm / 240)
    }

    // Particles animation
    const particlePositions = particlesRef.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < particles.count; i++) {
      const i3 = i * 3
      const time = state.clock.elapsedTime + i * 0.1
      
      // Spiral outward on beat
      const radius = 3 + Math.sin(time * 0.5) * 0.8 + beat * 1.6
      const theta = time * 0.3 + i * 0.1
      const phi = Math.sin(time * 0.2) * Math.PI
      
      particlePositions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      particlePositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) + Math.sin(time) * 0.5
      particlePositions[i3 + 2] = radius * Math.cos(phi)
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true

    // Ring pulse on beat
    if (ringRef.current) {
      const ringScale = 1 + energy * 0.4 + beat * 1.2
      ringRef.current.scale.setScalar(damp(ringRef.current.scale.x, ringScale, 15, delta))
      ringRef.current.rotation.z += delta * 0.5
      
      const ringMaterial = ringRef.current.material as THREE.MeshStandardMaterial
      ringMaterial.emissiveIntensity = 0.5 + beat * 1.6
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

    // Dynamic material colors
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

    const material = meshRef.current.material as THREE.MeshPhysicalMaterial
    const currentColor = material.color
    material.color.setRGB(
      damp(currentColor.r, colorTarget.r, 15, delta),
      damp(currentColor.g, colorTarget.g, 15, delta),
      damp(currentColor.b, colorTarget.b, 15, delta)
    )
    
    material.emissive.setRGB(
      Math.min(colorTarget.r * 1.5, 1),
      Math.min(colorTarget.g * 1.5, 1),
      Math.min(colorTarget.b * 1.5, 1)
    )
    material.emissiveIntensity = 0.7 + energy * 0.4 + beat * 1.2
  })

  return (
    <group>
      {/* Main cursed energy core */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <torusKnotGeometry args={[1, 0.3, 256, 32, 2, 3]} />
        <meshPhysicalMaterial
          metalness={0.9}
          roughness={0.05}
          emissive={character.colors.glow}
          emissiveIntensity={0.7}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transmission={0.1}
        />
      </mesh>

      {/* Inner rotating core */}
      <mesh ref={innerMeshRef} castShadow>
        <octahedronGeometry args={[0.8, 2]} />
        <meshPhysicalMaterial
          color={character.colors.accent}
          metalness={0.8}
          roughness={0.2}
          emissive={character.colors.secondary}
          emissiveIntensity={1.2}
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

      {/* Energy ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2, 0.05, 16, 100]} />
        <meshStandardMaterial
          color={character.colors.glow}
          emissive={character.colors.glow}
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>

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