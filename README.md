# Sukuna - Cursed Energy Visualizer 呪力ビジュアライザー

A high-performance, **Jujutsu Kaisen**-themed 3D audio-reactive web application built with Next.js 15, React Three Fiber, and Spotify integration.

![Jujutsu Kaisen](https://img.shields.io/badge/Jujutsu%20Kaisen-Inspired-9333ea?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Three.js](https://img.shields.io/badge/Three.js-r165-green?style=for-the-badge&logo=three.js)

## ✨ Features

### Core Features
- 🎵 **Spotify Integration** - Real-time audio streaming and playback control
- 🎨 **3D Reactive Visualizations** - Audio-reactive visuals with React Three Fiber
- ⚡ **Domain Expansion Animations** - Cinematic transitions for every track
- 🎭 **Character Selection** - Switch between 8 JJK sorcerers, each with unique themes
- 📊 **Audio Analysis** - BPM, energy, and valence visualization
- 🎮 **Playback Controls** - Play, pause, skip tracks
- 🔐 **Secure Authentication** - NextAuth v5 with Spotify OAuth
- 📱 **Mobile Optimized** - Fully responsive design for all devices
- 💬 **Character Quotes** - Dynamic quotes and animations per character

### JJK Characters
Each character features custom:
- Domain Expansion names (Japanese & English)
- Cursed energy color palettes
- Unique techniques
- Themed UI and lighting
- Character-specific quotes and animations
- Character images (PNG support)

#### Available Sorcerers:
1. **両面宿儺 (Ryomen Sukuna)** - Malevolent Shrine
   - Colors: Deep purple/red cursed energy
   - Technique: Cleave & Dismantle (解・捌)

2. **五条悟 (Satoru Gojo)** - Unlimited Void
   - Colors: Blue/white pure energy
   - Technique: Limitless (無下限呪術)

3. **虎杖悠仁 (Yuji Itadori)** - Unknown Domain
   - Colors: Red/black energy
   - Technique: Black Flash (黒閃)

4. **乙骨憂太 (Yuta Okkotsu)** - Authentic Mutual Love
   - Colors: Blue/white pure energy
   - Technique: Copy (模倣)

5. **伏黒甚爾 (Toji Fushiguro)** - No Domain
   - Colors: Gray/black
   - Technique: Heavenly Restriction (天与呪縛)

6. **東堂葵 (Aoi Todo)** - My Best Friend
   - Colors: Orange/brown
   - Technique: Boogie Woogie (不義遊戯)

7. **秤金次 (Kinji Hakari)** - Idle Death Gamble
   - Colors: Cyan/gold
   - Technique: Rough Energy (ラフエネルギー)

8. **脹相 (Choso)** - No Domain
   - Colors: Red/crimson
   - Technique: Blood Manipulation (赤血操術)

## 🏗️ Project Structure

```
sukuna/
├── app/                    # Next.js app directory
│   ├── actions/           # Server actions
│   ├── api/              # API routes
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page
├── components/
│   ├── UI/               # UI components
│   │   ├── shared/       # Shared UI components (Button, Card, etc.)
│   │   ├── MusicPlayerPanel.tsx
│   │   ├── CharacterSelector.tsx
│   │   ├── CharacterSelectionModal.tsx
│   │   ├── BackgroundQuotes.tsx
│   │   └── ...
│   └── Visualizer/       # 3D visualization components
│       ├── Scene.tsx
│       ├── CursedCore.tsx
│       ├── Effects.tsx
│       └── ...
├── lib/
│   ├── constants/        # App constants
│   ├── data/            # Static data (quotes, etc.)
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript types
│   └── utils/           # Utility functions
├── store/               # Zustand store
├── public/
│   └── characters/      # Character PNG images
└── hooks/               # React hooks
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Spotify Premium account
- Spotify Developer credentials

### Installation

1. **Clone and install**:
   ```bash
   git clone https://github.com/ckakkar/sukuna.git
   cd sukuna
   npm install
   ```

2. **Set up Spotify Developer App**:
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new app
   - Add redirect URI: `http://localhost:3000/api/auth/callback/spotify`

3. **Environment Variables**:
   Create a `.env.local` file:
   ```env
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Add Character Images**:
   Place character PNG images in `/public/characters/`:
   - `sukuna.png`
   - `gojo.png`
   - `yuji.png`
   - `yuta.png`
   - `toji.png`
   - `todo.png`
   - `kinjihakari.png`
   - `choso.png`

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open** [http://localhost:3000](http://localhost:3000)

## 🎨 Design System

### Shared Components
- **Button** - Consistent button styling with variants
- **Card** - Glass morphism card component
- **LoadingSpinner** - Animated loading indicator

### Utilities
- **cn()** - Class name utility for conditional classes
- **formatTime()** - Time formatting utilities
- **getVisibleTextColor()** - Color contrast utilities
- **useDebounce()** - Debounce hook
- **useMediaQuery()** - Media query hook

### Constants
- **UI_CONSTANTS** - Animation durations, spacing, z-index layers
- **EASING** - Animation easing functions

## 📱 Mobile Optimization

The app is fully optimized for mobile devices with:
- Responsive breakpoints (sm, md, lg)
- Touch-friendly interactions
- Optimized 3D scene performance
- Mobile-specific layouts
- Reduced motion support

## 🎯 Key Features

### Character System
- **Character Selection Modal** - Appears on first login
- **Character Switch Animations** - Smooth transitions with quotes
- **Background Quotes** - Random character quotes every 10-15 seconds
- **Character-Specific Styling** - Colors, glows, and effects

### Audio Visualization
- **Beat Detection** - Real-time beat detection from Spotify audio
- **Reactive 3D Core** - Audio-reactive cursed energy core
- **Dynamic Lighting** - Beat-reactive lighting system
- **Post-Processing Effects** - Manga-style effects and chromatic aberration

### Performance
- **Memoization** - Optimized React components
- **GPU Acceleration** - Hardware-accelerated animations
- **Lazy Loading** - Dynamic imports for heavy components
- **Reduced Motion** - Respects user preferences

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **3D Graphics**: React Three Fiber, Three.js
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth v5
- **Audio**: Spotify Web Playback SDK

## 📝 License

This project is for personal use only.

## 🙏 Acknowledgments

Inspired by Jujutsu Kaisen (呪術廻戦) by Gege Akutami
