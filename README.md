# Sukuna - Cursed Energy Visualizer 呪力ビジュアライザー

A high-performance, **Jujutsu Kaisen**-themed 3D audio-reactive web application built with Next.js 15, React Three Fiber, and Spotify integration. Experience your music through the lens of cursed energy visualization with cinematic domain expansions, character-specific themes, and real-time audio analysis.

**Manga-themed design throughout** — ink strokes, screentone halftones, speed lines, and panel-style framing for an authentic manga aesthetic.

![Jujutsu Kaisen](https://img.shields.io/badge/呪術廻戦-Manga%20Themed-0a0a0a?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Three.js](https://img.shields.io/badge/Three.js-r165-green?style=for-the-badge&logo=three.js)
![React Three Fiber](https://img.shields.io/badge/React%20Three%20Fiber-9.0-blue?style=for-the-badge)
![Zustand](https://img.shields.io/badge/Zustand-4.5-purple?style=for-the-badge)

---

## 📋 Table of Contents

- [Features](#-features)
- [JJK Characters](#-jjk-characters)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [Components Overview](#-components-overview)
- [Hooks & Utilities](#-hooks--utilities)
- [Design System](#-design-system)
- [Keyboard Shortcuts](#-keyboard-shortcuts)
- [Accessibility](#-accessibility)
- [Performance Optimizations](#-performance-optimizations)
- [Tech Stack](#-tech-stack)
- [Development](#-development)
- [Future Roadmap](#-future-roadmap)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

---

## ✨ Features

### 🎵 Core Audio Features

- **Spotify Integration**
  - Real-time audio streaming via Spotify Web Playback SDK
  - Full playback control (play, pause, skip, seek)
  - Volume control
  - Repeat and shuffle modes
  - Queue management
  - Recently played tracks
  - Playlist browsing
  - Search functionality
  - Favorites management

- **Audio Analysis**
  - Real-time BPM detection
  - Energy level analysis (0-1 scale)
  - Valence (musical positiveness) tracking
  - Beat detection with intensity mapping
  - Frequency analysis for reactive visuals
  - Track metadata display (artist, album, duration)

- **Lyric-to-Color (Psychic Vibe)**
  - Fetches lyrics via [LRCLIB](https://lrclib.net) (no API key)
  - Sends lyrics to an LLM (OpenAI or DeepSeek) to analyze emotional atmosphere
  - Returns a single hex color and a 3-word "Domain Expansion" name per song
  - Visualizer and domain overlay shift to the song’s vibe (e.g. sad → gloomy blue, rage → red)
  - Optional: set `OPENAI_API_KEY` or `DEEPSEEK_API_KEY` in `.env.local` to enable

### 🎨 3D Visualization Features

- **Audio-Reactive 3D Core**
  - Dynamic cursed energy core that pulses with beats
  - Character-specific color palettes
  - Energy intensity visualization
  - Beat-reactive lighting system
  - GPU-accelerated animations

- **Domain Expansion System**
  - Cinematic domain expansion animations
  - Character-specific domain names (Japanese & English)
  - Barrier sphere animations
  - Visual state transitions (idle → expanding → active → collapsing)
  - Intensity-based visual effects

- **Manga Post-Processing**
  - Halftone dot screen effects
  - Chromatic aberration (intensity-based)
  - Noise and grain effects
  - Black Flash impact frames on strong beats
  - Slash effects for cleave techniques
  - Manga-style ink overlays

- **Dynamic Lighting**
  - Beat-reactive point lights
  - Character-themed color lighting
  - Shadow casting (desktop only)
  - Multiple light sources for depth
  - Mobile-optimized lighting

### 🎭 Character System

- **8 Playable Characters**
  - Each with unique cursed energy colors
  - Custom domain expansion names
  - Character-specific techniques
  - Themed UI elements
  - Character images (PNG support)
  - Dynamic quotes system

- **Character Features**
  - Character selection modal (first-time login)
  - Smooth character switching animations
  - Background quotes (random every 10-15 seconds)
  - Character-specific visual effects
  - Technique-specific animations (Cleave, Blue, Boogie Woogie)

### 🎮 User Interface

- **Manga Design System**
  - Cream paper (`#f4f4f0`) and black ink (`#0a0a0a`) palette
  - Offset ink shadows (e.g. `8px 8px 0px #0a0a0a`)
  - Halftone and screentone textures
  - Speed lines on beats
  - Panel-style frames and speech bubbles
  - No glass/blur — solid manga aesthetic

- **Music Player Panel**
  - Current track display
  - Playback controls
  - Progress bar with seek
  - Volume control
  - Repeat/shuffle toggles
  - Track analysis display (BPM, energy, valence)

- **Overlay System**
  - Domain expansion info display
  - Cursed energy intensity indicator
  - Character technique display
  - Beat-reactive text animations
  - Manga typography and ink-style panels

- **Additional UI Components**
  - Search interface
  - Queue management
  - Playlists browser
  - Recently played list
  - Favorites collection
  - Character selector
  - Background quotes display

### 🔐 Authentication & Security

- **NextAuth v5 Integration**
  - Spotify OAuth 2.0
  - Secure token management
  - Session persistence
  - Protected routes
  - Automatic token refresh

### 📱 Mobile Optimization

- **Responsive Design**
  - Mobile-first approach
  - Touch-friendly interactions
  - Optimized 3D scene performance
  - Reduced lighting/shadow complexity on mobile
  - Responsive breakpoints (sm, md, lg, xl, 2xl)
  - Safe area insets support

### ♿ Accessibility

- **WCAG Compliance**
  - ARIA labels on all interactive elements
  - Keyboard navigation support
  - Focus trap for modals
  - Skip to main content link
  - Reduced motion support
  - High contrast text colors
  - Screen reader friendly

### ⚡ Performance

- **Optimizations**
  - Component memoization
  - GPU-accelerated animations
  - Lazy loading for heavy components
  - Debounced operations
  - Optimized re-renders
  - Mobile performance tuning

### 🎨 Visual Effects

- **Cursed Energy Particles**
  - Manga ink-style particles (dots, lines, brush strokes)
  - Screentone halftone patterns
  - Speed lines on beat drops
  - Performance-optimized rendering

- **Character Switch Animation**
  - Manga-style speed line transitions
  - Quote display during switch
  - Ink wash and panel reveals

- **Domain Expansion Animation**
  - Manga ink barrier rings
  - Kanji burst effects
  - Volume dampening during expansion
  - Cinematic panel-style transitions

---

## 🎭 JJK Characters

Each character features a complete theme system with custom colors, techniques, and visual effects.

### Available Sorcerers

#### 1. **両面宿儺 (Ryomen Sukuna)** - Malevolent Shrine
- **Domain**: 伏魔御厨子 (Fukuma Mizushi)
- **Technique**: Cleave & Dismantle (解・捌)
- **Colors**: Deep purple/red cursed energy
  - Primary: `#7e22ce`
  - Secondary: `#c026d3`
  - Accent: `#e879f9`
  - Glow: `#a855f7`
- **Energy Levels**: Purple gradient from dark to bright magenta

#### 2. **五条悟 (Satoru Gojo)** - Unlimited Void
- **Domain**: 無量空処 (Muryokusho)
- **Technique**: Limitless (無下限呪術)
- **Colors**: Blue/white pure energy
  - Primary: `#0ea5e9`
  - Secondary: `#f0f9ff`
  - Accent: `#38bdf8`
  - Glow: `#7dd3fc`
- **Energy Levels**: Blue gradient from sky blue to white

#### 3. **虎杖悠仁 (Yuji Itadori)** - Unknown Domain
- **Domain**: None (なし)
- **Technique**: Black Flash (黒閃)
- **Colors**: Red/black energy
  - Primary: `#1a1a1a`
  - Secondary: `#ff69b4`
  - Accent: `#ffd700`
  - Glow: `#ff6b9d`
- **Energy Levels**: Black to pink to gold gradient

#### 4. **乙骨憂太 (Yuta Okkotsu)** - Authentic Mutual Love
- **Domain**: 真贋相愛 (Shingan Soai)
- **Technique**: Copy (模倣)
- **Colors**: Blue/white pure energy
  - Primary: `#1e1b4b`
  - Secondary: `#a5b4fc`
  - Accent: `#ffffff`
  - Glow: `#818cf8`
- **Energy Levels**: Indigo to white gradient

#### 5. **伏黒甚爾 (Toji Fushiguro)** - No Domain
- **Domain**: None (なし)
- **Technique**: Heavenly Restriction (天与呪縛)
- **Colors**: Gray/black
  - Primary: `#0f172a`
  - Secondary: `#475569`
  - Accent: `#94a3b8`
  - Glow: `#64748b`
- **Energy Levels**: Dark slate to light gray gradient

#### 6. **東堂葵 (Aoi Todo)** - My Best Friend
- **Domain**: None (なし)
- **Technique**: Boogie Woogie (不義遊戯)
- **Colors**: Orange/brown
  - Primary: `#78350f`
  - Secondary: `#a16207`
  - Accent: `#fbbf24`
  - Glow: `#d97706`
- **Energy Levels**: Brown to amber gradient

#### 7. **秤金次 (Kinji Hakari)** - Idle Death Gamble
- **Domain**: 坐殺博徒 (Zasatsu Bakuto)
- **Technique**: Rough Energy (ラフエネルギー)
- **Colors**: Cyan/gold
  - Primary: `#06b6d4`
  - Secondary: `#0e7490`
  - Accent: `#fbbf24`
  - Glow: `#22d3ee`
- **Energy Levels**: Cyan to gold gradient

#### 8. **脹相 (Choso)** - No Domain
- **Domain**: None (なし)
- **Technique**: Blood Manipulation (赤血操術)
- **Colors**: Red/crimson
  - Primary: `#450a0a`
  - Secondary: `#7f1d1d`
  - Accent: `#b91c1c`
  - Glow: `#dc2626`
- **Energy Levels**: Dark red to bright crimson gradient

### Character Features

Each character includes:
- **Domain Expansion Names**: Both Japanese (kanji) and English translations
- **Cursed Energy Color Palettes**: 4-color system (primary, secondary, accent, glow)
- **Energy Gradients**: 3-level RGB gradients (low, mid, high intensity)
- **Unique Techniques**: Character-specific cursed techniques
- **Character Images**: PNG images in `/public/characters/`
- **Dynamic Quotes**: Character-specific quotes with Japanese translations
- **Manga UI**: Main UI uses manga ink/paper; character colors appear in 3D scene

---

## 🏗️ Project Structure

```
sukuna/
├── app/                          # Next.js 15 App Router
│   ├── actions/                  # Server actions
│   │   └── auth.ts              # Authentication actions
│   ├── api/                      # API routes
│   │   └── auth/
│   │       └── [...nextauth]/   # NextAuth dynamic route
│   │           └── route.ts      # Auth API handler
│   ├── globals.css              # Global styles & animations
│   ├── layout.tsx               # Root layout component
│   └── page.tsx                 # Main page component
│
├── components/                   # React components
│   ├── UI/                      # UI components
│   │   ├── shared/             # Reusable UI components
│   │   │   ├── Button.tsx      # Button component with variants
│   │   │   ├── Card.tsx        # Manga panel card
│   │   │   ├── ErrorBoundary.tsx # Error boundary component
│   │   │   ├── LoadingSpinner.tsx # Loading indicator
│   │   │   ├── Toast.tsx       # Toast notification
│   │   │   └── index.ts        # Shared components export
│   │   ├── BackgroundQuotes.tsx # Random character quotes
│   │   ├── CharacterSelectionModal.tsx # First-time character picker
│   │   ├── CharacterSelector.tsx # Character selection UI
│   │   ├── CharacterSwitchAnimation.tsx # Character switch transition
│   │   ├── CursedEnergyParticles.tsx # Background particles
│   │   ├── DomainExpansion.tsx # Domain expansion animation
│   │   ├── Favorites.tsx       # Favorites management
│   │   ├── JJKLoginScreen.tsx  # Themed login screen
│   │   ├── MusicPlayerPanel.tsx # Main music player UI
│   │   ├── Overlay.tsx         # Top overlay with domain info
│   │   ├── PlaybackControls.tsx # Play/pause/skip controls
│   │   ├── Playlists.tsx        # Playlist browser
│   │   ├── Queue.tsx            # Queue management
│   │   ├── RecentlyPlayed.tsx  # Recently played tracks
│   │   └── Search.tsx           # Search interface
│   ├── Visualizer/             # 3D visualization components
│   │   ├── Scene.tsx           # Main 3D scene
│   │   ├── SceneWrapper.tsx    # Scene wrapper with Canvas
│   │   ├── CursedCore.tsx      # Audio-reactive 3D core
│   │   ├── Effects.tsx         # Post-processing effects wrapper
│   │   └── MangaPostProcess.tsx # Manga-style post-processing
│   ├── AuthInitializer.tsx      # Auth state initializer
│   ├── ErrorBoundary.tsx       # Global error boundary
│   ├── KeyboardShortcuts.tsx   # Keyboard shortcuts handler
│   └── SpotifyWebPlayer.tsx    # Spotify Web Playback SDK integration
│
├── hooks/                        # Custom React hooks
│   ├── useBeatDetector.tsx      # Real-time beat detection
│   ├── useCursedSpeech.tsx      # Cursed speech audio system
│   ├── useDebounce.ts           # Debounce utility hook
│   ├── useFocusTrap.tsx         # Focus trap for modals
│   ├── useHapticFeedback.tsx    # Haptic feedback (mobile)
│   ├── useKeyboardShortcuts.tsx # Keyboard shortcuts logic
│   └── useToast.tsx             # Toast notification hook
│
├── lib/                          # Library code
│   ├── constants/               # App constants
│   │   └── ui.ts               # UI constants (animations, spacing, z-index)
│   ├── data/                    # Static data
│   │   └── characterQuotes.ts   # Character quotes database
│   ├── hooks/                   # Shared hooks
│   │   ├── index.ts            # Hooks export
│   │   ├── useDebounce.ts      # Debounce hook
│   │   └── useMediaQuery.ts    # Media query hook
│   ├── types/                   # TypeScript types
│   │   ├── character.ts        # Character types & data
│   │   └── spotify.ts          # Spotify API types
│   ├── utils/                   # Utility functions
│   │   ├── accessibility.ts    # ARIA helpers
│   │   ├── animations.ts       # Animation utilities
│   │   ├── cn.ts               # Class name utility (clsx + tailwind-merge)
│   │   ├── colorUtils.ts       # Color manipulation utilities
│   │   ├── format.ts           # Formatting utilities (time, numbers)
│   │   ├── index.ts            # Utils export
│   │   └── spotifyApi.ts       # Spotify API client
│   └── spotify-actions.ts      # Spotify server actions
│
├── store/                        # State management
│   └── useSpotifyStore.ts      # Zustand store (auth, playback, character, domain)
│
├── public/                       # Static assets
│   └── characters/             # Character PNG images
│       ├── choso.png
│       ├── gojo.png
│       ├── kinjihakari.png
│       ├── sukuna.png
│       ├── todo.png
│       ├── toji.png
│       ├── yuji.png
│       ├── yuta.png
│       └── README.md           # Character images guide
│
├── types/                        # Global TypeScript types
│   └── next-auth.d.ts          # NextAuth type extensions
│
├── auth.ts                       # NextAuth configuration
├── next.config.js               # Next.js configuration
├── package.json                 # Dependencies & scripts
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
│
└── README.md                    # This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** or **yarn** package manager
- **Spotify Premium** account (required for Web Playback SDK)
- **Spotify Developer Account** (for API credentials)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ckakkar/sukuna.git
   cd sukuna
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Spotify Developer App**:
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Click "Create an app"
   - Fill in app details (name, description)
   - Add redirect URI: `http://localhost:3000/api/auth/callback/spotify`
   - Copy your **Client ID** and **Client Secret**

4. **Configure environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   # Spotify OAuth
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   
   # NextAuth
   NEXTAUTH_SECRET=your_random_secret_here
   NEXTAUTH_URL=http://localhost:3000
   ```
   
   **Generate NEXTAUTH_SECRET**:
   ```bash
   openssl rand -base64 32
   ```

5. **Add character images**:
   Place character PNG images in `/public/characters/`:
   - `sukuna.png`
   - `gojo.png`
   - `yuji.png`
   - `yuta.png`
   - `toji.png`
   - `todo.png`
   - `kinjihakari.png`
   - `choso.png`
   
   **Image requirements**:
   - Format: PNG with transparency
   - Recommended size: 512x512px or larger
   - Aspect ratio: 1:1 (square)

6. **Run the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

7. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

8. **Login with Spotify**:
   - Click the login button
   - Authorize the app with your Spotify account
   - Select your first character
   - Start playing music!

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SPOTIFY_CLIENT_ID` | Spotify app client ID | Yes |
| `SPOTIFY_CLIENT_SECRET` | Spotify app client secret | Yes |
| `NEXTAUTH_SECRET` | Secret for NextAuth session encryption | Yes |
| `NEXTAUTH_URL` | Base URL of your application | Yes |
| `OPENAI_API_KEY` | OpenAI API key for lyric-to-color (uses `gpt-4o-mini`) | No (lyric vibe disabled if unset) |
| `DEEPSEEK_API_KEY` | DeepSeek API key for lyric-to-color (OpenAI-compatible) | No (used if set and `OPENAI_API_KEY` is not) |

### Production Deployment

For production, update your environment variables:

1. **Update Spotify Redirect URI**:
   - In Spotify Dashboard, add your production URL:
   - `https://yourdomain.com/api/auth/callback/spotify`

2. **Update `.env.local`**:
   ```env
   NEXTAUTH_URL=https://yourdomain.com
   ```

3. **Build the application**:
   ```bash
   npm run build
   npm start
   ```

### Character Image Setup

Character images should be placed in `/public/characters/` with the following naming convention:
- `sukuna.png`
- `gojo.png`
- `yuji.png`
- `yuta.png`
- `toji.png`
- `todo.png`
- `kinjihakari.png`
- `choso.png`

Images are referenced in `lib/types/character.ts` via the `imagePath` property.

---

## 🧩 Components Overview

### UI Components

#### **MusicPlayerPanel**
Main music player interface displaying:
- Current track information (title, artist, album art)
- Playback controls (play/pause, skip, seek)
- Volume control
- Repeat/shuffle toggles
- Track analysis (BPM, energy, valence)
- Loading states

#### **Overlay**
Top overlay displaying:
- Domain expansion title (Japanese & English)
- Character technique
- Manga typography with ink-style text
- Beat-reactive impact text (ドン)
- Panel-style character signature

#### **CharacterSelector**
Character selection interface:
- Roster-style grid of all 8 characters
- Manga panel cards with ink borders
- Domain expansion names
- Panel-style selection animations

#### **CharacterSelectionModal**
First-time character picker:
- Manga page layout with cream background
- Panel-style character cards with ink borders
- Grayscale character images with manga aesthetic
- Confirmation animation with speech bubble quotes

#### **CharacterSwitchAnimation**
Manga-style character transition:
- Ink wash and speed line animations
- Quote display in panel format
- Technique-specific exit effects (Cleave, Blue, Boogie Woogie)

#### **BackgroundQuotes**
Random character quotes (on click):
- Manga speech bubble styling
- Ink borders and offset shadows
- Japanese & English text
- Panel-style presentation

#### **DomainExpansion**
Domain expansion animation:
- Manga ink barrier rings
- Kanji burst (呪術式領域)
- Volume dampening
- Ink-style particle explosions

#### **PlaybackControls**
Compact playback controls:
- Play/pause button
- Previous/next track
- Progress bar
- Volume control

#### **Search**
Spotify search interface:
- Real-time search
- Track/artist/album results
- Play functionality
- Queue management

#### **Queue**
Queue management:
- Current queue display
- Reorder tracks
- Remove tracks
- Play next functionality

#### **Playlists**
Playlist browser:
- User playlists
- Create new playlists
- Add tracks to playlists
- Playlist playback

#### **RecentlyPlayed**
Recently played tracks:
- Track history
- Quick replay
- Add to queue

#### **Favorites**
Favorites management:
- Liked tracks
- Add/remove favorites
- Play favorites

#### **JJKLoginScreen**
Manga-themed login screen:
- Cream paper background with halftone overlay
- Ink-stroke typography and offset shadows
- Manga panel-style login button
- Speed lines and page frame

#### **CursedEnergyParticles**
Manga ink particle system:
- Ink dots, lines, and brush-like shapes
- Black ink on paper aesthetic
- Speed lines on high-intensity beats
- Performance-optimized rendering

### Shared UI Components

#### **Button**
Reusable button component (manga style):
- Variants: `primary` (black ink), `secondary`, `ghost`, `danger`
- Offset shadow on primary buttons
- Sizes: `sm`, `md`, `lg`
- Loading states
- Disabled states

#### **Card**
Manga panel card:
- Variants: `default`, `elevated`, `outlined`
- Solid borders with offset ink shadows
- Manga panel framing

#### **LoadingSpinner**
Animated loading indicator:
- Customizable size
- Manga ink styling
- Smooth rotation

#### **Toast**
Toast notification system:
- Success, error, info variants
- Auto-dismiss
- Stack management
- Manga panel styling

#### **ErrorBoundary**
Error boundary component:
- Catches React errors
- Fallback UI
- Error reporting

### Visualizer Components

#### **Scene**
Main 3D scene:
- React Three Fiber Canvas
- Camera controls
- Lighting system
- Environment setup
- Mobile optimizations

#### **CursedCore**
Audio-reactive 3D core:
- Beat-reactive geometry
- Character colors
- Energy intensity mapping
- GPU-accelerated

#### **Effects**
Post-processing wrapper:
- Effect composer
- Performance optimization
- Conditional rendering

#### **MangaPostProcess**
Manga-style post-processing:
- Halftone dot screen
- Chromatic aberration
- Noise effects
- Impact frames
- Slash effects

---

## 🪝 Hooks & Utilities

### Custom Hooks

#### **useBeatDetector**
Real-time beat detection:
- Analyzes audio frequency data
- Detects beats with configurable sensitivity
- Updates store with beat intensity
- BPM calculation

#### **useCursedSpeech**
Cursed speech audio system:
- Plays character voice lines
- SFX on events (Black Flash, Cleave)
- Domain expansion callouts
- Track skip reactions

#### **useKeyboardShortcuts**
Global keyboard shortcuts:
- `Space`: Play/pause
- `Cmd/Ctrl + Arrow Right`: Next track
- `Cmd/Ctrl + Arrow Left`: Previous track
- Respects input focus

#### **useDebounce**
Debounce utility:
- Delays value updates
- Performance optimization
- Configurable delay

#### **useFocusTrap**
Focus trap for modals:
- Traps focus within modal
- Keyboard navigation
- Accessibility support

#### **useHapticFeedback**
Haptic feedback (mobile):
- Vibration on interactions
- Beat-reactive haptics
- Mobile-only

#### **useToast**
Toast notification hook:
- Show/hide toasts
- Multiple toast support
- Auto-dismiss

#### **useMediaQuery**
Responsive media query hook:
- Breakpoint detection
- Reactive updates
- SSR-safe

### Utility Functions

#### **Color Utilities** (`colorUtils.ts`)
- `getVisibleTextColor()`: Calculates readable text color
- `getVisibleBorderColor()`: Calculates visible border color
- `getLuminance()`: Calculates color luminance
- `hexToRgb()`: Converts hex to RGB
- `brightenColor()`: Brightens colors

#### **Format Utilities** (`format.ts`)
- `formatTime()`: Formats seconds to MM:SS
- `formatDuration()`: Formats milliseconds
- Number formatting utilities

#### **Animation Utilities** (`animations.ts`)
- Animation keyframes
- Easing functions
- Transition helpers

#### **Accessibility Utilities** (`accessibility.ts`)
- ARIA helpers
- Focus management
- Screen reader support

#### **Class Name Utility** (`cn.ts`)
- Combines `clsx` and `tailwind-merge`
- Conditional class names
- Tailwind conflict resolution

---

## 🎨 Design System

### Manga Theme

The entire UI uses a **manga aesthetic**:

- **Color Palette**
  - `manga-paper`: `#f4f4f0` — Warm cream paper background
  - `manga-ink`: `#0a0a0a` — Deep black ink for text and borders
  - `manga-panel`: `#ffffff` — White for panels and cards
  - `manga-tone`: `#d4d4d4` — Screentone gray

- **Visual Elements**
  - **Offset shadows**: `4px 4px 0px #0a0a0a` (ink drop shadow)
  - **Halftone patterns**: Radial dot screens for texture
  - **Speed lines**: Action-line overlays on beats
  - **Borders**: Bold 2–4px black ink borders, no rounded corners
  - **Typography**: `font-manga` (Impact/Comic Neue), `font-jp` (Noto Serif JP)

- **Component Styling**
  - Panels: White background, black border, offset shadow
  - Speech bubbles: Manga-style with tails
  - Buttons: Solid black with offset shadow on hover
  - No glass/blur effects — solid manga ink and paper

### UI Constants

Located in `lib/constants/ui.ts`:

- **Animation Durations**: `FAST` (150ms), `NORMAL` (300ms), `SLOW` (500ms), `VERY_SLOW` (1000ms)
- **Z-Index Layers**: `BACKGROUND` (0), `SCENE` (1), `OVERLAY` (10), `MODAL` (50), `TOOLTIP` (100)
- **Spacing Scale**: `XS` (4px), `SM` (8px), `MD` (16px), `LG` (24px), `XL` (32px), `XXL` (48px)
- **Border Radius**: `SM` (8px), `MD` (12px), `LG` (16px), `XL` (24px), `FULL` (9999px)
- **Opacity Levels**: `DISABLED` (0.3), `HOVER` (0.8), `ACTIVE` (0.6), `GHOST` (0.5)
- **Breakpoints**: `SM` (640px), `MD` (768px), `LG` (1024px), `XL` (1280px), `2XL` (1536px)

### Easing Functions

- `EASE_IN`: `cubic-bezier(0.4, 0, 1, 1)`
- `EASE_OUT`: `cubic-bezier(0, 0, 0.2, 1)`
- `EASE_IN_OUT`: `cubic-bezier(0.4, 0, 0.2, 1)`
- `SPRING`: `cubic-bezier(0.34, 1.56, 0.64, 1)`
- `SMOOTH`: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`

### Character Colors (3D & Internal)

Character color palettes are used for the 3D visualizer and internal logic:

- **Primary, Secondary, Accent, Glow**: 4-color system per character
- **Energy Gradients**: Low/mid/high intensity RGB values

The main UI shell uses manga ink/paper; character colors appear in the 3D scene and lyric-mood features.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Space` | Play/Pause |
| `Cmd/Ctrl + →` | Next track |
| `Cmd/Ctrl + ←` | Previous track |

**Note**: Shortcuts are disabled when typing in input fields.

---

## ♿ Accessibility

### WCAG Compliance

- **ARIA Labels**: All interactive elements have descriptive ARIA labels
- **Keyboard Navigation**: Full keyboard support for all features
- **Focus Management**: Visible focus indicators, focus trap for modals
- **Screen Reader Support**: Semantic HTML, proper heading hierarchy
- **Color Contrast**: Automatic text color calculation for readability
- **Reduced Motion**: Respects `prefers-reduced-motion` media query
- **Skip Links**: Skip to main content link

### Accessibility Features

- **Focus Trap**: Modals trap focus for keyboard navigation
- **ARIA Roles**: Proper roles for listboxes, options, buttons
- **Live Regions**: Dynamic content announcements
- **Touch Targets**: Minimum 44x44px touch targets on mobile
- **Error States**: Clear error messages and states

---

## ⚡ Performance Optimizations

### React Optimizations

- **Memoization**: `useMemo` and `React.memo` for expensive computations
- **Lazy Loading**: Dynamic imports for heavy components
- **Code Splitting**: Automatic code splitting with Next.js
- **Optimized Re-renders**: Careful dependency arrays

### 3D Optimizations

- **GPU Acceleration**: Hardware-accelerated animations
- **Mobile Tuning**: Reduced lighting/shadow complexity on mobile
- **Frame Rate Control**: Adaptive quality based on device
- **LOD System**: Level of detail for 3D models (future)

---

## 🛠️ Tech Stack

### Core Framework

- **Next.js 15**: React framework with App Router
- **React 19**: UI library
- **TypeScript 5**: Type safety

### 3D Graphics

- **React Three Fiber 9.0**: React renderer for Three.js
- **Three.js r165**: 3D graphics library
- **@react-three/drei 10.0**: Useful helpers for R3F
- **@react-three/postprocessing 3.0**: Post-processing effects
- **maath 0.10.5**: Math utilities for 3D

### State Management

- **Zustand 4.5**: Lightweight state management

### Styling

- **Tailwind CSS 3.4**: Utility-first CSS framework
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

### Authentication

- **NextAuth v5 (beta)**: Authentication framework
- **Spotify OAuth 2.0**: Authentication provider

### Audio

- **Spotify Web Playback SDK**: Audio streaming and control

### Development Tools

- **ESLint**: Code linting
- **TypeScript**: Type checking
- **Next.js ESLint Config**: Next.js-specific linting rules

---

## 💻 Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended rules
- **Formatting**: Prettier (if configured)
- **Naming**: camelCase for variables, PascalCase for components

### Project Conventions

- **Components**: Functional components with TypeScript
- **Hooks**: Custom hooks in `/hooks` directory
- **Utils**: Pure utility functions in `/lib/utils`
- **Types**: TypeScript types in `/lib/types`
- **Constants**: App constants in `/lib/constants`
- **State**: Zustand store in `/store`

### Adding New Features

1. **New Character**:
   - Add character data to `lib/types/character.ts`
   - Add character image to `/public/characters/`
   - Add quotes to `lib/data/characterQuotes.ts`

2. **New UI Component**:
   - Create component in `/components/UI/`
   - Use shared components from `/components/UI/shared/`
   - Follow existing component patterns

3. **New Hook**:
   - Create hook in `/hooks/`
   - Export from hook file
   - Document usage

---

## 🗺️ Future Roadmap

### Planned Features (from DOMAIN_EXPANSION_OFFERINGS.md)

#### **Cursed Speech Audio System**
- Character voice lines for domain expansions
- SFX for techniques (Black Flash, Cleave, etc.)
- Track skip reactions
- Audio file support in `/public/audio/`

#### **Malevolent Shrine Visual Mode**
- 3D shrine model (`shrine.glb`)
- Custom shader materials
- Cleave screen-slash effects
- Character-specific domain environments

#### **Enhanced Manga Post-Processing**
- Halftone dot patterns
- Impact frame overlays
- Grain textures
- Scratch effects

#### **Domain Expansion Flow**
- Volume dampening during expansion
- Barrier sphere animations
- Environment switching
- Technique-specific visuals

### Asset Requirements

See `DOMAIN_EXPANSION_OFFERINGS.md` for complete asset checklist:
- Voice lines (`/public/audio/voices/`)
- Sound effects (`/public/audio/sfx/`)
- 3D models (`/public/models/`)
- Textures (`/public/textures/`)

---

## 📝 License

This project is for **personal use only**.

**Note**: This project uses Jujutsu Kaisen characters and themes, which are the property of Gege Akutami and Shueisha. This is a fan project and is not affiliated with or endorsed by the official creators.

---

## 🙏 Acknowledgments

- **Jujutsu Kaisen (呪術廻戦)** by Gege Akutami - Source of inspiration
- **Spotify** - Web Playback SDK and API
- **React Three Fiber** - Amazing 3D React integration
- **Next.js Team** - Excellent framework
- **Three.js Community** - Powerful 3D library

---

## 📚 Additional Documentation

- **REFINEMENTS.md**: Detailed codebase refinements and improvements
- **DOMAIN_EXPANSION_OFFERINGS.md**: Future domain expansion feature specifications
- **Character Images README**: `/public/characters/README.md` - Character image requirements

---

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

---

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Built with cursed energy and React** ⚡  
*Manga-themed from login to domain expansion*
