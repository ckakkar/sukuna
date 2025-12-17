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
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
          <form action={signInWithSpotify}>
            <button
              type="submit"
              className="px-8 py-4 bg-[#1db954] hover:bg-[#1ed760] text-white font-mono font-bold text-lg rounded-lg transition-colors duration-200 shadow-lg shadow-[#1db954]/50"
            >
              CONNECT SPOTIFY
            </button>
          </form>
        </div>
      )}
    </main>
  )
}

