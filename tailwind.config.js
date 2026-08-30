/** @type {import("tailwindcss").Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bakery: {
          50: "#fdf8f4",
          100: "#f9ede0",
          200: "#f2d8bf",
          300: "#e9be98",
          400: "#dc9c6d",
          500: "#cf7a43",
          600: "#bd6035",
          700: "#9c4a2c",
          800: "#7f3d29",
          900: "#683424",
          950: "#391910",
        },
        cream: {
          50: "#fffef9",
          100: "#fffbeb",
          200: "#fef3c7",
          300: "#fde68a",
        },
        berry: {
          500: "#e11d48",
          600: "#be123c",
        },
        matcha: {
          500: "#4d7c0f",
          600: "#3f6212",
        },
        choco: {
          600: "#451a03",
          700: "#3b1502",
          800: "#270e02",
          900: "#1a0800"
        }
      },
      fontFamily: {
        sans: ["Prompt", "Kanit", "system-ui", "sans-serif"],
      }
    },
  },
  plugins: [],
}
