"use client"

import { useRef, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"

export function CameraController() {
  const { camera } = useThree()
  const { selectedCharacter, domainState, beatIntensity, intensity } = useSpotifyStore()
  const character = CHARACTERS[selectedCharacter]
  const cameraRef = useRef(camera)
  const targetPositionRef = useRef(new THREE.Vector3(0, 0, 5))
  const targetRotationRef = useRef(new THREE.Euler(0, 0, 0))
  const isDollyActiveRef = useRef(false)

  useEffect(() => {
    cameraRef.current = camera
  }, [camera])

  // Camera animations based on domain state and character
  useEffect(() => {
    if (domainState === "expanding" || domainState === "active") {
      if (character.id === "gojo") {
        // Gojo: Slow dolly zoom for Unlimited Void
        isDollyActiveRef.current = true
        targetPositionRef.current.set(0, 0, 3) // Zoom in
      } else if (character.id === "sukuna") {
        // Sukuna: Orbit around shrine
        targetPositionRef.current.set(8, 5, 8)
        targetRotationRef.current.set(0, Math.PI / 4, 0)
      } else {
        // Default: Slight zoom
        targetPositionRef.current.set(0, 0, 4)
      }
    } else {
      // Reset to default
      isDollyActiveRef.current = false
      targetPositionRef.current.set(0, 0, 5)
      targetRotationRef.current.set(0, 0, 0)
    }
  }, [domainState, character.id])

  useFrame((state, delta) => {
    const beat = beatIntensity ?? 0
    const energy = intensity ?? 0

    // Smooth camera movement
    const damping = 0.1
    cameraRef.current.position.lerp(targetPositionRef.current, damping)

    // Gojo's dolly zoom effect
    if (isDollyActiveRef.current && character.id === "gojo") {
      const zoomSpeed = 0.01
      const currentZ = cameraRef.current.position.z
      if (currentZ > 2) {
        targetPositionRef.current.z -= zoomSpeed
        // Adjust FOV to maintain size (dolly zoom effect)
        if ("fov" in cameraRef.current) {
          const camera = cameraRef.current as THREE.PerspectiveCamera
          camera.fov = 50 + (5 - currentZ) * 5
          camera.updateProjectionMatrix()
        }
      }
    }

    // Beat-reactive camera shake
    if (beat > 0.7) {
      const shakeIntensity = (beat - 0.7) * 0.3
      cameraRef.current.position.x += (Math.random() - 0.5) * shakeIntensity * 0.1
      cameraRef.current.position.y += (Math.random() - 0.5) * shakeIntensity * 0.1
    }

    // Energy-based camera movement
    if (energy > 0.6) {
      const energyMovement = (energy - 0.6) * 0.5
      cameraRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * energyMovement * 0.5
    }

    // Character-specific camera behaviors
    if (character.id === "sukuna" && domainState === "active") {
      // Orbit around center
      const angle = state.clock.elapsedTime * 0.2
      targetPositionRef.current.set(
        Math.cos(angle) * 8,
        5 + Math.sin(state.clock.elapsedTime * 0.5) * 2,
        Math.sin(angle) * 8
      )
      cameraRef.current.lookAt(0, 0, 0)
    } else if (character.id === "yuji") {
      // Slight rotation for dynamic feel
      cameraRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    }
  })

  return null
}

