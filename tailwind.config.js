/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // For React or Next.js
    "./public/index.html", // For CRA/Vite
  ],
  theme: {
    extend: {
      colors: {
        primary: "#d07bf1", // Optional: your custom theme color
      },
      fontFamily: {
        sans: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
