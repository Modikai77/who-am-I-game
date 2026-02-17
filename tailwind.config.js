/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './lib/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          light: '#F6F1FF',
          dark: '#2D2A4A'
        },
        accent: {
          warm: '#FFB74D',
          coral: '#FF7676',
          mint: '#61D0B2',
          sky: '#63B4FF'
        }
      }
    }
  },
  plugins: []
}
