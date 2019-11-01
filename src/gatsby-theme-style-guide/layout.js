/** @jsx jsx */
import { jsx } from "theme-ui";

import { Box } from "@theme-ui/components";

const Layout = props => (
  <Box
    sx={{
      maxWidth: 1200,
      mx: "auto",
    }}
  >
    {props.children}
  </Box>
);

export default Layout;
