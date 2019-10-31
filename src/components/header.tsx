/** @jsx jsx */
import { jsx } from "theme-ui";
import { Link, Flex } from "@theme-ui/components";
import { useStaticQuery, graphql } from "gatsby";

import { HeaderQuery } from "./__generated__/HeaderQuery";
import { Logo } from "./logo";

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
    <Flex
      as="header"
      sx={{
        padding: 2,
        maxWidth: 1280,
        margin: 2,
        marginLeft: "auto",
        marginRight: "auto",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <nav>
        <Link variant="nav" href="/docs">
          Docs
        </Link>
        <Link variant="nav" target="_blank" href={github.repository.url}>
          Github
        </Link>
      </nav>
      <Link href="/">
        <Logo height="90" />
      </Link>
      <Link variant="version" href="#!">
        {github.repository.releases.nodes[0].tagName}
      </Link>
    </Flex>
  );
};
