/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#F9F8F6",
        ink: "#1C1917",
        muted: "#78716C",
        accent: "#C83E2B",
        gold: {
          deep: "#96742E",
          light: "#E3BD79",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "SF Pro Display",
          "Oriya MN",
          "BlinkMacSystemFont",
          "Segoe UI",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
