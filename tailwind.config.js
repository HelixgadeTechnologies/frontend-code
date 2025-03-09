/** @type {import('tailwindcss').Config} */

export default {
  content: ["./src/***/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "off-white": "#F9FAFB",
        "off-white-2": "#F0F2F5",
        "off-white-3": "#F5F7FA",
        "primary-100": "#101928",
        "primary-200": "#003B99",
        "primary-300": "#0F172A",
        "primary-400": "#3792B7",
        "primary-500": "#1671D9",
        "gray-100": "#D0D5DD",
        "gray-200": "#645D5D",
        "gray-300": "#475367",
        "gray-400": "#667185",
        "gray-500": "#E4E7EC",
        "gray-600": "#525965",
        "gray-700": "#D7DBE2",
        "gray-8": "#E1E4E9",
        "gray-9": "#909CAD",
        "dark-1": "#1B1818",
        "dark-2": "#0A0C15",
        "dark-green-1": "#176448",
        "light-green": "#EFFAF6",
        "dark-orange": "#6E330C",
        "light-orange": "#FEF3EB",
      },
    },
  },
  plugins: [],
};
