"use client"

import { motion } from "framer-motion"

interface JJKLoginScreenProps {
  onLogin: () => Promise<void>
}

export function JJKLoginScreen({ onLogin }: JJKLoginScreenProps) {
  return (
    <div className="fixed inset-0 z-20 overflow-hidden bg-manga-paper flex items-center justify-center">
      <div className="w-full max-w-sm px-6 text-center animate-fade-up">
        <h1 className="text-5xl sm:text-6xl font-semibold text-manga-ink mb-2 font-jp tracking-tight">
          両面宿儺
        </h1>
        <h2 className="text-2xl sm:text-3xl font-medium text-manga-ink/80 mb-8 tracking-wide">
          SUKUNA
        </h2>
        <p className="text-sm text-manga-ink/50 mb-10">
          Cursed Energy Visualizer
        </p>

        <motion.button
          onClick={onLogin}
          type="button"
          className="w-full py-4 px-6 rounded-2xl bg-manga-ink text-white font-medium text-sm tracking-wide shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          aria-label="Connect with Spotify"
        >
          Connect Spotify
        </motion.button>

        <p className="mt-8 text-xs text-manga-ink/40">
          Ryomen Sukuna · King of Curses
        </p>
      </div>
    </div>
  )
}

