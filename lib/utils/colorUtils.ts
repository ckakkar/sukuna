/**
 * Calculate the luminance of a color (0-1)
 * Higher values are brighter
 */
function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0.5

  // Convert RGB to relative luminance
  const [r, g, b] = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map((val) => {
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

/**
 * Get a visible text color for a given character color
 * Returns a lighter color if the primary is too dark
 */
export function getVisibleTextColor(
  primary: string,
  glow: string,
  secondary?: string
): string {
  const luminance = getLuminance(primary)
  // If primary is too dark (luminance < 0.3), use glow or secondary
  if (luminance < 0.3) {
    const glowLuminance = getLuminance(glow)
    if (glowLuminance > 0.4) {
      return glow
    }
    if (secondary) {
      const secondaryLuminance = getLuminance(secondary)
      if (secondaryLuminance > 0.4) {
        return secondary
      }
    }
    // Fallback to a brightened version of primary
    return brightenColor(primary, 0.6)
  }
  return primary
}

/**
 * Get a visible border color with appropriate opacity
 */
export function getVisibleBorderColor(
  primary: string,
  glow: string,
  opacity: number = 0.6
): string {
  const luminance = getLuminance(primary)
  // If primary is too dark, use glow with higher opacity
  if (luminance < 0.3) {
    const opacityHex = Math.round(opacity * 255).toString(16).padStart(2, "0")
    return `${glow}${opacityHex}`
  }
  const opacityHex = Math.round(opacity * 255).toString(16).padStart(2, "0")
  return `${primary}${opacityHex}`
}

/**
 * Brighten a color by a factor (0-1)
 */
function brightenColor(hex: string, factor: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  const r = Math.min(255, rgb.r + (255 - rgb.r) * factor)
  const g = Math.min(255, rgb.g + (255 - rgb.g) * factor)
  const b = Math.min(255, rgb.b + (255 - rgb.b) * factor)

  return `#${Math.round(r).toString(16).padStart(2, "0")}${Math.round(g).toString(16).padStart(2, "0")}${Math.round(b).toString(16).padStart(2, "0")}`
}
