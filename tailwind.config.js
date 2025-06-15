/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Permet d'activer le mode sombre via une classe CSS
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        sm: "640px", // Mobile
        md: "768px", // Tablette
        lg: "1024px", // Pc
      },
    },
  },
  plugins: [],
};
