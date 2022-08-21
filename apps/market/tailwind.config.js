/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './_includes/**/*.{js,ts,jsx,tsx}',
    './_layouts/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    backgroundImage: {
      "betacard": "url('/Cards/BetaCard.png')"
    },
    extend: {
      colors: {
        homeheaderpurple: 'rgba(49,48,113,0.22)',
        homeheadergray: 'rgba(26,25,25,0.22)'
      },
      animation: {
        'gradient-slide': 'gradient-x 2s ease infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
              'background-size':'200% 200%',
              'background-position': 'left center'
          },
          '50%': {
              'background-size':'200% 200%',
              'background-position': 'right center'
          }
        }
      },
    },

  },
  plugins: [],
}
