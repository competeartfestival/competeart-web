/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#121212",
        primary: "#F07B1B",
        primaryDark: "#D84D17",
        primaryMid: "#F17C1C",
        burntRed: "#B02B0E",
        peach: "#FCAD68",
        yellow: "#FDAF22",
        offWhite: "#F9F7F6",
      },
      fontFamily: {
        primary: ["'TAN Nimbus'", "serif"],
        secondary: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
