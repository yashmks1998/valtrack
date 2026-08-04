/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tracker: {
          bg: '#0f1115',
          card: '#16181d',
          cardHover: '#1c1f26',
          border: 'rgba(255, 255, 255, 0.1)',
          red: '#ff4655',
          redHover: '#e03e4c',
          muted: '#8b8f98',
          green: '#22c55e',
          yellow: '#eab308',
          danger: '#ef4444',
          cyan: '#00f0ff',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        teko: ['Teko', 'sans-serif'],
        oswald: ['Oswald', 'sans-serif'],
      },
      boxShadow: {
        'glow-red': '0 0 25px rgba(255, 70, 85, 0.4)',
        'glow-cyan': '0 0 25px rgba(0, 240, 255, 0.3)',
      }
    },
  },
  plugins: [],
}
