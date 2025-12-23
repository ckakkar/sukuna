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
          energy: '#9333ea',
        },
        jujutsu: {
          energy: '#9333ea',
          domain: '#7c3aed',
          shrine: '#a78bfa',
          dark: '#1a0a1f',
        },
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse-cursed': 'pulse-cursed 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in-down': 'fadeInDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'spring-in': 'spring-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'spring-out': 'spring-out 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'cursed-energy-flow': 'cursed-energy-flow 3s ease infinite',
        'domain-barrier': 'domain-barrier 2s ease-in-out infinite',
        'cursed-seal': 'cursed-seal 2s ease-out forwards',
        'particle-float': 'particle-float 4s ease-in-out infinite',
        'barrier-pulse': 'barrier-pulse 2s ease-in-out infinite',
        'technique-callout': 'technique-callout 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'cursed-text-reveal': 'cursed-text-reveal 1s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'energy-wave': 'energy-wave 2s ease-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'shimmer-slow': 'shimmer 3s linear infinite',
        'shimmer-fast': 'shimmer 1.5s linear infinite',
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
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'spring-in': {
          '0%': { opacity: '0', transform: 'scale(0.8) translateY(20px)' },
          '60%': { transform: 'scale(1.05) translateY(-5px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'spring-out': {
          '0%': { opacity: '1', transform: 'scale(1) translateY(0)' },
          '100%': { opacity: '0', transform: 'scale(0.9) translateY(20px)' },
        },
        'cursed-energy-flow': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'domain-barrier': {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.05)' },
        },
        'cursed-seal': {
          '0%': { strokeDashoffset: '1000', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { strokeDashoffset: '0', opacity: '1' },
        },
        'particle-float': {
          '0%, 100%': { transform: 'translateY(0) translateX(0) scale(1)', opacity: '0.3' },
          '33%': { transform: 'translateY(-20px) translateX(10px) scale(1.2)', opacity: '0.8' },
          '66%': { transform: 'translateY(-40px) translateX(-10px) scale(0.8)', opacity: '0.5' },
        },
        'barrier-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px currentColor, 0 0 40px currentColor' },
          '50%': { boxShadow: '0 0 40px currentColor, 0 0 80px currentColor, 0 0 120px currentColor' },
        },
        'technique-callout': {
          '0%': { opacity: '0', transform: 'translateX(-50%) translateY(-20px) scale(0.8)', filter: 'blur(10px)' },
          '50%': { opacity: '1', transform: 'translateX(-50%) translateY(-10px) scale(1.05)', filter: 'blur(0px)' },
          '100%': { opacity: '0.9', transform: 'translateX(-50%) translateY(0) scale(1)', filter: 'blur(0px)' },
        },
        'cursed-text-reveal': {
          '0%': { clipPath: 'inset(0 100% 0 0)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { clipPath: 'inset(0 0% 0 0)', opacity: '1' },
        },
        'energy-wave': {
          '0%': { transform: 'translateX(-100%) scaleY(1)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateX(100%) scaleY(1.5)', opacity: '0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.8', filter: 'brightness(1.3)' },
        },
      },
    },
  },
  plugins: [],
}
export default config

