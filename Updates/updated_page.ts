import { auth } from "@/auth"
import { SceneWrapper } from "@/components/Visualizer/SceneWrapper"
import { Overlay } from "@/components/UI/Overlay"
import { SpotifyWebPlayer } from "@/components/SpotifyWebPlayer"
import { AuthInitializer } from "@/components/AuthInitializer"
import { DomainExpansion } from "@/components/UI/DomainExpansion"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { signInWithSpotify } from "@/app/actions/auth"

export default async function Home() {
  const session = await auth()

  return (
    <ErrorBoundary>
      <main className="relative w-screen h-screen bg-black overflow-hidden">
        {/* 3D Scene - Full screen background */}
        <div className="absolute inset-0">
          <SceneWrapper />
        </div>

        {/* Auth Initializer */}
        <AuthInitializer session={session} />

        {/* Spotify Web Player */}
        {session?.accessToken && <SpotifyWebPlayer />}

        {/* Domain Expansion Animation */}
        <DomainExpansion />

        {/* UI Overlay */}
        <Overlay />

        {/* Login Screen */}
        {!session && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-20">
            <div className="text-center space-y-8">
              <div className="space-y-3 mb-10">
                <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-jujutsu-energy via-cursed-purple to-jujutsu-domain font-mono tracking-wider animate-glow">
                  両面宿儺
                </h1>
                <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-jujutsu-energy to-cursed-neon font-mono tracking-[0.2em]">
                  SUKUNA
                </h2>
                <div className="h-px w-32 bg-gradient-to-r from-transparent via-jujutsu-energy to-transparent mx-auto my-4"></div>
                <p className="text-gray-400 font-mono text-sm tracking-widest">
                  CURSED ENERGY VISUALIZER
                </p>
                <p className="text-gray-600 font-mono text-xs tracking-wide">
                  呪力ビジュアライザー
                </p>
              </div>

              <div className="space-y-2 text-gray-500 font-mono text-xs max-w-md">
                <p>Summon the King of Curses through music</p>
                <p className="text-gray-600 text-[10px]">音楽を通じて呪いの王を召喚</p>
              </div>

              <form action={signInWithSpotify}>
                <button
                  type="submit"
                  className="group relative px-12 py-5 bg-gradient-to-r from-jujutsu-energy to-jujutsu-domain hover:from-jujutsu-domain hover:to-jujutsu-energy text-white font-mono font-bold text-sm uppercase tracking-widest rounded-lg transition-all duration-300 shadow-2xl shadow-jujutsu-energy/50 hover:shadow-jujutsu-energy/70 hover:scale-105 border border-jujutsu-energy/30"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <span>CONNECT SPOTIFY</span>
                    <span className="text-[10px] opacity-70">接続</span>
                  </span>
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-jujutsu-energy to-jujutsu-domain opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
                </button>
              </form>

              <div className="space-y-1 mt-8">
                <p className="text-gray-600 font-mono text-[10px] tracking-widest">
                  領域展開: 伏魔御厨子
                </p>
                <p className="text-gray-700 font-mono text-[9px] italic">
                  Domain Expansion: Malevolent Shrine
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </ErrorBoundary>
  )
}
