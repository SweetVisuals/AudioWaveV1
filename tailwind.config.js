/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0284C7', // sky-600
          dark: '#0369A1', // sky-700
          light: '#38BDF8', // sky-400
        },
        secondary: {
          DEFAULT: '#3B82F6', // blue-500
          dark: '#2563EB', // blue-600
        },
        dark: {
          DEFAULT: '#000000',
          light: '#111111',
          lighter: '#1A1A1A',
          divider: '#222222',
        },
        light: {
          DEFAULT: '#FFFFFF',
          dark: '#F3F4F6',
          darker: '#E5E7EB',
        }
      },
      backgroundColor: {
        'glass': 'rgba(255, 255, 255, 0.03)',
        'glass-dark': 'rgba(0, 0, 0, 0.3)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(56, 189, 248, 0.15)',
        'subtle': '0 1px 3px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'loading-bar': 'loading-bar 2s infinite',
      },
      keyframes: {
        'loading-bar': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};