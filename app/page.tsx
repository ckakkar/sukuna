import { auth } from "@/auth"
import { Scene } from "@/components/Visualizer/Scene"
import { Overlay } from "@/components/UI/Overlay"
import { SpotifyWebPlayer } from "@/components/SpotifyWebPlayer"
import { AuthInitializer } from "@/components/AuthInitializer"
import { signInWithSpotify } from "@/app/actions/auth"

export default async function Home() {
  const session = await auth()

  return (
    <main className="relative w-screen h-screen bg-black overflow-hidden">
      {/* 3D Scene - Full screen background */}
      <div className="absolute inset-0">
        <Scene />
      </div>

      {/* Auth Initializer - handles token sync to store */}
      <AuthInitializer session={session} />

      {/* Spotify Web Player - handles SDK integration */}
      {session?.accessToken && <SpotifyWebPlayer />}

      {/* UI Overlay */}
      <Overlay />

      {/* Auth Button - centered if not authenticated */}
      {!session && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-20">
          <div className="text-center space-y-6">
            <div className="space-y-2 mb-8">
              <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-jujutsu-energy to-cursed-neon font-mono tracking-wider">
                SUKUNA
              </h1>
              <p className="text-gray-400 font-mono text-sm tracking-widest">
                CURSED ENERGY VISUALIZER
              </p>
            </div>
            <form action={signInWithSpotify}>
              <button
                type="submit"
                className="group relative px-8 py-4 bg-gradient-to-r from-jujutsu-energy to-jujutsu-domain hover:from-jujutsu-domain hover:to-jujutsu-energy text-white font-mono font-bold text-sm uppercase tracking-widest rounded-lg transition-all duration-300 shadow-lg shadow-jujutsu-energy/50 hover:shadow-jujutsu-energy/70 hover:scale-105"
              >
                <span className="relative z-10">CONNECT SPOTIFY</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-jujutsu-energy to-jujutsu-domain opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
              </button>
            </form>
            <p className="text-gray-500 font-mono text-xs mt-6">
              Summon cursed energy through music
            </p>
          </div>
        </div>
      )}
    </main>
  )
}

