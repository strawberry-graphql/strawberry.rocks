import * as React from "react";
import { ThemeProvider } from "theme-ui";
import type { AppProps } from "next/app";
import theme from "../theme";
import components from "~/components/theme-ui";

export default function App({ Component, pageProps }: AppProps) {
  return (
    // @ts-ignore components prop is missing in the type definition
    <ThemeProvider theme={theme} components={components}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
