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
          paper: '#fafaf9',
          ink: '#1c1917',
          panel: '#ffffff',
          tone: '#e7e5e4',
        },
        'jujutsu-energy': '#1c1917',
        'jujutsu-domain': '#57534e',
      },
      fontFamily: {
        mono: ['ui-monospace', 'SF Mono', 'Monaco', 'Consolas', 'monospace'],
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        jp: ['"Noto Sans JP"', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        'fluid': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'smooth': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '500': '500ms',
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
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'spring-in': 'springIn 0.5s cubic-bezier(0.34, 1.2, 0.64, 1) forwards',
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
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        springIn: {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(8px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
export default config
