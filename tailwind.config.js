/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        dark: {
          50: '#f0f0f5',
          100: '#d4d4e0',
          200: '#a8a8c0',
          300: '#7c7ca0',
          400: '#505080',
          500: '#2a2a50',
          600: '#1e1e3a',
          700: '#161630',
          800: '#0f0f24',
          900: '#0a0a18',
          950: '#06060f',
        },
        accent: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
    },
  },
  plugins: [],
}
