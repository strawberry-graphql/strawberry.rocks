import * as React from "react";
import { ThemeProvider } from "theme-ui";
import type { AppProps } from "next/app";
import Router from "next/router";
import Head from "next/head";
import { Styled } from "theme-ui";
import { Global, css } from "@emotion/core";

import theme from "../theme";
import components from "~/components/theme-ui";
import Header from "~/components/header";
import { NewsletterSection } from "~/components/newsletter-section";
import { Footer } from "~/components/footer";

import NProgress from "nprogress";
import "../styles/nprogress.css";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const reset = css`
  * {
    margin: 0;
    padding: 0;
  }

  a {
    color: inherit;
  }

  #wrap {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css?family=Karla:,400,400i,700&amp;display=swap"
          rel="stylesheet"
        />
      </Head>
      {/* @ts-ignore components prop is missing in the type definition */}
      <ThemeProvider theme={theme} components={components}>
        <Global styles={reset} />

        <Styled.root>
          <div id="wrap">
            <Header />

            <Component {...pageProps} />

            <NewsletterSection />
            <Footer />
          </div>
        </Styled.root>
      </ThemeProvider>
    </>
  );
}
