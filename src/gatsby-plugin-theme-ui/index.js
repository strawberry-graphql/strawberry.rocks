import prismTheme from "@theme-ui/prism/presets/night-owl-light.json";

export default {
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  fonts: {
    body: "Px Grotesk, sans-serif",
    heading: "inherit",
    monospace: "Menlo, monospace",
  },
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 96],
  fontWeights: {
    body: 400,
    heading: 400,
    bold: 700,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125,
  },
  colors: {
    text: "#000",
    background: "#fff",
    primary: "#f7393d",
    secondary: "#FF9FA9",
    muted: "#FFCED3",
    accent: "#4a65ff",
  },
  links: {
    nav: {
      textDecoration: "none",
      color: "black",
      marginRight: 4,
      backgroundImage: "linear-gradient(red, red)",
      backgroundPosition: "0% 100%",
      backgroundRepeat: "no-repeat",
      backgroundSize: "0 2px",
      transition: "0.15s background-size ease-out",
      "&:hover": {
        backgroundSize: "100% 2px",
      },
    },
    version: {
      textDecoration: "none",
      backgroundColor: "secondary",
      color: "white",
      padding: 2,
    },
  },
  text: {
    hero: {
      color: "text",
      display: "inline",
      backgroundImage: "linear-gradient(red, red)",
      backgroundPosition: "0% 100%",
      backgroundRepeat: "no-repeat",
      backgroundSize: "100% 4px",
      fontSize: 40,
      lineHeight: "135.74%",
    },
  },
  styles: {
    root: {
      fontFamily: "body",
      lineHeight: "body",
      fontWeight: "body",
    },
    h1: {
      color: "text",
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
      my: "1em",
      fontSize: 5,
    },
    h2: {
      color: "text",
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
      my: "1em",
      fontSize: 4,
    },
    h3: {
      color: "text",
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
      my: "1em",
      fontSize: 3,
    },
    h4: {
      color: "text",
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
      my: "1em",
      fontSize: 2,
    },
    h5: {
      color: "text",
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
      my: "1em",
      fontSize: 1,
    },
    h6: {
      color: "text",
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
      my: "1em",
      fontSize: 0,
    },
    p: {
      color: "text",
      fontFamily: "body",
      fontWeight: "body",
      lineHeight: "body",
    },
    a: {
      color: "primary",
    },
    pre: {
      fontFamily: "monospace",
      overflowX: "auto",
      padding: 3,
      code: {
        color: "inherit",
      },
      ...prismTheme,
    },
    code: {
      fontFamily: "monospace",
      fontSize: "inherit",
    },
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: 0,
    },
    th: {
      textAlign: "left",
      borderBottomStyle: "solid",
    },
    td: {
      textAlign: "left",
      borderBottomStyle: "solid",
    },
    img: {
      maxWidth: "100%",
    },
  },
};
