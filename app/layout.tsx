import clsx from "clsx";
import type { Metadata } from "next";

import localFont from "next/font/local";

import "../styles/tailwind.css";

import { DarkModeScript } from "@strawberry-graphql/styleguide";
import "@strawberry-graphql/styleguide/dist/index.css";

export const metadata: Metadata = {
  description:
    "Strawberry GraphQL is a powerful and modern GraphQL framework for Python that allows developers to easily create robust and scalable APIs. With its intuitive and developer-friendly API, Strawberry makes it easy to define and query GraphQL schemas, while also providing advanced features such as type safety, code generation, and more.",
  keywords: [
    "Strawberry",
    "GraphQL",
    "Strawberry GraphQL",
    "API",
    "Python",
    "Code-first",
  ],
  themeColor: "#F7393D",
  twitter: {
    card: "summary_large_image",
    creator: "@strawberry_gql",
  },
};

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <DarkModeScript />
        <script
          defer
          data-domain="strawberry.rocks"
          src="/js/script.js"
        ></script>
      </head>
      <body
        className={clsx(
          ranade.variable,
          satoshi.variable,
          jetbrainsMono.variable,
          "font-sans antialiased"
        )}
      >
        {children}
      </body>
    </html>
  );
}
