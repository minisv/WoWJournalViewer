/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wow-dark': '#0a0e27',
        'wow-blue': '#00aeff',
        'wow-gold': '#ffd100',
        'wow-purple': '#a335ee',
      },
    },
  },
  plugins: [],
}