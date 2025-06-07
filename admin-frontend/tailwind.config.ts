// admin-frontend/tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./index.html",
    // This line is VERY important for Tailwind to scan your components
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Ensure 'Inter' is available if you plan to use it (e.g., from Google Fonts)
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;