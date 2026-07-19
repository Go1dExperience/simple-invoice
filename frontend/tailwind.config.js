/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0a1c3d",
        ink: "#061229",
        accent: "#ffbe2e",
        accentDeep: "#e0a413",
        canvas: "#f6f7f9",
      },
    },
  },
  plugins: [],
};
