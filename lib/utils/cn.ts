/**
 * Class name utility
 * Combines class names with conditional logic
 */

type ClassValue = string | number | boolean | undefined | null | { [key: string]: boolean }

export function cn(...classes: ClassValue[]): string {
  return classes
    .filter(Boolean)
    .map((cls) => {
      if (typeof cls === 'string') return cls
      if (typeof cls === 'object' && cls !== null) {
        return Object.entries(cls)
          .filter(([_, condition]) => condition)
          .map(([className]) => className)
          .join(' ')
      }
      return ''
    })
    .filter(Boolean)
    .join(' ')
}
