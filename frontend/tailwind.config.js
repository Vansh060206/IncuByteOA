/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#ebf0ff',
          200: '#d6e0ff',
          300: '#b3c7ff',
          400: '#85a3ff',
          500: '#5c7aff',
          600: '#3d52ff',
          700: '#2b3bff',
          800: '#1f28cc',
          900: '#1b22a3',
        },
        slate: {
          850: '#1e293b',
          950: '#030712'
        }
      }
    },
  },
  plugins: [],
}
