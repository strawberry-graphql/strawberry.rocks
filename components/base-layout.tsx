import * as React from "react";
import { Styled } from "theme-ui";
import { Global, css } from "@emotion/core";
import Head from "next/head";
// import { Header } from "./header";
import { NewsletterSection } from "./newsletter-section";
import { Footer } from "./footer";

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

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css?family=Karla:,400,400i,700&amp;display=swap"
          rel="stylesheet"
        />
      </Head>
      <Global styles={reset} />
      <Styled.root>
        <div id="wrap">
          {/* <Header /> */}

          {children}

          <NewsletterSection />
          <Footer />
        </div>
      </Styled.root>
    </>
  );
}
