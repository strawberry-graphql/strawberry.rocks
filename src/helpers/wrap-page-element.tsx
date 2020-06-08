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

export const wrapPageElement = ({ element }) => (
  <>
    <Global styles={reset} />
    <Styled.root>
      <div id="wrap">
        <Header />

        {element}

        <NewsletterSection />
        <Footer />
      </div>
    </Styled.root>
  </>
);
