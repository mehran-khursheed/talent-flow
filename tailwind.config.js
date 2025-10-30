/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'spotify-dark': '#191414',
        'spotify-light-dark': '#282828',
        'spotify-green': '#1DB954',
        'spotify-light-gray': '#B3B3B3',
        'spotify-gray': '#7F7F7F',
      },
      boxShadow: {
        'neon-sm': '0 0 5px #06b6d4, 0 0 10px #06b6d4', // Cyan shadow
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [function({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-spotify-main': {
          'scrollbar-width': 'thin',
          'scrollbar-color': 'rgba(90, 90, 90, 0.6) rgba(30, 30, 30, 0.3)',
          '&::-webkit-scrollbar': {
            width: '12px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(30, 30, 30, 0.3)',
            borderRadius: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(90, 90, 90, 0.6)',
            borderRadius: '6px',
            border: '2px solid transparent',
            backgroundClip: 'padding-box',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(120, 120, 120, 0.8)',
            backgroundClip: 'padding-box',
          },
        },
      }
      addUtilities(newUtilities, ['responsive', 'hover'])
    }],
};
