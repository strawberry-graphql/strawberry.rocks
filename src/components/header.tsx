/** @jsx jsx */
import { jsx } from "theme-ui";
import { Link } from "@theme-ui/components";
import { useStaticQuery, graphql } from "gatsby";

import { HeaderQuery } from "./__generated__/HeaderQuery";

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
    <header
      sx={{
        padding: 2,
      }}
    >
      aaaaaaaaa
      <nav>
        <Link>About</Link>
        <Link>Docs</Link>
        <Link target="_blank" href={github.repository.url}>
          Github
        </Link>
      </nav>
      <h1>logo</h1>
      <Link variant="version" href="#!">
        {github.repository.releases.nodes[0].tagName}
      </Link>
    </header>
  );
};
