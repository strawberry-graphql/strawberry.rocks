import React from "react";
import { Styled } from "theme-ui";
import { Global, css } from "@emotion/core";

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
    <Styled.root>{element}</Styled.root>
  </>
);
