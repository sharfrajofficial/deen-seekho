/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          900: '#075E54',
          800: '#0F766E',
          50: '#E8F5F1'
        },
        gold: {
          500: '#C89B3C'
        }
      }
    },
  },
  plugins: [],
}
