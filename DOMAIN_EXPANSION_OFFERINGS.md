# Sukuna Domain Expansion – Offerings & Implementation Guide

This document is your checklist and spec for turning **Sukuna - Cursed Energy Visualizer** into a **Domain Expansion simulator**.

Use it as a setup guide (what assets you must gather) and an implementation map (what code needs to be added and where).

---

## 0. High-Level Goal

Upgrade the app from a simple color-reactive visualizer into a **"Malevolent Shrine" domain expansion** experience with:

- **Cursed Speech Audio System** – character voice lines + cursed SFX driven by events and audio analysis.
- **Malevolent Shrine Visual Mode** – Sukuna shrine 3D model + slashing / cleave effects.
- **Manga Aesthetic Post-Processing** – halftone, grain, chromatic aberration, impact frame flashes.

Stack stays the same: **Next.js 15, React Three Fiber, Zustand, Tailwind, Spotify Web API**.

---

## 1. Assets You Must Provide ("The Offerings")

> Place everything inside `public/` so they can be referenced via `/audio/...`, `/models/...`, etc.

### 1.1 Voice Lines – `public/audio/voices/`

You must collect or record these yourself. Use **.mp3** or **.wav**.

- `sukuna_domain.mp3`
  - Sukuna domain callout, e.g. *"Ryouiki Tenkai: Fukuma Mizushi"* (or your own line).
  - Used when Sukuna triggers domain expansion.
- `gojo_domain.mp3` (optional for later)
  - Gojo domain callout, e.g. *"Ryouiki Tenkai: Muryokusho"*.
- `annoyed_1.mp3`, `annoyed_2.mp3`, `annoyed_3.mp3` (names flexible, just be consistent)
  - Short annoyed / mocking lines for track-skip events.
  - Example vibe: *"Don't waste my time."*, irritated sigh, etc.

**Folder:**

```text
/public/
  audio/
    voices/
      sukuna_domain.mp3
      gojo_domain.mp3           # optional
      annoyed_1.mp3
      annoyed_2.mp3
      annoyed_3.mp3
```

### 1.2 Sound Effects – `public/audio/sfx/`

Short SFX for cursed techniques and impact moments.

- `black_flash.mp3`
  - Heavy distorted impact / bassy crack.
  - Triggers when audio energy spikes above threshold (Black Flash moment).
- `slash.mp3`
  - Sharp cutting sound for cleave / screen-slice effects.
- (Optional) `whoosh.mp3`, `rumble.mp3`, etc. for barrier / domain ramp.

**Folder:**

```text
/public/
  audio/
    sfx/
      black_flash.mp3
      slash.mp3
      # optional extras
      whoosh.mp3
      rumble.mp3
```

### 1.3 3D Models – `public/models/`

- `shrine.glb`
  - Low-poly (or stylized) model that feels like **Malevolent Shrine**.
  - Requirements:
    - Single main structure with clear silhouette.
    - UV-mapped (so shaders & textures work cleanly).
    - Reasonable polycount (target: < 50k tris).
- (Optional / future) `gojo_void.glb`, other character domains.

**Folder:**

```text
/public/
  models/
    shrine.glb
    # optional future domains
    gojo_void.glb
```

### 1.4 Textures – `public/textures/`

Needed for halftone / manga shaders and impact frames.

- `manga_dot.png`
  - Black-on-transparent halftone dot pattern.
  - Square, tileable (e.g. 512×512 or 1024×1024).
- `impact_frame.png`
  - Messy black/white ink splatter frame.
  - Used as overlay during big hits / domain activation.
- (Optional)
  - `grain.png` – fine film grain texture.
  - `scratch.png` – streaky texture for slashes.

**Folder:**

```text
/public/
  textures/
    manga_dot.png
    impact_frame.png
    grain.png        # optional
    scratch.png      # optional
```

### 1.5 Design References (Not in Repo)

Just for you to browse while designing:

- Screenshots / clips from **Jujutsu Kaisen** episodes showing:
  - Sukuna’s domain (Malevolent Shrine).
  - Black Flash shots.
  - Manga panels with halftone + high-contrast shading.

These are not stored in the repo, just moodboard material.

---

## 2. New / Updated Global State (Zustand)

You will either **extend** `store/useSpotifyStore.ts` or create a new `store/useCursedStore.ts` and have visual + audio hooks subscribe to it.

### 2.1 Core Domain State

New domain-related fields (one shared store is fine):

- `domainState: 'idle' | 'expanding' | 'active' | 'collapsing'`
- `intensity: number` – 0–1, mapped from audio energy.
- `currentTechnique: 'cleave' | 'blue' | 'boogie_woogie' | null`
- `isDomainActiveForCharacter: 'sukuna' | 'gojo' | 'todo' | 'none'` (or reuse existing selected character id).
- `lastEnergyPeakAt: number` – timestamp of last big energy spike.
- `lastHighFreqPeakAt: number` – timestamp of last high-frequency spike (for cleave/slash lines).

