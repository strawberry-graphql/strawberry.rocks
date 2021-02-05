/** @jsx jsx */
import { jsx, Box, BoxProps } from "theme-ui";

export const Section: React.FC<BoxProps> = ({ children, ...props }) => (
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
