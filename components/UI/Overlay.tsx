"use client"

import { useSpotifyStore } from "@/store/useSpotifyStore"

export function Overlay() {
  const currentTrack = useSpotifyStore((state) => state.currentTrack)
  const trackData = useSpotifyStore((state) => state.trackData)

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Top left - Domain Expansion indicator */}
      <div className="absolute top-6 left-6 font-mono text-xs space-y-2">
        <div className="text-jujutsu-energy animate-glow font-bold tracking-wider text-sm">
          DOMAIN EXPANSION
        </div>
        <div className="text-gray-400 text-[11px] tracking-widest font-semibold">
          領域展開
        </div>
        <div className="text-gray-600 text-[10px] mt-1">
          伏魔御厨子
        </div>
        <div className="text-gray-500 text-[9px] italic">
          Malevolent Shrine
        </div>
      </div>

      {/* Top right - Cursed Technique */}
      <div className="absolute top-6 right-6 font-mono text-xs space-y-1 text-right">
        <div className="text-gray-400 text-[10px] tracking-wider">
          呪力
        </div>
        <div className="text-jujutsu-energy font-bold text-sm">
          {trackData ? `${(trackData.energy * 100).toFixed(0)}%` : '---'}
        </div>
      </div>

      {/* Bottom left - System status */}
      <div className="absolute bottom-6 left-6 font-mono text-sm space-y-2 pointer-events-auto">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-jujutsu-energy rounded-full animate-pulse-cursed shadow-lg shadow-jujutsu-energy/50"></div>
          <div className="text-gray-300 font-semibold tracking-wide">
            <span className="text-gray-500">呪力活性:</span> 咒力活性
          </div>
        </div>
        
        {currentTrack ? (
          <div className="space-y-1 mt-4">
            <div className="text-gray-500 text-xs uppercase tracking-wider flex items-center gap-2">
              <span>NOW PLAYING</span>
              <span className="text-gray-600 text-[10px]">再生中</span>
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
              <div className="flex gap-6 mt-4 text-xs border-t border-gray-800 pt-3">
                <div>
                  <span className="text-gray-500 text-[10px]">BPM</span>
                  <div className="text-jujutsu-energy font-bold text-sm">
                    {Math.round(trackData.bpm)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px]">エネルギー</span>
                  <div className="text-jujutsu-energy font-bold text-sm">
                    {(trackData.energy * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px]">価値観</span>
                  <div className="text-jujutsu-energy font-bold text-sm">
                    {(trackData.valence * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-500 text-xs mt-4 space-y-1">
            <div>[呪力源を待機中...]</div>
            <div className="text-gray-600 text-[10px]">Awaiting cursed energy source...</div>
          </div>
        )}
      </div>

      {/* Bottom right - Sukuna branding */}
      <div className="absolute bottom-6 right-6 font-mono text-xs space-y-1">
        <div className="text-right">
          <div className="text-jujutsu-energy text-lg font-black mb-0.5 tracking-widest">
            両面宿儺
          </div>
          <div className="text-white text-sm font-bold mb-1">SUKUNA</div>
          <div className="text-gray-500 text-[10px] border-t border-gray-800 pt-1 mt-1">
            呪術廻戦
          </div>
        </div>
      </div>

      {/* Center top - Title when track is playing */}
      {currentTrack && trackData && trackData.energy > 0.7 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-mono text-center pointer-events-none">
          <div className="text-jujutsu-energy text-4xl font-black animate-glow tracking-widest">
            展開
          </div>
          <div className="text-gray-600 text-xs mt-1">DOMAIN EXPANSION</div>
        </div>
      )}
    </div>
  )
}

