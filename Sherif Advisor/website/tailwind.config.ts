import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0A1E3C',
          'navy-dark': '#05090F',
          'navy-deep': '#071429',
          'navy-mid': '#0E2749',
          gold: '#C9A961',
          'gold-light': '#E3CB92',
          'gold-dark': '#A88B3D',
        },
        surface: {
          light: '#F4F5F7',
          white: '#FFFFFF',
          muted: '#E2E5EA',
        },
        text: {
          primary: '#E8EEF7',
          secondary: '#A9B6CC',
          muted: '#8C9BB5',
          dark: '#0E1729',
          'dark-secondary': '#5A6478',
        },
      },
      fontFamily: {
        amiri: ['Amiri', 'serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
        mono: ['IBM Plex Mono', 'monospace'],
        sans: ['IBM Plex Sans Arabic', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
