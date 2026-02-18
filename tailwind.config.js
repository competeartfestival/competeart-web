/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ["Poppins", "serif"],
        secondary: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
