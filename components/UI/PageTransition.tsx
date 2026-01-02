"use client"

import { ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.3,
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Panel slide transition for modals and overlays
export function PanelSlide({ children, direction = "right" }: { children: ReactNode; direction?: "left" | "right" | "up" | "down" }) {
  const x = direction === "left" ? -100 : direction === "right" ? 100 : 0
  const y = direction === "up" ? -100 : direction === "down" ? 100 : 0

  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x, y }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      {children}
    </motion.div>
  )
}

// Stagger animation for lists
export function StaggerContainer({ children, delay = 0.1 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      {children}
    </motion.div>
  )
}

