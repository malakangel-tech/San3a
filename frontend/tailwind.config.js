/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#F8F5F0',
          dark: '#1B2421',
          gold: '#C2A379',
          text: '#2A2A2A',
        }
      },
      fontFamily: {
        sans: ['"Playfair Display"', 'Cairo', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
