# Sukuna - Cursed Energy Visualizer - Implementation Guide

## Overview
This project is a Jujutsu Kaisen-themed 3D audio visualizer that integrates with Spotify to create immersive, character-specific domain expansion experiences.

## Key Features Implemented

### 1. Error Boundaries ✅
- **File**: `components/ErrorBoundary.tsx`
- Catches and handles React errors gracefully
- Displays JJK-themed error messages
- Provides restart functionality

### 2. Memory Leak Fixes ✅
- **File**: `components/Visualizer/Effects.tsx`
- Fixed by using `useRef` and `useFrame` instead of `useEffect` with new Vector2 instances
- Prevents memory leaks from creating new objects on every render

### 3. Playback Controls UI ✅
- **File**: `components/UI/PlaybackControls.tsx`
- Play/Pause, Previous, Next track controls
- Integrates with Spotify Web API
- Styled with JJK theme

### 4. Improved Error Handling ✅
- **File**: `components/SpotifyWebPlayer.tsx`
- Added try-catch blocks for all async operations
- Error listeners for authentication, playback, and account errors
- Proper cleanup and initialization guards

### 5. Using maath's damp Function ✅
- **File**: `components/Visualizer/CursedCore.tsx`
- Replaced custom damp implementation with `import { damp } from 'maath/easing'`
- Provides smoother interpolation

### 6. Loading States for Track Analysis ✅
- **File**: `store/useSpotifyStore.ts`
- Added `isLoadingAnalysis` state
- Displayed in Overlay component
- Shows "[ANALYZING...]" indicator

## New JJK Features

### 7. Character Selection System ✅
- **Files**: 
  - `lib/types/character.ts` - Character definitions and themes
  - `components/UI/CharacterSelector.tsx` - Character selection UI
  - `store/useSpotifyStore.ts` - Character state management

**Available Characters**:
- **Sukuna** (両面宿儺): Deep purple/red cursed energy - Malevolent Shrine
- **Yuji** (虎杖悠仁): Red/black energy - Divergent Fist
- **Yuta** (乙骨憂太): Blue/white pure cursed energy - Authentic Mutual Love
- **Toji** (伏黒甚爾): Green/black - Heavenly Restriction (no cursed energy)
- **Todo** (東堂葵): Orange/brown - Boogie Woogie

Each character has:
- Unique color schemes
- Custom domain expansion names
- Character-specific techniques
- Themed energy gradients

### 8. Domain Expansion Animations ✅
- **File**: `components/UI/DomainExpansion.tsx`
- Triggers automatically when a new song plays
- 3-second animated sequence with:
  - Expanding circles
  - Character-specific colors
  - Domain name display in Japanese and English
  - Particle effects
- Uses CSS animations for performance

### 9. Login/Logout Functionality ✅
- **Files**: 
  - `app/page.tsx` - Login screen
  - `components/UI/Overlay.tsx` - Logout button
- Spotify OAuth integration via NextAuth
- Character-themed login screen
- Disconnect button in top-right corner

### 10. Character-Themed UI ✅
- **File**: `components/UI/Overlay.tsx`
- Dynamic color theming based on selected character
- Character names in Japanese and English
- Character-specific technique names
- Themed energy indicators

### 11. Character-Based Visual Effects ✅
- **Files**:
  - `components/Visualizer/CursedCore.tsx` - Character energy colors
  - `components/Visualizer/Scene.tsx` - Character lighting
- Visual core adapts to character's energy palette
- Scene lighting matches character colors
- Smooth transitions between characters

## Project Structure

```
/
├── app/
│   ├── actions/
│   │   └── auth.ts                    # Server action for Spotify sign-in
│   ├── api/auth/[...nextauth]/
│   │   └── route.ts                   # NextAuth API route
│   ├── globals.css                    # Global styles
│   ├── layout.tsx                     # Root layout
│   └── page.tsx                       # Main page with login/app
├── components/
│   ├── UI/
│   │   ├── CharacterSelector.tsx      # Character selection dropdown
│   │   ├── DomainExpansion.tsx        # Domain expansion animation
│   │   ├── Overlay.tsx                # Main UI overlay
│   │   └── PlaybackControls.tsx       # Music playback controls
│   ├── Visualizer/
│   │   ├── CursedCore.tsx             # 3D reactive core
│   │   ├── Effects.tsx                # Post-processing effects
│   │   ├── Scene.tsx                  # Three.js scene
│   │   └── SceneWrapper.tsx           # Client-side scene wrapper
│   ├── AuthInitializer.tsx            # Syncs auth to store
│   ├── ErrorBoundary.tsx              # Error boundary component
│   └── SpotifyWebPlayer.tsx           # Spotify SDK integration
├── lib/
│   ├── types/
│   │   ├── character.ts               # Character types and themes
│   │   └── spotify.ts                 # Spotify types
│   └── spotify-actions.ts             # Server actions for Spotify API
├── store/
│   └── useSpotifyStore.ts             # Zustand state store
├── types/
│   └── next-auth.d.ts                 # NextAuth type extensions
├── auth.ts                            # NextAuth configuration
└── package.json                       # Dependencies
```

