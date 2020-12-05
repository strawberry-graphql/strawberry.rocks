/** @jsx jsx */
import { Box } from "@theme-ui/components";
import { jsx } from "theme-ui";

export const Section: React.SFC = ({ children, ...props }) => (
  <Box {...props}>
    <Box
      sx={{
        my: 5,
        mx: "auto",
        maxWidth: 940,
        textAlign: "center",
      }}
    >
      {children}
    </Box>
  </Box>
);
