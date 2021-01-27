const TEXT_COLOR_DARK = "#000000";
const TEXT_COLOR_LIGHT = "#ffffff";
const PRIMARY_COLOR = "#f7393d";
const ACCENT_COLOR = "#4a65ff";

export default {
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  fonts: {
    body: "Karla, sans-serif",
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

  useColorSchemeMediaQuery: true,

  colors: {
    text: TEXT_COLOR_DARK,
    background: "#fff",
    primary: PRIMARY_COLOR,
    codeBoxBorder: PRIMARY_COLOR,
    secondary: "#FF9FA9",
    muted: "#FFCED3",
    mutedLight: "#e9ecfc",
    accent: ACCENT_COLOR,
    backgroundDark: "#000000",
    textDark: TEXT_COLOR_LIGHT,

    // nightowl theme

    prismColor: "#403f53",
    prismBackground: "#FBFBFB",
    prismChanged: "#A2BFBF",
    prismDeleted: "rgba(239, 83, 80, 0.56)",
    prismInserted: "rgb(72, 118, 214)",
    prismComment: "rgb(152, 159, 177)",
    prismVariable: "rgb(201, 103, 101)",
    prismNumber: "rgb(170, 9, 130)",
    prismToken: "rgb(153, 76, 195)",
    prismClassName: "rgb(17, 17, 17)",
    prismOperator: "rgb(12, 150, 155)",
    prismBoolean: "rgb(188, 84, 84)",

    modes: {
      dark: {
        text: TEXT_COLOR_LIGHT,
        background: "#171717",
        backgroundDark: "#171717",
        primary: PRIMARY_COLOR,
        secondary: PRIMARY_COLOR,
        accent: "#4a65ff",
        codeBoxBorder: "#FFCED3",

        // nightowl theme

        prismColor: "#d6deeb",
        prismBackground: "rgb(26, 26, 26)",
        prismChanged: "rgb(162, 191, 252)",
        prismDeleted: "rgba(239, 83, 80, 0.56)",
        prismInserted: "#4a65ff",
        prismComment: "rgb(99, 119, 119)",
        prismVariable: "rgb(214, 222, 235)",
        prismNumber: "rgb(247, 140, 108)",
        prismToken: "rgb(130, 170, 255)",
        prismClassName: "rgb(255, 203, 139)",
        prismOperator: "rgb(127, 219, 202)",
        prismBoolean: "rgb(255, 88, 116)",
      },
    },
  },

  borders: {
    primary: `2px solid var(--theme-ui-colors-primary, ${PRIMARY_COLOR})`,
  },

  links: {
    home: {
      "&::after": {
        display: "none",
      },
    },
    nav: {
      textDecoration: "none",
      color: "text",
      marginRight: [0, 4],
      backgroundImage: `linear-gradient(${PRIMARY_COLOR}, ${PRIMARY_COLOR})`,
      backgroundPosition: "0% 100%",
      backgroundRepeat: "no-repeat",
      backgroundSize: "0 2px",
      transition: "0.15s background-size ease-out",
      "&.active": {
        backgroundSize: "100% 2px",
      },
      "&:hover": {
        backgroundSize: "100% 2px",
        color: "text",
      },
    },
    version: {
      textDecoration: "none",
      backgroundColor: "secondary",
      color: "white",
      padding: 2,
      "&:hover": {
        color: "text",
      },
    },
    feature: {
      "&:hover": {
        color: "primary",
      },
    },
    "docs-nav": {
      color: "primary",

      "&.active::after": {
        display: "inline-block",
        content: "'👈'",
        ml: 2,
      },
    },
    box: {
      p: 2,
      my: 3,
      textDecoration: "none",
      border: "2px solid",
      borderColor: "accent",
      width: "100%",
      "&:hover": {
        backgroundColor: "prismBackground",
      },
    },
  },
  text: {
    hero: {
      color: "text",
      display: "inline",
      backgroundImage: `linear-gradient(${PRIMARY_COLOR}, ${PRIMARY_COLOR})`,
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
      ".__permalink-h": {
        position: "absolute",
        left: "-1.5rem",
        color: "red",
        textDecoration: "none",
      },
    },
    h1: {
      color: "text",
      position: "relative",
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
      my: "1em",
      fontSize: 5,
    },
    h2: {
      color: "text",
      position: "relative",
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
      my: "1em",
      fontSize: 4,
      textDecoration: "underline",
      textDecorationThickness: 2,
      textDecorationColor: PRIMARY_COLOR,
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
      my: "1em",
      code: {
        color: TEXT_COLOR_DARK,
        backgroundColor: "muted",
        padding: 1,
        fontFamily: "body",
      },
    },
    ul: {
      my: "1em",
    },
    ol: {
      my: "1em",
    },
    li: {
      listStyle: "inside",
      "&::marker": {
        color: "primary",
      },
      code: {
        color: TEXT_COLOR_DARK,
        backgroundColor: "muted",
        padding: 1,
        fontFamily: "body",
      },
    },
    a: {
      textDecoration: "underline",
      textDecorationThickness: 2,
      textDecorationColor: PRIMARY_COLOR,

      "&:hover": {
        textDecorationColor: ACCENT_COLOR,
      },
    },
    blockquote: {
      backgroundColor: "prismBackground",
      borderLeftColor: "accent",
      borderLeftWidth: 4,
      borderLeftStyle: "solid",
      padding: 3,
      my: 3,
      p: {
        m: 0,
      },
    },
    pre: {
      fontFamily: "monospace",
      overflowX: "auto",
      padding: 3,
      border: "2px solid",
      borderColor: "codeBoxBorder",

      code: {
        color: "inherit",
      },

      color: "prismColor",
      backgroundColor: "prismBackground",
      ".changed": {
        color: "prismChanged",
        fontStyle: "italic",
      },
      ".deleted": {
        color: "prismDeleted",
        fontStyle: "italic",
      },
      ".inserted,.attr-name": {
        color: "prismInserted",
        fontStyle: "italic",
      },
      ".comment": {
        color: "",
        fontStyle: "italic",
      },
      ".string,.builtin,.char,.constant,.url": {
        color: "prismInserted",
      },
      ".variable": {
        color: "prismVariable",
      },
      ".number": {
        color: "prismNumber",
      },
      ".punctuation": {
        color: "prismToken",
      },
      ".function,.selector,.doctype": {
        color: "prismToken",
        fontStyle: "italic",
      },
      ".class-name": {
        color: "prismClassName",
      },
      ".tag": {
        color: "prismToken",
      },
      ".operator,.property,.keyword,.namespace": {
        color: "prismOperator",
      },
      ".boolean": {
        color: "prismBoolean",
      },
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
      borderWidth: 1,
      p: 2,
      borderBottomStyle: "solid",
    },
    td: {
      textAlign: "left",
      borderWidth: 1,
      p: 2,
      borderBottomStyle: "solid",
    },
    tr: {
      "&:nth-child(even)": {
        backgroundColor: "mutedLight",
      },
    },
    img: {
      maxWidth: "100%",
    },
  },
};
