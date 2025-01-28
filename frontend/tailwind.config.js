/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,tsx,ts,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        lexend: ["Lexend", "sans-serif"],
      },
      keyframes: {
        "slide-in": {
          "0%": { transform: "translateX(calc(100% + 1.5rem))" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-out": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(calc(100% + 1.5rem))" },
        },
      },
      animation: {
        "slide-in": "slide-in 0.3s ease-out",
        "slide-out": "slide-out 0.3s ease-out forwards",
      },
    },
  },
  plugins: [],
};
