"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS, type CharacterType } from "@/lib/types/character"

export function DomainEnvironments() {
  const { selectedCharacter, domainState, beatIntensity } = useSpotifyStore()
  const character = CHARACTERS[selectedCharacter]
  const isActive = domainState === "active" || domainState === "expanding"
  const isMobile = typeof window !== "undefined" && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  if (!isActive) return null
  
  // Simplified environments on mobile
  if (isMobile) {
    return <SimplifiedEnvironment character={character} />
  }

  // Character-specific environment
  if (character.id === "sukuna") {
    return <MalevolentShrine character={character} />
  } else if (character.id === "gojo") {
    return <UnlimitedVoid character={character} />
  } else if (character.id === "yuji") {
    return <DarkUrban character={character} />
  } else if (character.id === "yuta") {
    return <PureWhiteSpace character={character} />
  }

  return null
}

// Sukuna's Malevolent Shrine
function MalevolentShrine({ character }: { character: typeof CHARACTERS[CharacterType] }) {
  const groupRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const { beatIntensity } = useSpotifyStore()

  // Create shrine architecture (simplified)
  const shrineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const vertices: number[] = []

    // Create skeletal architecture structure
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2
      const radius = 5 + Math.random() * 2
      const height = 2 + Math.random() * 3

      vertices.push(
        Math.cos(angle) * radius,
        -2,
        Math.sin(angle) * radius,
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      )
    }

    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3))
    return geometry
  }, [])

  // Floating debris particles
  const debrisParticles = useMemo(() => {
    const count = 100
    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = Math.random() * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
    }

    return positions
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }

    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      const beat = beatIntensity ?? 0

      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.elapsedTime + i) * 0.01 * (1 + beat)
        if (positions[i + 1] > 10) positions[i + 1] = -2
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef}>
      {/* Skeletal architecture */}
      <lineSegments>
        <primitive object={shrineGeometry} />
        <lineBasicMaterial color={character.colors.glow} opacity={0.6} transparent />
      </lineSegments>

      {/* Floating debris */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[debrisParticles, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color={character.colors.glow}
          size={0.1}
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>

      {/* Red energy fog */}
      <mesh position={[0, 0, -5]}>
        <planeGeometry args={[30, 30]} />
        <meshBasicMaterial
          color={character.colors.glow}
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

// Gojo's Unlimited Void
function UnlimitedVoid({ character }: { character: typeof CHARACTERS[CharacterType] }) {
  const particlesRef = useRef<THREE.Points>(null)
  const { beatIntensity } = useSpotifyStore()

  // Information particles
  const infoParticles = useMemo(() => {
    const count = 500
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30

      colors[i * 3] = character.colors.glow.r
      colors[i * 3 + 1] = character.colors.glow.g
      colors[i * 3 + 2] = character.colors.glow.b
    }

    return { positions, colors }
  }, [character])

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      const beat = beatIntensity ?? 0

      for (let i = 0; i < positions.length; i += 3) {
        // Slow motion effect (0.5x speed)
        positions[i] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.001 * (1 + beat * 0.5)
        positions[i + 1] += Math.cos(state.clock.elapsedTime * 0.5 + i) * 0.001 * (1 + beat * 0.5)
        positions[i + 2] += Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.001 * (1 + beat * 0.5)
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group>
      {/* Information particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[infoParticles.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[infoParticles.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Blue energy ribbons */}
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[0, (i - 2) * 2, 0]}>
          <planeGeometry args={[20, 0.5]} />
          <meshBasicMaterial
            color={character.colors.glow}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}

// Yuji's Dark Urban Environment
function DarkUrban({ character }: { character: typeof CHARACTERS[CharacterType] }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02
    }
  })

  return (
    <group ref={groupRef}>
      {/* Urban structures (simplified) */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const distance = 8
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * distance, 0, Math.sin(angle) * distance]}
          >
            <boxGeometry args={[1, 3 + Math.random() * 2, 1]} />
            <meshStandardMaterial
              color="#1a1a1a"
              emissive={character.colors.glow}
              emissiveIntensity={0.1}
            />
          </mesh>
        )
      })}

      {/* Red energy particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array(
                Array.from({ length: 200 }, () => [
                  (Math.random() - 0.5) * 20,
                  Math.random() * 10,
                  (Math.random() - 0.5) * 20,
                ]).flat()
              ),
              3,
            ]}
          />
        </bufferGeometry>
        <pointsMaterial
          color={character.colors.glow}
          size={0.05}
          transparent
          opacity={0.8}
        />
      </points>
    </group>
  )
}

// Yuta's Pure White Space
function PureWhiteSpace({ character }: { character: typeof CHARACTERS[CharacterType] }) {
  return (
    <group>
      {/* Pure white background */}
      <mesh>
        <sphereGeometry args={[50, 32, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Blue accent particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array(
                Array.from({ length: 300 }, () => [
                  (Math.random() - 0.5) * 30,
                  (Math.random() - 0.5) * 30,
                  (Math.random() - 0.5) * 30,
                ]).flat()
              ),
              3,
            ]}
          />
        </bufferGeometry>
        <pointsMaterial
          color={character.colors.glow}
          size={0.03}
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
    </group>
  )
}

// Simplified environment for mobile devices
function SimplifiedEnvironment({ character }: { character: typeof CHARACTERS[CharacterType] }) {
  return (
    <group>
      {/* Simple colored fog */}
      <mesh>
        <sphereGeometry args={[30, 16, 16]} />
        <meshBasicMaterial
          color={character.colors.glow}
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Reduced particle count */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array(
                Array.from({ length: 50 }, () => [
                  (Math.random() - 0.5) * 20,
                  (Math.random() - 0.5) * 20,
                  (Math.random() - 0.5) * 20,
                ]).flat()
              ),
              3,
            ]}
          />
        </bufferGeometry>
        <pointsMaterial
          color={character.colors.glow}
          size={0.05}
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
    </group>
  )
}

