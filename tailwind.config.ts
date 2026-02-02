import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        manga: {
          paper: '#f4f4f0', // Warm white paper texture
          ink: '#0a0a0a',   // Deep black ink
          panel: '#ffffff', // Pure white for active areas
          tone: '#d4d4d4',  // Screentone gray
        },
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        manga: ['"Comic Neue"', 'Impact', 'sans-serif'], // Comic-like font
        jp: ['"Noto Serif JP"', 'serif'],
      },
      backgroundImage: {
        'halftone': 'radial-gradient(circle, #0a0a0a 1px, transparent 1.2px)',
        'speed-lines': 'repeating-linear-gradient(90deg, transparent, transparent 2px, #0a0a0a 2px, #0a0a0a 4px)',
      },
      borderWidth: {
        '3': '3px',
      },
      boxShadow: {
        'panel': '4px 4px 0px 0px #0a0a0a',
        'panel-hover': '6px 6px 0px 0px #0a0a0a',
        'ink-sm': '2px 2px 0px 0px #0a0a0a',
      },
      animation: {
        'ink-spread': 'inkSpread 0.5s ease-out forwards',
        'page-turn': 'pageTurn 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'pulse-ink': 'pulseInk 2s ease-in-out infinite',
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes: {
        inkSpread: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pageTurn: {
          '0%': { transform: 'rotateY(0deg)', transformOrigin: 'left' },
          '100%': { transform: 'rotateY(-15deg)', transformOrigin: 'left' },
        },
        pulseInk: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        }
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
export default config
