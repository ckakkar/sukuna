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
- 🎭 **Character Selection** - Switch between 5 JJK sorcerers, each with unique themes
- 📊 **Audio Analysis** - BPM, energy, and valence visualization
- 🎮 **Playback Controls** - Play, pause, skip tracks
- 🔐 **Secure Authentication** - NextAuth v5 with Spotify OAuth

### JJK Characters
Each character features custom:
- Domain Expansion names (Japanese & English)
- Cursed energy color palettes
- Unique techniques
- Themed UI and lighting

#### Available Sorcerers:
1. **両面宿儺 (Ryomen Sukuna)** - Malevolent Shrine
   - Colors: Deep purple/red cursed energy
   - Technique: Cleave & Dismantle (解・捌)

2. **虎杖悠仁 (Yuji Itadori)** - Unknown Domain
   - Colors: Red/black energy
   - Technique: Divergent Fist (逕庭拳)

3. **乙骨憂太 (Yuta Okkotsu)** - Authentic Mutual Love
   - Colors: Blue/white pure energy
   - Technique: Rika's Curse (里香の呪い)

4. **伏黒甚爾 (Toji Fushiguro)** - No Domain
   - Colors: Green/black
   - Technique: Heavenly Restriction (天与呪縛)

5. **東堂葵 (Aoi Todo)** - My Best Friend
   - Colors: Orange/brown
   - Technique: Boogie Woogie (不義遊戯)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Spotify Premium account
- Spotify Developer credentials

### Installation

1. **Clone and install**:
   ```bash
   git clone <your-repo>
   cd sukuna
   npm install
   ```

2. **Set up Spotify Developer App**:
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new app
   - Add redirect URI: `http://localhost:3000/api/auth/callback/spotify`
   - Copy Client ID and Client Secret

3. **Configure environment variables**:
   
   Create `.env.local`:
   ```env
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   NEXTAUTH_SECRET=your_random_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

   Generate `NEXTAUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

## 🎮 Usage

1. **Connect Spotify** - Click the connection button
2. **Select Character** - Choose your sorcerer from the dropdown (top-right)
3. **Play Music** - Use Spotify app or web player to start playback
4. **Control Playback** - Use the controls at the bottom
5. **Experience Domain Expansion** - Watch as each track triggers an animated domain expansion

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Authentication**: NextAuth v5
- **State Management**: Zustand
- **3D Rendering**: React Three Fiber + Three.js
- **Audio**: Spotify Web Playback SDK + Web API
- **Styling**: Tailwind CSS
- **TypeScript**: Full type safety

### Project Structure
```
/
├── app/                          # Next.js App Router
│   ├── actions/auth.ts          # Server actions
│   ├── api/auth/[...nextauth]/  # NextAuth routes
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main page
├── components/
│   ├── UI/                      # UI components
│   │   ├── CharacterSelector.tsx
│   │   ├── DomainExpansion.tsx
│   │   ├── Overlay.tsx
│   │   └── PlaybackControls.tsx
│   ├── Visualizer/              # 3D visualization
│   │   ├── CursedCore.tsx      # Reactive 3D core
│   │   ├── Effects.tsx         # Post-processing
│   │   ├── Scene.tsx           # Three.js scene
│   │   └── SceneWrapper.tsx    # Client wrapper
│   ├── AuthInitializer.tsx
│   ├── ErrorBoundary.tsx
│   └── SpotifyWebPlayer.tsx
├── lib/
│   ├── types/                   # TypeScript types
│   │   ├── character.ts        # Character definitions
│   │   └── spotify.ts          # Spotify types
│   └── spotify-actions.ts      # Spotify API calls
├── store/
│   └── useSpotifyStore.ts      # Zustand store
├── types/
│   └── next-auth.d.ts          # NextAuth types
└── auth.ts                      # NextAuth config
```

## 🔧 Technical Highlights

### 1. Error Boundaries
Graceful error handling with JJK-themed error displays

### 2. Memory Leak Prevention
Fixed in Effects component using `useRef` and `useFrame`

### 3. Smooth Animations
Using `maath/easing` damp function for butter-smooth interpolations

### 4. Performance Optimized
- Dynamic imports for client-only rendering
- Efficient state management with Zustand
- Throttled API calls with loading states

### 5. Domain Expansion System
Automatic 3-second cinematic animations triggered by track changes

## 🎨 Customization

### Adding New Characters

Edit `lib/types/character.ts`:

```typescript
newcharacter: {
  id: "newcharacter",
  name: "CHARACTER NAME",
  japaneseName: "キャラクター名",
  domain: "Domain Expansion Name",
  domainJapanese: "領域名",
  technique: "Technique Name",
  techniqueJapanese: "技術名",
  colors: {
    primary: "#hexcode",
    secondary: "#hexcode",
    accent: "#hexcode",
    glow: "#hexcode",
  },
  energy: {
    low: { r: 0/255, g: 0/255, b: 0/255 },
    mid: { r: 0/255, g: 0/255, b: 0/255 },
    high: { r: 0/255, g: 0/255, b: 0/255 },
  },
}
```

### Customizing Visualizations

Modify `components/Visualizer/CursedCore.tsx`:
- Change 3D geometry
- Adjust material properties
- Tweak scale/rotation formulas

## 🐛 Troubleshooting

### Spotify SDK Issues
- Verify redirect URI in Spotify Dashboard
- Check environment variables
- Ensure Premium account

### Performance Issues
- Lower geometry detail in CursedCore
- Disable post-processing temporarily
- Check GPU acceleration

### Domain Expansion Not Showing
- Check `isDomainExpanding` state
- Verify animations aren't blocked
- Check browser console for errors

## 📝 License

This project is for educational purposes. Jujutsu Kaisen is © Gege Akutami.

## 🙏 Credits

- **Jujutsu Kaisen** by Gege Akutami
- **Spotify** for Web API and SDK
- **Three.js** community
- **Vercel** for Next.js

## 🔮 Future Enhancements

- [ ] More JJK characters (Gojo, Megumi, Nobara)
- [ ] Character-specific 3D models
- [ ] Cursed technique visual effects
- [ ] Playlist integration
- [ ] Keyboard shortcuts
- [ ] Full-screen mode
- [ ] Real-time audio frequency analysis

---

<div align="center">

**領域展開: 伏魔御厨子**

*Domain Expansion: Malevolent Shrine*

Made with 呪力 (cursed energy) by fans of Jujutsu Kaisen

</div>
