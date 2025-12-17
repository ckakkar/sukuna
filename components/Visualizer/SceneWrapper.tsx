"use client"

import dynamic from "next/dynamic"

// Use Next.js dynamic import with ssr: false - this is allowed in client components
const Scene = dynamic(() => import("./Scene").then((mod) => ({ default: mod.Scene })), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black" />,
})

export function SceneWrapper() {
  return <Scene />
}