### 2.2 Actions You Need

In the store, add actions such as:

- `setDomainState(state)`
- `setIntensity(value)`
- `setCurrentTechnique(technique)`
- `notifyTrackSkipped()` – increments a counter or sets a flag.
- `registerEnergySample({ energy, highFreq })` – called every frame or audio tick.

These actions will be used by:

- The **Spotify / audio analysis layer** (already present) to push energy values.
- The **Cursed Speech hook** to play SFX on specific transitions.
- The **R3F components** (`MalevolentShrine`, `MangaPostProcess`) to read & react to intensity.

---

## 3. Cursed Speech Audio System – `useCursedSpeech.tsx`

This is a **client hook** that lives in something like `hooks/useCursedSpeech.tsx` or `components/Audio/useCursedSpeech.tsx`.

### 3.1 Responsibilities

- Listen to:
  - `domainState` changes.
  - `intensity` / `energy` peaks.
  - Track skip events (from store or Spotify callbacks).
- Play overlapping audio clips via `HTMLAudioElement`.
- Avoid blocking the main Spotify playback.

### 3.2 Events & Sounds

1. **Domain Expansion Start**
   - Condition: Current character is **Sukuna** AND `domainState` transitions `idle → expanding`.
   - Action: Play `/audio/voices/sukuna_domain.mp3` once.
2. **Black Flash Trigger**
   - Condition: `intensity` or `energy` > **0.8** with a sharp delta from previous frame.
   - Action: Play `/audio/sfx/black_flash.mp3`.
   - Also set a short-lived `isImpactFrameActive` flag in store (used by `MangaPostProcess`).
3. **Track Skip (Annoyed Lines)**
   - Condition: Spotify `skip` event or explicit `notifyTrackSkipped()` call.
   - Action: randomly choose from `annoyed_1.mp3`, `annoyed_2.mp3`, `annoyed_3.mp3` and play.

### 3.3 Integration Points

- **Where to call the hook:**
  - In a high-level client component that always exists while Spotify is playing, e.g. `components/SpotifyWebPlayer.tsx` or the main `SceneWrapper.tsx`.
- **Inputs:**
  - Subscribe to Zustand store (`useSpotifyStore` / `useCursedStore`).
  - Optionally read `selectedCharacter` from `lib/types/character.ts` mapping.

You don’t need assets here beyond the audio files already listed.

---

## 4. Malevolent Shrine Visual Mode – `MalevolentShrine.tsx`

A new React Three Fiber component, likely placed at `components/Visualizer/MalevolentShrine.tsx`.

### 4.1 Model Loading

- Use `useGLTF('/models/shrine.glb')`.
- Scale and position so that it fills the domain environment.
- Use `preload` from `@react-three/drei` for smoother entry.

### 4.2 Shader Requirements

Custom shader material (via `shaderMaterial` from `@react-three/drei` or raw `ShaderMaterial`):

- **Inputs / uniforms:**
  - `uTime` – elapsed time.
  - `uEnergy` – current `intensity` from store.
  - `uPrimaryColor` – cursed red.
  - `uSecondaryColor` – near-black / deep purple.
- **Behavior:**
  - Pulse emission / brightness with a low-frequency sine based on `uTime` and scaled by `uEnergy`.
  - Add simple world-space or UV-space noise to create flickering cursed energy veins.

### 4.3 Cleave (Screen-Slash) Effect

This is **screen-space**, not just on the shrine mesh.

- Implement as a full-screen quad in front of the camera or as part of post-processing.
- It should:
  - Draw thin, sharp diagonal lines when `lastHighFreqPeakAt` is very recent.
  - Slightly offset UVs along those lines to imitate the screen being sliced.
  - Optionally add a quick opacity fade-out (100–200 ms).

**Inputs Needed:**

- `highFreqIntensity` or a boolean like `isCleaveActive` from the store.
- `slash.mp3` SFX already listed (played by `useCursedSpeech` if you want audio sync).

**Where to reference `MalevolentShrine`:**

- In `components/Visualizer/Scene.tsx` – render conditionally when `domainState !== 'idle'` and character is Sukuna.

---

## 5. Manga Post-Processing – `MangaPostProcess.tsx`

A new component that wraps **post-processing passes** from `@react-three/postprocessing`.

Place it next to (or inside) your existing `Effects.tsx` in `components/Visualizer/`.

### 5.1 Dependencies

Make sure you install:

```bash
npm install @react-three/postprocessing postprocessing
```

(If already present, just reuse.)

### 5.2 Visual Goals

