"use client"

import { useState, useEffect } from "react"

interface JJKLoginScreenProps {
  onLogin: () => Promise<void>
}

export function JJKLoginScreen({ onLogin }: JJKLoginScreenProps) {
  const [particles, setParticles] = useState<Array<{
    id: number
    x: number
    y: number
    size: number
    duration: number
    delay: number
  }>>([])

  useEffect(() => {
    // Generate cursed energy particles
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 z-20 overflow-hidden bg-gradient-to-br from-black via-purple-950/30 to-black">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(147, 51, 234, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite'
          }}
        />
      </div>

      {/* Cursed energy particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-purple-500/60 blur-sm pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animation: `floatParticle ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
            boxShadow: '0 0 20px rgba(147, 51, 234, 0.8)',
          }}
        />
      ))}

      {/* Hexagonal cursed energy pattern */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <div className="relative w-[800px] h-[800px]">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 border-2 border-purple-500"
              style={{
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                transform: `rotate(${i * 60}deg) scale(${1 - i * 0.15})`,
                animation: `rotateHex ${10 + i * 2}s linear infinite`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 pointer-events-none">
        <div className="w-full max-w-md space-y-8 text-center pointer-events-auto">
          {/* Logo/Title with glitch effect */}
          <div className="relative mb-12">
            <div className="relative inline-block">
              {/* Glowing background */}
              <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 opacity-50 animate-pulse" />
              
              {/* Main title */}
              <h1 
                className="relative text-6xl sm:text-7xl font-black tracking-wider mb-2"
                style={{
                  background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 50%, #9333ea 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 80px rgba(147, 51, 234, 0.5)',
                  animation: 'titleGlow 3s ease-in-out infinite',
                }}
              >
                両面宿儺
              </h1>

              {/* Glitch layers */}
              <h1 
                className="absolute inset-0 text-6xl sm:text-7xl font-black tracking-wider opacity-70 mix-blend-screen pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, #ec4899 0%, #9333ea 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'glitch 4s infinite',
                }}
              >
                両面宿儺
              </h1>
            </div>

            <h2 
              className="text-2xl sm:text-3xl font-bold mt-4 tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400"
              style={{
                animation: 'subtitleSlide 2s ease-out',
                textShadow: '0 0 30px rgba(147, 51, 234, 0.6)',
              }}
            >
              SUKUNA
            </h2>

            {/* Decorative lines */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <div 
                className="h-px w-24 bg-gradient-to-r from-transparent via-purple-500 to-transparent" 
                style={{ animation: 'expandWidth 1.5s ease-out' }} 
              />
              <div 
                className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"
                style={{ boxShadow: '0 0 20px rgba(147, 51, 234, 0.8)' }} 
              />
              <div 
                className="h-px w-24 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
                style={{ animation: 'expandWidth 1.5s ease-out' }} 
              />
            </div>
          </div>

          {/* Subtitle */}
          <div className="space-y-2 mb-8">
            <p 
              className="text-sm font-mono text-purple-300 tracking-[0.4em] uppercase"
              style={{ animation: 'fadeInUp 1s ease-out 0.5s both' }}
            >
              Cursed Energy Visualizer
            </p>
            <p 
              className="text-xs font-mono text-purple-500/70 tracking-wider"
              style={{ animation: 'fadeInUp 1s ease-out 0.7s both' }}
            >
              呪力ビジュアライザー
            </p>
          </div>

          {/* Description */}
          <div className="space-y-3 mb-12">
            <p 
              className="text-gray-400 font-mono text-sm leading-relaxed"
              style={{ animation: 'fadeInUp 1s ease-out 0.9s both' }}
            >
              Summon the King of Curses through music
            </p>
            <p 
              className="text-gray-600 font-mono text-xs"
              style={{ animation: 'fadeInUp 1s ease-out 1.1s both' }}
            >
              音楽を通じて呪いの王を召喚
            </p>
          </div>

          {/* Login button with cursed energy effect */}
          <div className="relative" style={{ animation: 'fadeInUp 1s ease-out 1.3s both' }}>
            {/* Pulsing glow */}
            <div className="absolute inset-0 blur-2xl bg-purple-600/40 animate-pulse rounded-2xl pointer-events-none" />
            
            <button
              onClick={onLogin}
              type="button"
              className="relative group w-full px-12 py-6 overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 active:scale-95 touch-manipulation"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 50%, #a855f7 100%)',
                boxShadow: `
                  0 0 60px rgba(147, 51, 234, 0.6),
                  inset 0 0 30px rgba(168, 85, 247, 0.3),
                  0 20px 60px rgba(0, 0, 0, 0.5)
                `,
              }}
              aria-label="Connect with Spotify to summon cursed energy"
            >
              {/* Animated background shimmer */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  animation: 'shimmer 2s infinite',
                }} 
              />

              {/* Button content */}
              <div className="relative z-10 flex items-center justify-center gap-4">
                <span className="text-white font-mono font-bold text-base tracking-[0.3em] uppercase">
                  Connect Spotify
                </span>
                <span className="text-purple-200 text-xs opacity-70">接続</span>
              </div>

              {/* Hexagonal border effect */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{
                  clipPath: 'polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%)',
                  border: '2px solid rgba(168, 85, 247, 0.5)',
                }} 
              />
            </button>

            {/* Corner accents */}
            <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-purple-500/50 rounded-tl-lg pointer-events-none" />
            <div className="absolute -top-2 -right-2 w-8 h-8 border-r-2 border-t-2 border-purple-500/50 rounded-tr-lg pointer-events-none" />
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-l-2 border-b-2 border-purple-500/50 rounded-bl-lg pointer-events-none" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-purple-500/50 rounded-br-lg pointer-events-none" />
          </div>

          {/* Bottom text */}
          <div className="space-y-2 mt-12" style={{ animation: 'fadeInUp 1s ease-out 1.5s both' }}>
            <p className="text-purple-400/60 font-mono text-xs tracking-[0.4em] uppercase">
              領域展開: 伏魔御厨子
            </p>
            <p className="text-purple-600/50 font-mono text-[10px] italic tracking-wide">
              Domain Expansion: Malevolent Shrine
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes floatParticle {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-30px) translateX(20px);
            opacity: 1;
          }
        }

        @keyframes gridMove {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(50px);
          }
        }

        @keyframes rotateHex {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes glitch {
          0%, 100% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(-2px, -2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
        }

        @keyframes titleGlow {
          0%, 100% {
            filter: brightness(1) drop-shadow(0 0 20px rgba(147, 51, 234, 0.5));
          }
          50% {
            filter: brightness(1.2) drop-shadow(0 0 40px rgba(147, 51, 234, 0.8));
          }
        }

        @keyframes subtitleSlide {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes expandWidth {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  )
}

