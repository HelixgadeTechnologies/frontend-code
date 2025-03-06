/** @type {import('tailwindcss').Config} */

export default {
  content: ["./src/***/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-100": "#101928",
        "primary-200": "#003B99",
        "primary-300": "#0F172A",
        "gray-100": "#D0D5DD",
        "gray-200": "#645D5D",
        "gray-300": "#475367",
      },
    },
  },
  plugins: [],
};
