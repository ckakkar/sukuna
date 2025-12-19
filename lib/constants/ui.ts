/**
 * UI Constants
 * Shared constants for consistent styling across the application
 */

export const UI_CONSTANTS = {
  // Animation durations
  ANIMATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
    VERY_SLOW: 1000,
  },
  
  // Z-index layers
  Z_INDEX: {
    BACKGROUND: 0,
    SCENE: 1,
    OVERLAY: 10,
    MODAL: 50,
    TOOLTIP: 100,
  },
  
  // Spacing scale
  SPACING: {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
    XXL: 48,
  },
  
  // Border radius
  RADIUS: {
    SM: 8,
    MD: 12,
    LG: 16,
    XL: 24,
    FULL: 9999,
  },
  
  // Blur effects
  BLUR: {
    SM: 8,
    MD: 16,
    XL: 32,
    XXL: 64,
  },
  
  // Opacity levels
  OPACITY: {
    DISABLED: 0.3,
    HOVER: 0.8,
    ACTIVE: 0.6,
    GHOST: 0.5,
  },
  
  // Breakpoints (matching Tailwind)
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
  },
} as const

export const EASING = {
  EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
  EASE_OUT: 'cubic-bezier(0, 0, 0.2, 1)',
  EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
  SPRING: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  SMOOTH: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
} as const
