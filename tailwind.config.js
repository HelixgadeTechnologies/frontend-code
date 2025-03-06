/** @type {import('tailwindcss').Config} */

export default {
  content: ["./src/***/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-100": "#101928",
        "primary-200": "#003B99",
        "gray-100": "#D0D5DD",
        "gray-200": "#645D5D",
      },
    },
  },
  plugins: [],
};
