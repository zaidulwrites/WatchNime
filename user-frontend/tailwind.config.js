// user-frontend/tailwind.config.js (or .ts if you're using TypeScript)

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      screens: {
        'xs': '400px', // Custom extra-small breakpoint
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], 
      },
    },
  },
  plugins: [],
}
