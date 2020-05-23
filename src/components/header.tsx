/** @jsx jsx */
import { jsx } from "theme-ui";
import { Box, Flex } from "@theme-ui/components";
import { useStaticQuery, graphql } from "gatsby";

import { HeaderQuery } from "./__generated__/HeaderQuery";
import { Logo } from "./logo";
import { Link } from "./link";

export const Header: React.SFC = () => {
  const { github } = useStaticQuery<HeaderQuery>(graphql`
    query HeaderQuery {
      github {
        repository(owner: "strawberry-graphql", name: "strawberry") {
          url
          releases(last: 1) {
            nodes {
              tagName
            }
          }
        }
      }
    }
  `);

  return (
    <Box
      as="header"
      sx={{
        px: 3,
        py: 2,
        maxWidth: 1280,
        my: 2,
        mx: "auto",
        display: "grid",
        gridGap: 3,
        gridAutoFlow: ["row", "column"],
        gridTemplateColumns: "repeat(3, 1fr)",
      }}
    >
      <Flex
        sx={{
          alignItems: "center",
          justifyContent: "center",
          gridColumnStart: [1, 2],
          gridColumnEnd: [4, 3],
          order: [0, 1],
        }}
      >
        <Link variant="home" href="/">
          <Logo height="90" />
        </Link>
      </Flex>

      <Flex
        sx={{
          justifyContent: "flex-start",
          alignItems: "center",
          gridColumnStart: [1, 1],
          gridColumnEnd: [3, 2],
        }}
        as="nav"
      >
        <Link variant="nav" href="/docs/" partiallyActive={true}>
          Docs
        </Link>
        <Link variant="nav" target="_blank" href={github.repository.url}>
          Github
        </Link>
      </Flex>
      <Flex sx={{ justifyContent: "flex-end", alignItems: "center" }}>
        <Link
          variant="version"
          target="_blank"
          href="https://pypi.org/project/strawberry-graphql/"
        >
          {github.repository.releases.nodes[0].tagName}
        </Link>
      </Flex>
    </Box>
  );
};
