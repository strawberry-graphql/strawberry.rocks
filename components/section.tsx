/** @jsx jsx */
import { jsx, Box, BoxProps } from "theme-ui";

export const Section = ({ children, ...props }: BoxProps) => (
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
