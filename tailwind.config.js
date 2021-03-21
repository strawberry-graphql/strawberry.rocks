module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "media",
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
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
