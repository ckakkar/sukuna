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
        cursed: {
          red: '#8a0000',
          neon: '#ff3c00',
          purple: '#8b5cf6',
          violet: '#a78bfa',
          dark: '#0a0a0f',
        },
        jujutsu: {
          energy: '#9333ea',
          domain: '#7c3aed',
        },
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse-cursed': 'pulse-cursed 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'pulse-cursed': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'glow': {
          '0%': { textShadow: '0 0 5px #9333ea, 0 0 10px #9333ea' },
          '100%': { textShadow: '0 0 10px #9333ea, 0 0 20px #9333ea, 0 0 30px #9333ea' },
        },
      },
    },
  },
  plugins: [],
}
export default config

