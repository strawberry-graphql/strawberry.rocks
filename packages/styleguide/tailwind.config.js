// @ts-check
/** @type {import('tailwindcss').Config} */
// @ts-ignore
const { fontFamily } = require("tailwindcss/defaultTheme");

const colors = {
  greyscale: [
    {
      name: "Black",
      hex: "#0D0E12",
      key: "black",
    },
    {
      name: "G-900",
      hex: "#1F1F1F",
      key: "g-900",
    },

    {
      name: "G-700",
      hex: "#515254",
      key: "g-700",
    },
    {
      name: "G-500",
      hex: "#8B8B8D",
      key: "g-500",
    },
    {
      name: "G-400",
      hex: "#C5C5C6",
      key: "g-400",
    },
    {
      name: "G-100",
      hex: "#E2E2E3",
      key: "g-100",
    },
    {
      name: "G-50",
      hex: "#F0F1F1",
      key: "g-50",
    },
    {
      name: "White",
      hex: "#fff",
      key: "white",
    },
  ],
  accent: [
    {
      name: "Strawberry",
      hex: "#F7393D",
      key: "strawberry",
    },
    {
      name: "Yellow - D",
      hex: "#FFE500",
      key: "yellow",
    },
    {
      name: "Yellow - L",
      hex: "#FEAB0A",
      key: "yellow-light",
    },
    {
      name: "Green",
      hex: "#1EB589",
      key: "green",
    },
    {
      name: "Pink",
      hex: "#FF9FA9",
      key: "pink",
    },
    {
      name: "Blue",
      hex: "#0094FF",
      key: "blue",
    },
    {
      name: "Magenta",
      hex: "#EE0A78",
      key: "magenta",
    },
    {
      name: "Orange",
      hex: "#FE620A",
      key: "orange",
    },
  ],
  code: [
    {
      name: "C-Green",
      hex: "var(--code-color-green)",
      key: "code-green",
    },
    {
      name: "C-Blue",
      hex: "var(--code-color-blue)",
      key: "code-blue",
    },
    {
      name: "C-Purple",
      hex: "var(--code-color-purple)",
      key: "code-purple",
    },
    {
      name: "C-Pink",
      hex: "var(--code-color-pink)",
      key: "code-pink",
    },
    {
      name: "C-Orange",
      hex: "var(--code-color-orange)",
      key: "code-orange",
    },
  ],
  callout: [
    {
      name: "Tip",
      hex: "rgba(142, 210, 135, 0.2)",
      key: "callout-tip",
    },
    {
      name: "Warning",
      hex: "rgba(234, 173, 117, 0.2)",
      key: "callout-warning",
    },
    {
      name: "Note",
      hex: "rgba(174, 213, 251, 0.2)",
      key: "callout-note",
    },
  ],
};

const fonts = {
  display: "Ranade",
  sans: "Satoshi",
  mono: "Jetbrains Mono",
};

const typography = {
  display: [
    {
      name: "Display 1",
      font: "display",
      key: "display",
      size: "60px",
      weight: "700",
      lineHeight: "72px",
      small: {
        size: "44px",
        lineHeight: "52px",
      },
    },
  ],
  heading: [
    {
      font: "display",
      name: "Heading 1",
      key: "heading-1",
      size: "48px",
      weight: "700",
      lineHeight: "56px",
      small: {
        size: "36px",
        lineHeight: "44px",
      },
    },
    {
      font: "display",
      name: "Heading 2",
      key: "heading-2",
      size: "40px",
      weight: "700",
      lineHeight: "48px",
      small: {
        size: "32px",
        lineHeight: "40px",
      },
    },
    {
      font: "display",
      name: "Heading 3",
      key: "heading-3",
      size: "32px",
      weight: "700",
      lineHeight: "40px",
    },
    {
      font: "display",
      name: "Heading 4",
      key: "heading-4",
      size: "24px",
      weight: "700",
      lineHeight: "32px",
    },
  ],
  paragraph: [
    {
      font: "sans",
      name: "Paragraph",
      key: "paragraph",
      size: "20px",
      weight: "400",
      lineHeight: "28px",
      small: {
        size: "18px",
        lineHeight: "26px",
      },
    },
    {
      font: "sans",
      name: "Paragraph 2",
      key: "paragraph-2",
      size: "17px",
      weight: "400",
      lineHeight: "24px",
    },
  ],
  caption: [
    {
      font: "sans",
      name: "Caption",
      key: "caption",
      size: "14px",
      weight: "400",
      lineHeight: "20px",
    },
  ],
  label: [
    {
      font: "sans",
      name: "Label 1",
      key: "label",
      size: "16px",
      weight: "700",
      lineHeight: "24px",
    },
    {
      font: "sans",
      name: "Label 2",
      key: "label-2",
      size: "14px",
      weight: "700",
      lineHeight: "20px",
    },
  ],
  code: [
    {
      font: "mono",
      name: "Code",
      key: "code",
      size: "16px",
      weight: "400",
      lineHeight: "20px",
    },
  ],
};

const themeColors = Object.fromEntries(
  Object.values(colors).flatMap((colors) =>
    colors.map((color) => [color.key, color.hex])
  )
);

const themeFontSizes = Object.fromEntries(
  Object.values(typography).flatMap((typography) =>
    typography.flatMap((typography) => {
      const result = [[typography.key, typography.size]];

      // @ts-ignore
      if (typography.small) {
        // @ts-ignore
        result.push([`${typography.key}-s`, typography.small.size]);
      }

      return result;
    })
  )
);

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  fonts,
  colors,
  typography,

  darkMode: "class",

  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      inherit: "inherit",

      ...themeColors,
    },

    screens: {
      sm: "600px",
      md: "1024px",
      lg: "1280px",
      xl: "1920px",
      "2xl": "2240px",
    },

    spacing: {
      0: "0px",
      1: "1px",
      2: "2px",
      3: "3px",
      4: "4px",
      8: "8px",
      12: "12px",
      16: "16px",
      24: "24px",
      32: "32px",
      40: "40px",
      48: "48px",
      56: "56px",
      64: "64px",
      72: "72px",
      80: "80px",
    },

    fontSize: {
      base: "20px",
      ...themeFontSizes,
    },

    extend: {
      fontFamily: {
        sans: ["var(--font-satoshi)", ...fontFamily.sans],
        display: ["var(--font-ranade)", ...fontFamily.sans],
        mono: ["var(--font-jetbrains-mono)", ...fontFamily.mono],
      },
    },
  },

  plugins: [],
};
