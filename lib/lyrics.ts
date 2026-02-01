/**
 * Fetch lyrics via LRCLIB (no API key required).
 * Tries /api/get first (exact signature), then /api/search as fallback.
 */

const LRCLIB_BASE = "https://lrclib.net"

export interface LyricsResult {
  plainLyrics: string
  trackName: string
  artistName: string
  albumName?: string
}

export async function getLyrics(
  artistName: string,
  trackName: string,
  albumName?: string,
  durationMs?: number
): Promise<LyricsResult | null> {
  const durationSec = durationMs != null ? Math.round(durationMs / 1000) : undefined
  const params = new URLSearchParams({
    artist_name: artistName,
    track_name: trackName,
    ...(albumName && { album_name: albumName }),
    ...(durationSec != null && { duration: String(durationSec) }),
  })

  // Try exact match first (requires duration ±2s)
  if (durationSec != null && albumName) {
    const getUrl = `${LRCLIB_BASE}/api/get?${params.toString()}`
    try {
      const res = await fetch(getUrl, {
        headers: { "User-Agent": "Sukuna/1.0 (https://github.com/sukuna)" },
      })
      if (res.ok) {
        const data = await res.json()
        if (data.plainLyrics) {
          return {
            plainLyrics: data.plainLyrics,
            trackName: data.trackName ?? trackName,
            artistName: data.artistName ?? artistName,
            albumName: data.albumName,
          }
        }
      }
    } catch {
      // Fall through to search
    }
  }

  // Fallback: search by track + artist (no duration/album)
  const searchParams = new URLSearchParams({
    track_name: trackName,
    artist_name: artistName,
  })
  const searchUrl = `${LRCLIB_BASE}/api/search?${searchParams.toString()}`
  try {
    const res = await fetch(searchUrl, {
      headers: { "User-Agent": "Sukuna/1.0 (https://github.com/sukuna)" },
    })
    if (!res.ok) return null
    const list = await res.json()
    if (!Array.isArray(list) || list.length === 0) return null
    const first = list[0]
    if (!first?.plainLyrics) return null
    return {
      plainLyrics: first.plainLyrics,
      trackName: first.trackName ?? trackName,
      artistName: first.artistName ?? artistName,
      albumName: first.albumName,
    }
  } catch {
    return null
  }
}
