/** @jsx jsx */
import { Box } from "@theme-ui/components";
import { jsx } from "theme-ui";

import { Link } from "./link";

export const ExperimentalWarning = () => (
  <Box
    sx={{
      backgroundColor: "prismBackground",
      borderLeftColor: "primary",
      borderLeftWidth: 4,
      borderLeftStyle: "solid",
      padding: 3,
      my: 3,
    }}
  >
    <Box sx={{ fontWeight: "bold", mb: 2 }}>Caution:</Box>

    <Box as="p" sx={{ mb: 2 }}>
      This documentation refers to an experimental feature of Strawberry, these
      features may change significantly and without a warning before they become
      a part of the main strawberry API.
    </Box>

    <Box as="p">
      This documentation is aimed at early adopters and people who are curious.
      If you&apos;re interested in contributing to this feature{" "}
      <Link href="https://github.com/strawberry-graphql/strawberry/discussions">
        join the discussion on our GitHub page
      </Link>
      .
    </Box>
  </Box>
);
