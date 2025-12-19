/**
 * Accessibility Utilities
 * Helper functions for accessibility features
 */

/**
 * Generate unique ID for ARIA attributes
 */
let idCounter = 0
export function generateId(prefix: string = "id"): string {
  return `${prefix}-${++idCounter}`
}

/**
 * Get ARIA label for character
 */
export function getCharacterAriaLabel(characterName: string, japaneseName: string): string {
  return `${characterName} (${japaneseName})`
}

/**
 * Get ARIA label for technique
 */
export function getTechniqueAriaLabel(technique: string, japaneseTechnique: string): string {
  return `${technique} (${japaneseTechnique})`
}
