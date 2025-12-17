# Sukuna - Cursed Energy Visualizer

A high-performance, professional 3D audio-reactive web application built with Next.js 15, React Three Fiber, and Spotify integration.

## Features

- **Spotify Authentication** via NextAuth v5
- **Real-time Audio Streaming** using Spotify Web Playback SDK
- **Audio Analysis** via Spotify Web API (Audio Features & Analysis)
- **3D Reactive Visualizations** with React Three Fiber
- **Post-processing Effects** (Bloom, Chromatic Aberration, Noise)
- **Performance Optimized** with Zustand state management

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   
   Create a `.env.local` file with:
   ```env
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   NEXTAUTH_SECRET=generate_a_long_random_string
   NEXTAUTH_URL=http://localhost:3000
   ```

   To get Spotify credentials:
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new app
   - Add `http://localhost:3000/api/auth/callback/spotify` to Redirect URIs

   To generate `NEXTAUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## Architecture

- **Next.js 15 App Router** for routing and server actions
- **NextAuth v5** for Spotify OAuth
- **Zustand** for client-side state management
- **React Three Fiber** for 3D rendering
- **Spotify Web Playback SDK** for audio streaming
- **Spotify Web API** for audio analysis data

## Project Structure

```
/
├── app/                    # Next.js App Router
│   ├── api/auth/          # NextAuth API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/
│   ├── Visualizer/        # 3D visualization components
│   ├── UI/                # UI overlay components
│   ├── AuthInitializer.tsx
│   └── SpotifyWebPlayer.tsx
├── lib/
│   ├── spotify-actions.ts # Server actions for Spotify API
│   └── types/             # TypeScript type definitions
├── store/
│   └── useSpotifyStore.ts # Zustand state store
└── auth.ts                # NextAuth configuration
```

