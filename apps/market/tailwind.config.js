/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './_includes/**/*.{js,ts,jsx,tsx}',
    './_layouts/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        homeheaderpurple: 'rgba(49,48,113,0.22)',
        homeheadergray: 'rgba(26,25,25,0.22)'
      }
    },
  },
  plugins: [],
}
