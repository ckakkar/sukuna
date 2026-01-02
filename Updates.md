# COMPREHENSIVE JUJUTSU KAISEN WEB APP REFINEMENT PROMPT

You are an expert full-stack developer and UI/UX designer specializing in anime-themed web applications, React Three Fiber, and modern web technologies. Your task is to transform this Jujutsu Kaisen audio visualizer into a next-generation, hyper-polished experience that feels like it was ripped straight from the anime.

## 🎯 PRIMARY OBJECTIVES

1. **ELEVATE JJK THEMING**: Inject authentic Jujutsu Kaisen visual language throughout the entire app
2. **MAXIMIZE FLUIDITY**: Every interaction should feel buttery smooth with micro-animations and transitions
3. **MODERNIZE UI/UX**: Implement cutting-edge design patterns (glassmorphism, neomorphism, parallax, micro-interactions)
4. **ENHANCE IMMERSION**: Make users feel like they're inside a Domain Expansion

## 🎨 VISUAL DESIGN OVERHAUL

### Core JJK Aesthetic Elements to Implement

**1. CURSED ENERGY EFFECTS**
- Add animated cursed energy trails that follow cursor movement (use character's color palette)
- Implement "energy leak" particle effects around interactive elements on hover
- Create pulsing energy waves that emanate from the audio-reactive core
- Add glowing kanji symbols that fade in/out in the background (呪力, 領域展開, 術式)
- Implement "cursed energy residue" - subtle particle trails when switching characters

**2. DOMAIN EXPANSION VISUALS**
- When domain expansion triggers:
  - Full-screen barrier sphere animation with hexagonal/geometric patterns
  - Screen should "shatter" like glass, revealing the domain interior
  - Add distortion effects (lens distortion, chromatic aberration ramping up)
  - Implement a "reality crack" effect - cracks spreading across the screen
  - Background should transform to character-specific environments:
    - **Sukuna**: Buddhist shrine with skeletal architecture
    - **Gojo**: Infinite void with floating blue/white particles
    - **Yuji**: Dark urban environment with red energy
    - **Yuta**: Pure white space with blue accents
- Add character hand signs before domain expansion (freeze frame moment)
- Implement "domain collapse" animation when it ends

**3. TYPOGRAPHY & TEXT EFFECTS**
- Use anime-style title cards for section transitions
- Implement glitch text effect on domain names
- Add vertical Japanese text options (traditional writing style)
- Character names should have brush stroke reveal animations
- Implement "impact text" that zooms in aggressively on beat drops
- Use manga-style sound effect text (ドドド, ゴゴゴ) that appears on strong beats

**4. COLOR & LIGHTING**
- Implement dynamic lighting that shifts based on track mood:
  - High energy = more saturated, intense colors
  - Low energy = desaturated, darker tones
- Add volumetric lighting rays (god rays) in 3D scene
- Character switch should trigger a "color bleed" effect (old character colors bleeding into new)
- Implement "black flash" effect - entire screen flashes black with white lightning
- Add subtle RGB split on high-intensity moments

**5. UI COMPONENTS REDESIGN**

**Music Player Panel:**
- Redesign with anime-style panels (think manga panel layouts)
- Add decorative corner brackets (Japanese architectural elements)
- Implement sliding panel transitions (cards sliding in from sides)
- Album art should have animated border effects (pulsing energy, rotating runes)
- Progress bar should look like a cursed energy meter
- Volume slider should have a vertical katana design
- Add mini character portrait next to track info

**Character Selector:**
- Grid layout should be a circular "technique wheel" instead of standard grid
- Each character slot should have:
  - Animated cursed energy aura
  - Hover effect that reveals domain name in kanji
  - Selection creates expanding circle ripple
- Add character silhouettes that fill with color on hover
- Implement "lock-in" animation (character zooms forward with impact frame)

**Overlay:**
- Redesign as HUD elements with anime-style info boxes
- Add "damage counter" aesthetic for beat intensity
- Domain expansion name should appear with brush stroke animation
- Implement corner decorative elements (think Eva HUD style)
- Add scrolling kanji text in background (Matrix-style but with JJK text)

**Background:**
- Add animated torii gates fading in/out
- Implement subtle parallax scrolling layers
- Add floating kanji symbols that drift slowly
- Create "cursed energy fog" effect at screen edges
- Implement scanline effect for retro anime feel

## âš¡ FLUIDITY & ANIMATION ENHANCEMENTS

### Micro-Interactions to Implement

**1. BUTTON INTERACTIONS**
- Hover: Scale up (1.05x) + glow effect + subtle rotation (1-2deg)
- Click: Scale down (0.95x) + energy burst particles
- Add haptic feedback on mobile
- Ripple effect emanating from click point
- Loading states should use cursed energy spinning animation

**2. TRANSITION ANIMATIONS**
- Page/component transitions should use "panel slide" effects
- Implement shared element transitions (FLIP animations)
- Add motion blur on fast movements
- Use spring physics for all transitions (not linear easing)
- Implement stagger animations for lists (items animate in sequence)

**3. SCROLL ANIMATIONS**
- Parallax scrolling for background elements
- Elements fade in + slide up as they enter viewport
- Add scroll-triggered animations for section reveals
- Implement momentum scrolling with ease-out

**4. AUDIO-REACTIVE ANIMATIONS**
- Everything should react to audio in subtle ways:
  - UI elements pulse with beat
  - Background particles speed up with energy
  - Text glows on beat hits
  - Camera shake on heavy bass
  - Chromatic aberration intensity tied to frequency spectrum

**5. CHARACTER SWITCH ANIMATION OVERHAUL**
- Phase 1: Current character performs exit technique
  - Sukuna: Cleave slash across screen
  - Gojo: Blue implosion
  - Todo: Clap and swap effect
- Phase 2: Transition void (brief black screen with energy particles)
- Phase 3: New character entrance with signature move
- Add dramatic pause frames (freeze for 2-3 frames on impact)
- Implement speed lines radiating from center

## 🎬 MODERN UI/UX PATTERNS

### Design System Upgrades

**1. GLASSMORPHISM EVOLUTION**
- Current glass cards should have:
  - Dynamic blur intensity based on background complexity
  - Subtle inner glow
  - Animated border gradients (gradient position shifts)
  - Frosted glass texture overlay
- Add depth with layered glass panels (z-axis stacking)

**2. NEOMORPHISM ELEMENTS**
- Implement soft shadow UI for controls
- Playback controls should have embossed/debossed feel
- Volume knobs should be 3D with realistic shadows

**3. SCROLL-LINKED ANIMATIONS**
- Implement GSAP ScrollTrigger for reveal animations
- Section headers should "assemble" on scroll (letters flying in)
- Background elements should parallax at different speeds

**4. CURSOR ENHANCEMENTS**
- Custom cursor that changes based on hover target:
  - Default: Small cursed energy orb
  - Hovering button: Expands with character color
  - Hovering character: Shows technique icon
- Add cursor trail particles
- Implement magnetic cursor (snaps slightly toward buttons)

**5. LOADING STATES**
- Initial app load: Domain expansion charging animation
- Track loading: Cursed energy gathering effect
- Character switch: Technique-specific loading animation
- Add skeleton screens with pulsing energy effect

## 🔧 TECHNICAL IMPLEMENTATION DETAILS

### New Components to Create

```typescript
// 1. CursedEnergyTrail.tsx - Cursor follower
// 2. DomainBarrier.tsx - Hexagonal barrier animation
// 3. ImpactFrame.tsx - Manga-style impact overlay
// 4. KanjiRain.tsx - Falling kanji symbols
// 5. TechniqueWheel.tsx - Circular character selector
// 6. RealityCrack.tsx - Screen shatter effect
// 7. BlackFlash.tsx - Black flash animation
// 8. BrushStrokeText.tsx - Animated brush stroke reveal
// 9. EnergyMeter.tsx - Stylized progress bar
// 10. HandSigns.tsx - Character hand sign display
```

### Animation Libraries to Integrate

```bash
npm install framer-motion gsap @react-spring/web lottie-react
```

**Framer Motion** - For component animations and gestures
**GSAP** - For complex timeline animations and ScrollTrigger
**React Spring** - For physics-based animations
**Lottie** - For complex pre-made animations (domain expansion sequences)

### Shader Enhancements (React Three Fiber)

**New Shaders to Implement:**
1. **Energy Flow Shader**: Animated flowing energy texture on core
2. **Barrier Shader**: Hexagonal grid with distortion
3. **Void Shader**: Gojo's infinite void effect (recursive patterns)
4. **Slash Shader**: Sukuna's cleave effect (screen tear)
5. **Glitch Shader**: Digital glitch on technique activation

### Performance Optimizations

```typescript
// Implement these optimizations:
1. Use React.memo() for all pure components
2. Implement virtual scrolling for long lists (playlists/queue)
3. Lazy load heavy 3D components with React.lazy()
4. Use web workers for audio analysis
5. Implement request animation frame for smooth animations
6. Add loading="eager" for above-fold images
7. Implement intersection observer for lazy animations
8. Use CSS transforms (not top/left) for animations
9. Add will-change hints for animated elements
10. Debounce expensive operations (search, resize)
```

## 🎮 INTERACTION PATTERNS

### Gesture Controls (Mobile)
- Swipe up: Open character selector
- Swipe down: Close modals
- Swipe left/right: Change tracks
- Two-finger pinch: Zoom 3D scene
- Long press: Show track options
- Double tap: Like/unlike track

### Keyboard Shortcuts Enhancement
```typescript
// Additional shortcuts to implement:
- 'D': Trigger domain expansion
- 'T': Activate character technique
- Number keys (1-8): Quick character switch
- 'F': Toggle fullscreen
- 'M': Mute/unmute
- 'R': Toggle repeat
- 'S': Toggle shuffle
- 'Q': Open queue
- 'P': Open playlists
- 'L': Toggle lyrics (future feature)
- '/': Focus search
- 'Esc': Close all modals
- 'Tab': Navigate between UI sections
- 'Enter': Confirm selections
```

## 🌟 SPECIFIC FEATURE IMPLEMENTATIONS

### 1. MALEVOLENT SHRINE MODE (Sukuna Domain)

When Sukuna's domain activates:
```typescript
// Visual elements to implement:
- Load shrine 3D model (shrine.glb)
- Replace background with Buddhist temple environment
- Add floating debris particles
- Implement "guaranteed hit" visual (red tracking lines)
- Cleave slashes appear randomly across screen
- Dismantle explosions on beat drops
- Add skeletal architecture overlay
- Red energy fog fills the space
- Add falling sakura petals (but red/dark)
```

### 2. UNLIMITED VOID MODE (Gojo Domain)

```typescript
// Visual elements:
- Pure white/blue gradient background
- Infinite recursive pattern effect
- Particle system: millions of tiny information particles
- Camera dolly effect (slow zoom)
- Everything moves in slow motion (0.5x speed)
- Add "information overload" glitch text
- Floating mathematical symbols
- Blue energy ribbons flowing
```

### 3. BLACK FLASH EFFECT (Yuji/Gojo)

```typescript
// Trigger on beat peaks:
1. Screen flashes pure black (1 frame)
2. White lightning cracks appear
3. Everything freezes for 3 frames
4. Impact text appears: "黒閃" (Black Flash)
5. Screen shake (intense)
6. Chromatic aberration spike
7. Particle explosion from impact point
8. Slow-mo resume (0.3x for 200ms, then back to 1x)
```

### 4. BOOGIE WOOGIE EFFECT (Todo)

```typescript
// On character switch to/from Todo:
- Clap sound effect
- Screen splits in half vertically
- Both halves swap positions
- Brief white flash
- Everything shuffles positions (UI elements swap places momentarily)
```

### 5. TECHNIQUE ACTIVATION SYSTEM

```typescript
// New store action:
const activateTechnique = () => {
  // Each character has unique technique animation
  // Trigger based on audio intensity peaks
  // Cooldown system (can't spam)
  // Visual feedback on UI
};

// Techniques:
- Sukuna: Cleave (slash across screen)
- Gojo: Blue (implosion effect)
- Yuji: Divergent Fist (punch impact)
- Yuta: Copy (mirror effect)
- Toji: Soul Split Katana (blade slash)
- Todo: Boogie Woogie (position swap)
- Hakari: Jackpot (casino visual)
- Choso: Blood Manipulation (red liquid)
```

## 📱 MOBILE-SPECIFIC ENHANCEMENTS

```typescript
// Mobile UI improvements:
1. Bottom sheet for player controls (swipe up to expand)
2. Full-screen gesture controls (iOS-style)
3. Simplified 3D scene (fewer particles, no shadows)
4. Thumb-friendly button placement
5. Haptic feedback on all interactions
6. Pull-to-refresh for playlists
7. Swipeable cards for queue management
8. Double-tap to like gesture
9. Long-press context menus
10. Safe area insets for notch/home indicator
```

## 🎨 COLOR SYSTEM ENHANCEMENT

### Dynamic Color Generation

```typescript
// Implement color generation based on album art:
import { extractColors } from 'extract-colors';

// Extract dominant colors from album artwork
// Apply to UI elements dynamically
// Create gradients from extracted colors
// Ensure WCAG contrast compliance

// Add color modes:
- Vibrant: Saturated colors
- Muted: Desaturated palette
- Monochrome: Character color only
- Album: Colors from album art
```

## 🔊 AUDIO ENHANCEMENTS

### Advanced Audio Analysis

```typescript
// Implement additional analysis:
1. Frequency spectrum visualization (bass, mid, treble bars)
2. Waveform visualization
3. Loudness normalization
4. Genre detection (affect visual style)
5. Tempo changes detection
6. Key detection (for music theory nerds)
7. Danceability meter
8. Mood detection (happy, sad, energetic, calm)

// Use these to:
- Change visual effects based on genre
- Adjust animation speed with tempo
- Modify color palette based on mood
- Trigger special effects on key changes
```

## 🎯 ACCESSIBILITY IMPROVEMENTS

```typescript
// Enhanced a11y features:
1. Screen reader announcements for all state changes
2. Focus visible indicators with character colors
3. Reduced motion mode (disable all non-essential animations)
4. High contrast mode option
5. Dyslexia-friendly font option
6. Keyboard navigation visual guide (show available shortcuts)
7. Voice control support (future)
8. Customizable text sizes
9. Color blind modes (deuteranopia, protanopia, tritanopia)
10. Audio descriptions for visual effects
```

## 🚀 PERFORMANCE TARGETS

```typescript
// Goals to achieve:
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- 60 FPS on desktop
- 30 FPS minimum on mobile
- Lighthouse score: 90+
- Core Web Vitals: All green
```

## 🎬 ONBOARDING EXPERIENCE

### First-Time User Flow

```typescript
// Implement tutorial overlay:
1. Welcome screen with JJK opening animation
2. Character selection tutorial (hover hints)
3. Music player walkthrough
4. Domain expansion demo
5. Keyboard shortcuts guide
6. Feature highlights carousel
7. Skip option for returning users
8. Progress indicators
```

## 💎 PREMIUM FEATURES (Future)

```typescript
// Ideas for premium tier:
1. Custom domain expansion backgrounds (upload images)
2. Additional character skins
3. Custom cursed techniques
4. Visualizer customization (particle count, effects intensity)
5. Export visualizations as videos
6. Lyrics overlay
7. Social features (share playlists)
8. Statistics dashboard (listening history)
9. Advanced audio controls (EQ)
10. Offline mode
```

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1: Core Visual Upgrades (Week 1)
- [ ] Redesign all UI components with JJK aesthetic
- [ ] Implement cursed energy cursor trail
- [ ] Add kanji rain background
- [ ] Upgrade glassmorphism effects
- [ ] Implement character technique wheel
- [ ] Add brush stroke text animations

### Phase 2: Animation System (Week 2)
- [ ] Integrate Framer Motion
- [ ] Implement micro-interactions on all buttons
- [ ] Add page transition animations
- [ ] Create domain expansion animation system
- [ ] Implement black flash effect
- [ ] Add technique activation animations

### Phase 3: 3D Enhancements (Week 3)
- [ ] Create new shader materials
- [ ] Implement volumetric lighting
- [ ] Add domain-specific 3D environments
- [ ] Create reality crack effect
- [ ] Optimize mobile 3D performance
- [ ] Add camera animations

### Phase 4: Audio-Reactive Features (Week 4)
- [ ] Enhance beat detection algorithm
- [ ] Implement frequency spectrum analysis
- [ ] Create mood-based visual changes
- [ ] Add waveform visualization
- [ ] Implement tempo-synced animations
- [ ] Add audio-reactive particles

### Phase 5: Polish & Optimization (Week 5)
- [ ] Performance optimization pass
- [ ] Accessibility audit and fixes
- [ ] Mobile gesture controls
- [ ] Keyboard shortcuts enhancement
- [ ] Loading state improvements
- [ ] Error handling polish

## 🎨 DESIGN REFERENCES

Study these for inspiration:
1. **Jujutsu Kaisen Opening Sequences** - Color usage, typography, transitions
2. **Neon Genesis Evangelion UI** - HUD elements, technical displays
3. **Persona 5 UI** - Bold colors, dynamic transitions, style
4. **Cyberpunk 2077 Menus** - Futuristic, glitchy, immersive
5. **Spotify Desktop App** - Clean music player design
6. **Apple Music Spatial Audio** - Modern, fluid animations
7. **Valorant UI** - Sharp, responsive, game-feel

## 🔧 CODE QUALITY STANDARDS

```typescript
// Enforce these patterns:
1. All components must be typed (no 'any')
2. Use const assertions for constant objects
3. Implement error boundaries for all major sections
4. Add loading states for all async operations
5. Use React.memo for pure components
6. Implement proper cleanup in useEffect
7. Use custom hooks for repeated logic
8. Keep components under 200 lines
9. Use composition over inheritance
10. Add JSDoc comments for complex functions
```

## 🎯 SUCCESS METRICS

After implementation, measure:
- User engagement time (target: 20+ min average session)
- Character switch frequency (indicates engagement with theme)
- Domain expansion activation rate
- Mobile vs desktop usage patterns
- Feature discovery rate (how many features users find)
- Performance metrics (FPS, load time)
- Accessibility score improvements
- User feedback sentiment

---

## 🚨 CRITICAL REMINDERS

1. **NEVER sacrifice performance for aesthetics** - Animations should be 60 FPS or disabled
2. **Mobile-first** - Design for mobile, enhance for desktop
3. **Accessibility is non-negotiable** - Every feature must be accessible
4. **Respect the source material** - Stay true to JJK aesthetic
5. **Test on real devices** - Don't just use Chrome DevTools
6. **Progressive enhancement** - Core features work without JavaScript
7. **Graceful degradation** - Fallbacks for unsupported features
8. **Keep it fun** - This is about enjoying music through anime aesthetic

---

## 📝 FINAL NOTES

This is a comprehensive refinement plan. Prioritize based on:
1. **User impact** - Features users will notice immediately
2. **Technical feasibility** - Don't get stuck on one hard problem
3. **Performance** - Nothing that tanks the frame rate
4. **Development time** - Quick wins first, then complex features

**Make it feel alive, make it feel immersive, make it feel like Domain Expansion.**

呪力を込めて！(Put your cursed energy into it!)