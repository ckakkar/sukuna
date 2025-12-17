"use client"

import { useSpotifyStore } from "@/store/useSpotifyStore"

export function Overlay() {
  const currentTrack = useSpotifyStore((state) => state.currentTrack)
  const trackData = useSpotifyStore((state) => state.trackData)

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Top left - Domain Expansion indicator */}
      <div className="absolute top-6 left-6 font-mono text-xs space-y-2">
        <div className="text-jujutsu-energy animate-glow font-bold tracking-wider">
          DOMAIN EXPANSION
        </div>
        <div className="text-gray-500 text-[10px] tracking-widest">
          領域展開
        </div>
      </div>

      {/* Bottom left - System status */}
      <div className="absolute bottom-6 left-6 font-mono text-sm space-y-2 pointer-events-auto">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-jujutsu-energy rounded-full animate-pulse-cursed"></div>
          <div className="text-gray-300 font-semibold tracking-wide">
            CURSED ENERGY ACTIVE
          </div>
        </div>
        
        {currentTrack ? (
          <div className="space-y-1 mt-3">
            <div className="text-gray-500 text-xs uppercase tracking-wider">
              Current Track
            </div>
            <div className="text-white font-medium max-w-md truncate">
              {currentTrack.name}
            </div>
            {currentTrack.artist && (
              <div className="text-gray-400 text-xs">
                {currentTrack.artist}
              </div>
            )}
            {trackData && (
              <div className="flex gap-4 mt-3 text-xs">
                <div>
                  <span className="text-gray-500">BPM</span>
                  <span className="text-jujutsu-energy ml-2 font-bold">
                    {Math.round(trackData.bpm)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Energy</span>
                  <span className="text-jujutsu-energy ml-2 font-bold">
                    {(trackData.energy * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-500 text-xs mt-3">
            [Awaiting cursed energy source...]
          </div>
        )}
      </div>

      {/* Bottom right - Sukuna reference */}
      <div className="absolute bottom-6 right-6 font-mono text-xs text-gray-600">
        <div className="text-right">
          <div className="text-jujutsu-energy text-sm font-bold mb-1">SUKUNA</div>
          <div className="text-[10px]">呪術廻戦</div>
        </div>
      </div>
    </div>
  )
}

