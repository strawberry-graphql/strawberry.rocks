import React from "react";
import { Styled } from "theme-ui";
import { Global, css } from "@emotion/core";
import { Header } from "../components/header";
import { NewsletterSection } from "../components/newsletter-section";
import { Footer } from "../components/footer";

const reset = css`
  * {
    margin: 0;
    padding: 0;
  }

  a {
    color: inherit;
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

export const wrapPageElement = ({ element }) => (
  <>
    <Global styles={reset} />
    <Styled.root>
      <Header />

      {element}

      <NewsletterSection />
      <Footer />
    </Styled.root>
  </>
);
