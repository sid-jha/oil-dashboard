/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // War Games green phosphor CRT theme
        'terminal-green': '#00FF00',
        'terminal-green-dim': '#00CC00',
        'terminal-green-dark': '#008800',
        'terminal-amber': '#FFAA00',
        'terminal-red': '#FF0000',
        'terminal-blue': '#00FFFF',
        'screen-black': '#000000',
        'screen-dark': '#0A0A0A',
      },
      fontFamily: {
        'mono': ['Courier New', 'Courier', 'monospace'],
      },
      animation: {
        'flicker': 'flicker 0.15s infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.98' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
}
