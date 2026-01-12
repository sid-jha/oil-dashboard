/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'oil-amber': '#D97706',
        'oil-blue': '#2563EB',
        'oil-green': '#059669',
        'oil-red': '#DC2626',
        'oil-purple': '#7C3AED',
      }
    },
  },
  plugins: [],
}
