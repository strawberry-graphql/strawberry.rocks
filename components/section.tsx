/** @jsx jsx */
import { Box, BoxProps } from "@theme-ui/components";
import { jsx } from "theme-ui";

export const Section: React.FunctionComponent<BoxProps> = ({
  children,
  ...props
}) => (
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
