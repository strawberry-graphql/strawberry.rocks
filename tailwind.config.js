module.exports = {
  mode: "jit",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Karla", "ui-sans", "system-ui"],
      mono: ["Source Code Pro", "Menlo", "Consolas", "Monaco", "monospace"],
      display: ["Karla"],
      body: ["Karla"],
    },
    extend: {
      zIndex: {
        "-10": "-10",
      },
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
