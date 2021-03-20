/** @jsx jsx */
import { Global, css } from "@emotion/react";
import { Box, Text } from "@theme-ui/components";
import { jsx } from "theme-ui";

import { SEO } from "~/components/seo";

export default function GoogleSummerOfCode() {
  return (
    <>
      <SEO title="Google Summer of Code - Ideas" />

      <Global
        styles={css`
          a.anchor.before {
            position: absolute;
            left: -1.5rem;
          }
        `}
      />

      <Box
        sx={{
          width: "100%",
          maxWidth: 1200,
          mx: "auto",
          flex: 1,
          pb: 6,
        }}
      >
        <Text>TODO</Text>
      </Box>
    </>
  );
}
