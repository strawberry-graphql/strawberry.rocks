/** @jsx jsx */
import { jsx } from "theme-ui";
import { useStaticQuery, graphql } from "gatsby";

import { Link } from "./link";
import { DocsNavigationQuery } from "./__generated__/DocsNavigationQuery";

export const DocsNavigation: React.SFC = () => {
  const {
    allFile: { edges },
  } = useStaticQuery<DocsNavigationQuery>(graphql`
    query DocsNavigationQuery {
      allFile(filter: { sourceInstanceName: { eq: "strawberry-repo" } }) {
        edges {
          node {
            childMdx {
              frontmatter {
                title
                path
              }
            }
          }
        }
      }
    }
  `);

  return (
    <nav>
      {edges.map(({ node }) => (
        <Link
          href={node.childMdx.frontmatter.path}
          key={node.childMdx.frontmatter.path}
        >
          {node.childMdx.frontmatter.title}
        </Link>
      ))}
    </nav>
  );
};
