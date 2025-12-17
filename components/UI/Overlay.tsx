"use client"

import { signIn } from "next-auth/react"
import { useSpotifyStore } from "@/store/useSpotifyStore"

export function Overlay() {
  const currentTrack = useSpotifyStore((state) => state.currentTrack)
  const trackData = useSpotifyStore((state) => state.trackData)

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Bottom left terminal UI */}
      <div className="absolute bottom-6 left-6 font-mono text-sm space-y-1 pointer-events-auto">
        <div className="text-gray-400">[SUKUNA SYSTEM ONLINE]</div>
        
        {currentTrack ? (
          <>
            <div className="text-gray-400">
              CURRENT TRACK: <span className="text-[#ff3c00]">&gt; {currentTrack.name}</span>
            </div>
            {trackData && (
              <div className="text-gray-400">
                BPM: <span className="text-[#ff3c00]">{Math.round(trackData.bpm)}</span>{" "}
                // ENERGY: <span className="text-[#ff3c00]">{trackData.energy.toFixed(2)}</span>
              </div>
            )}
          </>
        ) : (
          <div className="text-gray-400">[NO TRACK LOADED]</div>
        )}
      </div>
    </div>
  )
}

