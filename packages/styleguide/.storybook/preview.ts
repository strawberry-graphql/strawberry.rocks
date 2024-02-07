import { Separator } from "../src/components/separator/separator";
import "../src/styles/globals.css";
import { ThemedDocsContainer } from "./docs-container";
import localFont from "@next/font/local";

const ranade = localFont({
  src: [
    {
      path: "../fonts/Ranade-Variable.ttf",
      style: "normal",
    },
    {
      path: "../fonts/Ranade-VariableItalic.ttf",
      style: "italic",
    },
  ],
  variable: "--font-ranade",
});

const satoshi = localFont({
  src: [
    {
      path: "../fonts/Satoshi-Variable.ttf",
      style: "normal",
    },
    {
      path: "../fonts/Satoshi-VariableItalic.ttf",
      style: "italic",
    },
  ],
  variable: "--font-satoshi",
});

const jetbrainsMono = localFont({
  src: [
    {
      path: "../fonts/JetBrainsMono[wght].ttf",
      style: "normal",
    },
    {
      path: "../fonts/JetBrainsMono-Italic[wght].ttf",
      style: "italic",
    },
  ],
  variable: "--font-jetbrains-mono",
});

document.body.classList.add(ranade.variable);
document.body.classList.add(satoshi.variable);
document.body.classList.add(jetbrainsMono.variable);
document.body.classList.add("font-sans");

export const parameters = {
  backgrounds: { disable: true },

  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },

  docs: {
    // theme: themes.dark,
    container: ThemedDocsContainer,

    components: {
      hr: Separator,
    },
  },
};