1. **Halftone Manga Look**
   - Convert shading into a 2-tone manga style (bright → white, dark → black dots).
   - Use `DotScreen`, `Noise`, or a custom shader pass with `manga_dot.png` as a repeating texture.
2. **Chromatic Aberration**
   - Subtle by default.
   - **Aggressive** when `intensity` / `energy` is high.
3. **Impact Frames**
   - On Black Flash / big spikes, invert colors for ~2 frames and optionally overlay `impact_frame.png`.

### 5.3 Required Store Inputs

From Zustand:

- `intensity` or `energy` – scales aberration strength and grain amount.
- `isImpactFrameActive` – true for a few frames after `black_flash` triggers.

### 5.4 Integration in `Scene.tsx`

- You likely already have an `Effects.tsx` or similar used inside `<Canvas>` in `Scene.tsx`.
- `MangaPostProcess` should be used inside the existing `<EffectComposer>` or replace it, for example:

```tsx
// Scene.tsx (conceptual)
<Canvas>
  {/* lights, camera, models, CursedCore, MalevolentShrine, etc. */}

  <Effects>
    <MangaPostProcess />
  </Effects>
</Canvas>
```

Exact integration depends on how `Effects.tsx` is structured, but the idea is: **`MangaPostProcess` is the post-processing layer for the whole scene.**

---

## 6. Domain Expansion Flow (UX / Logic)

This is the sequence when a user clicks **"Expand Domain"** (or when a track change triggers one automatically).

### 6.1 Steps

1. **Volume Dampen**
   - Reduce Spotify volume to ~50% (via existing Spotify control functions).
2. **Cursed Speech**
   - `useCursedSpeech` detects `domainState: 'expanding'` for the active character.
   - Plays the appropriate domain voice line (e.g. `sukuna_domain.mp3`).
3. **Barrier Sphere Animation**
   - In `Scene.tsx` (or a dedicated `DomainBarrier.tsx` component), scale a large sphere from tiny at camera origin outwards using `useFrame`.
   - Sphere can use a noisy shader (ink-like edges, red/black gradients).
4. **Switch Environment**
   - Once barrier reaches target size, set `domainState: 'active'`.
   - Render `MalevolentShrine` environment instead of the default visualizer background.
5. **Restore Volume & Enable Cleave**
   - Ease volume back up to normal.
   - Allow `Cleave` slashing visuals to respond to high-frequency audio spikes.

### 6.2 UI Integration Points

- `components/UI/DomainExpansion.tsx`
  - Button click dispatches `setDomainState('expanding')`.
- `components/Visualizer/Scene.tsx`
  - Reads `domainState` to:
    - Show/hide barrier sphere.
    - Swap in `MalevolentShrine`.
    - Enable / disable certain post-processing or shaders.

---

## 7. Files You Will Eventually Create / Touch

You don’t have to edit all of these at once, but this is the map.

- **New:** `store/useCursedStore.ts` (or extend `useSpotifyStore.ts`).
- **New:** `hooks/useCursedSpeech.tsx` – cursed speech audio logic.
- **New:** `components/Visualizer/MalevolentShrine.tsx` – shrine model + cleave effect.
- **New:** `components/Visualizer/MangaPostProcess.tsx` – halftone, aberration, impact frames.
- **Existing:** `components/Visualizer/Scene.tsx` – integrate shrine, barrier, post-processing.
- **Existing:** `components/UI/DomainExpansion.tsx` – trigger domain expansion state.
- **Existing:** `components/SpotifyWebPlayer.tsx` or `SceneWrapper.tsx` – good place to mount `useCursedSpeech`.

---

## 8. What You Need to Hunt Down (Summary Checklist)

Use this quick list when asset-hunting:

- **Voices (`public/audio/voices/`):**
  - [ ] `sukuna_domain.mp3`
  - [ ] (optional) `gojo_domain.mp3`
  - [ ] `annoyed_1.mp3`
  - [ ] `annoyed_2.mp3`
  - [ ] `annoyed_3.mp3`
- **SFX (`public/audio/sfx/`):**
  - [ ] `black_flash.mp3`
  - [ ] `slash.mp3`
  - [ ] (optional) `whoosh.mp3`
  - [ ] (optional) `rumble.mp3`
- **Models (`public/models/`):**
  - [ ] `shrine.glb`
  - [ ] (optional) `gojo_void.glb`
- **Textures (`public/textures/`):**
  - [ ] `manga_dot.png`
  - [ ] `impact_frame.png`
  - [ ] (optional) `grain.png`
  - [ ] (optional) `scratch.png`

Once all boxes are checked, you are ready to implement:

1. The **Zustand cursed state**.
2. The **`useCursedSpeech` hook**.
3. The **`MalevolentShrine`** and **`MangaPostProcess`** R3F components.

That’s everything you need to put and find to summon this domain properly.