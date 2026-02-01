"use client"

import { useState, useEffect } from "react"
import { CharacterType } from "@/lib/types/character"

const CACHE_KEY = "sukuna_character_images"

// Jikan API response type (simplified)
interface JikanResponse {
    data: Array<{
        images: {
            jpg: {
                image_url: string
                large_image_url: string
            }
            webp: {
                image_url: string
                large_image_url: string
            }
        }
    }>
}

// Map internal IDs to Jikan search terms for better results
const SEARCH_TERMS: Record<CharacterType, string> = {
    sukuna: "Ryomen Sukuna",
    yuji: "Yuji Itadori",
    yuta: "Yuta Okkotsu",
    toji: "Toji Fushiguro",
    todo: "Aoi Todo",
    gojo: "Satoru Gojo",
    kinjihakari: "Kinji Hakari",
    choso: "Choso"
}

export function useCharacterImage(characterId: CharacterType) {
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        // Check local storage cache first
        const checkCache = () => {
            try {
                const cache = localStorage.getItem(CACHE_KEY)
                if (cache) {
                    const data = JSON.parse(cache)
                    if (data[characterId]) {
                        setImageUrl(data[characterId])
                        return true
                    }
                }
            } catch (e) {
                // Ignore cache errors
            }
            return false
        }

        if (checkCache()) return

        const fetchImage = async () => {
            setIsLoading(true)
            try {
                const term = SEARCH_TERMS[characterId]
                const res = await fetch(`https://api.jikan.moe/v4/characters?q=${encodeURIComponent(term)}&limit=1`)
                if (!res.ok) throw new Error("API Limit or Error")

                const data: JikanResponse = await res.json()
                const image = data.data[0]?.images.webp.large_image_url || data.data[0]?.images.jpg.large_image_url

                if (image) {
                    setImageUrl(image)
                    // Update cache
                    try {
                        const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}")
                        cache[characterId] = image
                        localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
                    } catch (e) {
                        // Ignore cache write errors
                    }
                }
            } catch (err) {
                console.warn(`Failed to fetch image for ${characterId}`, err)
            } finally {
                setIsLoading(false)
            }
        }

        // Add a small delay to prevent rate limiting waterfall
        const timer = setTimeout(fetchImage, Math.random() * 1000)
        return () => clearTimeout(timer)
    }, [characterId])

    return { imageUrl, isLoading }
}
