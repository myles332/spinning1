/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-blue': '#0a192f',
        'button-blue': '#1e3a8a',
      },
      animation: {
        'spin-slow': 'spin-slow 3s linear infinite',
      },
    },
  },
  plugins: [],
};
