/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'spotify-green': '#1DB954',
        'spotify-dark': '#191414',
        'spotify-dark-gray': '#282828',
        'spotify-light-gray': '#B3B3B3',
        'spotify-light': '#E5E5E5',
        'spotify-border': '#333',
        'spotify-text-light': '#B3B3B3',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      boxShadow: {
        'spotify': '0 4px 8px rgba(0, 0, 0, 0.2)',
        'spotify-md': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'spotify-lg': '0 8px 16px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}
