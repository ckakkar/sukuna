import { auth } from "@/auth"
import { SceneWrapper } from "@/components/Visualizer/SceneWrapper"
import { Overlay } from "@/components/UI/Overlay"
import { SpotifyWebPlayer } from "@/components/SpotifyWebPlayer"
import { AuthInitializer } from "@/components/AuthInitializer"
import { DomainExpansion } from "@/components/UI/DomainExpansion"
import { CharacterSelectionModal } from "@/components/UI/CharacterSelectionModal"
import { BackgroundQuotes } from "@/components/UI/BackgroundQuotes"
import { CharacterSwitchAnimation } from "@/components/UI/CharacterSwitchAnimation"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { JJKLoginScreen } from "@/components/UI/JJKLoginScreen"
import { signInWithSpotify } from "@/app/actions/auth"
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts"

export default async function Home() {
  const session = await auth()

  return (
    <ErrorBoundary>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-jujutsu-energy focus:text-white focus:rounded-lg focus:font-mono focus:text-sm"
      >
        Skip to main content
      </a>
      <main id="main-content" className="relative w-screen h-screen min-h-screen bg-black overflow-hidden">
        {/* Only show 3D Scene after login */}
        {session && (
          <div className="absolute inset-0">
            <SceneWrapper />
          </div>
        )}

        {/* Auth Initializer */}
        <AuthInitializer session={session} />

        {/* Spotify Web Player */}
        {session?.accessToken && <SpotifyWebPlayer />}

        {/* Domain Expansion Animation */}
        {session && <DomainExpansion />}

        {/* Character Selection Modal */}
        {session && <CharacterSelectionModal />}

        {/* Character Switch Animation */}
        {session && <CharacterSwitchAnimation />}

        {/* Background Quotes */}
        {session && <BackgroundQuotes />}

        {/* UI Overlay */}
        {session && <Overlay />}

        {/* JJK-Inspired Login Screen */}
        {!session && <JJKLoginScreen onLogin={signInWithSpotify} />}

        {/* Keyboard Shortcuts */}
        {session && <KeyboardShortcuts />}
      </main>
    </ErrorBoundary>
  )
}
