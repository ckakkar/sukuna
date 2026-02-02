import { auth } from "@/auth"
import { SceneWrapper } from "@/components/Visualizer/SceneWrapper"
import { Overlay } from "@/components/UI/Overlay"
import { SpotifyWebPlayer } from "@/components/SpotifyWebPlayer"
import { AuthInitializer } from "@/components/AuthInitializer"
import { DomainExpansion } from "@/components/UI/DomainExpansion"
import { CharacterSelectionModal } from "@/components/UI/CharacterSelectionModal"
import { BackgroundQuotes } from "@/components/UI/BackgroundQuotes"
import { CharacterSwitchAnimation } from "@/components/UI/CharacterSwitchAnimation"
import { CursedEnergyParticles } from "@/components/UI/CursedEnergyParticles"
import { CursedEnergyTrail } from "@/components/UI/CursedEnergyTrail"
import { KanjiRain } from "@/components/UI/KanjiRain"
import { BlackFlash } from "@/components/UI/BlackFlash"
import { TechniqueActivation } from "@/components/UI/TechniqueActivation"
import { DomainBarrier } from "@/components/UI/DomainBarrier"
import { RealityCrack } from "@/components/UI/RealityCrack"
import { MoodBasedVisuals } from "@/components/UI/MoodBasedVisuals"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { JJKLoginScreen } from "@/components/UI/JJKLoginScreen"
import { signInWithSpotify } from "@/app/actions/auth"
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts"
import { AppEnhancements } from "@/components/AppEnhancements"
import { HandSigns } from "@/components/UI/HandSigns"
import { Onboarding } from "@/components/UI/Onboarding"
import { UIEnhancements } from "@/components/UI/UIEnhancements"

export default async function Home() {
  const session = await auth()

  return (
    <ErrorBoundary>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-manga-ink focus:text-white focus:rounded-lg focus:text-sm focus:outline-none focus:ring-2 focus:ring-manga-ink/20"
      >
        Skip to main content
      </a>
      <main id="main-content" className="relative w-screen h-screen min-h-screen bg-manga-paper overflow-hidden">
        {session && <AppEnhancements />}
        {session && <UIEnhancements />}
        {session && <Onboarding />}
        {/* Kanji Rain */}
        {session && <KanjiRain />}
        
        {/* Cursed Energy Particles Background */}
        {session && <CursedEnergyParticles />}
        
        {/* Cursed Energy Cursor Trail */}
        {session && <CursedEnergyTrail />}
        
        {/* 3D Scene - clean frame */}
        {session && (
          <div className="absolute inset-4 sm:inset-6 md:inset-10 animate-fade-in rounded-2xl bg-neutral-950 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
            <SceneWrapper />
          </div>
        )}

        {/* Auth Initializer */}
        <AuthInitializer session={session} />

        {/* Spotify Web Player */}
        {session?.accessToken && <SpotifyWebPlayer />}

        {/* Hand Signs - Character gestures before domain expansion */}
        {session && <HandSigns />}

        {/* Domain Expansion Animation */}
        {session && <DomainExpansion />}
        
        {/* Domain Barrier (Hexagonal Pattern) */}
        {session && <DomainBarrier />}
        
        {/* Reality Crack Effect */}
        {session && <RealityCrack />}

        {/* Character Selection Modal */}
        {session && <CharacterSelectionModal />}

        {/* Character Switch Animation */}
        {session && <CharacterSwitchAnimation />}

        {/* Black Flash Effect */}
        {session && <BlackFlash />}

        {/* Technique Activation */}
        {session && <TechniqueActivation />}

        {/* Background Quotes */}
        {session && <BackgroundQuotes />}

        {/* Mood-based visual adjustments */}
        {session && <MoodBasedVisuals />}

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
