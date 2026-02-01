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
        className="group relative w-12 h-12 sm:w-16 sm:h-16"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div
          className="absolute inset-0 bg-white border-2 border-black transform rotate-3 transition-transform group-hover:rotate-6"
          style={{ backgroundColor: currentChar.colors.primary }}
        >
          {/* Manga hatching pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)',
              backgroundSize: '10px 10px'
            }}
          />
        </div>

        <div className="absolute inset-0 flex items-center justify-center border-2 border-black bg-white overflow-hidden">
          {imageUrl ? (
            <div className="relative w-full h-full">
              <Image
                src={imageUrl}
                alt={currentChar.name}
                fill
                className="object-cover"
                unoptimized // External URL
              />
              {/* Values overlay */}
              <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
            </div>
          ) : (
            <span className="font-bold font-jp text-lg sm:text-xl text-black">
              {currentChar.japaneseName.charAt(0)}
            </span>
          )}
        </div>

        {/* Floating Tooltip */}
        <div className="absolute top-full right-0 mt-2 px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-widest transform -skew-x-12 hidden sm:block">
          ROSTER
        </div>
      </motion.button>

      {/* Roster Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-0 right-16 sm:right-20 w-[280px] sm:w-[320px] bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2">
              <h3 className="font-black text-xl italic tracking-tighter">SELECT SORCERER</h3>
              <span className="bg-black text-white px-2 py-0.5 text-xs font-bold">1 / {roster.length}</span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 gap-2">
              {roster.map((char) => (
                <CharacterOption
                  key={char.id}
                  char={char}
                  isSelected={selectedCharacter === char.id}
                  onSelect={() => handleSelect(char.id)}
                />
              ))}
            </div>

            {/* Footer decoration */}
            <div className="mt-4 flex gap-1 justify-end">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-black rounded-full" />
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
        "relative w-full h-16 border-2 border-black overflow-hidden group transition-all duration-200",
        isSelected ? "bg-black" : "bg-white hover:bg-gray-100"
      )}
      whileHover={{ x: -4 }}
    >
      {/* Background Image Parallax/Slice */}
      {imageUrl && (
        <div className="absolute inset-0 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-300">
          <Image src={imageUrl} alt={char.name} fill className="object-cover" unoptimized />
          <div className="absolute inset-0 bg-white/50 mix-blend-overlay" />
        </div>
      )}

      {/* Helper color slice if no image or overlay */}
      <div
        className="absolute inset-0 transform -skew-x-12 scale-150 origin-left opacity-20 group-hover:opacity-40 transition-opacity mix-blend-multiply"
        style={{ backgroundColor: char.colors.primary }}
      />

      <div className="relative h-full flex items-center px-4 justify-between">
        <div className="flex flex-col items-start z-10">
          <span className={cn(
            "font-black text-lg italic uppercase leading-none drop-shadow-md",
            isSelected ? "text-white" : "text-black"
          )}>
            {char.name}
          </span>
          <span className={cn(
            "text-xs font-jp font-bold",
            isSelected ? "text-gray-300" : "text-gray-600"
          )}>
            {char.technique}
          </span>
        </div>

        {/* Kanji Vertical */}
        <span
          className={cn(
            "font-jp font-black text-2xl opacity-20 pointer-events-none absolute right-2 writing-vertical",
            isSelected ? "text-white" : "text-black"
          )}
        >
          {char.japaneseName}
        </span>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white animate-pulse" />
      )}
    </motion.button>
  )
}
