/**
 * Color extraction utility for album artwork
 * Extracts dominant colors from album art images
 */

export interface ExtractedColors {
  dominant: string
  secondary: string
  accent: string
  palette: string[]
}

/**
 * Extract colors from an image URL
 * Uses Canvas API to analyze pixel data
 */
export async function extractColorsFromImage(imageUrl: string): Promise<ExtractedColors> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        
        if (!ctx) {
          reject(new Error("Could not get canvas context"))
          return
        }
        
        // Resize for performance (analyze smaller version)
        const maxSize = 200
        const scale = Math.min(maxSize / img.width, maxSize / img.height)
        canvas.width = img.width * scale
        canvas.height = img.height * scale
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const pixels = imageData.data
        
        // Extract color palette
        const colorMap = new Map<string, number>()
        
        // Sample pixels (every 4th pixel for performance)
        for (let i = 0; i < pixels.length; i += 16) {
          const r = pixels[i]
          const g = pixels[i + 1]
          const b = pixels[i + 2]
          const a = pixels[i + 3]
          
          // Skip transparent pixels
          if (a < 128) continue
          
          // Quantize colors to reduce palette size
          const quantizedR = Math.floor(r / 32) * 32
          const quantizedG = Math.floor(g / 32) * 32
          const quantizedB = Math.floor(b / 32) * 32
          
          const colorKey = `${quantizedR},${quantizedG},${quantizedB}`
          colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1)
        }
        
        // Sort by frequency
        const sortedColors = Array.from(colorMap.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10) // Top 10 colors
        
        // Convert to hex
        const palette = sortedColors.map(([colorKey]) => {
          const [r, g, b] = colorKey.split(",").map(Number)
          return rgbToHex(r, g, b)
        })
        
        // Calculate dominant, secondary, accent
        const dominant = palette[0] || "#000000"
        const secondary = palette[1] || palette[0] || "#000000"
        const accent = palette[2] || palette[1] || palette[0] || "#000000"
        
        resolve({
          dominant,
          secondary,
          accent,
          palette,
        })
      } catch (error) {
        reject(error)
      }
    }
    
    img.onerror = () => {
      reject(new Error("Failed to load image"))
    }
    
    img.src = imageUrl
  })
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => {
    const hex = x.toString(16)
    return hex.length === 1 ? "0" + hex : hex
  }).join("")
}

/**
 * Get vibrant colors from palette (high saturation)
 */
export function getVibrantColors(palette: string[]): string[] {
  return palette.filter((color) => {
    const rgb = hexToRgb(color)
    if (!rgb) return false
    
    const [r, g, b] = [rgb.r / 255, rgb.g / 255, rgb.b / 255]
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const saturation = max === 0 ? 0 : (max - min) / max
    
    return saturation > 0.3 // Only vibrant colors
  })
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