## Key Dependencies

```json
{
  "next": "^15.5.9",
  "react": "^19.0.0",
  "next-auth": "^5.0.0-beta.25",
  "zustand": "^4.5.0",
  "@react-three/fiber": "^9.0.0",
  "@react-three/drei": "^10.0.0",
  "@react-three/postprocessing": "^3.0.0",
  "three": "^0.165.0",
  "maath": "^0.10.5"
}
```

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables** (`.env.local`):
   ```env
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   NEXTAUTH_SECRET=your_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

3. **Spotify Developer Setup**:
   - Go to https://developer.spotify.com/dashboard
   - Create a new app
   - Add redirect URI: `http://localhost:3000/api/auth/callback/spotify`
   - Copy Client ID and Client Secret

4. **Run development server**:
   ```bash
   npm run dev
   ```

## How It Works

### Authentication Flow
1. User clicks "CONNECT SPOTIFY"
2. NextAuth redirects to Spotify OAuth
3. After authorization, user returns to app
4. Access token stored in session and Zustand store
5. SpotifyWebPlayer initializes with SDK

### Domain Expansion Flow
1. New song starts playing
2. SpotifyWebPlayer detects track change
3. Sets `isDomainExpanding` to true
4. DomainExpansion component animates for 3 seconds
5. Simultaneously fetches track analysis
6. Updates visualization with track data

### Character Selection Flow
1. User opens CharacterSelector dropdown
2. Clicks desired character
3. Store updates `selectedCharacter`
4. CursedCore reacts to new character energy colors
5. Scene lighting updates to character theme
6. Overlay UI updates with character info

### Visualization Flow
1. Track analysis provides BPM, energy, valence
2. CursedCore scales and colors based on energy
3. Rotation speed based on BPM
4. Effects (Bloom, Chromatic Aberration) react to energy
5. Character theme determines color palette
6. Smooth interpolation via maath's damp function

## Performance Optimizations

- **Dynamic imports**: Scene uses `next/dynamic` to avoid SSR
- **Error boundaries**: Prevent full app crashes
- **Memory leak prevention**: Proper cleanup and ref usage
- **Smooth animations**: maath's damp for efficient interpolation
- **Throttled API calls**: Loading states prevent duplicate requests

## Customization

### Adding New Characters

Edit `lib/types/character.ts`:

```typescript
export const CHARACTERS: Record<CharacterType, CharacterTheme> = {
  // ... existing characters
  newcharacter: {
    id: "newcharacter",
    name: "NEW CHARACTER",
    japaneseName: "新しいキャラクター",
    domain: "Domain Name",
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
      low: { r: 0, g: 0, b: 0 },
      mid: { r: 0, g: 0, b: 0 },
      high: { r: 0, g: 0, b: 0 },
    },
  },
}
```

### Customizing Visualizations

Edit `components/Visualizer/CursedCore.tsx`:
- Change geometry: `<torusKnotGeometry>` to `<sphereGeometry>`, `<boxGeometry>`, etc.
- Adjust material properties: `metalness`, `roughness`, `clearcoat`
- Modify scale/rotation formulas

## Troubleshooting

### Spotify SDK Not Loading
- Check browser console for errors
- Ensure redirect URI is correctly set in Spotify Dashboard
- Verify environment variables are set

### Domain Expansion Not Showing
- Check `isDomainExpanding` state in React DevTools
- Verify `setIsDomainExpanding` is called in SpotifyWebPlayer
- Check CSS animations are not blocked

### Character Colors Not Changing
- Verify character selection updates store
- Check CursedCore is reading `selectedCharacter` from store
- Ensure Scene component re-renders on character change

### Performance Issues
- Reduce `<torusKnotGeometry>` detail: Lower 256 and 32 values
- Disable post-processing effects temporarily
- Check browser GPU acceleration is enabled

## Future Enhancements

- Add more JJK characters (Gojo, Megumi, Nobara, etc.)
- Implement character-specific 3D models
- Add cursed technique visual effects
- Create playlist integration
- Add keyboard shortcuts for controls
- Implement full-screen mode
- Add audio frequency analysis for more reactive visuals

## Credits

- **Jujutsu Kaisen** by Gege Akutami
- **Spotify Web API** for music data
- **Three.js** for 3D rendering
- **React Three Fiber** for React integration
- **NextAuth** for authentication
- **Zustand** for state management
