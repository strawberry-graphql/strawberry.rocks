import * as React from "react";
import { Flex, Box } from "@theme-ui/components";

import SEO from "../components/seo";

const NotFoundPage = () => (
  <>
    <SEO title="404: Not found" />

    <Flex
      sx={{
        width: "100%",
        maxWidth: 1200,
        mx: "auto",
        flex: 1,
      }}
    >
      <Box sx={{ px: 4, pb: 6 }}>
        <h1>NOT FOUND</h1>
        <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
      </Box>
    </Flex>
  </>
);

export default NotFoundPage;
