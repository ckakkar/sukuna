"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"
import { getVisibleTextColor } from "@/lib/utils/colorUtils"
import { Button } from "./shared/Button"

const ONBOARDING_STORAGE_KEY = "jjk-visualizer-onboarding-completed"

interface OnboardingStep {
  id: string
  title: string
  description: string
  image?: string
  highlight?: string
}

const steps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to the Domain",
    description: "Experience your music through the lens of Jujutsu Kaisen. Each character brings their unique cursed energy to your tracks.",
  },
  {
    id: "characters",
    title: "Choose Your Sorcerer",
    description: "Select from 8 powerful characters. Each has unique visual effects, domain expansions, and techniques that react to your music.",
    highlight: "[data-character-selector]",
  },
  {
    id: "player",
    title: "Control Your Domain",
    description: "Use the music player to control playback, browse playlists, search tracks, and manage your queue. Everything reacts to the audio.",
    highlight: "[data-music-player]",
  },
  {
    id: "domain",
    title: "Domain Expansion",
    description: "Press 'D' or trigger domain expansion when tracks change. Each character's domain creates a unique immersive environment.",
  },
  {
    id: "shortcuts",
    title: "Keyboard Shortcuts",
    description: "Use keyboard shortcuts for quick control: D (Domain), T (Technique), 1-8 (Characters), F (Fullscreen), and more. Press '?' to see all shortcuts.",
  },
  {
    id: "ready",
    title: "Ready to Begin",
    description: "Connect your Spotify account and start your journey. The cursed energy awaits!",
  },
]

export function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const { selectedCharacter, accessToken } = useSpotifyStore()
  const character = CHARACTERS[selectedCharacter]

  useEffect(() => {
    // Check if onboarding was already completed
    const completed = localStorage.getItem(ONBOARDING_STORAGE_KEY)
    if (!completed) {
      setIsVisible(true)
    }
  }, [])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    handleComplete()
  }

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, "true")
    setIsVisible(false)
  }

  if (!isVisible) return null

  const step = steps[currentStep]
  const textColor = getVisibleTextColor(character.colors.primary, character.colors.glow, character.colors.secondary)

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleSkip}
          />

          {/* Onboarding Card */}
          <motion.div
            className="relative z-10 w-full max-w-2xl mx-4 glass-modern rounded-3xl p-8 sm:p-12 border-2"
            style={{
              borderColor: character.colors.glow,
              boxShadow: `0 20px 60px rgba(0,0,0,0.8), 0 0 40px ${character.colors.glow}60`,
              background: `linear-gradient(135deg, ${character.colors.primary}20, ${character.colors.glow}10)`,
            }}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Progress indicator */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span
                  className="text-sm font-mono"
                  style={{ color: textColor }}
                >
                  Step {currentStep + 1} of {steps.length}
                </span>
                <button
                  onClick={handleSkip}
                  className="text-sm opacity-70 hover:opacity-100 transition-opacity"
                  style={{ color: textColor }}
                >
                  Skip
                </button>
              </div>
              <div className="h-1 bg-black/40 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${character.colors.primary}, ${character.colors.glow})`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Step content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2
                  className="text-3xl sm:text-4xl font-bold mb-4 font-mono tracking-wider"
                  style={{
                    color: textColor,
                    textShadow: `0 0 20px ${character.colors.glow}60`,
                  }}
                >
                  {step.title}
                </h2>
                <p
                  className="text-lg sm:text-xl mb-8 leading-relaxed opacity-90"
                  style={{ color: textColor }}
                >
                  {step.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center gap-4">
              <Button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                variant="secondary"
                style={{
                  borderColor: character.colors.glow,
                  color: textColor,
                }}
              >
                Previous
              </Button>

              <div className="flex gap-2">
                {steps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentStep ? "w-8" : ""
                    }`}
                    style={{
                      backgroundColor:
                        index === currentStep
                          ? character.colors.glow
                          : "rgba(255,255,255,0.3)",
                    }}
                    aria-label={`Go to step ${index + 1}`}
                  />
                ))}
              </div>

              <Button
                onClick={handleNext}
                style={{
                  background: `linear-gradient(135deg, ${character.colors.primary}, ${character.colors.glow})`,
                  color: textColor,
                }}
              >
                {currentStep === steps.length - 1 ? "Begin" : "Next"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

