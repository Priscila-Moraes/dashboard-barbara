/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        copper: {
          50: '#fdf4ed',
          100: '#f9e2cc',
          200: '#f2c49a',
          300: '#e9a05f',
          400: '#e08338',
          500: '#b86a2a',  // main copper from logo
          600: '#9a5422',
          700: '#7d421c',
          800: '#5e3216',
          900: '#3f2210',
        },
        surface: {
          50: '#f5f5f4',
          100: '#e7e5e4',
          200: '#d6d3d1',
          700: '#2a2520',
          800: '#1e1a17',
          850: '#171412',
          900: '#110f0d',
          950: '#0a0908',
        }
      }
    },
  },
  plugins: [],
}
