import { NextRequest, NextResponse } from "next/server"
import { getLyrics } from "@/lib/lyrics"

/**
 * Analyzes song lyrics with an LLM and returns:
 * - A single hex color matching the emotional atmosphere
 * - A 3-word "Domain Expansion" name for the song
 *
 * Accepts either { lyrics, trackName?, artistName? } or { trackName, artistName, albumName?, durationMs }
 * to fetch lyrics server-side. Set OPENAI_API_KEY or DEEPSEEK_API_KEY in env.
 */

const SYSTEM_PROMPT = `You are a mood-to-color expert for a music visualizer. Given song lyrics, you must respond with exactly two things:
1. A single HEX color code (e.g. #1a2b3c) that matches the emotional atmosphere of the lyrics. Examples: Sad = dark blue/grey, Rage = deep red, Happy = warm yellow/gold, Calm = soft teal, Energetic = bright orange/red, Melancholic = muted purple.
2. A 3-word "Domain Expansion" name for this song—evocative, like a technique name (e.g. "Eternal Midnight Rain", "Crimson Fury Unleashed"). Exactly 3 words.

Respond ONLY with valid JSON in this exact shape, no other text:
{"hexColor":"#xxxxxx","domainExpansionName":"Word One Two"}`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      lyrics: providedLyrics,
      trackName,
      artistName,
      albumName,
      durationMs,
    } = body as {
      lyrics?: string
      trackName?: string
      artistName?: string
      albumName?: string
      durationMs?: number
    }

    let lyrics: string
    let resolvedTrackName = trackName
    let resolvedArtistName = artistName

    if (providedLyrics && typeof providedLyrics === "string" && providedLyrics.trim()) {
      lyrics = providedLyrics.trim()
    } else if (
      trackName &&
      typeof trackName === "string" &&
      artistName &&
      typeof artistName === "string"
    ) {
      const result = await getLyrics(
        artistName,
        trackName,
        typeof albumName === "string" ? albumName : undefined,
        typeof durationMs === "number" ? durationMs : undefined
      )
      if (!result?.plainLyrics) {
        return NextResponse.json(
          { error: "Lyrics not found for this track" },
          { status: 404 }
        )
      }
      lyrics = result.plainLyrics
      resolvedTrackName = result.trackName
      resolvedArtistName = result.artistName
    } else {
      return NextResponse.json(
        { error: "Provide lyrics or trackName + artistName" },
        { status: 400 }
      )
    }

    const openaiKey = process.env.OPENAI_API_KEY
    const deepseekKey = process.env.DEEPSEEK_API_KEY
    const apiKey = openaiKey || deepseekKey

    if (!apiKey) {
      return NextResponse.json(
        { error: "Set OPENAI_API_KEY or DEEPSEEK_API_KEY in environment" },
        { status: 503 }
      )
    }

    const baseUrl = deepseekKey && !openaiKey
      ? "https://api.deepseek.com/v1"
      : "https://api.openai.com/v1"

    const userContent =
      resolvedTrackName || resolvedArtistName
        ? `Track: ${resolvedTrackName ?? "Unknown"}, Artist: ${resolvedArtistName ?? "Unknown"}\n\nLyrics:\n${lyrics.slice(0, 8000)}`
        : `Lyrics:\n${lyrics.slice(0, 8000)}`

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: deepseekKey && !openaiKey ? "deepseek-chat" : "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error("LLM API error:", response.status, errText)
      return NextResponse.json(
        { error: "Lyrics analysis failed" },
        { status: 502 }
      )
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content?.trim()
    if (!content) {
      return NextResponse.json(
        { error: "Empty response from LLM" },
        { status: 502 }
      )
    }

    // Parse JSON from response (allow trailing text)
    const jsonMatch = content.match(/\{[\s\S]*"hexColor"[\s\S]*"domainExpansionName"[\s\S]*\}/)
    const raw = jsonMatch ? jsonMatch[0] : content
    let parsed: { hexColor?: string; domainExpansionName?: string }
    try {
      parsed = JSON.parse(raw)
    } catch {
      return NextResponse.json(
        { error: "Invalid LLM response format" },
        { status: 502 }
      )
    }

    const hexColor = normalizeHex(parsed.hexColor)
    const domainExpansionName = sanitizeDomainName(parsed.domainExpansionName)

    if (!hexColor) {
      return NextResponse.json(
        { error: "Invalid hex color from LLM" },
        { status: 502 }
      )
    }

    return NextResponse.json({
      hexColor,
      domainExpansionName: domainExpansionName || "Unknown Domain",
    })
  } catch (e) {
    console.error("lyrics-mood error:", e)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}

function normalizeHex(value: unknown): string | null {
  if (typeof value !== "string") return null
  const hex = value.trim().replace(/^#/, "")
  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) return null
  return `#${hex}`
}

function sanitizeDomainName(value: unknown): string {
  if (typeof value !== "string") return "Unknown Domain"
  const words = value.trim().split(/\s+/).filter(Boolean).slice(0, 3)
  return words.length ? words.join(" ") : "Unknown Domain"
}
