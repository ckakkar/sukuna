"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS, type CharacterType } from "@/lib/types/character"
import { cn } from "@/lib/utils/cn"
import { useCharacterImage } from "@/hooks/useCharacterImage"
import Image from "next/image"

export function CharacterSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const { selectedCharacter, setSelectedCharacter } = useSpotifyStore()
  const currentChar = CHARACTERS[selectedCharacter]
  const { imageUrl } = useCharacterImage(selectedCharacter)

  const handleSelect = (id: CharacterType) => {
    setSelectedCharacter(id)
    setIsOpen(false)
  }

  // Pre-calculate roster layout
  const roster = Object.values(CHARACTERS)

  return (
    <div className="relative z-50 pointer-events-auto">
      {/* Trigger Button - Character Portrait */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative w-11 h-11 sm:w-14 sm:h-14 rounded-xl overflow-hidden shadow-md"
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {imageUrl ? (
          <div className="relative w-full h-full">
            <Image
              src={imageUrl}
              alt={currentChar.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              unoptimized
            />
          </div>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center font-semibold text-white text-lg"
            style={{ backgroundColor: currentChar.colors.primary }}
          >
            {currentChar.japaneseName.charAt(0)}
          </div>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 right-14 sm:right-16 w-[260px] sm:w-[300px] rounded-2xl bg-white/95 backdrop-blur-xl border border-black/5 shadow-xl p-4"
          >
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-black/5">
              <h3 className="font-semibold text-sm text-manga-ink">Character</h3>
              <span className="text-xs text-manga-ink/50">{roster.length} sorcerers</span>
            </div>

            <div className="grid grid-cols-1 gap-1.5 max-h-[320px] overflow-y-auto">
              {roster.map((char) => (
                <CharacterOption
                  key={char.id}
                  char={char}
                  isSelected={selectedCharacter === char.id}
                  onSelect={() => handleSelect(char.id)}
                />
              ))}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CharacterOption({ char, isSelected, onSelect }: { char: typeof CHARACTERS[keyof typeof CHARACTERS], isSelected: boolean, onSelect: () => void }) {
  const { imageUrl } = useCharacterImage(char.id)

  return (
    <motion.button
      onClick={onSelect}
      className={cn(
        "relative w-full h-14 rounded-xl overflow-hidden flex items-center gap-3 px-3 transition-all duration-300",
        isSelected
          ? "bg-manga-ink text-white ring-1 ring-manga-ink"
          : "bg-manga-tone/30 hover:bg-manga-tone/50 text-manga-ink"
      )}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      {imageUrl && (
        <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
          <Image src={imageUrl} alt={char.name} fill className="object-cover" unoptimized />
        </div>
      )}
      <div className="flex flex-col items-start flex-1 min-w-0 text-left">
        <span className="font-semibold text-sm truncate w-full">{char.name}</span>
        <span className={cn(
          "text-xs truncate w-full",
          isSelected ? "text-white/70" : "text-manga-ink/60"
        )}>
          {char.technique}
        </span>
      </div>
      {isSelected && (
        <div className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
      )}
    </motion.button>
  )
}
