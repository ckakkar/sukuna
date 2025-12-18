# Changelog

All notable changes to the Sukuna - Cursed Energy Visualizer project.

## [2.0.0] - 2025-12-18

### 🎉 Major Features Added

#### JJK Character System
- **Character Selection** - Added 5 playable Jujutsu Kaisen characters
  - Sukuna (両面宿儺) - Malevolent Shrine
  - Yuji Itadori (虎杖悠仁) - Divergent Fist
  - Yuta Okkotsu (乙骨憂太) - Authentic Mutual Love  
  - Toji Fushiguro (伏黒甚爾) - Heavenly Restriction
  - Aoi Todo (東堂葵) - Boogie Woogie
- Each character has unique:
  - Color schemes and energy palettes
  - Domain expansion names (Japanese & English)
  - Cursed techniques
  - Themed UI and lighting

#### Domain Expansion System
- **Automatic Domain Expansion** - Triggers on every new track
- **Cinematic Animations** - 3-second animated sequence featuring:
  - Expanding circles with character colors
  - Domain name display in Japanese and English
  - Particle effects
  - Radial gradient backgrounds
- Character-specific visual themes

#### UI Enhancements
- **Character Selector** - Dropdown menu in top-right corner
  - Shows all 5 characters with Japanese names
  - Current selection highlighted
  - Smooth transitions between characters
- **Playback Controls** - Bottom-center music controls
  - Play/Pause button
  - Previous/Next track buttons
  - Styled with character theme
- **Logout Functionality** - Disconnect button in top-right
  - Server action-based logout
  - Returns to login screen

### 🐛 Bug Fixes & Improvements

#### 1. Error Boundaries ✅
- **Added**: `components/ErrorBoundary.tsx`
- Catches React errors gracefully
- Displays JJK-themed error messages in Japanese and English
- Provides "Restart Domain" button
- Prevents full application crashes

#### 2. Memory Leak Fixes ✅
- **Fixed**: `components/Visualizer/Effects.tsx`
- **Issue**: Creating new Vector2 instances on every effect run
- **Solution**: Using `useRef` for Vector2 and updating with `useFrame`
- Prevents memory buildup during long sessions

#### 3. Playback Controls ✅
- **Added**: `components/UI/PlaybackControls.tsx`
- Full playback control via Spotify Web API
- Play, pause, previous, next functionality
- Error handling for failed requests
- Themed with character colors

#### 4. Error Handling in SpotifyWebPlayer ✅
- **Improved**: `components/SpotifyWebPlayer.tsx`
- Added try-catch blocks for all async operations
- Error listeners for:
  - Authentication errors
  - Account errors
  - Playback errors
  - Not ready events
- Proper initialization guards
- Script loading error handling
- Cleanup on unmount

#### 5. Using maath's damp Function ✅
- **Changed**: `components/Visualizer/CursedCore.tsx`
- Replaced custom damp implementation
- Now using `import { damp } from 'maath/easing'`
- Provides industry-standard smooth interpolation
- Better performance and consistency

#### 6. Loading States for Track Analysis ✅
- **Added**: Loading indicators throughout
- `isLoadingAnalysis` state in store
- "[ANALYZING...]" indicator in Overlay
- Prevents duplicate analysis requests
- Shows loading status to user

### 🎨 Visual Improvements

#### Character-Themed Visuals
- **Dynamic Color Palette** - UI adapts to selected character
- **Character-Based Lighting** - Scene lights use character colors
- **Energy Visualization** - Core uses character's energy gradient
  - Low energy: Base character color
  - Mid energy: Primary character color
  - High energy: Bright accent color
- **Smooth Transitions** - Seamless character switching

#### Enhanced UI
- **Loading Indicators** - Shows when analyzing tracks
- **Character Info** - Displays technique names in Japanese
- **Energy Metrics** - BPM, energy%, valence% with character colors
- **Status Indicators** - Pulsing dots with character-themed glow

### 🏗️ Technical Improvements

#### New Type Definitions
- **Added**: `lib/types/character.ts`
  - `CharacterType` - Union type for characters
  - `CharacterTheme` - Complete theme interface
  - `CHARACTERS` - Full character database

#### Store Enhancements
- **Updated**: `store/useSpotifyStore.ts`
- Added `selectedCharacter` state
- Added `isLoadingAnalysis` state
- Added `isDomainExpanding` state
- New actions for character and domain management

#### Authentication Improvements
- **Added**: `signOutAction` server action
- Proper App Router authentication flow
- Server-side session handling

### 📝 Documentation

#### New Documentation Files
- **IMPLEMENTATION_GUIDE.md**
  - Complete feature documentation
  - Setup instructions
  - Architecture overview
  - Customization guide
  - Troubleshooting section

- **Updated README.md**
  - JJK character descriptions
  - Feature showcase
  - Quick start guide
  - Technical highlights
  - Customization examples

- **CHANGELOG.md** (this file)
  - Version history
  - Feature breakdown
  - Bug fix details

### 🔄 File Changes Summary

#### New Files
```
components/ErrorBoundary.tsx
components/UI/CharacterSelector.tsx
components/UI/DomainExpansion.tsx
components/UI/PlaybackControls.tsx
lib/types/character.ts
IMPLEMENTATION_GUIDE.md
CHANGELOG.md
```

#### Modified Files
```
app/actions/auth.ts (added signOutAction)
app/page.tsx (added domain expansion, error boundary)
components/UI/Overlay.tsx (character theming, logout)
components/Visualizer/CursedCore.tsx (maath damp, character colors)
components/Visualizer/Effects.tsx (memory leak fix)
components/Visualizer/Scene.tsx (character lighting)
components/SpotifyWebPlayer.tsx (error handling, domain triggers)
store/useSpotifyStore.ts (new states and actions)
README.md (comprehensive update)
```

### 🎯 Breaking Changes
- None - All changes are additive or fixes

### ⚡ Performance Improvements
- Eliminated memory leaks in Effects component
- Optimized damp function using maath library
- Added loading states to prevent duplicate API calls
- Improved error recovery mechanisms

### 🔮 Future Enhancements (Planned)
- [ ] Add Gojo Satoru character
- [ ] Add Megumi Fushiguro character
- [ ] Add Nobara Kugisaki character
- [ ] Character-specific 3D models
- [ ] Cursed technique visual effects
- [ ] Keyboard shortcuts for playback
- [ ] Fullscreen mode
- [ ] Audio frequency visualization
- [ ] Playlist management

---

## [1.0.0] - Initial Release

### Initial Features
- Spotify authentication
- Real-time audio streaming
- 3D audio-reactive visualization
- Basic UI overlay
- Track analysis display
- Sukuna theme

---

**Format**: [Major.Minor.Patch]
- **Major**: Breaking changes or major feature additions
- **Minor**: New features, backwards compatible
- **Patch**: Bug fixes and small improvements
