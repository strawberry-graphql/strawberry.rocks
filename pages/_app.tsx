import * as React from "react";
import { ThemeProvider } from "theme-ui";
import type { AppProps } from "next/app";
import Head from "next/head";
import theme from "../theme";
import components from "~/components/theme-ui";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css?family=Karla:,400,400i,700&amp;display=swap"
          rel="stylesheet"
        />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      {/* @ts-ignore components prop is missing in the type definition */}
      <ThemeProvider theme={theme} components={components}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
