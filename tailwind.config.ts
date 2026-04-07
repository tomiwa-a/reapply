import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blood: {
          50: '#fcf3f2',
          100: '#f8e4e3',
          200: '#f1cac7',
          300: '#e5a39e',
          400: '#d77068',
          500: '#c04b42', // main accent variation
          600: '#c0392b', // requested blood red
          700: '#9b2d22', // requested dark hover
          800: '#842820',
          900: '#6d2620',
          950: '#3a100d',
        },
        surface: {
          bg: '#ffffff',
          100: '#fbfbfa',
          200: '#f5f5f4',
          300: '#ededeb',
        },
        ink: {
          DEFAULT: '#0a0a0a',
          muted: '#6b6b6b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
} satisfies Config
